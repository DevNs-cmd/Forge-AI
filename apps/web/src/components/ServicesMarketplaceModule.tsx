"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Briefcase, ShieldCheck, Gift, Check, ExternalLink } from "lucide-react";

export default function ServicesMarketplaceModule() {
  const { serviceProviders } = useForgeStore();
  const [claimed, setClaimed] = useState<string[]>([]);

  const handleClaim = (id: string, name: string) => {
    setClaimed(prev => [...prev, id]);
    alert(`Perk claimed! Your voucher for ${name} has been issued to your registered account.`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">Module 7</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Services Marketplace</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "Everything startups need". Access verified legal, accounting, AWS cloud credits, & marketing packages in one ecosystem.
          </p>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-2 gap-6">
        {serviceProviders.map((srv) => {
          const isClaimed = claimed.includes(srv.id);
          return (
            <div key={srv.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={srv.logoUrl}
                      alt={srv.name}
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-neutral-900 text-sm">{srv.name}</h3>
                        {srv.verifiedBadge && (
                          <span title="Verified Partner">
                            <ShieldCheck size={14} className="text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-amber-700 font-semibold">{srv.category}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Gift size={12} />
                    <span>{srv.perksValue}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                  {srv.offerDetails}
                </p>
              </div>

              <button
                onClick={() => handleClaim(srv.id, srv.name)}
                disabled={isClaimed}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isClaimed
                    ? "bg-emerald-100 text-emerald-800 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                }`}
              >
                {isClaimed ? (
                  <>
                    <Check size={14} /> Voucher Claimed
                  </>
                ) : (
                  <>
                    <Gift size={14} /> Claim Perk Package
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
