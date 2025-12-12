import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

const CONTRACT_ADDRESS = "0x..."; // REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS

const LENDING_ABI = [
    "function depositCollateral(address token, uint256 amount) external",
    "function withdrawCollateral(uint256 amount) external",
    "function borrow(address borrowToken, uint256 amount) external",
    "function repay(uint256 amount) external",
    "function getHealthFactor(address user) external view returns (uint256)",
    "function getBorrowAPRPercent() external view returns (uint256)",
    "function collaterals(address user) external view returns (address token, uint256 amount)",
    "function debts(address user) external view returns (address token, uint256 principal, uint256 interestIndex, uint256 lastAccrued)",
    "function getCollateralValue(address user) external view returns (uint256)"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
];

export const useLendingContract = () => {
    const { account } = useWallet();
    const [stats, setStats] = useState({
        healthFactor: '0',
        borrowAPR: '0',
        collateralToken: '',
        collateralAmount: '0',
        debtToken: '',
        debtAmount: '0',
        collateralValue: '0'
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const getProviderAndSigner = useCallback(async () => {
        if (!window.ethereum) return null;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return { provider, signer };
    }, []);

    const fetchData = useCallback(async () => {
        if (!account) return;
        const core = await getProviderAndSigner();
        if (!core) return;

        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, LENDING_ABI, core.provider);
            
            const [hf, apr, colData, debtData, colValue] = await Promise.all([
                contract.getHealthFactor(account).catch(() => BigInt(0)),
                contract.getBorrowAPRPercent().catch(() => BigInt(0)),
                contract.collaterals(account),
                contract.debts(account),
                contract.getCollateralValue(account).catch(() => BigInt(0))
            ]);

            setStats({
                healthFactor: ethers.formatUnits(hf, 18),
                borrowAPR: ethers.formatUnits(apr, 18), 
                collateralToken: colData[0],
                collateralAmount: ethers.formatUnits(colData[1], 18), // Assuming 18 decimals
                debtToken: debtData[0],
                debtAmount: ethers.formatUnits(debtData[1], 18), // Assuming 18 decimals
                collateralValue: ethers.formatUnits(colValue, 18)
            });
        } catch (error) {
            console.error("Fetch data error:", error);
        }
    }, [account, getProviderAndSigner]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const executeTransaction = async (
        action: 'deposit' | 'withdraw' | 'borrow' | 'repay',
        tokenAddress: string,
        amount: string
    ) => {
        if (!account) throw new Error("Wallet not connected");
        setIsProcessing(true);
        
        try {
            const core = await getProviderAndSigner();
            if (!core) throw new Error("No provider");

            const contract = new ethers.Contract(CONTRACT_ADDRESS, LENDING_ABI, core.signer);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, core.signer);
            const weiAmount = ethers.parseUnits(amount, 18); // Assume 18 decimals

            if (action === 'deposit' || action === 'repay') {
                const allowance = await tokenContract.allowance(account, CONTRACT_ADDRESS);
                if (allowance < weiAmount) {
                    const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.MaxUint256);
                    await approveTx.wait();
                }
            }

            let tx;
            if (action === 'deposit') {
                tx = await contract.depositCollateral(tokenAddress, weiAmount);
            } else if (action === 'withdraw') {
                tx = await contract.withdrawCollateral(weiAmount);
            } else if (action === 'borrow') {
                tx = await contract.borrow(tokenAddress, weiAmount);
            } else if (action === 'repay') {
                tx = await contract.repay(weiAmount);
            }

            await tx.wait();
            await fetchData();
            return tx.hash;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return { 
        stats, 
        executeTransaction,
        isProcessing
    };
};