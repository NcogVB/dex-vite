import React, { useState, useEffect } from 'react'

interface TokenData {
    usdt: number
    eth: number
}

interface PoolData {
    usdtRate: number
    ethRate: number
    shareOfPool: number
    poolUsdt: number
    poolEth: number
    lpTokens: number
}

const Converter1: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'exchange' | 'pool'>('pool')
    const [percentage, setPercentage] = useState<number>(25)
    const [selectedPercentage, setSelectedPercentage] = useState<
        25 | 50 | 75 | 100
    >(25)
    const [isEnabled, setIsEnabled] = useState<boolean>(false)

    // Mock pool data - in real app this would come from API/blockchain
    const [poolData] = useState<PoolData>({
        usdtRate: 0.0000919189,
        ethRate: 10879.2,
        shareOfPool: 1.05335,
        poolUsdt: 1.05335,
        poolEth: 0.0000968228,
        lpTokens: 0.00000001009,
    })

    // Calculate amounts based on percentage
    const [calculatedAmounts, setCalculatedAmounts] = useState<TokenData>({
        usdt: 0,
        eth: 0,
    })

    useEffect(() => {
        const usdtAmount = (poolData.poolUsdt * percentage) / 100
        const ethAmount = (poolData.poolEth * percentage) / 100

        setCalculatedAmounts({
            usdt: Number(usdtAmount.toFixed(6)),
            eth: Number(ethAmount.toFixed(10)),
        })
    }, [percentage, poolData])

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        setPercentage(value)

        // Update radio button selection based on slider
        if (value >= 0 && value < 37.5) setSelectedPercentage(25)
        else if (value >= 37.5 && value < 62.5) setSelectedPercentage(50)
        else if (value >= 62.5 && value < 87.5) setSelectedPercentage(75)
        else setSelectedPercentage(100)
    }

    const handlePercentageSelect = (percent: 25 | 50 | 75 | 100) => {
        setSelectedPercentage(percent)
        setPercentage(percent)
    }

    const handleEnable = () => {
        setIsEnabled(true)
        // In real app, this would trigger wallet connection/approval
    }

    const handleRemove = () => {
        if (!isEnabled) return

        // In real app, this would trigger the actual liquidity removal transaction
        console.log('Removing liquidity:', {
            percentage,
            amounts: calculatedAmounts,
            lpTokensToRemove: (poolData.lpTokens * percentage) / 100,
        })

        // Reset after successful removal
        setPercentage(25)
        setSelectedPercentage(25)
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-auto px-4">
                <div
                    className="hero-border w-full p-[3.5px] lg:rounded-[40px] rounded-[20px]"
                    style={{
                        background: `radial-gradient(98% 49.86% at 100.03% 100%, #33a36d 0%, rgba(51, 163, 109, 0.05) 100%), 
                        radial-gradient(24.21% 39.21% at 0% 0%, rgba(255, 255, 255, 0.81) 0%, rgba(255, 255, 255, 0.19) 100%), 
                        radial-gradient(21.19% 40.1% at 100.03% 0%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)`,
                    }}
                >
                    <div className="bg-[linear-gradient(105.87deg,rgba(0,0,0,0.3)_3.04%,rgba(0,0,0,0.1)_96.05%)] relative backdrop-blur-[80px] w-full lg:rounded-[40px] rounded-[20px] px-[15px] lg:px-[50px] py-[20px] lg:py-[60px]">
                        <div className="relative z-10 border bg-[#FFFFFF66] inline-flex px-2 py-1.5 rounded-[14px] border-solid border-[#FFFFFF1A] gap-2 mb-[24px]">
                            <button
                                onClick={() => setActiveTab('exchange')}
                                className={`rounded-[8px] font-normal text-sm leading-[100%] px-[22px] py-[13px] transition-colors ${
                                    activeTab === 'exchange'
                                        ? 'bg-white text-[#2A8576] font-bold'
                                        : 'text-black'
                                }`}
                            >
                                Exchange
                            </button>
                            <button
                                onClick={() => setActiveTab('pool')}
                                className={`rounded-[8px] font-normal text-sm leading-[100%] px-[22px] py-[13px] transition-colors ${
                                    activeTab === 'pool'
                                        ? 'bg-white text-[#2A8576] font-bold'
                                        : 'text-black'
                                }`}
                            >
                                Pool
                            </button>
                        </div>

                        <h2 className="mb-4 font-bold text-xl sm:text-3xl leading-[100%] text-black">
                            Remove USDT/ETH Liquidity
                        </h2>
                        <p className="text-black font-normal text-xl leading-[18.86px] mb-10">
                            To Receive USDT and ETH
                        </p>

                        <div className="flex flex-col lg:flex-row items-start gap-[25px] lg:gap-[51px]">
                            <div className="flex-1 w-full">
                                <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] py-[18px]">
                                    <p className="font-bold md:text-lg text-base leading-[100%] mb-[17px]">
                                        Amount
                                    </p>
                                    <p className="text-black font-bold text-[22px] leading-[31.43px] mb-2">
                                        {percentage.toFixed(3)}%
                                    </p>
                                    <input
                                        className="w-full accent-[#2A8576]"
                                        max="100"
                                        min="0"
                                        type="range"
                                        value={percentage}
                                        onChange={handleSliderChange}
                                    />
                                    <div className="mt-4 flex gap-3 percentage-redio-buttons">
                                        {[25, 50, 75, 100].map((percent) => (
                                            <div
                                                key={percent}
                                                className="flex-1"
                                            >
                                                <input
                                                    type="radio"
                                                    name="percentage"
                                                    id={`${percent}_percentage`}
                                                    className="peer hidden"
                                                    checked={
                                                        selectedPercentage ===
                                                        percent
                                                    }
                                                    onChange={() =>
                                                        handlePercentageSelect(
                                                            percent as
                                                                | 25
                                                                | 50
                                                                | 75
                                                                | 100
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor={`${percent}_percentage`}
                                                    className={`cursor-pointer w-full block bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[8px] py-[5px] lg:py-[11px] text-[16px] lg:text-base font-semibold text-center transition-colors ${
                                                        selectedPercentage ===
                                                        percent
                                                            ? 'border-white text-[#2a8576] bg-white'
                                                            : 'text-[#80888A] lg:text-[#1D3B5E]'
                                                    }`}
                                                >
                                                    {percent}%
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="m-auto">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="29"
                                    fill="none"
                                >
                                    <path
                                        fill="#000"
                                        d="M19.876.5H8.138C3.04.5 0 3.538 0 8.634v11.718c0 5.11 3.04 8.148 8.138 8.148h11.724C24.96 28.5 28 25.462 28 20.366V8.634C28.014 3.538 24.974.5 19.876.5Zm-7.284 21c0 .14-.028.266-.084.406a1.095 1.095 0 0 1-.574.574 1.005 1.005 0 0 1-.406.084 1.056 1.056 0 0 1-.743-.308l-4.132-4.13a1.056 1.056 0 0 1 0-1.484 1.057 1.057 0 0 1 1.485 0l2.34 2.338V7.5c0-.574.476-1.05 1.05-1.05.574 0 1.064.476 1.064 1.05v14Zm8.755-9.128a1.04 1.04 0 0 1-.743.308 1.04 1.04 0 0 1-.742-.308l-2.34-2.338V21.5c0 .574-.475 1.05-1.05 1.05-.574 0-1.05-.476-1.05-1.05v-14c0-.14.028-.266.084-.406.112-.252.308-.462.574-.574a.99.99 0 0 1 .798 0c.127.056.238.126.337.224l4.132 4.13c.406.42.406 1.092 0 1.498Z"
                                    />
                                </svg>
                            </div>

                            <div className="flex-1 w-full h-full">
                                <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] pt-[18px] pb-[28px] h-full">
                                    <p className="font-bold md:text-lg text-base leading-[100%] mb-[38px]">
                                        You will Receive
                                    </p>
                                    <div className="space-y-[28px] font-bold md:text-[22px] text-base leading-[100%]">
                                        <div className="flex justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="size-[30px] bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    USDT
                                                </div>
                                                <span className="font-normal text-lg leading-[100%]">
                                                    USDT
                                                </span>
                                            </div>
                                            <span>
                                                {calculatedAmounts.usdt}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="size-[30px] bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    ETH
                                                </div>
                                                <span className="font-normal text-lg leading-[100%]">
                                                    ETH
                                                </span>
                                            </div>
                                            <span>{calculatedAmounts.eth}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-start gap-[25px] lg:gap-[51px] mt-[40px]">
                            <div className="flex-1 w-full">
                                <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] py-[18px]">
                                    <p className="font-bold md:text-lg text-base leading-[100%] mb-[34px]">
                                        Prices and Pool Share:
                                    </p>
                                    <div className="space-y-[28px]">
                                        <div className="flex justify-between">
                                            <span className="font-normal text-lg leading-[100%]">
                                                1 USDT =
                                            </span>
                                            <span className="font-bold md:text-[22px] text-base leading-[100%]">
                                                {poolData.usdtRate} ETH
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-normal text-lg leading-[100%]">
                                                1 ETH =
                                            </span>
                                            <span className="font-bold md:text-[22px] text-base leading-[100%]">
                                                {poolData.ethRate} USDT
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="29"
                                    fill="none"
                                ></svg>
                            </div>

                            <div className="flex-1 w-full h-full">
                                <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] pt-[18px] pb-[28px] h-full">
                                    <p className="font-bold md:text-lg text-base leading-[100%] mb-[20px]">
                                        LP Tokens in your Wallet
                                    </p>
                                    <div className="space-y-[8px]">
                                        <div className="flex justify-between">
                                            <div className="flex items-center space-x-2 mb-2.5">
                                                <div className="size-[24px] bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    U
                                                </div>
                                                <div className="size-[24px] bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    E
                                                </div>
                                                <span className="font-bold md:text-lg text-base leading-[100%]">
                                                    USDT - ETH
                                                </span>
                                            </div>
                                            <span className="font-bold md:text-[22px] text-base leading-[100%]">
                                                {poolData.lpTokens}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-normal text-lg leading-[100%]">
                                                Share of Pool:
                                            </span>
                                            <span>{poolData.shareOfPool}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-normal text-lg leading-[100%]">
                                                Pool USDT:
                                            </span>
                                            <span>{poolData.poolUsdt}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-normal text-lg leading-[100%]">
                                                Pool ETH:
                                            </span>
                                            <span>{poolData.poolEth}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-[18px] mt-[40px]">
                            <button
                                onClick={handleEnable}
                                disabled={isEnabled}
                                className={`rounded-[150px] p-[16px_92px] font-semibold text-base leading-[17.6px] border-2 transition-colors ${
                                    isEnabled
                                        ? 'text-gray-500 bg-gray-300 border-gray-300 cursor-not-allowed'
                                        : 'text-white bg-[#3DBEA3] border-[#3DBEA3] hover:bg-[#35a691]'
                                }`}
                            >
                                {isEnabled ? 'Enabled' : 'Enable'}
                            </button>
                            <button
                                onClick={handleRemove}
                                disabled={!isEnabled}
                                className={`rounded-[150px] p-[16px_92px] font-semibold text-base leading-[17.6px] border-2 transition-colors ${
                                    !isEnabled
                                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                        : 'text-[#3DBEA3] border-[#3DBEA3] hover:bg-[#3DBEA3] hover:text-white'
                                }`}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Converter1
