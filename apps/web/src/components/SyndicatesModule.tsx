"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { DollarSign, Users, ShieldCheck, Check } from "lucide-react";

export default function SyndicatesModule() {
  const { syndicates } = useForgeStore();
  const [joined, setJoined] = useState<string[]>([]);

  const handleJoin = (id: string, name: string) => {
    setJoined(prev => [...prev, id]);
    alert(`Co-investment request submitted to ${name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">Module 9</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Startup Syndicates</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "Invest together, grow together". Join angel-led syndicates to co-invest in high-momentum startups as a group.
          </p>
        </div>
      </div>

      {/* Syndicates Grid */}
      <div className="grid grid-cols-2 gap-6">
        {syndicates.map((syn) => {
          const isJoined = joined.includes(syn.id);
          return (
            <div key={syn.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{syn.name}</h3>
                    <span className="text-xs text-blue-600 font-semibold">Lead: {syn.leadName}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    {syn.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-xl text-[10px]">
                  <div>
                    <span className="text-neutral-400 block font-semibold">Target Allocation</span>
                    <span className="font-bold text-neutral-800">{syn.targetAllocation}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Committed</span>
                    <span className="font-bold text-emerald-600">{syn.committedAmount}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Angels Joined</span>
                    <span className="font-bold text-neutral-800">{syn.membersCount} Members</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleJoin(syn.id, syn.name)}
                disabled={isJoined}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isJoined ? "bg-emerald-100 text-emerald-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                {isJoined ? <><Check size={14} /> Joined Syndicate</> : <><DollarSign size={14} /> Back Syndicate Deal</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
