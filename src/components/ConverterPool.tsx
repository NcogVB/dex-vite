import React, { useState, useCallback, useEffect } from 'react';
import { useLiquidity } from '../contexts/LiquidityContext';
import { ethers } from 'ethers';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { POSITION_MANAGER_MINIMAL_ABI, UNISWAP_V3_POOL_ABI } from '../contexts/ABI';
import Converter1 from './Converter1';

interface LiquidityData {
    poolTokens: number;
    usdtAmount: number;
    ethAmount: number;
    shareOfPool: number;
    reward: number | null;
}

const POSITION_MANAGER_ADDRESS = '0x61d1F08f42189257148D54550C9B089a638B59d5';

const ConverterPool: React.FC = () => {
    const { addLiquidity, loading } = useLiquidity();
    const [tokenId, setTokenId] = useState<string>('');
    const [AddingAmount, setAddingAmount] = useState<number>(100);
    const [liquidityData, setLiquidityData] = useState<LiquidityData>({
        poolTokens: 0,
        usdtAmount: 0,
        ethAmount: 0,
        shareOfPool: 0,
        reward: null,
    });
    
    // UI State Management
    const [isAddingToMetamask, setIsAddingToMetamask] = useState(false);
    const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
    const [showConverter1, setShowConverter1] = useState(false);
    const [activeAction, setActiveAction] = useState<'view' | 'add'>('view'); // New state to toggle views

    const fetchPositionData = useCallback(async () => {
        if (!tokenId || !(window as any).ethereum) return;
        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const positionManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, POSITION_MANAGER_MINIMAL_ABI, provider);
            const poolAddress = '0x64086EEC039b41228f25C326F5e0fa6571d72e00';
            const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider);

            const [positionData, poolData] = await Promise.all([
                positionManager.positions(tokenId),
                Promise.all([
                    poolContract.liquidity(),
                    poolContract.slot0(),
                    poolContract.fee(),
                    poolContract.token0(),
                    poolContract.token1(),
                ]),
            ]);

            const [liquidity, tokensOwed0, tokensOwed1] = positionData.slice(7);
            const [poolLiquidity, slot0, fee, token0Address, token1Address] = poolData;

            const chainId = 11155111;
            const token0 = new Token(chainId, token0Address, 18, 'USDT', 'USDT');
            const token1 = new Token(chainId, token1Address, 18, 'USDC', 'USDC');

            const pool = new Pool(
                token0,
                token1,
                Number(fee),
                slot0[0].toString(),
                poolLiquidity.toString(),
                Number(slot0[1])
            );

            const position = new Position({
                pool,
                liquidity: liquidity.toString(),
                tickLower: Number(positionData[5]),
                tickUpper: Number(positionData[6]),
            });

            const amount0 = Number(position.amount0.toSignificant(6, { groupSeparator: '' }));
            const amount1 = Number(position.amount1.toSignificant(6, { groupSeparator: '' }));
            const usdtAmount = token0.symbol === 'usdc' ? amount0 : amount1;
            const ethAmount = token1.symbol === 'usdt' ? amount1 : amount0;
            const shareOfPool = (Number(liquidity) / Number(poolLiquidity)) * 100;
            const reward = Number(tokensOwed0) / 1e18 + Number(tokensOwed1) / 1e18;

            setLiquidityData({
                poolTokens: Number(liquidity) / 1e18,
                usdtAmount,
                ethAmount,
                shareOfPool,
                reward: reward > 0 ? reward : null,
            });
        } catch (error) {
            console.error('Error fetching position data:', error);
        }
    }, [tokenId]);

    useEffect(() => {
        if (tokenId) fetchPositionData();
    }, [tokenId, fetchPositionData]);

    const handleAddLiquidity = async () => {
        setIsAddingLiquidity(true);
        try {
            await addLiquidity({
                poolAddress: '0x64086EEC039b41228f25C326F5e0fa6571d72e00',
                tokenA: '0xA6fbc65420327B89e43d50AB84E12E798fA9Cb46',
                tokenB: '0x285d3b54af96cBccA5C05cE4bA7F2dcD56bfc0c4',
                amountA: AddingAmount.toString(),
                amountB: AddingAmount.toString(),
            });
            alert('Liquidity added successfully!');
            setActiveAction('view'); // Return to main view after success
        } catch (error) {
            console.error('Error adding liquidity:', error);
            alert('Failed to add liquidity');
        } finally {
            setIsAddingLiquidity(false);
        }
    };

    const handleRemoveLiquidity = () => {
        setShowConverter1(true);
    };

    const handleAddToMetamask = useCallback(async () => {
        setIsAddingToMetamask(true);
        try {
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                await (window as any).ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC721',
                        options: {
                            address: '0x61d1F08f42189257148D54550C9B089a638B59d5',
                            symbol: 'UNI-V3-POS',
                            tokenId: tokenId || '1', // Use actual tokenId if present
                            decimals: 18,
                        },
                    },
                });
            } else {
                alert('MetaMask not detected.');
            }
        } catch (error) {
            console.error('Error adding token to MetaMask:', error);
        } finally {
            setIsAddingToMetamask(false);
        }
    }, [tokenId]);

    if (showConverter1) {
        return <Converter1 />;
    }

    return (
        <div className="w-full">
            <div>
                <h2 className="mb-6 font-semibold text-2xl sm:text-3xl leading-[100%] text-[#FFFFFF]">
                    Your Liquidity
                </h2>
                
                {/* Token ID Input - Always visible */}
                <input
                    type="text"
                    placeholder="Enter Token ID To Load Values"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    className="w-full mb-6 p-4 rounded-[12px] border border-[#FFFFFF33] bg-[#00000066] text-[#FFFFFF] placeholder:text-[#FFFFFF66] focus:outline-none focus:border-[#C9FA49] transition-colors"
                />

                {/* Main Stats Card */}
                <div className="bg-[#00000066] rounded-[16px] px-[20px] py-[24px] text-[#FFFFFF] border border-solid border-[#FFFFFF33] mb-6">
                    {/* Header: Pair Info */}
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="size-[30px] bg-[#C9FA49] rounded-full flex items-center justify-center text-sm font-bold text-black">T</div>
                        <div className="size-[30px] bg-[#3DBEA3] rounded-full flex items-center justify-center text-sm font-bold text-white">$</div>
                        <span className="font-bold text-xl leading-[100%]">USDT - USDC</span>
                        {tokenId && <span className="ml-auto text-sm text-[#FFFFFF66]">#{tokenId}</span>}
                    </div>

                    {/* Total Liquidity Value */}
                    <div className="font-bold text-2xl leading-[100%] mb-6 text-[#C9FA49]">
                        {liquidityData.poolTokens.toFixed(11)} <span className="text-sm text-[#FFFFFF66]">LP Tokens</span>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex justify-between p-3 bg-[#FFFFFF0D] rounded-lg items-center">
                            <div className="flex items-center space-x-2">
                                <div className="size-[24px] bg-[#C9FA49] rounded-full flex items-center justify-center text-xs font-bold text-black">T</div>
                                <span className="font-medium text-sm">USDT</span>
                            </div>
                            <span className="font-semibold text-sm">{liquidityData.usdtAmount.toFixed(5)}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-[#FFFFFF0D] rounded-lg items-center">
                            <div className="flex items-center space-x-2">
                                <div className="size-[24px] bg-[#3DBEA3] rounded-full flex items-center justify-center text-xs font-bold text-white">$</div>
                                <span className="font-medium text-sm">USDC</span>
                            </div>
                            <span className="font-semibold text-sm">{liquidityData.ethAmount.toFixed(10)}</span>
                        </div>
                    </div>

                    <div className="border-t border-[#FFFFFF33] my-4"></div>

                    {/* Secondary Stats */}
                    <div className="flex justify-between mb-2 font-medium text-sm text-[#FFFFFF99]">
                        <span>Unclaimed Rewards</span>
                        <span className="text-[#C9FA49]">{liquidityData.reward ? liquidityData.reward.toFixed(6) : '0.000000'}</span>
                    </div>
                    <div className="flex justify-between mb-4 font-medium text-sm text-[#FFFFFF99]">
                        <span>Pool Share</span>
                        <span className="text-[#C9FA49]">{liquidityData.shareOfPool.toFixed(4)}%</span>
                    </div>

                    {/* Secondary Action: Add to MetaMask (De-emphasized) */}
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleAddToMetamask}
                            disabled={isAddingToMetamask}
                            className="text-xs text-[#FFFFFF66] hover:text-[#C9FA49] underline decoration-dotted underline-offset-4 transition-colors disabled:opacity-50"
                            type="button"
                        >
                            {isAddingToMetamask ? 'Adding...' : 'Add Position NFT to MetaMask'}
                        </button>
                    </div>
                </div>

                {/* Main Actions Area */}
                {activeAction === 'view' ? (
                    <div className="flex gap-4">
                         
                        {/* Add Button */}
                        <button
                            onClick={() => setActiveAction('add')}
                            className="flex-1 bg-[#C9FA49] text-[#000000] rounded-[16px] py-4 flex items-center justify-center gap-2 font-semibold text-base hover:bg-[#b8e842] transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Liquidity
                        </button>

                        {/* Remove Button */}
                        <button
                            onClick={handleRemoveLiquidity}
                            className="flex-1 bg-[#FFFFFF1A] text-[#FFFFFF] border border-[#FFFFFF33] rounded-[16px] py-4 flex items-center justify-center gap-2 font-semibold text-base hover:bg-[#FF4C4C] hover:border-[#FF4C4C] transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                            Remove
                        </button>
                    </div>
                ) : (
                    /* Add Liquidity Mode */
                    <div className="bg-[#FFFFFF0D] rounded-[16px] p-4 border border-[#C9FA49]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[#C9FA49] font-semibold">Add More Liquidity</h3>
                            <button 
                                onClick={() => setActiveAction('view')}
                                className="text-[#FFFFFF66] hover:text-[#FFFFFF] text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm text-[#FFFFFF99] mb-2">Amount</label>
                            <input
                                type="number"
                                value={AddingAmount}
                                onChange={(e) => setAddingAmount(Number(e.target.value))}
                                className="w-full p-4 rounded-[12px] border border-[#FFFFFF33] bg-[#00000033] text-[#FFFFFF] focus:outline-none focus:border-[#C9FA49]"
                            />
                        </div>

                        <button
                            onClick={handleAddLiquidity}
                            disabled={isAddingLiquidity || loading}
                            className="w-full bg-[#C9FA49] text-[#000000] rounded-[12px] py-4 font-bold hover:bg-[#b8e842] transition-all disabled:opacity-50"
                        >
                            {isAddingLiquidity ? 'Confirming...' : 'Confirm Deposit'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConverterPool;