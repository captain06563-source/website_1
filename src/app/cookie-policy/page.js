"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
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
            <h1 className="text-xl sm:text-2xl font-mono uppercase tracking-widest text-white">Cookie Policy</h1>
            <p className="font-mono text-[9px] text-gray-text mt-2">EFFECTIVE DATE: 2026-07-06 // LAST UPDATED: 2026-07-06</p>
          </div>

          <div className="space-y-6 font-mono text-xs text-gray-300 leading-relaxed mt-6">

            <p className="text-[11px] text-gray-400 italic">
              This Cookie Policy explains how BSC Safe uses cookies and similar browser storage technologies when you visit bsc-safe.com.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files placed on your device by a website you visit. Similar technologies include localStorage and sessionStorage — browser-based storage mechanisms that allow a website to save small amounts of data on your device to improve functionality and user experience.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                2. How We Use Storage Technologies
              </h2>
              <p>BSC Safe uses a minimal, privacy-first approach to browser storage. We use only the following:</p>

              <div className="mt-4 border border-bsc-yellow/10 rounded overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-bsc-yellow/5 border-b border-bsc-yellow/10">
                      <th className="text-left p-3 text-bsc-yellow font-bold uppercase tracking-widest">Name</th>
                      <th className="text-left p-3 text-bsc-yellow font-bold uppercase tracking-widest">Type</th>
                      <th className="text-left p-3 text-bsc-yellow font-bold uppercase tracking-widest">Purpose</th>
                      <th className="text-left p-3 text-bsc-yellow font-bold uppercase tracking-widest">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bsc-yellow/5">
                    <tr>
                      <td className="p-3 text-white font-mono">bscsv_cookie_consent</td>
                      <td className="p-3 text-gray-400">localStorage</td>
                      <td className="p-3 text-gray-300">Stores your cookie consent preference so we don&apos;t ask again.</td>
                      <td className="p-3 text-gray-400">Until cleared by user</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-white font-mono">bscsv_wallet_hint</td>
                      <td className="p-3 text-gray-400">localStorage</td>
                      <td className="p-3 text-gray-300">Remembers whether you previously connected a Web3 wallet to improve reconnection experience.</td>
                      <td className="p-3 text-gray-400">Until cleared by user</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                We do NOT use:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>Third-party advertising cookies or tracking pixels.</li>
                <li>Analytics cookies (e.g. Google Analytics, Hotjar, Mixpanel).</li>
                <li>Social media tracking cookies.</li>
                <li>Cross-site tracking or fingerprinting technologies.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                3. Legal Basis (GDPR)
              </h2>
              <p>
                Under the General Data Protection Regulation (GDPR) and ePrivacy Directive, we require your consent before placing any non-essential storage items on your device. Our storage use consists of:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong className="text-white">Strictly Necessary</strong> — The consent preference storage is necessary to record your choice and avoid repeated prompts. These are placed on the basis of legitimate interests and service functionality.
                </li>
                <li>
                  <strong className="text-white">Functional (Consent Required)</strong> — The wallet hint storage is functional and non-essential. It is only stored after you give consent via our cookie banner.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                4. Third-Party Cookies
              </h2>
              <p>
                BSC Safe itself does not set any third-party cookies. However, when you interact with third-party links embedded in our platform (such as BscScan, Tether.to, PancakeSwap, or BNB Smart Chain RPC endpoints), those external services may place their own cookies or collect data according to their own privacy policies. We have no control over these and recommend reviewing their respective cookie and privacy policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                5. Managing and Disabling Storage
              </h2>
              <p>You can control and manage browser storage at any time:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong className="text-white">Browser Settings:</strong> All major browsers allow you to clear, block, or manage cookies and local storage. Visit your browser's settings or help section for instructions specific to your browser (Chrome, Firefox, Safari, Edge, etc.).
                </li>
                <li>
                  <strong className="text-white">Our Banner:</strong> You may decline non-essential storage via the cookie consent banner displayed on your first visit.
                </li>
                <li>
                  <strong className="text-white">Developer Tools:</strong> You can manually clear localStorage entries through your browser's developer tools (Application → Local Storage).
                </li>
              </ul>
              <p className="mt-2 text-gray-400">
                Note: Disabling all storage may limit certain features, such as wallet reconnection convenience. The core token verification functionality is fully accessible without any storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                6. Changes to This Cookie Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our service. Any updates will be reflected by revising the "Last Updated" date at the top of this page. Continued use of the Service after changes constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l border-bsc-yellow/40 pl-3">
                7. Contact
              </h2>
              <p>
                For questions about our use of cookies or browser storage, contact us at:{" "}
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
              <Link href="/disclaimer" className="text-bsc-yellow hover:underline">Risk Disclaimer</Link>
              <Link href="/" className="text-bsc-yellow hover:underline">Home</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
