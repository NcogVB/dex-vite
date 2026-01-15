import { useAccount, useBalance, useDisconnect, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'wagmi/chains';

export const useWallet = () => {
    const { address, isConnecting } = useAccount();
    const chainId = useChainId();
    const { disconnect } = useDisconnect();
    const { openConnectModal } = useConnectModal();

    const { data: balanceData } = useBalance({
        address: address,
    });

    const isPolygon = chainId === polygonAmoy.id;

    const connectWallet = async () => {
        if (openConnectModal) {
            openConnectModal();
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    return {
        account: address || null,
        balance: balanceData ? Number(balanceData.formatted).toFixed(4) : '0.00',
        chainId,
        isPolygon,
        connectWallet,
        disconnectWallet,
        isConnecting
    };
};