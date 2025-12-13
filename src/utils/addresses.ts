export const SWAP_ROUTER_ADDRESS = "0x8D41a27d5A661c09924234709Cb8BD05F999Ab01";
export const FACTORY_ADDRESS = "0x7B5BEFD18836DF1E72a21B328D34cc35aA1743b5";

export const TOKENS: Record<string, { address: string; decimals: number }> = {
    USDC: { address: "0xA6fbc65420327B89e43d50AB84E12E798fA9Cb46", decimals: 18 },
    USDT: { address: "0x285d3b54af96cBccA5C05cE4bA7F2dcD56bfc0c4", decimals: 18 },
};

// ... existing exports
export const POSITION_MANAGER_ADDRESS = "0x61d1F08f42189257148D54550C9B089a638B59d5"; // Replace with your actual address
export const FEE_TIERS = [3000]; // 0.05%, 0.3%, 1%