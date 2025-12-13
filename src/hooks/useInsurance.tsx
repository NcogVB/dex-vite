import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { INSURANCE_CONTRACT_ADDRESS, TOKENS } from '../utils/addresses';
import { BrowserProvider } from 'ethers';
import { ERC20_ABI } from '../utils/abis';
const INSURANCE_ABI = [
    "function purchasePolicy(uint256 duration, uint256 coveragePct) external",
    "function submitClaim() external",
    "function getPremiumQuote(address user, uint256 duration, uint256 coveragePct) public view returns (uint256 premium, uint256 coverage, uint8 risk)",
    "function policies(address user) external view returns (bool isActive, uint8 riskClass, uint256 coverageAmount, address collateralToken, uint256 startTime, uint256 expiryTime, uint256 premiumPaid)"
];
export const useInsurance = () => {
    const { account } = useWallet();

    const [provider, setProvider] = useState<BrowserProvider | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new BrowserProvider(window.ethereum));
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [policy, setPolicy] = useState<any>(null);
    const [quote, setQuote] = useState({ premium: '0', coverage: '0', riskClass: 0 });

    const getSigner = useCallback(async () => {
        if (!provider) throw new Error("No provider");
        return await provider.getSigner();
    }, [provider]);

    // 1. Fetch Active Policy
    const fetchPolicy = useCallback(async () => {
        if (!account || !provider) return;
        try {
            const contract = new ethers.Contract(INSURANCE_CONTRACT_ADDRESS, INSURANCE_ABI, provider);
            const p = await contract.policies(account);

            if (p.isActive) {
                setPolicy({
                    isActive: true,
                    coverage: ethers.formatUnits(p.coverageAmount, 18),
                    expiry: new Date(Number(p.expiryTime) * 1000).toLocaleDateString(),
                    riskClass: ['Low', 'Medium', 'High'][p.riskClass] || 'Unknown'
                });
            } else {
                setPolicy(null);
            }
        } catch (error) {
            console.error("Fetch Policy Error:", error);
        }
    }, [account, provider]);

    // 2. Get Quote (Dynamic)
    const getQuote = useCallback(async (durationDays: number, coveragePct: number) => {
        if (!account || !provider) return;
        try {
            const contract = new ethers.Contract(INSURANCE_CONTRACT_ADDRESS, INSURANCE_ABI, provider);
            const durationSec = durationDays * 24 * 60 * 60;

            // Returns (premium, coverage, risk)
            const q = await contract.getPremiumQuote(account, durationSec, coveragePct);

            setQuote({
                premium: ethers.formatUnits(q.premium, 18),
                coverage: ethers.formatUnits(q.coverage, 18),
                riskClass: Number(q.risk)
            });
        } catch (error) {
            console.warn("Quote Error (User likely has no collateral):", error);
            setQuote({ premium: '0', coverage: '0', riskClass: 0 });
        }
    }, [account, provider]);

    // 3. Purchase Policy
    const buyPolicy = async (durationDays: number, coveragePct: number) => {
        setLoading(true);
        try {
            const signer = await getSigner();
            const insurance = new ethers.Contract(INSURANCE_CONTRACT_ADDRESS, INSURANCE_ABI, signer);
            const usdc = new ethers.Contract(TOKENS.USDC.address, ERC20_ABI, signer); // Ensure TOKENS.USDC is correct

            const durationSec = durationDays * 24 * 60 * 60;

            // Re-fetch exact premium for approval
            const q = await insurance.getPremiumQuote(account, durationSec, coveragePct);
            const premiumWei = q.premium;

            // Approve USDC
            const allowance = await usdc.allowance(account, INSURANCE_CONTRACT_ADDRESS);
            if (allowance < premiumWei) {
                const txApp = await usdc.approve(INSURANCE_CONTRACT_ADDRESS, ethers.MaxUint256);
                await txApp.wait();
            }

            // Buy
            const tx = await insurance.purchasePolicy(durationSec, coveragePct);
            await tx.wait();

            await fetchPolicy(); // Refresh UI
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 4. Submit Claim
    const claim = async () => {
        setLoading(true);
        try {
            const signer = await getSigner();
            const insurance = new ethers.Contract(INSURANCE_CONTRACT_ADDRESS, INSURANCE_ABI, signer);
            const tx = await insurance.submitClaim();
            await tx.wait();
            await fetchPolicy();
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Init load
    useEffect(() => { fetchPolicy(); }, [fetchPolicy]);

    return { policy, quote, getQuote, buyPolicy, claim, loading };
};