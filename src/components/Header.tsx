import { ChevronDown, Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import WalletButton  from './WalletButton'

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

const Header: React.FC = () => {
    const location = useLocation()
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
        name: 'ETH',
        image: '/images/eth.png',
    })
    const [selectedLanguage, setSelectedLanguage] = useState<string>('Eng')
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [lastScrollY, setLastScrollY] = useState<number>(0)

    const navItems: NavItem[] = [
        { name: 'Exchange', href: 'swap', path: '/swap' },
        { name: 'Pool', href: 'pool', path: '/pool' },
        { name: 'Bridge', href: 'bridge', path: '/bridge' },
        { name: 'Limit Order', href: 'limit', path: '/limit' },
    ]

    const currencies: Currency[] = [
        { name: 'ETH', image: '/images/eth.png' },
        { name: 'BTC', image: '/images/bnb.png' },
        { name: 'USDT', image: '/images/stock-2.png' },
    ]

    const languages: string[] = ['Eng', 'Fr', 'Es', 'De']

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = (): void => {
            const currentScrollY = window.scrollY

            if (currentScrollY < lastScrollY) {
                // Scrolling up
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past 100px
                setIsVisible(false)
                // Close dropdowns when hiding navbar
                setActiveDropdown(null)
            }

            setLastScrollY(currentScrollY)
        }

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true })

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

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
        <div
            className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-[36px] pt-3 pb-3 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* Overlay */}
            <div
                className={`fixed w-full h-screen bg-black/15 z-10 backdrop-blur-sm left-0 top-0 transition-opacity duration-300 ${
                    isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } lg:hidden`}
                onClick={toggleNav}
            />

            {/* Main Navigation */}
            <nav
                className={`flex lg:flex-row flex-col lg:items-center lg:justify-between bg-white backdrop-blur-md px-4 py-2.5 lg:rounded-full lg:static fixed top-0 right-0 lg:h-auto h-screen z-20 lg:gap-0 gap-8 w-full lg:max-w-full max-w-[300px] transition-transform duration-300 ease-in-out shadow-lg lg:shadow-md ${
                    isNavOpen ? 'translate-x-0' : 'translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Navigation Links */}
                <ul className="lg:order-0 order-2 lg:flex-grow flex lg:flex-row flex-col gap-6 font-normal text-sm xl:pl-[25px]">
                    {navItems.map((item: NavItem, index: number) => (
                        <li key={index} className="relative group">
                            <Link
                                to={item.href}
                                className={`relative block transition-all duration-200 hover:text-black ${
                                    isActiveLink(item.path)
                                        ? 'text-black font-semibold'
                                        : 'text-black'
                                }`}
                            >
                                {item.name}
                                {/* Green dot indicator */}
                                <span
                                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#2A8576] rounded-full transition-all duration-200 ${
                                        isActiveLink(item.path)
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Logo */}
                <div className="lg:order-0 order-1 flex items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="lg:absolute static lg:left-1/2 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2"
                    >
                        <img
                            alt="logo"
                            className="w-[120px] max-w-[170px] hover:scale-105 transition-transform duration-200"
                            src="/images/logo.png"
                        />
                    </Link>

                    {/* Close button for mobile */}
                    <button
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={toggleNav}
                        type="button"
                        aria-label="Close navigation menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Right side controls */}
                <div className="lg:order-0 order-3 lg:flex-grow flex lg:flex-row flex-col lg:items-center xl:gap-[40px] lg:gap-5 gap-6 lg:justify-end">
                    {/* Currency Dropdown */}
                    <div className="relative">
                        <button
                            className="w-full flex items-center lg:justify-start justify-between cursor-pointer gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleDropdownToggle('currency')}
                            type="button"
                            aria-label="Select currency"
                            aria-expanded={activeDropdown === 'currency'}
                        >
                            <img
                                className="w-6 h-6 min-w-[24px] object-cover rounded-full"
                                src={selectedCurrency.image}
                                alt={selectedCurrency.name}
                            />
                            <h4 className="text-gray-800 flex-grow text-left font-medium">
                                {selectedCurrency.name}
                            </h4>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    activeDropdown === 'currency'
                                        ? 'rotate-180'
                                        : ''
                                }`}
                            />
                        </button>

                        <ul
                            className={`absolute top-full left-0 z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
                                activeDropdown === 'currency'
                                    ? 'opacity-100 visible'
                                    : 'opacity-0 invisible'
                            }`}
                        >
                            {currencies.map(
                                (currency: Currency, index: number) => (
                                    <li key={index}>
                                        <button
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                            onClick={() =>
                                                handleCurrencySelect(currency)
                                            }
                                            type="button"
                                        >
                                            <img
                                                src={currency.image}
                                                className="w-6 h-6 min-w-[24px] object-cover rounded-full"
                                                alt={currency.name}
                                            />
                                            <h4 className="text-sm font-medium text-gray-800">
                                                {currency.name}
                                            </h4>
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            className="w-full flex items-center lg:justify-start justify-between cursor-pointer gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleDropdownToggle('language')}
                            type="button"
                            aria-label="Select language"
                            aria-expanded={activeDropdown === 'language'}
                        >
                            <span className="text-gray-800 font-medium">
                                {selectedLanguage}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    activeDropdown === 'language'
                                        ? 'rotate-180'
                                        : ''
                                }`}
                            />
                        </button>

                        <ul
                            className={`absolute top-full left-0 z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
                                activeDropdown === 'language'
                                    ? 'opacity-100 visible'
                                    : 'opacity-0 invisible'
                            }`}
                        >
                            {languages.map(
                                (language: string, index: number) => (
                                    <li key={index}>
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-sm font-medium text-gray-800"
                                            onClick={() =>
                                                handleLanguageSelect(language)
                                            }
                                            type="button"
                                        >
                                            {language}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Connect Wallet Button */}
                    <WalletButton />
                </div>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden flex items-center justify-between gap-3 mt-2">
                <img
                    alt="logo"
                    className="w-full max-w-[120px]"
                    src="/images/logo.png"
                />
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={toggleNav}
                    type="button"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-8 h-8" />
                </button>
            </div>
        </div>
    )
}

export default Header
