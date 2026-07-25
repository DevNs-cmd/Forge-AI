"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { Lightbulb, ThumbsUp, Sparkles, Plus, Search, ShieldCheck } from "lucide-react";

export default function IdeaExchangeModule() {
  const { ideas, addIdea, upvoteIdeaToggle, setActiveIdeaId, setActiveModule, currentUser } = useForgeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [solution, setSolution] = useState("");

  const filteredIdeas = ideas.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.oneLiner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !oneLiner || !problemStatement || !solution) return;
    await addIdea({
      title,
      oneLiner,
      problemStatement,
      solution,
      status: "draft",
      readinessScore: 35
    });
    setTitle("");
    setOneLiner("");
    setProblemStatement("");
    setSolution("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded uppercase">Module 1</span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Idea Exchange</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            The world's marketplace for startup concepts. Submit ideas, validate market demand, and single-vote concepts.
          </p>
        </div>

        {currentUser?.role !== 'builder' && (
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={14} /> Submit New Concept
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white border border-neutral-200 p-2.5 rounded-xl shadow-sm">
        <Search size={16} className="text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search startup ideas, problem domains, or AI scores..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Idea Creation Modal/Drawer */}
      {showAddModal && (
        <form onSubmit={handleCreate} className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-soft space-y-3 text-xs max-w-xl">
          <h3 className="font-bold text-neutral-800 text-sm">Submit Concept to Idea Exchange</h3>
          <div>
            <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Product Title</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CodeAudit AI"
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50"
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">One-Liner Hook</label>
            <input
              type="text" value={oneLiner} onChange={e => setOneLiner(e.target.value)}
              placeholder="e.g. Autonomous AI security compliance auditing for Next.js"
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50"
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Problem Statement</label>
            <textarea
              value={problemStatement} onChange={e => setProblemStatement(e.target.value)} rows={2}
              placeholder="Describe the friction and pain point..."
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50"
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Proposed Solution</label>
            <textarea
              value={solution} onChange={e => setSolution(e.target.value)} rows={2}
              placeholder="Detail the technical or business mechanism..."
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50"
            />
          </div>
          <button type="submit" className="bg-brand-600 text-white font-bold px-4 py-2 rounded-xl">
            Publish Concept to Exchange
          </button>
        </form>
      )}

      {/* Grid of Idea Cards */}
      <div className="grid grid-cols-2 gap-5">
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft hover:border-brand-200 transition space-y-4 text-left flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{idea.title}</h3>
                    <span className="text-[10px] text-neutral-400">By {idea.ownerName || "Founder"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-extrabold px-2 py-0.5 rounded-full">
                    Score: {idea.readinessScore}/100
                  </span>
                </div>
              </div>

              {/* One liner */}
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed font-medium">
                {idea.oneLiner}
              </p>

              {/* Problem / Solution preview */}
              <div className="mt-3 bg-neutral-50/70 p-3 rounded-xl space-y-1.5 text-[11px]">
                <p className="text-neutral-700"><strong className="text-neutral-900">Problem:</strong> {idea.problemStatement}</p>
                {idea.competitors && idea.competitors.length > 0 && (
                  <div className="pt-1.5 border-t border-neutral-100 flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>Competitors:</span>
                    <span className="font-semibold text-neutral-600">{idea.competitors.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => upvoteIdeaToggle(idea.id!)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition font-semibold ${
                  idea.userVoted 
                    ? "bg-brand-600 text-white shadow-sm" 
                    : "bg-neutral-100 text-neutral-700 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <ThumbsUp size={12} />
                <span>{idea.upvotes || 0} Upvotes</span>
                {idea.userVoted && <span className="text-[9px] bg-white/20 px-1 rounded ml-1">Voted</span>}
              </button>

              <button
                onClick={() => {
                  setActiveIdeaId(idea.id!);
                  setActiveModule("founder-matching");
                }}
                className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
              >
                Find Co-founders ➔
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
