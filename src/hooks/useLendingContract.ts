import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { LENDING_CONTRACT_ADDRESS, TOKENS } from '../utils/addresses';
import { LENDING_ABI, ERC20_ABI } from '../utils/abis';
import { BrowserProvider } from 'ethers';

export const useLendingContract = () => {
    const { account } = useWallet();
    const [provider, setProvider] = useState<BrowserProvider | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new BrowserProvider(window.ethereum));
        }
    }, []);

    const [stats, setStats] = useState({
        healthFactor: '0',
        borrowAPR: '0',
        supplyAPY: '0', 
        liquidationThreshold: '0', 
        maxLTV: '0', 
        collateralToken: '',
        collateralAmount: '0',
        debtToken: '',
        debtAmount: '0',
        collateralValue: '0'
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // Helper to get signer
    const getSigner = useCallback(async () => {
        if (!provider) throw new Error("No provider");
        return await provider.getSigner();
    }, [provider]);
    const fetchData = useCallback(async () => {
        if (!account || !provider) return;

        try {
            const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_ABI, provider);

            const [hf, borrowApr, supplyApy, liqThresh, ltv, colData, debtData, colValue] = await Promise.all([
                contract.getHealthFactor(account).catch(() => 0n),
                contract.getBorrowAPRPercent().catch(() => 0n),
                contract.getSupplyAPY(account).catch(() => 0n), // NEW
                contract.liquidationThreshold(),
                contract.maxLTV(),
                contract.collaterals(account),
                contract.debts(account),
                contract.getCollateralValue(account).catch(() => 0n)
            ]);

            const colSymbol = Object.keys(TOKENS).find(k => TOKENS[k].address.toLowerCase() === colData[0].toLowerCase()) || "UNK";
            const debtSymbol = Object.keys(TOKENS).find(k => TOKENS[k].address.toLowerCase() === debtData[0].toLowerCase()) || "UNK";

            setStats({
                healthFactor: ethers.formatUnits(hf, 18),
                borrowAPR: ethers.formatUnits(borrowApr, 18),
                supplyAPY: ethers.formatUnits(supplyApy, 18),
                liquidationThreshold: ethers.formatUnits(liqThresh, 18),
                maxLTV: ethers.formatUnits(ltv, 18),
                collateralToken: colSymbol,
                collateralAmount: ethers.formatUnits(colData[1], 18),
                debtToken: debtSymbol,
                debtAmount: ethers.formatUnits(debtData[1], 18),
                collateralValue: ethers.formatUnits(colValue, 18),
            });
        } catch (error) {
            console.error("Fetch data error:", error);
        }
    }, [account, provider]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const executeTransaction = async (action: string, tokenAddress: string, amount: string) => {
        if (!account) throw new Error("Wallet not connected");
        setIsProcessing(true);
        try {
            const signer = await getSigner();
            const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_ABI, signer);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            const weiAmount = ethers.parseUnits(amount, 18);

            if (action === 'deposit' || action === 'repay') {
                const allowance = await tokenContract.allowance(account, LENDING_CONTRACT_ADDRESS);
                if (allowance < weiAmount) {
                    await (await tokenContract.approve(LENDING_CONTRACT_ADDRESS, ethers.MaxUint256)).wait();
                }
            }

            let tx;
            if (action === 'deposit') tx = await contract.depositCollateral(tokenAddress, weiAmount);
            else if (action === 'withdraw') tx = await contract.withdrawCollateral(weiAmount);
            else if (action === 'borrow') tx = await contract.borrow(tokenAddress, weiAmount);
            else if (action === 'repay') tx = await contract.repay(weiAmount);

            await tx.wait();
            await fetchData();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return { stats, executeTransaction, isProcessing };
};