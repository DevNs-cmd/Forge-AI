"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Sparkles, Plus, PlusCircle, Check, Loader2, ArrowRight, Lightbulb } from "lucide-react";

export default function IdeaOSModule() {
  const { ideas, addIdea, updateIdea, activeIdeaId, setActiveIdeaId } = useForgeStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [refinementLoading, setRefinementLoading] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [solution, setSolution] = useState("");

  const activeIdea = ideas.find((i) => i.id === activeIdeaId);

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !oneLiner || !problemStatement || !solution) {
      alert("Please fill in all fields");
      return;
    }
    const newId = `idea-${Date.now()}`;
    addIdea({
      id: newId,
      ownerId: "user-123",
      title,
      oneLiner,
      problemStatement,
      solution,
      status: "draft",
      readinessScore: 10
    });
    // Reset form
    setTitle("");
    setOneLiner("");
    setProblemStatement("");
    setSolution("");
    setShowAddForm(false);
  };

  const handleAIRefine = async () => {
    if (!activeIdea) return;
    setRefinementLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${API_URL}/api/ai/refine-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeIdea.title,
          oneLiner: activeIdea.oneLiner,
          problemStatement: activeIdea.problemStatement,
          solution: activeIdea.solution
        })
      });

      if (!response.ok) throw new Error("Could not connect to FastAPI server");
      const data = await response.json();

      updateIdea(activeIdea.id!, {
        oneLiner: data.refinedOneLiner,
        problemStatement: data.refinedProblemStatement,
        solution: data.refinedSolution,
        icp: data.icpAnalysis.demographics,
        targetMarket: data.marketSizeEstimate,
        readinessScore: Math.min(activeIdea.readinessScore + 25, 100),
        status: "refining"
      });

      alert("Idea Refined Successfully! Your problem statement, target customer segments, and market sizes were updated. Readiness score increased!");
    } catch (err) {
      console.error(err);
      alert("Could not connect to local AI Service on port 8000. Please start your FastAPI server, or use the AI Assistant side-drawer for simulated flow.");
    } finally {
      setRefinementLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Idea OS</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Turn your raw startup concepts into structured, analyzed, and versioned strategic assets.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
        >
          <Plus size={14} />
          {showAddForm ? "View Idea List" : "Capture New Idea"}
        </button>
      </div>

      {showAddForm ? (
        /* Create New Idea Form */
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft max-w-2xl">
          <h3 className="text-sm font-bold text-neutral-800 mb-4">Capture Startup Concept</h3>
          <form onSubmit={handleCreateIdea} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">Company / Product Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DirectFarm Logistics"
                className="w-full text-xs border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/50 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">One-Liner Hook</label>
              <input
                type="text"
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="e.g. Real-time delivery connecting organic farms directly with city diners."
                className="w-full text-xs border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/50 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">Problem Statement</label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={3}
                placeholder="Describe who has the pain point and why current solutions are failing..."
                className="w-full text-xs border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/50 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">Proposed Solution</label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={3}
                placeholder="Detail the technical or business mechanism that solves this pain point..."
                className="w-full text-xs border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/50 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Register Draft Idea
            </button>
          </form>
        </div>
      ) : (
        /* Idea OS Management Split Dashboard */
        <div className="grid grid-cols-3 gap-6">
          {/* Ideas List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Concept List</h3>
            {ideas.map((idea) => {
              const isActive = activeIdeaId === idea.id;
              return (
                <div
                  key={idea.id}
                  onClick={() => setActiveIdeaId(idea.id!)}
                  className={`border p-4 rounded-xl cursor-pointer transition-all duration-200 text-left ${
                    isActive 
                      ? "bg-brand-50/30 border-brand-300 shadow-sm" 
                      : "bg-white border-neutral-100 hover:border-neutral-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-neutral-800 truncate max-w-[130px]">{idea.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      idea.status === "refining" ? "bg-indigo-100 text-indigo-700" : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {idea.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed">{idea.oneLiner}</p>
                  
                  {/* Readiness Progress bar */}
                  <div className="mt-3.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400">Readiness Score</span>
                    <span className="font-bold text-brand-600">{idea.readinessScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="bg-brand-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${idea.readinessScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Idea details panel */}
          <div className="col-span-2 space-y-4">
            {activeIdea ? (
              <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft space-y-5">
                {/* Header detail */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-neutral-800 text-sm">{activeIdea.title}</h2>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{activeIdea.oneLiner}</p>
                    </div>
                  </div>
                  
                  {/* AI refine button */}
                  <button
                    onClick={handleAIRefine}
                    disabled={refinementLoading}
                    className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    {refinementLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} className="text-brand-600 animate-pulse" />
                    )}
                    <span>Refine with AI</span>
                  </button>
                </div>

                {/* Subsections details */}
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider mb-1.5">
                      Problem Statement
                    </h4>
                    <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg leading-relaxed">
                      {activeIdea.problemStatement}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider mb-1.5">
                      Proposed Solution
                    </h4>
                    <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg leading-relaxed">
                      {activeIdea.solution}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider mb-1.5">
                        Ideal Customer Profile (ICP)
                      </h4>
                      <div className="bg-neutral-50 p-3 rounded-lg min-h-[60px] text-neutral-700">
                        {activeIdea.icp || "AI suggestion not populated yet. Click 'Refine with AI' or consult the Copilot drawer to auto-fill."}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider mb-1.5">
                        Target Market Size Addressable
                      </h4>
                      <div className="bg-neutral-50 p-3 rounded-lg min-h-[60px] text-neutral-700">
                        {activeIdea.targetMarket || "Target market sizes not estimated yet."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next phase link indicator */}
                {activeIdea.readinessScore >= 35 && (
                  <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-900 text-xs block">Ready for validation</span>
                      <span className="text-[10px] text-indigo-700 mt-0.5 block">
                        Your readiness score satisfies initial thresholds. Setup experiments to begin gathering evidence.
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveIdeaId(activeIdea.id!)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg text-xs font-semibold"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-neutral-100 p-12 rounded-2xl text-center shadow-soft">
                <span className="text-xs text-neutral-400">Select an idea draft from the list to display details and begin AI refinement.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
