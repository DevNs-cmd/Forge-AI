"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
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
  Globe
} from "lucide-react";

export default function LandingPage() {
  const { setShowAuthModal, setViewMode } = useForgeStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-brand-500 selection:text-white">
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode("landing")}>
          <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
            F
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">PROJECT FORGE</span>
            <span className="text-[10px] bg-brand-500/20 text-brand-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-brand-500/30">
              V3.0 AI
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#journeys" className="hover:text-white transition">Journeys</a>
          <a href="#ai-features" className="hover:text-white transition">AI Copilot</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAuthModal(true, "login")}
            className="text-xs font-bold text-neutral-300 hover:text-white px-3 py-2 transition"
          >
            Log In
          </button>
          <button
            onClick={() => setShowAuthModal(true, "register")}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg hover:shadow-brand-500/25 transition duration-200 flex items-center gap-1.5"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-400">
          <Sparkles size={14} className="animate-pulse text-brand-400" />
          <span>Powered by Groq Llama-3.3 70B & LangGraph Agent Architecture</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
          The Operating System Where Early-Stage Startups Are Born, Validated & Funded
        </h1>

        <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Transform raw ideas into validated enterprises. Connect founders, builders, investors, and mentors inside a single unified OS driven by autonomous AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setShowAuthModal(true, "register")}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-xl hover:shadow-brand-500/30 transition flex items-center justify-center gap-2"
          >
            Launch Your Startup Free <Rocket size={16} />
          </button>
          <button
            onClick={() => setViewMode("app")}
            className="w-full sm:w-auto border border-neutral-700 hover:border-neutral-500 bg-neutral-800/60 text-neutral-200 font-bold text-sm px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            Explore Live Workspace Demo
          </button>
        </div>

        {/* Live Metrics Counter */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left border-t border-neutral-800/80">
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-white">$14.2M+</span>
            <span className="block text-xs text-neutral-400 font-semibold mt-1">Capital Syndicated</span>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-brand-400">1,240+</span>
            <span className="block text-xs text-neutral-400 font-semibold mt-1">Validated Concepts</span>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-white">850+</span>
            <span className="block text-xs text-neutral-400 font-semibold mt-1">Vetted Builders</span>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">99.8%</span>
            <span className="block text-xs text-neutral-400 font-semibold mt-1">AI Score Accuracy</span>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-neutral-800">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">10 Core Operating Modules</span>
          <h2 className="text-3xl font-extrabold text-white">Everything You Need to Build From Zero to Exit</h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Replace 10 fragmented SaaS subscriptions with one seamless monorepo workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-base font-bold text-white">1. Idea Exchange</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Submit concepts, gather community upvotes, and get instant structured validation scores.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-white">2. Founder Matching</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AI-driven candidate matching based on technical skills, risk tolerance, and working style.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <Rocket size={20} />
            </div>
            <h3 className="text-base font-bold text-white">3. Startup Blueprint</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Automated entity creation, equity split architecture, and legal compliance structures.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <Code2 size={20} />
            </div>
            <h3 className="text-base font-bold text-white">4. Builder Marketplace</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Recruit vetted developers and designers for equity, hourly missions, or milestone deliverables.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-base font-bold text-white">5. Capital Pipeline</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Connect directly with accredited angels and VC firms actively searching for validated startups.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/50 transition">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-base font-bold text-white">6. Data Intelligence OS</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time MRR, valuation benchmarks, cohort retention, and market growth analytics.
            </p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-neutral-800">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Workflow Engine</span>
          <h2 className="text-3xl font-extrabold text-white">How FORGE Accelerates Your Startup</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-3 p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800">
            <span className="h-10 w-10 rounded-full bg-brand-600 text-white font-extrabold text-base mx-auto flex items-center justify-center">1</span>
            <h4 className="font-bold text-white text-sm">Post Your Concept</h4>
            <p className="text-xs text-neutral-400">Publish your problem statement and solution to the global exchange.</p>
          </div>

          <div className="space-y-3 p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800">
            <span className="h-10 w-10 rounded-full bg-brand-600 text-white font-extrabold text-base mx-auto flex items-center justify-center">2</span>
            <h4 className="font-bold text-white text-sm">Run AI Validation</h4>
            <p className="text-xs text-neutral-400">Groq API & LangGraph agents analyze market size, competitors, and risks.</p>
          </div>

          <div className="space-y-3 p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800">
            <span className="h-10 w-10 rounded-full bg-brand-600 text-white font-extrabold text-base mx-auto flex items-center justify-center">3</span>
            <h4 className="font-bold text-white text-sm">Assemble Team & Build</h4>
            <p className="text-xs text-neutral-400">Recruit technical co-founders and builders to execute validation experiments.</p>
          </div>

          <div className="space-y-3 p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800">
            <span className="h-10 w-10 rounded-full bg-brand-600 text-white font-extrabold text-base mx-auto flex items-center justify-center">4</span>
            <h4 className="font-bold text-white text-sm">Secure Capital</h4>
            <p className="text-xs text-neutral-400">Share your AI readiness report with syndicates and investors for funding.</p>
          </div>
        </div>
      </section>

      {/* --- ROLE JOURNEYS --- */}
      <section id="journeys" className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-neutral-800">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Tailored Experiences</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Every Persona in the Ecosystem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <span className="bg-brand-500/20 text-brand-400 text-xs font-bold px-3 py-1 rounded-full uppercase">For Founders</span>
            <h3 className="text-xl font-bold text-white">Validate Fast & Raise Capital</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Complete startup creation blueprint</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Automated LangGraph AI market analysis</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Direct access to syndicates and investor check sizes</li>
            </ul>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase">For Builders</span>
            <h3 className="text-xl font-bold text-white">Code for Equity & High Impact</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Browse curated missions and tech stacks</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Apply with equity + cash milestone preferences</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Direct messaging with verified founders</li>
            </ul>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase">For Investors</span>
            <h3 className="text-xl font-bold text-white">Data-Driven Startup Diligence</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> AI-generated readiness score (0-100)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Shortlist top startups & lead syndicates</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Track portfolio metrics in real-time</li>
            </ul>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase">For Mentors</span>
            <h3 className="text-xl font-bold text-white">Guide Next-Gen Entrepreneurs</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Review pitch decks & provide structured advisory</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Schedule 1-on-1 office hour sessions</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Build verified advisor portfolio rating</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION (COMING SOON) --- */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-neutral-800 text-center">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Simple Tiering</span>
          <h2 className="text-3xl font-extrabold text-white">Pricing Plans (Coming Soon)</h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">
            Free forever for early founders during our Beta phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4 relative">
            <h4 className="font-bold text-white text-base">Starter Founder</h4>
            <div className="text-2xl font-extrabold text-white">$0 <span className="text-xs text-neutral-400 font-normal">/ month</span></div>
            <p className="text-xs text-neutral-400">Perfect for solo entrepreneurs validating first concepts.</p>
            <ul className="space-y-2 text-xs text-neutral-300 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 3 Idea Validations / month</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Access to Builder Marketplace</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Single-vote participation</li>
            </ul>
            <button onClick={() => setShowAuthModal(true, "register")} className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs py-2.5 rounded-xl transition">
              Get Started Free
            </button>
          </div>

          {/* Growth */}
          <div className="bg-brand-950/40 border-2 border-brand-500 p-6 rounded-2xl space-y-4 relative">
            <span className="absolute -top-3 right-6 bg-brand-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Popular</span>
            <h4 className="font-bold text-white text-base">Pro Founder</h4>
            <div className="text-2xl font-extrabold text-brand-400">$49 <span className="text-xs text-neutral-400 font-normal">/ month (Coming Soon)</span></div>
            <p className="text-xs text-neutral-400">For startups actively recruiting & seeking investment.</p>
            <ul className="space-y-2 text-xs text-neutral-300 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Unlimited Groq AI Validations</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Direct Capital Pipeline introductions</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Advanced Intelligence OS metrics</li>
            </ul>
            <button onClick={() => setShowAuthModal(true, "register")} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 rounded-xl transition">
              Join Beta Waitlist
            </button>
          </div>

          {/* Investor */}
          <div className="bg-neutral-800/40 border border-neutral-800 p-6 rounded-2xl space-y-4 relative">
            <h4 className="font-bold text-white text-base">Investor & Syndicate</h4>
            <div className="text-2xl font-extrabold text-white">$199 <span className="text-xs text-neutral-400 font-normal">/ month (Coming Soon)</span></div>
            <p className="text-xs text-neutral-400">For angels, VCs, and syndicate leads matching deal flow.</p>
            <ul className="space-y-2 text-xs text-neutral-300 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Full startup deal flow directory</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> AI pitch deck diligence reports</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Syndicate allocation manager</li>
            </ul>
            <button onClick={() => setShowAuthModal(true, "register")} className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs py-2.5 rounded-xl transition">
              Request Investor Access
            </button>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8 border-t border-neutral-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the AI Validation score work?",
              a: "FORGE utilizes Groq Llama-3.3 70B & LangGraph multi-agent workflows to synthesize market size, target ICP pain points, competitor landscape, and operational risks into a 0-100 readiness score."
            },
            {
              q: "Can I use FORGE for free during Beta?",
              a: "Yes! All 10 core modules, Supabase persistent storage, and AI analysis are completely free for early founders during our current public beta."
            },
            {
              q: "How is voting duplicate prevention enforced?",
              a: "Voting is tied directly to authenticated user IDs using unique PostgreSQL constraints (user_id + idea_id). Users can upvote once and toggle off their vote anytime."
            },
            {
              q: "Can I switch my role after registering?",
              a: "Yes, you can toggle between Founder, Builder, Investor, Mentor, and Admin modes seamlessly using the role switcher in the sidebar."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-neutral-800/40 border border-neutral-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between hover:bg-neutral-800/60 transition"
              >
                <span>{item.q}</span>
                {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 px-6 max-w-xl mx-auto space-y-6 border-t border-neutral-800 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-2xl font-extrabold text-white">Contact the FORGE Team</h2>
          <p className="text-xs text-neutral-400">Have feedback or partnership requests? Send us a message.</p>
        </div>

        {contactSubmitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold">
            ✓ Message received! We will respond within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-3 text-left">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full bg-neutral-800 border border-neutral-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Message</label>
              <textarea
                required
                rows={3}
                placeholder="How can we help your startup?"
                className="w-full bg-neutral-800 border border-neutral-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition">
              Send Message
            </button>
          </form>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-neutral-800 py-12 px-6 bg-neutral-950 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white text-sm">
              F
            </div>
            <span className="font-bold text-white text-sm">PROJECT FORGE</span>
            <span className="text-[10px] text-neutral-600">© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex gap-6 text-neutral-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#journeys" className="hover:text-white transition">Journeys</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
