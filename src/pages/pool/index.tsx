import { ArrowRight, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import AskExpertsSection from '../../components/AskExpertsSection'
import EarnPassiveIncomeSection from '../../components/EarnPassiveIncomeSection'
import WalletButton from '../../components/WalletButton'

const Pool = () => {
    return (
        <div>
            <div className="hero-section">
                <div className="flex-grow flex flex-col items-center px-4 pt-[40px] md:pt-[88px] container mx-auto w-full">
                    <button
                        aria-label="Join our community"
                        className="flex items-center gap-4 text-black font-normal text-[14.29px] leading-[15.84px] bg-white border border-[#eaeaea] rounded-full px-[15px] py-2 mb-5 transition"
                    >
                        <span>⚡</span>
                        <span>Join our community</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <h1 className="font-semibold text-[40px] leading-[48px] md:text-[80px] md:leading-[88px] text-center align-middle capitalize mb-3 text-[#3DBEA3] max-w-[720px] mx-auto">
                        <span className="text-[#2A8576]"> Pool </span> Exchange
                        with DEX.
                    </h1>
                    <p className="text-center font-normal md:text-[17.72px] md:leading-7 text-[#767676] max-w-[700px] mb-6">
                        At our cryptocurrency token exchange platform, we offer
                        an easy-to-use token swap service that allows you to
                        seamlessly exchange one type of token for another with
                        maximum efficiency.
                    </p>
                    <WalletButton />
                    <div className="hero-border mt-[56px] w-full p-[3.5px] md:rounded-[40px] rounded-[20px] max-w-[690px]">
                        <div className="bg-[linear-gradient(105.87deg,_rgba(0,0,0,0.2)_3.04%,_rgba(0,0,0,0)_96.05%)] relative backdrop-blur-[80px] w-full md:rounded-[40px] rounded-[20px] px-[15px] md:px-[50px] py-[20px] md:py-[60px]">
                            <div className="relative z-10 border bg-[#FFFFFF66] inline-flex px-2 py-1.5 rounded-[14px] border-solid border-[#FFFFFF1A] mb-6 gap-2">
                                <Link
                                    to="/swap"
                                    className="rounded-[8px] text-black font-normal text-sm leading-[100%] px-[22px] py-[13px] cursor-pointer"
                                >
                                    Exchange
                                </Link>
                                <Link
                                    to="/pool"
                                    className="rounded-[8px] bg-white text-[#2A8576] font-bold text-sm leading-[100%] px-[22px] py-[13px] cursor-pointer"
                                >
                                    Pool
                                </Link>
                            </div>
                            <button
                                className="relative z-10 w-full bg-[#3DBEA3] text-white font-medium text-base leading-[17.6px] rounded-full flex items-center justify-center space-x-2 mb-6 py-4"
                                type="button"
                            >
                                <Wallet />
                                <span>Add Liquidity</span>
                            </button>
                            <div className="relative z-10 rounded-[12px] border bg-[#FFFFFF66] border-solid border-[#FFFFFF1A] p-10 text-center">
                                <svg
                                    className="mx-auto mb-[22px]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    fill="none"
                                >
                                    <path
                                        stroke="#2A8576"
                                        stroke-linecap="round"
                                        stroke-width="3.5"
                                        d="M5.333 5.333h53.333"
                                    />
                                    <path
                                        stroke="#3DBEA3"
                                        stroke-linecap="round"
                                        stroke-width="3.5"
                                        d="m24 28 3.448-3.448c.889-.889 1.333-1.333 1.885-1.333.553 0 .997.444 1.886 1.333l1.562 1.562c.889.89 1.333 1.334 1.886 1.334.552 0 .996-.445 1.885-1.334L40 22.667"
                                    />
                                    <path
                                        stroke="#2A8576"
                                        stroke-linecap="round"
                                        stroke-width="3.5"
                                        d="M32 56V45.333M26.667 58.667 32 56M37.333 58.667 32 56"
                                    />
                                    <path
                                        stroke="#2A8576"
                                        stroke-width="3.5"
                                        d="M53.334 5.333V28c0 8.171 0 12.257-2.678 14.795-2.678 2.538-6.988 2.538-15.608 2.538h-6.095c-8.62 0-12.93 0-15.608-2.538-2.678-2.538-2.678-6.624-2.678-14.795V5.333"
                                    />
                                </svg>

                                <p className="text-black font-semibold text-xl leading-7 max-w-[380px] mx-auto">
                                    Your Active V2 Liquidity positions
                                    <br />
                                    will appear here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="md:py-[90px] py-[40px] px-4">
                <h2 className="font-medium lg:text-[64px] sm:text-[48px] text-[32px] md:leading-[70.4px] leading-[50px] text-center text-[#3DBEA3] max-w-[514px] mx-auto">
                    How
                    <span className="text-[#2A8576]">Pool </span>Exchange Works
                </h2>
                <p className="font-normal md:text-base text-xs md:leading-[25px] text-center text-[#767676] max-w-[910px] mx-auto pt-[30px]">
                    Ol regnbågsbarn sedan trigraf. Sus bloggosfär. Flexitarian
                    hemin i ben. Disamma. Sat diaren, i idyse. Pånen tiktigt.
                    Ningar polyna. Premussa. Tetrabelt dispere. Epinera.
                    Terranomi fabelt. Dore ser. Ponde nyn. Viter luvis utom
                    dide. Pansexuell låtir om än bobesm. Metrogram vekåvis.
                    Tjejsamla preligt i polig. Niseligen primatyp bibel. Prertad
                    lese. Mytogen bipod trevigon. Rorat filototal. Nepämohet
                    mongen. Rende okålig oaktat paraktiga. Kravallturism pahet.
                    Tick tral. Ananigt lask. Non. Otrohetskontroll egode. Vass
                    stenossade dekapött. Hint krislåda. Kvasise R-tal mivis.
                    Timent bonus malus, kalsongbadare. Plare. Klimatflykting
                    ohidengen. Robotjournalistik pernetik. Spere magisk lang.
                    Tell movis. Rögt lönöligen. Homor åtöligt, töposm. Prede
                    ament. Safariforskning tetrasasade förutom gågging. Reaska
                    multiren dial. Pren previs. Geosa progipäligt. Jypäng
                    snippa. Askbränd pådytining raligt. Platreck kollektomat i
                    mill. Pladade kynde. Andronomi. Progiras våsm fast intrase.
                    Semiren peteteles, homodent. Incel kaktig. Yck eska plus
                    pneumalog. Homon ol megan.
                </p>
                <div className="flex justify-center gap-3 md:mt-[60px] mt-[40px] items-center">
                    <WalletButton />
                    <a
                        href="#"
                        className="border-2 border-[#E9E9E9] md:px-[32px] px-[20px] py-[16px] rounded-[80px] font-medium text-base text-[#000000]"
                    >
                        Learn More
                    </a>
                </div>
            </section>
            <AskExpertsSection />
            <EarnPassiveIncomeSection />
        </div>
    )
}

export default Pool
