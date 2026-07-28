"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { TrendingUp, DollarSign, Building, Award, Send, Check } from "lucide-react";

export default function CapitalMarketplaceModule() {
  const { investorProfiles, activeRole, startups, ideas } = useForgeStore();
  const [stageFilter, setStageFilter] = useState("All");
  const [requestedIntros, setRequestedIntros] = useState<Record<string, boolean>>({});

  const stages = ["Idea", "Prototype", "MVP", "Revenue", "Exit"] as const;

  const handleApply = (name: string) => {
    alert(`Pitch deck & data room package shared with ${name}!`);
  };

  const handleRequestIntro = (id: string, name: string) => {
    setRequestedIntros(prev => ({ ...prev, [id]: true }));
    alert(`Intro request submitted for ${name}! Pitch deck files have been queued for download.`);
  };

  const mockDealFlow = [
    {
      id: "df-1",
      name: "DirectFarm Logistics",
      stage: "Prototype",
      seeking: "$500,000 Seed",
      oneLiner: "Automated logistics connection directly between micro-farms and local restaurants.",
      readiness: 78,
      traction: "10 restaurants signed",
      arr: "Pre-revenue"
    },
    {
      id: "df-2",
      name: "CodeAudit AI",
      stage: "MVP",
      seeking: "$250,000 Pre-Seed",
      oneLiner: "Continuous background developer agent that auto-scans pull requests and generates compliance data rooms.",
      readiness: 85,
      traction: "4 startup pilot programs",
      arr: "$1,200 MRR"
    }
  ];

  if (activeRole === "investor") {
    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">Investor Mode</span>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Deal Flow Pipeline</h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Review verified, validated startup concepts seeking seed and angel investment. Browse validation scores and request data rooms.
            </p>
          </div>
        </div>

        {/* Stage Filter */}
        <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-soft">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Deal Stage Filtering
          </h3>
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => setStageFilter("All")}
              className={`p-3 rounded-xl border text-left transition ${
                stageFilter === "All"
                  ? "bg-emerald-50 border-emerald-300 shadow-sm"
                  : "bg-neutral-50 border-neutral-100 hover:border-neutral-200"
              }`}
            >
              <span className="text-[9px] text-neutral-400 font-bold uppercase block">Filter</span>
              <span className="font-bold text-xs text-neutral-900 mt-0.5 block">All Deals</span>
            </button>
            {stages.map((st, idx) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`p-3 rounded-xl border text-left transition ${
                  stageFilter === st 
                    ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                    : "bg-neutral-50 border-neutral-100 hover:border-neutral-200"
                }`}
              >
                <span className="text-[9px] text-neutral-400 font-bold uppercase block">Stage 0{idx + 1}</span>
                <span className="font-bold text-xs text-neutral-900 mt-0.5 block">{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Startups List */}
        <div className="grid grid-cols-2 gap-6 text-left">
          {mockDealFlow
            .filter(item => stageFilter === "All" || item.stage === stageFilter)
            .map((item) => (
              <div key={item.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{item.name}</h4>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full mt-1 inline-block">
                        Stage: {item.stage}
                      </span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-extrabold">
                      {item.seeking}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                    {item.oneLiner}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[10px] font-semibold">
                    <div>
                      <span className="text-neutral-400 block">Readiness</span>
                      <span className="text-neutral-800 font-bold">{item.readiness}/100</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Traction</span>
                      <span className="text-neutral-800 font-bold">{item.traction}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Financials</span>
                      <span className="text-neutral-800 font-bold">{item.arr}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRequestIntro(item.id, item.name)}
                  disabled={requestedIntros[item.id]}
                  className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                    requestedIntros[item.id]
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <Send size={12} /> {requestedIntros[item.id] ? "Intro Requested" : "Request Founder Intro & Deck"}
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">Module 5</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Capital Marketplace</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "AngelList evolved". Stage-wise fundraising pipeline connecting validated startups directly with Angels and VCs.
          </p>
        </div>
      </div>

      {/* Stage-wise Pipeline Ribbon */}
      <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-soft">
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
          Stage-wise Capital Pipeline Tracker
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {stages.map((st, idx) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`p-3 rounded-xl border text-left transition ${
                stageFilter === st 
                  ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                  : "bg-neutral-50 border-neutral-100 hover:border-neutral-200"
              }`}
            >
              <span className="text-[9px] text-neutral-400 font-bold uppercase block">Stage 0{idx + 1}</span>
              <span className="font-bold text-xs text-neutral-900 mt-0.5 block">{st}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Investors List */}
      <div className="grid grid-cols-2 gap-6">
        {investorProfiles.map((inv) => (
          <div key={inv.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={inv.avatarUrl}
                    alt={inv.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-emerald-200"
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{inv.name}</h3>
                    <span className="text-xs text-emerald-700 font-semibold">{inv.firm} ({inv.type})</span>
                    <span className="text-[10px] text-neutral-400 block">{inv.location}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-extrabold">
                  {inv.checkSizeRange}
                </div>
              </div>

              {/* Investment Thesis */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                  Active Investment Theses
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inv.theses.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred stages */}
              <div className="pt-2 border-t border-neutral-100 text-[10px]">
                <span className="text-neutral-400 font-semibold block mb-1">Target Stages</span>
                <div className="flex gap-1.5">
                  {inv.preferredStages.map((ps, idx) => (
                    <span key={idx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-bold">
                      {ps}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleApply(inv.name)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Send size={12} /> Share Pitch Deck & Data Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
