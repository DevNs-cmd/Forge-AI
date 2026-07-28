"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForgeStore } from "@/stores/useStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  Rocket, Sparkles, Lightbulb, Users, Code2, TrendingUp,
  BarChart3, CheckCircle2, ArrowRight, Star, Zap, Layers,
  DollarSign, ChevronDown, ChevronUp, Shield, Brain, Target,
  Network, Flame, Check, Play, ArrowUpRight, Menu, X,
  Loader2, BadgeCheck
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = end / (2000 / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= end) { setCount(end); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: null,
    priceLabel: "Free",
    perLabel: "forever",
    amountPaise: 0,
    highlight: false,
    badge: null,
    color: "text-neutral-700",
    btnClass: "bg-neutral-900 hover:bg-neutral-800 text-white",
    features: ["2 active ideas", "Basic AI validation (5/mo)", "Community matching", "Idea Exchange access", "1 workspace document"],
    cta: "Start for Free",
  },
  {
    id: "builder",
    name: "Builder",
    price: 2499,
    priceLabel: "₹2,499",
    perLabel: "/ month",
    amountPaise: 249900,
    highlight: true,
    badge: "Most Popular",
    color: "text-purple-700",
    btnClass: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-300",
    features: ["Unlimited ideas", "Full AI Copilot (unlimited)", "Priority smart matching", "Capital marketplace access", "Founder OS workspace", "Analytics & data intelligence"],
    cta: "Get Builder Plan",
  },
  {
    id: "syndicate",
    name: "Syndicate",
    price: 7999,
    priceLabel: "₹7,999",
    perLabel: "/ month",
    amountPaise: 799900,
    highlight: false,
    badge: null,
    color: "text-neutral-700",
    btnClass: "bg-neutral-900 hover:bg-neutral-800 text-white",
    features: ["Everything in Builder", "Investor deal flow access", "Syndicate co-investment", "Data room management", "White-label profiles", "Dedicated account support"],
    cta: "Get Syndicate Plan",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { setShowAuthModal, setViewMode } = useForgeStore();
  const { initiatePayment } = useRazorpay();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<"founder" | "builder" | "investor" | "mentor">("founder");

  // Payment state per plan
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [paidPlan, setPaidPlan] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Payment handler ──────────────────────────────────────────────────────────
  const handlePayment = (plan: typeof PLANS[number]) => {
    if (plan.amountPaise === 0) {
      setShowAuthModal(true, "register");
      return;
    }
    setPayingPlan(plan.id);
    setPayError(null);
    initiatePayment({
      plan: plan.id,
      planLabel: plan.name,
      amountPaise: plan.amountPaise,
      onSuccess: (paymentId, orderId) => {
        console.log("✅ Payment success", { paymentId, orderId });
        setPaidPlan(plan.id);
        setPayingPlan(null);
        // TODO: call backend to verify signature & provision plan access
      },
      onFailure: (error) => {
        if (error !== "Payment cancelled") setPayError(error);
        setPayingPlan(null);
      },
    });
  };

  // ── Data ─────────────────────────────────────────────────────────────────────
  const roles = {
    founder: {
      icon: <Rocket size={20} />, label: "Founders", tagline: "Launch faster with AI",
      accentBg: "bg-purple-600", accentText: "text-purple-600", accentLight: "bg-purple-50 border-purple-100",
      desc: "Validate ideas with AI, build pitch decks, recruit your dream team, and connect with investors — all from one workspace.",
      features: ["AI Idea Validation Engine", "One-click Pitch Deck Generator", "Startup Formation Toolkit", "Investor Deal Flow Access"],
    },
    builder: {
      icon: <Code2 size={20} />, label: "Builders", tagline: "Build. Earn. Grow.",
      accentBg: "bg-blue-600", accentText: "text-blue-600", accentLight: "bg-blue-50 border-blue-100",
      desc: "Discover high-equity missions, collaborate with top founders, and build your portfolio while earning competitive rates.",
      features: ["Verified Builder Profile", "Mission Marketplace", "Equity + Cash Compensation", "Reputation & Rating System"],
    },
    investor: {
      icon: <TrendingUp size={20} />, label: "Investors", tagline: "Find the next unicorn",
      accentBg: "bg-emerald-600", accentText: "text-emerald-600", accentLight: "bg-emerald-50 border-emerald-100",
      desc: "Access AI-scored deal flow, co-invest in syndicates, and get full transparency into startup traction before writing a check.",
      features: ["AI-Scored Deal Flow", "Syndicate Co-Investment", "Real-time Traction Data", "Portfolio Dashboard"],
    },
    mentor: {
      icon: <Brain size={20} />, label: "Mentors", tagline: "Shape the next generation",
      accentBg: "bg-amber-600", accentText: "text-amber-600", accentLight: "bg-amber-50 border-amber-100",
      desc: "Share your expertise with early-stage founders, earn equity or fees, and build your personal brand as a top operator.",
      features: ["Mentor Matching Engine", "Session Booking System", "Equity-for-Advice Model", "Mentor Leaderboard"],
    },
  };

  const features = [
    { icon: <Brain size={18} />, title: "AI Validation OS", desc: "Run market experiments, stress-test assumptions, and get an AI readiness score before spending a dollar.", accent: "bg-purple-50 text-purple-600 border-purple-100" },
    { icon: <Network size={18} />, title: "Smart Matching", desc: "Proprietary matching across founders, builders, investors and mentors — curated by role, skill, stage, and industry.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: <DollarSign size={18} />, title: "Capital Marketplace", desc: "Direct access to angels, VCs, and syndicates. Structure deals, share data rooms, and close funding rounds in-app.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <Code2 size={18} />, title: "Builder Marketplace", desc: "Hire vetted engineers, designers, and operators with transparent pricing, skills verification, and escrow payments.", accent: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { icon: <Layers size={18} />, title: "Founder OS", desc: "Full workspace with documents, tasks, team management, cap table, and investor updates — all integrated.", accent: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: <BarChart3 size={18} />, title: "Data Intelligence", desc: "Real-time analytics, market signals, and competitive benchmarks to keep founders ahead of the curve.", accent: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  const stats = [
    { value: 2400, suffix: "+", label: "Founders Onboarded" },
    { value: 180, suffix: "+", label: "Builders Available" },
    { value: 94, suffix: "%", label: "Match Satisfaction" },
    { value: 12, prefix: "$", suffix: "M+", label: "Capital Syndicated" },
  ];

  const steps = [
    { step: "01", title: "Sign Up & Onboard", desc: "Choose your role, complete a 2-minute profile, and let AI personalise your workspace instantly." },
    { step: "02", title: "Get Matched", desc: "Our engine surfaces the most relevant founders, builders, investors, or mentors for your specific goals." },
    { step: "03", title: "Collaborate & Build", desc: "Use the integrated workspace to co-build, validate ideas, and track progress in real time." },
    { step: "04", title: "Raise & Scale", desc: "Connect with capital through the marketplace, close deals, and scale your startup with confidence." },
  ];

  const faqs = [
    { q: "Is Forge free to start?", a: "Yes — join, complete onboarding, and explore the core platform for free. Paid plans unlock advanced AI features, capital marketplace, and priority matching." },
    { q: "How does the AI matching work?", a: "Our engine scores compatibility across role, skills, industry, stage, and goals. It runs continuously and surfaces new matches as the ecosystem grows." },
    { q: "Can I be both a Founder and a Builder?", a: "Absolutely. Switch roles anytime from Settings. Many members operate across multiple roles depending on the project." },
    { q: "Is my data and IP protected?", a: "Yes. All ideas, documents, and pitches are encrypted at rest and in transit. You control visibility — nothing is ever public without your consent." },
    { q: "How do syndicate investments work?", a: "Investors pool capital into structured syndicates to co-invest in startups. Forge provides legal templates, cap table management, and reporting tools." },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans overflow-x-hidden selection:bg-purple-100">

      {/* ── Background tint ───────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-100/70 via-purple-50/30 to-transparent blur-3xl" />
        <div className="absolute top-[50%] right-0 w-[400px] h-[400px] bg-indigo-100/40 blur-3xl rounded-full" />
      </div>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-neutral-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode("landing")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center font-black text-white text-lg shadow-md shadow-purple-200">
              F
            </div>
            <span className="font-black text-lg tracking-tight text-neutral-900">PROJECT FORGE</span>
            <span className="hidden sm:block text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">BETA</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-500">
            {[["#features", "Features"], ["#how-it-works", "How it Works"], ["#roles", "Roles"], ["#pricing", "Pricing"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-purple-600 transition-colors">{label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setShowAuthModal(true, "login")}
              className="text-sm font-semibold text-neutral-600 hover:text-purple-600 px-4 py-2 transition-colors">
              Log In
            </button>
            <button onClick={() => setShowAuthModal(true, "register")}
              className="text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-purple-200 transition-all flex items-center gap-1.5">
              Get Started <ArrowRight size={14} />
            </button>
          </div>

          <button className="md:hidden text-neutral-500 hover:text-neutral-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-4 space-y-2 shadow-lg">
            {["Features", "How it Works", "Roles", "Pricing", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block text-sm font-medium text-neutral-600 hover:text-purple-600 py-2"
                onClick={() => setMobileMenuOpen(false)}>{item}</a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-neutral-100">
              <button onClick={() => { setShowAuthModal(true, "login"); setMobileMenuOpen(false); }}
                className="w-full text-sm font-semibold text-neutral-700 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50">Log In</button>
              <button onClick={() => { setShowAuthModal(true, "register"); setMobileMenuOpen(false); }}
                className="w-full text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2.5 rounded-xl">Get Started Free</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 mb-7">
          <Sparkles size={13} className="text-purple-500" />
          Powered by Groq Llama-3.3 70B &amp; LangGraph Agentic AI
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6 text-neutral-900">
          The OS Where{" "}
          <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Startups Are Born</span>
          ,{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Validated</span>{" "}
          &amp;{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Funded.</span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10">
          One platform connecting founders, builders, investors, and mentors with AI-powered matching, validation, and collaboration tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={() => setShowAuthModal(true, "register")}
            className="w-full sm:w-auto group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-2">
            Start Building Free <Rocket size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <button onClick={() => setViewMode("app")}
            className="w-full sm:w-auto group text-neutral-700 hover:text-purple-600 font-semibold text-base px-8 py-4 rounded-2xl border border-neutral-200 hover:border-purple-200 bg-white hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Play size={15} className="fill-current" /> Explore Live Demo
          </button>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl shadow-neutral-200/80">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-100 bg-neutral-50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4 bg-white border border-neutral-200 rounded-lg px-3 py-1 text-xs text-neutral-400 text-left shadow-sm">
                app.projectforge.ai/dashboard
              </div>
            </div>
            {/* Content */}
            <div className="flex h-[400px]">
              {/* Sidebar */}
              <div className="w-14 bg-neutral-50 border-r border-neutral-100 flex flex-col items-center py-4 gap-3">
                {[Rocket, Lightbulb, Users, Code2, TrendingUp, Brain, BarChart3].map((Icon, i) => (
                  <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer
                    ${i === 0 ? "bg-purple-100 text-purple-600" : "text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100"}`}>
                    <Icon size={15} />
                  </div>
                ))}
              </div>
              {/* Main */}
              <div className="flex-1 p-6 bg-white overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">Forge Dashboard</h3>
                    <p className="text-neutral-400 text-xs">Welcome back, Founder</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI Active
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Idea Score", value: "87/100", cls: "bg-purple-50 border-purple-100 text-purple-700" },
                    { label: "Matches", value: "14 new", cls: "bg-blue-50 border-blue-100 text-blue-700" },
                    { label: "Investors", value: "3 active", cls: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                    { label: "Runway", value: "8 months", cls: "bg-amber-50 border-amber-100 text-amber-700" },
                  ].map((s) => (
                    <div key={s.label} className={`border rounded-xl p-3 ${s.cls}`}>
                      <div className="text-sm font-bold">{s.value}</div>
                      <div className="text-xs mt-0.5 opacity-60">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={13} className="text-purple-500" />
                      <span className="text-neutral-500 text-xs font-semibold">AI Validation Report</span>
                    </div>
                    {["Market Size", "Competition", "Timing"].map((item, i) => (
                      <div key={item} className="flex items-center justify-between mb-2">
                        <span className="text-neutral-400 text-xs">{item}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-16 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                              style={{ width: `${[82, 64, 91][i]}%` }} />
                          </div>
                          <span className="text-neutral-400 text-xs">{[82, 64, 91][i]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={13} className="text-blue-500" />
                      <span className="text-neutral-500 text-xs font-semibold">Top Matches</span>
                    </div>
                    {["Arjun K. — Full Stack", "Priya S. — Design", "Raj M. — Angel $50K"].map((name, i) => (
                      <div key={name} className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold
                          ${["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600"][i]}`}>
                          {name[0]}
                        </div>
                        <span className="text-neutral-500 text-xs">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-neutral-900 mb-1">
                <AnimatedCounter end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-sm text-neutral-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 mb-5">
            <Zap size={13} className="text-purple-500" /> Platform Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Everything to go from{" "}
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">zero to funded</span>
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">Six integrated modules, one cohesive OS for the entire startup lifecycle.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className="group bg-white border border-neutral-100 rounded-2xl p-6 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.accent} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-purple-600 transition-colors">
                Learn more <ArrowUpRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-700 mb-5">
              <Target size={13} className="text-emerald-500" /> Simple 4-Step Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
              From signup to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">funded in weeks</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-8px)] w-full h-px bg-gradient-to-r from-neutral-200 to-transparent z-10" />
                )}
                <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-300">
                  <div className="text-3xl font-black text-purple-200 mb-3">{step.step}</div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────────────────────────────── */}
      <section id="roles" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-700 mb-5">
            <Users size={13} className="text-blue-500" /> Built for Every Role
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Your role, your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">superpower</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(Object.keys(roles) as Array<keyof typeof roles>).map((role) => (
            <button key={role} onClick={() => setActiveRole(role)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${activeRole === role
                  ? `${roles[role].accentBg} text-white shadow-md`
                  : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-700"}`}>
              {roles[role].label}
            </button>
          ))}
        </div>
        <div className="max-w-4xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-xl shadow-neutral-100 overflow-hidden">
          <div className={`h-1.5 ${roles[activeRole].accentBg}`} />
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className={`w-12 h-12 rounded-xl ${roles[activeRole].accentLight} border flex items-center justify-center ${roles[activeRole].accentText} mb-4`}>
                  {roles[activeRole].icon}
                </div>
                <div className={`text-xs font-bold ${roles[activeRole].accentText} mb-1 uppercase tracking-wider`}>{roles[activeRole].tagline}</div>
                <h3 className="text-2xl font-black text-neutral-900 mb-3">For {roles[activeRole].label}</h3>
                <p className="text-neutral-500 leading-relaxed mb-6">{roles[activeRole].desc}</p>
                <button onClick={() => setShowAuthModal(true, "register")}
                  className={`inline-flex items-center gap-2 ${roles[activeRole].accentBg} text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all hover:opacity-90`}>
                  Join as {roles[activeRole].label.slice(0, -1)} <ArrowRight size={15} />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                {roles[activeRole].features.map((feat) => (
                  <div key={feat} className={`flex items-center gap-3 ${roles[activeRole].accentLight} border rounded-xl px-4 py-3`}>
                    <div className={`w-5 h-5 rounded-full ${roles[activeRole].accentBg} flex items-center justify-center flex-shrink-0`}>
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-neutral-700 text-sm font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI COPILOT ────────────────────────────────────────────────────── */}
      <section id="ai-copilot" className="py-24 px-6 bg-gradient-to-b from-purple-50/60 to-white border-y border-purple-100/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 mb-6">
              <Sparkles size={13} className="text-purple-500" /> Forge AI Copilot
            </div>
            <h2 className="text-4xl font-black text-neutral-900 mb-4">
              Your AI co-founder,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">always on.</span>
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed mb-8">
              Validate assumptions, generate pitch scripts, analyse competitors, draft investor emails — powered by Groq&apos;s blazing-fast Llama 3.3 70B.
            </p>
            {["Real-time market analysis & competitor mapping", "Pitch deck generation & AI feedback", "Investor outreach email drafting", "Legal & compliance guidance"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-neutral-600 mb-3">
                <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          {/* AI Chat Mock */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xl shadow-neutral-100">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-purple-50/50">
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Brain size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold text-neutral-900">Forge AI Copilot</span>
                <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              <div className="p-4 space-y-3 bg-neutral-50/50">
                {[
                  { from: "user", msg: "What&apos;s my market opportunity for B2B SaaS in India?" },
                  { from: "ai", msg: "The Indian B2B SaaS market is projected to reach $50B by 2030. Your target segment (SMEs) represents ~$8.2B TAM with a 34% CAGR. Here&apos;s how to position..." },
                  { from: "user", msg: "Who are my top 3 competitors?" },
                  { from: "ai", msg: "Your primary competitors are Zoho, Freshworks, and Chargebee. Key differentiation: AI-native workflows, regional language support, and SME-friendly pricing." },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] text-xs leading-relaxed px-3.5 py-2.5 rounded-xl
                      ${msg.from === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-neutral-600 border border-neutral-100 shadow-sm"}`}
                      dangerouslySetInnerHTML={{ __html: msg.msg }} />
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-400 placeholder-neutral-300 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-50"
                    placeholder="Ask your AI Copilot..." readOnly />
                  <button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-3 py-2 transition-colors">
                    <ArrowRight size={13} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-700 mb-5">
            <DollarSign size={13} className="text-emerald-500" /> Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Start free,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">scale when ready</span>
          </h2>
          <p className="text-neutral-400 text-base">No hidden fees. Cancel anytime.</p>
        </div>

        {/* Global pay error */}
        {payError && (
          <div className="max-w-md mx-auto mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl text-center">
            {payError}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div key={plan.id}
              className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300
                ${plan.highlight
                  ? "border-2 border-purple-500 shadow-2xl shadow-purple-100 scale-[1.02] bg-white"
                  : "border border-neutral-200 shadow-sm hover:shadow-md bg-white"}`}>
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold text-center py-1.5 tracking-wider">
                  {plan.badge}
                </div>
              )}
              <div className={`p-7 flex-1 ${plan.badge ? "pt-10" : ""}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.color}`}>{plan.name}</div>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-4xl font-black text-neutral-900">{plan.priceLabel}</span>
                  <span className="text-neutral-400 text-sm pb-1">{plan.perLabel}</span>
                </div>
                {plan.price && (
                  <p className="text-xs text-neutral-400 mb-5">Billed monthly · Cancel anytime</p>
                )}
                <div className="border-t border-neutral-100 my-5" />
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <Check size={15} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? "text-purple-500" : "text-neutral-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-7 pb-7">
                {paidPlan === plan.id ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2">
                    <BadgeCheck size={16} /> Payment Successful!
                  </div>
                ) : (
                  <button
                    onClick={() => handlePayment(plan)}
                    disabled={payingPlan === plan.id}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.btnClass}
                      ${payingPlan === plan.id ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {payingPlan === plan.id ? (
                      <><Loader2 size={15} className="animate-spin" /> Processing...</>
                    ) : (
                      <>{plan.cta} {plan.amountPaise > 0 && <ArrowRight size={14} />}</>
                    )}
                  </button>
                )}
                {plan.amountPaise > 0 && (
                  <p className="text-center text-xs text-neutral-300 mt-2.5 flex items-center justify-center gap-1">
                    <Shield size={10} /> Secured by Razorpay
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-neutral-900 mb-2">Loved by builders everywhere</h2>
            <p className="text-neutral-400">What our community is saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Arjun M.", role: "Founder, HealthTech startup", quote: "Forge helped me validate my idea, find a co-founder, and connect with my first angel investor — all in under 3 weeks. Nothing else comes close." },
              { name: "Priya K.", role: "Full Stack Builder", quote: "The mission marketplace is incredible. I landed two equity deals in my first month. The matching algorithm actually understands my skills." },
              { name: "Rahul S.", role: "Angel Investor", quote: "The deal flow quality is exceptional. AI-scored summaries save me hours of due diligence. I&apos;ve backed 4 startups through Forge this quarter." },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-100 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{t.name}</div>
                    <div className="text-xs text-neutral-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-neutral-900 mb-2">Frequently asked questions</h2>
          <p className="text-neutral-400">Everything you need to know about Project Forge</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-neutral-100 rounded-xl bg-white shadow-sm overflow-hidden">
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors">
                <span className="font-semibold text-neutral-800 text-sm">{faq.q}</span>
                {activeFaq === i
                  ? <ChevronUp size={16} className="text-neutral-400 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-neutral-400 flex-shrink-0" />}
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3 bg-neutral-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl px-8 py-14 text-center shadow-2xl shadow-purple-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-white/90 mb-6">
              <Flame size={13} className="text-orange-300" /> Limited Early Access
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Your startup journey starts here.
            </h2>
            <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
              Join 2,400+ founders building the next generation of startups on Project Forge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setShowAuthModal(true, "register")}
                className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-purple-700 font-bold px-10 py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base">
                Get Started Free <Rocket size={16} />
              </button>
              <button onClick={() => setShowAuthModal(true, "login")}
                className="w-full sm:w-auto text-white/80 hover:text-white font-semibold px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition-all text-base">
                Already have an account →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center font-black text-white text-base shadow-md shadow-purple-100">
                  F
                </div>
                <span className="font-black text-neutral-900">PROJECT FORGE</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">The AI-powered startup operating system. Build, validate, and fund your vision.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Platform", links: ["Founders", "Builders", "Investors", "Mentors"] },
                { title: "Company", links: ["About", "Blog", "Privacy", "Terms"] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="font-bold text-neutral-400 mb-3 text-xs uppercase tracking-wider">{col.title}</div>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-neutral-400 hover:text-purple-600 transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <span>© 2025 Project Forge. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <Shield size={11} className="text-neutral-300" /> Your data is encrypted &amp; secure
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
