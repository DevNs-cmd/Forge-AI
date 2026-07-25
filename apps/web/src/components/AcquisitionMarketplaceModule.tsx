"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { ShoppingBag, DollarSign, ShieldCheck, ExternalLink, Send } from "lucide-react";

export default function AcquisitionMarketplaceModule() {
  const { acquisitions } = useForgeStore();

  const handleInquire = (title: string) => {
    alert(`Acquisition Letter of Intent (LOI) & Diligence access requested for '${title}'!`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded uppercase">Module 10</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Acquisition Marketplace</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "Buy or sell companies". Verified marketplace for M&A acquisitions of SaaS, D2C, & digital assets with audited financials.
          </p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-2 gap-6">
        {acquisitions.map((acq) => (
          <div key={acq.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{acq.title}</h3>
                  <span className="text-xs text-slate-600 font-semibold">{acq.category}</span>
                </div>

                <div className="bg-slate-100 text-slate-800 font-extrabold px-2.5 py-1 rounded-xl text-xs">
                  Price: {acq.askingPrice}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-xl text-[10px]">
                <div>
                  <span className="text-neutral-400 block font-semibold">Annual Recurring Revenue (ARR)</span>
                  <span className="font-bold text-emerald-600 text-sm">{acq.arr}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-semibold">Net Profit Margin</span>
                  <span className="font-bold text-neutral-800 text-sm">{acq.profitMargin}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Tech Stack</span>
                <div className="flex gap-1.5">
                  {acq.techStack.map((ts, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      {ts}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleInquire(acq.title)}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Send size={12} /> Request Diligence Access & Submit LOI
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
