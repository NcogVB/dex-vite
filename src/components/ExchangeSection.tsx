import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ExchangeSection = () => {
    const [fromChain, setFromChain] = useState('Ethereum Mainnet')
    const [toChain, setToChain] = useState('BNB Chain')
    const [fromToken, setFromToken] = useState('USDT')
    const [fromDropdown, setFromDropdown] = useState(false)
    const [toDropdown, setToDropdown] = useState(false)
    const [fromTokenDropdown, setFromTokenDropdown] = useState(false)

    const chains = [
        { name: 'BNB Chain', image: '/images-new/bnb-chain.svg' },
        { name: 'Ethereum Mainnet', image: '/images-new/ethereum-mainnet.svg' },
        { name: 'ETH', image: '/images-new/eth.svg' },
        { name: 'USDT', image: '/images-new/usdt.svg' },
    ]

    const tokens = [
        { name: 'BNB Chain', image: '/images-new/bnb-chain.svg' },
        { name: 'Ethereum Mainnet', image: '/images-new/ethereum-mainnet.svg' },
        { name: 'ETH', image: '/images-new/eth.svg' },
        { name: 'USDT', image: '/images-new/usdt.svg' },
    ]

    return (
        <section className="relative">
            <img
                className="absolute bottom-0 left-0 w-full"
                src="/images-new/hero-curve.png"
                alt="hero curve"
            />
            <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                <div className="relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="flex lg:flex-row flex-col lg:items-end items-center md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[60px_50px] sm:p-[30px] p-[15px]">
                        <div className="flex-grow lg:w-[50%] w-full">
                            <div className="flex items-center justify-between gap-5 mb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="md:text-xl text-base font-bold text-white">From</h3>
                                    {/* Select Option */}
                                    <div className="relative md:min-w-[250px]">
                                        <button
                                            className="w-full flex items-center justify-between gap-5 rounded-xl p-[10px] cursor-pointer bg-black/40 border border-white/10 transition-all"
                                            onClick={() => setFromDropdown(!fromDropdown)}
                                        >
                                            <span className="flex items-center gap-2 font-normal md:text-base text-xs">
                                                <img
                                                    src="/images-new/ethereum-mainnet.svg"
                                                    className="size-[24px] rounded-full"
                                                    alt="Ethereum Mainnet"
                                                />
                                                <span>{fromChain}</span>
                                            </span>
                                            <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${fromDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        {fromDropdown && (
                                            <ul className="absolute left-0 top-full w-full bg-black border border-white/10 rounded shadow mt-1 z-10 min-w-[230px] md:text-base text-xs">
                                                {chains.map((chain, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                        onClick={() => {
                                                            setFromChain(chain.name)
                                                            setFromDropdown(false)
                                                        }}
                                                    >
                                                        <img src={chain.image} className="size-[24px] rounded-full" alt={chain.name} />
                                                        <span>{chain.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <svg
                                    className="cursor-pointer"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="17"
                                    fill="none"
                                    viewBox="0 0 16 17"
                                >
                                    <path
                                        fill="#fff"
                                        fillRule="evenodd"
                                        d="M14.628 3.285A2.65 2.65 0 0 1 16 5.607v5.727c0 .965-.525 1.854-1.372 2.322l-5.333 2.95a2.68 2.68 0 0 1-2.59 0l-5.333-2.95A2.65 2.65 0 0 1 0 11.334V5.607c0-.965.525-1.853 1.372-2.322L6.705.335a2.68 2.68 0 0 1 2.59 0zM6.222 8.47c0-.978.796-1.77 1.778-1.77s1.778.792 1.778 1.77S8.982 10.24 8 10.24a1.774 1.774 0 0 1-1.778-1.77M8 4.93a3.55 3.55 0 0 0-3.556 3.54A3.55 3.55 0 0 0 8 12.011a3.55 3.55 0 0 0 3.556-3.54A3.55 3.55 0 0 0 8 4.928"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-start justify-between bg-black/40 border border-white/10 rounded-xl md:p-5 p-3">
                                <div>
                                    <h3 className="text-sm font-light text-white mb-4">Send:</h3>
                                    <h4 className="md:text-xl text-sm font-bold text-white">20, 000</h4>
                                </div>
                                <div>
                                    <h3 className="text-sm font-light text-white border-b border-white w-max ml-auto mb-4">
                                        Max: 0
                                    </h3>
                                    <div className="relative w-max ml-auto">
                                        <button
                                            className="flex items-center gap-2 cursor-pointer transition-all"
                                            onClick={() => setFromTokenDropdown(!fromTokenDropdown)}
                                        >
                                            <span className="flex items-center gap-2 md:text-sm text-xs uppercase font-normal pl-1 pr-1.5 text-white">
                                                <img
                                                    src="/images-new/usdt.svg"
                                                    className="size-[24px] rounded-full"
                                                    alt="USDT"
                                                />
                                                <span>{fromToken}</span>
                                            </span>
                                            <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${fromTokenDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        {fromTokenDropdown && (
                                            <ul className="absolute right-0 top-full w-full bg-black border border-white/10 rounded shadow mt-1 text-xs z-10 min-w-[230px]">
                                                {tokens.map((token, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                        onClick={() => {
                                                            setFromToken(token.name)
                                                            setFromTokenDropdown(false)
                                                        }}
                                                    >
                                                        <img src={token.image} className="size-[24px] rounded-full" alt={token.name} />
                                                        <span>{token.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="cursor-pointer lg:m-[0px_50px_36px_50px] m-[30px_0px_30px_0px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="29"
                                fill="none"
                                viewBox="0 0 28 29"
                            >
                                <path
                                    fill="#fff"
                                    d="M19.876.5H8.138C3.04.5 0 3.538 0 8.634v11.718c0 5.11 3.04 8.148 8.138 8.148h11.724C24.96 28.5 28 25.462 28 20.366V8.634C28.014 3.538 24.974.5 19.876.5m-7.284 21c0 .14-.028.266-.084.406a1.1 1.1 0 0 1-.574.574 1 1 0 0 1-.406.084 1.06 1.06 0 0 1-.743-.308l-4.132-4.13a1.056 1.056 0 0 1 0-1.484 1.057 1.057 0 0 1 1.485 0l2.34 2.338V7.5c0-.574.476-1.05 1.05-1.05s1.064.476 1.064 1.05zm8.755-9.128a1.04 1.04 0 0 1-.743.308 1.04 1.04 0 0 1-.742-.308l-2.34-2.338V21.5c0 .574-.475 1.05-1.05 1.05-.574 0-1.05-.476-1.05-1.05v-14c0-.14.028-.266.084-.406.112-.252.308-.462.574-.574a1 1 0 0 1 .798 0c.127.056.238.126.337.224l4.132 4.13c.406.42.406 1.092 0 1.498"
                                />
                            </svg>
                        </button>
                        <div className="flex-grow lg:w-[50%] w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="md:text-xl text-base font-bold text-white">To</h3>
                                {/* Select Option */}
                                <div className="relative min-w-[250px]">
                                    <button
                                        className="w-full flex items-center justify-between rounded-xl p-[10px] cursor-pointer bg-black/40 border border-white/10 transition-all"
                                        onClick={() => setToDropdown(!toDropdown)}
                                    >
                                        <span className="flex items-center gap-2 font-normal md:text-base text-xs">
                                            <img
                                                src="/images-new/bnb-chain.svg"
                                                className="size-[24px] rounded-full"
                                                alt="BNB Chain"
                                            />
                                            <span>{toChain}</span>
                                        </span>
                                        <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${toDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {toDropdown && (
                                        <ul className="absolute left-0 top-full w-full bg-black border border-white/10 rounded shadow mt-1 z-10 md:text-base text-xs">
                                            {chains.map((chain, idx) => (
                                                <li
                                                    key={idx}
                                                    className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                                    onClick={() => {
                                                        setToChain(chain.name)
                                                        setToDropdown(false)
                                                    }}
                                                >
                                                    <img src={chain.image} className="size-[24px] rounded-full" alt={chain.name} />
                                                    <span>{chain.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-xl md:p-5 p-3">
                                <div className="flex items-center gap-1.5 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        fill="none"
                                        viewBox="0 0 12 12"
                                    >
                                        <g fill="#fff" clipPath="url(#a)">
                                            <path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0m0 10.982a4.983 4.983 0 1 1 .002-9.966A4.983 4.983 0 0 1 6 10.982" />
                                            <path d="M5.357 3.643a.643.643 0 1 0 1.286 0 .643.643 0 0 0-1.286 0m.965 1.5h-.643a.107.107 0 0 0-.107.107v3.643c0 .059.048.107.107.107h.643a.107.107 0 0 0 .107-.107V5.25a.107.107 0 0 0-.107-.107" />
                                        </g>
                                        <defs>
                                            <clipPath id="a">
                                                <path fill="#fff" d="M0 0h12v12H0z" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <h3 className="text-sm font-light text-white">Receive (estimated):</h3>
                                </div>
                                <h4 className="md:text-xl text-sm font-bold text-white">10, 000</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExchangeSection
