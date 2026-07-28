import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CreateOrderBody {
  amount: number;     // in paise (INR) e.g. 4900 = ₹49
  currency?: string;  // default INR
  plan: string;       // e.g. "pro" | "investor"
  notes?: Record<string, string>;
}

// ── Helper: basic auth header ──────────────────────────────────────────────────
function razorpayAuthHeader(): string {
  const key = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

// ── POST /api/razorpay/create-order ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" },
      { status: 500 }
    );
  }

  try {
    const body: CreateOrderBody = await req.json();
    const { amount, currency = "INR", plan, notes = {} } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create order via Razorpay REST API
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: razorpayAuthHeader(),
      },
      body: JSON.stringify({
        amount,          // amount in paise
        currency,
        receipt: `forge_${plan}_${Date.now()}`,
        notes: {
          plan,
          product: "Project Forge",
          ...notes,
        },
      }),
    });

    if (!razorpayRes.ok) {
      const err = await razorpayRes.json();
      console.error("Razorpay order creation failed:", err);
      return NextResponse.json(
        { error: err?.error?.description || "Failed to create order" },
        { status: razorpayRes.status }
      );
    }

    const order = await razorpayRes.json();

    // Return order + public key (safe to expose)
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,             // public key — needed by Razorpay checkout in the browser
    });
  } catch (err) {
    console.error("Razorpay API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
