import { Shield, ShieldAlert, CheckCircle,  Loader2, Info, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { useInsurance } from '../../hooks/useInsurance'

const Insurance = () => {
    const { account, connectWallet } = useWallet()
    const { policy, quote, getQuote, buyPolicy, claim, loading } = useInsurance()
    
    // Form State
    const [duration, setDuration] = useState(30) // Days
    const [coverage, setCoverage] = useState(100) // %

    // Update quote when inputs change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (account) getQuote(duration, coverage)
        }, 500)
        return () => clearTimeout(timeout)
    }, [duration, coverage, account, getQuote])

    const handleBuy = async () => {
        try {
            await buyPolicy(duration, coverage)
            alert("Policy Successfully Purchased!")
        } catch (e: any) {
            alert("Purchase Failed: " + (e.reason || e.message))
        }
    }

    const handleClaim = async () => {
        try {
            await claim()
            alert("Payout Sent to Wallet!")
        } catch (e: any) {
            alert("Claim Failed: " + (e.reason || e.message))
        }
    }

    const riskLabels = ['Low Risk', 'Medium Risk', 'High Risk']
    const riskColors = ['text-green-400', 'text-yellow-400', 'text-red-400']

    return (
        <div className="w-full max-w-[1250px] mx-auto px-4 py-12">
            
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="xl:text-[60px] lg:text-5xl md:text-4xl text-3xl font-bold bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent mb-6">
                    DeFi Insurance Protocol
                </h1>
                <p className="text-[#FFFFFF99] text-lg max-w-[600px] mx-auto">
                    Smart contract coverage for your lending positions. Automatically detects risk levels and processes instant liquidation claims.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
                
                {/* === CARD 1: PURCHASE / STATUS === */}
                <div className="relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                    <div className="h-full bg-[#0c0c0c] md:rounded-[40px] rounded-[20px] p-8 flex flex-col backdrop-blur-sm">
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-[#C9FA49]/10 rounded-xl">
                                <Shield className="text-[#C9FA49] w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Coverage</h2>
                                <p className="text-xs text-[#FFFFFF66]">Algorithmic Premium Pricing</p>
                            </div>
                        </div>

                        {!account ? (
                            <div className="flex-grow flex flex-col justify-center text-center space-y-4">
                                <p className="text-[#FFFFFF99]">Connect your wallet to analyze your lending risk.</p>
                                <button onClick={connectWallet} className="w-full bg-[#C9FA49] py-4 rounded-[20px] font-bold text-black hover:bg-[#b8e842] transition-colors">
                                    Connect Wallet
                                </button>
                            </div>
                        ) : policy ? (
                            // === STATE: ACTIVE POLICY ===
                            <div className="flex-grow flex flex-col justify-center space-y-6">
                                <div className="bg-[#1F2321] p-6 rounded-2xl border border-[#C9FA49]">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[#C9FA49] font-bold flex items-center gap-2 text-lg">
                                            <CheckCircle className="w-6 h-6" /> Protected
                                        </span>
                                        <span className="bg-[#C9FA49]/20 text-[#C9FA49] px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm border-b border-[#FFFFFF1A] pb-3">
                                            <span className="text-[#FFFFFF99]">Coverage Amount</span>
                                            <span className="text-white font-mono text-lg">{policy.coverage} USDC</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-b border-[#FFFFFF1A] pb-3">
                                            <span className="text-[#FFFFFF99]">Assessed Risk</span>
                                            <span className="text-white">{policy.riskClass}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#FFFFFF99]">Expires On</span>
                                            <span className="text-white font-mono">{policy.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                                <button disabled className="w-full bg-[#FFFFFF1A] text-[#FFFFFF66] py-4 rounded-[20px] font-bold cursor-not-allowed">
                                    Policy Active
                                </button>
                            </div>
                        ) : (
                            // === STATE: BUY FORM ===
                            <div className="space-y-8">
                                {/* Risk Indicator */}
                                <div className="flex items-center justify-between bg-[#1F2321] p-3 rounded-lg border border-[#FFFFFF1A]">
                                    <span className="text-[#FFFFFF99] text-sm flex gap-2 items-center"><Info size={14}/> Risk Assessment</span>
                                    <span className={`font-bold ${riskColors[quote.riskClass] || 'text-white'}`}>
                                        {riskLabels[quote.riskClass] || 'Calculated on Loan'}
                                    </span>
                                </div>

                                {/* Duration Slider */}
                                <div>
                                    <div className="flex justify-between mb-3">
                                        <label className="text-sm text-[#FFFFFF99]">Duration</label>
                                        <span className="text-white font-bold">{duration} Days</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[30, 60, 90, 180].map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => setDuration(d)}
                                                className={`flex-1 py-2 rounded-lg text-sm border transition-all ${duration === d ? 'border-[#C9FA49] text-[#C9FA49] bg-[#C9FA49]/10' : 'border-[#FFFFFF1A] text-[#FFFFFF66] hover:text-white'}`}
                                            >
                                                {d}d
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Coverage Slider */}
                                <div>
                                    <div className="flex justify-between mb-3">
                                        <label className="text-sm text-[#FFFFFF99]">Coverage Amount</label>
                                        <span className="text-[#C9FA49] font-bold">{coverage}%</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="100" step="10"
                                        value={coverage} 
                                        onChange={(e) => setCoverage(Number(e.target.value))}
                                        className="w-full h-2 bg-[#FFFFFF1A] rounded-lg appearance-none cursor-pointer accent-[#C9FA49]"
                                    />
                                    <p className="text-xs text-[#FFFFFF66] mt-2 text-right">
                                        Max Payout: <span className="text-white">{quote.coverage} USDC</span>
                                    </p>
                                </div>

                                {/* Quote Box */}
                                <div className="bg-[#1F2321] p-5 rounded-2xl flex justify-between items-center border border-[#FFFFFF1A]">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-[#FFFFFF66]" />
                                        <span className="text-[#FFFFFF99] text-sm">Premium Cost</span>
                                    </div>
                                    <div className="text-right">
                                        {parseFloat(quote.premium) > 0 ? (
                                            <>
                                                <span className="block text-xl font-bold text-white">{quote.premium} USDC</span>
                                                <span className="text-xs text-[#FFFFFF66]">One-time payment</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-yellow-500">No Collateral Found</span>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBuy}
                                    disabled={loading || parseFloat(quote.premium) <= 0}
                                    className={`w-full py-4 rounded-[20px] font-bold text-black transition-all flex justify-center items-center gap-2 ${
                                        loading || parseFloat(quote.premium) <= 0
                                        ? 'bg-[#FFFFFF33] cursor-not-allowed text-[#FFFFFF66]'
                                        : 'bg-[#C9FA49] hover:bg-[#b8e842] hover:shadow-[0_0_20px_rgba(201,250,73,0.3)]'
                                    }`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Purchase Policy"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* === CARD 2: CLAIMS === */}
                <div className="relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#FF4C4C_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%)]">
                    <div className="h-full bg-[#0c0c0c] md:rounded-[40px] rounded-[20px] p-8 flex flex-col backdrop-blur-sm">
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-[#FF4C4C]/10 rounded-xl">
                                <ShieldAlert className="text-[#FF4C4C] w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">File Claim</h2>
                                <p className="text-xs text-[#FFFFFF66]">Liquidation Protection</p>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="bg-[#1F2321] p-5 rounded-2xl mb-8 border border-[#FFFFFF1A]">
                                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" /> How Claims Work
                                </h4>
                                <ul className="text-[#FFFFFF99] text-sm space-y-3 list-disc pl-4">
                                    <li>If your collateral balance drops to <strong>0</strong> while you have an active policy, the system assumes a liquidation event.</li>
                                    <li>Clicking <strong>Submit Claim</strong> verifies your zero balance on-chain.</li>
                                    <li>If verified, the <strong>Coverage Amount</strong> is instantly transferred to your wallet in USDC.</li>
                                </ul>
                            </div>
                        </div>

                        <button 
                            onClick={handleClaim}
                            disabled={loading || !policy}
                            className={`w-full py-4 rounded-[20px] font-bold text-white transition-all flex justify-center items-center gap-2 ${
                                !policy 
                                ? 'bg-[#FFFFFF1A] text-[#FFFFFF66] cursor-not-allowed' 
                                : 'bg-[#FF4C4C] hover:bg-[#ff3333] hover:shadow-[0_0_20px_rgba(255,76,76,0.3)]'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Submit Claim"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Insurance