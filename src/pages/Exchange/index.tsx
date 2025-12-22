import React, { useState, useEffect, useRef } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import './swap.css';

// --- TYPES ---
type TabMode = 'trade' | 'deposit' | 'withdraw';
type TradeSide = 'buy' | 'sell';
type AssetSymbol = 'POL' | 'USDT';

interface MarketStats {
    price: number;
    change: number;
}

interface UserBalance {
    POL: number;
    USDT: number;
    [key: string]: number;
}

interface OrderItem {
    id?: number; // Added ID for cancellation
    user: string;
    price: number;
    amount: number;
    side?: 'buy' | 'sell';
}

interface BackendData {
    asks: { user: string, price: string, amount: string, timestamp: number }[];
    bids: { user: string, price: string, amount: string, timestamp: number }[];
    userBalance: any;
}

// --- CONFIGURATION ---
const API_URL = "http://localhost:3001";
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd&include_24hr_change=true";

const CONTRACTS = {
    EXCHANGE: "0x4f665Ef2EF5336D26a6c06525DD812786E5614c6",
    USDT: "0x285d3b54af96cBccA5C05cE4bA7F2dcD56bfc0c4",
    POL: "0x0000000000000000000000000000000000001010"
};

const ABI = {
    ERC20: ["function approve(address spender, uint256 amount) external returns (bool)"],
    EXCHANGE: [
        "function depositETH() external payable",
        "function depositToken(address _token, uint256 _amount) external",
        "function withdrawETH(uint256 _amount, uint256 _nonce, bytes _signature) external",
        "function withdrawToken(address _token, uint256 _amount, uint256 _nonce, bytes _signature) external"
    ]
};

