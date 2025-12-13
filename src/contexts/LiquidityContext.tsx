import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { ethers, MaxUint256, BrowserProvider } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";
import { useWallet } from "../hooks/useWallet";
import { ERC20_ABI, POSITION_MANAGER_MINIMAL_ABI, UNISWAP_V3_POOL_ABI } from "../utils/abis";
import { POSITION_MANAGER_ADDRESS, TOKENS } from "../utils/addresses";

interface LiquidityContextValue {
    addLiquidity: (opts: { poolAddress: string; tokenA: string; tokenB: string; amountA: string; amountB: string }) => Promise<{ txHash: string } | null>;
    removeLiquidity: (tokenId: number, percentage: number) => Promise<void>;
    loading: boolean;
}

const LiquidityContext = createContext<LiquidityContextValue | undefined>(undefined);

export const LiquidityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { account } = useWallet(); // Use the shared wallet hook
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new BrowserProvider(window.ethereum));
        }
    }, []);

    // Helper to get signer safely
    const getSigner = useCallback(async () => {
        if (!provider || !account) throw new Error("Wallet not connected");
        return provider.getSigner();
    }, [provider, account]);

    const addLiquidity = useCallback(async ({ poolAddress, tokenA, tokenB, amountA, amountB }: { poolAddress: string; tokenA: string; tokenB: string; amountA: string; amountB: string }) => {
        setLoading(true);
        try {
            const signer = await getSigner();
            const signerAddress = await signer.getAddress();

            // 1. Initialize Contracts
            const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider);
            const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
            const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);
            const posManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, POSITION_MANAGER_MINIMAL_ABI, signer);

            // 2. Fetch Pool Data
            const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
                poolContract.tickSpacing(), poolContract.fee(), poolContract.liquidity(), poolContract.slot0()
            ]);

            // 3. Prepare SDK Objects
            const chainId = 11155111; // Or fetch from provider.getNetwork()
            // Try to find known token decimals, default to 18
            const getDecimals = (addr: string) => Object.values(TOKENS).find(t => t.address.toLowerCase() === addr.toLowerCase())?.decimals || 18;

            const tokenObjA = new Token(chainId, tokenA, getDecimals(tokenA), "A", "A");
            const tokenObjB = new Token(chainId, tokenB, getDecimals(tokenB), "B", "B");

            // Sort tokens
            const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
                ? [tokenObjA, tokenObjB]
                : [tokenObjB, tokenObjA];

            const pool = new Pool(
                token0, token1, Number(fee),
                slot0[0].toString(), liquidity.toString(), Number(slot0[1])
            );

            // 4. Calculate Position
            const rawAmtA = ethers.parseUnits(amountA, tokenObjA.decimals);
            const rawAmtB = ethers.parseUnits(amountB, tokenObjB.decimals);

            const tickLower = nearestUsableTick(pool.tickCurrent, Number(tickSpacing)) - Number(tickSpacing) * 2;
            const tickUpper = nearestUsableTick(pool.tickCurrent, Number(tickSpacing)) + Number(tickSpacing) * 2;

            const position = Position.fromAmounts({
                pool, tickLower, tickUpper,
                amount0: token0.address === tokenA ? rawAmtA.toString() : rawAmtB.toString(),
                amount1: token1.address === tokenB ? rawAmtB.toString() : rawAmtA.toString(),
                useFullPrecision: true
            });

            const amt0Desired = BigInt(position.mintAmounts.amount0.toString());
            const amt1Desired = BigInt(position.mintAmounts.amount1.toString());

            // 5. Approvals
            const [allowA, allowB] = await Promise.all([
                tokenAContract.allowance(signerAddress, POSITION_MANAGER_ADDRESS),
                tokenBContract.allowance(signerAddress, POSITION_MANAGER_ADDRESS)
            ]);

            // Map desired amounts back to original tokens A/B for approval check
            const neededA = token0.address === tokenA ? amt0Desired : amt1Desired;
            const neededB = token1.address === tokenB ? amt1Desired : amt0Desired;

            if (allowA < neededA) await (await tokenAContract.approve(POSITION_MANAGER_ADDRESS, MaxUint256)).wait();
            if (allowB < neededB) await (await tokenBContract.approve(POSITION_MANAGER_ADDRESS, MaxUint256)).wait();

            // 6. Mint
            const params = {
                token0: token0.address,
                token1: token1.address,
                fee: fee,
                tickLower, tickUpper,
                amount0Desired: amt0Desired,
                amount1Desired: amt1Desired,
                amount0Min: 0, amount1Min: 0, // Slippage 0 for dev
                recipient: signerAddress,
                deadline: Math.floor(Date.now() / 1000) + 600
            };

            console.log("Minting...", params);
            const tx = await posManager.mint(params, { gasLimit: 3000000 });
            const receipt = await tx.wait();
            return { txHash: receipt.hash };

        } catch (err: any) {
            console.error("Add Liquidity Error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [provider, getSigner]);

    const removeLiquidity = useCallback(async (tokenId: number, percentage: number) => {
        setLoading(true);
        try {
            const signer = await getSigner();
            const user = await signer.getAddress();
            const posManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, POSITION_MANAGER_MINIMAL_ABI, signer);

            const pos = await posManager.positions(tokenId);
            const liquidityToRemove = (pos[7] * BigInt(percentage)) / 100n;

            // Decrease
            const tx1 = await posManager.decreaseLiquidity({
                tokenId, liquidity: liquidityToRemove,
                amount0Min: 0, amount1Min: 0,
                deadline: Math.floor(Date.now() / 1000) + 600
            });
            await tx1.wait();

            // Collect
            const MAX_UINT128 = (2n ** 128n - 1n).toString();
            const tx2 = await posManager.collect({
                tokenId, recipient: user,
                amount0Max: MAX_UINT128, amount1Max: MAX_UINT128
            });
            await tx2.wait();
            console.log("Removed & Collected");
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [getSigner]);

    return (
        <LiquidityContext.Provider value={{ addLiquidity, removeLiquidity, loading }}>
            {children}
        </LiquidityContext.Provider>
    );
};

export const useLiquidity = () => {
    const ctx = useContext(LiquidityContext);
    if (!ctx) throw new Error("useLiquidity must be used within LiquidityProvider");
    return ctx;
};