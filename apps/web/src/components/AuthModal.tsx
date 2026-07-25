"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { UserRole } from "@project-forge/validation";
import { Lock, Mail, User, Sparkles, X, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

export default function AuthModal() {
  const { 
    showAuthModal, 
    authModalMode, 
    setShowAuthModal, 
    registerUser, 
    loginUser,
    isLoading 
  } = useForgeStore();

  const [mode, setMode] = useState<"login" | "register">(authModalMode || "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("founder");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (mode === "register") {
      if (!username || !email || !password || !fullName) {
        setFeedback({ type: "error", text: "Please complete all registration fields." });
        return;
      }
      const res = await registerUser({
        username,
        email,
        fullName,
        pass: password,
        role
      });

      if (!res.success) {
        setFeedback({ type: "error", text: res.message });
      } else {
        setFeedback({ type: "success", text: res.message });
      }
    } else {
      if (!username || !password) {
        setFeedback({ type: "error", text: "Please enter your username/email and password." });
        return;
      }
      const res = await loginUser(username, password);
      if (!res.success) {
        setFeedback({ type: "error", text: res.message });
      } else {
        setFeedback({ type: "success", text: res.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-soft-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm mb-2">
            F
          </div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            {mode === "login" ? "Welcome Back to Forge OS" : "Create Your Forge Account"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {mode === "login" 
              ? "Log in to access your startup workspace and matching pipelines." 
              : "Select your role to join founders, builders, investors, mentors, and admins."}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            feedback.type === "error" ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}>
            {feedback.type === "error" ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === "register" && (
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
              {mode === "register" ? "Username" : "Email or Username"}
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={mode === "register" ? "e.g. alex_rivera" : "Enter registered email or username"}
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 focus:outline-none focus:border-brand-500"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@forge.os"
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 focus:outline-none focus:border-brand-500"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Platform Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 text-xs font-semibold"
              >
                <option value="founder">Founder (Create Startups & Seek Funding)</option>
                <option value="builder">Builder (Apply to Missions & Code)</option>
                <option value="investor">Investor (Capital Pipeline & Syndicates)</option>
                <option value="mentor">Mentor (Review Startups & Advisory)</option>
                <option value="admin">Admin (System Moderation & Analytics)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (mode === "login" ? "Log In to Workspace" : "Register Account")}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          {mode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setFeedback(null); }} className="text-brand-600 font-bold hover:underline">
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button onClick={() => { setMode("login"); setFeedback(null); }} className="text-brand-600 font-bold hover:underline">
                Log in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
