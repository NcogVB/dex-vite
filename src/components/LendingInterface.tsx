import { ChevronDown, Info, ShieldCheck, Wallet } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useLendingContract } from '../hooks/useLendingContract.'

interface Token {
    symbol: string
    name: string
    address: string
    img: string
    balance: number
}

// Add your specific token addresses here
const TOKENS: Token[] = [
    { symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', img: '/images/stock-5.png', balance: 0 },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', img: '/images/ethereum-logo.png', balance: 0 },
    { symbol: 'USDT', name: 'Tether', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', img: '/images/stock-3.png', balance: 0 },
]

const LendingInterface = () => {
    const { account, connectWallet } = useWallet()
    const { stats, executeTransaction, isProcessing } = useLendingContract()

    const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply')
    const [actionType, setActionType] = useState<'deposit' | 'withdraw' | 'borrow' | 'repay'>('deposit')
    const [amount, setAmount] = useState('')
    const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (activeTab === 'supply') setActionType('deposit')
        else setActionType('borrow')
    }, [activeTab])

    const handleAction = async () => {
        if (!account) return connectWallet()
        try {
            await executeTransaction(actionType, selectedToken.address, amount)
            setAmount('')
            alert('Transaction Successful!')
        } catch (e: any) {
            alert(e.message || 'Transaction Failed')
        }
    }

    const handleMax = () => {
        // Simple mock for max, in real app fetch actual wallet balance or contract balance
        if (actionType === 'withdraw') setAmount(stats.collateralAmount)
        else if (actionType === 'repay') setAmount(stats.debtAmount)
        else setAmount('100') 
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getHealthColor = (hf: string) => {
        const val = parseFloat(hf)
        if (val === 0) return 'text-[#FFFFFF99]'
        if (val < 1.1) return 'text-red-500'
        if (val < 1.5) return 'text-yellow-500'
        return 'text-[#C9FA49]'
    }

    return (
        <div className="w-full">
            {/* Dashboard Stats */}
            <div className="w-full mb-8 relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[30px] p-[20px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-[#FFFFFF99] text-sm mb-2">
                                <ShieldCheck size={16} className="text-[#C9FA49]" />
                                <span>Health Factor</span>
                            </div>
                            <div className={`text-2xl font-bold ${getHealthColor(stats.healthFactor)}`}>
                                {parseFloat(stats.healthFactor) > 100 ? '> 100' : parseFloat(stats.healthFactor).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-[#FFFFFF99] text-sm mb-2">
                                <Info size={16} />
                                <span>Borrow APR</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {(parseFloat(stats.borrowAPR) * 100).toFixed(2)}%
                            </div>
                        </div>

                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-[#FFFFFF99] text-sm mb-2">
                                <Wallet size={16} />
                                <span>My Debt</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {parseFloat(stats.debtAmount).toFixed(4)} <span className="text-sm font-normal text-[#FFFFFF99]">Unit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Action Card */}
            <div className="w-full relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[15px]">
                    
                    <div className="flex gap-4 mb-8 border-b border-[#FFFFFF1A] pb-4">
                        <button 
                            onClick={() => setActiveTab('supply')}
                            className={`text-lg font-semibold px-4 py-2 transition-colors ${activeTab === 'supply' ? 'text-[#C9FA49] border-b-2 border-[#C9FA49]' : 'text-[#FFFFFF99] hover:text-white'}`}
                        >
                            Supply Collateral
                        </button>
                        <button 
                            onClick={() => setActiveTab('borrow')}
                            className={`text-lg font-semibold px-4 py-2 transition-colors ${activeTab === 'borrow' ? 'text-[#C9FA49] border-b-2 border-[#C9FA49]' : 'text-[#FFFFFF99] hover:text-white'}`}
                        >
                            Borrow Funds
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#00000066] p-[6px_8px] rounded-xl border border-[#FFFFFF33] w-[260px] mb-8">
                        {activeTab === 'supply' ? (
                            <>
                                <button onClick={() => setActionType('deposit')} className={`cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm transition-all ${actionType === 'deposit' ? 'bg-[#C9FA49] text-[#000000]' : 'text-[#FFFFFF] hover:bg-[#FFFFFF1A]'}`}>Deposit</button>
                                <button onClick={() => setActionType('withdraw')} className={`cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm transition-all ${actionType === 'withdraw' ? 'bg-[#C9FA49] text-[#000000]' : 'text-[#FFFFFF] hover:bg-[#FFFFFF1A]'}`}>Withdraw</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setActionType('borrow')} className={`cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm transition-all ${actionType === 'borrow' ? 'bg-[#C9FA49] text-[#000000]' : 'text-[#FFFFFF] hover:bg-[#FFFFFF1A]'}`}>Borrow</button>
                                <button onClick={() => setActionType('repay')} className={`cursor-pointer flex-1 h-[45px] rounded-lg font-semibold text-sm transition-all ${actionType === 'repay' ? 'bg-[#C9FA49] text-[#000000]' : 'text-[#FFFFFF] hover:bg-[#FFFFFF1A]'}`}>Repay</button>
                            </>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[#FFFFFF] font-semibold text-lg capitalize">{actionType} Amount</h3>
                        </div>

                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-transparent text-[#FFFFFF] text-3xl font-bold outline-none w-full"
                                />
                                <div ref={dropdownRef} className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 bg-[#FFFFFF1A] hover:bg-[#FFFFFF33] transition-colors px-4 py-2 rounded-lg"
                                    >
                                        <img src={selectedToken.img} alt={selectedToken.name} className="w-6 h-6 rounded-full" />
                                        <span className="text-[#FFFFFF] font-semibold">{selectedToken.symbol}</span>
                                        <ChevronDown className={`text-[#FFFFFF] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute right-0 top-full mt-2 w-full bg-[#000000] border border-[#FFFFFF1A] rounded-lg shadow-lg z-10 min-w-[200px]">
                                            {TOKENS.map(token => (
                                                <li
                                                    key={token.symbol}
                                                    onClick={() => { setSelectedToken(token); setIsDropdownOpen(false) }}
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
                                <button onClick={handleMax} className="flex-1 bg-[#FFFFFF1A] hover:bg-[#C9FA49] hover:text-[#000000] text-[#FFFFFF] py-2 rounded-lg text-sm font-semibold transition-colors">
                                    MAX
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-6">
                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                            <p className="text-[#FFFFFF99] text-sm mb-1">Supplied Collateral</p>
                            <p className="text-[#FFFFFF] font-semibold text-lg">{parseFloat(stats.collateralAmount).toFixed(4)}</p>
                        </div>
                        <div className="bg-[#00000066] border border-[#FFFFFF1A] rounded-xl p-4">
                            <p className="text-[#FFFFFF99] text-sm mb-1">Max LTV</p>
                            <p className="text-[#FFFFFF] font-semibold text-lg">75.00%</p>
                        </div>
                    </div>

                    <button
                        onClick={handleAction}
                        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                        className={`w-full py-4 rounded-[40px] font-semibold text-base transition-all duration-300 capitalize ${
                            isProcessing || !amount || parseFloat(amount) <= 0
                                ? 'bg-[#FFFFFF33] text-[#FFFFFF66] cursor-not-allowed'
                                : 'bg-[#C9FA49] text-[#000000] hover:bg-[#b8e842]'
                        }`}
                    >
                        {isProcessing ? 'Processing...' : !account ? 'Connect Wallet' : `${actionType} ${selectedToken.symbol}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LendingInterface