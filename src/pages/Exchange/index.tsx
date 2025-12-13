import React, { useState, useEffect, useRef } from 'react';
import './swap.css';

const Exchange = () => {
    // --- STATE MANAGEMENT ---
    const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
    const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState({ name: 'ETH-USD', img: './assets/images/eth.svg' });
    const [selectedToken, setSelectedToken] = useState('ETH');
    const [sliderValue, setSliderValue] = useState(0);

    const [asks, setAsks] = useState([
        [305.4, 0.948], [3051.1, 1.969], [3050.8, 0.979], [3050.7, 5.057],
        [3050.3, 0.327], [300.2, 1.058], [3049.7, 1.028], [3049.4, 1.640],
        [5049.3, 7.644], [2049.2, 0.082],
    ]);
    const [bids, setBids] = useState([
        [90.8, 0.327], [3046.6, 7.644], [7046.3, 1.640], [3046.2, 5.057],
        [146.0, 1.878], [4045.8, 0.977], [3045.4, 0.977], [5045.2, 0.327],
        [2444.8, 2.547], [543.7, 7.214], [843.4, 0.979], [1045.2, 0.327],
    ]);

    const tickBarRef = useRef<HTMLDivElement>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = () => {
            setMarketDropdownOpen(false);
            setTokenDropdownOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // TradingView Widget
    useEffect(() => {
        if (chartContainerRef.current) {
            chartContainerRef.current.innerHTML = '';
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
            script.type = 'text/javascript';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "autosize": true,
                "symbol": "CAPITALCOM:ETHUSD",
                "interval": "60",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "hide_side_toolbar": false,
                "allow_symbol_change": false,
                "support_host": "https://www.tradingview.com"
            });
            chartContainerRef.current.appendChild(script);
        }
    }, []);

    // Orderbook Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setAsks(prev => prev.map(([p, q]) => [Math.max(0, p + (Math.random() - 0.5) * 0.7), q]));
            setBids(prev => prev.map(([p, q]) => [Math.max(0, p + (Math.random() - 0.5) * 0.7), q]));
        }, 1100);
        return () => clearInterval(interval);
    }, []);

    const calcTotals = (data: [any, any][]) => {
        let total = 0;
        return data.map(([p, q]) => {
            total += p * q;
            return { p, q, total };
        });
    };

    const renderOrderBookRow = (data: any[], type: string) => {
        const processed = calcTotals(data);
        const maxPrice = Math.max(...data.map(d => d[0])) || 1;
        const maxTotal = processed.at(-1)?.total || 1;

        return processed.map(({ p, q, total }, idx) => {
            let priceBar = (p / maxPrice) * 100;
            let totalBar = (total / maxTotal) * 100;
            priceBar = Math.min(priceBar, 95);
            totalBar = Math.min(totalBar, 95);

            const isAsk = type === 'ask';
            const priceColor = isAsk ? 'bg-[#3F151C]' : 'bg-[#174226]';
            const textColor = isAsk ? 'text-[#DF2040]' : 'text-[#40BF6A]';

            return (
                <div key={idx} className="grid grid-cols-4 text-sm font-normal overflow-hidden leading-[1]">
                    <div className="relative col-span-2 p-1.5">
                        <div className={`absolute inset-y-0 left-0 bar ${priceColor}`} style={{ width: `${priceBar.toFixed(1)}%` }}></div>
                        <span className={`relative z-10 ${textColor}`}>{p.toFixed(1)}</span>
                    </div>
                    <span className="relative z-10 p-1.5">{q.toFixed(3)}</span>
                    <div className="relative p-1.5">
                        <div className="absolute inset-y-0 right-0 bar bg-[#2F2F34] text-[#EEEEEE]" style={{ width: `${totalBar.toFixed(1)}%` }}></div>
                        <span className="relative z-10 flex justify-end">{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            );
        });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderValue(Number(e.target.value));
    };

    const getKnobPosition = () => {
        return `calc(${sliderValue}% - 7px)`;
    };

    return (
        <div className="font-poppins w-full min-h-screen bg-black p-4 xl:p-6 pt-8 xl:pt-12">
            {/* Main Trading Grid */}
            <section className="mb-6">
                <div className="swap-main-grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-2">
                    {/* COL 1: CHART & STATS */}
                    <div className="2xl:col-span-3 md:col-span-2 flex flex-col h-full">
                        {/* Stats Header */}
                        <div className="bg-[#1A1C1E] p-2 mb-2 rounded-xl flex items-center shrink-0">
                            <div className="custom-select relative w-max min-w-[120px]">
                                <button
                                    className="select-btn w-full flex items-center justify-between gap-2 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); setMarketDropdownOpen(!marketDropdownOpen); }}
                                >
                                    <span className="selected-item flex items-center gap-2 text-sm uppercase font-normal px-1.5 text-white">
                                        <img src={selectedMarket.img} className="size-4 rounded-full" alt={selectedMarket.name} />
                                        <span className="text-[#EEEEEE] text-base font-normal whitespace-nowrap">{selectedMarket.name}</span>
                                    </span>
                                    <svg className={`transition-transform duration-200 min-w-2 ${marketDropdownOpen ? 'rotate-180' : ''}`} width="8" height="5" viewBox="0 0 8 5" fill="none">
                                        <path d="M0.296477 1.71L2.88648 4.3C3.27648 4.69 3.90648 4.69 4.29648 4.3L6.88648 1.71C7.51648 1.08 7.06648 0 6.17648 0H0.996477C0.106477 0 -0.333523 1.08 0.296477 1.71Z" fill="#9D98A4" />
                                    </svg>
                                </button>
                                {marketDropdownOpen && (
                                    <ul className="absolute left-0 top-full w-full bg-[#0000005b] backdrop-blur-[5px] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[100px] text-sm">
                                        {[
                                            { name: 'BNB-USD', img: './assets/images/bnb-chain.svg' },
                                            { name: 'ETH-USD', img: './assets/images/eth.svg' },
                                            { name: 'USDT-USD', img: './assets/images/usdt.svg' }
                                        ].map(market => (
                                            <li key={market.name} onClick={() => setSelectedMarket(market)} className="p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer text-white">
                                                <img src={market.img} className="size-4 rounded-full" alt={market.name} />
                                                <span>{market.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex-grow overflow-x-auto flex items-start justify-between gap-3 text-nowrap px-4 md:px-6 no-scrollbar">
                                <div className="min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Price</h3>
                                    <p className="text-[#EEEEEE] text-sm font-normal">3,049.4</p>
                                </div>
                                <div className="hidden sm:block min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Index</h3>
                                    <p className="text-[#EEEEEE] text-sm font-normal">3,050.0</p>
                                </div>
                                <div className="min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase">24h Change</h3>
                                    <p className="text-[#00BC8A] text-sm font-normal">9.06%</p>
                                </div>
                                <div className="hidden md:block min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase"><span className="text-[#EEEEEE]">Funding</span> / Countdown</h3>
                                    <p className="text-[#EEEEEE] text-sm font-normal"><span className="text-[#FF944D]">0.0100% </span>/ 07:22:17</p>
                                </div>
                                <div className="hidden lg:block min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Open Interest</h3>
                                    <p className="text-[#EE3F3F] text-sm font-normal">$88,026</p>
                                </div>
                                <div className="min-w-fit">
                                    <h3 className="text-[#74777D] font-normal text-[10px] uppercase">24h Volume</h3>
                                    <p className="text-[#EEEEEE] text-sm font-normal">$35,423.5</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-[#1A1C1E] p-3 rounded-xl flex-1 flex flex-col overflow-hidden min-h-0">
                            <div className="pb-2 flex items-center gap-10 text-[#9D98A4] font-normal text-sm shrink-0">
                                <button className="cursor-pointer text-[#EEEEEE]">Chart</button>
                                <button className="cursor-pointer">Depth</button>
                                <button className="cursor-pointer">Market Details</button>
                            </div>
                            <div className="relative w-full flex-1 min-h-[300px]">
                                <div className="absolute inset-0">
                                    <div className="tradingview-widget-container h-full w-full">
                                        <div className="tradingview-widget-container__widget h-full w-full" ref={chartContainerRef}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COL 2: ORDERBOOK */}
                    <div className="h-full min-h-[450px] xl:min-h-0 p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="rounded-xl bg-[linear-gradient(90deg,#9D98A4_-340%,#000000_96.05%)] backdrop-blur-sm h-full overflow-hidden">
                            <div className="h-full flex flex-col">
                                <div className="text-white flex flex-col w-full h-full">
                                    <div className="grid grid-cols-2 text-[#9D98A4] text-sm font-normal py-3 px-2 shrink-0">
                                        <button className="text-[#EEEEEE] cursor-pointer text-left">Orderbook</button>
                                        <button className="cursor-pointer text-right">Trades</button>
                                    </div>
                                    <div className="grid grid-cols-4 text-[10px] text-[#A1A1A1] font-normal uppercase px-2 mb-1 shrink-0">
                                        <h3 className="col-span-2">Price</h3>
                                        <h3>Quantity</h3>
                                        <h3 className="text-right">Total</h3>
                                    </div>
                                    <div className="no-scrollbar flex-1 overflow-y-auto min-h-0">
                                        <div>{renderOrderBookRow(asks, 'ask')}</div>
                                        <div className="flex justify-between items-center text-sm font-normal p-3">
                                            <h5 className="text-[#74777D]">2.4 / 0.08%</h5>
                                            <div className="flex items-center gap-3">
                                                <h6 className="text-[#EEEEEE]">0.1</h6>
                                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                                                    <path d="M0.296477 1.71L2.88648 4.3C3.27648 4.69 3.90648 4.69 4.29648 4.3L6.88648 1.71C7.51648 1.08 7.06648 0 6.17648 0H0.996477C0.106477 0 -0.333523 1.08 0.296477 1.71Z" fill="#74777D" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>{renderOrderBookRow(bids, 'bid')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COL 3: TRADING FORM */}
                    <div className="h-full min-h-[450px] xl:min-h-0 xl:col-span-1 md:col-span-3 p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                        <div className="rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm h-full p-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="priceInput" className="text-sm text-[#EEEEEE] font-normal mb-2 block">Limit</label>
                                    <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                                        <input id="priceInput" className="placeholder:text-[#80838A] text-sm text-[#EEEEEE] font-normal rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] w-full p-3 focus:outline-none" type="text" placeholder="Price USD" />
                                    </div>
                                </div>

                                <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                                    <div className="rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] w-full p-3 flex items-center gap-2">
                                        <h4 className="text-[#80838A] text-sm font-normal">Quantity</h4>
                                        <div className="custom-select relative ml-auto">
                                            <button
                                                className="select-btn flex items-center gap-2 cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); setTokenDropdownOpen(!tokenDropdownOpen); }}
                                            >
                                                <span className="text-[#EEEEEE] text-sm font-normal">{selectedToken}</span>
                                                <svg className={`transition-transform duration-200 ${tokenDropdownOpen ? 'rotate-180' : ''}`} width="8" height="5" viewBox="0 0 8 5" fill="none">
                                                    <path d="M0.296477 1.71L2.88648 4.3C3.27648 4.69 3.90648 4.69 4.29648 4.3L6.88648 1.71C7.51648 1.08 7.06648 0 6.17648 0H0.996477C0.106477 0 -0.333523 1.08 0.296477 1.71Z" fill="#9D98A4" />
                                                </svg>
                                            </button>
                                            {tokenDropdownOpen && (
                                                <ul className="absolute right-0 top-full bg-[#000000] backdrop-blur-[5px] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[100px] text-sm text-white">
                                                    {['BNB', 'ETH', 'USDT'].map(token => (
                                                        <li key={token} onClick={() => setSelectedToken(token)} className="p-2 hover:bg-[#5f7a17] cursor-pointer">
                                                            {token}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <div className="relative flex items-center">
                                        <div ref={tickBarRef} className="tick-bar flex-1 h-4"></div>
                                        <div
                                            className="absolute size-4 rounded bg-[#1A1C1E] border border-[#FF6A00] pointer-events-none shadow-lg"
                                            style={{ left: getKnobPosition() }}
                                        ></div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sliderValue}
                                            onChange={handleSliderChange}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 mt-3 text-[#EEEEEE] text-sm font-bold">
                                        {[25, 50, 75, 100].map(val => (
                                            <button
                                                key={val}
                                                className={`border border-[#272A30] bg-transparent rounded h-10 cursor-pointer ${sliderValue === val ? 'btn-active' : ''}`}
                                                onClick={() => setSliderValue(val)}
                                            >
                                                {val}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="py-2 flex items-center justify-between">
                                    <h4 className="text-[#80838A] text-sm font-normal">Quantity</h4>
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path d="M1.00781 12.0762V11.2383H4.28906V12.0762H1.00781Z" fill="#00BC8A" />
                                        <path d="M12.0457 6.932L9.04569 15.5H8.03769L11.0377 6.932H12.0457Z" fill="#EEEEEE" />
                                        <path d="M17.0078 12.0762V11.2383H20.2891V12.0762H17.0078Z" fill="#EE3F3F" />
                                    </svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm font-bold text-black mt-4">
                                <button className="py-3 bg-[#40BF6A] rounded-lg cursor-pointer">Buy / Long</button>
                                <button className="py-3 bg-[#DF2040] rounded-lg cursor-pointer">Sell / Short</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Table Section */}
            <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                <div className="rounded-xl bg-[linear-gradient(0deg,#121212,#121212)] p-4">
                    <div className="flex items-center gap-4 pb-3">
                        <button className="font-normal text-sm text-[#EEEEEE] px-3 py-2 cursor-pointer">Open Orders</button>
                        <button className="font-normal text-sm text-[#9D98A4] px-3 py-2 cursor-pointer">Trade History</button>
                    </div>
                    <div className="overflow-x-auto w-full no-scrollbar">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="text-[10px] text-[#8C8C8C] bg-[#1A1C1E] uppercase">
                                    <th className="p-2 font-normal">Market</th>
                                    <th className="p-2 font-normal">Quantity</th>
                                    <th className="p-2 font-normal">Value</th>
                                    <th className="p-2 font-normal">Entry Price</th>
                                    <th className="p-2 font-normal">Index Price</th>
                                    <th className="p-2 font-normal">Liquidation Price</th>
                                    <th className="p-2 font-normal">Position Margin</th>
                                    <th className="p-2 font-normal">Unrealized P&L (%)</th>
                                    <th className="p-2 font-normal">Realized P&L</th>
                                    <th className="p-2 font-normal">TP/SL</th>
                                    <th className="p-2 font-normal">ADL</th>
                                    <th className="p-2 font-normal text-[#626267]">Close All</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="mt-4 p-[1px] rounded-lg bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%)]">
                        <div className="rounded-lg bg-[linear-gradient(0deg,#121212,#121212)] p-4">
                            <h3 className="text-center text-sm text-[#9D98A4] font-normal"> see your positions</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exchange;