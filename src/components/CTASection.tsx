import { Link } from 'react-router-dom'

const CTASection = () => {
    return (
        <section className="lg:py-[150px] py-[80px]">
            <div className="w-full max-w-[1250px] px-4 mx-auto">
                <div
                    className="h-full w-full bg-cover bg-center bg-no-repeat rounded-2xl flex flex-col justify-center items-center text-center"
                    style={{ backgroundImage: "url('/images-new/choose-dex-smarter.png')" }}
                >
                    <div className="md:py-[100px] py-[60px]">
                        <h2 className="font-medium xl:text-[68px] md:text-[55px] text-[30px] tracking-[-2.72px] xl:leading-[80px] md:mb-[40px] mb-[20px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] text-transparent bg-clip-text">
                            Choose DEX for <br className="md:block hidden" /> Smarter Exchanges
                        </h2>
                        <Link
                            to="/swap"
                            className="text-[#C9FA49] inline-block bg-black md:text-base text-sm leading-[1] font-normal md:p-[20px_30px] p-[15px_20px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black"
                        >
                            Start Trading Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection
