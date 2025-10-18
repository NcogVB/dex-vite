import { Link } from 'react-router-dom'

const AboutSection = () => {
    return (
        <>
            {/* Group Logos */}
            <section className="relative md:overflow-hidden lg:mt-[100px] mt-[50px] md:h-[230px] flex items-center justify-center">
                <div className="bg-[#C9FA49] md:h-[80px] p-5 md:absolute md:top-1/2 md:-translate-y-1/2 left-0 w-full md:z-[3] md:flex grid grid-cols-3 items-center xl:gap-16 md:gap-10 gap-5 justify-center md:-rotate-[4deg]">
                    <img
                        className="xl:h-[30px] h-[25px] object-contain"
                        src="/images-new/group-logos-1.svg"
                        alt="group logos"
                    />
                    <img
                        className="xl:h-[30px] h-[25px] object-contain"
                        src="/images-new/group-logos-4.svg"
                        alt="group logos"
                    />
                    <img
                        className="xl:h-[30px] h-[25px] object-contain"
                        src="/images-new/group-logos-5.svg"
                        alt="group logos"
                    />
                    <img
                        className="xl:h-[30px] h-[25px] object-contain"
                        src="/images-new/group-logos-3.svg"
                        alt="group logos"
                    />
                    <img
                        className="xl:h-[30px] h-[25px] object-contain"
                        src="/images-new/group-logos-2.svg"
                        alt="group logos"
                    />
                </div>
                <div className="bg-[#C9FA49] opacity-60 md:h-[80px] absolute top-1/2 -translate-y-1/2 z-[1] w-full"></div>
            </section>

            {/* Our Feature */}
            <section className="relative lg:py-[350px] md:py-[210px] sm:py-[100px] py-[60px]">
                <img
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-max pointer-events-none md:block hidden"
                    src="/images-new/our-feature-crypto.png"
                    alt="our feature crypto icon"
                />
                <div className="text-center font-normal text-white max-w-[750px] px-4 w-full mx-auto">
                    <h3 className="text-[#C9FA49] uppercase md:text-xl text-base font-semibold">
                        OUR FEATURE
                    </h3>
                    <h2 className="md:text-[40px] text-3xl text-center font-semibold leading-[1] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mt-5 mb-6">
                        Swap, Earn, and Grow Without <br className="md:block hidden" />{' '}
                        Intermediaries
                    </h2>
                    <p className="md:text-xl text-xs">
                        Grow your crypto profile quickly with DEX.earth's decentralized
                        trading by swapping assets instantly and earning rewards through
                        staking. We offer 24/7 DEX crypto trading with unified access to
                        the deepest liquidity pools in global digital asset markets.
                    </p>
                    <Link
                        to="/swap"
                        className="text-[#C9FA49] bg-black md:text-base text-sm leading-[1] font-normal md:p-[20px_30px] p-[15px_25px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black inline-block md:mt-12 mt-6"
                    >
                        Start Trading Now
                    </Link>
                </div>
            </section>

            {/* About */}
            <section className="lg:py-[50px] py-[25px]">
                <div className="w-full max-w-[1250px] mx-auto px-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-10 gap-5 items-center">
                        <div>
                            <img
                                className="w-full md:max-w-full max-w-[360px] mx-auto"
                                src="/images-new/what-is-dex.svg"
                                alt="about"
                            />
                        </div>
                        <div>
                            <h3 className="text-[#C9FA49] uppercase xl:text-xl lg:text-lg text-base font-semibold md:mb-5 mb-3">
                                ABOUT
                            </h3>
                            <h2 className="xl:text-[44px] lg:text-4xl text-2xl font-semibold leading-[1] md:mb-6 mb-4">
                                What is DEX?
                            </h2>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white md:mb-5 mb-3">
                                DEX is a next-generation decentralized exchange established
                                in 2025. It's designed to be a one-stop on-chain venue for
                                global crypto traders. Currently, there are a wide number of
                                trading pairs and popular coins available on the exchange.
                            </p>
                            <p className="xl:text-lg lg:text-base text-sm font-normal text-white">
                                Powered by NCOG Earth Chain, DEX.earth is a high-performance
                                crypto exchange building the future of DeFi: fast, flexible,
                                and community-first.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutSection
