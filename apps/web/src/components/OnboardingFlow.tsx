"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForgeStore } from "@/stores/useStore";
import { UserRole } from "@project-forge/validation";
import {
  Rocket,
  Code2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  GitBranch,
  Building2,
  Users,
  Zap,
  DollarSign,
  MapPin,
  Layers
} from "lucide-react";

const ROLES = [
  {
    role: "founder" as UserRole,
    title: "Founder / Entrepreneur",
    desc: "Build your startup, validate ideas, recruit builders and raise capital.",
    icon: Rocket,
    color: "text-purple-600",
    bg: "bg-purple-50",
    selectedBorder: "border-purple-600",
    checkColor: "text-purple-600"
  },
  {
    role: "builder" as UserRole,
    title: "Developer / Designer / Builder",
    desc: "Join missions, build software for equity and track your projects.",
    icon: Code2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    selectedBorder: "border-emerald-500",
    checkColor: "text-emerald-600"
  },
  {
    role: "investor" as UserRole,
    title: "Angel / VC Investor",
    desc: "Discover validated startups, review decks and syndicate capital.",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
    selectedBorder: "border-blue-500",
    checkColor: "text-blue-600"
  }
];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 })
};

export default function OnboardingFlow() {
  const { showOnboardingModal, setShowOnboardingModal, completeOnboarding, currentUser, isLoading, errorMessage } =
    useForgeStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (currentUser?.role === "founder" || currentUser?.role === "builder" || currentUser?.role === "investor")
      ? currentUser.role
      : "founder"
  );

  // Founder fields
  const [startupName, setStartupName] = useState("");
  const [industry, setIndustry] = useState("B2B SaaS");
  const [stage, setStage] = useState("formation");
  const [teamSize, setTeamSize] = useState(1);
  const [fundingStage, setFundingStage] = useState("Pre-Seed");

  // Builder fields
  const [primarySkills, setPrimarySkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (3–5 yrs)");
  const [techStack, setTechStack] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [availability, setAvailability] = useState("Full-time");

  // Investor fields
  const [investorType, setInvestorType] = useState("Angel");
  const [preferredIndustries, setPreferredIndustries] = useState("");
  const [preferredStages, setPreferredStages] = useState("Pre-Seed, Seed");
  const [checkSize, setCheckSize] = useState("$25k – $100k");
  const [geographicFocus, setGeographicFocus] = useState("North America & Remote");

  if (!showOnboardingModal) return null;

  const goToStep2 = () => { setDirection(1); setStep(2); };
  const goToStep1 = () => { setDirection(-1); setStep(1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: any = {
      role: selectedRole,
      ...(selectedRole === "founder" && { startupName, industry, stage, teamSize, fundingStage }),
      ...(selectedRole === "builder" && { primarySkills, experienceLevel, techStack, portfolioLink, availability }),
      ...(selectedRole === "investor" && { investorType, preferredIndustries, preferredStages, checkSize, geographicFocus })
    };
    await completeOnboarding(profileData);
    setShowOnboardingModal(false);
  };

  const inputCls =
    "w-full border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-purple-500 focus:outline-none p-3 rounded-xl text-neutral-900 text-sm placeholder:text-neutral-400 transition";
  const selectCls =
    "w-full border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-purple-500 focus:outline-none p-3 rounded-xl text-neutral-900 text-sm transition";
  const labelCls = "block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-purple-600/20">
            F
          </div>
          <span className="font-extrabold text-neutral-900 tracking-tight">PROJECT FORGE</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= s ? "bg-purple-600 w-8" : "bg-neutral-200 w-4"
              }`}
            />
          ))}
          <span className="text-xs text-neutral-400 font-semibold ml-1">Step {step} of 2</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-purple-100/50 via-purple-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <div className="text-center mb-8">
                  <span className="inline-block text-[11px] bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200 mb-4">
                    Account Setup · Step 1 of 2
                  </span>
                  <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                    What best describes you?
                  </h1>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    Choose your primary role. This sets your workspace environment and tools.
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {ROLES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <motion.button
                        key={item.role}
                        type="button"
                        onClick={() => setSelectedRole(item.role)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between bg-white ${
                          isSelected
                            ? `${item.selectedBorder} shadow-md`
                            : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                            <Icon size={21} className={item.color} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                            <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={20} className={`${item.checkColor} shrink-0 ml-3`} />}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  onClick={goToStep2}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-2"
                >
                  Continue to Profile Setup <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <div className="text-center mb-8">
                  <span className="inline-block text-[11px] bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200 mb-4">
                    Account Setup · Step 2 of 2
                  </span>
                  <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                    Complete your{" "}
                    <span className="text-purple-600 capitalize">{selectedRole}</span> profile
                  </h1>
                  <p className="text-sm text-neutral-500 mt-2">
                    Help us personalise your workspace and match you with the right people.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 space-y-4">

                    {/* FOUNDER */}
                    {selectedRole === "founder" && (
                      <>
                        <div>
                          <label className={labelCls}><Building2 size={11} className="inline mr-1" />Startup / Company Name</label>
                          <input type="text" required value={startupName} onChange={e => setStartupName(e.target.value)} placeholder="e.g. Forge Systems Inc." className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}><Layers size={11} className="inline mr-1" />Industry</label>
                            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="B2B SaaS" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}><Zap size={11} className="inline mr-1" />Startup Stage</label>
                            <select value={stage} onChange={e => setStage(e.target.value)} className={selectCls}>
                              <option value="ideation">Ideation</option>
                              <option value="validation">Validation</option>
                              <option value="formation">Formation</option>
                              <option value="growth">Growth</option>
                              <option value="scale">Scale</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}><Users size={11} className="inline mr-1" />Team Size</label>
                            <input type="number" min={1} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}><DollarSign size={11} className="inline mr-1" />Funding Stage</label>
                            <select value={fundingStage} onChange={e => setFundingStage(e.target.value)} className={selectCls}>
                              <option value="Bootstrapped">Bootstrapped</option>
                              <option value="Pre-Seed">Pre-Seed</option>
                              <option value="Seed">Seed</option>
                              <option value="Series A">Series A</option>
                              <option value="Series B+">Series B+</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* BUILDER */}
                    {selectedRole === "builder" && (
                      <>
                        <div>
                          <label className={labelCls}><Zap size={11} className="inline mr-1" />Primary Skills</label>
                          <input type="text" required value={primarySkills} onChange={e => setPrimarySkills(e.target.value)} placeholder="TypeScript, React, Node.js" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Experience Level</label>
                            <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className={selectCls}>
                              <option value="Junior (0–2 yrs)">Junior (0–2 yrs)</option>
                              <option value="Mid-level (3–5 yrs)">Mid-level (3–5 yrs)</option>
                              <option value="Senior (5–8 yrs)">Senior (5–8 yrs)</option>
                              <option value="Lead / Principal (8+ yrs)">Lead / Principal (8+ yrs)</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Availability</label>
                            <select value={availability} onChange={e => setAvailability(e.target.value)} className={selectCls}>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Freelance / Contract">Freelance / Contract</option>
                              <option value="Not available">Not available</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}><Layers size={11} className="inline mr-1" />Tech Stack</label>
                          <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="Next.js, Supabase, Tailwind, Python" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}><GitBranch size={11} className="inline mr-1" />GitHub / Portfolio URL</label>
                          <input type="url" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="https://github.com/username" className={inputCls} />
                        </div>
                      </>
                    )}

                    {/* INVESTOR */}
                    {selectedRole === "investor" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Investor Type</label>
                            <select value={investorType} onChange={e => setInvestorType(e.target.value)} className={selectCls}>
                              <option value="Angel">Angel Investor</option>
                              <option value="VC">Venture Capital (VC)</option>
                              <option value="Syndicate">Syndicate Lead</option>
                              <option value="Family Office">Family Office</option>
                              <option value="Corporate VC">Corporate VC</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}><DollarSign size={11} className="inline mr-1" />Typical Cheque Size</label>
                            <select value={checkSize} onChange={e => setCheckSize(e.target.value)} className={selectCls}>
                              <option value="<$25k">{"< $25k"}</option>
                              <option value="$25k – $100k">$25k – $100k</option>
                              <option value="$100k – $500k">$100k – $500k</option>
                              <option value="$500k – $2M">$500k – $2M</option>
                              <option value="$2M+">$2M+</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}><Layers size={11} className="inline mr-1" />Preferred Industries</label>
                          <input type="text" value={preferredIndustries} onChange={e => setPreferredIndustries(e.target.value)} placeholder="AI / ML, Developer Tools, B2B SaaS" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}><TrendingUp size={11} className="inline mr-1" />Investment Stages</label>
                            <input type="text" value={preferredStages} onChange={e => setPreferredStages(e.target.value)} placeholder="Pre-Seed, Seed" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}><MapPin size={11} className="inline mr-1" />Geographic Focus</label>
                            <input type="text" value={geographicFocus} onChange={e => setGeographicFocus(e.target.value)} placeholder="North America & Remote" className={inputCls} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="button" onClick={goToStep1}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="w-1/3 border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft size={15} /> Back
                    </motion.button>
                    <motion.button
                      type="submit" disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
                      className="w-2/3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-2"
                    >
                      {isLoading
                        ? <Loader2 className="animate-spin" size={16} />
                        : <><span>Complete Setup & Enter Forge</span><ArrowRight size={15} /></>
                      }
                    </motion.button>
                  </div>

                  {errorMessage && (
                    <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                      {errorMessage}
                    </div>
                  )}
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
        <span>© 2025 Project Forge. All rights reserved.</span>
        <span>Your data is encrypted and securely stored.</span>
      </div>
    </div>
  );
}