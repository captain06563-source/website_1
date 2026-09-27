"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ShieldCheck, ShieldAlert, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

const OFFICIAL_USDT = "0x55d398326f99059ff775485246999027b3197955";
const BSC_RPC_URL = "https://bsc-dataseed1.binance.org/";

const COMPLETE_ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

export default function TokenVerifier() {
  const [searchAddress, setSearchAddress] = useState(OFFICIAL_USDT);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    handleVerify(OFFICIAL_USDT);
  }, []);

  const handleVerify = async (addressToVerify) => {
    const targetAddress = (addressToVerify || searchAddress).trim();

    if (!ethers.isAddress(targetAddress)) {
      setStatus("invalid");
      setTokenDetails(null);
      setErrorMsg("Invalid address format. Must be a valid 0x… Ethereum/BSC address.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");
    setStatus("idle");

    try {
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
      const code = await provider.getCode(targetAddress);
      if (code === "0x") {
        setStatus("invalid");
        setTokenDetails(null);
        setErrorMsg("This address is a wallet (EOA), not a smart contract.");
        setIsVerifying(false);
        return;
      }

      const contract = new ethers.Contract(targetAddress, COMPLETE_ERC20_ABI, provider);
      let name, symbol, decimals, totalSupply;
      try {
        [name, symbol, decimals, totalSupply] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply()
        ]);
      } catch {
        setStatus("invalid");
        setTokenDetails(null);
        setErrorMsg("Contract does not implement the BEP-20 / ERC-20 standard.");
        setIsVerifying(false);
        return;
      }

      const formattedSupply = ethers.formatUnits(totalSupply, decimals);
      const isOfficialAddress = targetAddress.toLowerCase() === OFFICIAL_USDT.toLowerCase();

      setTokenDetails({
        address: targetAddress,
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: parseFloat(formattedSupply).toLocaleString(undefined, { maximumFractionDigits: 2 })
      });

      if (isOfficialAddress) setStatus("official");
      else if (symbol.toUpperCase() === "USDT" || name.toLowerCase().includes("tether")) setStatus("Reported");
      else setStatus("unofficial");

    } catch {
      setStatus("error");
      setErrorMsg("RPC connection failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const radarBorderColor = {
    official:   "border-safe-green/30",
    Reported:       "border-danger-red/30",
    unofficial: "border-amber-500/30",
  }[status] || "border-bsc-yellow/20";

  return (
    <div className="flex flex-col items-center w-full">

      {/* Radar orb */}
      <div className="relative flex items-center justify-center mb-8">
        <div className={`radar-scanner ${radarBorderColor}`}>
          <div className={`radar-sweep ${
            status === "official" ? "radar-sweep-official" :
            status === "Reported"     ? "radar-sweep-Reported"     : ""
          }`}></div>
          <div className="radar-crosshair-h"></div>
          <div className="radar-crosshair-v"></div>

          {/* Inner rings */}
          <div className="absolute inset-[30%] rounded-full border border-bsc-yellow/8"></div>
          <div className="absolute inset-[15%] rounded-full border border-bsc-yellow/5"></div>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-10">
            <span className="font-mono text-[8px] text-gray-text tracking-widest uppercase mb-2">
              {isVerifying ? "⟳ Scanning…" : "Contract Scanner"}
            </span>

            <div className="relative w-52 mb-3">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter contract address (0x…)"
                className="w-full bg-black/60 border border-bsc-yellow/20 focus:border-bsc-yellow/60 text-white placeholder-white/20 text-center font-mono text-[10px] focus:outline-none py-2 px-2 rounded transition-all"
              />
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={isVerifying}
              className="font-mono text-[10px] font-bold text-bsc-yellow hover:text-black border border-bsc-yellow/40 hover:border-bsc-yellow hover:bg-bsc-yellow bg-black/60 px-4 py-1.5 rounded transition-all select-none flex items-center gap-1.5 disabled:opacity-50"
            >
              {isVerifying ? (
                <><RefreshCw className="h-3 w-3 animate-spin" /> Scanning…</>
              ) : (
                <>Run Scan</>
              )}
            </button>

            <p className="mt-2 font-mono text-[8px] text-gray-text/50">
              Queries BNB Smart Chain mainnet
            </p>
          </div>
        </div>
      </div>

      {/* Result card */}
      {status !== "idle" && (
        <div className="hud-container hud-panel relative w-full">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>

          <h3 className="font-display text-sm font-bold text-white border-b border-bsc-yellow/10 pb-2 mb-4 flex items-center gap-2">
            📋 Scan Report
          </h3>

          <div className="space-y-4">

            {/* OFFICIAL */}
            {status === "official" && (
              <div className="border border-safe-green/25 bg-safe-green/5 p-4 rounded flex gap-3">
                <ShieldCheck className="h-5 w-5 text-safe-green shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display text-sm font-bold text-safe-green glow-text-green">
                      ✅ Official USDT — Verified
                    </h4>
                    <Sparkles className="h-3 w-3 text-bsc-yellow fill-bsc-yellow/30" />
                  </div>
                  <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
                    This contract matches the official Tether USD (USDT) ledger on BNB Smart Chain.
                    Standard BEP-20 parameters confirmed.
                  </p>
                  <a
                    href={`https://bscscan.com/token/${OFFICIAL_USDT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 font-mono text-[9px] text-safe-green hover:underline"
                  >
                    🔗 Verify on BscScan →
                  </a>
                </div>
              </div>
            )}

            {/* Reported */}
            {status === "Reported" && (
              <div className="border border-danger-red/30 bg-danger-red/5 p-4 rounded flex gap-3 animate-pulse">
                <ShieldAlert className="h-5 w-5 text-danger-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-danger-red glow-text-red mb-1">
                    🚨 Malicious Clone Detected
                  </h4>
                  <p className="font-mono text-[10px] text-gray-200 leading-relaxed">
                    This token mimics Tether USDT but uses a <strong className="text-white">different contract address</strong>.
                    This is a strong indicator of a "Flash USDT" or honeypot scam.
                    It has zero real liquidity and cannot be transferred to any exchange.
                  </p>
                  <p className="mt-2 font-mono text-[9px] text-danger-red font-bold">
                    ⛔ Do NOT accept this token as payment.
                  </p>
                </div>
              </div>
            )}

            {/* UNOFFICIAL */}
            {status === "unofficial" && (
              <div className="border border-amber-500/25 bg-amber-500/5 p-4 rounded flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-amber-500 glow-text-yellow mb-1">
                    ⚠️ Unofficial Token
                  </h4>
                  <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
                    This is a valid BEP-20 contract but it does NOT match the official USDT address.
                    Verify DEX routing parameters before any transaction.
                  </p>
                </div>
              </div>
            )}

            {/* INVALID */}
            {status === "invalid" && (
              <div className="border border-danger-red/20 bg-danger-red/5 p-4 rounded flex gap-3">
                <AlertCircle className="h-5 w-5 text-danger-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs font-bold text-danger-red uppercase tracking-wider mb-1">
                    ❌ Scan Failed
                  </h4>
                  <p className="font-mono text-[10px] text-gray-300">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {status === "error" && (
              <div className="border border-danger-red/20 bg-danger-red/5 p-4 rounded flex gap-3">
                <AlertCircle className="h-5 w-5 text-danger-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs font-bold text-danger-red uppercase tracking-wider mb-1">
                    🌐 Connection Error
                  </h4>
                  <p className="font-mono text-[10px] text-gray-300">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Token metadata */}
            {tokenDetails && (
              <div className="mt-2 space-y-0.5">
                <div className="telemetry-row flex-col items-start gap-0.5">
                  <span className="telemetry-label">Contract Address</span>
                  <span className="font-mono text-[9px] text-bsc-yellow select-all break-all">{tokenDetails.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  {[
                    { label: "Token Name", value: tokenDetails.name },
                    { label: "Symbol",     value: tokenDetails.symbol },
                    { label: "Decimals",   value: tokenDetails.decimals },
                    { label: "Total Supply", value: tokenDetails.totalSupply },
                  ].map(({ label, value }) => (
                    <div key={label} className="telemetry-row flex-col items-start border-none py-2">
                      <span className="telemetry-label">{label}</span>
                      <span className="font-mono text-[11px] text-white font-bold mt-0.5">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
