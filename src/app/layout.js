import { Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

// BNB Smart Chain primary UI font (confirmed from bnbchain.org CSS)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Bold display font for headings — geometric, heavy, used widely in DeFi/Web3
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

// Developer monospace — standard across BSC explorer, docs, and tooling
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "BSC Safe — Detect Real vs Reported USDT on BNB Smart Chain",
  description: "Free BEP-20 token intelligence tool. Verify contract addresses, detect Flash USDT scams, and check your official USDT balance on BNB Smart Chain.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
