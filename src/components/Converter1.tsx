import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Token } from '@uniswap/sdk-core'
import { Pool, Position } from '@uniswap/v3-sdk'
import { useLiquidity } from '../contexts/LiquidityContext'
import { UNISWAP_V3_POOL_ABI, POSITION_MANAGER_MINIMAL_ABI, FACTORY_ABI } from '../utils/abis'
import { POSITION_MANAGER_ADDRESS, FACTORY_ADDRESS, TOKENS } from '../utils/addresses'
import { Loader2 } from 'lucide-react'

interface LiquidityData {
    amount0: string;
    amount1: string;
    symbol0: string;
    symbol1: string;
    shareOfPool: string;
}

const Converter1: React.FC = () => {
    const { removeLiquidity } = useLiquidity()
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            setProvider(new ethers.BrowserProvider(window.ethereum))
        }
    }, [])
    
    const [tokenId, setTokenId] = useState<string>('')
    const [percentage, setPercentage] = useState<number>(25)
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [data, setData] = useState<LiquidityData | null>(null)

    // Fetch Position Data logic
    const fetchPositionData = useCallback(async () => {
        if (!tokenId || !provider) return
        
        setIsLoadingData(true)
        try {
            const pm = new ethers.Contract(POSITION_MANAGER_ADDRESS, POSITION_MANAGER_MINIMAL_ABI, provider)
            const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider)

            // 1. Get Position Info
            const pos = await pm.positions(tokenId)
            const liquidity = pos.liquidity.toString()

            // If no liquidity, stop
            if (liquidity === "0") {
                setData(null)
                setIsLoadingData(false)
                return
            }

            // 2. Find the Pool address dynamically
            const poolAddress = await factory.getPool(pos.token0, pos.token1, pos.fee)
            const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider)
            
            // 3. Get Pool State
            const [slot0, poolLiquidity] = await Promise.all([
                poolContract.slot0(),
                poolContract.liquidity()
            ])

            // 4. Construct SDK Objects
            // Helper to get symbol (simplified for known tokens, fallback to generic)
            const t0Info = Object.values(TOKENS).find(t => t.address.toLowerCase() === pos.token0.toLowerCase())
            const t1Info = Object.values(TOKENS).find(t => t.address.toLowerCase() === pos.token1.toLowerCase())
            
            const chainId = 11155111 // Or (await provider.getNetwork()).chainId
            const token0 = new Token(chainId, pos.token0, t0Info?.decimals || 18, "T0", "Token0")
            const token1 = new Token(chainId, pos.token1, t1Info?.decimals || 18, "T1", "Token1")

            const pool = new Pool(
                token0, token1, Number(pos.fee), 
                slot0.sqrtPriceX96.toString(), poolLiquidity.toString(), Number(slot0.tick)
            )

            const position = new Position({
                pool,
                liquidity: liquidity,
                tickLower: Number(pos.tickLower),
                tickUpper: Number(pos.tickUpper)
            })

            // 5. Update State
            setData({
                amount0: position.amount0.toSignificant(6),
                amount1: position.amount1.toSignificant(6),
                symbol0: t0Info ? Object.keys(TOKENS).find(key => TOKENS[key].address.toLowerCase() === pos.token0.toLowerCase()) || "USDT" : "USDT",
                symbol1: t1Info ? Object.keys(TOKENS).find(key => TOKENS[key].address.toLowerCase() === pos.token1.toLowerCase()) || "USDC" : "USDC",
                shareOfPool: ((Number(liquidity) / Number(poolLiquidity)) * 100).toFixed(4)
            })

        } catch (error) {
            console.error("Error loading position:", error)
            setData(null)
        } finally {
            setIsLoadingData(false)
        }
    }, [tokenId, provider])

    // Debounce fetch
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (tokenId) fetchPositionData()
        }, 800)
        return () => clearTimeout(timeout)
    }, [tokenId, fetchPositionData])

    const handleRemove = async () => {
        if (!tokenId || !data) return
        setIsRemoving(true)
        try {
            await removeLiquidity(Number(tokenId), percentage)
            alert("Liquidity Removed Successfully!")
            fetchPositionData() // Refresh
        } catch (e: any) {
            alert("Failed: " + e.message)
        } finally {
            setIsRemoving(false)
        }
    }

    // Calculated amounts to receive
    const receive0 = data ? (parseFloat(data.amount0) * percentage / 100).toFixed(6) : "0.00"
    const receive1 = data ? (parseFloat(data.amount1) * percentage / 100).toFixed(6) : "0.00"

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                <div className="md:rounded-[40px] rounded-[20px] bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(0,0,0,0.50)_100%)] backdrop-blur-sm lg:p-[40px] sm:p-[30px] p-[20px]">
                    
                    <h2 className="mb-6 font-semibold text-2xl sm:text-3xl text-white">Remove Liquidity</h2>

                    {/* Input Section */}
                    <div className="mb-8">
                        <label className="text-sm text-[#FFFFFF99] mb-2 block">Position Token ID</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="e.g. 142"
                                value={tokenId}
                                onChange={(e) => setTokenId(e.target.value)}
                                className="w-full p-4 rounded-[12px] border border-[#FFFFFF33] bg-[#FFFFFF0D] text-white focus:outline-none focus:border-[#C9FA49] transition-colors"
                            />
                            {isLoadingData && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-[#C9FA49]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data Display */}
                    {data ? (
                        <>
                            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                                {/* Slider Section */}
                                <div className="flex-1 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-[16px] p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[#FFFFFF99]">Amount to Remove</span>
                                        <span className="text-[#C9FA49] font-bold text-2xl">{percentage}%</span>
                                    </div>
                                    
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={percentage}
                                        onChange={(e) => setPercentage(Number(e.target.value))}
                                        className="w-full h-2 bg-[#FFFFFF33] rounded-lg appearance-none cursor-pointer accent-[#C9FA49] mb-6"
                                    />

                                    <div className="flex gap-2">
                                        {[25, 50, 75, 100].map((pct) => (
                                            <button
                                                key={pct}
                                                onClick={() => setPercentage(pct)}
                                                className={`flex-1 py-2 rounded-[8px] text-sm font-semibold transition-all ${
                                                    percentage === pct 
                                                    ? 'bg-[#C9FA49] text-black' 
                                                    : 'bg-[#FFFFFF1A] text-white hover:bg-[#FFFFFF33]'
                                                }`}
                                            >
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Output Section */}
                                <div className="flex-1 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-[16px] p-6 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[#FFFFFF99] mb-4">You will Receive</p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#00B67A] flex items-center justify-center text-white text-xs font-bold">T</div>
                                                    <span className="text-white font-medium">{data.symbol0}</span>
                                                </div>
                                                <span className="text-white font-bold text-xl">{receive0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-xs font-bold">C</div>
                                                    <span className="text-white font-medium">{data.symbol1}</span>
                                                </div>
                                                <span className="text-white font-bold text-xl">{receive1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-[#FFFFFF1A] flex justify-between items-center">
                                        <span className="text-[#FFFFFF99] text-sm">Pool Share</span>
                                        <span className="text-[#C9FA49] font-mono">{data.shareOfPool}%</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleRemove}
                                disabled={isRemoving || percentage === 0}
                                className={`w-full py-4 rounded-[40px] font-bold text-lg transition-all ${
                                    isRemoving || percentage === 0
                                    ? 'bg-[#FFFFFF33] text-[#FFFFFF66] cursor-not-allowed'
                                    : 'bg-[#FF4C4C] text-white hover:bg-[#ff3333]'
                                }`}
                            >
                                {isRemoving ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Confirming...</span> : 'Remove Liquidity'}
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-10 text-[#FFFFFF66]">
                            {tokenId ? "No valid position found for this ID" : "Enter a Token ID above to load your position"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Converter1