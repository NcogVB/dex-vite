const HowItWorksSection = () => {
    return (
        <section className="lg:py-[50px] py-[25px]">
            <div className="w-full max-w-[1250px] mx-auto px-4">
                <div
                    className="lg:p-[80px_70px] md:p-[50px] p-[15px] bg-cover bg-bottom bg-no-repeat rounded-3xl"
                    style={{ backgroundImage: "url('/images-new/how-to-use-dex.svg')" }}
                >
                    <h2 className="text-[#F1F1EF] lg:text-[40px] text-[30px] font-medium leading-[1] text-center">
                        How DEX.earth Works
                    </h2>
                    <p className="lg:text-base text-sm font-normal text-[#F1F1EF99] md:pt-6 pt-4 text-center">
                        Using DEX.earth for crypto trading is very easy and straightforward.
                    </p>
                    <ul className="md:mt-[50px] mt-[25px] lg:text-lg md:text-base text-xs text-[#F1F1EF] font-normal space-y-[18px]">
                        <li className="flex items-start gap-3">
                            <img src="/images-new/works-point.svg" alt="point" />
                            <p>
                                <span className="font-medium">Connect your wallet</span> – Connect
                                your preferred wallet, ideally a quantum-secure wallet like NCOG
                                Wallet and WalletConnect, to start trading instantly.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src="/images-new/works-point.svg" alt="point" />
                            <p>
                                <span className="font-medium">Trade or add liquidity</span> – Next,
                                swap tokens in seconds, or increase your digital assets by adding
                                liquidity to our pool.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src="/images-new/works-point.svg" alt="point" />
                            <p>
                                <span className="font-medium">Maintain Control</span> – Your funds
                                and rewards will remain in your wallet, and you have full control over
                                them throughout the whole process.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection
