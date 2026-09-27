"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            <h1 className="text-xl sm:text-2xl font-mono uppercase tracking-widest text-white">Terms of Service</h1>
            <p className="font-mono text-[9px] text-gray-text mt-2">EFFECTIVE DATE: 2026-07-06 // LAST UPDATED: 2026-07-06</p>
          </div>

          <div className="space-y-6 font-mono text-xs text-gray-300 leading-relaxed mt-6">

            <p className="text-[11px] text-gray-400 italic">
              Please read these Terms of Service carefully before using BSC Safe. By accessing or using our service, you agree to be legally bound by these terms.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using BSC Safe ("Service", "Platform", "we", "us", or "our") available at bsc-safe.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years of age (or the legal age of majority in your jurisdiction, whichever is greater) to use this Service. By using BSC Safe, you represent and warrant that you meet this requirement. We do not knowingly provide services to minors. If you are under the required age, you must discontinue use immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                3. Description of Service
              </h2>
              <p>
                BSC Safe is a free, educational, read-only blockchain data dashboard designed to help users verify BEP-20 token contract addresses on the BNB Smart Chain (BSC) mainnet, specifically checking against the official Tether USD (USDT) contract. The Service:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Queries publicly available on-chain data from BNB Smart Chain RPC nodes.</li>
                <li>Displays smart contract metadata (token name, symbol, decimals, total supply).</li>
                <li>Allows optional connection of a Web3 wallet to read your USDT balance.</li>
                <li>Does NOT execute, route, or facilitate token transfers, swaps, or financial transactions of any kind.</li>
                <li>Does NOT provide investment, financial, legal, or tax advice.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                4. No Financial or Legal Advice
              </h2>
              <p>
                All verification results, contract audits, metadata lookups, security alerts, and educational content provided on this platform are for informational and educational purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice. You should always conduct your own independent research (DYOR) and consult qualified professionals before making any financial decisions or participating in cryptocurrency transactions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                5. Wallet Connection and Security
              </h2>
              <p>
                To use the wallet balance-checking feature, you may connect a Web3-compatible browser wallet (e.g., MetaMask, Trust Wallet). By connecting your wallet, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>We ONLY request read access to your public wallet address and token balance.</li>
                <li>We NEVER request, store, or have access to your private keys, seed phrases, or wallet credentials.</li>
                <li>We NEVER request transaction signing, token approvals, or contract write permissions.</li>
                <li>You are solely responsible for the security of your wallet and for reviewing any permissions requested by third-party tools.</li>
                <li>You should disconnect your wallet from any application you do not fully trust.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                6. Prohibited Uses
              </h2>
              <p>You agree NOT to use this Service to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Engage in any unlawful activity or violate any applicable local, national, or international laws or regulations.</li>
                <li>Attempt to reverse-engineer, decompile, or extract proprietary code or trade secrets from the platform.</li>
                <li>Transmit any malicious code, viruses, or harmful data.</li>
                <li>Use automated scripts, bots, or crawlers to overload or disrupt service operations.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
                <li>Attempt to gain unauthorized access to any portion of the Service or its related systems.</li>
                <li>Use the Service to facilitate or promote scams, fraud, or criminal activity.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                7. Intellectual Property
              </h2>
              <p>
                The BSC Safe name, logo, visual design, UI layout, and all original content displayed on this platform are the intellectual property of BSC Safe and are protected under applicable copyright and intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Service for personal, non-commercial purposes only. You may not copy, reproduce, distribute, modify, or create derivative works of any portion of the platform without prior written consent.
              </p>
              <p className="mt-2">
                Third-party trademarks, logos, and brand names displayed on this platform (including "Tether", "USDT", "BscScan", "Binance Smart Chain", and "PancakeSwap") remain the property of their respective owners. Their display does not imply any endorsement, affiliation, or partnership with BSC Safe.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                8. Third-Party Links and Services
              </h2>
              <p>
                This platform contains links to third-party websites and services such as BscScan, Tether.to, and PancakeSwap. These links are provided for convenience and informational purposes only. We have no control over, and assume no responsibility for, the content, privacy policies, availability, or practices of any third-party services. We encourage you to review the terms and privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                9. Disclaimer of Warranties
              </h2>
              <p className="border border-danger-red/20 bg-danger-red/5 p-4 text-gray-200">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE RESULTS OBTAINED FROM THE SERVICE WILL BE ACCURATE OR RELIABLE; OR (C) ANY ERRORS IN THE SERVICE WILL BE CORRECTED.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                10. Limitation of Liability
              </h2>
              <p className="border border-danger-red/20 bg-danger-red/5 p-4 text-gray-200">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, BSC SAFE, ITS DEVELOPERS, OPERATORS, CONTRIBUTORS, AND PARTNERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO: LOSS OF DIGITAL ASSETS, CRYPTOCURRENCY LOSSES, GAS FEE LOSSES, LOST PROFITS, LOSS OF DATA, EXPLOITATION BY THIRD PARTIES, SMART CONTRACT EXPLOITS, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                11. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless BSC Safe and its developers, operators, contributors, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with: (a) your access to or use of the Service; (b) your violation of these Terms of Service; (c) your violation of any applicable law or the rights of any third party; or (d) any content submitted or transmitted through the Service by you.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                12. Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with applicable law. Any disputes arising out of or relating to these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes may be submitted to binding arbitration or the courts of competent jurisdiction. You waive any right to a jury trial in connection with any action or litigation arising from these Terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                13. Availability and Termination
              </h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice and without liability to you. We may also restrict access to all or parts of the Service at our sole discretion. We reserve the right to terminate your access to the Service immediately, without prior notice, if we believe you have violated any provision of these Terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                14. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. When we make material changes, we will update the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                15. Severability and Entire Agreement
              </h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid under applicable law, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force and effect. These Terms of Service, together with the Privacy Policy, Cookie Policy, and Risk Disclaimer, constitute the entire agreement between you and BSC Safe regarding your use of the Service and supersede all prior agreements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                16. Contact
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>
              </p>
            </section>

          </div>

          <div className="border-t border-bsc-yellow/15 pt-6 mt-8 flex flex-wrap justify-between items-center gap-4 font-mono text-[10px] text-gray-text">
            <span>&copy; 2026 BSC Safe.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-bsc-yellow hover:underline">Privacy Policy</Link>
              <Link href="/cookie-policy" className="text-bsc-yellow hover:underline">Cookie Policy</Link>
              <Link href="/disclaimer" className="text-bsc-yellow hover:underline">Risk Disclaimer</Link>
              <Link href="/" className="text-bsc-yellow hover:underline">Home</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
