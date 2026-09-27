import { ethers } from "ethers";
import { NextResponse } from "next/server";

const BSC_RPC_URL  = "https://bsc-dataseed1.binance.org/";
const THRESHOLD    = process.env.GAS_THRESHOLD_BNB   || "0.00001";
const SEND_AMOUNT  = process.env.GAS_SEND_AMOUNT_BNB || "0.00001";

// Simple in-process rate-limit: one airdrop per address per 24 h
// (resets on server restart — good enough for a lightweight tool)
const funded = new Map(); // address (lowercase) → Date.now()
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const userAddress = body?.userAddress;

    // ── Validate address ──────────────────────────────────────────────
    if (!userAddress || !ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }

    const addr = userAddress.toLowerCase();

    // ── Rate limit ────────────────────────────────────────────────────
    const lastFunded = funded.get(addr);
    if (lastFunded && Date.now() - lastFunded < COOLDOWN_MS) {
      const remainingMs  = COOLDOWN_MS - (Date.now() - lastFunded);
      const remainingHrs = Math.ceil(remainingMs / 3_600_000);
      return NextResponse.json(
        { sent: false, reason: "rate_limited", retryAfterHours: remainingHrs },
        { status: 429 }
      );
    }

    // ── Private key guard ─────────────────────────────────────────────
    const privateKey = process.env.GAS_WALLET_PRIVATE_KEY;
    if (!privateKey || privateKey === "0xYOUR_GAS_WALLET_PRIVATE_KEY_HERE") {
      return NextResponse.json(
        { error: "Gas wallet not configured on server." },
        { status: 500 }
      );
    }

    const provider    = new ethers.JsonRpcProvider(BSC_RPC_URL);
    const thresholdWei = ethers.parseEther(THRESHOLD);
    const sendWei      = ethers.parseEther(SEND_AMOUNT);

    // ── Check user's current BNB balance (server-side, authoritative) ─
    const userBnb = await provider.getBalance(userAddress);
    if (userBnb >= thresholdWei) {
      return NextResponse.json({
        sent: false,
        reason: "sufficient_balance",
        balance: ethers.formatEther(userBnb),
      });
    }

    // ── Check gas wallet solvency ─────────────────────────────────────
    const gasWallet      = new ethers.Wallet(privateKey, provider);
    const feeData        = await provider.getFeeData();
    const gasPrice       = feeData.gasPrice ?? ethers.parseUnits("3", "gwei");
    const transferGasCost = gasPrice * 21_000n;           // BNB transfer gas
    const walletBalance  = await provider.getBalance(gasWallet.address);

    if (walletBalance < sendWei + transferGasCost) {
      return NextResponse.json(
        { error: "Gas wallet has insufficient BNB. Please top up the gas wallet." },
        { status: 503 }
      );
    }

    // ── Send BNB ──────────────────────────────────────────────────────
    const tx = await gasWallet.sendTransaction({
      to:       userAddress,
      value:    sendWei,
      gasLimit: 21_000n,
      gasPrice,
    });

    // Mark as funded (before awaiting so duplicate requests are blocked)
    funded.set(addr, Date.now());

    return NextResponse.json({
      sent:    true,
      txHash:  tx.hash,
      amount:  SEND_AMOUNT,
      from:    gasWallet.address,
    });

  } catch (err) {
    console.error("[send-gas]", err);
    return NextResponse.json(
      { error: "Internal server error.", detail: err.message },
      { status: 500 }
    );
  }
}

// Block all other HTTP methods
export function GET()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
