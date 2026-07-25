"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { UserRole } from "@project-forge/validation";
import { 
  Settings, 
  User, 
  Rocket, 
  Code2, 
  TrendingUp, 
  CheckCircle2, 
  Shield, 
  Loader2,
  RefreshCw
} from "lucide-react";

export default function SettingsModule() {
  const { currentUser, changeUserRole, isLoading } = useForgeStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || "founder");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    setSelectedRole(role);
    setIsUpdating(true);
    setSuccessMsg(null);
    try {
      await changeUserRole(role);
      setSuccessMsg(`Workspace updated to ${role.toUpperCase()}! Database profile synced.`);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <Settings className="text-brand-600" size={24} /> Account & Workspace Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your authenticated user profile, active workspace role, and database sync.
          </p>
        </div>
        <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Live Database Synced
        </span>
      </div>

      {/* Feedback Message */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* User Identity Profile Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <User size={16} className="text-neutral-500" /> Authenticated Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Full Name</span>
            <span className="font-bold text-neutral-800 text-sm">{currentUser?.fullName || "Forge Member"}</span>
          </div>
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Email Address</span>
            <span className="font-semibold text-neutral-800">{currentUser?.email || "user@forge.os"}</span>
          </div>
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Username</span>
            <span className="font-semibold text-neutral-800">@{currentUser?.username || "user"}</span>
          </div>
        </div>
      </div>

      {/* Active Workspace Switcher */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <RefreshCw size={16} className="text-brand-600" /> Switch Active Workspace
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Optionally change your platform role. Updating your workspace updates your profile in Supabase and reconfigures your navigation and OS environment while preserving all your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            { 
              role: "founder", 
              title: "Founder Workspace", 
              desc: "Spin up startup blueprints, validate concepts & seek funding.", 
              icon: Rocket, 
              color: "text-brand-600 bg-brand-50 border-brand-200" 
            },
            { 
              role: "builder", 
              title: "Builder Workspace", 
              desc: "Apply to missions, build software for equity & track work.", 
              icon: Code2, 
              color: "text-emerald-600 bg-emerald-50 border-emerald-200" 
            },
            { 
              role: "investor", 
              title: "Investor Workspace", 
              desc: "Access AI pitch deck reports, syndicates & startup pipelines.", 
              icon: TrendingUp, 
              color: "text-purple-600 bg-purple-50 border-purple-200" 
            }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = (currentUser?.role || selectedRole) === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleChange(item.role as UserRole)}
                disabled={isUpdating}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 relative ${
                  isCurrent 
                    ? "bg-brand-50/40 border-brand-500 ring-2 ring-brand-500/20 shadow-md" 
                    : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] bg-brand-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
