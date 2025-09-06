import { ChevronDown, CircleQuestionMarkIcon } from 'lucide-react'
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
    console.log("Connection Status:", {
        account,

    });
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
    const [lastQuoteTime, setLastQuoteTime] = useState(0)
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
            setLastQuoteTime(Date.now())
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
        <div className="mt-[150px] mb-[150px] w-full p-[3.5px] md:rounded-[40px] rounded-[20px]">
            <TradingDashboard />
            <div className="hero-border bg-[linear-gradient(105.87deg,_rgba(0,0,0,0.2)_3.04%,_rgba(0,0,0,0)_96.05%)] relative backdrop-blur-[80px] w-full md:rounded-[40px] rounded-[20px] px-[15px] md:px-[50px] py-[20px] md:py-[60px]">
                {/* Top tabs */}
                <div className="relative z-10 border bg-[#FFFFFF66] inline-flex px-2 py-1.5 rounded-[14px] border-solid border-[#FFFFFF1A] mb-6 gap-2">
                    <Link to="/swap" className="rounded-[8px] bg-white text-[#2A8576] font-bold text-sm leading-[100%] px-[22px] py-[13px] cursor-pointer">Exchange</Link>
                    <Link to="/pool" className="rounded-[8px] text-black font-normal text-sm leading-[100%] px-[22px] py-[13px] cursor-pointer">Pool</Link>
                </div>

                {!account && <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">Connect your wallet to start trading</div>}

                {/* Swap UI */}
                <div className="flex flex-col md:flex-row items-center gap-[25px] md:gap-[51px]">
                    {/* From */}
                    <div className="flex-1 w-full">
                        <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] py-[18px] flex justify-between items-center">
                            <input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.000" className="text-black font-bold text-[22px] bg-transparent border-none outline-none flex-1 mr-4" />
                            <div ref={fromDropdownRef} className="relative min-w-[95px]">
                                <button onClick={() => setIsFromDropdownOpen(o => !o)} className="token-button w-full flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
                                    <img src={fromToken.img} alt={fromToken.name} className="rounded-full size-[23px]" />
                                    <span className="ml-3 mr-8">{fromToken.symbol}</span>
                                    <ChevronDown className={`transition-transform ${isFromDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isFromDropdownOpen && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-auto text-black">
                                        {tokens.filter(t => t.symbol !== toToken.symbol).map(token => (
                                            <li key={token.symbol} onClick={() => { setFromToken(token); setIsFromDropdownOpen(false) }} className="cursor-pointer py-2 pl-3 pr-9 flex items-center hover:bg-gray-100">
                                                <img src={token.img} alt={token.name} className="w-6 h-6 mr-2" />
                                                <div>
                                                    <div>{token.symbol}</div>
                                                    <div className="text-xs text-gray-500">{token.balance.toFixed(4)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3 percentage-redio-buttons">                            {[25, 50, 75, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => {
                                    const bal = parseFloat(fromToken.realBalance || '0');
                                    const calcAmt = ((bal * pct) / 100).toFixed(6);
                                    setFromAmount(calcAmt);
                                }}
                                className="cursor-pointer w-full block bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-md py-[5px] md:py-[11px] text-[16px] md:text-base font-semibold text-[#80888A] md:text-[#1D3B5E] text-center hover:bg-[#3DBEA3] hover:text-white transition-colors peer-checked:bg-[#3DBEA3] peer-checked:text-white"                            >
                                {pct === 100 ? 'MAX' : `${pct}%`}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Swap arrows */}
                    <div>
                        <button onClick={() => { const t = fromToken; setFromToken(toToken); setToToken(t); const a = fromAmount; setFromAmount(toAmount); setToAmount(a) }} className="hover:bg-gray-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" fill="none"><path fill="#000" d="M19.876.5H8.138C3.04.5 0 3.538 0 8.634v11.718c0 5.11 3.04 8.148 8.138 8.148h11.724C24.96 28.5 28 25.462 28 20.366V8.634C28.014 3.538 24.974.5 19.876.5Zm-7.284 21c0 .14-.028.266-.084.406a1.095 1.095 0 0 1-.574.574 1.005 1.005 0 0 1-.406.084 1.056 1.056 0 0 1-.743-.308l-4.132-4.13a1.056 1.056 0 0 1 0-1.484 1.057 1.057 0 0 1 1.485 0l2.34 2.338V7.5c0-.574.476-1.05 1.05-1.05.574 0 1.064.476 1.064 1.05v14Zm8.755-9.128a1.04 1.04 0 0 1-.743.308 1.04 1.04 0 0 1-.742-.308l-2.34-2.338V21.5c0 .574-.475 1.05-1.05 1.05-.574 0-1.05-.476-1.05-1.05v-14c0-.14.028-.266.084-.406.112-.252.308-.462.574-.574a.99.99 0 0 1 .798 0c.127.056.238.126.337.224l4.132 4.13c.406.42.406 1.092 0 1.498Z" /></svg>
                        </button>
                    </div>

                    {/* To */}
                    <div className="flex-1 w-full">
                        <div className="bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] py-[18px] flex justify-between items-center">
                            <input type="number" value={toAmount} readOnly placeholder="0.000" className="text-black font-bold text-[22px] bg-transparent border-none outline-none flex-1 mr-4" />
                            <div ref={toDropdownRef} className="relative min-w-[95px]">
                                <button onClick={() => setIsToDropdownOpen(o => !o)} className="token-button w-full flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
                                    <img src={toToken.img} alt={toToken.name} className="rounded-full size-[23px]" />
                                    <span className="ml-3 mr-8">{toToken.symbol}</span>
                                    <ChevronDown className={`transition-transform ${isToDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isToDropdownOpen && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-auto text-black">
                                        {tokens.filter(t => t.symbol !== fromToken.symbol).map(token => (
                                            <li key={token.symbol} onClick={() => { setToToken(token); setIsToDropdownOpen(false) }} className="cursor-pointer py-2 pl-3 pr-9 flex items-center hover:bg-gray-100">
                                                <img src={token.img} alt={token.name} className="w-6 h-6 mr-2" />
                                                <div>
                                                    <div>{token.symbol}</div>
                                                    <div className="text-xs text-gray-500">{token.balance.toFixed(4)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3 percentage-redio-buttons">                            {[25, 50, 75, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => {
                                    const bal = parseFloat(toToken.realBalance || '0');
                                    const calcAmt = ((bal * pct) / 100).toFixed(6);
                                    setToAmount(calcAmt);
                                }}
                                className="cursor-pointer w-full block bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-md py-[5px] md:py-[11px] text-[16px] md:text-base font-semibold text-[#80888A] md:text-[#1D3B5E] text-center hover:bg-[#3DBEA3] hover:text-white transition-colors peer-checked:bg-[#3DBEA3] peer-checked:text-white"                            >
                                {pct === 100 ? 'MAX' : `${pct}%`}
                            </button>
                        ))}
                        </div>
                    </div>

                </div>

                {/* Info */}
                <div className="mt-[36px] bg-[#FFFFFF66] border border-solid border-[#FFFFFF1A] rounded-[12px] px-[15px] py-[18px] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                        <span>Exchange Rate</span>
                        <p className="text-black font-bold text-[22px] mt-2">{exchangeRate > 0 ? `1 ${fromToken.symbol} = ${exchangeRate.toFixed(8)} ${toToken.symbol}` : '--'}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <span>Quote Valid Until: {lastQuoteTime ? new Date(lastQuoteTime + 30000).toLocaleTimeString() : '--'}</span>
                        <p className="text-black font-bold text-[22px] mt-2">{fromToken.symbol} → {toToken.symbol}</p>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <span className="flex items-center justify-center md:justify-end gap-2">Slippage Tolerance <CircleQuestionMarkIcon size={16} /></span>
                        <div className="flex items-center justify-center md:justify-end mt-2">
                            <input type="number" value={slippageTolerance} onChange={e => setSlippageTolerance(parseFloat(e.target.value) || 1)} className="font-bold text-[22px] text-[#3DBEA3] bg-transparent border-none outline-none w-12 text-right" />%
                        </div>
                    </div>
                </div>

                {/* Swap button */}
                <button
                    onClick={handleSwap}
                    disabled={isSwapping || isLoadingQuote || !fromAmount || parseFloat(fromAmount) <= 0}
                    className={`mt-[25px] md:mt-[51px] rounded-[12px] w-full p-[16px] text-center text-white ${isSwapping || isLoadingQuote ? 'bg-gray-400' : 'bg-[#3DBEA3] hover:bg-[#35a593]'}`}
                >
                    {isSwapping ? 'Swapping...' : !account ? 'Connect Wallet' : isLoadingQuote ? 'Getting Quote...' : 'Exchange'}
                </button>
            </div>
        </div>
    )
}

export default Converter
