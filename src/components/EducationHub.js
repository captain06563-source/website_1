"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    emoji: "🚨",
    tag: "Threat Intel",
    title: "Flash USDT Scams Explained",
    tagColor: "text-danger-red border-danger-red/30 bg-danger-red/5",
    content: (
      <div className="space-y-3 font-mono text-[11px] text-gray-300 leading-relaxed">
        <p>
          <strong className="text-white">Flash USDT</strong> tokens are counterfeit BEP-20 contracts deployed on
          BSC that mimic the official Tether name and symbol — tricking wallet UIs into showing a Reported balance.
        </p>
        <p>
          Because they don&apos;t originate from the official Tether contract, they carry{" "}
          <strong className="text-danger-red">zero liquidity</strong> and cannot be swapped, deposited to exchanges,
          or transferred to real recipients.
        </p>
        <div className="border border-danger-red/20 bg-danger-red/5 p-3 rounded text-[10px] text-danger-red mt-2">
          <strong>Official USDT Contract (BSC Mainnet):</strong><br />
          <span className="text-white select-all break-all">0x55d398326f99059ff775485246999027b3197955</span>
        </div>
      </div>
    )
  },
  {
    emoji: "⚔️",
    tag: "Attack Vectors",
    title: "How Scammers Operate",
    tagColor: "text-amber-500 border-amber-500/30 bg-amber-500/5",
    content: (
      <div className="space-y-3 font-mono text-[11px] text-gray-300 leading-relaxed">
        <p>Common social engineering vectors used in USDT scams:</p>
        <div className="space-y-2">
          {[
            { icon: "💸", title: "OTC Below-Market Offers", desc: "Offering USDT at 10–30% discount. High probability of Reported tokens." },
            { icon: "🎭", title: "Reported Escrow Services", desc: "Counterfeit tokens used to \"prove\" a deposit before requesting real funds." },
            { icon: "🪂", title: "Airdrop Phishing", desc: "Reported tokens sent to wallets to lure owners into malicious approval contracts." },
            { icon: "🧲", title: "Honeypot Contracts", desc: "Tokens that allow purchase but block sale/transfer via hidden code logic." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-2 p-2 border border-white/5 bg-white/2 rounded">
              <span className="text-base shrink-0">{icon}</span>
              <div>
                <p className="text-white font-bold text-[10px]">{title}</p>
                <p className="text-[10px] text-gray-text mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    emoji: "🔍",
    tag: "Verify Guide",
    title: "Manual BscScan Verification",
    tagColor: "text-bsc-yellow border-bsc-yellow/30 bg-bsc-yellow/5",
    content: (
      <div className="space-y-3 font-mono text-[11px] text-gray-300 leading-relaxed">
        <p>Follow these steps to manually verify a USDT transfer on BscScan:</p>
        <ol className="space-y-2.5">
          {[
            { n: "1", text: <>Go to <a href="https://bscscan.com" target="_blank" rel="noopener noreferrer" className="text-bsc-yellow hover:underline">BscScan.com</a> and paste the transaction hash (TxHash).</> },
            { n: "2", text: <>Open the <strong className="text-white">Token Transfers</strong> tab within the transaction page.</> },
            { n: "3", text: <>Verify the "Interacted With" contract matches the official address exactly: <code className="text-safe-green text-[9px] break-all select-all">0x55d398326f99059ff775485246999027b3197955</code></> },
            { n: "4", text: <>Confirm the token label shows <strong className="text-white">Tether USD (USDT)</strong> — not any lookalike name.</> },
          ].map(({ n, text }) => (
            <li key={n} className="flex gap-3 items-start">
              <span className="font-mono text-[9px] text-bsc-yellow border border-bsc-yellow/25 w-5 h-5 flex items-center justify-center rounded shrink-0 font-bold">
                {n}
              </span>
              <span className="text-[10px] text-gray-300 leading-relaxed">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  },
  {
    emoji: "✅",
    tag: "Checklist",
    title: "Security Decision Matrix",
    tagColor: "text-safe-green border-safe-green/30 bg-safe-green/5",
    content: (
      <div className="space-y-3 font-mono text-[11px] text-gray-300">
        <p className="text-[10px] text-gray-text">Run these tests before accepting any USDT payment:</p>
        <div className="space-y-2">
          {[
            { ok: true,  label: "PancakeSwap Swap Test", desc: "Flash USDT cannot build DEX routes — swap will fail instantly." },
            { ok: true,  label: "CEX Deposit Test",      desc: "Real USDT credits on Binance/OKX within seconds. Clones fail silently." },
            { ok: true,  label: "Contract Address Match", desc: "Compare 0x55d3… character by character on BscScan." },
            { ok: false, label: "Wallet Balance Only",   desc: "Never trust a displayed balance without verifying the contract source." },
          ].map(({ ok, label, desc }) => (
            <div key={label} className={`flex gap-2.5 p-2.5 border rounded ${ok ? "border-safe-green/15 bg-safe-green/3" : "border-danger-red/15 bg-danger-red/3"}`}>
              <span className={`text-sm shrink-0 ${ok ? "text-safe-green" : "text-danger-red"}`}>{ok ? "✅" : "❌"}</span>
              <div>
                <p className={`font-bold text-[10px] ${ok ? "text-white" : "text-gray-400"}`}>{label}</p>
                <p className="text-[9px] text-gray-text mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
];

export default function EducationHub() {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div className="hud-container hud-panel relative">
      <div className="hud-bracket-tl"></div>
      <div className="hud-bracket-tr"></div>
      <div className="hud-bracket-bl"></div>
      <div className="hud-bracket-br"></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-bsc-yellow/10">
        <span className="text-xl">📚</span>
        <div>
          <h2 className="font-display text-base font-bold text-white">Security Knowledge Base</h2>
          <p className="font-mono text-[9px] text-gray-text mt-0.5">Threat intelligence · Scam vectors · Verify guides</p>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {sections.map((section, idx) => {
          const isOpen = openSection === idx;
          return (
            <div key={idx} className={`border rounded transition-all ${isOpen ? "border-bsc-yellow/15 bg-bsc-yellow/2" : "border-white/5 bg-transparent"}`}>
              <button
                onClick={() => setOpenSection(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between text-left p-3 hover:text-bsc-yellow transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{section.emoji}</span>
                  <div>
                    <span className={`inline-block font-mono text-[8px] font-bold uppercase tracking-widest border px-1.5 py-0.5 rounded mb-0.5 ${section.tagColor}`}>
                      {section.tag}
                    </span>
                    <p className="font-display text-sm font-bold text-white">{section.title}</p>
                  </div>
                </div>
                {isOpen
                  ? <ChevronUp className="h-3.5 w-3.5 text-bsc-yellow shrink-0" />
                  : <ChevronDown className="h-3.5 w-3.5 text-gray-text shrink-0" />
                }
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-4 border-t border-bsc-yellow/8 pt-3">
                  {section.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="mt-4 font-mono text-[9px] text-gray-text/50 text-center">
        📖 For educational purposes only · Not financial advice
      </p>
    </div>
  );
}
