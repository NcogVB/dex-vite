const FAQSection = () => {
    return (
        <section className="bg-[#384711] lg:py-[100px] py-[50px] mt-[50px]">
            <div className="w-full max-w-[1250px] px-4 mx-auto">
                <h2 className="font-normal lg:text-[62px] text-[50px] tracking-[-3%] text-center text-white leading-[68px] mb-6">
                    FAQ
                </h2>
                <p className="font-normal lg:text-lg text-base tracking-[-0.4%] text-center text-white/80">
                    Here you will find the answers to the frequently asked questions.
                </p>
                <div className="lg:pt-[80px] pt-[40px] max-w-[700px] mx-auto lg:space-y-[56px] space-y-[30px]">
                    <div className="border-t-2 border-t-[#C9FA49] pt-[24px]">
                        <h3 className="font-medium md:text-lg text-base tracking-[-0.4%] text-white md:mb-3 mb-2">
                            Q: Is DEX custodial?
                        </h3>
                        <p className="font-normal md:text-base text-sm tracking-[-0.4%] text-white/80">
                            No. DEX.earth is non-custodial, meaning your assets will always
                            remain in your wallet under your control.
                        </p>
                    </div>
                    <div className="border-t-2 border-t-[#C9FA49] pt-[24px]">
                        <h3 className="font-medium md:text-lg text-base tracking-[-0.4%] text-white md:mb-3 mb-2">
                            Q: Which blockchains are supported?
                        </h3>
                        <p className="font-normal md:text-base text-sm tracking-[-0.4%] text-white/80">
                            Our platform supports multiple blockchains, including Ethereum,
                            BNB Chain, Polygon, and more.
                        </p>
                    </div>
                    <div className="border-t-2 border-t-[#C9FA49] pt-[24px]">
                        <h3 className="font-medium md:text-lg text-base tracking-[-0.4%] text-white md:mb-3 mb-2">
                            Q: How can I earn rewards?
                        </h3>
                        <p className="font-normal md:text-base text-sm tracking-[-0.4%] text-white/80">
                            Provide liquidity to pools and earn a share of trading fees.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQSection
