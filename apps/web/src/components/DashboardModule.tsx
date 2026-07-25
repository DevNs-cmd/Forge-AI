"use client";

import React from "react";
import { useForgeStore } from "@/stores/useStore";
import { 
  Lightbulb, 
  CheckCircle, 
  Rocket, 
  ArrowRight, 
  TrendingUp, 
  Activity,
  Users2
} from "lucide-react";

export default function DashboardModule() {
  const { ideas, experiments, startups, tasks, setActiveModule } = useForgeStore();

  // Basic stats compilation
  const ideaCount = ideas.length;
  const completedExperiments = experiments.filter(e => e.status === "completed").length;
  const activeExperiments = experiments.filter(e => e.status === "running").length;
  const pendingTasks = tasks.filter(t => t.status === "todo" || t.status === "in_progress").length;

  const activeIdea = ideas[0];
  const readiness = activeIdea ? activeIdea.readinessScore : 0;

  // Lifecycle steps mapping
  const steps = [
    { label: "Idea OS", active: true, desc: "Refinement & ICP" },
    { label: "Validation OS", active: readiness >= 30, desc: "Evidence & Experiments" },
    { label: "Founder Matching", active: readiness >= 50, desc: "Team building" },
    { label: "Startup Creation", active: startups.length > 0, desc: "Company formation" },
    { label: "Workspace OS", active: startups.length > 0, desc: "Operations & Milestones" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Lifecycle OS</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Monitor your startup journey from raw validation indicators to operational scale.
        </p>
      </div>

      {/* Interactive Lifecycle State Machine Line */}
      <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
          Startup Lifecycle State Machine
        </h2>
        <div className="grid grid-cols-5 gap-4 relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-10 right-10 h-0.5 bg-neutral-100 -z-10" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-300 ${
                step.active 
                  ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm" 
                  : "bg-white border-neutral-200 text-neutral-400"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-xs font-semibold mt-3 ${step.active ? "text-neutral-900" : "text-neutral-400"}`}>
                {step.label}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 max-w-[100px] leading-tight">
                {step.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lightbulb size={20} />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Total Ideas</span>
            <span className="text-xl font-bold text-neutral-900">{ideaCount}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Experiments Run</span>
            <span className="text-xl font-bold text-neutral-900">{completedExperiments}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Active Sprints</span>
            <span className="text-xl font-bold text-neutral-900">{activeExperiments}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Rocket size={20} />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Startup Stages</span>
            <span className="text-xl font-bold text-neutral-900">{startups.length > 0 ? "Formation" : "Ideation"}</span>
          </div>
        </div>
      </div>

      {/* Main split details (Next best action vs Activity) */}
      <div className="grid grid-cols-3 gap-6">
        {/* Next Best Action Card */}
        <div className="col-span-2 bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-brand-600" />
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                AI Next-Best-Action Recommendation
              </h3>
            </div>
            
            {readiness < 40 && activeIdea ? (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-800 text-sm">Refine your problem statement and target customer profile</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your active idea, <strong>{activeIdea.title}</strong>, has a readiness score of <strong>{readiness}%</strong>. 
                  Populate and validate your problem and ICP using the AI Refiner tool to advance to the Validation lifecycle stage.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveModule("idea-exchange")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Go to Idea Exchange <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : readiness >= 40 && readiness < 60 && activeIdea ? (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-800 text-sm">Launch pending validation experiments to back your hypotheses</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  You have defined your idea and assumptions. Now, run landing page signups or conduct customer interviews to log concrete evidence.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveModule("validation-os")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Manage Experiments <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : startups.length === 0 ? (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-800 text-sm">Form your company workspace and register founding roles</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your validation thresholds are satisfied! Create a company profile and assign equity splits to open the Founder Workspace.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveModule("startup-creation")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Create Startup Record <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-800 text-sm">Manage tasks and document company strategy</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your workspace is active. Collaborate on milestones, take meeting notes with automatic AI summaries, and monitor company velocity.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveModule("founder-os")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Open Founder OS Workspace <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 border-t border-neutral-100 pt-4 flex items-center justify-between text-xs text-neutral-400">
            <span>Forge scoring criteria v1.0.0</span>
            <span className="font-medium text-brand-600">Continuous Sync Active</span>
          </div>
        </div>

        {/* Activity Streams panel */}
        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-neutral-400" />
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Live Activity Stream
            </h3>
          </div>
          <div className="space-y-3.5">
            <div className="flex gap-2.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-neutral-800">Experiment Validated</span>
                <p className="text-[10px] text-neutral-500">Customer discovery interviews verified high aggregator margin loss.</p>
              </div>
            </div>
            <div className="flex gap-2.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-neutral-800">Idea Registered</span>
                <p className="text-[10px] text-neutral-500">DirectFarm Delivery was successfully registered in private drafts.</p>
              </div>
            </div>
            <div className="flex gap-2.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-neutral-800">AI Context Initialized</span>
                <p className="text-[10px] text-neutral-500">Auto-linking vector metadata and local session memories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
