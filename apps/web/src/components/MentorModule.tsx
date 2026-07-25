"use client";

import React from "react";
import { Award, Calendar, CheckCircle2, MessageSquare, Star, UserCheck } from "lucide-react";
import { useForgeStore } from "@/stores/useStore";

export default function MentorModule() {
  const { startups } = useForgeStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-brand-600" size={24} />
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Mentor & Advisory Hub</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Review assigned startups, conduct office hours, provide pitch feedback, and guide early-stage founders.
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Star size={12} fill="currentColor" /> Certified Advisor
        </span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 block mb-1">Assigned Founders</span>
          <div className="text-2xl font-bold text-neutral-900">4 Startups</div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 block mb-1">Completed Advisory Sessions</span>
          <div className="text-2xl font-bold text-neutral-900">18 Sessions</div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 block mb-1">Mentor Rating</span>
          <div className="text-2xl font-bold text-neutral-900 flex items-center gap-1">
            4.95 <Star size={18} className="text-amber-500" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Startups Requesting Advisory */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900">Startups Requesting Feedback & Office Hours</h2>
        <div className="space-y-3">
          {startups.map((st) => (
            <div key={st.id} className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">{st.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{st.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded">{st.industry}</span>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 font-bold px-2 py-0.5 rounded uppercase">Stage: {st.stage}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-neutral-200 hover:border-brand-500 text-neutral-800 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition">
                  <MessageSquare size={14} /> Provide Written Review
                </button>
                <button className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition">
                  <Calendar size={14} /> Schedule 1-on-1 Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
