"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowUpRight } from "lucide-react";

const codeExamples: Record<string, string> = {
  Solidity: `import "@flarenetwork/flare-periphery-contracts
  /flare/ContractRegistry.sol";
import "@flarenetwork/flare-periphery-contracts
  /flare/FtsoV2Interface.sol";

contract FtsoV2Consumer {
    FtsoV2Interface internal ftsoV2;

    function getFlrUsdPrice() external returns
        (uint256 value, int8 decimals, uint64 timestamp)
    {
        ftsoV2 = ContractRegistry.getFtsoV2();
        bytes21 flrUsdId = 0x01464c522f555344...;
        return ftsoV2.getFeedById(flrUsdId);
    }
}`,
  JavaScript: `import { Web3 } from "web3";

export async function main() {
  const w3 = new Web3(RPC_URL);
  const ftsov2 = new w3.eth.Contract(
    JSON.parse(ABI), FTSOV2_ADDRESS
  );

  const flrUsdId = "0x01464c522f555344...";
  const res = await ftsov2.methods
    .getFeedById(flrUsdId).call();

  console.log(
    "Value: %s, Decimals: %s, Timestamp: %s",
    res["0"], res["1"], res["2"]
  );
}`,
  Python: `import asyncio
from web3 import AsyncHTTPProvider, AsyncWeb3

async def main() -> None:
    w3 = AsyncWeb3(AsyncHTTPProvider(RPC_URL))
    ftsov2 = w3.eth.contract(
        address=FTSOV2_ADDRESS, abi=ABI
    )

    flr_usd_id = "0x01464c522f555344..."
    res = await ftsov2.functions \\
        .getFeedById(flr_usd_id).call()

    print(f"Value: {res[0]}, "
          f"Decimals: {res[1]}, "
          f"Timestamp: {res[2]}")`,
  Rust: `use alloy::{providers::ProviderBuilder, sol};
use eyre::Result;

sol!(FtsoV2, "abi/FtsoV2.json");

#[tokio::main]
async fn main() -> Result<()> {
    let provider = ProviderBuilder::new()
        .on_http(RPC_URL);
    let data = FtsoV2::new(FTSOV2_ADDRESS, provider)
        .getFeedById("0x01464c522f555344...")
        .call()
        .await?;
    println!("Value:{}, Decimals:{}, Timestamp:{}",
        data._0, data._1, data._2);
    Ok(())
}`,
  Go: `import (
  "github.com/ethereum/go-ethereum/accounts/abi/bind"
  "github.com/ethereum/go-ethereum/ethclient"
)

func FtsoV2Consumer() {
  client, _ := ethclient.Dial(RPC_URL)
  ftsov2, _ := NewFtsoV2(FTSOV2_ADDRESS, client)
  flrUsdId := "0x01464c522f555344..."
  var res []interface{}
  ftsov2.FtsoV2Caller.contract.Call(
    nil, &res, "getFeedById", flrUsdId,
  )
  println("Value:", res[0],
    "Decimals:", res[1],
    "Timestamp:", res[2])
}`,
};

const languages = Object.keys(codeExamples);

export default function CodeSection() {
  const [activeTab, setActiveTab] = useState("Solidity");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 md:py-36 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-flare-coral/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-flare-pink font-semibold mb-4">
            Developer Experience
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold mb-4">
            Build on Flare
          </h2>
          <p className="text-flare-muted text-lg max-w-2xl mx-auto">
            Leverage Flare&apos;s full-stack data solutions in your decentralized
            application.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Code window */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] overflow-hidden shadow-2xl shadow-black/50">
            {/* Window bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-flare-dim font-[family-name:var(--font-mono)]">
                FtsoV2Consumer
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-flare-dim hover:text-flare-muted transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Language tabs */}
            <div className="flex items-center gap-0 px-5 pt-3 border-b border-white/[0.06]">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === lang
                      ? "text-white"
                      : "text-flare-dim hover:text-flare-muted"
                  }`}
                >
                  {lang}
                  {activeTab === lang && (
                    <motion.div
                      layoutId="code-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-flare-pink to-flare-coral rounded-t"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Code content */}
            <div className="p-5 min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-[13px] leading-6 font-[family-name:var(--font-mono)] text-flare-muted overflow-x-auto"
                >
                  <code>{codeExamples[activeTab]}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="#"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-flare-pink text-white rounded-full hover:bg-flare-coral transition-all hover:shadow-[0_0_24px_rgba(230,50,90,0.4)]"
          >
            Developer Resources
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-flare-muted border border-white/[0.08] rounded-full hover:border-flare-pink/30 hover:text-white transition-all"
          >
            Learn about Flare
          </a>
        </motion.div>
      </div>
    </section>
  );
}
