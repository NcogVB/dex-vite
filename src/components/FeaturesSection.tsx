import { Link } from 'react-router-dom'

const FeaturesSection = () => {
    return (
        <section className="lg:py-[50px] py-[25px] relative">
            <img
                className="absolute bottom-0 left-0 w-full h-full"
                src="/images-new/stands-out-bg.png"
                alt="stands out bg"
            />
            <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                <h2 className="xl:text-[60px] md:text-[50px] text-[30px] text-center font-semibold leading-[1] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-[100px]">
                    Why DEX.earth Stands Out
                </h2>

                <div className="lg:space-y-[70px] space-y-[30px]">
                    {/* Trader Friendly Interface */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 gap-5 items-center">
                        <div className="md:order-0 order-1">
                            <h3 className="text-[#C9FA49] uppercase xl:text-xl lg:text-lg text-base font-semibold md:mb-5 mb-3">
                                OUR FEATURE
                            </h3>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Trader Friendly Interface
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5 mb-3">
                                One of the main issues with decentralized exchange is their complex
                                interface, and many traders are unable to use them. But, similar to
                                centralized exchanges CEX, our DEX platform is easy to use for any
                                trader.
                            </p>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white">
                                It features a simple interface with detailed charts, open orders,
                                history, and buttons to create quick orders. Also, you can use our
                                trading bot with an exchange for easy crypto trading.
                            </p>
                            <Link
                                to="/swap"
                                className="text-[#C9FA49] bg-black md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_20px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black inline-block lg:mt-12 mt-6"
                            >
                                Get Started
                            </Link>
                        </div>
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/our-feature-icon.svg"
                                alt="our feature"
                            />
                        </div>
                    </div>

                    {/* Audited Smart Contracts */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 gap-5 items-center">
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto md:h-[500px]"
                                src="/images-new/audited-smart-contracts.svg"
                                alt="Audited Smart Contracts"
                            />
                        </div>
                        <div>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Audited Smart Contracts
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5">
                                We do regular examination and testing of smart contract code to
                                identify and rectify potential vulnerabilities. This includes unit
                                testing and integration testing to ensure code is free from any bugs,
                                flaws, or other potential threats.
                            </p>
                        </div>
                    </div>

                    {/* Future and Options */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div className="md:order-0 order-1">
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Future and Options
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white">
                                Enjoy a stress-free future and options trading with DEX.earth. Our
                                advanced trading tools help you manage risk, hedge positions, and plan
                                trading in advance.
                            </p>
                            <Link
                                to="/swap"
                                className="text-[#C9FA49] bg-black md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_20px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black inline-block lg:mt-12 mt-6"
                            >
                                Get Started
                            </Link>
                        </div>
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/future-and-options.svg"
                                alt="Future and Options"
                            />
                        </div>
                    </div>

                    {/* Multi-Chain Support */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/multi-chain-support.svg"
                                alt="Multi-Chain Support"
                            />
                        </div>
                        <div>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Multi-Chain Support
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5">
                                Our decentralized exchange (DEX) platform allows you to trade digital
                                assets across different blockchain networks. This increases crypto
                                trading opportunities without any need to switch between different
                                platforms.
                            </p>
                        </div>
                    </div>

                    {/* Lightning-Fast Swaps */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div className="md:order-0 order-1">
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Lightning-Fast Swaps
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white">
                                Experience seamless trading with instant swaps supported by deep
                                liquidity pools. With us, you can make a number of transactions in the
                                shortest possible time and with minimal fees.
                            </p>
                            <Link
                                to="/swap"
                                className="text-[#C9FA49] bg-transparent md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_20px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black inline-block lg:mt-12 mt-6"
                            >
                                Swap Now
                            </Link>
                        </div>
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/lightning-fast-swaps.svg"
                                alt="Lightning-Fast Swaps"
                            />
                        </div>
                    </div>

                    {/* Built-in Trading Bots */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/built-in-trading-bots.svg"
                                alt="Built-in Trading Bots"
                            />
                        </div>
                        <div>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Built-in Trading Bots
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5">
                                NCOG Earth Chain features trading bots that let you copy top traders
                                and use market data to automate trades. So, you can easily learn and
                                adapt to market changes, which helps diversify your portfolio.
                            </p>
                        </div>
                    </div>

                    {/* Crypto Loans */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div className="md:order-0 order-1">
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Crypto Loans
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white">
                                With us, you can borrow against your assets, be it Bitcoin, Ethereum,
                                or any other digital currency. With our crypto loan, you can unlock
                                your liquidity for easy decentralized exchange without selling your
                                holdings.
                            </p>
                        </div>
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/crypto-loans.svg"
                                alt="Crypto Loans"
                            />
                        </div>
                    </div>

                    {/* Trade Insurance */}
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 xl:gap-20 gap-5 items-center">
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/trade-insurance.svg"
                                alt="Trade Insurance"
                            />
                        </div>
                        <div>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                Trade Insurance
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5">
                                Get benefits from our trade insurance system for decentralized
                                exchange traders. NCOG Earth Chain provides you with security and
                                protection without needing traditional insurance companies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