const Exchange: React.FC = () => {
    // --- STATE ---
    const [marketDropdownOpen, setMarketDropdownOpen] = useState<boolean>(false);
    const [selectedMarket] = useState({ name: 'POL-USDT', img: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=025' });
    const [sliderValue, setSliderValue] = useState<number>(0);

    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [marketStats, setMarketStats] = useState<MarketStats>({ price: 0, change: 0 });

    const [asks, setAsks] = useState<OrderItem[]>([]);
    const [bids, setBids] = useState<OrderItem[]>([]);
    const [userBalance, setUserBalance] = useState<UserBalance>({ POL: 0, USDT: 0 });
    const [myOpenOrders, setMyOpenOrders] = useState<OrderItem[]>([]);

    // Limit Box State
    const [mode, setMode] = useState<TabMode>('trade');
    const [tradeSide, setTradeSide] = useState<TradeSide>('buy');
    const [selectedToken, setSelectedToken] = useState<AssetSymbol>('POL');
    const [priceInput, setPriceInput] = useState<string>('');
    const [amountInput, setAmountInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const totalUSDT = (Number(priceInput) * Number(amountInput)) || 0;
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // --- INIT ---
    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const prov = new BrowserProvider(window.ethereum);
                    const accounts = await prov.send("eth_requestAccounts", []);
                    const sign = await prov.getSigner();
                    setAccount(accounts[0]);
                    setSigner(sign);
                } catch (err) { console.error(err); }
            }
        };
        init();
    }, []);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            // CoinGecko
            try {
                const res = await fetch(COINGECKO_API);
                const data = await res.json();
                if (data['polygon-ecosystem-token']) {
                    setMarketStats({
                        price: data['polygon-ecosystem-token'].usd || 0,
                        change: data['polygon-ecosystem-token'].usd_24h_change || 0
                    });
                }
            } catch (e) { /* Silent */ }

            // Backend
            if (account) {
                try {
                    const res = await fetch(`${API_URL}/market-data?user=${account}`);
                    const data: BackendData = await res.json();

                    // Parse Orderbook (Adding pseudo IDs based on timestamp for cancellation)
                    const parsedAsks = data.asks.map((a, i) => ({ ...a, id: a.timestamp, price: Number(a.price), amount: Number(a.amount), side: 'sell' as const }));
                    const parsedBids = data.bids.map((b, i) => ({ ...b, id: b.timestamp, price: Number(b.price), amount: Number(b.amount), side: 'buy' as const }));

                    setAsks(parsedAsks);
                    setBids(parsedBids);

                    const rawBal = data.userBalance || {};
                    setUserBalance({ POL: rawBal.POL || 0, USDT: rawBal.USDT || 0 });

                    // Filter My Orders
                    const myOrders = [
                        ...parsedAsks.filter(o => o.user.toLowerCase() === account.toLowerCase()),
                        ...parsedBids.filter(o => o.user.toLowerCase() === account.toLowerCase())
                    ];
                    setMyOpenOrders(myOrders);

                } catch (e) { /* Silent */ }
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [account]);

    // --- HANDLERS ---
    const handleTrade = async () => {
        if (!priceInput || !amountInput) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: account,
                    side: tradeSide,
                    price: Number(priceInput),
                    amount: Number(amountInput)
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            alert("Order Placed");
            setAmountInput('');
        } catch (e: any) { alert(e.message); }
        setLoading(false);
    };

    const handleCancel = async (order: OrderItem) => {
        if (!confirm("Cancel this order?")) return;
        try {
            // Note: Your backend needs a /cancel endpoint. 
            // Currently using a placeholder fetch.
            const res = await fetch(`${API_URL}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: account, side: order.side, price: order.price })
            });
            const data = await res.json();
            if (data.success) alert("Order Cancelled");
        } catch (e) {
            alert("Cancel function requires backend update");
        }
    };

    const handleAction = async (actionType: 'deposit' | 'withdraw') => {
        if (!amountInput || !signer) return;
        setLoading(true);
        try {
            const exContract = new ethers.Contract(CONTRACTS.EXCHANGE, ABI.EXCHANGE, signer);
            const amountWei = ethers.parseUnits(amountInput, 18);

            if (actionType === 'deposit') {
                if (selectedToken === 'POL') {
                    await (await exContract.depositETH({ value: amountWei })).wait();
                } else {
                    const usdtContract = new ethers.Contract(CONTRACTS.USDT, ABI.ERC20, signer);
                    await (await usdtContract.approve(CONTRACTS.EXCHANGE, amountWei)).wait();
                    await (await exContract.depositToken(CONTRACTS.USDT, amountWei)).wait();
                }
                await fetch(`${API_URL}/webhook/deposit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: account, symbol: selectedToken === 'POL' ? 'POL' : 'USDT', amount: Number(amountInput) })
                });
                alert("Deposit Success");
            } else {
                const res = await fetch(`${API_URL}/withdraw`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: account, symbol: selectedToken === 'POL' ? 'POL' : 'USDT', amount: Number(amountInput) })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                if (selectedToken === 'POL') {
                    await (await exContract.withdrawETH(amountWei, data.nonce, data.signature)).wait();
                } else {
                    await (await exContract.withdrawToken(CONTRACTS.USDT, amountWei, data.nonce, data.signature)).wait();
                }
                alert("Withdraw Success");
            }
            setAmountInput('');
        } catch (e: any) { console.error(e); alert("Action Failed: " + (e.reason || e.message)); }
        setLoading(false);
    }

    // --- RENDER HELPERS ---
    const renderOrderBookRow = (data: OrderItem[], type: 'ask' | 'bid') => {
        let total = 0;
        const processed = data.map((item) => { total += item.price * item.amount; return { ...item, total }; });
        const maxTotal = processed.at(-1)?.total || 1;

        return processed.map((item, idx) => {
            const totalBar = Math.min((item.total / maxTotal) * 100, 100);
            const isAsk = type === 'ask';
            // UPDATED: Now 3 columns (Price, Amount, Total)
            return (
                <div key={idx} className="grid grid-cols-3 text-sm font-normal overflow-hidden leading-[1] cursor-pointer hover:bg-[#ffffff0d]" onClick={() => setPriceInput(item.price.toString())}>
                    <span className={`relative z-10 p-1.5 ${isAsk ? 'text-[#DF2040]' : 'text-[#00BC8A]'}`}>{item.price.toFixed(4)}</span>
                    <span className="relative z-10 p-1.5 text-right text-[#EEEEEE]">{item.amount.toFixed(2)}</span>
                    <div className="relative p-1.5">
                        <div className={`absolute inset-y-0 right-0 bar ${isAsk ? 'bg-[#3F151C]' : 'bg-[#174226]'}`} style={{ width: `${totalBar.toFixed(1)}%`, opacity: 0.5 }}></div>
                        <span className="relative z-10 flex justify-end text-[#9D98A4]">{item.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>
            );
        });
    };

    useEffect(() => {
        if (chartContainerRef.current) {
            chartContainerRef.current.innerHTML = '';
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "autosize": true, "symbol": "BINANCE:POLUSDT", "interval": "60", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "hide_side_toolbar": false, "allow_symbol_change": false, "backgroundColor": "rgba(0,0,0,1)"
            });
            chartContainerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="font-poppins w-full min-h-screen bg-black p-4 xl:p-6 pt-8 xl:pt-12 text-[#EEEEEE]">
            <section className="mb-6">
                <div className="swap-main-grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-2">

                    {/* COL 1: CHART */}
                    <div className="2xl:col-span-3 md:col-span-2 flex flex-col h-full">
                        <div className="bg-[#1A1C1E] p-2 mb-2 rounded-xl flex items-center shrink-0 border border-[#2F2F34]">
                            <div className="custom-select relative w-max min-w-[120px]">
                                <button className="select-btn w-full flex items-center justify-between gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setMarketDropdownOpen(!marketDropdownOpen); }}>
                                    <span className="selected-item flex items-center gap-2 text-sm uppercase font-normal px-1.5 text-white">
                                        <img src={selectedMarket.img} className="size-4 rounded-full" alt="POL" />
                                        <span className="text-[#EEEEEE] text-base font-normal whitespace-nowrap">{selectedMarket.name}</span>
                                    </span>
                                </button>
                            </div>
                            <div className="flex-grow overflow-x-auto flex items-start justify-between gap-3 text-nowrap px-4 md:px-6 no-scrollbar">
                                <div className="min-w-fit"><h3 className="text-[#74777D] font-normal text-[10px] uppercase">Price</h3><p className="text-[#EEEEEE] text-sm font-normal">${(marketStats.price || 0).toFixed(4)}</p></div>
                                <div className="min-w-fit"><h3 className="text-[#74777D] font-normal text-[10px] uppercase">24h Change</h3><p className={`text-sm font-normal ${(marketStats.change || 0) >= 0 ? 'text-[#00BC8A]' : 'text-[#DF2040]'}`}>{(marketStats.change || 0).toFixed(2)}%</p></div>
                                <div className="hidden md:block min-w-fit"><h3 className="text-[#74777D] font-normal text-[10px] uppercase">Funding</h3><p className="text-[#FF944D] text-sm font-normal">0.0100%</p></div>
                                <div className="hidden lg:block min-w-fit"><h3 className="text-[#74777D] font-normal text-[10px] uppercase">Open Interest</h3><p className="text-[#EEEEEE] text-sm font-normal">{((marketStats.price || 0) * 12500).toLocaleString()}</p></div>
                            </div>
                        </div>
                        <div className="bg-[#1A1C1E] p-3 rounded-xl flex-1 flex flex-col overflow-hidden min-h-0 border border-[#2F2F34]">
                            <div className="relative w-full flex-1 min-h-[300px]" ref={chartContainerRef}></div>
                        </div>
                    </div>

                    {/* COL 2: ORDERBOOK (Updated to 3 columns) */}
                    <div className="h-full min-h-[450px] xl:min-h-0 p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                        <div className="rounded-xl bg-[#121212] h-full overflow-hidden flex flex-col">
                            <div className="text-[#9D98A4] text-sm font-normal py-3 px-2">Orderbook</div>
                            <div className="grid grid-cols-3 text-[10px] text-[#A1A1A1] font-normal uppercase px-2 mb-1">
                                <h3>Price</h3>
                                <h3 className="text-right">Amount</h3>
                                <h3 className="text-right">Total</h3>
                            </div>
                            <div className="no-scrollbar flex-1 overflow-y-auto min-h-0">
                                <div>{renderOrderBookRow(asks, 'ask')}</div>
                                <div className="py-2 border-y border-[#2F2F34] text-center my-1"><span className={`text-lg font-bold ${(marketStats.change || 0) >= 0 ? 'text-[#00BC8A]' : 'text-[#DF2040]'}`}>{(marketStats.price || 0).toLocaleString()}</span></div>
                                <div>{renderOrderBookRow(bids, 'bid')}</div>
                            </div>
                        </div>
                    </div>

                    {/* COL 3: LIMIT BOX */}
                    {/* COL 3: LIMIT BOX (Updated Slider Logic) */}
                    <div className="h-full min-h-[450px] xl:min-h-0 xl:col-span-1 md:col-span-3 p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm h-full p-4 flex flex-col">

                            {/* TOP TABS */}
                            <div className="flex gap-2 mb-4 bg-black p-1 rounded-lg shrink-0">
                                {(['trade', 'deposit', 'withdraw'] as TabMode[]).map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`flex-1 text-[10px] uppercase py-2 rounded font-bold transition-all ${mode === m ? 'bg-[#2F2F34] text-white' : 'text-[#74777D] hover:text-[#9D98A4]'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            {/* DYNAMIC CONTENT */}
                            <div className="flex-1 flex flex-col justify-between min-h-0 overflow-y-auto no-scrollbar">

                                {/* --- TRADE MODE --- */}
                                {mode === 'trade' && (
                                    <div className="flex flex-col gap-3 h-full">

                                        {/* A. Buy/Sell Toggle */}
                                        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1A1C1E] rounded-lg shrink-0">
                                            <button
                                                onClick={() => { setTradeSide('buy'); setSliderValue(0); setAmountInput(''); }}
                                                className={`py-2 rounded-md text-sm font-bold transition-all ${tradeSide === 'buy' ? 'bg-[#00BC8A] text-white shadow-lg' : 'text-[#74777D] hover:text-white'}`}
                                            >
                                                Buy
                                            </button>
                                            <button
                                                onClick={() => { setTradeSide('sell'); setSliderValue(0); setAmountInput(''); }}
                                                className={`py-2 rounded-md text-sm font-bold transition-all ${tradeSide === 'sell' ? 'bg-[#DF2040] text-white shadow-lg' : 'text-[#74777D] hover:text-white'}`}
                                            >
                                                Sell
                                            </button>
                                        </div>

                                        {/* B. Balance Display */}
                                        <div className="flex justify-between text-xs text-[#9D98A4] px-1 shrink-0">
                                            <span>Available:</span>
                                            <span className="text-[#EEEEEE] font-mono">
                                                {tradeSide === 'buy'
                                                    ? `${userBalance.USDT.toFixed(2)} USDT`
                                                    : `${userBalance.POL.toFixed(2)} POL`
                                                }
                                            </span>
                                        </div>

                                        {/* C. Inputs */}
                                        <div className="space-y-3 shrink-0">
                                            {/* Price Input */}
                                            <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                                                <div className="bg-[#000] rounded-xl p-3">
                                                    <label className="text-[10px] text-[#74777D] block mb-1 uppercase">Price (USDT)</label>
                                                    <input
                                                        type="number"
                                                        className="bg-transparent w-full text-white outline-none font-mono text-sm"
                                                        placeholder="0.00"
                                                        value={priceInput}
                                                        onChange={e => setPriceInput(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amount Input */}
                                            <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                                                <div className="bg-[#000] rounded-xl p-3">
                                                    <label className="text-[10px] text-[#74777D] block mb-1 uppercase">Amount (POL)</label>
                                                    <input
                                                        type="number"
                                                        className="bg-transparent w-full text-white outline-none font-mono text-sm"
                                                        placeholder="0.00"
                                                        value={amountInput}
                                                        onChange={(e) => {
                                                            // Reverse calc: update slider when user types amount
                                                            const val = Number(e.target.value);
                                                            setAmountInput(e.target.value);
                                                            if (tradeSide === 'buy') {
                                                                const maxBuy = (userBalance.USDT / Number(priceInput || '1'));
                                                                setSliderValue(Math.min((val / maxBuy) * 100, 100) || 0);
                                                            } else {
                                                                setSliderValue(Math.min((val / userBalance.POL) * 100, 100) || 0);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* D. Enhanced Slider */}
                                    {/* D. Normal Slider UI */}
                                        <div className="py-3 px-1 space-y-2 shrink-0">
                                            {/* Standard Range Input */}
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                step="1"
                                                value={sliderValue} 
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setSliderValue(val);
                                                    
                                                    // Calculation Logic
                                                    if (tradeSide === 'buy') {
                                                        if (!priceInput || Number(priceInput) === 0) return;
                                                        const maxBuyUSDT = userBalance.USDT;
                                                        const amountToSpend = (maxBuyUSDT * val) / 100;
                                                        const amountToBuy = amountToSpend / Number(priceInput);
                                                        setAmountInput(amountToBuy.toFixed(4));
                                                    } else {
                                                        const maxSellPOL = userBalance.POL;
                                                        const amountToSell = (maxSellPOL * val) / 100;
                                                        setAmountInput(amountToSell.toFixed(4));
                                                    }
                                                }}
                                                className="w-full h-1.5 bg-[#2F2F34] rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    accentColor: tradeSide === 'buy' ? '#00BC8A' : '#DF2040' 
                                                }}
                                            />

                                            {/* Percentage Labels (Clickable) */}
                                            <div className="flex justify-between text-[10px] text-[#74777D] font-bold select-none">
                                                {[0, 25, 50, 75, 100].map(p => (
                                                    <span 
                                                        key={p} 
                                                        className="cursor-pointer hover:text-white transition-colors"
                                                        onClick={() => {
                                                            setSliderValue(p);
                                                            // Trigger Calculation Logic manually for click
                                                            if (tradeSide === 'buy') {
                                                                if (!priceInput || Number(priceInput) === 0) return;
                                                                const maxBuyUSDT = userBalance.USDT;
                                                                const amountToSpend = (maxBuyUSDT * p) / 100;
                                                                const amountToBuy = amountToSpend / Number(priceInput);
                                                                setAmountInput(amountToBuy.toFixed(4));
                                                            } else {
                                                                const maxSellPOL = userBalance.POL;
                                                                const amountToSell = (maxSellPOL * p) / 100;
                                                                setAmountInput(amountToSell.toFixed(4));
                                                            }
                                                        }}
                                                    >
                                                        {p}%
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* E. Total */}
                                        <div className="flex justify-between items-center bg-[#1A1C1E] p-2 rounded-lg border border-[#2F2F34] shrink-0">
                                            <span className="text-[10px] text-[#74777D] uppercase">Total (USDT)</span>
                                            <span className="text-sm text-[#EEEEEE] font-mono">{totalUSDT.toFixed(2)}</span>
                                        </div>

                                        {/* F. Action Button */}
                                        <div className="mt-auto pt-2">
                                            <button
                                                onClick={handleTrade}
                                                disabled={loading}
                                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] 
                                                    ${tradeSide === 'buy'
                                                        ? 'bg-[#00BC8A] hover:bg-[#00A076] shadow-[0_4px_12px_rgba(0,188,138,0.2)]'
                                                        : 'bg-[#DF2040] hover:bg-[#C01B37] shadow-[0_4px_12px_rgba(223,32,64,0.2)]'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {loading ? 'Processing...' : (tradeSide === 'buy' ? 'Buy POL' : 'Sell POL')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- DEPOSIT & WITHDRAW MODE (Kept functional) --- */}
                                {(mode === 'deposit' || mode === 'withdraw') && (
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="space-y-3">
                                            {/* Asset Select */}
                                            <div className="p-[1px] rounded-xl bg-[#2F2F34]">
                                                <div className="bg-[#000] rounded-xl p-3">
                                                    <label className="text-[10px] text-[#74777D] block mb-1 uppercase">Asset</label>
                                                    <select
                                                        className="bg-black text-white w-full outline-none text-sm cursor-pointer"
                                                        value={selectedToken}
                                                        onChange={e => setSelectedToken(e.target.value as AssetSymbol)}
                                                    >
                                                        <option value="POL">POL</option>
                                                        <option value="USDT">USDT</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Amount Input */}
                                            <div className="p-[1px] rounded-xl bg-[#2F2F34]">
                                                <div className="bg-[#000] rounded-xl p-3">
                                                    <label className="text-[10px] text-[#74777D] block mb-1 uppercase">Amount</label>
                                                    <input
                                                        type="number"
                                                        className="bg-transparent w-full text-white outline-none font-mono text-sm"
                                                        placeholder="0.00"
                                                        value={amountInput}
                                                        onChange={e => setAmountInput(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-right text-xs text-[#9D98A4]">
                                                Balance: <span className="text-white">{userBalance[selectedToken]?.toFixed(4)} {selectedToken}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => handleAction(mode as 'deposit' | 'withdraw')}
                                                disabled={loading}
                                                className="w-full py-3.5 bg-[#E17726] rounded-xl font-bold text-white hover:bg-[#CD6116] transition-all shadow-[0_4px_12px_rgba(225,119,38,0.2)] disabled:opacity-50"
                                            >
                                                {loading ? 'Processing...' : (mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOTTOM TABLE: OPEN ORDERS (Updated with Cancel) */}
            <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                <div className="rounded-xl bg-[#121212] p-4">
                    <div className="flex gap-4 border-b border-[#2F2F34] pb-2 mb-2">
                        <span className="text-white text-sm border-b-2 border-[#00BC8A] pb-2">My Open Orders</span>
                    </div>
                    {myOpenOrders.length > 0 ? (
                        <div className="overflow-x-auto w-full no-scrollbar">
                            <table className="w-full text-sm text-[#EEEEEE]">
                                <thead>
                                    <tr className="text-[10px] text-[#74777D] uppercase border-b border-[#2F2F34]">
                                        <th className="text-left py-2">Side</th>
                                        <th className="text-right py-2">Price</th>
                                        <th className="text-right py-2">Amount</th>
                                        <th className="text-right py-2">Total (USDT)</th>
                                        <th className="text-right py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOpenOrders.map((order, i) => (
                                        <tr key={i} className="border-b border-[#1A1C1E] hover:bg-[#ffffff05]">
                                            <td className={`py-2 font-bold ${order.side === 'buy' ? 'text-[#00BC8A]' : 'text-[#DF2040]'}`}>{order.side?.toUpperCase()}</td>
                                            <td className="text-right py-2">{Number(order.price).toFixed(4)}</td>
                                            <td className="text-right py-2">{Number(order.amount).toFixed(4)}</td>
                                            <td className="text-right py-2 text-[#9D98A4]">{(Number(order.price) * Number(order.amount)).toFixed(2)}</td>
                                            <td className="text-right py-2">
                                                <button onClick={() => handleCancel(order)} className="text-xs text-[#DF2040] hover:text-red-400 border border-[#DF2040] px-2 py-1 rounded">Cancel</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-[#74777D] text-sm py-4">No open orders found for your wallet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exchange;