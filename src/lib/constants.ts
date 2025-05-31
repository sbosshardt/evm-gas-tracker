export const COMMON_TASKS = [
    { label: "ETH Transfer", gas: 21000 },
    { label: "Token Transfer", gas: 45000 },
    { label: "DEX Swap", gas: 100000 },
    { label: "Mint NFT", gas: 200000 },
];

export type CurrencyInfo = {
    name: string;
    symbol: string;
};

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
    USD: { name: "US Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    KRW: { name: "South Korean Won", symbol: "₩" },
    BTC: { name: "Bitcoin", symbol: "₿" },
    ETH: { name: "Ethereum", symbol: "Ξ" },
    BNB: { name: "Binance Coin", symbol: "♦" },
};
