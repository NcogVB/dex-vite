// src/context/SwapContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import SwapRouterABI from "../ABI/SwapRouter.json";

// Contract addresses
const SWAP_ROUTER_ADDRESS = "0x88F36b3c3704406f1Ae5A921a8727905f0F2bC4F";
const FACTORY_ADDRESS = "0x5830423Fb4A3010f5546D5FBF68398B11c99709D";

// Token addresses with proper configuration
const TOKENS: Record<string, { address: string; decimals: number }> = {
    USDC: { address: "0x1000cCa12d1360CE757734270f8a457127A93DaA", decimals: 18 },
    USDT: { address: "0x6082626c05B1aDbb6Dea0750788e60b83A88f41f", decimals: 18 },
};

// ABI definitions
const FACTORY_ABI = [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
];

const POOL_ABI = [
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
    "function liquidity() external view returns (uint128)",
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "function name() external view returns (string)",
];

// Fee tiers
const FEE_TIERS = [500, 3000, 10000]; // 0.05%, 0.3%, 1%

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
    account: string | null;
    connect: () => Promise<void>;
    getQuote: (params: {
        fromSymbol: string;
        toSymbol: string;
        amountIn: string;
    }) => Promise<SwapQuote>;
    swapExactInputSingle: (params: {
        fromSymbol: string;
        toSymbol: string;
        amountIn: string;
        slippage: number;
    }) => Promise<any>;
    getTokenBalance: (tokenSymbol: string) => Promise<string>;
    getPoolInfo: (
        tokenA: string,
        tokenB: string,
        fee: number
    ) => Promise<PoolInfo | null>;
    getAllPoolsForPair: (
        tokenA: string,
        tokenB: string
    ) => Promise<PoolInfo[]>;
}

const SwapContext = createContext<SwapContextValue | undefined>(undefined);

