import { useState, useEffect, useCallback } from 'react';

interface Window {
    ethereum?: any;
}

const POLYGON_CHAIN_ID = '0x89'; // 137
const POLYGON_RPC = 'https://polygon-rpc.com/';

export const useWallet = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>('0.00');
    const [chainId, setChainId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const { ethereum } = window as unknown as Window;

    // Helper: Format hex balance
    const formatBalance = (hexBalance: string) => {
        if (!hexBalance || hexBalance === '0x') return '0.00';
        const value = parseInt(hexBalance, 16) / 1e18;
        return value.toFixed(4);
    };

    // Switch Network Logic
    const switchToPolygon = useCallback(async () => {
        if (!ethereum) return false;
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: POLYGON_CHAIN_ID }],
            });
            return true;
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: POLYGON_CHAIN_ID,
                            chainName: 'Polygon Mainnet',
                            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                            rpcUrls: [POLYGON_RPC],
                            blockExplorerUrls: ['https://polygonscan.com/'],
                        }],
                    });
                    return true;
                } catch (addError) {
                    console.error("Failed to add Polygon", addError);
                    return false;
                }
            }
            return false;
        }
    }, [ethereum]);

    // Fetch Balance
    const fetchBalance = useCallback(async (addr: string) => {
        if (ethereum && addr) {
            try {
                const balanceHex = await ethereum.request({
                    method: 'eth_getBalance',
                    params: [addr, 'latest'],
                });
                setBalance(formatBalance(balanceHex));
            } catch (err) {
                console.error("Error fetching balance", err);
            }
        }
    }, [ethereum]);

    // Main State Updater
    const updateState = useCallback(async (accounts: string[]) => {
        if (accounts.length > 0) {
            const currentChain = await ethereum.request({ method: 'eth_chainId' });
            setChainId(currentChain);
            if (currentChain !== POLYGON_CHAIN_ID) {
                const switched = await switchToPolygon();
                if (!switched) {

                }
            }

            setAccount(accounts[0]);
            await fetchBalance(accounts[0]);
        } else {
            setAccount(null);
            setBalance('0.00');
        }
    }, [ethereum, fetchBalance, switchToPolygon]);

    // Initial Load Check
    useEffect(() => {
        const init = async () => {
            if (ethereum) {
                const accounts = await ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await updateState(accounts);
                }
            }
        };
        init();
    }, [ethereum, updateState]);

    useEffect(() => {
        if (ethereum) {
            const handleAccountsChanged = (accounts: string[]) => updateState(accounts);
            const handleChainChanged = (chain: string) => {
                setChainId(chain);
                window.location.reload();
            };

            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);

            return () => {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
                ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [ethereum, updateState]);

    const connectWallet = async () => {
        if (!ethereum) return;
        setIsConnecting(true);
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            await updateState(accounts);
        } catch (err) {
            console.error(err);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0.00');
        setChainId(null);
    };

    const isPolygon = chainId === POLYGON_CHAIN_ID;

    return {
        account,
        balance,
        chainId,
        isPolygon,
        connectWallet,
        disconnectWallet,
        isConnecting
    };
};