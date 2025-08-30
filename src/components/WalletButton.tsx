// components/WalletButton.tsx
import React, { useState } from 'react'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'

interface WalletButtonProps {
    className?: string
    variant?: 'default' | 'compact'
}

const WalletButton: React.FC<WalletButtonProps> = ({
    className = '',
    variant = 'default',
}) => {
    const { isConnected, address, walletType, openModal, disconnect } =
        useWallet()
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    // Format address for display
    const formatAddress = (addr: string): string => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    // Copy address to clipboard
    const copyAddress = async (): Promise<void> => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address)
                // You can add a toast notification here
                console.log('Address copied to clipboard')
            } catch (err) {
                console.error('Failed to copy address:', err)
            }
        }
    }

    // Open address in block explorer
    const viewOnExplorer = (): void => {
        if (address) {
            const explorerUrl = `https://etherscan.io/address/${address}`
            window.open(explorerUrl, '_blank')
        }
    }

    // Handle disconnect
    const handleDisconnect = (): void => {
        disconnect()
        setIsDropdownOpen(false)
    }

    if (!isConnected) {
        return (
            <button
                onClick={openModal}
                className={`flex cursor-pointer items-center space-x-2 bg-[#3DBEA3] text-white font-medium text-base leading-[17.6px] px-[16px] py-4 rounded-full hover:bg-[#2A8576] transition-colors duration-200 ${className}`}
            >
                <Wallet className="w-5 h-5" />
                <span>Connect wallet</span>
            </button>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-2 bg-green-100 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200 transition-colors duration-200 ${className}`}
                >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{formatAddress(address!)}</span>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                    {walletType === 'metamask'
                                        ? 'MetaMask'
                                        : 'WalletConnect'}
                                </p>
                                <p className="text-sm font-mono text-gray-900 mt-1">
                                    {address}
                                </p>
                            </div>

                            <button
                                onClick={copyAddress}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Address
                            </button>

                            <button
                                onClick={viewOnExplorer}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View on Explorer
                            </button>

                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <button
                                    onClick={handleDisconnect}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="relative cursor-pointer">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-2 bg-green-100 text-green-800 font-medium text-base leading-[17.6px] px-[16px] py-4 rounded-full hover:bg-green-200 transition-colors duration-200 ${className}`}
            >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{formatAddress(address!)}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                        Connected with{' '}
                                        {walletType === 'metamask'
                                            ? 'MetaMask'
                                            : 'WalletConnect'}
                                    </p>
                                    <p className="text-sm font-mono text-gray-900 mt-1">
                                        {address}
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="py-2">
                            <button
                                onClick={copyAddress}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Address
                            </button>

                            <button
                                onClick={viewOnExplorer}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View on Etherscan
                            </button>
                        </div>

                        {/* Disconnect */}
                        <div className="border-t border-gray-100 pt-2">
                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect Wallet
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default WalletButton