export const SwapProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const connect = async () => {
        if (!(window as any).ethereum) throw new Error("MetaMask not found");
        const prov = new ethers.BrowserProvider((window as any).ethereum);
        await prov.send("eth_requestAccounts", []);
        const sig = await prov.getSigner();
        const addr = await sig.getAddress();
        setProvider(prov);
        setSigner(sig);
        setAccount(addr);
    };

    const getPoolInfo = async (
        tokenA: string,
        tokenB: string,
        fee: number
    ): Promise<PoolInfo | null> => {
        if (!provider) throw new Error("Provider not connected");

        try {
            const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
            const poolAddress = await factory.getPool(tokenA, tokenB, fee);

            if (poolAddress === ethers.ZeroAddress) {
                return null;
            }

            const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
            const [slot0Data, liquidity, token0, token1] = await Promise.all([
                poolContract.slot0(),
                poolContract.liquidity(),
                poolContract.token0(),
                poolContract.token1(),
            ]);

            return {
                address: poolAddress,
                fee,
                liquidity: liquidity.toString(),
                sqrtPriceX96: slot0Data.sqrtPriceX96.toString(),
                token0,
                token1,
            };
        } catch (error) {
            console.error(`Error getting pool info for fee ${fee}:`, error);
            return null;
        }
    };

    const getAllPoolsForPair = async (
        tokenA: string,
        tokenB: string
    ): Promise<PoolInfo[]> => {
        const pools: PoolInfo[] = [];
        for (const fee of FEE_TIERS) {
            const poolInfo = await getPoolInfo(tokenA, tokenB, fee);
            if (poolInfo && BigInt(poolInfo.liquidity) > 0n) {
                pools.push(poolInfo);
            }
        }
        return pools.sort(
            (a, b) => Number(BigInt(b.liquidity) - BigInt(a.liquidity))
        );
    };

    const getTokenBalance = async (tokenSymbol: string): Promise<string> => {
        if (!provider || !account) throw new Error("Not connected");

        const tokenInfo = TOKENS[tokenSymbol];
        if (!tokenInfo) throw new Error("Token not configured");

        try {
            const tokenContract = new ethers.Contract(
                tokenInfo.address,
                ERC20_ABI,
                provider
            );
            const balance = await tokenContract.balanceOf(account);
            return ethers.formatUnits(balance, tokenInfo.decimals);
        } catch (error) {
            console.error(`Error getting balance for ${tokenSymbol}:`, error);
            return "0";
        }
    };

    // Manual quote from pool sqrtPriceX96
    const getQuote = async ({
        fromSymbol,
        toSymbol,
        amountIn,
    }: {
        fromSymbol: string;
        toSymbol: string;
        amountIn: string;
    }): Promise<SwapQuote> => {
        if (!provider) throw new Error("Not connected");

        const tokenInInfo = TOKENS[fromSymbol];
        const tokenOutInfo = TOKENS[toSymbol];
        if (!tokenInInfo || !tokenOutInfo) throw new Error("Token not configured");

        const pools = await getAllPoolsForPair(
            tokenInInfo.address,
            tokenOutInfo.address
        );

        if (pools.length === 0) throw new Error("No liquidity pools found");

        const bestPool = pools[0];

        // Compute price from sqrtPriceX96
        // Price = (sqrtPriceX96 ** 2) / 2**192 (token1/token0)
        const sqrtPriceX96 = BigInt(bestPool.sqrtPriceX96);
        const priceX192 = sqrtPriceX96 * sqrtPriceX96;
        const price = Number(priceX192 >> 192n);

        // For stable pair assume 1:1, fallback approximate
        const inputAmount = parseFloat(amountIn);
        const outputAmount = inputAmount * (price === 0 ? 1 : price);

        return {
            amountOut: outputAmount.toString(),
            priceImpact: 0.1, // dummy simplified
            route: [fromSymbol, toSymbol],
            fee: bestPool.fee,
        };
    };

    const swapExactInputSingle = async ({
        fromSymbol,
        toSymbol,
        amountIn,
        slippage,
    }: {
        fromSymbol: string;
        toSymbol: string;
        amountIn: string;
        slippage: number;
    }) => {
        if (!signer || !account) throw new Error("Not connected");

        const tokenInInfo = TOKENS[fromSymbol];
        const tokenOutInfo = TOKENS[toSymbol];
        if (!tokenInInfo || !tokenOutInfo) throw new Error("Token not configured");

        const tokenInContract = new ethers.Contract(
            tokenInInfo.address,
            ERC20_ABI,
            signer
        );
        const router = new ethers.Contract(
            SWAP_ROUTER_ADDRESS,
            SwapRouterABI.abi,
            signer
        );

        const amtInWei = ethers.parseUnits(amountIn, tokenInInfo.decimals);
        const currentAllowance = await tokenInContract.allowance(
            account,
            SWAP_ROUTER_ADDRESS
        );
        if (currentAllowance < amtInWei) {
            const approveTx = await tokenInContract.approve(
                SWAP_ROUTER_ADDRESS,
                amtInWei
            );
            const receipt = await approveTx.wait();
            if (!receipt || receipt.status !== 1) throw new Error("Token approval failed");
        }

        const quote = await getQuote({ fromSymbol, toSymbol, amountIn });
        const amountOutWei = ethers.parseUnits(
            quote.amountOut,
            tokenOutInfo.decimals
        );

        const minOutWei =
            (amountOutWei * BigInt(100 - slippage)) / BigInt(100);

        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

        const params = {
            tokenIn: tokenInInfo.address,
            tokenOut: tokenOutInfo.address,
            fee: quote.fee,
            recipient: account!,
            deadline,
            amountIn: amtInWei,
            amountOutMinimum: minOutWei,
            sqrtPriceLimitX96: 0n,
        };

        const tx = await router.exactInputSingle(params, { gasLimit: 300000 });
        const receipt = await tx.wait();
        return receipt;
    };

    useEffect(() => {
        if ((window as any).ethereum) {
            (async () => {
                try {
                    const prov = new ethers.BrowserProvider((window as any).ethereum);
                    const accounts = await prov.send("eth_accounts", []);
                    if (accounts.length) {
                        const sig = await prov.getSigner();
                        setProvider(prov);
                        setSigner(sig);
                        setAccount(accounts[0]);
                    }
                } catch (error) {
                    console.log("Auto-connect failed:", error);
                }
            })();
        }
    }, []);

    return (
        <SwapContext.Provider
            value={{
                account,
                connect,
                getQuote,
                swapExactInputSingle,
                getTokenBalance,
                getPoolInfo,
                getAllPoolsForPair,
            }}
        >
            {children}
        </SwapContext.Provider>
    );
};

export const useSwap = () => {
    const ctx = useContext(SwapContext);
    if (!ctx) throw new Error("useSwap must be used inside SwapProvider");
    return ctx;
};
