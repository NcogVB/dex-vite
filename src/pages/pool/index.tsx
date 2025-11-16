import { Link } from 'react-router-dom'
import { useState } from 'react'
import { X } from 'lucide-react'
import ChooseDEXSection from '../../components/ChooseDEXSection'
import ConverterPool from '../../components/ConverterPool'

const Pool = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const openPanel = () => setIsPanelOpen(true)
    const closePanel = () => setIsPanelOpen(false)

    return (
        <div>
            {/* Hero Section */}
            <section className="md:py-[110px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Pool Exchange <br className="md:block hidden" /> with DEX.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        The Pool on DEX.earth enables you to put digital assets to work while supporting the decentralized ecosystem. Liquidity added to DEX's high-performance pools will ensure that traders anywhere in the world can exchange tokens with ease. It's a simple, transparent, and trader-friendly way to participate in the future of decentralized finance.
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

            {/* Add Liquidity Section */}
            <section className="relative">
                <img
                    className="absolute bottom-[220px] left-0 w-full"
                    src="/images-new/hero-curve-others.png"
                    alt="hero curve"
                />
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <div className="w-full max-w-[690px] mx-auto relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[15px]">
                            <div className="w-full">
                                <div className="grid grid-cols-2 gap-2 bg-[#00000066] p-[6px_8px] rounded-xl border border-[#FFFFFF33] w-[230px]">
                                    <Link
                                        to="/swap"
                                        className="cursor-pointer flex items-center justify-center h-[45px] rounded-lg font-normal text-sm text-[#FFFFFF]"
                                    >
                                        Exchange
                                    </Link>
                                    <button className="cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm text-[#000000] bg-[#C9FA49]">
                                        Pool
                                    </button>
                                </div>

                                {isPanelOpen ? (
                                    <>
                                        {/* Close Button */}
                                        <div className="flex justify-end md:my-[40px] my-[25px]">
                                            <button
                                                onClick={closePanel}
                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* ConverterPool Component */}
                                        <div className="relative z-10">
                                            <ConverterPool />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={openPanel}
                                            className="flex items-center justify-center gap-2.5 md:my-[40px] my-[25px] text-[#000000] bg-[#C9FA49] md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_30px] rounded-[40px] border border-transparent transition-all duration-300 hover:border-[#C9FA49] hover:bg-transparent hover:text-white w-full"
                                            type="button"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="currentcolor"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12.2737 5.24038C12.2373 5.23807 12.1976 5.23808 12.1565 5.2381L12.1462 5.2381H10.5344C9.20574 5.2381 8.0689 6.29214 8.0689 7.66667C8.0689 9.0412 9.20574 10.0952 10.5344 10.0952H12.1462L12.1565 10.0952C12.1976 10.0953 12.2373 10.0953 12.2737 10.093C12.8133 10.0586 13.2906 9.63297 13.3307 9.03846C13.3334 8.99948 13.3334 8.95746 13.3333 8.91851L13.3333 8.90794V6.4254L13.3333 6.41483C13.3334 6.37588 13.3334 6.33386 13.3307 6.29488C13.2906 5.70037 12.8133 5.27473 12.2737 5.24038ZM10.3914 8.31429C10.7335 8.31429 11.0108 8.02434 11.0108 7.66667C11.0108 7.309 10.7335 7.01905 10.3914 7.01905C10.0494 7.01905 9.77209 7.309 9.77209 7.66667C9.77209 8.02434 10.0494 8.31429 10.3914 8.31429Z"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12.1561 11.0667C12.2519 11.0642 12.3244 11.1536 12.2984 11.2466C12.1694 11.708 11.9647 12.1012 11.6361 12.4323C11.1553 12.917 10.5455 13.1321 9.79214 13.2342C9.06012 13.3334 8.12477 13.3333 6.94388 13.3333H5.58624C4.40535 13.3333 3.47 13.3334 2.73798 13.2342C1.98461 13.1321 1.37485 12.917 0.893972 12.4323C0.413096 11.9477 0.199687 11.3331 0.0984003 10.5738C-1.80205e-05 9.83607 -9.94172e-06 8.89337 2.07827e-07 7.7032V7.63013C-1.00183e-05 6.43996 -1.81695e-05 5.49727 0.0984 4.75949C0.199687 4.00021 0.413096 3.38565 0.893971 2.901C1.37485 2.41634 1.98461 2.20126 2.73798 2.09917C3.47 1.99998 4.40535 1.99999 5.58624 2L6.94388 2C8.12477 1.99999 9.06012 1.99998 9.79214 2.09917C10.5455 2.20126 11.1553 2.41634 11.6361 2.901C11.9647 3.23211 12.1694 3.62536 12.2984 4.08675C12.3244 4.17973 12.2519 4.26917 12.1561 4.26667L10.5343 4.26667C8.71156 4.26667 7.10498 5.71792 7.10498 7.66667C7.10498 9.61542 8.71156 11.0667 10.5343 11.0667L12.1561 11.0667ZM2.40964 4.59048C2.14348 4.59048 1.92771 4.80794 1.92771 5.07619C1.92771 5.34444 2.14348 5.5619 2.40964 5.5619H4.97992C5.24608 5.5619 5.46185 5.34444 5.46185 5.07619C5.46185 4.80794 5.24608 4.59048 4.97992 4.59048H2.40964Z"
                                                />
                                                <path d="M3.85112 1.34959L5.15699 0.387506C5.85829 -0.129169 6.80838 -0.129169 7.50968 0.387506L8.82241 1.35465C8.27354 1.3333 7.66059 1.33332 6.98858 1.33333H5.54155C4.92748 1.33332 4.36273 1.33331 3.85112 1.34959Z" />
                                            </svg>
                                            Add Liquidity
                                        </button>

                                        <div className="bg-[#00000066] border border-[#FFFFFF33] rounded-xl p-4 h-[234px] flex flex-col items-center justify-center">
                                            <div>
                                                <svg
                                                    className="mx-auto mb-8"
                                                    width="57"
                                                    height="57"
                                                    viewBox="0 0 57 57"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.75 1.75H55.0833"
                                                        stroke="#C9FA49"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                    />
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
                                                <p className="text-[#FFFFFF] font-semibold md:text-xl text-sm text-center">
                                                    Your Active V2 Liquidity positions <br /> will appear here
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Pool Exchange Works */}
            <section className="lg:p-[200px_0_100px_0] p-[50px_0_50px_0] relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_13.46%,rgba(201,250,73,0.3)_54.81%,rgba(0,0,0,0)_100%)]"></span>
                <div className="w-full max-w-[910px] mx-auto px-4 relative z-[1] text-center space-y-3">
                    <h2 className="md:text-[60px] text-4xl font-semibold md:leading-[70px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-7">
                        How Pool <br /> Exchange Works
                    </h2>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        DEX Pools are powered by advanced smart contracts built on the NCOG Earth Chain, ensuring fast, secure, and transparent on-chain transactions. Your asset pairs enter our liquidity pool and become part of DEX's decentralized trading engine. Traders rely on this liquidity to run instant swaps with minimal slippage.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        In exchange, you receive a share of every transaction fee, along with potential bonus incentives in native DEX tokens. The system is fully automated, non-custodial, and auditable—giving you complete control over your funds. You can withdraw your liquidity at any time and track your real-time rewards directly on the blockchain.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        As DEX keeps expanding its ecosystem, participating in Pools earns you passive income while strengthening global liquidity across markets. Whether you're a new investor or a seasoned DeFi user, DEX.earth offers a fast, flexible, and trader-friendly environment to maximize your crypto potential.
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

export default Pool