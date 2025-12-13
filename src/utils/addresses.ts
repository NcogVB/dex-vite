export const SWAP_ROUTER_ADDRESS = "0x8D41a27d5A661c09924234709Cb8BD05F999Ab01";
export const FACTORY_ADDRESS = "0x7B5BEFD18836DF1E72a21B328D34cc35aA1743b5";

export const TOKENS: Record<string, { address: string; decimals: number }> = {
    USDC: { address: "0x66A8354e9A5a214d347b4b4554c22F27006Be398", decimals: 18 },
    USDT: { address: "0x71297bB76b7624598fD4C7a90d62A2BfE8166E74", decimals: 18 },
};

export const FEE_TIERS = [500, 3000, 10000]; // 0.05%, 0.3%, 1%