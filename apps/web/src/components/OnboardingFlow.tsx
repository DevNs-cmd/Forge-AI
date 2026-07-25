"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { UserRole } from "@project-forge/validation";
import { Rocket, Code2, TrendingUp, Award, Shield, CheckCircle2, ArrowRight, X, Loader2 } from "lucide-react";

export default function OnboardingFlow() {
  const { 
    showOnboardingModal, 
    setShowOnboardingModal, 
    completeOnboarding, 
    currentUser,
    isLoading
  } = useForgeStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || "founder");

  // Founder fields
  const [startupName, setStartupName] = useState("");
  const [industry, setIndustry] = useState("B2B SaaS");
  const [stage, setStage] = useState("formation");
  const [location, setLocation] = useState("San Francisco, CA");
  const [goals, setGoals] = useState("Validate concept and recruit technical co-founder");

  // Builder fields
  const [primarySkills, setPrimarySkills] = useState("React, Node.js, TypeScript");
  const [experienceLevel, setExperienceLevel] = useState("5+ Years");
  const [portfolioLink, setPortfolioLink] = useState("https://github.com");
  const [equityPref, setEquityPref] = useState("Equity + Cash");

  // Investor fields
  const [checkSize, setCheckSize] = useState("$25k - $100k");
  const [preferredIndustries, setPreferredIndustries] = useState("AI, SaaS, Fintech");
  const [preferredStages, setPreferredStages] = useState("Pre-Seed, Seed");

  // Mentor fields
  const [domain, setDomain] = useState("Product Strategy & Fundraising");
  const [yearsExp, setYearsExp] = useState(8);
  const [availability, setAvailability] = useState("2 Hours / Week (Pro-Bono)");

  if (!showOnboardingModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: any = {
      role: selectedRole,
      location,
      ...(selectedRole === "founder" && { startupName, industry, stage, goals }),
      ...(selectedRole === "builder" && { primarySkills, experienceLevel, portfolioLink, equityPref }),
      ...(selectedRole === "investor" && { checkSize, preferredIndustries, preferredStages }),
      ...(selectedRole === "mentor" && { domain, yearsExp, availability })
    };

    await completeOnboarding(profileData);
    setShowOnboardingModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl shadow-2xl w-full max-w-xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] bg-brand-500/20 text-brand-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Step {step} of 2 • Account Setup
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            {step === 1 ? "Choose Your Role in FORGE" : `Complete Your ${selectedRole.toUpperCase()} Profile`}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {step === 1 
              ? "Select your primary role. This customizes your navigation, dashboard, and permissions." 
              : "Tell us a bit about your goals to tailor your workspace environment."}
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { role: "founder", title: "Founder / Entrepreneur", desc: "Create startups, validate ideas, recruit builders & seek funding.", icon: Rocket, color: "text-brand-400" },
                { role: "builder", title: "Developer / Designer / Builder", desc: "Apply to startup missions, build for equity & track assigned work.", icon: Code2, color: "text-emerald-400" },
                { role: "investor", title: "Angel / VC Investor", desc: "Browse validated startups, access AI pitch deck reports & invest.", icon: TrendingUp, color: "text-purple-400" },
                { role: "mentor", title: "Mentor / Advisor", desc: "Review pitch decks, offer advisory feedback & schedule 1-on-1 calls.", icon: Award, color: "text-amber-400" },
                { role: "admin", title: "Platform Administrator", desc: "Full platform overview, user moderation & system audit analytics.", icon: Shield, color: "text-rose-400" }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role as UserRole)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected 
                        ? "bg-brand-950/40 border-brand-500 shadow-md" 
                        : "bg-neutral-800/40 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={20} className="text-brand-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-4"
            >
              Continue to Profile Details <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: PROFILE DETAILS FORM */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {selectedRole === "founder" && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Startup / Company Name</label>
                  <input
                    type="text" required value={startupName} onChange={e => setStartupName(e.target.value)}
                    placeholder="e.g. Forge Systems Inc."
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Industry</label>
                    <input
                      type="text" value={industry} onChange={e => setIndustry(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Stage</label>
                    <select
                      value={stage} onChange={e => setStage(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white font-semibold"
                    >
                      <option value="ideation">Ideation</option>
                      <option value="validation">Validation</option>
                      <option value="formation">Formation</option>
                      <option value="growth">Growth</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedRole === "builder" && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Primary Tech Stack / Skills</label>
                  <input
                    type="text" required value={primarySkills} onChange={e => setPrimarySkills(e.target.value)}
                    placeholder="React, Next.js, Python, Supabase"
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Experience Level</label>
                    <input
                      type="text" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Equity Preference</label>
                    <select
                      value={equityPref} onChange={e => setEquityPref(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                    >
                      <option value="Equity + Cash">Equity + Cash</option>
                      <option value="Equity Only">Equity Only</option>
                      <option value="Cash Hourly Rate">Cash Hourly Rate</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedRole === "investor" && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Check Size Range</label>
                  <input
                    type="text" required value={checkSize} onChange={e => setCheckSize(e.target.value)}
                    placeholder="$25k - $100k"
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Preferred Sector Theses</label>
                  <input
                    type="text" value={preferredIndustries} onChange={e => setPreferredIndustries(e.target.value)}
                    placeholder="AI / ML, Developer Tools, B2B SaaS"
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                  />
                </div>
              </>
            )}

            {selectedRole === "mentor" && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Domain Expertise</label>
                  <input
                    type="text" required value={domain} onChange={e => setDomain(e.target.value)}
                    placeholder="Product Strategy, Go-To-Market, Seed Fundraising"
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Advisory Session Availability</label>
                  <input
                    type="text" value={availability} onChange={e => setAvailability(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Location</label>
              <input
                type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3 rounded-xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Complete Profile & Enter OS"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
