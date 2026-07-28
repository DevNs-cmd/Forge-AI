"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Code2, Star, Briefcase, DollarSign, Award, CheckCircle, Search } from "lucide-react";

export default function BuilderMarketplaceModule() {
  const { builderProfiles } = useForgeStore();
  const [filterEquity, setFilterEquity] = useState("All");

  const filteredBuilders = filterEquity === "All" 
    ? builderProfiles 
    : builderProfiles.filter(b => b.equityPreference.includes(filterEquity));

  const handleHire = (name: string) => {
    alert(`Project brief sent to ${name}! They will review your milestone scope.`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">Module 4</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Builder Marketplace</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "GitHub for startup talent". Find verified developers, designers, and growth experts for equity, salary, or milestone projects.
          </p>
        </div>

        {/* Equity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-semibold">Compensation:</span>
          <select
            value={filterEquity}
            onChange={(e) => setFilterEquity(e.target.value)}
            className="border border-neutral-200 p-2 rounded-xl bg-white text-xs font-semibold"
          >
            <option value="All">All Types</option>
            <option value="Equity">Equity Included</option>
            <option value="Cash">Cash / Rate</option>
          </select>
        </div>
      </div>

      {/* Builder Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredBuilders.map((builder) => (
          <div key={builder.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={builder.avatarUrl}
                    alt={builder.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-indigo-200"
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{builder.name}</h3>
                    <span className="text-xs text-indigo-600 font-semibold">{builder.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{builder.rating}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                {builder.bio}
              </p>

              {/* Skills */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                  Stack & Framework Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {builder.primarySkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rate & Preferences */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[10px]">
                <div>
                  <span className="text-neutral-400 block font-semibold">Rate</span>
                  <span className="font-bold text-neutral-800">{builder.hourlyRate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-semibold">Compensation Preference</span>
                  <span className="font-bold text-neutral-800">{builder.equityPreference}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleHire(builder.name)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition"
            >
              Send Project Brief & Proposal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
