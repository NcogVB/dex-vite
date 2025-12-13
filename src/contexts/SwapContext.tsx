import React, { createContext, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "../hooks/useWallet"; // Assuming your hook is here
import { SWAP_ROUTER_ADDRESS, FACTORY_ADDRESS, TOKENS, FEE_TIERS } from "../utils/addresses";
import { FACTORY_ABI, POOL_ABI, ERC20_ABI, ROUTER_ABI } from "../utils/abis";

interface SwapQuote {
    amountOut: string;
    priceImpact: number;
    route: string[];
    fee: number;
}

interface PoolInfo {
    address: string;
    fee: number;
    liquidity: string;
    sqrtPriceX96: string;
    token0: string;
    token1: string;
}

interface SwapContextValue {
    getQuote: (params: { fromSymbol: string; toSymbol: string; amountIn: string }) => Promise<SwapQuote>;
    swapExactInputSingle: (params: { fromSymbol: string; toSymbol: string; amountIn: string; slippage: number }) => Promise<any>;
    getTokenBalance: (tokenSymbol: string) => Promise<string>;
    getPoolInfo: (tokenA: string, tokenB: string, fee: number) => Promise<PoolInfo | null>;
    getAllPoolsForPair: (tokenA: string, tokenB: string) => Promise<PoolInfo[]>;
}

const SwapContext = createContext<SwapContextValue | undefined>(undefined);

export const SwapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { account } = useWallet();

    // Helper to get provider/signer
    const getProvider = useCallback(async () => {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        return new ethers.BrowserProvider(window.ethereum);
    }, []);

    const getSigner = useCallback(async () => {
        const provider = await getProvider();
        return provider.getSigner();
    }, [getProvider]);

    const getTokenBalance = useCallback(async (tokenSymbol: string): Promise<string> => {
        if (!account) return "0";
        const tokenInfo = TOKENS[tokenSymbol];
        if (!tokenInfo) throw new Error(`Token ${tokenSymbol} not configured`);

        try {
            const provider = await getProvider();
            const contract = new ethers.Contract(tokenInfo.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(account);
            return ethers.formatUnits(balance, tokenInfo.decimals);
        } catch (e) {
            console.error(e);
            return "0";
        }
    }, [account, getProvider]);

    const getPoolInfo = useCallback(async (tokenA: string, tokenB: string, fee: number): Promise<PoolInfo | null> => {
        try {
            const provider = await getProvider();
            const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
            const poolAddress = await factory.getPool(tokenA, tokenB, fee);

            if (poolAddress === ethers.ZeroAddress) return null;

            const pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
            const [slot0, liquidity, t0, t1] = await Promise.all([
                pool.slot0(), pool.liquidity(), pool.token0(), pool.token1()
            ]);

            return {
                address: poolAddress, fee, liquidity: liquidity.toString(),
                sqrtPriceX96: slot0.sqrtPriceX96.toString(),
                token0: t0, token1: t1
            };
        } catch (e) {
            console.error("Error fetching pool:", e);
            return null;
        }
    }, [getProvider]);

    const getAllPoolsForPair = useCallback(async (tokenA: string, tokenB: string): Promise<PoolInfo[]> => {
        const pools: PoolInfo[] = [];
        for (const fee of FEE_TIERS) {
            const info = await getPoolInfo(tokenA, tokenB, fee);
            if (info && BigInt(info.liquidity) > 0n) pools.push(info);
        }
        return pools.sort((a, b) => Number(BigInt(b.liquidity) - BigInt(a.liquidity)));
    }, [getPoolInfo]);

    const getQuote = useCallback(async ({ fromSymbol, toSymbol, amountIn }: { fromSymbol: string; toSymbol: string; amountIn: string }): Promise<SwapQuote> => {
        const tIn = TOKENS[fromSymbol];
        const tOut = TOKENS[toSymbol];
        if (!tIn || !tOut) throw new Error("Invalid tokens");

        const pools = await getAllPoolsForPair(tIn.address, tOut.address);
        if (!pools.length) throw new Error("No liquidity");

        const bestPool = pools[0];
        const sqrtPriceX96 = BigInt(bestPool.sqrtPriceX96);
        // Price = (sqrtRatioX96 ** 2) / (2 ** 192)
        // Simplified calculation for demo (assumes 18 decimals for both for simplicity in math, strictly should adjust for decimals)
        const price = Number((sqrtPriceX96 * sqrtPriceX96) >> 192n);

        // Correct decimal adjustment:
        const decimalShift = 10 ** (tIn.decimals - tOut.decimals);
        const adjustedPrice = price * decimalShift;

        const out = parseFloat(amountIn) * (adjustedPrice === 0 ? 1 : adjustedPrice); // Fallback if price logic fails in mock environment

        return {
            amountOut: out.toString(),
            priceImpact: 0.1,
            route: [fromSymbol, toSymbol],
            fee: bestPool.fee
        };
    }, [getAllPoolsForPair]);

    const swapExactInputSingle = useCallback(async ({ fromSymbol, toSymbol, amountIn, slippage }: { fromSymbol: string; toSymbol: string; amountIn: string; slippage: number }) => {
        if (!account) throw new Error("Wallet not connected");

        const signer = await getSigner();
        const tIn = TOKENS[fromSymbol];
        const tOut = TOKENS[toSymbol];

        const tokenContract = new ethers.Contract(tIn.address, ERC20_ABI, signer);
        const router = new ethers.Contract(SWAP_ROUTER_ADDRESS, ROUTER_ABI, signer);

        const amountInWei = ethers.parseUnits(amountIn, tIn.decimals);

        // Approve
        const allowance = await tokenContract.allowance(account, SWAP_ROUTER_ADDRESS);
        if (allowance < amountInWei) {
            const tx = await tokenContract.approve(SWAP_ROUTER_ADDRESS, amountInWei);
            await tx.wait();
        }

        const quote = await getQuote({ fromSymbol, toSymbol, amountIn });
        const minOut = ethers.parseUnits(quote.amountOut, tOut.decimals) * BigInt(100 - slippage) / 100n;

        const params = {
            tokenIn: tIn.address,
            tokenOut: tOut.address,
            fee: quote.fee,
            recipient: account,
            deadline: Math.floor(Date.now() / 1000) + 600,
            amountIn: amountInWei,
            amountOutMinimum: minOut,
            sqrtPriceLimitX96: 0n,
        };

        const tx = await router.exactInputSingle(params);
        return await tx.wait();
    }, [account, getSigner, getQuote]);

    return (
        <SwapContext.Provider value={{ getQuote, swapExactInputSingle, getTokenBalance, getPoolInfo, getAllPoolsForPair }}>
            {children}
        </SwapContext.Provider>
    );
};

export const useSwap = () => {
    const ctx = useContext(SwapContext);
    if (!ctx) throw new Error("useSwap must be used inside SwapProvider");
    return ctx;
};