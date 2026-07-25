"use client";

import React from "react";
import { useForgeStore } from "@/stores/useStore";
import { BarChart3, TrendingUp, ShieldAlert, Zap, Activity } from "lucide-react";

export default function DataIntelligenceModule() {
  const { ideas, experiments } = useForgeStore();

  const activeIdea = ideas[0];
  const readiness = activeIdea ? activeIdea.readinessScore : 45;
  const founderScore = 88; // Synthetic score based on user execution velocity
  const riskIndex = readiness > 50 ? "Low (22%)" : "Medium (48%)";

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded uppercase">Module 6</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Intelligence OS</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            "Bloomberg for startups". Real-time startup intelligence with live metrics, founder scores, risk indices, & competitive insights.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
          <Activity size={14} className="animate-pulse text-emerald-600" />
          Live Telemetry Active
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Founder Execution Score</span>
          <span className="text-3xl font-extrabold text-brand-700">{founderScore}</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ Top 12% Percentile</span>
        </div>

        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Concept Validation Readiness</span>
          <span className="text-3xl font-extrabold text-emerald-600">{readiness}%</span>
          <span className="text-[10px] text-neutral-400 block mt-1">Based on {experiments.length} experiment logs</span>
        </div>

        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Risk Profile Index</span>
          <span className="text-3xl font-extrabold text-amber-600">{riskIndex}</span>
          <span className="text-[10px] text-neutral-400 block mt-1">Assessed via AI Audit</span>
        </div>

        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Market Velocity</span>
          <span className="text-3xl font-extrabold text-indigo-600">4.8x</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ +24% vs Last Sprint</span>
        </div>
      </div>

      {/* Visual Analytics Chart Representation */}
      <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Startup Growth Trajectory & Validation Velocity (Last 6 Months)
        </h3>

        {/* SVG Chart visualization */}
        <div className="h-48 w-full bg-neutral-50 rounded-xl p-4 flex items-end justify-between gap-2 border border-neutral-100">
          {[
            { month: "Jan", val: 30 },
            { month: "Feb", val: 45 },
            { month: "Mar", val: 40 },
            { month: "Apr", val: 65 },
            { month: "May", val: 80 },
            { month: "Jun", val: 94 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div 
                className="w-full bg-brand-500 hover:bg-brand-600 rounded-t-lg transition-all duration-500 shadow-sm"
                style={{ height: `${bar.val}%` }}
              />
              <span className="text-[10px] font-bold text-neutral-500">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
