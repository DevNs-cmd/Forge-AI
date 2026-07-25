"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Play, 
  Plus, 
  TrendingUp, 
  Award,
  Link,
  PlusCircle
} from "lucide-react";

export default function ValidationOSModule() {
  const { 
    experiments, 
    evidence, 
    addExperiment, 
    updateExperiment, 
    addEvidence, 
    ideas, 
    activeIdeaId,
    updateIdea
  } = useForgeStore();

  const [showAddExp, setShowAddExp] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  
  // Experiment form states
  const [expTitle, setExpTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [metric, setMetric] = useState("");
  const [target, setTarget] = useState("");

  // Evidence form states
  const [selectedExpId, setSelectedExpId] = useState("");
  const [evidenceType, setEvidenceType] = useState<"interview" | "landing_page" | "survey" | "pre_sale">("interview");
  const [sourceName, setSourceName] = useState("");
  const [description, setDescription] = useState("");
  const [strength, setStrength] = useState<"low" | "medium" | "high">("medium");

  const activeIdea = ideas.find((i) => i.id === activeIdeaId);
  const activeIdeaExps = experiments.filter((e) => e.ideaId === activeIdeaId);

  // Dynamic Confidence Scoring calculation
  // Base score: 20
  // Validated experiment: +25%
  // High strength evidence: +10%
  // Medium strength evidence: +5%
  // Invalidated experiment: -15%
  const calculateConfidence = () => {
    let score = 20;
    activeIdeaExps.forEach((exp) => {
      if (exp.status === "completed") {
        if (exp.result === "validated") score += 25;
        if (exp.result === "invalidated") score -= 15;
      }
    });
    
    // Add evidence weights
    const ideaEvidences = evidence.filter(ev => {
      const exp = experiments.find(x => x.id === ev.experimentId);
      return exp && exp.ideaId === activeIdeaId;
    });
    
    ideaEvidences.forEach((ev) => {
      if (ev.strength === "high") score += 10;
      if (ev.strength === "medium") score += 5;
    });

    return Math.max(0, Math.min(score, 100));
  };

  const currentScore = calculateConfidence();

  // Update original idea readiness score when confidence updates
  React.useEffect(() => {
    if (activeIdea && activeIdea.readinessScore !== currentScore) {
      updateIdea(activeIdea.id!, { readinessScore: currentScore });
    }
  }, [currentScore, activeIdea, updateIdea]);

  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !hypothesis || !metric || !target || !activeIdeaId) return;

    addExperiment({
      id: `exp-${Date.now()}`,
      ideaId: activeIdeaId,
      title: expTitle,
      hypothesis,
      metricToTrack: metric,
      targetValue: target,
      status: "pending",
      result: "inconclusive",
      notes: ""
    });

    setExpTitle("");
    setHypothesis("");
    setMetric("");
    setTarget("");
    setShowAddExp(false);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpId || !sourceName || !description) return;

    addEvidence({
      id: `ev-${Date.now()}`,
      experimentId: selectedExpId,
      type: evidenceType,
      sourceName,
      description,
      strength
    });

    setSourceName("");
    setDescription("");
    setShowAddEvidence(false);
  };

  const handleCompleteExperiment = (expId: string, result: "validated" | "invalidated") => {
    updateExperiment(expId, {
      status: "completed",
      result
    });
  };

  const handleRunExperiment = (expId: string) => {
    updateExperiment(expId, { status: "running" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Validation OS</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Convert assumptions into tangible evidence. Run experiments, log discoveries, and audit your go/pivot confidence.
        </p>
      </div>

      {activeIdea ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Main Left: Experiments Board */}
          <div className="col-span-2 space-y-6">
            {/* Experiment tracker card */}
            <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Validation Sprints & Experiments
                </h3>
                <button
                  onClick={() => setShowAddExp(!showAddExp)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Plus size={12} /> Add Experiment
                </button>
              </div>

              {showAddExp && (
                <form onSubmit={handleAddExperiment} className="bg-neutral-50 p-4 rounded-xl mb-4 space-y-3 text-xs border border-neutral-200">
                  <h4 className="font-bold text-neutral-700">New Experiment Sprint</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Title</label>
                      <input 
                        type="text" value={expTitle} onChange={e => setExpTitle(e.target.value)}
                        placeholder="e.g. Landing Page Waitlist"
                        className="w-full border border-neutral-200 p-2 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Metric to Track</label>
                      <input 
                        type="text" value={metric} onChange={e => setMetric(e.target.value)}
                        placeholder="e.g. Waitlist Signups rate"
                        className="w-full border border-neutral-200 p-2 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Hypothesis</label>
                    <input 
                      type="text" value={hypothesis} onChange={e => setHypothesis(e.target.value)}
                      placeholder="e.g. If we run target searches, we will convert > 12% waits."
                      className="w-full border border-neutral-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Target Value</label>
                    <input 
                      type="text" value={target} onChange={e => setTarget(e.target.value)}
                      placeholder="e.g. 50 Waitlists"
                      className="w-full border border-neutral-200 p-2 rounded bg-white"
                    />
                  </div>
                  <button type="submit" className="bg-brand-600 text-white px-3 py-1.5 rounded font-semibold text-[11px]">
                    Create Experiment
                  </button>
                </form>
              )}

              {/* List */}
              <div className="space-y-3">
                {activeIdeaExps.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    No experiments configured for this idea. Click "Add Experiment" or request AI suggestions in the sidebar.
                  </div>
                ) : (
                  activeIdeaExps.map((exp) => (
                    <div key={exp.id} className="border border-neutral-100 p-3.5 rounded-xl flex items-start justify-between bg-neutral-50/50">
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-800 text-xs">{exp.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            exp.status === "completed" 
                              ? (exp.result === "validated" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")
                              : (exp.status === "running" ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-500")
                          }`}>
                            {exp.status === "completed" ? exp.result : exp.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500"><strong className="text-neutral-600">Hypothesis:</strong> {exp.hypothesis}</p>
                        <p className="text-[10px] text-neutral-400"><strong className="text-neutral-500">Metric:</strong> {exp.metricToTrack} (Target: {exp.targetValue})</p>
                      </div>

                      <div className="flex gap-1.5">
                        {exp.status === "pending" && (
                          <button
                            onClick={() => handleRunExperiment(exp.id!)}
                            className="bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Play size={10} /> Start
                          </button>
                        )}
                        {exp.status === "running" && (
                          <>
                            <button
                              onClick={() => handleCompleteExperiment(exp.id!, "validated")}
                              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                            >
                              <CheckCircle2 size={10} /> Validate
                            </button>
                            <button
                              onClick={() => handleCompleteExperiment(exp.id!, "invalidated")}
                              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                            >
                              <XCircle size={10} /> Fail
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Evidence & discovery logs card */}
            <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Evidence Discovery Logs
                </h3>
                {activeIdeaExps.length > 0 && (
                  <button
                    onClick={() => setShowAddEvidence(!showAddEvidence)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <Plus size={12} /> Log Evidence
                  </button>
                )}
              </div>

              {showAddEvidence && (
                <form onSubmit={handleAddEvidence} className="bg-neutral-50 p-4 rounded-xl mb-4 space-y-3 text-xs border border-neutral-200">
                  <h4 className="font-bold text-neutral-700">Attach Evidence Record</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Link Experiment</label>
                      <select 
                        value={selectedExpId} onChange={e => setSelectedExpId(e.target.value)}
                        className="w-full border border-neutral-200 p-2 rounded bg-white text-xs"
                      >
                        <option value="">Select Experiment</option>
                        {activeIdeaExps.map(x => (
                          <option key={x.id} value={x.id}>{x.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Evidence Type</label>
                      <select 
                        value={evidenceType} onChange={e => setEvidenceType(e.target.value as any)}
                        className="w-full border border-neutral-200 p-2 rounded bg-white text-xs"
                      >
                        <option value="interview">Interview Note</option>
                        <option value="landing_page">Landing Page Waitlist</option>
                        <option value="survey">Survey Response</option>
                        <option value="pre_sale">Commitment Pre-sale</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Signal Strength</label>
                      <select 
                        value={strength} onChange={e => setStrength(e.target.value as any)}
                        className="w-full border border-neutral-200 p-2 rounded bg-white text-xs"
                      >
                        <option value="low">Low Signal</option>
                        <option value="medium">Medium Signal</option>
                        <option value="high">High Signal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Source (e.g. Person, Link URL)</label>
                    <input 
                      type="text" value={sourceName} onChange={e => setSourceName(e.target.value)}
                      placeholder="e.g. Mark Robinson, Lead Chef"
                      className="w-full border border-neutral-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold mb-1 block">Verbatim Description / Summary</label>
                    <textarea 
                      value={description} onChange={e => setDescription(e.target.value)}
                      rows={2}
                      placeholder="e.g. Chef confirmed commissions above 15% are breaking point. Very interested in Direct Delivery model."
                      className="w-full border border-neutral-200 p-2 rounded bg-white"
                    />
                  </div>
                  <button type="submit" className="bg-brand-600 text-white px-3 py-1.5 rounded font-semibold text-[11px]">
                    Record Evidence Log
                  </button>
                </form>
              )}

              {/* Evidence grid */}
              <div className="grid grid-cols-2 gap-4">
                {evidence.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-neutral-400">
                    No concrete evidence documents attached. Log discovery call outcomes above to boost score metrics.
                  </div>
                ) : (
                  evidence.map((ev) => (
                    <div key={ev.id} className="border border-neutral-100 p-3.5 rounded-xl bg-white shadow-sm space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-600 uppercase bg-brand-50 px-1.5 py-0.5 rounded">
                          {ev.type}
                        </span>
                        <span className={`text-[9px] font-semibold px-1 rounded uppercase ${
                          ev.strength === "high" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-50 text-neutral-600"
                        }`}>
                          {ev.strength} signal
                        </span>
                      </div>
                      <h4 className="font-bold text-neutral-700 text-xs">{ev.sourceName}</h4>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">{ev.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Confidence score and decision board */}
          <div className="space-y-6">
            {/* Confidence Score Display Gauge */}
            <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft text-center space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Evidence Confidence Score
              </h3>
              
              <div className="relative inline-flex items-center justify-center p-2.5">
                {/* Circular indicator simulation */}
                <div className="h-28 w-28 rounded-full border-8 border-neutral-100 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-neutral-800">{currentScore}%</span>
                    <span className="text-[9px] text-neutral-400 block font-semibold uppercase mt-0.5">Confidence</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-500 leading-relaxed px-2">
                {currentScore < 40 ? (
                  <span>⚠️ Confidence is low. Run landing page signups or conduct co-founder audits. Needs more high signal evidence.</span>
                ) : currentScore >= 40 && currentScore < 60 ? (
                  <span>📊 Medium confidence. Validating hypotheses. Ready to log interview notes or conduct surveys.</span>
                ) : (
                  <span>🎉 Strong validation! Your readiness satisfies standard investor and incubation requirements. Ready to spin up.</span>
                )}
              </div>
            </div>

            {/* Audit / Decision Controls */}
            <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Validation Decision Audit
              </h3>
              
              <div className="space-y-2 text-xs">
                <button
                  disabled={currentScore < 50}
                  className="w-full bg-brand-600 text-white p-2.5 rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🚀 Recommend GO (Form Startup)
                </button>
                <button
                  className="w-full bg-amber-50 text-amber-800 border border-amber-200 p-2.5 rounded-xl font-bold hover:bg-amber-100 transition"
                >
                  🔄 Recommend PIVOT (New Idea Version)
                </button>
                <button
                  className="w-full bg-rose-50 text-rose-800 border border-rose-200 p-2.5 rounded-xl font-bold hover:bg-rose-100 transition"
                >
                  🛑 Recommend KILL (Archive Concept)
                </button>
              </div>

              <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Requires Audit Trail</span>
                <span className="font-semibold text-emerald-600">Locked and Signed</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 p-12 rounded-2xl text-center shadow-soft">
          <span className="text-xs text-neutral-400">Capture a concept in Idea OS before configuring experiments.</span>
        </div>
      )}
    </div>
  );
}
