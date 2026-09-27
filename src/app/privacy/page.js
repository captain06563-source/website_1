"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            <h1 className="text-xl sm:text-2xl font-mono uppercase tracking-widest text-white">Privacy Policy</h1>
            <p className="font-mono text-[9px] text-gray-text mt-2">EFFECTIVE DATE: 2026-07-06 // LAST UPDATED: 2026-07-06</p>
          </div>

          <div className="space-y-6 font-mono text-xs text-gray-300 leading-relaxed mt-6">

            <p className="text-[11px] text-gray-400 italic">
              Your privacy is important to us. This Privacy Policy explains what information BSC Safe collects, how it is used, and your rights regarding that information.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                1. Data Controller
              </h2>
              <p>
                BSC Safe ("we", "us", or "our") operates the website at bsc-safe.com and is the data controller for the purposes of applicable data protection legislation. For any privacy-related queries or to exercise your rights, you may contact us at{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                2. Information We Do Not Collect
              </h2>
              <p>
                BSC Safe is designed to be privacy-first. We do not collect, request, or store any Personally Identifiable Information (PII) such as:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Name, email address, phone number, or postal address.</li>
                <li>Government-issued identification numbers.</li>
                <li>Financial information such as bank account or credit card details.</li>
                <li>Wallet private keys, seed phrases, or signing credentials of any kind.</li>
              </ul>
              <p className="mt-2">No user account, registration, or login is required to use this Service.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                3. Wallet and Blockchain Data
              </h2>
              <p>
                When you voluntarily connect your Web3 wallet (e.g. MetaMask, Trust Wallet), our platform reads:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your public wallet address (e.g. 0x...).</li>
                <li>Your BEP-20 USDT token balance on the BNB Smart Chain.</li>
              </ul>
              <p className="mt-2">
                This information is retrieved directly from the BNB Smart Chain via your browser's injected Web3 provider. We do not transmit, log, or store this data on any backend server. All processing occurs client-side within your browser only.
              </p>
              <p className="mt-2">
                Your wallet address is publicly visible on the blockchain and is not considered private by nature. We do not associate it with any other identifying information.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                4. Automatically Collected Technical Data
              </h2>
              <p>
                Our web hosting infrastructure may automatically collect standard server log data, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>IP address (may be anonymised or truncated depending on hosting configuration).</li>
                <li>Browser type and version.</li>
                <li>Operating system.</li>
                <li>Pages visited and timestamps.</li>
                <li>Referral URL.</li>
              </ul>
              <p className="mt-2">
                This data is used solely for service stability, security monitoring, and operational purposes. It is not used for profiling, advertising, or resale. Logs are retained for a maximum of 30 days unless required longer by law.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                5. Third-Party RPC Nodes and Blockchain Providers
              </h2>
              <p>
                To retrieve on-chain smart contract data, our application sends requests to public BNB Smart Chain RPC endpoints (e.g. <code className="bg-black/40 px-1 py-0.5 rounded text-bsc-yellow">bsc-dataseed.binance.org</code>). These endpoints are operated by third-party blockchain infrastructure providers (including Binance). These providers may independently collect metadata such as:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your IP address.</li>
                <li>Browser user agent.</li>
                <li>The contract addresses queried.</li>
              </ul>
              <p className="mt-2">
                We do not control, and are not responsible for, data collected by these third-party node operators. We recommend reviewing their respective privacy policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                6. Cookies and Local Storage
              </h2>
              <p>
                We do not use advertising or analytics tracking cookies. We may use strictly necessary browser local storage or session storage for:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Remembering your cookie consent preference.</li>
                <li>Storing whether you have previously connected a Web3 wallet, to improve your experience on return visits.</li>
              </ul>
              <p className="mt-2">
                These are functional and essential uses only. For full details, please review our{" "}
                <Link href="/cookie-policy" className="text-bsc-yellow hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                7. How We Use Information
              </h2>
              <p>The minimal data we process is used exclusively for:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Providing and improving the core functionality of the Service.</li>
                <li>Maintaining security and preventing abuse.</li>
                <li>Complying with applicable legal obligations.</li>
              </ul>
              <p className="mt-2">We do not sell, rent, or share any data with third parties for marketing, advertising, or commercial purposes.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                8. Legal Basis for Processing (GDPR)
              </h2>
              <p>For users in the European Economic Area (EEA) and UK, our legal bases for processing any data are:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-white">Consent</strong> — for cookie preferences (where applicable).</li>
                <li><strong className="text-white">Legitimate Interests</strong> — for basic server log data used for security and service stability.</li>
                <li><strong className="text-white">Legal Obligation</strong> — where required by applicable law.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                9. Your Rights (GDPR / UK GDPR)
              </h2>
              <p>If you are located in the EEA or UK, you have the following rights under GDPR:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-white">Right of Access</strong> — You may request a copy of any personal data we hold about you.</li>
                <li><strong className="text-white">Right to Rectification</strong> — You may request correction of inaccurate personal data.</li>
                <li><strong className="text-white">Right to Erasure</strong> — You may request deletion of personal data we hold.</li>
                <li><strong className="text-white">Right to Restriction</strong> — You may request we restrict processing of your data.</li>
                <li><strong className="text-white">Right to Data Portability</strong> — You may request your data in a machine-readable format.</li>
                <li><strong className="text-white">Right to Object</strong> — You may object to processing based on legitimate interests.</li>
                <li><strong className="text-white">Right to Withdraw Consent</strong> — Where processing is based on consent, you may withdraw it at any time.</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection supervisory authority.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                10. California Privacy Rights (CCPA)
              </h2>
              <p>
                If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Know what personal information is collected about you.</li>
                <li>Know whether your personal information is sold or disclosed and to whom.</li>
                <li>Opt out of the sale of your personal information.</li>
                <li>Access your personal information.</li>
                <li>Equal service and price, even if you exercise your privacy rights.</li>
              </ul>
              <p className="mt-2">
                We do not sell personal information. We do not share personal information with third parties for cross-context behavioral advertising. To exercise your CCPA rights, contact us at{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                11. Data Retention
              </h2>
              <p>
                We retain server log data for a maximum of 30 days for security and operational purposes, after which it is deleted. Since we do not collect personal data beyond server logs, there is no other personal data retention to declare. Browser local storage data is under your control and can be cleared at any time through your browser settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                12. International Data Transfers
              </h2>
              <p>
                This Service is accessible globally. If you access our platform from outside the country where our infrastructure is hosted, your data may be transferred across international borders. By using the Service, you consent to this transfer. We take reasonable steps to ensure any such transfers comply with applicable data protection laws.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                13. Children's Privacy
              </h2>
              <p>
                This Service is not directed at or intended for use by children under the age of 18 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal data from minors. If you believe a child has provided personal information to us, please contact us immediately at{" "}
                <a href="mailto:hemant000111222@gmail.com" className="text-bsc-yellow hover:underline">
                  hemant000111222@gmail.com
                </a>{" "}
                and we will take steps to delete it.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                14. Links to External Sites
              </h2>
              <p>
                Our platform contains links to external services such as BscScan, Tether.to, and PancakeSwap. We are not responsible for the content, privacy practices, or data handling of any third-party websites. We encourage you to review their individual privacy policies before interacting with them.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                15. Security
              </h2>
              <p>
                We take reasonable technical and organisational measures to protect the integrity of our platform and the minimal data processed through it. However, no method of internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security and encourage you to take appropriate precautions when browsing online.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                16. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. Continued use of the Service after changes constitutes your acceptance of the updated policy. We recommend reviewing this page periodically.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                17. Contact Us
              </h2>
              <p>
                For any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact us at:
              </p>
              <p className="mt-2">
                Email:{" "}
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
