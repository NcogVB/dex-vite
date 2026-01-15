import { Link } from 'react-router-dom'

const NewHeroSection = () => {
    return (
        <section className="md:py-[110px] py-[50px] relative overflow-hidden">
            <img
                className="absolute top-[-55px] left-1/2 -translate-x-1/2 w-full max-w-max pointer-events-none md:block hidden"
                src="/images-new/hero-bg-vector-icons.png"
                alt="hero bg vector icons"
            />
            <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                    DEX.earth: The Next-Gen <br className="md:block hidden" />{' '}
                    Decentralized Exchange
                </h1>
                <p className="xl:text-lg md:text-base sm:text-sm text-xs text-white font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                    Trade crypto fearlessly, smartly, and securely with DEX.earth — a
                    full-stack blockchain, providing the best infrastructure to swap,
                    stake, and manage digital assets like never before.
                </p>
                <div className="flex items-center justify-center md:gap-[50px] gap-5">
                    <Link
                        to="/swap"
                        className="text-black bg-[#C9FA49] md:text-base text-sm leading-[1] font-normal md:p-[20px_40px] p-[15px_30px] rounded-[40px] border border-transparent transition-all duration-300 hover:border-[#C9FA49] hover:bg-transparent hover:text-white"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default NewHeroSection
