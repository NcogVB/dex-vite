import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TradingDashboard from './TradingDashboard'
import { useSwap } from '../contexts/SwapContext'

interface Token {
    symbol: string
    name: string
    img: string
    color: string
    balance: number
    realBalance?: string
}

const Converter = () => {
    const {
        account,
        connect,
        getQuote,
        swapExactInputSingle,
        getTokenBalance,
    } = useSwap()

    const [tokens, setTokens] = useState<Token[]>([
        { symbol: 'USDT', name: 'Tether', img: '/images/stock-3.png', color: '#00B67A', balance: 0, realBalance: '0' },
        { symbol: 'USDC', name: 'USD Coin', img: '/images/stock-5.png', color: '#2775CA', balance: 0, realBalance: '0' },
    ])

    const [fromToken, setFromToken] = useState<Token>(tokens[0])
    const [toToken, setToToken] = useState<Token>(tokens[1])
    const [fromAmount, setFromAmount] = useState('')
    const [toAmount, setToAmount] = useState('')
    const [slippageTolerance, setSlippageTolerance] = useState(1)
    const [exchangeRate, setExchangeRate] = useState(0)
    const [isSwapping, setIsSwapping] = useState(false)
    const [isLoadingQuote, setIsLoadingQuote] = useState(false)
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false)
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false)

    const fromDropdownRef = useRef<HTMLDivElement>(null)
    const toDropdownRef = useRef<HTMLDivElement>(null)

    // Update balances from blockchain via context
    const updateBalances = async () => {
        if (!account) return
        const updated = await Promise.all(tokens.map(async t => {
            const realBalance = await getTokenBalance(t.symbol).catch(() => '0')
            return { ...t, realBalance, balance: parseFloat(realBalance) }
        }))
        setTokens(updated)
        setFromToken(updated.find(t => t.symbol === fromToken.symbol) || updated[0])
        setToToken(updated.find(t => t.symbol === toToken.symbol) || updated[1])
    }

    // Fetch quote using context
    const fetchQuote = async (amount: string) => {
        if (!amount || parseFloat(amount) <= 0) {
            setToAmount('')
            setExchangeRate(0)
            return
        }
        setIsLoadingQuote(true)
        try {
            const quote = await getQuote({ fromSymbol: fromToken.symbol, toSymbol: toToken.symbol, amountIn: amount })
            setToAmount(quote.amountOut)
            const rate = parseFloat(quote.amountOut) / parseFloat(amount)
            setExchangeRate(rate)
        } catch (e: any) {
            console.error('Quote error:', e)
            setToAmount('0')
            setExchangeRate(0)
        } finally {
            setIsLoadingQuote(false)
        }
    }

    // Handle swap
    const handleSwap = async () => {
        if (!account) {
            await connect()
            return
        }
        if (!fromAmount || parseFloat(fromAmount) <= 0) {
            alert('Enter a valid amount')
            return
        }
        setIsSwapping(true)
        try {
            const receipt = await swapExactInputSingle({
                fromSymbol: fromToken.symbol,
                toSymbol: toToken.symbol,
                amountIn: fromAmount,
                slippage: slippageTolerance
            })
            alert(`Swap successful! Tx hash: ${receipt.hash}`)
            setFromAmount('')
            setToAmount('')
            setExchangeRate(0)
            setTimeout(updateBalances, 3000)
        } catch (err: any) {
            console.error('Swap failed', err)
            alert(`Swap failed: ${err.message || err}`)
        } finally {
            setIsSwapping(false)
        }
    }

    // Handle token swap
    const handleTokenSwap = (): void => {
        const tempToken = fromToken
        setFromToken(toToken)
        setToToken(tempToken)
        const tempAmount = fromAmount
        setFromAmount(toAmount)
        setToAmount(tempAmount)
    }

    // Handle percentage selection
    const handlePercentageSelect = (percentage: number, isFrom: boolean = true): void => {
        const token = isFrom ? fromToken : toToken
        const amount = (token.balance * (percentage / 100)).toFixed(6)

        if (isFrom) {
            setFromAmount(amount)
        } else {
            setToAmount(amount)
        }
    }

    // Effects
    useEffect(() => { if (account) updateBalances() }, [account])
    useEffect(() => { if (fromAmount && fromToken.symbol !== toToken.symbol) fetchQuote(fromAmount) }, [fromAmount, fromToken, toToken])

    // Dropdown close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(target)) setIsFromDropdownOpen(false)
            if (toDropdownRef.current && !toDropdownRef.current.contains(target)) setIsToDropdownOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="w-full">
            {/* Chart Section */}
            <div className="w-full mb-8">
                <div className="relative w-full h-[600px] md:rounded-[40px] rounded-[20px] overflow-hidden bg-[#00000066] border border-[#FFFFFF1A]">
                    <TradingDashboard />
                </div>
            </div>

            {/* Converter Section */}
            <div className="w-full relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[15px]">
                    {/* Exchange/Pool Tabs */}
                    <div className="grid grid-cols-2 gap-2 bg-[#00000066] p-[6px_8px] rounded-xl border border-[#FFFFFF33] w-[230px] mb-8">
                        <button className="cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm text-[#000000] bg-[#C9FA49]">
                            Exchange
                        </button>
                        <Link
                            to="/pool"
                            className="cursor-pointer flex items-center justify-center h-[45px] rounded-lg font-normal text-sm text-[#FFFFFF]"
                        >
                            Pool
                        </Link>
                    </div>

                    {/* Swap Form */}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        {/* From Token */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[#FFFFFF] font-semibold text-lg">From</h3>
                                <span className="text-[#FFFFFF99] text-sm">Balance: {fromToken.balance.toFixed(4)}</span>
                            </div>

                            <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <input
                                        type="number"
                                        value={fromAmount}
                                        onChange={e => setFromAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-transparent text-[#FFFFFF] text-2xl font-bold outline-none w-full"
                                    />
                                    <div ref={fromDropdownRef} className="relative">
                                        <button
                                            onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                                            className="flex items-center gap-2 bg-[#FFFFFF1A] hover:bg-[#FFFFFF33] transition-colors px-4 py-2 rounded-lg"
                                        >
                                            <img src={fromToken.img} alt={fromToken.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-[#FFFFFF] font-semibold">{fromToken.symbol}</span>
                                            <ChevronDown className={`text-[#FFFFFF] transition-transform ${isFromDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                                        </button>
                                        {isFromDropdownOpen && (
                                            <ul className="absolute right-0 top-full mt-2 w-full bg-[#000000] border border-[#FFFFFF1A] rounded-lg shadow-lg z-10 min-w-[200px]">
                                                {tokens.filter(t => t.symbol !== toToken.symbol).map(token => (
                                                    <li
                                                        key={token.symbol}
                                                        onClick={() => { setFromToken(token); setIsFromDropdownOpen(false) }}
                                                        className="p-3 hover:bg-[#FFFFFF1A] cursor-pointer flex items-center gap-2 text-[#FFFFFF]"
                                                    >
                                                        <img src={token.img} alt={token.name} className="w-6 h-6 rounded-full" />
                                                        <div>
                                                            <div className="font-semibold">{token.symbol}</div>
                                                            <div className="text-xs text-[#FFFFFF99]">{token.name}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {[25, 50, 75, 100].map(pct => (
                                        <button
                                            key={pct}
                                            onClick={() => handlePercentageSelect(pct, true)}
                                            className="flex-1 bg-[#FFFFFF1A] hover:bg-[#C9FA49] hover:text-[#000000] text-[#FFFFFF] py-2 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            {pct === 100 ? 'MAX' : `${pct}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* To Token */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[#FFFFFF] font-semibold text-lg">To</h3>
                                <span className="text-[#FFFFFF99] text-sm">Balance: {toToken.balance.toFixed(4)}</span>
                            </div>

                            <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <input
                                        type="number"
                                        value={toAmount}
                                        readOnly
                                        placeholder="0.00"
                                        className="bg-transparent text-[#FFFFFF] text-2xl font-bold outline-none w-full"
                                    />
                                    <div ref={toDropdownRef} className="relative">
                                        <button
                                            onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                                            className="flex items-center gap-2 bg-[#FFFFFF1A] hover:bg-[#FFFFFF33] transition-colors px-4 py-2 rounded-lg"
                                        >
                                            <img src={toToken.img} alt={toToken.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-[#FFFFFF] font-semibold">{toToken.symbol}</span>
                                            <ChevronDown className={`text-[#FFFFFF] transition-transform ${isToDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                                        </button>
                                        {isToDropdownOpen && (
                                            <ul className="absolute right-0 top-full mt-2 w-full bg-[#000000] border border-[#FFFFFF1A] rounded-lg shadow-lg z-10 min-w-[200px]">
                                                {tokens.filter(t => t.symbol !== fromToken.symbol).map(token => (
                                                    <li
                                                        key={token.symbol}
                                                        onClick={() => { setToToken(token); setIsToDropdownOpen(false) }}
                                                        className="p-3 hover:bg-[#FFFFFF1A] cursor-pointer flex items-center gap-2 text-[#FFFFFF]"
                                                    >
                                                        <img src={token.img} alt={token.name} className="w-6 h-6 rounded-full" />
                                                        <div>
                                                            <div className="font-semibold">{token.symbol}</div>
                                                            <div className="text-xs text-[#FFFFFF99]">{token.name}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {[25, 50, 75, 100].map(pct => (
                                        <button
                                            key={pct}
                                            onClick={() => handlePercentageSelect(pct, false)}
                                            className="flex-1 bg-[#FFFFFF1A] hover:bg-[#C9FA49] hover:text-[#000000] text-[#FFFFFF] py-2 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            {pct === 100 ? 'MAX' : `${pct}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Button Center */}
                    <div className="flex justify-center my-6">
                        <button
                            onClick={handleTokenSwap}
                            className="bg-[#FFFFFF1A] hover:bg-[#FFFFFF33] p-3 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9FA49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 16V4M7 4L3 8M7 4l4 4"></path>
                                <path d="M17 8v12m0 0l4-4m-4 4l-4-4"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Exchange Info */}
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                            <p className="text-[#FFFFFF99] text-sm mb-1">Exchange Rate</p>
                            <p className="text-[#C9FA49] font-semibold text-lg">
                                {exchangeRate > 0 ? `1 ${fromToken.symbol} = ${exchangeRate.toFixed(8)} ${toToken.symbol}` : '--'}
                            </p>
                        </div>
                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                            <p className="text-[#FFFFFF99] text-sm mb-1">Slippage Tolerance</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={slippageTolerance}
                                    onChange={e => setSlippageTolerance(parseFloat(e.target.value) || 1)}
                                    className="bg-[#FFFFFF1A] text-[#C9FA49] font-semibold text-lg px-3 py-1 rounded-lg outline-none w-20"
                                />
                                <span className="text-[#FFFFFF] font-semibold">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Swap Action Button */}
                    <button
                        onClick={handleSwap}
                        disabled={isSwapping || isLoadingQuote || !fromAmount || parseFloat(fromAmount) <= 0}
                        className={`w-full py-4 rounded-[40px] font-semibold text-base transition-all duration-300 ${
                            isSwapping || isLoadingQuote || !fromAmount || parseFloat(fromAmount) <= 0
                                ? 'bg-[#FFFFFF33] text-[#FFFFFF66] cursor-not-allowed'
                                : 'bg-[#C9FA49] text-[#000000] hover:bg-[#b8e842]'
                        }`}
                    >
                        {isSwapping ? 'Swapping...' : !account ? 'Connect Wallet' : isLoadingQuote ? 'Getting Quote...' : 'Exchange'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Converter
