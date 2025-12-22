import 'dotenv/config';
import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// --- 1. ROBUST ENV LOADING ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to root folder (../../ from src/Backend)
const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("⚠️  Dotenv Error:", result.error.message);
    console.error("👉 Was looking for file at:", envPath);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;

// Try both names in case you named it VITE_PRIVATE_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY;

if (!PRIVATE_KEY) {
    console.error("❌ CRITICAL ERROR: PRIVATE_KEY is missing!");
    console.log("---------------------------------------------------");
    console.log("DEBUG INFO:");
    console.log("1. Checked file at:", envPath);
    console.log("2. Keys found in file:", Object.keys(process.env).filter(k => k.includes('KEY')));
    console.log("---------------------------------------------------");
    process.exit(1);
}

const signerWallet = new ethers.Wallet(PRIVATE_KEY);
console.log(`✅ Backend Signer Ready: ${signerWallet.address}`);

// --- CONFIGURATION ---
const EXCHANGE_CONTRACT_ADDRESS = "0x4f665Ef2EF5336D26a6c06525DD812786E5614c6";

const TOKENS = {
    POL: "0x0000000000000000000000000000000000000000", // Represents Native POL/ETH
    USDT: "0x285d3b54af96cBccA5C05cE4bA7F2dcD56bfc0c4"
};

const balances = {};
const bids = [];
const asks = [];
const userNonces = {};
let orderIdCounter = 1;

// --- HELPERS ---
const getBalance = (user, token) => {
    if (!balances[user]) balances[user] = { POL: 0, USDT: 0 };
    return balances[user][token] || 0;
};

const updateBalance = (user, token, amount, isAdd) => {
    if (!balances[user]) balances[user] = { POL: 0, USDT: 0 };
    const cur = balances[user][token] || 0;
    balances[user][token] = isAdd ? cur + amount : cur - amount;
};

// --- MATCHING ENGINE ---
const matchOrders = () => {
    let match = true;
    while (match && bids.length > 0 && asks.length > 0) {
        const bid = bids[0];
        const ask = asks[0];
        if (bid.price >= ask.price) {
            const amount = Math.min(bid.amount, ask.amount);
            const cost = amount * ask.price;

            updateBalance(bid.user, 'POL', amount, true);
            updateBalance(ask.user, 'USDT', cost, true);

            bid.amount -= amount;
            ask.amount -= amount;
            if (bid.amount <= 0) bids.shift();
            if (ask.amount <= 0) asks.shift();
        } else { match = false; }
    }
};

// --- ENDPOINTS ---

app.post('/webhook/deposit', (req, res) => {
    const { user, symbol, amount } = req.body;
    const internalSymbol = (symbol === 'ETH' || symbol === 'POL') ? 'POL' : 'USDT';
    updateBalance(user, internalSymbol, amount, true);
    res.json({ success: true });
});

app.get('/market-data', (req, res) => {
    const user = req.query.user;
    const format = (orders) => orders.map(o => ({ ...o, price: o.price.toString(), amount: o.amount.toString() }));
    res.json({
        bids: format(bids.slice(0, 10)),
        asks: format(asks.slice(0, 10)),
        userBalance: user ? balances[user] : { POL: 0, USDT: 0 }
    });
});

app.post('/order', (req, res) => {
    const { user, side, price, amount } = req.body;
    const p = Number(price);
    const a = Number(amount);
    const cost = p * a;
    const id = orderIdCounter++;

    if (side === 'buy') {
        if (getBalance(user, 'USDT') < cost) return res.status(400).json({ error: "Insufficient USDT" });
        updateBalance(user, 'USDT', cost, false);
        bids.push({ id, user, price: p, amount: a, timestamp: Date.now() });
        bids.sort((a, b) => b.price - a.price);
    } else {
        if (getBalance(user, 'POL') < a) return res.status(400).json({ error: "Insufficient POL" });
        updateBalance(user, 'POL', a, false);
        asks.push({ id, user, price: p, amount: a, timestamp: Date.now() });
        asks.sort((a, b) => a.price - b.price);
    }
    matchOrders();
    res.json({ success: true, id });
});

app.post('/withdraw', async (req, res) => {
    const { user, symbol, amount } = req.body;
    const internalSymbol = (symbol === 'ETH' || symbol === 'POL') ? 'POL' : 'USDT';

    if (getBalance(user, internalSymbol) < amount) {
        return res.status(400).json({ error: "Insufficient Balance" });
    }

    updateBalance(user, internalSymbol, amount, false);

    if (!userNonces[user]) userNonces[user] = 0;
    const nonce = ++userNonces[user];

    try {
        const tokenAddr = internalSymbol === 'POL' ? TOKENS.POL : TOKENS.USDT;
        const amountWei = ethers.parseUnits(amount.toString(), 18);
        const messageHash = ethers.solidityPackedKeccak256(
            ["address", "address", "uint256", "uint256", "address"],
            [user, tokenAddr, amountWei, nonce, EXCHANGE_CONTRACT_ADDRESS]
        );

        const signature = await signerWallet.signMessage(ethers.getBytes(messageHash));
        console.log("Backend signer:", signerWallet.address);

        console.log(`✅ Withdrawal Signed: User=${user} Symbol=${internalSymbol} Amount=${amount} Nonce=${nonce}`);
        console.log(`   Signature: ${signature}`);
        res.json({ success: true, signature, nonce });
    } catch (e) {
        updateBalance(user, internalSymbol, amount, true);
        res.status(500).json({ error: "Signing Failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});