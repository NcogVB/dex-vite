const Footer = () => (
    <footer>
        <div className="container mx-auto md:px-6 px-4 pb-[30px] pt-[56px]">
            <h1 className="w-full text-center text-[20vw] leading-none font-bold text-[#2A8576]">
                NCOG
            </h1>
            <div className="flex justify-between md:flex-row flex-col-reverse md:items-end mt-[90px] md:gap-4 gap-8">
                <div className="flex gap-5 flex-col">
                    <p className="font-light text-xs leading-[13.2px] text-[#767676] md:text-start text-center">
                        ©2025 Powered by Ncog.earth
                    </p>
                    <p className="font-light text-xs leading-[13.2px] text-[#767676] md:text-start text-center">
                        Charts powered by{' '}
                        <a
                            href="https://www.tradingview.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Trading view
                        </a>
                    </p>
                </div>
                <div className="flex lg:gap-[90px] md:gap-[50px] gap-[25px] font-normal sm:text-[12px] text-[10px] leading-8 text-[#767676]">
                    <div className="flex flex-col md:text-center ">
                        <a href="#">Integrations</a>
                        <a href="#">Calculators</a>
                        <a href="#">Glossary</a>
                        <a href="#">All Blogs</a>
                    </div>
                    <div className="flex flex-col md:text-center ">
                        <a
                            href="https://www.instagram.com/ncogofficial?igsh=ZnJqMGlkYW00NWFt"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            Contact Us
                        </a>
                        <a
                            href="https://x.com/Ncog_Earth?t=DIlcGfcI8bBbp0BsG3p4TA&s=09"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            X
                        </a>
                        <a
                            href="https://t.me/NCOG_Earth"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Telegram
                        </a>
                    </div>
                    <div className="flex flex-col md:text-center ">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms & Conditions</a>
                        <a
                            href=" https://www.facebook.com/share/1C7KpZPYnQ/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            Linkedin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
