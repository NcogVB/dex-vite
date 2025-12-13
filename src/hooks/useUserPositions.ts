import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { POSITION_MANAGER_ADDRESS, TOKENS } from '../utils/addresses';
import { POSITION_MANAGER_MINIMAL_ABI } from '../utils/abis';
import { BrowserProvider } from 'ethers';

export interface PositionInfo {
    tokenId: string;
    token0: string;
    token1: string;
    fee: number;
    liquidity: string;
    symbol0: string;
    symbol1: string;
}

export const useUserPositions = () => {
    const { account } = useWallet();
    const [positions, setPositions] = useState<PositionInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new BrowserProvider(window.ethereum));
        }
    }, []);


    const fetchPositions = useCallback(async () => {
        if (!account || !provider) return;

        setLoading(true);
        try {
            const pm = new ethers.Contract(POSITION_MANAGER_ADDRESS, POSITION_MANAGER_MINIMAL_ABI, provider);

            // 1. Get number of NFTs owned by user
            const balance = await pm.balanceOf(account);
            if (Number(balance) === 0) {
                setPositions([]);
                return;
            }

            const fetchedPositions: PositionInfo[] = [];

            // 2. Loop through indices to get Token IDs
            for (let i = 0; i < Number(balance); i++) {
                const tokenId = await pm.tokenOfOwnerByIndex(account, i);
                const pos = await pm.positions(tokenId);

                // 3. Resolve Symbols (Check global config first, else generic)
                const t0 = Object.values(TOKENS).find(t => t.address.toLowerCase() === pos.token0.toLowerCase());
                const t1 = Object.values(TOKENS).find(t => t.address.toLowerCase() === pos.token1.toLowerCase());

                // Get symbol keys
                const s0 = t0 ? Object.keys(TOKENS).find(k => TOKENS[k].address.toLowerCase() === pos.token0.toLowerCase()) : "UNK";
                const s1 = t1 ? Object.keys(TOKENS).find(k => TOKENS[k].address.toLowerCase() === pos.token1.toLowerCase()) : "UNK";

                if (pos.liquidity > 0n) { // Optional: Filter out closed positions
                    fetchedPositions.push({
                        tokenId: tokenId.toString(),
                        token0: pos.token0,
                        token1: pos.token1,
                        fee: Number(pos.fee),
                        liquidity: pos.liquidity.toString(),
                        symbol0: s0 || "UNK",
                        symbol1: s1 || "UNK"
                    });
                }
            }

            setPositions(fetchedPositions);
        } catch (error) {
            console.error("Error fetching positions:", error);
        } finally {
            setLoading(false);
        }
    }, [account, provider]);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);

    return { positions, loading, refresh: fetchPositions };
};