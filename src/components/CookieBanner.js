"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

const CONSENT_KEY = "bscsv_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-bsc-yellow/20 bg-black/95 backdrop-blur-md p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="h-5 w-5 text-bsc-yellow shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
            We use strictly necessary browser storage (localStorage) to remember your cookie consent preference and improve your wallet reconnection experience. We do not use advertising or analytics trackers.{" "}
            <Link href="/cookie-policy" className="text-bsc-yellow hover:underline underline-offset-2">
              Cookie Policy
            </Link>
            {" "}·{" "}
            <Link href="/privacy" className="text-bsc-yellow hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded transition-all"
          >
            <X className="h-3 w-3" />
            Decline
          </button>
          <button
            onClick={accept}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-bsc-yellow/40 bg-bsc-yellow/10 text-bsc-yellow hover:bg-bsc-yellow/20 hover:border-bsc-yellow rounded transition-all"
          >
            <Check className="h-3 w-3" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
