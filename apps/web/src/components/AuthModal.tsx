"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { sendPasswordResetEmail, updatePassword } from "@/services/supabaseService";
import { Lock, Mail, User, Sparkles, X, CheckCircle2, ShieldAlert, Loader2, KeyRound } from "lucide-react";

export default function AuthModal() {
  const { 
    showAuthModal, 
    authModalMode, 
    setShowAuthModal, 
    registerUser, 
    loginUser,
    isLoading 
  } = useForgeStore();

  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">(authModalMode || "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      if (mode === "register") {
        if (!username || !email || !password || !fullName) {
          setFeedback({ type: "error", text: "Please complete all registration fields." });
          setSubmitting(false);
          return;
        }
        const res = await registerUser({
          username,
          email,
          fullName,
          pass: password
        });

        if (!res.success) {
          setFeedback({ type: "error", text: res.message });
        } else {
          setFeedback({ type: "success", text: "Account created! Check your email inbox to verify your account." });
        }
      } else if (mode === "login") {
        if (!username || !password) {
          setFeedback({ type: "error", text: "Please enter your email or username and password." });
          setSubmitting(false);
          return;
        }
        const res = await loginUser(username, password);
        if (!res.success) {
          setFeedback({ type: "error", text: res.message });
        } else {
          setFeedback({ type: "success", text: res.message });
          setShowAuthModal(false);
        }
      } else if (mode === "forgot") {
        if (!email) {
          setFeedback({ type: "error", text: "Please enter your registered email address." });
          setSubmitting(false);
          return;
        }
        await sendPasswordResetEmail(email);
        setFeedback({ type: "success", text: "Password reset link sent! Check your email inbox for instructions." });
      } else if (mode === "reset") {
        if (!password || password.length < 6) {
          setFeedback({ type: "error", text: "Please choose a new password with at least 6 characters." });
          setSubmitting(false);
          return;
        }
        await updatePassword(password);
        setFeedback({ type: "success", text: "Your password has been updated! Please log in with your new password." });
        setTimeout(() => setMode("login"), 2500);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      const { signInWithGoogle } = await import("@/services/supabaseService");
      await signInWithGoogle();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Google sign in failed" });
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md mb-2">
            F
          </div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            {mode === "login" && "Welcome Back to Forge OS"}
            {mode === "register" && "Create Your Forge Account"}
            {mode === "forgot" && "Reset Your Password"}
            {mode === "reset" && "Create New Password"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {mode === "login" && "Log in to access your startup workspace and matching pipelines."}
            {mode === "register" && "Join founders, builders, and investors on Project FORGE."}
            {mode === "forgot" && "Enter your email address and we'll send a password recovery link."}
            {mode === "reset" && "Enter a new secure password for your account."}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            feedback.type === "error" ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}>
            {feedback.type === "error" ? <ShieldAlert size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
            <span className="leading-snug">{feedback.text}</span>
          </div>
        )}

        {/* Google OAuth Option */}
        {(mode === "login" || mode === "register") && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || submitting}
              className="w-full border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 font-bold py-2.5 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center gap-2 text-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px bg-neutral-200 flex-1"></div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">or continue with email</span>
              <div className="h-px bg-neutral-200 flex-1"></div>
            </div>
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
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          )}

          {(mode === "login" || mode === "register") && (
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                {mode === "register" ? "Username" : "Email or Username"}
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={mode === "register" ? "e.g. alex_rivera" : "Enter registered email or username"}
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          )}

          {(mode === "register" || mode === "forgot") && (
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@forge.os"
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          )}

          {(mode === "login" || mode === "register" || mode === "reset") && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">
                  {mode === "reset" ? "New Password" : "Password"}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setFeedback(null); }}
                    className="text-[10px] font-bold text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-neutral-200 p-2.5 rounded-xl bg-neutral-50 text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || submitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading || submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                {mode === "login" && "Log In to Workspace"}
                {mode === "register" && "Register Account"}
                {mode === "forgot" && "Send Password Reset Link"}
                {mode === "reset" && "Update Password"}
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-4 text-center border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          {mode === "login" && (
            <span>
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setFeedback(null); }} className="text-purple-600 font-bold hover:underline">
                Register here
              </button>
            </span>
          )}
          {mode === "register" && (
            <span>
              Already registered?{" "}
              <button onClick={() => { setMode("login"); setFeedback(null); }} className="text-purple-600 font-bold hover:underline">
                Log in here
              </button>
            </span>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <button onClick={() => { setMode("login"); setFeedback(null); }} className="text-purple-600 font-bold hover:underline">
              ← Return to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
