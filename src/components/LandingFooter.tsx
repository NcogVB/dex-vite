const LandingFooter = () => (
    <footer>
        <div className="w-full max-w-[1250px] px-4 mx-auto">
            <div className="flex lg:flex-row flex-col justify-between lg:gap-[120px] gap-[50px] lg:pb-[100px] pb-[50px]">
                <div className="w-full lg:max-w-[330px] max-w-[500px]">
                    <div className="mb-3">
                        <img
                            className="w-full max-w-[110px]"
                            src="/images-new/dex-logo.svg"
                            alt="dex logo"
                        />
                    </div>
                    <p className="font-normal text-base tracking-[-0.32px] text-[#F1F1EF] mb-4.5">
                        DEX, a complete solution for crypto traders looking for a complete
                        solution.
                    </p>
                    <form className="flex w-full p-[5px] bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.12)_100%)] rounded-[10px] border gap-2 items-center pl-[15px] border-[#0C150F]">
                        <div className="flex gap-2 items-center flex-1">
                            <svg
                                width="24"
                                height="18"
                                viewBox="0 0 20 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g opacity="0.4">
                                    <path
                                        d="M1.00195 0H19.002C19.5543 0 20.002 0.44772 20.002 1V17C20.002 17.5523 19.5543 18 19.002 18H1.00195C0.449673 18 0.00195312 17.5523 0.00195312 17V1C0.00195312 0.44772 0.449673 0 1.00195 0ZM10.0626 8.6829L3.64917 3.2377L2.35473 4.7623L10.0751 11.3171L17.6564 4.75616L16.3476 3.24384L10.0626 8.6829Z"
                                        fill="#F1F1EF"
                                    />
                                </g>
                            </svg>
                            <input
                                type="email"
                                className="w-full font-medium text-white text-sm tracking-[-0.28px] text-[#F1F1EF99] outline-none bg-transparent placeholder:text-[#F1F1EF99]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] hover:bg-[linear-gradient(360deg,#1F2321_0%,#020B05_100%)] py-[10px] px-[28px] rounded-[8px] font-medium text-base tracking-[-0.32px] text-[#F1F1EF] cursor-pointer"
                        >
                            Submit
                        </button>
                    </form>
                    <p className="font-medium text-base tracking-[-0.32px] text-[#F1F1EF] mt-2">
                        Subscribe to our newsletter
                    </p>
                </div>
                <div className="grid sm:grid-cols-4 grid-cols-2 flex-grow sm:gap-5 gap-7">
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.56px] text-[#F1F1EF] md:mb-6 mb-4 uppercase">
                            Pages
                        </h3>
                        <ul className="font-normal lg:text-base text-sm tracking-[-0.32px] text-[#F1F1EF] lg:space-y-4 space-y-2">
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="https://ncog.earth/about.html" className="hover:text-[#C9FA49]" target="_blank" rel="noopener noreferrer">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Career
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Reviews
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.56px] text-[#F1F1EF] md:mb-6 mb-4 uppercase">
                            Contact US
                        </h3>
                        <ul className="font-normal lg:text-base text-sm tracking-[-0.32px] text-[#F1F1EF] lg:space-y-4 space-y-2">
                            <li>
                                <a href="https://ncog.earth/contact.html" className="hover:text-[#C9FA49]">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/ncog_earth/#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#C9FA49]"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://t.me/NCOG_Earth"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#C9FA49]"
                                >
                                    Telegram
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.56px] text-[#F1F1EF] md:mb-6 mb-4 uppercase">
                            RESOURCES
                        </h3>
                        <ul className="font-normal lg:text-base text-sm tracking-[-0.32px] text-[#F1F1EF] lg:space-y-4 space-y-2">
                            <li>
                                <a href="https://insights.ncog.earth/" className="hover:text-[#C9FA49]">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.56px] text-[#F1F1EF] md:mb-6 mb-4 uppercase">
                            UTILITIES
                        </h3>
                        <ul className="font-normal lg:text-base text-sm tracking-[-0.32px] text-[#F1F1EF] lg:space-y-4 space-y-2">
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#C9FA49]">
                                    Licenses
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t-[#292929] border-t border-solid flex md:flex-row flex-col-reverse justify-between gap-4 items-center md:py-8 py-4">
                <p className="font-normal text-sm tracking-[-0.28px] text-[#F1F1EF]">
                    © All Rights Reserved - DEX.earth 2025-2026
                </p>
                <div className="flex items-center gap-[10px] text-[#F1F1EF]">
                    <a
                        href="https://www.instagram.com/ncog_earth/#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1E1E1E] hover:bg-[#C9FA49] hover:text-[#1E1E1E] size-[24px] rounded-[4px] flex justify-center items-center cursor-pointer"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                    <a
                        href="https://x.com/ncog_earth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1E1E1E] hover:bg-[#C9FA49] hover:text-[#1E1E1E] size-[24px] rounded-[4px] flex justify-center items-center cursor-pointer"
                    >
                        <svg
                            width="16"
                            height="14"
                            viewBox="0 0 16 14"
                            fill="currentcolor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12.1391 0.5H14.3444L9.52645 6.0067L15.1944 13.5H10.7565L7.28045 8.9553L3.30316 13.5H1.0965L6.24985 7.61L0.8125 0.5H5.36316L8.50515 4.654L12.1391 0.5ZM11.3652 12.18H12.5871L4.69916 1.75067H3.38783L11.3652 12.18Z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/company/ncog-earth/"
                        className="bg-[#1E1E1E] hover:bg-[#C9FA49] hover:text-[#1E1E1E] size-[24px] rounded-[4px] flex justify-center items-center cursor-pointer"
                    >
                        <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="currentcolor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3.62763 1.33394C3.62739 1.87681 3.29803 2.36533 2.79487 2.56914C2.29171 2.77295 1.71523 2.65135 1.33725 2.26168C0.959274 1.87201 0.855284 1.29208 1.07431 0.795364C1.29335 0.298644 1.79167 -0.0156765 2.3343 0.000603497C3.05501 0.0222435 3.62796 0.612904 3.62763 1.33394ZM3.66763 3.65394H1.00097V12.0006H3.66763V3.65394ZM7.88102 3.65394H5.22762V12.0006H7.85432V7.6206C7.85432 5.1806 11.0343 4.9539 11.0343 7.6206V12.0006H13.6676V6.7139C13.6676 2.6006 8.96102 2.75394 7.85432 4.7739L7.88102 3.65394Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>
)

export default LandingFooter
