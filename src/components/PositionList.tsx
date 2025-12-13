import React from 'react';
import { useUserPositions } from '../hooks/useUserPositions';
import { Loader2, Copy } from 'lucide-react';

const PositionList: React.FC = () => {
    const { positions, loading } = useUserPositions();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Token ID Copied!");
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10">
                <Loader2 className="animate-spin text-[#C9FA49] w-8 h-8" />
            </div>
        );
    }

    if (positions.length === 0) {
        return (
            <div className="text-center py-10 bg-[#00000066] rounded-xl border border-[#FFFFFF1A]">
                <p className="text-[#FFFFFF99]">No active liquidity positions found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((pos) => (
                <div key={pos.tokenId} className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-[20px] p-6 hover:border-[#C9FA49] transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-[#00B67A] flex items-center justify-center text-white text-xs border-2 border-black">T</div>
                                <div className="w-8 h-8 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-xs border-2 border-black">C</div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{pos.symbol0} / {pos.symbol1}</h3>
                                <span className="text-xs bg-[#FFFFFF1A] px-2 py-0.5 rounded text-[#C9FA49]">{pos.fee / 10000}%</span>
                            </div>
                        </div>
                        <div 
                            className="bg-[#00000066] px-3 py-1 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#000000]"
                            onClick={() => copyToClipboard(pos.tokenId)}
                        >
                            <span className="text-sm text-[#FFFFFF99]">ID: {pos.tokenId}</span>
                            <Copy className="w-3 h-3 text-[#FFFFFF66]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#FFFFFF66]">Liquidity Status</span>
                            <span className="text-[#C9FA49] font-semibold">Active</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#FFFFFF66]">Liquidity (Raw)</span>
                            <span className="text-white font-mono">{Number(pos.liquidity).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PositionList;