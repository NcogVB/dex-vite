import { Menu, X, Wallet, ChevronDown, LogOut } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'

interface NavItem {
    name: string
    href: string
    path: string
}

const LandingHeader: React.FC = () => {
    const location = useLocation()
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Get disconnect function and isPolygon status
    const { account, balance, isPolygon, connectWallet, disconnectWallet, isConnecting } = useWallet()

    const navItems: NavItem[] = [
        { name: 'swap', href: '/swap', path: '/swap' },
        { name: 'Pool', href: '/pool', path: '/pool' },
        { name: 'Bridge', href: '/bridge', path: '/bridge' },
        { name: 'Exchange', href: '/Exchange', path: '/Exchange' },
    ]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleNav = () => setIsNavOpen(!isNavOpen)
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

    const isActiveLink = (path: string) => location.pathname === path

    const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`

    // --- Wallet Component with Dropdown ---
    const WalletSection = ({ className }: { className?: string }) => {
        if (account) {
            return (
                <div className={`relative ${className}`} ref={dropdownRef}>
                    <div
                        className="flex flex-col md:flex-row items-center gap-3 cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        {/* Network Badge */}
                        <div className="hidden md:flex items-center px-4 py-2 rounded-[40px] border border-[#C9FA49]/30 bg-[#1F2321] text-white/80 text-sm">
                            <span className={`w-2 h-2 rounded-full mr-2 ${isPolygon ? 'bg-[#C9FA49]' : 'bg-red-500'}`}></span>
                            {isPolygon ? 'Polygon' : 'Wrong Network'}
                        </div>

                        {/* Balance & Address Button */}
                        <div className="flex items-center bg-black border border-[#C9FA49] rounded-[40px] p-1 pr-5 transition-all hover:bg-[#1F2321]">
                            <div className="px-4 py-2 rounded-[30px] bg-[#1F2321] text-[#C9FA49] text-sm font-medium mr-3">
                                {balance} MATIC
                            </div>
                            <div className="flex items-center gap-2 text-white/90 font-medium text-sm">
                                <Wallet className="w-4 h-4" />
                                {formatAddress(account)}
                                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Disconnect Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-[#1F2321] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                            <button
                                onClick={() => {
                                    disconnectWallet();
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/5 hover:text-[#C9FA49] flex items-center gap-2 text-sm transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            )
        }

        return (
            <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`text-[#C9FA49] bg-black text-base leading-[1] font-normal py-4 px-8 rounded-[40px] border border-[#C9FA49] transition-all duration-300 hover:bg-[#C9FA49] hover:text-black text-center flex items-center justify-center gap-2 ${className}`}
            >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
        )
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent pb-5">
            <div
                className={`w-full h-full z-10 fixed top-0 left-0 backdrop-blur-[5px] bg-black/25 transition-opacity duration-300 ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={toggleNav}
            />

            <div className="w-full max-w-[1400px] mx-auto px-4 relative pt-5">
                {/* Desktop Navigation */}
                <div className="lg:relative hidden lg:block rounded-[60px] p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-[60px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-3 pl-8 pr-3">
                        <ul className="text-sm font-normal flex items-center gap-8 text-white/80">
                            {navItems.map((item: NavItem, index: number) => (
                                <li key={index}>
                                    <Link to={item.href} className={`hover:text-[#C9FA49] transition-colors ${isActiveLink(item.path) ? 'text-[#C9FA49]' : ''}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-center px-4">
                            <Link to="/">
                                <img className="h-10 w-auto" src="/images-new/dex-logo.svg" alt="dex logo" />
                            </Link>
                        </div>

                        <div className="flex items-center justify-end">
                            <WalletSection />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Header */}
                <div className="lg:hidden relative rounded-[40px] p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="flex items-center w-full justify-between rounded-[40px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-3">
                        <Link to="/"><img className="w-full max-w-[100px]" src="/images-new/dex-logo.svg" alt="dex logo" /></Link>
                        <button onClick={toggleNav} className="w-6 cursor-pointer">
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Slide-out */}
                <div className={`lg:hidden fixed top-0 right-0 h-full z-50 w-full max-w-[320px] bg-[linear-gradient(180deg,#1F2321_0%,#020B05_100%)] backdrop-blur-sm p-5 transition-transform duration-500 ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <Link to="/"><img className="w-[100px]" src="/images-new/dex-logo.svg" alt="dex logo" /></Link>
                            <button onClick={toggleNav} className="text-white"><X className="w-6 h-6" /></button>
                        </div>

                        {/* Mobile Wallet Details */}
                        {account && (
                            <div className="mb-6 p-4 rounded-2xl bg-[#1F2321] border border-white/10">
                                <div className="flex justify-between text-sm text-white/60 mb-2">
                                    <span>Network</span>
                                    <span className={isPolygon ? "text-[#C9FA49]" : "text-red-500"}>{isPolygon ? 'Polygon' : 'Wrong Network'}</span>
                                </div>
                                <div className="flex justify-between text-sm text-white/60 mb-2">
                                    <span>Balance</span>
                                    <span className="text-white">{balance} MATIC</span>
                                </div>
                                <div className="flex justify-between text-sm text-white/60 mb-4">
                                    <span>Address</span>
                                    <span className="text-white">{formatAddress(account)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        disconnectWallet();
                                        toggleNav();
                                    }}
                                    className="w-full py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}

                        <ul className="text-sm font-normal flex flex-col gap-4 text-white/80">
                            {navItems.map((item: NavItem, index: number) => (
                                <li key={index}>
                                    <Link to={item.href} className={`hover:text-[#C9FA49] block py-2 ${isActiveLink(item.path) ? 'text-[#C9FA49]' : ''}`} onClick={toggleNav}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            {!account && <WalletSection className="w-full" />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default LandingHeader