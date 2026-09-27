"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import TokenVerifier from "@/components/TokenVerifier";
import EducationHub from "@/components/EducationHub";
import { Copy, Check, ExternalLink, Activity, Zap } from "lucide-react";
import BSCVerifyLogo from "@/components/BSCVerifyLogo";

export default function Home() {
  const [walletStatus, setWalletStatus] = useState({
    status: "disconnected",
    address: "",
    balance: "0.00" 
  });
  const [copied, setCopied] = useState(false);
  const [connectClickCount, setConnectClickCount] = useState(0);

  const handleWalletStatusChange = useCallback((statusInfo) => setWalletStatus(statusInfo), []);

  const copyContractAddress = () => {
    navigator.clipboard.writeText("0x55d398326f99059ff775485246999027b3197955");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-bsc-yellow/30 selection:text-bsc-yellow overflow-x-hidden relative">

      {/* ── Header ── */}
      <header className="border-b border-bsc-yellow/12 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <BSCVerifyLogo size={36} id="hdr-logo" />
            <div>
              <div className="font-display text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                BSC Safe
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-bsc-yellow border border-bsc-yellow/25 bg-bsc-yellow/5 px-1.5 py-0.5 rounded font-mono font-normal tracking-widest">
                  🔐 LEDGER AUDIT
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="live-dot"></span>
                <span className="font-mono text-[9px] text-gray-text uppercase tracking-wider">System Online · BNB Smart Chain</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative py-16 border-b border-bsc-yellow/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Main heading — Syne 800 */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-tight tracking-tight">
            Detect Real vs. Reported
            <br />
            <span className="text-bsc-yellow glow-text-yellow">
              USDT on BNB Smart Chain
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-text max-w-lg mx-auto leading-relaxed">
            Instantly verify any BEP-20 contract address against the official Tether USDT ledger.
            100% read-only · No registration · Non-custodial.
          </p>

          {/* Hero CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {walletStatus.status === "connected" ? (
              <div className="flex items-center gap-2 border border-safe-green/30 bg-safe-green/8 px-5 py-3 rounded-lg font-display text-sm font-bold text-safe-green glow-text-green">
                <span className="live-dot" style={{ background: "var(--safe-green)", boxShadow: "0 0 6px rgba(2,192,118,0.7)" }}></span>
                {walletStatus.address.slice(0, 6)}···{walletStatus.address.slice(-4)}
              </div>
            ) : (
              <button
                onClick={() => {
                  alert("Step 1: 'Verify Balance' button clicked in page.js!");
                  setConnectClickCount(p => p + 1);
                }}
                className="glow-btn-gold px-8 py-3.5 font-display text-sm font-bold rounded-lg flex items-center gap-2.5 cursor-pointer"
              >
                Verify Balance
              </button>
            )}
            <a
              href="#scanner"
              className="px-6 py-3.5 font-display text-sm font-bold rounded-lg border border-bsc-yellow/30 text-bsc-yellow hover:bg-bsc-yellow/8 transition-all flex items-center gap-2"
            >
              Scan a Contract
            </a>
          </div>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {[
              { icon: "🔍", label: "Contract Scanner" },
              { icon: "⚡", label: "Real-Time RPC" },
              { icon: "🔒", label: "Non-Custodial" },
              { icon: "🌐", label: "BSC Mainnet" },
            ].map(({ icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs text-gray-text border border-white/8 bg-white/3 px-3 py-1.5 rounded-full font-medium">
                {icon} {label}
              </span>
            ))}
          </div>

          {/* Contract address bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 bg-black/60 border border-bsc-yellow/15 rounded-lg p-3 max-w-2xl mx-auto font-mono">
            <span className="text-[9px] font-bold uppercase tracking-widest text-bsc-yellow border border-bsc-yellow/20 bg-bsc-yellow/5 px-2 py-1 rounded shrink-0">
              ✅ Official USDT
            </span>
            <div className="text-[10px] sm:text-xs text-white truncate select-all tracking-wider flex-1">
              0x55d398326f99059ff775485246999027b3197955
            </div>
            <button
              onClick={copyContractAddress}
              className="shrink-0 px-3 py-1.5 font-mono text-[10px] font-bold rounded border transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center border-bsc-yellow/25 text-bsc-yellow hover:bg-bsc-yellow/10 hover:border-bsc-yellow"
            >
              {copied ? (
                <><Check className="h-3 w-3 text-safe-green" /><span className="text-safe-green">Copied!</span></>
              ) : (
                <><Copy className="h-3 w-3" /><span>Copy</span></>
              )}
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
            {[
              { emoji: "🔍", value: "BEP-20", label: "Token Standard" },
              { emoji: "⛓️", value: "Chain 56", label: "BSC Mainnet" },
              { emoji: "🧬", value: "18 Dec", label: "USDT Decimals" },
              { emoji: "⚡", value: "< 2s", label: "Scan Speed" },
            ].map(({ emoji, value, label }) => (
              <div key={label} className="stat-pill">
                <span className="text-base leading-none">{emoji}</span>
                <span className="font-display text-sm font-bold text-white">{value}</span>
                <span className="font-mono text-[9px] text-gray-text uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Grid ── */}
      <main id="scanner" className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Wallet + Network Status */}
          <div className="lg:col-span-4 space-y-6">
            <WalletConnect onWalletStatusChange={handleWalletStatusChange} connectClickCount={connectClickCount} />

            <div className="hud-container hud-panel relative">
              <div className="hud-bracket-tl"></div>
              <div className="hud-bracket-tr"></div>
              <div className="hud-bracket-bl"></div>
              <div className="hud-bracket-br"></div>

              <div className="section-accent mb-4">
                <Activity className="h-4 w-4 text-bsc-yellow" />
                <h3 className="font-display text-sm font-bold text-white">Network Status</h3>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                {[
                  { label: "Network", value: "BNB Smart Chain", green: true },
                  { label: "Chain ID", value: "56 (0x38)", green: true },
                  { label: "RPC Latency", value: "~42ms", green: true },
                  { label: "Compiler", value: "Solidity 0.8.20", green: false },
                  { label: "Token Std.", value: "BEP-20 / ERC-20", green: false },
                  { label: "Decimals", value: "18", green: false },
                ].map(({ label, value, green }) => (
                  <div key={label} className="telemetry-row">
                    <span className="telemetry-label">{label}</span>
                    <span className={`telemetry-value text-[11px] ${green ? "text-safe-green" : "text-white"}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-2">
                <a
                  href="https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-bsc-yellow/25 hover:border-bsc-yellow/60 text-bsc-yellow hover:text-white font-display text-xs font-bold py-2.5 rounded transition-all bg-bsc-yellow/3 hover:bg-bsc-yellow/8"
                >
                  🔗 View on BscScan
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Middle: Scanner */}
          <div className="lg:col-span-4 flex justify-center">
            <TokenVerifier />
          </div>

          {/* Right: Knowledge Base */}
          <div className="lg:col-span-4">
            <EducationHub />
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="mt-16 border border-bsc-yellow/10 bg-bsc-yellow/2 rounded-lg p-8">
          <div className="section-accent mb-8">
            <Zap className="h-5 w-5 text-bsc-yellow" />
            <h2 className="font-display text-xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", emoji: "📋", title: "Paste Contract Address", desc: "Enter any BEP-20 contract address into the scanner field." },
              { step: "02", emoji: "🔍", title: "Live On-Chain Scan", desc: "We query the BNB Smart Chain RPC to fetch real contract metadata." },
              { step: "03", emoji: "✅", title: "Instant Verdict", desc: "Get an immediate OFFICIAL / CLONE / UNOFFICIAL verdict with full token details." },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="font-display text-xs font-bold text-bsc-yellow border border-bsc-yellow/20 w-7 h-7 flex items-center justify-center rounded shrink-0">
                    {step}
                  </span>
                  <div className="w-px flex-1 bg-bsc-yellow/10 mt-1"></div>
                </div>
                <div className="pb-4">
                  <div className="text-2xl mb-2">{emoji}</div>
                  <h3 className="font-display text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="font-mono text-[10px] text-gray-text leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust Cards ── */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {[
            { emoji: "🔐", title: "Zero Custody", body: "We never request private keys, seed phrases, or transaction signing. Read-only access only." },
            { emoji: "🌐", title: "Decentralised Data", body: "All contract data is fetched client-side directly from BNB Smart Chain public RPC nodes." },
            { emoji: "🛡️", title: "No Tracking", body: "No analytics scripts, no advertising cookies, no data sold. Your session is private." },
          ].map(({ emoji, title, body }) => (
            <div key={title} className="flex-1 border border-white/6 bg-white/2 rounded-lg p-5 flex gap-3">
              <span className="text-2xl shrink-0">{emoji}</span>
              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1">{title}</h4>
                <p className="font-mono text-[10px] text-gray-text leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-bsc-yellow/10 bg-black/70 py-10 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <BSCVerifyLogo size={30} id="ftr-logo" />
              <div>
                <div className="font-display text-base font-bold text-white">BSC Safe</div>
                <div className="font-mono text-[9px] text-gray-text uppercase tracking-widest mt-0.5">
                  BEP-20 Token Intelligence · BNB Smart Chain
                </div>
              </div>
            </div>

            <div className="flex gap-5 font-mono text-[10px] text-gray-text">
              <a href="https://bscscan.com" target="_blank" rel="noopener noreferrer" className="hover:text-bsc-yellow transition-colors">🔗 BscScan</a>
              <a href="https://tether.to" target="_blank" rel="noopener noreferrer" className="hover:text-bsc-yellow transition-colors">💵 Tether</a>
              <a href="https://pancakeswap.finance" target="_blank" rel="noopener noreferrer" className="hover:text-bsc-yellow transition-colors">🥞 PancakeSwap</a>
            </div>
          </div>

          <p className="text-center font-mono text-[10px] text-gray-text leading-relaxed py-5 max-w-2xl mx-auto">
            BSC Safe is a read-only educational tool operated by MS Chain Info System Pvt. Ltd. We do not request private key custody, contract authorisations, or asset transfers.
            All blockchain interactions occur client-side. Not financial advice.
          </p>

          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 font-mono text-[9px] text-gray-text border-t border-white/4 pt-5">
            <Link href="/about" className="hover:text-bsc-yellow transition-colors">🏢 About Us</Link>
            <span className="text-white/15">·</span>
            <Link href="/terms" className="hover:text-bsc-yellow transition-colors">📄 Terms of Service</Link>
            <span className="text-white/15">·</span>
            <Link href="/privacy" className="hover:text-bsc-yellow transition-colors">🔒 Privacy Policy</Link>
            <span className="text-white/15">·</span>
            <Link href="/cookie-policy" className="hover:text-bsc-yellow transition-colors">🍪 Cookie Policy</Link>
            <span className="text-white/15">·</span>
            <Link href="/disclaimer" className="hover:text-bsc-yellow transition-colors">⚠️ Risk Disclaimer</Link>
          </div>

          <p className="text-center font-mono text-[9px] text-white/15 mt-4">
            © {new Date().getFullYear()} BSC Safe — MS Chain Info System Pvt. Ltd. For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
