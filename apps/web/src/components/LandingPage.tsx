"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import { 
  Rocket, 
  Sparkles, 
  Lightbulb, 
  Users, 
  Code2, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Star,
  Zap,
  Layers,
  Briefcase,
  DollarSign,
  HelpCircle,
  Mail,
  Building2,
  Globe,
  Award,
  Shield,
  Activity,
  Check
} from "lucide-react";

export default function LandingPage() {
  const { setShowAuthModal, setViewMode } = useForgeStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<"founder" | "builder" | "investor" | "mentor">("founder");
  const [activeDashTab, setActiveDashTab] = useState<"validation" | "matching" | "capital">("validation");

  // ── Razorpay ──────────────────────────────────────────────────────────────
  const { initiatePayment } = useRazorpay();
  const [payingPlan, setPayingPlan] = useState<string | null>(null);  // which plan is processing
  const [paidPlan, setPaidPlan] = useState<string | null>(null);       // which plan was paid
  const [payError, setPayError] = useState<string | null>(null);

  const handlePayment = (plan: string, planLabel: string, amountPaise: number) => {
    setPayingPlan(plan);
    setPayError(null);
    initiatePayment({
      plan,
      planLabel,
      amountPaise,
      onSuccess: (paymentId, orderId) => {
        console.log("✅ Payment success", { paymentId, orderId });
        setPaidPlan(plan);
        setPayingPlan(null);
        // TODO: call your backend to verify signature & provision access
      },
      onFailure: (error) => {
        if (error !== "Payment cancelled") setPayError(error);
        setPayingPlan(null);
      },
    });
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUND SUBTLE GRADIENT BLOBS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-100/60 via-purple-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-purple-100/40 blur-3xl -z-10 pointer-events-none" />

      {/* --- 1. STICKY NAVBAR --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode("landing")}>
          <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-md shadow-purple-600/20">
            F
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-neutral-900">PROJECT FORGE</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-purple-200">
              V3.0 LIGHT
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
          <a href="#home" className="hover:text-purple-600 transition">Home</a>
          <a href="#features" className="hover:text-purple-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-purple-600 transition">Marketplace</a>
          <a href="#roles" className="hover:text-purple-600 transition">About</a>
          <a href="#ai-copilot" className="hover:text-purple-600 transition">AI Copilot</a>
          <a href="#pricing" className="hover:text-purple-600 transition">Pricing</a>
          <a href="#contact" className="hover:text-purple-600 transition">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAuthModal(true, "login")}
            className="text-xs font-bold text-neutral-700 hover:text-purple-600 px-3.5 py-2 transition"
          >
            Log In
          </button>
          <button
            onClick={() => setShowAuthModal(true, "register")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition duration-200 flex items-center gap-1.5"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* --- 2. HERO SECTION --- */}
      <section id="home" className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-purple-700 shadow-sm">
          <Sparkles size={14} className="text-purple-600 animate-pulse" />
          <span>Autonomous Startup OS Powered by Groq Llama-3.3 70B & LangGraph</span>
        </div>

        {/* Large Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto text-neutral-900">
          The Operating System Where Early-Stage Startups Are <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Born, Validated & Funded</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Transform raw concepts into institutional-grade enterprises. Connect founders, builders, investors, and mentors inside a unified, AI-driven workspace.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowAuthModal(true, "register")}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center justify-center gap-2"
          >
            Get Started Free <Rocket size={16} />
          </button>
          <button
            onClick={() => setViewMode("app")}
            className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300/80 font-bold text-sm px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            Explore Live Workspace Demo
          </button>
        </div>

        {/* Floating Cards & Mock Dashboard Illustration */}
        <div className="relative mt-12 max-w-5xl mx-auto pt-4">
          {/* Main Dashboard Preview Card */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl shadow-2xl p-4 sm:p-6 text-left relative z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-neutral-400 ml-2">forge.os / analytics-dashboard</span>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Sync
              </span>
            </div>

            {/* Dashboard Content Mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">AI Validation Score</span>
                <div className="text-3xl font-black text-purple-700">88 / 100</div>
                <p className="text-xs text-neutral-600">High TAM confidence with low market adoption barrier.</p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Talent Pipeline</span>
                <div className="text-3xl font-black text-neutral-900">14 Candidates</div>
                <p className="text-xs text-neutral-600">4 Full Stack Engineers ready for equity match.</p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Capital Syndicated</span>
                <div className="text-3xl font-black text-emerald-600">$120,000</div>
                <p className="text-xs text-neutral-600">2 Accredited Angels allocated in current seed round.</p>
              </div>
            </div>
          </div>

          {/* Floating Role Cards */}
          <div className="hidden lg:block absolute -top-4 -left-12 bg-white border border-neutral-200 shadow-xl p-3.5 rounded-2xl text-left z-20 animate-bounce duration-1000">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Rocket size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Founder Match</span>
                <span className="text-[10px] text-neutral-500">Alex R. connected with Lead Engineer</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute -bottom-6 -right-10 bg-white border border-neutral-200 shadow-xl p-3.5 rounded-2xl text-left z-20">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Term Sheet Issued</span>
                <span className="text-[10px] text-neutral-500">$250k allocated by VC Syndicate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. TRUSTED BY SECTION --- */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-200/80 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            Empowering Next-Gen Innovators Across Leading Ecosystems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition duration-300">
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
              <Building2 size={18} className="text-purple-600" /> Student Innovators
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
              <Zap size={18} className="text-purple-600" /> YC & Techstars Founders
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
              <Globe size={18} className="text-purple-600" /> Global Angel Syndicates
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
              <Award size={18} className="text-purple-600" /> Venture Accelerators
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. FEATURES GRID --- */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Modular OS Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Everything Required to Build From Zero to Exit
          </h2>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
            Replace fragmented SaaS tools with one unified, light-themed workspace driven by real-time data and AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Idea Exchange",
              desc: "Submit concepts, gather community upvotes with 1-vote duplicate protection, and receive AI scores.",
              icon: Lightbulb
            },
            {
              title: "2. Founder Matching",
              desc: "AI candidate matching based on technical skills, equity preferences, and working compatibility.",
              icon: Users
            },
            {
              title: "3. Startup Blueprint",
              desc: "Automated entity creation, equity split architecture, and legal compliance structures.",
              icon: Rocket
            },
            {
              title: "4. Builder Marketplace",
              desc: "Recruit vetted developers and designers for equity, hourly missions, or milestone deliverables.",
              icon: Code2
            },
            {
              title: "5. Capital Pipeline",
              desc: "Connect directly with accredited angels and VC funds actively looking for validated concepts.",
              icon: TrendingUp
            },
            {
              title: "6. Data Intelligence OS",
              desc: "Real-time MRR tracking, valuation benchmarks, cohort retention, and market growth analytics.",
              icon: BarChart3
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-neutral-200/80 p-6 rounded-2xl space-y-3 hover:shadow-xl hover:border-purple-300 transition duration-300 group"
              >
                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition duration-200">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{feat.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- 5. HOW FORGE WORKS (ANIMATED TIMELINE) --- */}
      <section id="how-it-works" className="py-20 bg-neutral-50 border-y border-neutral-200/80 px-6">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Structured Timeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">How FORGE Accelerates Your Venture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {[
              { step: "1", title: "Idea", desc: "Post concept" },
              { step: "2", title: "Validation", desc: "Groq AI score" },
              { step: "3", title: "Team Building", desc: "Recruit talent" },
              { step: "4", title: "Funding", desc: "Raise capital" },
              { step: "5", title: "Growth", desc: "Track MRR" },
              { step: "6", title: "Scale", desc: "Expand market" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm text-center space-y-2 hover:border-purple-400 transition">
                <div className="h-9 w-9 rounded-full bg-purple-600 text-white font-extrabold text-xs mx-auto flex items-center justify-center shadow-md">
                  {item.step}
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">{item.title}</h4>
                <p className="text-[11px] text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. ROLE SECTIONS --- */}
      <section id="roles" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Role-Tailored Workspaces
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Built for Every Persona in the Ecosystem</h2>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex justify-center gap-2 max-w-md mx-auto bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
          {(["founder", "builder", "investor", "mentor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRoleTab(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeRoleTab === r ? "bg-white text-purple-700 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Role Content Card */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 shadow-xl max-w-4xl mx-auto space-y-6 text-left">
          {activeRoleTab === "founder" && (
            <div className="space-y-4">
              <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">For Founders</span>
              <h3 className="text-2xl font-bold text-neutral-900">Validate Fast, Build Team & Raise Capital</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-rose-600 uppercase mb-1">Problem</h4>
                  <p className="text-xs text-neutral-600">High churn, hard to find technical co-founders, long fundraising cycles.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase mb-1">Solution</h4>
                  <p className="text-xs text-neutral-600">Groq AI readiness scores, builder marketplace, and angel deal flow pipeline.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-purple-600 uppercase mb-1">Benefit</h4>
                  <p className="text-xs text-neutral-600">Launch 5x faster with full legal, team, and investor support.</p>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === "builder" && (
            <div className="space-y-4">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">For Builders</span>
              <h3 className="text-2xl font-bold text-neutral-900">Code for Equity & High Impact Missions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-rose-600 uppercase mb-1">Problem</h4>
                  <p className="text-xs text-neutral-600">Uncertain equity grants, unverified founders, fragmented freelance gigs.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase mb-1">Solution</h4>
                  <p className="text-xs text-neutral-600">Vetted startup projects, milestone escrow, and direct founder chat.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-purple-600 uppercase mb-1">Benefit</h4>
                  <p className="text-xs text-neutral-600">Earn equity and competitive cash rates on high-growth ventures.</p>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === "investor" && (
            <div className="space-y-4">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">For Investors</span>
              <h3 className="text-2xl font-bold text-neutral-900">Data-Driven Startup Diligence & Syndicates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-rose-600 uppercase mb-1">Problem</h4>
                  <p className="text-xs text-neutral-600">Noisy deal flow, manual pitch deck review, lack of real-time metrics.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase mb-1">Solution</h4>
                  <p className="text-xs text-neutral-600">AI pitch deck analysis, readiness scoring (0-100), and syndicate manager.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-purple-600 uppercase mb-1">Benefit</h4>
                  <p className="text-xs text-neutral-600">Co-invest with top angels with verified portfolio data tracking.</p>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === "mentor" && (
            <div className="space-y-4">
              <span className="bg-amber-100 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">For Mentors</span>
              <h3 className="text-2xl font-bold text-neutral-900">Guide Next-Gen Founders & Advisory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-rose-600 uppercase mb-1">Problem</h4>
                  <p className="text-xs text-neutral-600">Scheduling friction, unstructured feedback loops, unverified mentees.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase mb-1">Solution</h4>
                  <p className="text-xs text-neutral-600">Structured advisory queue, office hour scheduler, deck review hub.</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <h4 className="font-bold text-xs text-purple-600 uppercase mb-1">Benefit</h4>
                  <p className="text-xs text-neutral-600">Build a verified advisory track record with potential advisor equity.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- 7. AI COPILOT SECTION --- */}
      <section id="ai-copilot" className="py-20 bg-neutral-50 border-y border-neutral-200/80 px-6">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Autonomous AI Copilot
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Groq API & LangGraph Workflow Engine</h2>
            <p className="text-sm text-neutral-600 max-w-xl mx-auto">
              Real-time multi-agent execution for validation, market research, competitor analysis, and pitch readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Idea Validation Node</h4>
              <p className="text-xs text-neutral-600">Analyzes ICP pain points, TAM/SAM market size, and customer buying triggers.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BarChart3 size={20} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Risk Assessment Node</h4>
              <p className="text-xs text-neutral-600">Evaluates adoption friction, technical latency, and regulatory compliance risks.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Readiness Scoring Node</h4>
              <p className="text-xs text-neutral-600">Generates 0-100 validation score, experiment roadmap, and pitch deck improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. PRICING SECTION --- */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-12 text-center">
        <div className="space-y-3">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Pricing Plans (Coming Soon)</h2>
          <p className="text-xs text-neutral-500 max-w-lg mx-auto">
            Free forever for early founders during our Beta phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-white border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-sm relative">
            <h4 className="font-bold text-neutral-900 text-base">Starter Founder</h4>
            <div className="text-3xl font-extrabold text-neutral-900">$0 <span className="text-xs text-neutral-500 font-normal">/ month</span></div>
            <p className="text-xs text-neutral-500">Perfect for solo entrepreneurs validating first concepts.</p>
            <ul className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> 3 AI Idea Validations / month</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Access to Builder Marketplace</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Single-vote participation</li>
            </ul>
            <button onClick={() => setShowAuthModal(true, "register")} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs py-3 rounded-xl transition">
              Get Started Free
            </button>
            {payError && <p className="text-[10px] text-rose-500 text-center mt-1">{payError}</p>}
          </div>

          {/* Pro Founder */}
          <div className="bg-white border-2 border-purple-600 p-6 rounded-3xl space-y-4 shadow-xl relative">
            <span className="absolute -top-3 right-6 bg-purple-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
            <h4 className="font-bold text-neutral-900 text-base">Pro Founder</h4>
            <div className="text-3xl font-extrabold text-purple-700">$49 <span className="text-xs text-neutral-500 font-normal">/ month (Beta)</span></div>
            <p className="text-xs text-neutral-500">For startups actively recruiting & seeking investment.</p>
            <ul className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Unlimited Groq AI Validations</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Direct Capital Pipeline introductions</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Advanced Intelligence OS metrics</li>
            </ul>
            <button
              id="pay-pro-btn"
              disabled={!!payingPlan || paidPlan === "pro"}
              onClick={() => handlePayment("pro", "Pro Founder", 4900)}
              className={`w-full font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                paidPlan === "pro"
                  ? "bg-emerald-600 text-white cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              }`}
            >
              {payingPlan === "pro" ? (
                <><span className="animate-spin inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> Processing…</>
              ) : paidPlan === "pro" ? (
                "✅ Payment Successful!"
              ) : (
                "Subscribe — ₹49/mo (Test Mode)"
              )}
            </button>
            {payError && payingPlan !== "pro" && <p className="text-[10px] text-rose-500 text-center mt-1">{payError}</p>}
          </div>

          {/* Investor */}
          <div className="bg-white border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-sm relative">
            <h4 className="font-bold text-neutral-900 text-base">Investor & Syndicate</h4>
            <div className="text-3xl font-extrabold text-neutral-900">$199 <span className="text-xs text-neutral-500 font-normal">/ month</span></div>
            <p className="text-xs text-neutral-500">For angels, VCs, and syndicate leads matching deal flow.</p>
            <ul className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Full startup deal flow directory</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> AI pitch deck diligence reports</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Syndicate allocation manager</li>
            </ul>
            <button
              id="pay-investor-btn"
              disabled={!!payingPlan || paidPlan === "investor"}
              onClick={() => handlePayment("investor", "Investor & Syndicate", 19900)}
              className={`w-full font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 ${
                paidPlan === "investor"
                  ? "bg-emerald-600 text-white cursor-not-allowed"
                  : "bg-neutral-900 hover:bg-neutral-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              }`}
            >
              {payingPlan === "investor" ? (
                <><span className="animate-spin inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> Processing…</>
              ) : paidPlan === "investor" ? (
                "✅ Payment Successful!"
              ) : (
                "Subscribe — ₹199/mo (Test Mode)"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* --- 9. FAQ ACCORDION --- */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200/80 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI Validation score work?",
                a: "FORGE utilizes Groq Llama-3.3 70B & LangGraph multi-agent workflows to synthesize market size, target ICP pain points, competitor landscape, and operational risks into a 0-100 readiness score."
              },
              {
                q: "Is FORGE completely free during Public Beta?",
                a: "Yes! All 10 core modules, Supabase persistent storage, single voting, and AI analysis are completely free during our current public beta."
              },
              {
                q: "How is single voting enforced?",
                a: "Voting is tied directly to authenticated user IDs using unique PostgreSQL constraints (user_id + idea_id). Users can upvote once and toggle off their vote anytime."
              },
              {
                q: "Can I switch my role after registering?",
                a: "Yes, you can toggle between Founder, Builder, Investor, Mentor, and Admin modes seamlessly using the role switcher in the sidebar."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-sm text-neutral-900 flex items-center justify-between hover:bg-neutral-50 transition"
                >
                  <span>{item.q}</span>
                  {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 10. CONTACT SECTION --- */}
      <section id="contact" className="py-20 px-6 max-w-xl mx-auto space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Get In Touch
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-900">Contact the FORGE Team</h2>
          <p className="text-xs text-neutral-600">Have feedback or partnership requests? Send us a message.</p>
        </div>

        {contactSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold">
            ✓ Message received! We will respond within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-3.5 text-left bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-md">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full border border-neutral-200 p-3 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Message</label>
              <textarea
                required
                rows={3}
                placeholder="How can we help your startup?"
                className="w-full border border-neutral-200 p-3 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition">
              Send Message
            </button>
          </form>
        )}
      </section>

      {/* --- 11. FOOTER --- */}
      <footer className="border-t border-neutral-200 py-12 px-6 bg-neutral-50 text-neutral-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
              F
            </div>
            <span className="font-bold text-neutral-900 text-sm">PROJECT FORGE</span>
            <span className="text-[11px] text-neutral-500">© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex gap-6 text-neutral-600 font-semibold">
            <a href="#features" className="hover:text-purple-600 transition">Documentation</a>
            <a href="#roles" className="hover:text-purple-600 transition">Privacy</a>
            <a href="#pricing" className="hover:text-purple-600 transition">Terms</a>
            <a href="https://github.com/DevNs-cmd/Forge-AI.git" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
