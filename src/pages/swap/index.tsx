import React, { useState, useEffect, useRef } from 'react';

const Swap = () => {
    // --- STATE MANAGEMENT ---

    // Dropdown States
    const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
    const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState({ name: 'ETH-USD', img: './assets/images/eth.svg' });
    const [selectedToken, setSelectedToken] = useState('ETH');

    // Slider State
    const [sliderValue, setSliderValue] = useState(0);

    // Orderbook State
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

    // --- REFS ---
    const tickBarRef = useRef<HTMLDivElement>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // --- EFFECTS ---

    // Click outside listener for dropdowns
    useEffect(() => {
        const handleClickOutside = () => {
            setMarketDropdownOpen(false);
            setTokenDropdownOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // TradingView Widget Injection
    useEffect(() => {
        if (chartContainerRef.current) {
            chartContainerRef.current.innerHTML = ''; // Clear previous
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

    // Orderbook Simulation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setAsks(prev => prev.map(([p, q]) => [Math.max(0, p + (Math.random() - 0.5) * 0.7), q]));
            setBids(prev => prev.map(([p, q]) => [Math.max(0, p + (Math.random() - 0.5) * 0.7), q]));
        }, 1100);
        return () => clearInterval(interval);
    }, []);

    // --- HELPERS ---

    // Calculate Orderbook Totals for Bars
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
                    {/* Price */}
                    <div className="relative col-span-2 p-1.5">
                        <div className={`absolute inset-y-0 left-0 bar ${priceColor}`} style={{ width: `${priceBar.toFixed(1)}%` }}></div>
                        <span className={`relative z-10 ${textColor}`}>{p.toFixed(1)}</span>
                    </div>
                    {/* Quantity */}
                    <span className="relative z-10 p-1.5">{q.toFixed(3)}</span>
                    {/* Total */}
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
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        .font-poppins {
            font-family: "Poppins", sans-serif;
        }

        .tick-bar::before {
            content: "";
            position: absolute;
            inset: 0;
            background: url(./assets/images/chart-progress-bar.svg);
            width: 100%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
        }
        .btn-active {
            border-color: #f97316 !important;
            color: #f97316 !important;
            background-color: rgba(249, 115, 22, 0.16) !important;
        }
        .no-scrollbar::-webkit-scrollbar {
            width: 3px;
        }
        .no-scrollbar::-webkit-scrollbar-track {
            background: #888;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
            background: #C9FA49;
        }
        .bar {
            transition: width 0.9s ease;
        }
      `}</style>

            <div className="font-poppins w-full h-screen p-2.5 ,linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] mt-4">
                {/* Header */}

                <section>
                    <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-1">
                        {/* Chart Column */}
                        <div className="2xl:col-span-3 md:col-span-2">
                            <div className="bg-[#1A1C1E] p-1.5 mb-1.5 rounded-xl flex items-center">
                                {/* Market Select */}
                                <div className="custom-select relative w-max min-w-[120px]">
                                    <button
                                        className="select-btn w-full flex items-center justify-between gap-2 cursor-pointer transition-all"
                                        onClick={(e) => { e.stopPropagation(); setMarketDropdownOpen(!marketDropdownOpen); }}
                                    >
                                        <span className="selected-item flex items-center gap-2 whitespace-normal text-sm uppercase font-normal pl-1 pr-1.5 text-[#FFFFFF]">
                                            <img src={selectedMarket.img} className="size-[16px] rounded-full" alt={selectedMarket.name} />
                                            <span className="text-[#EEEEEE] text-base font-normal whitespace-nowrap">{selectedMarket.name}</span>
                                        </span>
                                        <svg className={`exchange-arrow transition-transform duration-200 min-w-2 ${marketDropdownOpen ? 'rotate-180' : ''}`} width="8" height="5" viewBox="0 0 8 5" fill="none">
                                            <path d="M0.296477 1.71L2.88648 4.3C3.27648 4.69 3.90648 4.69 4.29648 4.3L6.88648 1.71C7.51648 1.08 7.06648 0 6.17648 0H0.996477C0.106477 0 -0.333523 1.08 0.296477 1.71Z" fill="#9D98A4" />
                                        </svg>
                                    </button>
                                    {marketDropdownOpen && (
                                        <ul className="exchange-options absolute left-0 top-full w-full bg-[#0000005b] backdrop-blur-[5px] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[100px] text-sm font-normal text-white">
                                            <li onClick={() => setSelectedMarket({ name: 'BNB-USD', img: './assets/images/bnb-chain.svg' })} className="option-item p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer">
                                                <img src="./assets/images/bnb-chain.svg" className="size-[16px] rounded-full" alt="BNB" />
                                                <span>BNB-USD</span>
                                            </li>
                                            <li onClick={() => setSelectedMarket({ name: 'ETH-USD', img: './assets/images/eth.svg' })} className="option-item p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer">
                                                <img src="./assets/images/eth.svg" className="size-[16px] rounded-full" alt="ETH" />
                                                <span>ETH-USD</span>
                                            </li>
                                            <li onClick={() => setSelectedMarket({ name: 'USDT-USD', img: './assets/images/usdt.svg' })} className="option-item p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer">
                                                <img src="./assets/images/usdt.svg" className="size-[16px] rounded-full" alt="USDT" />
                                                <span>USDT-USD</span>
                                            </li>
                                        </ul>
                                    )}
                                </div>

                                {/* Market Stats */}
                                <div className="flex-grow overflow-x-auto flex items-start justify-between gap-3 text-nowrap px-[28px] no-scrollbar">
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Price</h3>
                                        <p className="text-[#EEEEEE] text-sm font-normal">3,049.4</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Index</h3>
                                        <p className="text-[#EEEEEE] text-sm font-normal">3,050.0</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase">24h Change</h3>
                                        <p className="text-[#00BC8A] text-sm font-normal">9.06%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase"><span className="text-[#EEEEEE]">Funding</span> / Countdown</h3>
                                        <p className="text-[#EEEEEE] text-sm font-normal"><span className="text-[#FF944D]">0.0100% </span>/ 07:22:17</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase">Open Interest</h3>
                                        <p className="text-[#EE3F3F] text-sm font-normal">$88,026</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[#74777D] font-normal text-[10px] uppercase">24h Volume</h3>
                                        <p className="text-[#EEEEEE] text-sm font-normal">$35,423.5</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1A1C1E] md:p-[11px_14px] p-[11px_5px] rounded-xl">
                                <div className="pb-[11px] flex items-center gap-10 text-[#9D98A4] font-normal text-sm">
                                    <button className="cursor-pointer text-[#EEEEEE]">Chart</button>
                                    <button className="cursor-pointer ">Depth</button>
                                    <button className="cursor-pointer ">Market Details</button>
                                </div>
                                <div className="relative lg:pt-[calc(100vh_-_390px)] md:pt-[calc(100vh_-_330px)] pt-[calc(100vh_-_175px)]">
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        {/* TradingView Widget */}
                                        <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
                                            <div className="tradingview-widget-container__widget" ref={chartContainerRef} style={{ height: '100%', width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orderbook Column */}
                        <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                            <div className="rounded-xl bg-[linear-gradient(90deg,#9D98A4_-340%,#000000_96.05%)] backdrop-blur-sm h-full overflow-hidden">
                                <div id="orderbook-root">
                                    <div className="text-white rounded-2xl font-normal flex flex-col w-full h-full">
                                        <div className="grid grid-cols-2 text-[#9D98A4] text-sm font-normal py-3 px-2">
                                            <button className="text-[#EEEEEE] cursor-pointer text-left">Orderbook</button>
                                            <button className="cursor-pointer text-right">Trades</button>
                                        </div>
                                        <div className="grid grid-cols-4 text-[10px] text-[#A1A1A1] font-normal uppercase px-2 mb-1">
                                            <h3 className="col-span-2">Price</h3>
                                            <h3>Quantity</h3>
                                            <h3 className="text-right">Total</h3>
                                        </div>
                                        <div className="no-scrollbar flex-1 overflow-y-auto lg:max-h-[calc(100vh_-_349px)] md:max-h-[calc(100vh_-_289px)] max-h-[calc(420px_-_0px)]">
                                            <div>{renderOrderBookRow(asks, 'ask')}</div>
                                            <div className="flex justify-between items-center text-gray-400 text-sm font-normal p-[12px_6px]">
                                                <h5 className="text-[#74777D]">2.4 / 0.08%</h5>
                                                <div className="flex items-center gap-3">
                                                    <h6 className="text-[#EEEEEE]">0.1</h6>
                                                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                        {/* Trading Form Column */}
                        <div className="xl:col-span-1 md:col-span-3 p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                            <div className="rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm h-full p-[12px_18px] flex flex-col justify-between">
                                <div>
                                    {/* Price Input */}
                                    <div>
                                        <label htmlFor="priceInput" className="text-sm text-[#EEEEEE] font-normal mb-2.5">Limit</label>
                                        <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                                            <input id="priceInput" className="placeholder:text-[#80838A] text-sm text-[#EEEEEE] font-normal rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm w-full p-[14px_9px] focus:border-none focus:outline-none" type="text" placeholder="Price USD" />
                                        </div>
                                    </div>

                                    {/* Quantity Input with Token Select */}
                                    <div className="p-[1px] rounded-xl bg-[radial-gradient(98%_49.86%_at_100.03%_100%,#75912B_0%,rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,rgba(255,255,255,0.81)_0%,rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)] mt-2.5">
                                        <div className="placeholder:text-[#80838A] text-sm text-[#EEEEEE] font-normal rounded-xl bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm w-full p-[14px_9px] focus:border-none flex items-center gap-1">
                                            <h4 className="text-[#80838A] text-sm font-normal">Quantity</h4>
                                            <div className="custom-select relative">
                                                <button
                                                    className="select-btn w-full flex items-center justify-between gap-2 cursor-pointer transition-all"
                                                    onClick={(e) => { e.stopPropagation(); setTokenDropdownOpen(!tokenDropdownOpen); }}
                                                >
                                                    <span className="selected-item flex items-center gap-2 whitespace-normal text-sm uppercase font-normal pl-1 pr-1.5 text-[#FFFFFF]">
                                                        <span className="text-[#EEEEEE] text-sm font-normal">{selectedToken}</span>
                                                    </span>
                                                    <svg className={`exchange-arrow transition-transform duration-200 ${tokenDropdownOpen ? 'rotate-180' : ''}`} width="8" height="5" viewBox="0 0 8 5" fill="none">
                                                        <path d="M0.296477 1.71L2.88648 4.3C3.27648 4.69 3.90648 4.69 4.29648 4.3L6.88648 1.71C7.51648 1.08 7.06648 0 6.17648 0H0.996477C0.106477 0 -0.333523 1.08 0.296477 1.71Z" fill="#9D98A4" />
                                                    </svg>
                                                </button>
                                                {tokenDropdownOpen && (
                                                    <ul className="exchange-options absolute left-0 top-full w-full bg-[#0000005b] backdrop-blur-[5px] border border-[#FFFFFF1A] rounded shadow mt-1 z-10 min-w-[100px] text-sm font-normal text-white">
                                                        {['BNB', 'ETH', 'USDT'].map(token => (
                                                            <li key={token} onClick={() => setSelectedToken(token)} className="option-item p-2 flex items-center gap-2 hover:bg-[#5f7a17] cursor-pointer">
                                                                <span>{token}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slider */}
                                    <div className="w-[100%] py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-1 h-4 ">
                                                <div ref={tickBarRef} id="tickBar" className="tick-bar flex-1 w-full h-full"></div>
                                                <div
                                                    id="knob"
                                                    className="absolute top-0 size-4 rounded-[4px] bg-[#1A1C1E] border border-[#FF6A00] transition-all duration-150 pointer-events-none shadow-[0px_0px_5px_0px_#000000]"
                                                    style={{ left: getKnobPosition() }}
                                                ></div>
                                                <input
                                                    id="rangeSlider"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={sliderValue}
                                                    onChange={handleSliderChange}
                                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-[2px] mt-4 text-[#EEEEEE] text-sm font-bold">
                                            {[25, 50, 75, 100].map(val => (
                                                <button
                                                    key={val}
                                                    className={`btn-percent border border-[#272A30] bg-transparent rounded-[2px] h-[40px] cursor-pointer ${sliderValue == val ? 'btn-active' : ''}`}
                                                    onClick={() => setSliderValue(val)}
                                                >
                                                    {val}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Balance Display */}
                                    <div className="py-3 flex items-center justify-between">
                                        <h4 className="text-[#80838A] text-sm font-normal">Quantity</h4>
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.00781 12.0762V11.2383H4.28906V12.0762H1.00781Z" fill="#00BC8A" />
                                            <path d="M12.0457 6.932L9.04569 15.5H8.03769L11.0377 6.932H12.0457Z" fill="#EEEEEE" />
                                            <path d="M17.0078 12.0762V11.2383H20.2891V12.0762H17.0078Z" fill="#EE3F3F" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 text-sm font-bold text-[#000000]">
                                    <button className="py-3 text-center bg-[#40BF6A] rounded-lg cursor-pointer">Buy / Long</button>
                                    <button className="py-3 text-center bg-[#DF2040] rounded-lg cursor-pointer">Sell / Short</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <div className="relative rounded-[20px] my-2.5 p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,_#75912B_0%,_rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,_rgba(255,255,255,0.81)_0%,_rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_100%)]">
                    <div className="rounded-[20px] bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] p-2 min-h-[200px]">

                        <div className="flex items-center gap-2 pb-2">
                            <button className="font-normal text-xs text-[#9D98A4] cursor-pointer px-3 py-2">Open Orders</button>
                            <button className="font-normal text-xs text-[#9D98A4] cursor-pointer px-3 py-2">Trade History</button>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="text-[10px] text-[#8C8C8C] bg-[#1A1C1E] rounded-[9px] uppercase overflow-hidden">
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
                                        <th className="p-2 font-normal flex gap-1 justify-center items-center">
                                            ADL
                                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                                <path d="M3.75 2.08333H4.58333V2.91667H3.75V2.08333ZM3.75 3.75H4.58333V6.25H3.75V3.75ZM4.16667 0C1.86667 0 0 1.86667 0 4.16667C0 6.46667 1.86667 8.33333 4.16667 8.33333C6.46667 8.33333 8.33333 6.46667 8.33333 4.16667C8.33333 1.86667 6.46667 0 4.16667 0ZM4.16667 7.5C2.32917 7.5 0.833333 6.00417 0.833333 4.16667C0.833333 2.32917 2.32917 0.833333 4.16667 0.833333C6.00417 0.833333 7.5 2.32917 7.5 4.16667C7.5 6.00417 6.00417 7.5 4.16667 7.5Z" fill="#8C8C8C" />
                                            </svg>
                                        </th>
                                        <th className="p-2 font-normal text-[#626267] min-w-[200px]">Close All</th>
                                    </tr>
                                </thead>
                                <tbody className="hidden">
                                    <tr>
                                        <td colSpan={12} className="p-6 bg-[#121212] text-[#9D98A4] rounded-[7px] shadow-[0px_1px_1px_0px_#272A30_inset] text-center"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="relative rounded-[5px] p-[1px] bg-[radial-gradient(98%_49.86%_at_100.03%_100%,_#75912B_0%,_rgba(117,145,43,0.05)_100%),radial-gradient(24.21%_39.21%_at_0%_0%,_rgba(255,255,255,0.81)_0%,_rgba(255,255,255,0.19)_100%),radial-gradient(21.19%_40.1%_at_100.03%_0%,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_100%)]">
                            <div className="rounded-[5px] bg-[linear-gradient(0deg,#121212,#121212),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000)] backdrop-blur-sm h-full p-[12px_18px]">
                                <h3 className="text-center text-sm text-[#9D98A4] font-normal">Connect wallet to see your positions</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Swap;