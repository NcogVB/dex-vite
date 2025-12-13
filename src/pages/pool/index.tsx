import { Link } from 'react-router-dom'
import { useState } from 'react'
import { X } from 'lucide-react'
import ChooseDEXSection from '../../components/ChooseDEXSection'
import ConverterPool from '../../components/ConverterPool'
import PositionList from '../../components/PositionList' // Import the new component

const Pool = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const openPanel = () => setIsPanelOpen(true)
    const closePanel = () => setIsPanelOpen(false)

    return (
        <div>
            {/* Hero Section */}
            <section className="md:py-[80px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Pool Exchange <br className="md:block hidden" /> with DEX.
                    </h1>
                    
                    {/* Actions Panel */}
                    <div className="w-full max-w-[690px] mx-auto mt-12 relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[15px]">
                            <div className="w-full">
                                <div className="grid grid-cols-2 gap-2 bg-[#00000066] p-[6px_8px] rounded-xl border border-[#FFFFFF33] w-[230px] mb-6">
                                    <Link to="/swap" className="cursor-pointer flex items-center justify-center h-[45px] rounded-lg font-normal text-sm text-[#FFFFFF]">Exchange</Link>
                                    <button className="cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm text-[#000000] bg-[#C9FA49]">Pool</button>
                                </div>

                                {isPanelOpen ? (
                                    <>
                                        <div className="flex justify-end mb-4">
                                            <button onClick={closePanel} className="p-2 bg-[#FFFFFF1A] hover:bg-[#FFFFFF33] text-white rounded-full transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <ConverterPool />
                                    </>
                                ) : (
                                    <button onClick={openPanel} className="flex items-center justify-center gap-2.5 w-full text-[#000000] bg-[#C9FA49] py-4 rounded-[40px] font-semibold hover:bg-[#b8e842] transition-all">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.2737 5.24038C12.2373 5.23807 12.1976 5.23808 12.1565 5.2381L12.1462 5.2381H10.5344C9.20574 5.2381 8.0689 6.29214 8.0689 7.66667C8.0689 9.0412 9.20574 10.0952 10.5344 10.0952H12.1462L12.1565 10.0952C12.1976 10.0953 12.2373 10.0953 12.2737 10.093C12.8133 10.0586 13.2906 9.63297 13.3307 9.03846C13.3334 8.99948 13.3334 8.95746 13.3333 8.91851L13.3333 8.90794V6.4254L13.3333 6.41483C13.3334 6.37588 13.3334 6.33386 13.3307 6.29488C13.2906 5.70037 12.8133 5.27473 12.2737 5.24038ZM10.3914 8.31429C10.7335 8.31429 11.0108 8.02434 11.0108 7.66667C11.0108 7.309 10.7335 7.01905 10.3914 7.01905C10.0494 7.01905 9.77209 7.309 9.77209 7.66667C9.77209 8.02434 10.0494 8.31429 10.3914 8.31429Z" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.1561 11.0667C12.2519 11.0642 12.3244 11.1536 12.2984 11.2466C12.1694 11.708 11.9647 12.1012 11.6361 12.4323C11.1553 12.917 10.5455 13.1321 9.79214 13.2342C9.06012 13.3334 8.12477 13.3333 6.94388 13.3333H5.58624C4.40535 13.3333 3.47 13.3334 2.73798 13.2342C1.98461 13.1321 1.37485 12.917 0.893972 12.4323C0.413096 11.9477 0.199687 11.3331 0.0984003 10.5738C-1.80205e-05 9.83607 -9.94172e-06 8.89337 2.07827e-07 7.7032V7.63013C-1.00183e-05 6.43996 -1.81695e-05 5.49727 0.0984 4.75949C0.199687 4.00021 0.413096 3.38565 0.893971 2.901C1.37485 2.41634 1.98461 2.20126 2.73798 2.09917C3.47 1.99998 4.40535 1.99999 5.58624 2L6.94388 2C8.12477 1.99999 9.06012 1.99998 9.79214 2.09917C10.5455 2.20126 11.1553 2.41634 11.6361 2.901C11.9647 3.23211 12.1694 3.62536 12.2984 4.08675C12.3244 4.17973 12.2519 4.26917 12.1561 4.26667L10.5343 4.26667C8.71156 4.26667 7.10498 5.71792 7.10498 7.66667C7.10498 9.61542 8.71156 11.0667 10.5343 11.0667L12.1561 11.0667ZM2.40964 4.59048C2.14348 4.59048 1.92771 4.80794 1.92771 5.07619C1.92771 5.34444 2.14348 5.5619 2.40964 5.5619H4.97992C5.24608 5.5619 5.46185 5.34444 5.46185 5.07619C5.46185 4.80794 5.24608 4.59048 4.97992 4.59048H2.40964Z" />
                                        </svg>
                                        Create New Position
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* My Positions Section */}
            <section className="relative pb-[50px] z-[2]">
                <div className="w-full max-w-[900px] mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-white mb-8 text-center">Your Positions</h2>
                    <PositionList />
                </div>
            </section>

            <ChooseDEXSection />
        </div>
    )
}

export default Pool