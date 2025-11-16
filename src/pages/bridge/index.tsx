import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChooseDEXSection from '../../components/ChooseDEXSection'

interface DropdownStates {
    fromToken: boolean
    fromChain: boolean
    toToken: boolean
    toChain: boolean
    fromTokenSelect: boolean
    toTokenSelect: boolean
}

interface SelectedValues {
    fromToken: string
    fromChain: string
    toToken: string
    toChain: string
    fromTokenType: string
    toTokenType: string
}

interface InputValues {
    fromAmount: string
    toAmount: string
    price: string
    slippage: string
}

interface TokenOption {
    name: string
    img: string
    color: string
}

interface ChainOption {
    name: string
    img: string
}

type DropdownName = keyof DropdownStates
type SelectionType = keyof SelectedValues
type InputField = keyof InputValues

const Bridge = () => {
    const [dropdownStates, setDropdownStates] = useState<DropdownStates>({
        fromToken: false,
        fromChain: false,
        toToken: false,
        toChain: false,
        fromTokenSelect: false,
        toTokenSelect: false,
    })

    const [selectedValues, setSelectedValues] = useState<SelectedValues>({
        fromToken: 'Ethereum Mainnet',
        fromChain: 'SEPOLIA',
        toToken: 'Ethereum Mainnet',
        toChain: 'SEPOLIA',
        fromTokenType: 'USDT',
        toTokenType: 'USDT',
    })

    const [slippageTolerance, setSlippageTolerance] = useState<number>(1)

    const [inputValues, setInputValues] = useState<InputValues>({
        fromAmount: '0.000',
        toAmount: '0.000',
        price: '0.000',
        slippage: '1%',
    })

    const exchangeRate: number = 0.000025

    const tokenOptions: TokenOption[] = [
        { name: 'USDT', img: '/images/stock-2.png', color: '#00B67A' },
        {
            name: 'BTC',
            img: 'https://storage.googleapis.com/a1aa/image/6d94bf53-1009-4e09-cc33-08da0b192de7.jpg',
            color: '#F7931A',
        },
        { name: 'ETH', img: '/images/stock-1.svg', color: '#3B3B3B' },
    ]

    const chainOptions: ChainOption[] = [
        {
            name: 'Ethereum Mainnet',
            img: 'https://storage.googleapis.com/a1aa/image/6d94bf53-1009-4e09-cc33-08da0b192de7.jpg',
        },
        {
            name: 'SEPOLIA',
            img: 'https://storage.googleapis.com/a1aa/image/6d94bf53-1009-4e09-cc33-08da0b192de7.jpg',
        },
        {
            name: 'Polygon',
            img: 'https://storage.googleapis.com/a1aa/image/6d94bf53-1009-4e09-cc33-08da0b192de7.jpg',
        },
    ]

    const toggleDropdown = (dropdownName: DropdownName): void => {
        setDropdownStates((prev) => ({
            ...prev,
            [dropdownName]: !prev[dropdownName],
        }))
    }

    const handleSelection = (type: SelectionType, value: string): void => {
        setSelectedValues((prev) => ({
            ...prev,
            [type]: value,
        }))

        const dropdownMap: Record<SelectionType, DropdownName> = {
            fromToken: 'fromToken',
            fromChain: 'fromChain',
            toToken: 'toToken',
            toChain: 'toChain',
            fromTokenType: 'fromTokenSelect',
            toTokenType: 'toTokenSelect',
        }

        setDropdownStates((prev) => ({
            ...prev,
            [dropdownMap[type]]: false,
        }))
    }

    const handleInputChange = (field: InputField, value: string): void => {
        setInputValues((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSwap = (): void => {
        setSelectedValues((prev) => ({
            ...prev,
            fromToken: prev.toToken,
            fromChain: prev.toChain,
            toToken: prev.fromToken,
            toChain: prev.fromChain,
            fromTokenType: prev.toTokenType,
            toTokenType: prev.fromTokenType,
        }))

        setInputValues((prev) => ({
            ...prev,
            fromAmount: prev.toAmount,
            toAmount: prev.fromAmount,
        }))
    }

    const renderDropdown = (
        dropdownKey: DropdownName,
        selectionKey: SelectionType,
        label: string,
        options: (TokenOption | ChainOption)[]
    ) => (
        <div className="relative min-w-[133px]">
            <button
                aria-expanded={dropdownStates[dropdownKey]}
                aria-haspopup="listbox"
                className="token-button bg-[#00000066] border rounded-xl border-solid border-[#FFFFFF33] px-2 py-2 w-full flex items-center cursor-pointer select-none hover:border-[#C9FA49] transition-colors"
                type="button"
                onClick={() => toggleDropdown(dropdownKey)}
            >
                <img
                    src={options.find((o) => o.name === selectedValues[selectionKey])?.img || options[0].img}
                    className="token-img rounded-full shadow-[0px_6px_10px_0px_#00000013] size-[26px] min-w-[26px]"
                    alt=""
                />
                <div className="flex flex-col text-left ml-1.5 mr-4">
                    <span className="text-[#DADADA] font-normal text-[10px] leading-[100%] mb-1">
                        {label}
                    </span>
                    <span className="token-label text-[13px] font-normal text-[#FFFFFF] flex-grow">
                        {selectedValues[selectionKey]}
                    </span>
                </div>
                <ChevronDown
                    className={`ml-auto token-arrow transition-transform text-[#FFFFFF] ${
                        dropdownStates[dropdownKey] ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {dropdownStates[dropdownKey] && (
                <ul className="absolute z-10 mt-1 w-full bg-[#000000] border border-[#FFFFFF1A] rounded shadow overflow-auto max-h-48 text-[13px] font-normal text-[#FFFFFF]">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 flex items-center hover:bg-[#5f7a17]"
                            onClick={() => handleSelection(selectionKey, option.name)}
                        >
                            <img alt="" className="w-6 h-6 mr-2" src={option.img} />
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

    return (
        <div>
            {/* Hero Section */}
            <section className="md:py-[110px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Bridge Exchange <br className="md:block hidden" /> with DEX.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        DEX Bridge enables you to transfer crypto assets seamlessly between multiple blockchains, without the limits of isolated ecosystems. Enjoy instant, secure, and trader-friendly interoperability that lets your tokens flow freely—expanding your opportunities across DeFi without leaving the DEX.earth ecosystem.
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

            {/* Bridge Form Section */}
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
                                {/* From Section */}
                                <div className="flex-grow lg:w-[50%] w-full">
                                    <div className="grid grid-cols-2 items-center gap-3 mb-2">
                                        {renderDropdown('fromToken', 'fromToken', 'Token', chainOptions)}
                                        {renderDropdown('fromChain', 'fromChain', 'Chain', chainOptions)}
                                    </div>
                                    <div className="flex items-start justify-between bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-5 p-3">
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] mb-4">Availability: 0</h3>
                                            <input
                                                type="text"
                                                value={inputValues.fromAmount}
                                                onChange={(e) => handleInputChange('fromAmount', e.target.value)}
                                                className="md:text-xl text-sm font-bold text-white bg-transparent border-none outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] border-b border-[#FFFFFF] w-max ml-auto mb-4">
                                                Max: 0
                                            </h3>
                                            <div className="relative">
                                                <button
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    onClick={() => toggleDropdown('fromTokenSelect')}
                                                >
                                                    <span className="flex items-center gap-2 md:text-sm text-xs uppercase font-normal text-[#FFFFFF]">
                                                        <img
                                                            src={tokenOptions.find((t) => t.name === selectedValues.fromTokenType)?.img || '/images/stock-2.png'}
                                                            className="size-[24px] rounded-full"
                                                            alt=""
                                                        />
                                                        <span>{selectedValues.fromTokenType}</span>
                                                    </span>
                                                    <ChevronDown
                                                        className={`transition-transform text-white ${dropdownStates.fromTokenSelect ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {dropdownStates.fromTokenSelect && (
                                                    <ul className="absolute right-0 top-full w-full bg-[#000000] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[130px] text-xs text-[#FFFFFF]">
                                                        {tokenOptions.map((token, index) => (
                                                            <li
                                                                key={index}
                                                                className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                                onClick={() => handleSelection('fromTokenType', token.name)}
                                                            >
                                                                <img src={token.img} className="size-[24px] rounded-full" alt="" />
                                                                <span>{token.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Swap Button */}
                                <button onClick={handleSwap} className="cursor-pointer lg:m-[0px_50px_36px_50px] m-[30px_0px_30px_0px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" fill="none" viewBox="0 0 28 29">
                                        <path
                                            fill="#fff"
                                            d="M19.876.5H8.138C3.04.5 0 3.538 0 8.634v11.718c0 5.11 3.04 8.148 8.138 8.148h11.724C24.96 28.5 28 25.462 28 20.366V8.634C28.014 3.538 24.974.5 19.876.5m-7.284 21c0 .14-.028.266-.084.406a1.1 1.1 0 0 1-.574.574 1 1 0 0 1-.406.084 1.06 1.06 0 0 1-.743-.308l-4.132-4.13a1.056 1.056 0 0 1 0-1.484 1.057 1.057 0 0 1 1.485 0l2.34 2.338V7.5c0-.574.476-1.05 1.05-1.05s1.064.476 1.064 1.05zm8.755-9.128a1.04 1.04 0 0 1-.743.308 1.04 1.04 0 0 1-.742-.308l-2.34-2.338V21.5c0 .574-.475 1.05-1.05 1.05-.574 0-1.05-.476-1.05-1.05v-14c0-.14.028-.266.084-.406.112-.252.308-.462.574-.574a1 1 0 0 1 .798 0c.127.056.238.126.337.224l4.132 4.13c.406.42.406 1.092 0 1.498"
                                        />
                                    </svg>
                                </button>

                                {/* To Section */}
                                <div className="flex-grow lg:w-[50%] w-full">
                                    <div className="grid grid-cols-2 items-center gap-3 mb-2">
                                        {renderDropdown('toToken', 'toToken', 'Token', chainOptions)}
                                        {renderDropdown('toChain', 'toChain', 'Chain', chainOptions)}
                                    </div>
                                    <div className="flex items-start justify-between bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-5 p-3">
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] mb-4">Availability: 0</h3>
                                            <input
                                                type="text"
                                                value={inputValues.toAmount}
                                                onChange={(e) => handleInputChange('toAmount', e.target.value)}
                                                className="md:text-xl text-sm font-bold text-white bg-transparent border-none outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-light text-[#FFFFFF] border-b border-[#FFFFFF] w-max ml-auto mb-4">
                                                Max: 0
                                            </h3>
                                            <div className="relative">
                                                <button
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    onClick={() => toggleDropdown('toTokenSelect')}
                                                >
                                                    <span className="flex items-center gap-2 md:text-sm text-xs uppercase font-normal text-[#FFFFFF]">
                                                        <img
                                                            src={tokenOptions.find((t) => t.name === selectedValues.toTokenType)?.img || '/images/stock-2.png'}
                                                            className="size-[24px] rounded-full"
                                                            alt=""
                                                        />
                                                        <span>{selectedValues.toTokenType}</span>
                                                    </span>
                                                    <ChevronDown
                                                        className={`transition-transform text-white ${dropdownStates.toTokenSelect ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {dropdownStates.toTokenSelect && (
                                                    <ul className="absolute right-0 top-full w-full bg-[#000000] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[130px] text-xs text-[#FFFFFF]">
                                                        {tokenOptions.map((token, index) => (
                                                            <li
                                                                key={index}
                                                                className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                                onClick={() => handleSelection('toTokenType', token.name)}
                                                            >
                                                                <img src={token.img} className="size-[24px] rounded-full" alt="" />
                                                                <span>{token.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price and Slippage Section */}
                            <div className="flex items-start justify-between bg-[#00000066] border border-[#FFFFFF33] rounded-xl md:p-[18px_28px] p-3 md:mt-9 mt-5">
                                <div className="text-left">
                                    <h3 className="md:text-lg text-xs font-normal text-[#FFFFFF] mb-4">Price</h3>
                                    <h4 className="md:text-[28px] text-sm font-bold leading-[1] text-[#FFFFFF]">
                                        {exchangeRate.toFixed(8)}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="md:text-lg text-xs font-normal text-[#FFFFFF]">Slippage Tolerance</h3>
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
                                            className="md:text-[28px] text-sm font-bold leading-[1] text-[#C9FA49] bg-transparent border-none outline-none w-12 text-right"
                                            min="0.1"
                                            max="50"
                                            step="0.1"
                                        />
                                        <span className="md:text-[28px] text-sm font-bold leading-[1] text-[#C9FA49]">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How DEX Bridge Works */}
            <section className="lg:p-[200px_0_100px_0] p-[50px_0_50px_0] relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_13.46%,rgba(201,250,73,0.3)_54.81%,rgba(0,0,0,0)_100%)]"></span>
                <div className="w-full max-w-[910px] mx-auto px-4 relative z-[1] text-center space-y-3">
                    <h2 className="md:text-[60px] text-4xl font-semibold md:leading-[70px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-7">
                        How DEX <br /> Bridge Works
                    </h2>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        The DEX Bridge connects a variety of blockchain networks, allowing you to transfer tokens safely, quickly, and efficiently between chains. When you start a bridge transaction, smart contracts on DEX lock the tokens on the source chain and simultaneously mint or release equivalent tokens on the destination chain. This ensures that total supply remains balanced, verifiable, and completely transparent on-chain.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Utilizing the powerful architecture of the NCOG Earth Chain, DEX Bridge delivers instant confirmations and low transaction costs while maintaining 100% security. Every cross-chain transfer is documented immutably so that you can track and verify your assets at every step.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Whether you're optimizing liquidity, exploring DeFi on other networks, or managing multi-chain strategies, DEX Bridge simplifies the process with its intuitive interface and automated system. For global traders, it's the ultimate tool for expanding access, mobility, and efficiency in decentralized finance —a truly seamless, trader-friendly gateway to the multi-chain future.
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

export default Bridge
