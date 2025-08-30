import React, { useState, useCallback } from 'react'

interface LiquidityData {
    poolTokens: number
    usdtAmount: number
    ethAmount: number
    shareOfPool: number
    reward: number | null
}

const ConverterPool: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'exchange' | 'pool'>('pool')
    const [liquidityData, setLiquidityData] = useState<LiquidityData>({
        poolTokens: 0.00000001009,
        usdtAmount: 1.05335,
        ethAmount: 0.0000968228,
        shareOfPool: 0.71,
        reward: null,
    })
    const [isAddingToMetamask, setIsAddingToMetamask] = useState(false)
    const [isAddingLiquidity, setIsAddingLiquidity] = useState(false)

    // Mock function to simulate adding token to MetaMask
    const handleAddToMetamask = useCallback(async () => {
        setIsAddingToMetamask(true)

        try {
            // Check if MetaMask is available
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                await (window as any).ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address:
                                '0x1234567890123456789012345678901234567890', // Mock contract address
                            symbol: 'SWAP-LP',
                            decimals: 18,
                            image: 'https://example.com/token-image.png',
                        },
                    },
                })
            } else {
                // Fallback for when MetaMask is not available
                alert(
                    'MetaMask not detected. Please install MetaMask to add tokens.'
                )
            }
        } catch (error) {
            console.error('Error adding token to MetaMask:', error)
            alert('Failed to add token to MetaMask')
        } finally {
            setIsAddingToMetamask(false)
        }
    }, [])

    // Mock function to simulate adding liquidity
    const handleAddLiquidity = useCallback(() => {
        setIsAddingLiquidity(true)

        // Simulate API call delay
        setTimeout(() => {
            // Mock increasing liquidity
            setLiquidityData((prev) => ({
                ...prev,
                poolTokens: prev.poolTokens + 0.00000001,
                usdtAmount: prev.usdtAmount + 10,
                ethAmount: prev.ethAmount + 0.001,
                shareOfPool: Math.min(prev.shareOfPool + 0.1, 100),
            }))

            setIsAddingLiquidity(false)
            alert('Liquidity added successfully!')
        }, 2000)
    }, [])

    const handleTabChange = (tab: 'exchange' | 'pool') => {
        setActiveTab(tab)
    }

    return (
        <div className="flex items-center justify-center px-4 min-h-screen">
            <div
                className="hero-border w-full p-[3.5px] md:rounded-[40px] rounded-[20px] max-w-[690px]"
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
            >
                <div className="bg-[linear-gradient(105.87deg,rgba(0,0,0,0.3)_3.04%,rgba(0,0,0,0.1)_96.05%)] relative backdrop-blur-[80px] w-full md:rounded-[40px] rounded-[20px] px-[15px] md:px-[50px] py-[20px] md:py-[60px]">
                    <div className="relative z-10 border bg-[#FFFFFF66] inline-flex px-2 py-1.5 rounded-[14px] border-solid border-[#FFFFFF1A] gap-2 mb-[24px]">
                        <button
                            onClick={() => handleTabChange('exchange')}
                            className={`rounded-[8px] font-normal text-sm leading-[100%] px-[22px] py-[13px] transition-all duration-200 ${
                                activeTab === 'exchange'
                                    ? 'bg-white text-[#2A8576] font-bold'
                                    : 'text-black hover:bg-white/20'
                            }`}
                        >
                            Exchange
                        </button>
                        <button
                            onClick={() => handleTabChange('pool')}
                            className={`rounded-[8px] font-normal text-sm leading-[100%] px-[22px] py-[13px] transition-all duration-200 ${
                                activeTab === 'pool'
                                    ? 'bg-white text-[#2A8576] font-bold'
                                    : 'text-black hover:bg-white/20'
                            }`}
                        >
                            Pool
                        </button>
                    </div>

                    <div>
                        <h2 className="mb-4 font-bold text-2xl sm:text-3xl leading-[100%] text-black">
                            Your Liquidity
                        </h2>
                        <p className="text-black font-normal text-xl leading-[18.86px] mb-10">
                            Remove Liquidity to receive tokens back
                        </p>
                        <div className="bg-[#FFFFFF66] rounded-[12px] px-[18px] py-[22px] text-black border border-solid border-[#FFFFFF1A]">
                            <div className="flex items-center space-x-2 mb-2.5">
                                <div className="size-[24px] bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                                    U
                                </div>
                                <div className="size-[24px] bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    E
                                </div>
                                <span className="font-bold text-lg leading-[100%]">
                                    USDT - ETH
                                </span>
                            </div>
                            <div className="font-bold text-lg leading-[100%] mb-4">
                                {liquidityData.poolTokens.toFixed(11)}
                            </div>
                            <div className="flex justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="size-[30px] bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                                        U
                                    </div>
                                    <span className="font-normal text-lg leading-[100%]">
                                        USDT
                                    </span>
                                </div>
                                <span className="font-normal text-lg leading-[100%]">
                                    {liquidityData.usdtAmount.toFixed(5)}
                                </span>
                            </div>
                            <div className="flex justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <div className="size-[30px] bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                        E
                                    </div>
                                    <span className="font-normal text-lg leading-[100%]">
                                        ETH
                                    </span>
                                </div>
                                <span className="font-normal text-lg leading-[100%]">
                                    {liquidityData.ethAmount.toFixed(10)}
                                </span>
                            </div>
                            <div className="flex justify-between mb-3 font-normal text-lg leading-[100%]">
                                <span>Reward</span>
                                <span>{liquidityData.reward || '-'}</span>
                            </div>
                            <div className="flex justify-between mb-6 font-normal text-lg leading-[100%]">
                                <span>Share of Pool</span>
                                <span>
                                    {liquidityData.shareOfPool.toFixed(2)}%
                                </span>
                            </div>
                            <button
                                onClick={handleAddToMetamask}
                                disabled={isAddingToMetamask}
                                className="w-full border-2 border-solid border-[#2A8576] text-[#2A8576] rounded-[150px] py-4 font-medium text-lg leading-[17.6px] hover:bg-[#2A8576] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="button"
                            >
                                {isAddingToMetamask
                                    ? 'Adding to MetaMask...'
                                    : 'Add SWAP-LP Token To Metamask'}
                            </button>
                        </div>
                        <button
                            onClick={handleAddLiquidity}
                            disabled={isAddingLiquidity}
                            className="mt-10 w-full bg-[#3DBEA3] text-white rounded-full py-4 flex items-center justify-center gap-3 font-medium text-base leading-[17.6px] hover:bg-[#2A8576] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="16"
                                fill="none"
                            >
                                <path
                                    stroke="#fff"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M4.5 8h4m0 0h4m-4 0V4m0 4v4"
                                />
                            </svg>
                            {isAddingLiquidity
                                ? 'Adding Liquidity...'
                                : 'Add Liquidity'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConverterPool
