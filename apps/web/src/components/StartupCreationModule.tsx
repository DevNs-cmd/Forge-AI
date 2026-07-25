"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { PlusCircle, Award, CheckSquare, Plus, Building2, Users2, Shield } from "lucide-react";

export default function StartupCreationModule() {
  const { ideas, addStartup, setActiveStartupId, setActiveContext, setActiveModule, startups } = useForgeStore();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIdeaId, setSelectedIdeaId] = useState("");

  const [founderShare, setFounderShare] = useState(60);
  const [coFounderShare, setCoFounderShare] = useState(40);

  const handleCreateStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !industry || !description) {
      alert("Please fill in all company information fields.");
      return;
    }

    const newStartupId = `startup-${Date.now()}`;
    
    addStartup({
      id: newStartupId,
      name: companyName,
      industry,
      description,
      stage: "formation",
      createdBy: "user-123"
    });

    setActiveStartupId(newStartupId);
    setActiveContext("company");
    setActiveModule("founder-os");

    alert(`🎉 Congratulations! '${companyName}' has been successfully incorporated. We have provisioned your secure Company Workspace!`);
  };

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Startup Incorporation OS</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Transform a validated concept and founding cap table into a structured company entity.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Incorporation Wizard */}
        <div className="col-span-2 bg-white border border-neutral-100 p-6 rounded-2xl shadow-soft">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Incorporate New Entity
          </h3>
          
          <form onSubmit={handleCreateStartup} className="space-y-4 text-xs">
            {/* Link validated idea */}
            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">
                Link Validated Idea Draft
              </label>
              <select
                value={selectedIdeaId}
                onChange={(e) => {
                  setSelectedIdeaId(e.target.value);
                  const idea = ideas.find(i => i.id === e.target.value);
                  if (idea) {
                    setCompanyName(idea.title);
                    setIndustry(idea.targetMarket || "");
                    setDescription(idea.oneLiner);
                  }
                }}
                className="w-full border border-neutral-200 p-2.5 rounded-lg bg-neutral-50/50 focus:outline-none focus:border-brand-500 text-xs"
              >
                <option value="">Select Validated Idea</option>
                {ideas.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} (Readiness: {i.readinessScore}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Company Registered Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. DirectFarm Logistics Inc."
                  className="w-full border border-neutral-200 p-2.5 rounded-lg bg-neutral-50/50 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Primary Market Niche</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. B2B Agri-Logistics"
                  className="w-full border border-neutral-200 p-2.5 rounded-lg bg-neutral-50/50 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 block mb-1">Company Mandate / Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly state your core mission and delivery values..."
                className="w-full border border-neutral-200 p-2.5 rounded-lg bg-neutral-50/50 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Cap table split simulator */}
            <div className="pt-4 border-t border-neutral-100">
              <h4 className="font-bold text-neutral-700 mb-3 flex items-center gap-1.5">
                <Users2 size={16} className="text-neutral-400" />
                Initial Equity Split Simulator
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">Founder Stake (You)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={founderShare}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFounderShare(val);
                        setCoFounderShare(100 - val);
                      }}
                      className="w-16 border border-neutral-200 p-1.5 rounded text-center text-xs"
                    />
                    <span className="font-bold text-neutral-700">%</span>
                  </div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">Co-Founder Stake</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={coFounderShare}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCoFounderShare(val);
                        setFounderShare(100 - val);
                      }}
                      className="w-16 border border-neutral-200 p-1.5 rounded text-center text-xs"
                    />
                    <span className="font-bold text-neutral-700">%</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Incorporate & Provision Workspace
            </button>
          </form>
        </div>

        {/* Right: Security & Entitlements information */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Workspace Provisioning
            </h3>
            <div className="space-y-3.5 text-xs text-neutral-600">
              <div className="flex items-start gap-2.5">
                <Shield size={16} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-800">RBAC Isolation System</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                    Local tables and secrets are automatically isolated behind role definitions. Only members assigned to this startup can edit strategy.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 size={16} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-800">Unified Company Graph</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                    Prior validation evidence, problem statements, and score matrices are securely locked and referenced inside your board documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active companies list */}
          {startups.length > 0 && (
            <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Incorporated Entities
              </h3>
              <div className="space-y-2.5">
                {startups.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 p-2 border border-neutral-100 rounded-lg hover:border-neutral-200">
                    <div className="h-6 w-6 rounded bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {st.name[0]}
                    </div>
                    <div className="text-xs text-left">
                      <span className="font-semibold text-neutral-800">{st.name}</span>
                      <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider">{st.stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
