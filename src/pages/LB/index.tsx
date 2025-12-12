import LendingInterface from "../../components/LendingInterface"

const Lending = () => {
    return (
        <div>
            <section className="md:py-[110px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Lend & Borrow <br className="md:block hidden" /> Crypto Assets.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        Maximize your capital efficiency. Supply assets to earn interest or borrow against your collateral instantly using our decentralized lending protocol.
                    </p>
                </div>
            </section>

            <section className="relative pb-[50px]">
                <img
                    className="absolute bottom-0 left-0 w-full opacity-50"
                    src="/images-new/hero-curve-others.png"
                    alt="hero curve"
                />

                <div className="w-full max-w-[900px] mx-auto px-4 relative z-[1]">
                    <LendingInterface />
                </div>
            </section>

            <section className="lg:p-[100px_0_100px_0] p-[50px_0_50px_0] relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_13.46%,rgba(201,250,73,0.1)_54.81%,rgba(0,0,0,0)_100%)]"></span>
                <div className="w-full max-w-[910px] mx-auto px-4 relative z-[1] text-center space-y-3">
                    <h2 className="md:text-[60px] text-4xl font-semibold md:leading-[70px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-7">
                        Protocol Mechanics
                    </h2>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Deposit your preferred assets as collateral. Our smart contracts calculate your borrowing capacity based on real-time Uniswap V3 TWAP prices.
                    </p>
                    <p className="md:text-lg sm:text-base text-sm font-normal text-white">
                        Maintain a healthy Loan-to-Value (LTV) ratio to avoid liquidation. Interest accrues per second based on protocol utilization.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Lending