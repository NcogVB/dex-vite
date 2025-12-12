import Converter from '../../components/Converter'
import ChooseDEXSection from '../../components/ChooseDEXSection'
import { Link } from 'react-router-dom'

const Swap = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="md:py-[110px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Exchange Tokens <br className="md:block hidden" /> with DEX.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        At our cryptocurrency token exchange platform, we offer an easy-to-use token swap service that allows you to seamlessly exchange one type of token for another with maximum efficiency.
                    </p>
                </div>
            </section>

            {/* Converter Section */}
            <section className="relative pb-[50px]">
                <img
                    className="absolute bottom-0 left-0 w-full"
                    src="/images-new/hero-curve-others.png"
                    alt="hero curve"
                />
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <Converter />
                </div>
            </section>

            {/* How Exchange Works */}
            <section className="lg:p-[200px_0_100px_0] p-[50px_0_50px_0] relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_13.46%,rgba(201,250,73,0.3)_54.81%,rgba(0,0,0,0)_100%)]"></span>
                <div className="w-full max-w-[910px] mx-auto px-4 relative z-[1] text-center space-y-3">
                    <h2 className="md:text-[60px] text-4xl font-semibold md:leading-[70px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-7">
                        How Token <br /> Exchange Works
                    </h2>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        DEX.earth is powered by advanced smart contracts built on the NCOG Earth Chain, ensuring fast, secure, and transparent on-chain transactions. Swap tokens instantly with minimal slippage using our deep liquidity pools.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Our decentralized exchange offers you complete control over your assets - no intermediaries, no custody risks. Execute swaps directly from your wallet while benefiting from competitive rates and lightning-fast confirmations.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Whether you're trading major cryptocurrencies or exploring new tokens, DEX.earth provides a seamless, secure, and user-friendly trading experience. Join thousands of traders who trust our platform for their crypto exchanges.
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
                            Start Trading
                        </Link>
                    </div>
                </div>
            </section>

            {/* Choose DEX for Smarter Exchanges */}
            <ChooseDEXSection />
        </div>
    )
}

export default Swap