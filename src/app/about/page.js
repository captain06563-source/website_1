"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import BSCVerifyLogo from "@/components/BSCVerifyLogo";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-bsc-yellow/30 selection:text-bsc-yellow relative">

      {/* Header */}
      <header className="border-b border-bsc-yellow/15 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-bsc-yellow transition-colors font-mono text-[10px] uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to HUD</span>
          </Link>
          <div className="flex items-center gap-2">
            <BSCVerifyLogo size={24} id="about-hdr"/>
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-white">BSC Safe</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="hud-container hud-panel border-l border-bsc-yellow/20 relative p-8 sm:p-12">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>

          {/* Page title */}
          <div className="border-b border-bsc-yellow/15 pb-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <BSCVerifyLogo size={48} id="about-hero"/>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">BSC Safe</h1>
                <p className="font-mono text-[10px] text-bsc-yellow uppercase tracking-widest mt-1">
                  A product of MS Chain Info System Pvt. Ltd.
                </p>
              </div>
            </div>
            <p className="font-mono text-xs text-gray-text leading-relaxed max-w-2xl">
              BSC Safe is a free, read-only blockchain intelligence tool designed to help users verify BEP-20 token
              contract addresses on BNB Smart Chain and detect fraudulent "Flash USDT" tokens before funds are at risk.
            </p>
          </div>

          <div className="space-y-10 font-mono text-xs text-gray-300 leading-relaxed">

            {/* Corporate identity */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                Corporate Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["Product name",     "BSC Safe"],
                  ["Parent company",   "MS Chain Info System Pvt. Ltd."],
                  ["Director",         "Mr. Adam Farnatises"],
                  ["Registered entity","Private Limited Company"],
                  ["Domain",           "bsc-safe.com"],
                  ["Contact",          "contact@bsc-safe.com"],
                  ["Security reports", "security.bsc-safe.com"],
                  ["Industry",         "Blockchain Analytics · Web3 Security"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5 border border-bsc-yellow/8 bg-bsc-yellow/2 rounded px-4 py-3">
                    <span className="text-[9px] text-gray-text uppercase tracking-widest">{label}</span>
                    <span className="text-white font-bold text-[11px]">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mission */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                Our Mission
              </h2>
              <p>
                The proliferation of fraudulent "Flash USDT" and clone BEP-20 tokens on BNB Smart Chain has caused
                significant financial harm to individuals and businesses worldwide. BSC Safe was created under the
                umbrella of MS Chain Info System Pvt. Ltd. with a single focused mission:
              </p>
              <div className="border border-bsc-yellow/20 bg-bsc-yellow/3 rounded px-5 py-4 text-bsc-yellow text-[11px] font-bold leading-relaxed">
                Provide every participant in the BNB Smart Chain ecosystem — trader, merchant, or developer — with
                a fast, free, and technically rigorous tool to confirm whether a USDT token is the genuine
                Tether contract before any transaction is initiated.
              </div>
              <p className="text-gray-400">
                We are not a financial service. We do not hold assets, route funds, or provide investment guidance.
                BSC Safe is a defensive intelligence layer — purely informational, always read-only.
              </p>
            </section>

            {/* What we do */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                What BSC Safe Does
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: "🔍",
                    title: "Contract Address Verification",
                    body: "Cross-references any BEP-20 contract address against the canonical Tether USDT deployment (0x55d398…) on BSC mainnet.",
                  },
                  {
                    icon: "⚡",
                    title: "Live On-Chain Balance Query",
                    body: "Executes a read-only eth_call to retrieve the real USDT balance held by a connected wallet at the current block height.",
                  },
                  {
                    icon: "🛡️",
                    title: "Static Security Analysis",
                    body: "Checks for flash loan interfaces, elastic supply mechanisms, fee-on-transfer hooks, sell restrictions, and proxy upgrade patterns.",
                  },
                  {
                    icon: "📋",
                    title: "Audit Report Generation",
                    body: "Produces a verifiable JPEG audit report including block number, cryptographic hash, methodology, findings, and issuer details.",
                  },
                  {
                    icon: "🔐",
                    title: "Permit2 Probe",
                    body: "Verifies that the Permit2 allowance slot is available on the canonical contract, confirming DEX router compatibility.",
                  },
                  {
                    icon: "🌐",
                    title: "Non-Custodial by Design",
                    body: "No private keys. No seed phrases. No transaction signing. All operations are read-only queries against public RPC nodes.",
                  },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="border border-white/6 bg-white/2 rounded-lg p-4 flex gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-bold mb-1 text-[11px]">{title}</p>
                      <p className="text-gray-text text-[10px] leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About the parent company */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                About MS Chain Info System Pvt. Ltd.
              </h2>
              <p>
                MS Chain Info System Pvt. Ltd. is a technology company specialising in blockchain data intelligence,
                on-chain analytics, and Web3 security tooling. The company was founded with the conviction that
                public blockchain infrastructure should be transparent and accessible — and that users should
                never need to rely on centralised intermediaries to verify the authenticity of an asset.
              </p>
              <p>
                Under the leadership of Director <strong className="text-white">Mr. Adam Farnatises</strong>,
                MS Chain Info System Pvt. Ltd. continues to develop products that empower users across the
                decentralised finance landscape. BSC Safe is the flagship consumer-facing product of the company,
                targeting the specific problem of fraudulent stable-coin impersonation on BNB Smart Chain.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  { label: "Focus areas",     value: "DeFi Security · BEP-20 Analytics · Smart Contract Verification" },
                  { label: "Primary network", value: "BNB Smart Chain · Chain ID 56" },
                  { label: "Model",           value: "Free-to-use · No registration · Non-custodial" },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-bsc-yellow/10 bg-bsc-yellow/3 rounded px-4 py-3">
                    <p className="text-[9px] text-gray-text uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-white text-[10px] leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Leadership */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                Leadership
              </h2>
              <div className="border border-bsc-yellow/15 bg-bsc-yellow/3 rounded-lg p-5 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-lg bg-bsc-yellow/10 border border-bsc-yellow/20 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-bsc-yellow" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Mr. Adam Farnatises</p>
                  <p className="text-bsc-yellow text-[10px] uppercase tracking-widest mt-0.5 mb-2">Director — MS Chain Info System Pvt. Ltd.</p>
                  <p className="text-gray-text text-[10px] leading-relaxed max-w-xl">
                    Mr. Adam Farnatises oversees the strategic direction and product development at MS Chain Info System Pvt. Ltd.
                    With a focus on blockchain transparency and financial safety, he leads the engineering and compliance teams
                    responsible for delivering BSC Safe and future security intelligence products across multiple blockchain networks.
                  </p>
                </div>
              </div>
            </section>

            {/* Technical commitments */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                Our Technical Commitments
              </h2>
              {[
                ["Read-only, always",          "BSC Safe never requests transaction signing, token approvals, or any write-access to your wallet. All queries are read-only via public JSON-RPC."],
                ["No data collection",         "We do not collect, store, or sell user data. Wallet addresses are queried client-side and never transmitted to our servers for storage."],
                ["Automated analysis",         "All security checks are performed by deterministic automated logic. No human auditor reviews individual reports. Results are reproducible given the same inputs."],
                ["Transparency",               "The methodology behind every check — ABI selectors, slot addresses, RPC calls — is disclosed in each audit report so results can be independently verified."],
                ["Open standards",             "We adhere to EIP-1967, ERC-3156, BEP-20, and Permit2 (EIP-2612) standards. All addresses and selectors used are public on-chain references."],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="text-bsc-yellow mt-0.5 shrink-0">›</span>
                  <div>
                    <span className="text-white font-bold">{title}: </span>
                    <span className="text-gray-text">{body}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* Contact */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-bsc-yellow pl-3">
                Contact Us
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-white/6 bg-white/2 rounded px-4 py-3">
                  <p className="text-[9px] text-gray-text uppercase tracking-widest mb-1">General enquiries</p>
                  <a href="mailto:contact@bsc-safe.com" className="text-bsc-yellow hover:underline text-[11px]">contact@bsc-safe.com</a>
                </div>
                <div className="border border-white/6 bg-white/2 rounded px-4 py-3">
                  <p className="text-[9px] text-gray-text uppercase tracking-widest mb-1">Security / reports</p>
                  <a href="mailto:security@bsc-safe.com" className="text-bsc-yellow hover:underline text-[11px]">security@bsc-safe.com</a>
                </div>
                <div className="border border-white/6 bg-white/2 rounded px-4 py-3">
                  <p className="text-[9px] text-gray-text uppercase tracking-widest mb-1">Privacy requests</p>
                  <a href="mailto:privacy@bsc-safe.com" className="text-bsc-yellow hover:underline text-[11px]">privacy@bsc-safe.com</a>
                </div>
                <div className="border border-white/6 bg-white/2 rounded px-4 py-3">
                  <p className="text-[9px] text-gray-text uppercase tracking-widest mb-1">Website</p>
                  <span className="text-white text-[11px]">bsc-safe.com</span>
                </div>
              </div>
            </section>

          </div>

          {/* Footer nav */}
          <div className="border-t border-bsc-yellow/15 pt-6 mt-10 flex flex-wrap justify-between items-center gap-4 font-mono text-[10px] text-gray-text">
            <span>&copy; {new Date().getFullYear()} BSC Safe — MS Chain Info System Pvt. Ltd.</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms"         className="text-bsc-yellow hover:underline">Terms of Service</Link>
              <Link href="/privacy"       className="text-bsc-yellow hover:underline">Privacy Policy</Link>
              <Link href="/cookie-policy" className="text-bsc-yellow hover:underline">Cookie Policy</Link>
              <Link href="/disclaimer"    className="text-bsc-yellow hover:underline">Risk Disclaimer</Link>
              <Link href="/"              className="text-bsc-yellow hover:underline">Home</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
