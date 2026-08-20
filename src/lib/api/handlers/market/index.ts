// Route table for the /api/market/* catch-all (src/app/api/market/[...path]/route.ts).
import type { ApiRouteTable } from "../../types";
import * as chart from "./chart";
import * as news from "./news";
import * as prices from "./prices";
import * as orderbook from "./orderbook";
import * as trades from "./trades";
import * as candles from "./candles";
import * as ticker from "./ticker";

export const routes: ApiRouteTable = [
  { pattern: "chart", handlers: { GET: chart.GET } },
  { pattern: "news", handlers: { GET: news.GET } },
  { pattern: "prices", handlers: { GET: prices.GET } },
  { pattern: "orderbook", handlers: { GET: orderbook.GET } },
  { pattern: "trades", handlers: { GET: trades.GET } },
  { pattern: "candles", handlers: { GET: candles.GET } },
  { pattern: "ticker", handlers: { GET: ticker.GET } },
];
