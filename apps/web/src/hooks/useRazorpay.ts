"use client";

import { useCallback } from "react";

// Razorpay checkout script is loaded on-demand (not bundled)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface PaymentOptions {
  plan: string;
  planLabel: string;
  amountPaise: number;       // e.g. 4900 for ₹49
  userEmail?: string;
  userName?: string;
  onSuccess?: (paymentId: string, orderId: string, signature: string) => void;
  onFailure?: (error: string) => void;
}

// ── Load the Razorpay checkout.js script once ──────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useRazorpay() {
  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    const {
      plan,
      planLabel,
      amountPaise,
      userEmail = "",
      userName = "",
      onSuccess,
      onFailure,
    } = options;

    // 1. Load checkout script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onFailure?.("Failed to load Razorpay checkout. Check your connection.");
      return;
    }

    // 2. Create order server-side
    let orderId: string;
    let keyId: string;
    let amount: number;

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, plan }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order creation failed");
      }

      const data = await res.json();
      orderId = data.orderId;
      keyId = data.keyId;
      amount = data.amount;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order creation failed";
      onFailure?.(msg);
      return;
    }

    // 3. Open Razorpay checkout modal
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency: "INR",
      name: "Project Forge",
      description: `${planLabel} Plan — Monthly Subscription`,
      order_id: orderId,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#7c3aed",   // purple-600 — matches Forge branding
      },
      modal: {
        ondismiss: () => {
          onFailure?.("Payment cancelled");
        },
      },
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        onSuccess?.(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },
    });

    rzp.open();
  }, []);

  return { initiatePayment };
}
