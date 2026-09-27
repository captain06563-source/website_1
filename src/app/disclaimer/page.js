"use client";

import Link from "next/link";
import { Shield, ArrowLeft, ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-bsc-yellow/30 selection:text-bsc-yellow relative">
      <header className="border-b border-bsc-yellow/15 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-bsc-yellow transition-colors font-mono text-[10px] uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to HUD</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 border border-bsc-yellow/30 rounded">
              <Shield className="h-4 w-4 text-bsc-yellow" />
            </div>
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

          <div className="border-b border-bsc-yellow/15 pb-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-bsc-yellow animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-mono uppercase tracking-widest text-white">Risk Disclaimer</h1>
            </div>
            <p className="font-mono text-[9px] text-gray-text mt-2">EFFECTIVE DATE: 2026-07-06 // LAST UPDATED: 2026-07-06</p>
          </div>

          <div className="space-y-6 font-mono text-xs text-gray-300 leading-relaxed mt-6">

            <div className="border border-danger-red/20 bg-danger-red/5 p-4 text-danger-red text-xs">
              CRITICAL NOTICE: Cryptocurrencies, decentralised finance (DeFi), smart contracts, and Web3 interactions carry substantial financial risk — including total loss of funds. Always perform your own research (DYOR) and verify all information independently before initiating any blockchain transaction. This platform provides educational information only and does not constitute financial, investment, or legal advice.
            </div>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                1. Educational Purpose Only
              </h2>
              <p>
                BSC Safe is an educational, informational resource. All content on this platform — including contract verification results, security alerts, scan diagnostics, token metadata, and educational guides — is provided solely for general informational purposes. Nothing on this platform constitutes financial, investment, trading, legal, or tax advice. We are not a regulated financial institution, investment adviser, broker, or exchange.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                2. Information Accuracy and RPC Reliability
              </h2>
              <p>
                BSC Safe queries public blockchain data via decentralised third-party RPC nodes. While we aim to display accurate and current smart contract parameters (such as token name, symbol, decimals, and total supply), we cannot guarantee that:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>RPC node data is complete, uninterrupted, or free from errors at the moment of your query.</li>
                <li>Displayed information reflects real-time blockchain state under all network conditions.</li>
                <li>Results are always current — blockchain states can change between the time of query and display.</li>
              </ul>
              <p className="mt-2">Always cross-reference results directly on official blockchain explorers such as BscScan before making any decisions.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                3. Audit Limitations
              </h2>
              <p>
                Our contract verifier checks basic BEP-20 metadata against the official Tether (USDT) contract address (<code className="bg-black/40 px-1 rounded text-white select-all">0x55d398326f99059ff775485246999027b3197955</code>). A successful verification result indicating "OFFICIAL_TETHER_USD" does NOT constitute:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>A full smart contract security audit or code review.</li>
                <li>A guarantee of the contract's safety, correctness, or absence of exploits.</li>
                <li>An endorsement, recommendation, or promotion of any token or financial product.</li>
              </ul>
              <p className="mt-2">
                Sophisticated threat actors constantly deploy malicious contracts that may circumvent basic metadata checks. A "passed" scan is not a guarantee of legitimacy or safety.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                4. Cryptocurrency and DeFi Risk
              </h2>
              <p>Cryptocurrency markets and DeFi protocols are subject to, but not limited to, the following risks:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-white">Market Volatility:</strong> Cryptocurrency values can fluctuate dramatically and may become worthless.</li>
                <li><strong className="text-white">Smart Contract Risk:</strong> All smart contracts may contain bugs, vulnerabilities, or backdoors that could lead to total loss of funds.</li>
                <li><strong className="text-white">Scams and Fraud:</strong> Including but not limited to: Flash USDT scams, honeypot contracts, rug pulls, phishing attacks, and approval-based theft.</li>
                <li><strong className="text-white">Regulatory Risk:</strong> Laws and regulations governing cryptocurrency may change in your jurisdiction, potentially affecting the legality or usability of digital assets.</li>
                <li><strong className="text-white">Counterparty Risk:</strong> In peer-to-peer or OTC transactions, the counterparty may act in bad faith.</li>
                <li><strong className="text-white">Technical Risk:</strong> Network outages, wallet software bugs, or user error may result in permanent, irreversible loss of assets.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                5. Scam and Exploit Awareness
              </h2>
              <p>
                Decentralised finance is targeted by sophisticated fraud vectors including, but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>"Flash USDT" or "Flash BTC" clone tokens with fabricated balances that cannot be transferred or liquidated.</li>
                <li>Honeypot contracts that allow buy but block sell functions.</li>
                <li>Balance-freezing mechanisms that lock funds post-receipt.</li>
                <li>Signature phishing requests that drain wallets via malicious approvals.</li>
                <li>Contract address spoofing using visually similar hexadecimal characters.</li>
              </ul>
              <p className="mt-2">
                BSC Safe serves exclusively as a defensive educational resource. We do not provide protection, insurance, recourse, or compensation against scam deployments, asset theft, or failed transactions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                6. No Warranty
              </h2>
              <p>
                This Service and all its content are provided "as is" without warranty of any kind, express or implied. We make no representations or warranties that the Service will be error-free, uninterrupted, secure, or that results will be accurate or complete.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                7. Absolute Exclusion of Liability
              </h2>
              <p className="border border-danger-red/20 bg-danger-red/5 p-4 text-gray-200">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BSC SAFE, ITS DEVELOPERS, CREATORS, CONTRIBUTORS, OPERATORS, OR PARTNERS BE LIABLE FOR ANY CLAIMS, FINANCIAL DAMAGES, CRYPTOCURRENCY OR DIGITAL ASSET LOSSES, GAS FEE LOSSES, LOST PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO: (A) YOUR USE OF OR INABILITY TO USE THIS SERVICE; (B) ANY SMART CONTRACT INTERACTION; (C) ANY FRAUD, SCAM, OR THIRD-PARTY MISCONDUCT; OR (D) ANY OTHER MATTERS RELATED TO THIS PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                8. No Affiliation
              </h2>
              <p>
                BSC Safe is an independent educational platform. We are not affiliated with, endorsed by, or partnered with Tether Limited, Binance, Binance Smart Chain, BscScan, PancakeSwap, or any other blockchain protocol or company referenced on this platform. All third-party trademarks, contract addresses, and brand names are referenced for educational and identification purposes only.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                9. Your Responsibility
              </h2>
              <p>
                By using BSC Safe, you accept full personal responsibility for any actions you take based on information presented on this platform. You acknowledge that you are solely responsible for evaluating the merits and risks of any cryptocurrency transaction and that you have the financial resources, knowledge, and experience required to independently assess such risks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                10. Contact
              </h2>
              <p>
                If you have questions about this disclaimer, contact us at:{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>
              </p>
            </section>

          </div>

          <div className="border-t border-bsc-yellow/15 pt-6 mt-8 flex flex-wrap justify-between items-center gap-4 font-mono text-[10px] text-gray-text">
            <span>&copy; 2026 BSC Safe.</span>
            <div className="flex gap-4">
              <Link href="/terms" className="text-bsc-yellow hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="text-bsc-yellow hover:underline">Privacy Policy</Link>
              <Link href="/cookie-policy" className="text-bsc-yellow hover:underline">Cookie Policy</Link>
              <Link href="/" className="text-bsc-yellow hover:underline">Home</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
