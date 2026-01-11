// x402 payment configuration for premium content
// Uses Base Sepolia testnet for hackathon demo
// Note: Full x402 integration requires wallet setup

const PAYMENT_ADDRESS = process.env.X402_PAYMENT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Premium unlock payment configuration
export const premiumConfig = {
  accepts: {
    scheme: "exact" as const,
    price: "$0.01", // 1 cent for demo
    network: "eip155:84532", // Base Sepolia testnet
    payTo: PAYMENT_ADDRESS,
  },
  description: "Unlock premium style recommendations",
};

// Helper to check if x402 is fully configured
export function isX402Configured(): boolean {
  return PAYMENT_ADDRESS !== "0x0000000000000000000000000000000000000000";
}
