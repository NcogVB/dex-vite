import { ChevronDown, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Currency {
    name: string
    image: string
}

interface NavItem {
    name: string
    href: string
    path: string
}

type DropdownType = 'currency' | 'language' | null

const LandingHeader: React.FC = () => {
    const location = useLocation()
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
        name: 'ETH',
        image: '/images-new/eth.svg',
    })
    const [selectedLanguage, setSelectedLanguage] = useState<string>('Eng')

    const navItems: NavItem[] = [
        { name: 'Exchange', href: '/swap', path: '/swap' },
        { name: 'Pool', href: '/pool', path: '/pool' },
        { name: 'Bridge', href: '/bridge', path: '/bridge' },
        { name: 'Limit Order', href: '/limit', path: '/limit' },
    ]

    const currencies: Currency[] = [
        { name: 'BNB', image: '/images-new/bnb-chain.svg' },
        { name: 'ETH', image: '/images-new/eth.svg' },
        { name: 'USDT', image: '/images-new/usdt.svg' },
    ]

    const languages: string[] = ['Fr', 'Es', 'Eng', 'De']

    const toggleNav = (): void => {
        setIsNavOpen(!isNavOpen)
    }

    const handleDropdownToggle = (dropdown: DropdownType): void => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
    }

    const handleCurrencySelect = (currency: Currency): void => {
        setSelectedCurrency(currency)
        setActiveDropdown(null)
    }

    const handleLanguageSelect = (language: string): void => {
        setSelectedLanguage(language)
        setActiveDropdown(null)
    }

    const isActiveLink = (path: string): boolean => {
        return location.pathname === path
    }

    return (
        <header className="relative pt-5">
            {/* Overlay for mobile */}
            <div
                className={`w-full h-full z-10 fixed top-0 left-0 backdrop-blur-[5px] bg-black/25 transition-opacity duration-300 ${
                    isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleNav}
            />

            <div className="w-full max-w-[1400px] mx-auto px-4 relative">
                {/* Desktop Navigation */}
                <div className="lg:relative hidden lg:block rounded-[60px] p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="grid grid-cols-3 items-center rounded-[60px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-5">
                        {/* Left Links */}
                        <ul className="text-sm font-normal flex items-center gap-10 text-white/80">
                            {navItems.map((item: NavItem, index: number) => (
                                <li key={index}>
                                    <Link
                                        to={item.href}
                                        className={`hover:text-[#C9FA49] transition-colors ${
                                            isActiveLink(item.path) ? 'text-[#C9FA49]' : ''
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Logo */}
                        <div className="flex items-center justify-center">
                            <Link to="/">
                                <img
                                    className="w-full max-w-[120px] mx-auto"
                                    src="/images-new/dex-logo.svg"
                                    alt="dex logo"
                                />
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-10 justify-end">
                            {/* Currency Dropdown */}
                            <div className="relative">
                                <button
                                    className="flex items-center justify-between gap-2 cursor-pointer transition-all"
                                    onClick={() => handleDropdownToggle('currency')}
                                    type="button"
                                >
                                    <span className="flex items-center gap-2 text-sm uppercase font-normal pl-1 pr-1.5 text-white">
                                        <img src={selectedCurrency.image} className="size-[24px] rounded-full" alt={selectedCurrency.name} />
                                        <span>{selectedCurrency.name}</span>
                                    </span>
                                    <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${activeDropdown === 'currency' ? 'rotate-180' : ''}`} />
                                </button>
                                <ul className={`absolute right-0 top-full w-full bg-black border border-white/10 rounded shadow mt-1 z-10 min-w-[130px] transition-all ${activeDropdown === 'currency' ? 'block' : 'hidden'}`}>
                                    {currencies.map((currency: Currency, index: number) => (
                                        <li
                                            key={index}
                                            className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                            onClick={() => handleCurrencySelect(currency)}
                                        >
                                            <img src={currency.image} className="size-[24px] rounded-full" alt={currency.name} />
                                            <span>{currency.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Language Dropdown */}
                            <div className="relative">
                                <button
                                    className="flex items-center justify-between gap-2 cursor-pointer transition-all"
                                    onClick={() => handleDropdownToggle('language')}
                                    type="button"
                                >
                                    <span className="flex items-center gap-2 text-sm uppercase font-normal pl-1 pr-1.5 text-white">
                                        <span>{selectedLanguage}</span>
                                    </span>
                                    <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                                </button>
                                <ul className={`absolute right-0 top-full w-full bg-black border border-white/10 rounded shadow mt-1 z-10 min-w-[100px] transition-all ${activeDropdown === 'language' ? 'block' : 'hidden'}`}>
                                    {languages.map((language: string, index: number) => (
                                        <li
                                            key={index}
                                            className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                            onClick={() => handleLanguageSelect(language)}
                                        >
                                            <span>{language}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Get Started Button */}
                            <Link
                                to="/swap"
                                className="text-[#C9FA49] bg-black text-base leading-[1] font-normal py-5 px-10 rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black text-center"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden relative rounded-[40px] p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="flex items-center w-full justify-between rounded-[40px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-3">
                        <Link to="/">
                            <img className="w-full max-w-[120px] mx-auto" src="/images-new/dex-logo.svg" alt="dex logo" />
                        </Link>
                        <button onClick={toggleNav} className="w-6 cursor-pointer">
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Slide-out */}
                <div className={`lg:hidden fixed top-0 right-0 h-full z-50 w-full max-w-[320px] md:max-w-[360px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-5 transition-transform duration-500 ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Logo and Close */}
                        <div className="flex items-center justify-between mb-10">
                            <Link to="/">
                                <img className="w-full max-w-[120px]" src="/images-new/dex-logo.svg" alt="dex logo" />
                            </Link>
                            <button onClick={toggleNav} className="text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <ul className="text-sm font-normal flex flex-col gap-5 text-white/80 py-10">
                            {navItems.map((item: NavItem, index: number) => (
                                <li key={index}>
                                    <Link
                                        to={item.href}
                                        className={`hover:text-[#C9FA49] ${
                                            isActiveLink(item.path) ? 'text-[#C9FA49]' : ''
                                        }`}
                                        onClick={toggleNav}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Currency & Language & Button */}
                        <div className="flex flex-col gap-5 mt-auto">
                            {/* Currency Dropdown */}
                            <div className="relative w-full">
                                <button
                                    className="w-full flex items-center justify-between gap-2 cursor-pointer transition-all"
                                    onClick={() => handleDropdownToggle('currency')}
                                    type="button"
                                >
                                    <span className="flex items-center gap-2 text-sm uppercase font-normal pl-1 pr-1.5 text-white">
                                        <img src={selectedCurrency.image} className="size-[24px] rounded-full" alt={selectedCurrency.name} />
                                        <span>{selectedCurrency.name}</span>
                                    </span>
                                    <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${activeDropdown === 'currency' ? 'rotate-180' : ''}`} />
                                </button>
                                <ul className={`absolute right-0 bottom-full w-full bg-black border border-white/10 rounded shadow mb-1 z-10 min-w-[130px] transition-all ${activeDropdown === 'currency' ? 'block' : 'hidden'}`}>
                                    {currencies.map((currency: Currency, index: number) => (
                                        <li
                                            key={index}
                                            className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                            onClick={() => handleCurrencySelect(currency)}
                                        >
                                            <img src={currency.image} className="size-[24px] rounded-full" alt={currency.name} />
                                            <span>{currency.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Language Dropdown */}
                            <div className="relative w-full">
                                <button
                                    className="w-full flex items-center justify-between gap-2 cursor-pointer transition-all"
                                    onClick={() => handleDropdownToggle('language')}
                                    type="button"
                                >
                                    <span className="flex items-center gap-2 text-sm uppercase font-normal pl-1 pr-1.5 text-white">
                                        <span>{selectedLanguage}</span>
                                    </span>
                                    <ChevronDown className={`w-[15px] h-[15px] text-white transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                                </button>
                                <ul className={`absolute right-0 bottom-full w-full bg-black border border-white/10 rounded shadow mb-1 z-10 min-w-[100px] transition-all ${activeDropdown === 'language' ? 'block' : 'hidden'}`}>
                                    {languages.map((language: string, index: number) => (
                                        <li
                                            key={index}
                                            className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer"
                                            onClick={() => handleLanguageSelect(language)}
                                        >
                                            <span>{language}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Get Started Button */}
                            <Link
                                to="/swap"
                                className="text-[#C9FA49] bg-black text-base leading-[1] font-normal py-[15px] px-[25px] rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black text-center"
                                onClick={toggleNav}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default LandingHeader
