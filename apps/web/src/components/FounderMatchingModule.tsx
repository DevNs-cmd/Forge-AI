"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Users, Sparkles, Heart, MessageSquare, Check, Filter } from "lucide-react";

export default function FounderMatchingModule() {
  const { founderCandidates, activeIdeaId, ideas } = useForgeStore();
  const [requestedIntros, setRequestedIntros] = useState<string[]>([]);
  const activeIdea = ideas.find(i => i.id === activeIdeaId);

  const handleRequestIntro = (id: string, name: string) => {
    setRequestedIntros(prev => [...prev, id]);
    alert(`Intro request sent to ${name}! They will receive your profile & idea context.`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded uppercase">Module 2</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Founder Matching Engine</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "Dating app for startup teams". AI matches co-founders based on skills, vision, risk commitment, & working style.
          </p>
        </div>

        {activeIdea && (
          <div className="bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Sparkles size={14} className="text-brand-600 animate-pulse" />
            <span className="font-semibold text-brand-800">Matching for: {activeIdea.title}</span>
          </div>
        )}
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-2 gap-6">
        {founderCandidates.map((cand) => {
          const isRequested = requestedIntros.includes(cand.id);
          return (
            <div key={cand.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft flex flex-col justify-between text-left space-y-4">
              <div className="space-y-4">
                {/* Candidate header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatarUrl}
                      alt={cand.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-brand-200"
                    />
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{cand.name}</h3>
                      <span className="text-xs text-brand-600 font-semibold">{cand.roleTitle}</span>
                      <span className="text-[10px] text-neutral-400 block">{cand.location}</span>
                    </div>
                  </div>

                  {/* AI Match Badge */}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-xl text-center">
                    <span className="text-sm font-extrabold block">{cand.matchScore}%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider block">AI Match</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                  {cand.bio}
                </p>

                {/* Skills tags */}
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">
                    Primary Tech & Operating Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match attributes table */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[10px]">
                  <div>
                    <span className="text-neutral-400 block font-semibold">Commitment</span>
                    <span className="font-bold text-neutral-800">{cand.commitment}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Working Style</span>
                    <span className="font-bold text-neutral-800 truncate block">{cand.workingStyle}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Risk Tolerance</span>
                    <span className="font-bold text-neutral-800">{cand.riskTolerance}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRequestIntro(cand.id, cand.name)}
                disabled={isRequested}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isRequested 
                    ? "bg-emerald-100 text-emerald-800 cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                }`}
              >
                {isRequested ? (
                  <>
                    <Check size={14} /> Intro Request Sent
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} /> Request Founder Introduction
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
