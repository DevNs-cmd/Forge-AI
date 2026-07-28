"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Code2, Star, Briefcase, DollarSign, Award, CheckCircle, Search } from "lucide-react";

export default function BuilderMarketplaceModule() {
  const { builderProfiles, activeRole, currentUser } = useForgeStore();
  const [filterEquity, setFilterEquity] = useState("All");
  const [hasApplied, setHasApplied] = useState<Record<string, boolean>>({});

  const filteredBuilders = filterEquity === "All" 
    ? builderProfiles 
    : builderProfiles.filter(b => b.equityPreference.includes(filterEquity));

  const handleHire = (name: string) => {
    alert(`Project brief sent to ${name}! They will review your milestone scope.`);
  };

  const handleApplyGig = (gigId: string, title: string) => {
    setHasApplied(prev => ({ ...prev, [gigId]: true }));
    alert(`Proposal submitted for "${title}"! The founder has been notified.`);
  };

  const mockGigs = [
    {
      id: "gig-1",
      startupName: "DirectFarm Logistics",
      title: "Backend Route Optimization Engineer",
      description: "Build the automated dispatch routing engine matching micro-farms with restaurants in Node/TypeScript.",
      rate: "$75/hr",
      duration: "2-3 weeks contract",
      equityShare: "0.5% - 1.0% optional equity split",
      skills: ["NestJS", "PostgreSQL", "Google Maps API", "Algorithms"]
    },
    {
      id: "gig-2",
      startupName: "CodeAudit AI",
      title: "Chrome Extension Developer",
      description: "Develop the developer co-pilot chrome extension interface displaying continuous compliance reports.",
      rate: "$65/hr",
      duration: "4 weeks contract",
      equityShare: "Equity split preferred",
      skills: ["Next.js", "Chrome Extension API", "Tailwind CSS", "TypeScript"]
    },
    {
      id: "gig-3",
      startupName: "EcoStore Platform",
      title: "Full-Stack MVP Developer",
      description: "Help build and ship the first version of our carbon offset checkout widget inside Shopify sites.",
      rate: "$80/hr",
      duration: "1-2 months project",
      equityShare: "Equity + Cash",
      skills: ["Shopify Liquid", "Next.js", "GraphQL", "Node.js"]
    }
  ];

  if (activeRole === "builder") {
    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">Builder Mode</span>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Project Gigs & Workspaces</h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Browse opportunities posted by validated startup founders. Bid for milestone projects or apply for equity co-founder tracks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: My Profile Preview */}
          <div className="col-span-1 bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft h-fit text-left space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pb-2 border-b border-neutral-100">
              My Builder Profile
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {currentUser?.username?.[0]?.toUpperCase() || "B"}
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">{currentUser?.fullName || "David Kim"}</h4>
                <span className="text-xs text-indigo-600 font-semibold">Full-Stack Next.js Architect</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Hourly Rate:</span>
                <span className="font-bold text-neutral-700">$65.00 / hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Availability:</span>
                <span className="font-bold text-emerald-600">30 hrs/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Pref. Terms:</span>
                <span className="font-bold text-neutral-700">Cash + Equity split</span>
              </div>
            </div>
            <button className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-2 rounded-xl text-xs transition">
              Edit Developer Resume
            </button>
          </div>

          {/* Right: Available Gigs */}
          <div className="col-span-2 space-y-4 text-left">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Available Startup Opportunities ({mockGigs.length})
            </h3>

            {mockGigs.map((gig) => (
              <div key={gig.id} className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold block">{gig.startupName}</span>
                    <h4 className="font-bold text-neutral-900 text-sm">{gig.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-800 block">{gig.rate}</span>
                    <span className="text-[10px] text-neutral-400 block">{gig.duration}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {gig.skills.map((sk) => (
                    <span key={sk} className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-semibold">Compensation Preference: {gig.equityShare}</span>
                  <button
                    onClick={() => handleApplyGig(gig.id, gig.title)}
                    disabled={hasApplied[gig.id]}
                    className={`font-bold px-4 py-2 rounded-xl text-xs transition ${
                      hasApplied[gig.id]
                        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {hasApplied[gig.id] ? "Application Pending" : "Apply & Submit Bid"}
                  </button>
                </div>
              </div>
            ))}
          </div>
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
