import { ChevronDown, Loader2, ArrowRightLeft, Wallet } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import ChooseDEXSection from '../../components/ChooseDEXSection'
import { useWallet } from '../../hooks/useWallet'

// --- CONFIGURATION ---

const EIDS = {
    SEPOLIA: 40161,
    AMOY: 40267
}

const RPCS = {
    SEPOLIA: "https://rpc.sepolia.org",
    AMOY: "https://rpc-amoy.polygon.technology"
}

// Token Addresses
const TOKEN_CONFIG: Record<string, Record<string, string>> = {
    'SEPOLIA': {
        'USDT': '0x82472d0Df43Af85a551A1bfeD4042454FdfB93bD',
        'USDC': '0x7B8089D8ad08EDfbC2293b177CEce22b71FB2D59'
    },
    'Polygon': {
        'USDT': '0x285d3b54af96cBccA5C05cE4bA7F2dcD56bfc0c4',
        'USDC': '0xA6fbc65420327B89e43d50AB84E12E798fA9Cb46'
    }
}

const OFT_ABI = [
    "function quoteSend(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, bool _payInLzToken) external view returns (tuple(uint256 nativeFee, uint256 lzTokenFee))",
    "function send(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, tuple(uint256 nativeFee, uint256 lzTokenFee) _fee, address _refundAddress) external payable returns (tuple(bytes32 guid, uint64 nonce, tuple(uint256 amountSentLD, uint256 amountReceivedLD) receipt))",
    "function token() external view returns (address)",
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

// --- INTERFACES ---

interface DropdownStates { fromToken: boolean; fromChain: boolean; toToken: boolean; toChain: boolean }
interface SelectedValues { fromChain: string; toChain: string; tokenType: string }
interface TokenOption { name: string; img: string; }
interface ChainOption { name: string; img: string; id: number; rpc: string; key: 'SEPOLIA' | 'AMOY' }

const Bridge = () => {
    const { account, connectWallet } = useWallet()
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            setProvider(new ethers.BrowserProvider(window.ethereum))
        }
    }, [])
    const [dropdownStates, setDropdownStates] = useState<DropdownStates>({ fromToken: false, fromChain: false, toToken: false, toChain: false })
    const [selected, setSelected] = useState<SelectedValues>({ fromChain: 'Polygon', toChain: 'SEPOLIA', tokenType: 'USDT' })
    const [amount, setAmount] = useState<string>('')
    const [isBridging, setIsBridging] = useState(false)
    const [status, setStatus] = useState<string>('')

    // Balances state
    const [balanceFrom, setBalanceFrom] = useState<string>('0.00')
    const [balanceTo, setBalanceTo] = useState<string>('0.00')
    const [isLoadingBalances, setIsLoadingBalances] = useState(false)

    // Images
    const tokenOptions: TokenOption[] = [
        { name: 'USDT', img: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026' },
        { name: 'USDC', img: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026' },
    ]

    const chainOptions: ChainOption[] = [
        { name: 'SEPOLIA', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', id: 11155111, rpc: RPCS.SEPOLIA, key: 'SEPOLIA' },
        { name: 'Polygon', img: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', id: 80002, rpc: RPCS.AMOY, key: 'AMOY' },
    ]

    // --- FETCH BALANCES ---
    const fetchBalances = useCallback(async () => {
        if (!account) return;
        setIsLoadingBalances(true);

        try {
            // 1. Get Source Balance
            const sourceChain = chainOptions.find(c => c.name === selected.fromChain);
            const sourceToken = TOKEN_CONFIG[selected.fromChain][selected.tokenType];

            if (sourceChain && sourceToken) {
                // Use a dedicated RPC provider so we don't depend on wallet network
                const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
                const sourceContract = new ethers.Contract(sourceToken, ERC20_ABI, sourceProvider);
                const bal = await sourceContract.balanceOf(account);
                setBalanceFrom(ethers.formatUnits(bal, 18));
            }

            // 2. Get Destination Balance
            const destChain = chainOptions.find(c => c.name === selected.toChain);
            const destToken = TOKEN_CONFIG[selected.toChain][selected.tokenType];

            if (destChain && destToken) {
                const destProvider = new ethers.JsonRpcProvider(destChain.rpc);
                const destContract = new ethers.Contract(destToken, ERC20_ABI, destProvider);
                const bal = await destContract.balanceOf(account);
                setBalanceTo(ethers.formatUnits(bal, 18));
            }

        } catch (error) {
            console.error("Error fetching balances:", error);
        } finally {
            setIsLoadingBalances(false);
        }
    }, [account, selected]);

    // Refresh balances when selection changes or wallet connects
    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [fetchBalances]);


    // --- HELPERS ---
    const toggleDropdown = (key: keyof DropdownStates) => {
        setDropdownStates(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSelect = (key: keyof SelectedValues, value: string) => {
        setSelected(prev => ({ ...prev, [key]: value }))
        setDropdownStates({ fromToken: false, fromChain: false, toToken: false, toChain: false })
    }

    const switchDirection = () => {
        setSelected(prev => ({ ...prev, fromChain: prev.toChain, toChain: prev.fromChain }))
    }

    const setMax = () => {
        setAmount(balanceFrom);
    }

    // --- BRIDGE EXECUTION ---
    const handleBridge = async () => {
        if (!account || !provider) return connectWallet();
        if (!amount || parseFloat(amount) <= 0) return alert("Enter amount");
        if (selected.fromChain === selected.toChain) return alert("Source and Destination chains cannot be the same");

        setIsBridging(true);
        setStatus("Initializing...");

        try {
            const signer = await provider.getSigner();
            const sourceTokenAddr = TOKEN_CONFIG[selected.fromChain][selected.tokenType];
            const destChainKey = chainOptions.find(c => c.name === selected.toChain)?.key;
            const destEid = EIDS[destChainKey as keyof typeof EIDS];

            const oftContract = new ethers.Contract(sourceTokenAddr, OFT_ABI, signer);
            const erc20Contract = new ethers.Contract(sourceTokenAddr, ERC20_ABI, signer);
            const amountWei = ethers.parseUnits(amount, 18);

            // LayerZero V2 Options
            const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();
            const recipientAddressBytes32 = ethers.zeroPadValue(account, 32);

            const sendParam = {
                dstEid: destEid,
                to: recipientAddressBytes32,
                amountLD: amountWei,
                minAmountLD: amountWei,
                extraOptions: options,
                composeMsg: "0x",
                oftCmd: "0x"
            };

            setStatus("Quoting Fees...");
            const [nativeFee] = await oftContract.quoteSend(sendParam, false);

            setStatus("Checking Allowance...");
            const allowance = await erc20Contract.allowance(account, sourceTokenAddr);
            if (allowance < amountWei) {
                setStatus("Approving...");
                const txApprove = await erc20Contract.approve(sourceTokenAddr, amountWei);
                await txApprove.wait();
            }

            setStatus("Confirming Bridge...");
            const tx = await oftContract.send(
                sendParam,
                { nativeFee: nativeFee, lzTokenFee: 0 },
                account,
                { value: nativeFee }
            );

            setStatus("Bridging...");
            await tx.wait();
            alert(`Bridge Sent! Tx: ${tx.hash}`);
            setAmount('');
            fetchBalances(); // Update balances

        } catch (error: any) {
            console.error(error);
            alert("Bridge Failed: " + (error.reason || error.message));
        } finally {
            setIsBridging(false);
            setStatus("");
        }
    };

    return (
        <div>
            {/* Header */}
            <section className="md:py-[80px] py-[50px] relative overflow-hidden">
                <div className="w-full max-w-[1250px] mx-auto px-4 relative z-[1]">
                    <h1 className="xl:text-[80px] lg:text-6xl md:text-5xl text-3xl text-center font-semibold xl:leading-[100px] bg-[linear-gradient(180deg,#F1F1EF_0%,rgba(241,241,239,0.3)_100%)] bg-clip-text text-transparent">
                        Bridge Exchange <br className="md:block hidden" /> with DEX.
                    </h1>
                    <p className="xl:text-lg md:text-base sm:text-sm text-xs text-[#FFFFFF] font-normal text-center w-full max-w-[690px] mx-auto md:my-[50px] my-[25px]">
                        Seamlessly transfer your assets between Polygon Amoy and Ethereum Sepolia using LayerZero technology.
                    </p>
                </div>
            </section>

            {/* Bridge Card */}
            <section className="relative pb-20">
                <img className="absolute bottom-[220px] left-0 w-full opacity-30" src="/images-new/hero-curve-others.png" alt="hero curve" />

                <div className="w-full max-w-[600px] mx-auto px-4 relative z-[1]">
                    <div className="relative md:rounded-[40px] rounded-[20px] p-[2px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="md:rounded-[40px] rounded-[20px] bg-[#0c0c0c] backdrop-blur-sm lg:p-[40px] p-[20px]">

                            {/* FROM SECTION */}
                            <div className="mb-2">
                                <div className="flex justify-between mb-2 items-center">
                                    <span className="text-sm text-[#FFFFFF99]">From</span>
                                    <div className="flex items-center gap-2 text-xs text-[#FFFFFF99]">
                                        <Wallet className="w-3 h-3" />
                                        <span>Balance: {isLoadingBalances ? <span className="animate-pulse">...</span> : parseFloat(balanceFrom).toFixed(4)}</span>
                                        <button onClick={setMax} className="text-[#C9FA49] hover:underline cursor-pointer">MAX</button>
                                    </div>
                                </div>
                                <div className="bg-[#1F2321] rounded-xl p-4 border border-[#FFFFFF1A]">
                                    <div className="flex gap-4 mb-4">
                                        {/* Chain Select */}
                                        <div className="relative flex-1">
                                            <button onClick={() => toggleDropdown('fromChain')} className="w-full flex items-center justify-between bg-black p-2 rounded-lg border border-[#FFFFFF1A] text-white hover:border-[#C9FA49] transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img src={chainOptions.find(c => c.name === selected.fromChain)?.img} className="w-6 h-6 rounded-full" alt="" />
                                                    <span className="font-medium text-sm">{selected.fromChain}</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-[#FFFFFF99]" />
                                            </button>
                                            {dropdownStates.fromChain && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0c0c] border border-[#FFFFFF33] rounded-lg z-20 overflow-hidden shadow-xl">
                                                    {chainOptions.map(c => (
                                                        <div key={c.name} onClick={() => handleSelect('fromChain', c.name)} className="p-3 hover:bg-[#FFFFFF1A] cursor-pointer flex items-center gap-3 text-white transition-colors">
                                                            <img src={c.img} className="w-6 h-6" alt="" />
                                                            <span className="text-sm">{c.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Token Select */}
                                        <div className="relative flex-1">
                                            <button onClick={() => toggleDropdown('fromToken')} className="w-full flex items-center justify-between bg-black p-2 rounded-lg border border-[#FFFFFF1A] text-white hover:border-[#C9FA49] transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img src={tokenOptions.find(t => t.name === selected.tokenType)?.img} className="w-6 h-6 rounded-full" alt="" />
                                                    <span className="font-medium text-sm">{selected.tokenType}</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-[#FFFFFF99]" />
                                            </button>
                                            {dropdownStates.fromToken && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0c0c] border border-[#FFFFFF33] rounded-lg z-20 overflow-hidden shadow-xl">
                                                    {tokenOptions.map(t => (
                                                        <div key={t.name} onClick={() => handleSelect('tokenType', t.name)} className="p-3 hover:bg-[#FFFFFF1A] cursor-pointer flex items-center gap-3 text-white transition-colors">
                                                            <img src={t.img} className="w-6 h-6" alt="" />
                                                            <span className="text-sm">{t.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder:text-[#FFFFFF1A]"
                                    />
                                </div>
                            </div>

                            {/* Switcher */}
                            <div className="flex justify-center -my-5 relative z-10">
                                <button onClick={switchDirection} className="bg-[#0c0c0c] border border-[#FFFFFF33] p-3 rounded-xl hover:border-[#C9FA49] hover:text-[#C9FA49] text-white transition-all shadow-lg">
                                    <ArrowRightLeft className="w-5 h-5 rotate-90" />
                                </button>
                            </div>

                            {/* TO SECTION */}
                            <div className="mt-2 mb-8">
                                <div className="flex justify-between mb-2 items-center">
                                    <span className="text-sm text-[#FFFFFF99]">To</span>
                                    <div className="flex items-center gap-2 text-xs text-[#FFFFFF99]">
                                        <Wallet className="w-3 h-3" />
                                        <span>Balance: {isLoadingBalances ? <span className="animate-pulse">...</span> : parseFloat(balanceTo).toFixed(4)}</span>
                                    </div>
                                </div>
                                <div className="bg-[#1F2321] rounded-xl p-4 border border-[#FFFFFF1A]">
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <button onClick={() => toggleDropdown('toChain')} className="w-full flex items-center justify-between bg-black p-2 rounded-lg border border-[#FFFFFF1A] text-white hover:border-[#C9FA49] transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img src={chainOptions.find(c => c.name === selected.toChain)?.img} className="w-6 h-6 rounded-full" alt="" />
                                                    <span className="font-medium text-sm">{selected.toChain}</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-[#FFFFFF99]" />
                                            </button>
                                            {dropdownStates.toChain && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0c0c] border border-[#FFFFFF33] rounded-lg z-20 overflow-hidden shadow-xl">
                                                    {chainOptions.map(c => (
                                                        <div key={c.name} onClick={() => handleSelect('toChain', c.name)} className="p-3 hover:bg-[#FFFFFF1A] cursor-pointer flex items-center gap-3 text-white transition-colors">
                                                            <img src={c.img} className="w-6 h-6" alt="" />
                                                            <span className="text-sm">{c.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Read-only token display */}
                                        <div className="flex-1 flex items-center justify-between bg-black p-2 rounded-lg border border-[#FFFFFF1A] text-white opacity-60 cursor-not-allowed">
                                            <div className="flex items-center gap-2">
                                                <img src={tokenOptions.find(t => t.name === selected.tokenType)?.img} className="w-6 h-6 rounded-full" alt="" />
                                                <span className="font-medium text-sm">{selected.tokenType}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-3xl font-bold text-[#FFFFFF66]">
                                        {amount || "0.00"}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleBridge}
                                disabled={isBridging || !amount || parseFloat(amount) <= 0}
                                className={`w-full py-4 rounded-[40px] font-bold text-lg flex items-center justify-center gap-3 transition-all ${isBridging || !amount
                                        ? 'bg-[#FFFFFF1A] text-[#FFFFFF66] cursor-not-allowed'
                                        : 'bg-[#C9FA49] text-black hover:bg-[#b8e842] hover:shadow-[0_0_20px_rgba(201,250,73,0.3)]'
                                    }`}
                            >
                                {isBridging ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        {status}
                                    </>
                                ) : !account ? (
                                    "Connect Wallet"
                                ) : (
                                    "Confirm Bridge"
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </section>

            <ChooseDEXSection />
        </div>
    )
}

export default Bridge