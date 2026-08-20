// src/lib/market/symbols.ts
//
// Single source of truth for tradable markets (65+). Shared by the market-data
// routes and the trading engine so symbols, names, decimals and reference
// prices never drift apart. Live prices/changes come from CoinGecko keyed by
// coingeckoId (see referencePrice.ts); 'reference' is the offline fallback.

export interface MarketSymbol {
  symbol: string;        // BTCUSDT
  base: string;          // BTC
  quote: string;         // USDT
  name: string;          // Bitcoin
  coingeckoId: string;   // bitcoin
  reference: number;     // fallback price
  priceDecimals: number;
  sizeDecimals: number;
}

export const MARKETS: MarketSymbol[] = [
  { symbol: "BTCUSDT", base: "BTC", quote: "USDT", name: "Bitcoin", coingeckoId: "bitcoin", reference: 64281.5, priceDecimals: 2, sizeDecimals: 6 },
  { symbol: "ETHUSDT", base: "ETH", quote: "USDT", name: "Ethereum", coingeckoId: "ethereum", reference: 3492.12, priceDecimals: 2, sizeDecimals: 6 },
  { symbol: "BNBUSDT", base: "BNB", quote: "USDT", name: "BNB", coingeckoId: "binancecoin", reference: 592.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "SOLUSDT", base: "SOL", quote: "USDT", name: "Solana", coingeckoId: "solana", reference: 145.82, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "XRPUSDT", base: "XRP", quote: "USDT", name: "XRP", coingeckoId: "ripple", reference: 0.6248, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "ADAUSDT", base: "ADA", quote: "USDT", name: "Cardano", coingeckoId: "cardano", reference: 0.452, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "DOGEUSDT", base: "DOGE", quote: "USDT", name: "Dogecoin", coingeckoId: "dogecoin", reference: 0.1523, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "TRXUSDT", base: "TRX", quote: "USDT", name: "TRON", coingeckoId: "tron", reference: 0.1284, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "AVAXUSDT", base: "AVAX", quote: "USDT", name: "Avalanche", coingeckoId: "avalanche-2", reference: 36.21, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "LINKUSDT", base: "LINK", quote: "USDT", name: "Chainlink", coingeckoId: "chainlink", reference: 14.82, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "DOTUSDT", base: "DOT", quote: "USDT", name: "Polkadot", coingeckoId: "polkadot", reference: 6.92, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "MATICUSDT", base: "MATIC", quote: "USDT", name: "Polygon", coingeckoId: "matic-network", reference: 0.7123, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "TONUSDT", base: "TON", quote: "USDT", name: "Toncoin", coingeckoId: "the-open-network", reference: 7.45, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "SHIBUSDT", base: "SHIB", quote: "USDT", name: "Shiba Inu", coingeckoId: "shiba-inu", reference: 0.00002412, priceDecimals: 8, sizeDecimals: 0 },
  { symbol: "LTCUSDT", base: "LTC", quote: "USDT", name: "Litecoin", coingeckoId: "litecoin", reference: 84.3, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "BCHUSDT", base: "BCH", quote: "USDT", name: "Bitcoin Cash", coingeckoId: "bitcoin-cash", reference: 482.1, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "UNIUSDT", base: "UNI", quote: "USDT", name: "Uniswap", coingeckoId: "uniswap", reference: 10.84, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "XLMUSDT", base: "XLM", quote: "USDT", name: "Stellar", coingeckoId: "stellar", reference: 0.1124, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "ATOMUSDT", base: "ATOM", quote: "USDT", name: "Cosmos", coingeckoId: "cosmos", reference: 8.92, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "ETCUSDT", base: "ETC", quote: "USDT", name: "Ethereum Classic", coingeckoId: "ethereum-classic", reference: 27.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "FILUSDT", base: "FIL", quote: "USDT", name: "Filecoin", coingeckoId: "filecoin", reference: 5.82, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "APTUSDT", base: "APT", quote: "USDT", name: "Aptos", coingeckoId: "aptos", reference: 9.12, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "ARBUSDT", base: "ARB", quote: "USDT", name: "Arbitrum", coingeckoId: "arbitrum", reference: 1.124, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "OPUSDT", base: "OP", quote: "USDT", name: "Optimism", coingeckoId: "optimism", reference: 2.31, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "NEARUSDT", base: "NEAR", quote: "USDT", name: "NEAR Protocol", coingeckoId: "near", reference: 6.42, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "INJUSDT", base: "INJ", quote: "USDT", name: "Injective", coingeckoId: "injective-protocol", reference: 27.8, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "SUIUSDT", base: "SUI", quote: "USDT", name: "Sui", coingeckoId: "sui", reference: 1.482, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "IMXUSDT", base: "IMX", quote: "USDT", name: "Immutable", coingeckoId: "immutable-x", reference: 2.12, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "HBARUSDT", base: "HBAR", quote: "USDT", name: "Hedera", coingeckoId: "hedera-hashgraph", reference: 0.1024, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "VETUSDT", base: "VET", quote: "USDT", name: "VeChain", coingeckoId: "vechain", reference: 0.0342, priceDecimals: 4, sizeDecimals: 1 },
  { symbol: "MKRUSDT", base: "MKR", quote: "USDT", name: "Maker", coingeckoId: "maker", reference: 2841, priceDecimals: 2, sizeDecimals: 6 },
  { symbol: "AAVEUSDT", base: "AAVE", quote: "USDT", name: "Aave", coingeckoId: "aave", reference: 132.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "GRTUSDT", base: "GRT", quote: "USDT", name: "The Graph", coingeckoId: "the-graph", reference: 0.2412, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "ALGOUSDT", base: "ALGO", quote: "USDT", name: "Algorand", coingeckoId: "algorand", reference: 0.1684, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "FTMUSDT", base: "FTM", quote: "USDT", name: "Fantom", coingeckoId: "fantom", reference: 0.7421, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "SANDUSDT", base: "SAND", quote: "USDT", name: "The Sandbox", coingeckoId: "the-sandbox", reference: 0.4123, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "MANAUSDT", base: "MANA", quote: "USDT", name: "Decentraland", coingeckoId: "decentraland", reference: 0.4521, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "AXSUSDT", base: "AXS", quote: "USDT", name: "Axie Infinity", coingeckoId: "axie-infinity", reference: 6.82, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "THETAUSDT", base: "THETA", quote: "USDT", name: "Theta Network", coingeckoId: "theta-token", reference: 1.842, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "EGLDUSDT", base: "EGLD", quote: "USDT", name: "MultiversX", coingeckoId: "elrond-erd-2", reference: 38.2, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "XTZUSDT", base: "XTZ", quote: "USDT", name: "Tezos", coingeckoId: "tezos", reference: 0.9421, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "FLOWUSDT", base: "FLOW", quote: "USDT", name: "Flow", coingeckoId: "flow", reference: 0.7842, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "CHZUSDT", base: "CHZ", quote: "USDT", name: "Chiliz", coingeckoId: "chiliz", reference: 0.0921, priceDecimals: 4, sizeDecimals: 1 },
  { symbol: "EOSUSDT", base: "EOS", quote: "USDT", name: "EOS", coingeckoId: "eos", reference: 0.7621, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "NEOUSDT", base: "NEO", quote: "USDT", name: "Neo", coingeckoId: "neo", reference: 12.84, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "KAVAUSDT", base: "KAVA", quote: "USDT", name: "Kava", coingeckoId: "kava", reference: 0.6421, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "ZECUSDT", base: "ZEC", quote: "USDT", name: "Zcash", coingeckoId: "zcash", reference: 24.8, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "DASHUSDT", base: "DASH", quote: "USDT", name: "Dash", coingeckoId: "dash", reference: 29.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "GALAUSDT", base: "GALA", quote: "USDT", name: "Gala", coingeckoId: "gala", reference: 0.0342, priceDecimals: 4, sizeDecimals: 1 },
  { symbol: "ENJUSDT", base: "ENJ", quote: "USDT", name: "Enjin Coin", coingeckoId: "enjincoin", reference: 0.2841, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "BATUSDT", base: "BAT", quote: "USDT", name: "Basic Attention", coingeckoId: "basic-attention-token", reference: 0.2412, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "1INCHUSDT", base: "1INCH", quote: "USDT", name: "1inch", coingeckoId: "1inch", reference: 0.3842, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "COMPUSDT", base: "COMP", quote: "USDT", name: "Compound", coingeckoId: "compound-governance-token", reference: 54.2, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "CRVUSDT", base: "CRV", quote: "USDT", name: "Curve DAO", coingeckoId: "curve-dao-token", reference: 0.3421, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "SNXUSDT", base: "SNX", quote: "USDT", name: "Synthetix", coingeckoId: "synthetix-network-token", reference: 2.842, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "LDOUSDT", base: "LDO", quote: "USDT", name: "Lido DAO", coingeckoId: "lido-dao", reference: 1.842, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "RUNEUSDT", base: "RUNE", quote: "USDT", name: "THORChain", coingeckoId: "thorchain", reference: 4.621, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "FETUSDT", base: "FET", quote: "USDT", name: "Fetch.ai", coingeckoId: "fetch-ai", reference: 1.342, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "RNDRUSDT", base: "RNDR", quote: "USDT", name: "Render", coingeckoId: "render-token", reference: 7.842, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "PEPEUSDT", base: "PEPE", quote: "USDT", name: "Pepe", coingeckoId: "pepe", reference: 0.00001124, priceDecimals: 8, sizeDecimals: 0 },
  { symbol: "WIFUSDT", base: "WIF", quote: "USDT", name: "dogwifhat", coingeckoId: "dogwifcoin", reference: 2.412, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "BONKUSDT", base: "BONK", quote: "USDT", name: "Bonk", coingeckoId: "bonk", reference: 0.00002841, priceDecimals: 8, sizeDecimals: 0 },
  { symbol: "JUPUSDT", base: "JUP", quote: "USDT", name: "Jupiter", coingeckoId: "jupiter-exchange-solana", reference: 0.9421, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "PYTHUSDT", base: "PYTH", quote: "USDT", name: "Pyth Network", coingeckoId: "pyth-network", reference: 0.4123, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "SEIUSDT", base: "SEI", quote: "USDT", name: "Sei", coingeckoId: "sei-network", reference: 0.4821, priceDecimals: 4, sizeDecimals: 2 },
  { symbol: "TIAUSDT", base: "TIA", quote: "USDT", name: "Celestia", coingeckoId: "celestia", reference: 7.421, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "STXUSDT", base: "STX", quote: "USDT", name: "Stacks", coingeckoId: "blockstack", reference: 1.842, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "WLDUSDT", base: "WLD", quote: "USDT", name: "Worldcoin", coingeckoId: "worldcoin-wld", reference: 2.412, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "ENSUSDT", base: "ENS", quote: "USDT", name: "Ethereum Name Service", coingeckoId: "ethereum-name-service", reference: 22.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "DYDXUSDT", base: "DYDX", quote: "USDT", name: "dYdX", coingeckoId: "dydx-chain", reference: 1.482, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "GMXUSDT", base: "GMX", quote: "USDT", name: "GMX", coingeckoId: "gmx", reference: 28.4, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "CAKEUSDT", base: "CAKE", quote: "USDT", name: "PancakeSwap", coingeckoId: "pancakeswap-token", reference: 2.412, priceDecimals: 2, sizeDecimals: 2 },
  { symbol: "ICPUSDT", base: "ICP", quote: "USDT", name: "Internet Computer", coingeckoId: "internet-computer", reference: 10.84, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "QNTUSDT", base: "QNT", quote: "USDT", name: "Quant", coingeckoId: "quant-network", reference: 84.2, priceDecimals: 2, sizeDecimals: 4 },
  { symbol: "CROUSDT", base: "CRO", quote: "USDT", name: "Cronos", coingeckoId: "crypto-com-chain", reference: 0.0921, priceDecimals: 4, sizeDecimals: 1 },
  { symbol: "ZILUSDT", base: "ZIL", quote: "USDT", name: "Zilliqa", coingeckoId: "zilliqa", reference: 0.0184, priceDecimals: 4, sizeDecimals: 1 },
];

const BY_SYMBOL = new Map(MARKETS.map((m) => [m.symbol, m]));
const BY_BASE = new Map(MARKETS.map((m) => [m.base, m]));

export function getMarket(symbol: string): MarketSymbol | undefined {
  return BY_SYMBOL.get(symbol.toUpperCase());
}

export function getMarketByBase(base: string): MarketSymbol | undefined {
  return BY_BASE.get(base.toUpperCase());
}

export function isTradableSymbol(symbol: string): boolean {
  return BY_SYMBOL.has(symbol.toUpperCase());
}

export const COINGECKO_IDS = MARKETS.map((m) => m.coingeckoId);

export const TRADE_FEE_RATE = 0.001; // 0.10% taker/maker fee
