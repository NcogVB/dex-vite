import { useEffect, useRef, useState } from 'react'
import TradingDashboard from '../../components/TradingDashboard'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import ChooseDEXSection from '../../components/ChooseDEXSection'

interface Token {
    symbol: string
    name: string
    img: string
    color: string
    balance: number
}

const Limit = () => {
    const tokens: Token[] = [
        {
            symbol: 'USDT',
            name: 'Tether',
            img: '/images/stock-2.png',
            color: '#00B67A',
            balance: 1000.5,
        },
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            img: 'https://storage.googleapis.com/a1aa/image/6d94bf53-1009-4e09-cc33-08da0b192de7.jpg',
            color: '#F7931A',
            balance: 0.025,
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            img: '/images/stock-1.svg',
            color: '#3B3B3B',
            balance: 2.75,
        },
    ]

    // State management
    const [fromToken, setFromToken] = useState<Token>(tokens[0])
    const [toToken, setToToken] = useState<Token>(tokens[1])
    const [fromAmount, setFromAmount] = useState<string>('')
    const [toAmount, setToAmount] = useState<string>('')
    const [fromPercentage, setFromPercentage] = useState<string>('25')
    const [toPercentage, setToPercentage] = useState<string>('25')
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState<boolean>(false)
    const [isToDropdownOpen, setIsToDropdownOpen] = useState<boolean>(false)
    const [slippageTolerance, setSlippageTolerance] = useState<number>(1)
    const [activeTab, setActiveTab] = useState<'open' | 'history'>('open')

    // Refs for dropdown management
    const fromDropdownRef = useRef<HTMLDivElement>(null)
    const toDropdownRef = useRef<HTMLDivElement>(null)

    // Mock exchange rate
    const exchangeRate: number = 0.000025

    // Calculate exchange amounts
    useEffect(() => {
        if (fromAmount && !isNaN(Number(fromAmount))) {
            const calculatedAmount = (parseFloat(fromAmount) * exchangeRate).toFixed(6)
            setToAmount(calculatedAmount)
        } else {
            setToAmount('')
        }
    }, [fromAmount, fromToken, toToken, exchangeRate])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            if (fromDropdownRef.current && !fromDropdownRef.current.contains(target)) {
                setIsFromDropdownOpen(false)
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(target)) {
                setIsToDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle percentage selection
    const handlePercentageSelect = (percentage: string, isFrom: boolean = true): void => {
        const token = isFrom ? fromToken : toToken
        const amount = (token.balance * (Number(percentage) / 100)).toFixed(6)

        if (isFrom) {
            setFromPercentage(percentage.toString())
            setFromAmount(amount)
        } else {
            setToPercentage(percentage.toString())
            setToAmount(amount)
        }
    }

    // Handle token swap
    const handleSwapTokens = (): void => {
        const tempToken = fromToken
        const tempAmount = fromAmount

        setFromToken(toToken)
        setToToken(tempToken)
        setFromAmount(toAmount)
        setToAmount(tempAmount)
    }

    // Handle token selection
    const handleTokenSelect = (token: Token, isFrom: boolean = true): void => {
        if (isFrom) {
            setFromToken(token)
            setIsFromDropdownOpen(false)
        } else {
            setToToken(token)
            setIsToDropdownOpen(false)
        }
    }

    // Handle amount input
    const handleAmountChange = (value: string, isFrom: boolean = true): void => {
        if (isFrom) {
            setFromAmount(value)
        } else {
            setToAmount(value)
        }
    }

    // Handle max amount
    const handleMaxAmount = (isFrom: boolean = true): void => {
        const token = isFrom ? fromToken : toToken
        const amount = token.balance.toString()

        if (isFrom) {
            setFromAmount(amount)
            setFromPercentage('100')
        } else {
            setToAmount(amount)
            setToPercentage('100')
        }
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="md:py-[110px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Limit Order <br className="md:block hidden" /> with DEX.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        DEX Limit Orders give you full control over when and how your trades execute. Instead of accepting the current market price, you set the price you want — and the system automatically completes the trade once conditions are met. It's precision trading made simple, secure, and fully decentralized.
                    </p>
                    <div className="flex items-center justify-center md:gap-[50px] gap-5">
                        <Link
                            to="/swap"
                            className="text-[#000000] bg-[#C9FA49] md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_30px] rounded-[40px] border border-transparent transition-all duration-300 hover:border-[#C9FA49] hover:bg-transparent hover:text-white"
                        >
                            Connect Wallet
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trading Form Section */}
            <section className="relative">
                <img
                    className="absolute bottom-[220px] left-0 w-full"
                    src="/images-new/hero-curve-others.png"
                    alt="hero curve"
                />
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <div className="relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[60px_50px] sm:p-[30px] p-[15px]">
                            <div className="flex lg:flex-row flex-col lg:items-end items-center">
                                {/* From Token Section */}
                                <div className="flex-grow lg:w-[50%] w-full">
                                    <div className="flex items-start justify-between bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-5 p-3">
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] mb-4">
                                                Availability: {fromToken.balance.toFixed(3)}
                                            </h3>
                                            <input
                                                type="number"
                                                value={fromAmount}
                                                onChange={(e) => handleAmountChange(e.target.value, true)}
                                                className="md:text-xl text-sm font-bold text-white bg-transparent border-none outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                onClick={() => handleMaxAmount(true)}
                                                className="text-sm font-light text-[#FFFFFF] border-b border-[#FFFFFF] w-max ml-auto mb-4 cursor-pointer hover:text-[#C9FA49]"
                                            >
                                                Max: {fromToken.balance.toFixed(3)}
                                            </h3>
                                            <div className="relative" ref={fromDropdownRef}>
                                                <button
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                                                >
                                                    <span className="flex items-center gap-2 md:text-sm text-xs uppercase font-normal text-[#FFFFFF]">
                                                        <img src={fromToken.img} className="size-[24px] rounded-full" alt="" />
                                                        <span>{fromToken.symbol}</span>
                                                    </span>
                                                    <ChevronDown
                                                        className={`transition-transform text-white ${
                                                            isFromDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                                {isFromDropdownOpen && (
                                                    <ul className="absolute right-0 top-full w-full bg-[#000000] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[130px] text-xs text-[#FFFFFF]">
                                                        {tokens
                                                            .filter((token) => token.symbol !== toToken.symbol)
                                                            .map((token, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                                    onClick={() => handleTokenSelect(token, true)}
                                                                >
                                                                    <img src={token.img} className="size-[24px] rounded-full" alt="" />
                                                                    <span>{token.symbol}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Percentage Buttons */}
                                    <div className="grid grid-cols-4 gap-3 mt-2 w-full">
                                        {['25', '50', '75', '100'].map((percentage) => (
                                            <div key={percentage} className="flex-1">
                                                <input
                                                    id={`r${percentage}`}
                                                    name="progress"
                                                    type="radio"
                                                    className="sr-only peer"
                                                    checked={fromPercentage === percentage}
                                                    onChange={() => handlePercentageSelect(percentage, true)}
                                                />
                                                <label
                                                    htmlFor={`r${percentage}`}
                                                    className="flex items-center justify-center text-center rounded-lg font-normal text-sm cursor-pointer h-[43px] border border-[#00000033] bg-[#00000066] text-white peer-checked:text-black peer-checked:bg-[#C9FA49] peer-checked:font-bold"
                                                >
                                                    {percentage}%
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Swap Button */}
                                <button onClick={handleSwapTokens} className="cursor-pointer lg:m-[0px_50px_36px_50px] m-[30px_0px_30px_0px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" fill="none" viewBox="0 0 28 29">
                                        <path
                                            fill="#fff"
                                            d="M19.876.5H8.138C3.04.5 0 3.538 0 8.634v11.718c0 5.11 3.04 8.148 8.138 8.148h11.724C24.96 28.5 28 25.462 28 20.366V8.634C28.014 3.538 24.974.5 19.876.5m-7.284 21c0 .14-.028.266-.084.406a1.1 1.1 0 0 1-.574.574 1 1 0 0 1-.406.084 1.06 1.06 0 0 1-.743-.308l-4.132-4.13a1.056 1.056 0 0 1 0-1.484 1.057 1.057 0 0 1 1.485 0l2.34 2.338V7.5c0-.574.476-1.05 1.05-1.05s1.064.476 1.064 1.05zm8.755-9.128a1.04 1.04 0 0 1-.743.308 1.04 1.04 0 0 1-.742-.308l-2.34-2.338V21.5c0 .574-.475 1.05-1.05 1.05-.574 0-1.05-.476-1.05-1.05v-14c0-.14.028-.266.084-.406.112-.252.308-.462.574-.574a1 1 0 0 1 .798 0c.127.056.238.126.337.224l4.132 4.13c.406.42.406 1.092 0 1.498"
                                        />
                                    </svg>
                                </button>

                                {/* To Token Section */}
                                <div className="flex-grow lg:w-[50%] w-full">
                                    <div className="flex items-start justify-between bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-5 p-3">
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] mb-4">
                                                Availability: {toToken.balance.toFixed(3)}
                                            </h3>
                                            <input
                                                type="number"
                                                value={toAmount}
                                                onChange={(e) => handleAmountChange(e.target.value, false)}
                                                className="md:text-xl text-sm font-bold text-white bg-transparent border-none outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                onClick={() => handleMaxAmount(false)}
                                                className="text-sm font-light text-[#FFFFFF] border-b border-[#FFFFFF] w-max ml-auto mb-4 cursor-pointer hover:text-[#C9FA49]"
                                            >
                                                Max: {toToken.balance.toFixed(3)}
                                            </h3>
                                            <div className="relative" ref={toDropdownRef}>
                                                <button
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                                                >
                                                    <span className="flex items-center gap-2 md:text-sm text-xs uppercase font-normal text-[#FFFFFF]">
                                                        <img src={toToken.img} className="size-[24px] rounded-full" alt="" />
                                                        <span>{toToken.symbol}</span>
                                                    </span>
                                                    <ChevronDown
                                                        className={`transition-transform text-white ${
                                                            isToDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                                {isToDropdownOpen && (
                                                    <ul className="absolute right-0 top-full w-full bg-[#000000] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[130px] text-xs text-[#FFFFFF]">
                                                        {tokens
                                                            .filter((token) => token.symbol !== fromToken.symbol)
                                                            .map((token, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                                    onClick={() => handleTokenSelect(token, false)}
                                                                >
                                                                    <img src={token.img} className="size-[24px] rounded-full" alt="" />
                                                                    <span>{token.symbol}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Percentage Buttons */}
                                    <div className="grid grid-cols-4 gap-3 mt-2 w-full">
                                        {['25', '50', '75', '100'].map((percentage) => (
                                            <div key={percentage} className="flex-1">
                                                <input
                                                    id={`l${percentage}`}
                                                    name="Rprogress"
                                                    type="radio"
                                                    className="sr-only peer"
                                                    checked={toPercentage === percentage}
                                                    onChange={() => handlePercentageSelect(percentage, false)}
                                                />
                                                <label
                                                    htmlFor={`l${percentage}`}
                                                    className="flex items-center justify-center text-center rounded-lg font-normal text-sm cursor-pointer h-[43px] border border-[#00000033] bg-[#00000066] text-white peer-checked:text-black peer-checked:bg-[#C9FA49] peer-checked:font-bold"
                                                >
                                                    {percentage}%
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price and Info Section */}
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-5 items-start bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-[18px_28px] p-3 md:mt-9 mt-5">
                                <div className="text-left order-1">
                                    <h3 className="lg:text-lg text-xs font-normal text-[#FFFFFF] mb-4">Price</h3>
                                    <h4 className="lg:text-[28px] text-sm font-bold leading-[1] text-[#FFFFFF]">
                                        {exchangeRate.toFixed(8)}
                                    </h4>
                                </div>
                                <div className="text-center md:order-2 order-0 md:col-span-1 col-span-2">
                                    <h3 className="lg:text-lg text-xs font-normal text-[#FFFFFF] mb-4">
                                        Expiration Date: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </h3>
                                    <h4 className="lg:text-[28px] text-sm font-bold leading-[1] text-[#FFFFFF]">
                                        {fromToken.symbol} - {toToken.symbol}
                                    </h4>
                                </div>
                                <div className="text-right order-3">
                                    <div className="flex items-center justify-end gap-2 mb-4">
                                        <h3 className="lg:text-lg text-xs font-normal text-[#FFFFFF]">Slippage Tolerance</h3>
                                        <svg className="min-w-[17px]" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                            <circle cx="8.25" cy="8.25" r="7.5" stroke="white" strokeWidth="1.5" />
                                            <path
                                                d="M6.84375 5.90625C6.84375 5.1296 7.47335 4.5 8.25 4.5C9.02665 4.5 9.65625 5.1296 9.65625 5.90625C9.65625 6.42183 9.37878 6.87261 8.96502 7.11741C8.60853 7.32832 8.25 7.64829 8.25 8.0625V9"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <circle cx="8.25" cy="11.25" r="0.75" fill="white" />
                                        </svg>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <input
                                            type="number"
                                            value={slippageTolerance}
                                            onChange={(e) => setSlippageTolerance(parseFloat(e.target.value) || 1)}
                                            className="lg:text-[28px] text-sm font-bold leading-[1] text-[#C9FA49] bg-transparent border-none outline-none w-12 text-right"
                                            min="0.1"
                                            max="50"
                                            step="0.1"
                                        />
                                        <span className="lg:text-[28px] text-sm font-bold leading-[1] text-[#C9FA49]">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chart and Orders Section */}
            <section className="mt-[57px]">
                <div className="w-full max-w-[1250px] mx-auto px-4">
                    <div className="flex lg:flex-row flex-col gap-3">
                        {/* Trading Chart */}
                        <div className="flex-grow relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                            <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm h-full overflow-hidden lg:pt-0 md:pt-[55%] pt-[70%]">
                                <TradingDashboard />
                            </div>
                        </div>

                        {/* Orders Panel */}
                        <div className="lg:min-w-[472px] lg:max-w-[472px] max-w-full relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                            <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[15px]">
                                <div className="w-full">
                                    {/* Tab Buttons */}
                                    <div className="grid grid-cols-2 gap-2 bg-[#00000066] p-[6px_8px] rounded-xl border border-[#FFFFFF33] w-[293px]">
                                        <button
                                            onClick={() => setActiveTab('open')}
                                            className={`cursor-pointer flex-1 h-[45px] rounded-lg text-sm ${
                                                activeTab === 'open'
                                                    ? 'font-semibold bg-[#C9FA49] text-[#000000]'
                                                    : 'font-normal text-[#FFFFFF]'
                                            }`}
                                        >
                                            Open Orders
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('history')}
                                            className={`cursor-pointer flex-1 h-[45px] rounded-lg text-sm ${
                                                activeTab === 'history'
                                                    ? 'font-semibold bg-[#C9FA49] text-[#000000]'
                                                    : 'font-normal text-[#FFFFFF]'
                                            }`}
                                        >
                                            Orders History
                                        </button>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="mt-6 bg-[#00000066] border border-[#FFFFFF33] rounded-xl p-4 h-[344px] flex flex-col items-center justify-center">
                                        <svg
                                            className="mx-auto mb-8"
                                            width="57"
                                            height="57"
                                            viewBox="0 0 57 57"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M1.75 1.75H55.0833" stroke="#C9FA49" strokeWidth="3.5" strokeLinecap="round" />
                                            <path
                                                d="M20.417 24.4167L23.8647 20.969C24.7536 20.0801 25.198 19.6357 25.7503 19.6357C26.3026 19.6357 26.7471 20.0801 27.6359 20.969L29.198 22.5311C30.0869 23.42 30.5314 23.8644 31.0837 23.8644C31.6359 23.8644 32.0804 23.42 32.9693 22.5311L36.417 19.0834"
                                                stroke="#C9FA49"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M28.417 52.4167L28.417 41.7501"
                                                stroke="#C9FA49"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M23.084 55.0834L28.4173 52.4167"
                                                stroke="#C9FA49"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M33.7503 55.0834L28.417 52.4167"
                                                stroke="#C9FA49"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M49.7507 1.75V24.4167C49.7507 32.5877 49.7507 36.6732 47.0728 39.2116C44.3949 41.75 40.0849 41.75 31.4649 41.75H25.3697C16.7497 41.75 12.4397 41.75 9.76187 39.2116C7.08398 36.6732 7.08398 32.5877 7.08398 24.4167V1.75"
                                                stroke="#C9FA49"
                                                strokeWidth="3.5"
                                            />
                                        </svg>
                                        <p className="text-[#FFFFFF] font-semibold text-xl">
                                            {activeTab === 'open' ? 'No Open Orders Yet' : 'No Order History Yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Limit Order Works */}
            <section className="lg:p-[200px_0_100px_0] p-[50px_0_50px_0] relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_13.46%,rgba(201,250,73,0.3)_54.81%,rgba(0,0,0,0)_100%)]"></span>
                <div className="w-full max-w-[910px] mx-auto px-4 relative z-[1] text-center space-y-3">
                    <h2 className="md:text-[60px] text-4xl font-semibold md:leading-[70px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-7">
                        How Limit Order <br /> Exchange Works
                    </h2>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        On DEX.earth, Limit Orders are powered by smart contracts on the NCOG Earth Chain, delivering true decentralized order execution without intermediaries. Placing a limit order means specifying the desired buy or sell price for a trading pair. The order is securely stored on-chain and automatically triggered when the market price reaches your target.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        This on-chain mechanism results in transparent and predictable execution. You retain full custody of your assets until the trade occurs, without centralized holding or third-party risk. The entire process is optimized for speed and precision, combining the flexibility of a professional trading platform with the safety of DeFi.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Overall, DEX Limit Orders empower you to plan trades with confidence, minimal slippage, and total price autonomy. This is how it redefines secure crypto trading in a decentralized world.
                    </p>

                    <div className="flex items-center justify-center gap-3 md:mt-16 mt-8">
                        <Link
                            to="/swap"
                            className="text-[#000000] bg-[#C9FA49] md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_30px] rounded-[40px] border border-transparent transition-all duration-300 hover:border-[#C9FA49] hover:bg-transparent hover:text-white"
                        >
                            Connect Wallet
                        </Link>
                        <Link
                            to="/swap"
                            className="text-[#C9FA49] bg-[#000000] md:text-base text-sm leading-[1] font-normal xl:p-[20px_40px] p-[15px_25px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-[#000000] text-center"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Choose DEX for Smarter Exchanges */}
            <ChooseDEXSection />
        </div>
    )
}

export default Limit
