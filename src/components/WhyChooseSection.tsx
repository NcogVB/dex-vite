import { Link } from 'react-router-dom'

const WhyChooseSection = () => {
    return (
        <section className="lg:py-[50px] py-[25px] relative">
            <div className="w-full max-w-[1250px] mx-auto px-4">
                <h2 className="lg:text-[60px] md:text-[50px] text-[30px] text-center font-semibold leading-[1] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-[50px]">
                    Why Choose <br className="md:block hidden" /> DEX.earth?
                </h2>

                <div className="flex flex-wrap gap-y-[24px] lg:mx-[-15px] md:mx-[-7px]">
                    {/* Non-custodial */}
                    <div className="md:w-[60%] w-full lg:px-[15px] md:px-[7px]">
                        <div className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] rounded-3xl overflow-hidden flex flex-col h-full">
                            <div className="lg:p-[30px_30px_40px_30px] p-[20px_20px_30px_20px] flex-1">
                                <h3 className="lg:text-xl text-lg font-semibold text-[#F1F1EF] mb-2.5">
                                    Non-custodial
                                </h3>
                                <p className="lg:text-base text-sm font-normal text-[#F1F1EF99]">
                                    We don't hold your assets; all digital funds, rewards, and
                                    gains are entirely yours.
                                </p>
                            </div>
                            <img
                                className="w-full max-w-max ml-auto"
                                src="/images-new/non-custodial.png"
                                alt="non-custodial"
                            />
                        </div>
                    </div>

                    {/* Cross-chain */}
                    <div className="md:w-[40%] w-full lg:px-[15px] md:px-[7px]">
                        <div className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] rounded-3xl overflow-hidden flex flex-col h-full">
                            <div className="lg:p-[30px_30px_40px_30px] p-[20px_20px_30px_20px] flex-1">
                                <h3 className="lg:text-xl text-lg font-semibold text-[#F1F1EF] mb-2.5">
                                    Cross-chain
                                </h3>
                                <p className="lg:text-base text-sm font-normal text-[#F1F1EF99]">
                                    At DEX.earth, you can trade from different blockchain
                                    platforms all from one unified interface.
                                </p>
                            </div>
                            <img
                                className="w-full max-w-max ml-auto"
                                src="/images-new/cross-chain.png"
                                alt="cross-chain"
                            />
                        </div>
                    </div>

                    {/* Controlled low fees */}
                    <div className="md:w-[50%] w-full lg:px-[15px] md:px-[7px]">
                        <div className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] rounded-3xl overflow-hidden flex flex-col h-full">
                            <div className="lg:p-[30px_30px_40px_30px] p-[20px_20px_30px_20px] flex-1">
                                <h3 className="lg:text-xl text-lg font-semibold text-[#F1F1EF] mb-2.5">
                                    Controlled low fees
                                </h3>
                                <p className="lg:text-base text-sm font-normal text-[#F1F1EF99]">
                                    Our fees are very low and controlled for top-class
                                    infrastructure to provide with a safe, secure, and speedy
                                    trading experience.
                                </p>
                            </div>
                            <img
                                className="w-full max-w-max ml-auto"
                                src="/images-new/controlled-low-fees.png"
                                alt="controlled-low-fees"
                            />
                        </div>
                    </div>

                    {/* Deep liquidity */}
                    <div className="md:w-[50%] w-full lg:px-[15px] md:px-[7px]">
                        <div className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] rounded-3xl overflow-hidden flex flex-col h-full">
                            <img
                                className="w-full"
                                src="/images-new/deep-liquidity.png"
                                alt="deep-liquidity"
                            />
                            <div className="p-[40px_30px_30px_30px] flex-1">
                                <h3 className="lg:text-xl text-lg font-semibold text-[#F1F1EF] mb-2.5">
                                    Deep liquidity
                                </h3>
                                <p className="lg:text-base text-sm font-normal text-[#F1F1EF99]">
                                    Enjoy unmatched prices and minimum slippages with one of
                                    the deepest pool liquidity in the world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Post Quantum security */}
                    <div className="w-[100%] lg:px-[15px] md:px-[7px]">
                        <div className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] rounded-3xl overflow-hidden flex md:flex-row flex-col items-center h-full">
                            <div className="lg:p-[56px] md:p-[30px] p-[15px] lg:min-w-[600px] md:min-w-[400px]">
                                <h3 className="text-[#F1F1EF] lg:text-[40px] text-[30px] font-medium leading-[1]">
                                    Post Quantum security
                                </h3>
                                <p className="lg:text-base md:text-sm text-xs font-normal text-[#F1F1EF99] py-6">
                                    We audit smart contracts and work with highly skilled
                                    developers to ensure your safety and security when trading
                                    online. NCOG Earth Chain provides post-quantum security to
                                    all your data and transactions.
                                </p>
                                <Link
                                    to="/swap"
                                    className="text-[#C9FA49] bg-transparent md:text-base text-sm leading-[1] font-normal md:p-[20px_30px] p-[15px_20px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black inline-block"
                                >
                                    Get Started Now
                                </Link>
                            </div>
                            <img
                                className="w-full mt-5 md:max-w-full max-w-[300px] ml-auto"
                                src="/images-new/post-quantum-security.png"
                                alt="post-quantum-security"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseSection
