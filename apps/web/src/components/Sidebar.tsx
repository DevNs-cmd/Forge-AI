"use client";

import React from "react";
import { useForgeStore, CoreModuleType } from "@/stores/useStore";
import { UserRole } from "@project-forge/validation";
import { 
  LayoutDashboard, 
  Lightbulb, 
  Users, 
  Rocket, 
  Code2, 
  TrendingUp, 
  BarChart3, 
  Briefcase, 
  Layers, 
  DollarSign, 
  ShoppingBag,
  User, 
  Building2, 
  LogOut,
  LogIn,
  Shield,
  Award,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const { 
    activeRole, 
    activeContext, 
    activeModule, 
    setActiveRole, 
    setActiveContext, 
    setActiveModule,
    startups,
    currentUser,
    isLoggedIn,
    setShowAuthModal,
    logoutUser,
    setViewMode
  } = useForgeStore();

  // All available navigation items
  const allNavItems: Array<{ id: CoreModuleType; label: string; icon: any; roles: UserRole[]; badge?: string }> = [
    { id: "dashboard", label: "Lifecycle OS", icon: LayoutDashboard, roles: ["founder", "builder", "investor", "mentor", "admin"] },
    { id: "idea-exchange", label: "1. Idea Exchange", icon: Lightbulb, roles: ["founder", "investor", "admin"] },
    { id: "founder-matching", label: "2. Founder Matching", icon: Users, roles: ["founder", "admin"], badge: "AI" },
    { id: "startup-creation", label: "3. Startup Blueprint", icon: Rocket, roles: ["founder", "admin"] },
    { id: "builder-marketplace", label: "4. Builder Talent", icon: Code2, roles: ["founder", "builder", "admin"] },
    { id: "capital-marketplace", label: "5. Capital Pipeline", icon: TrendingUp, roles: ["founder", "investor", "admin"] },
    { id: "data-intelligence", label: "6. Intelligence OS", icon: BarChart3, roles: ["founder", "investor", "admin"], badge: "Live" },
    { id: "services-marketplace", label: "7. Services Directory", icon: Briefcase, roles: ["founder", "builder", "investor", "mentor", "admin"] },
    { id: "founder-os", label: "8. Founder Workspace", icon: Layers, roles: ["founder", "builder", "admin"] },
    { id: "syndicates", label: "9. Syndicates", icon: DollarSign, roles: ["founder", "investor", "admin"] },
    { id: "acquisition-marketplace", label: "10. Acquisitions", icon: ShoppingBag, roles: ["founder", "investor", "admin"] },
    { id: "mentor-hub", label: "Mentor Hub", icon: Award, roles: ["mentor", "admin"], badge: "Advisory" },
    { id: "admin-os", label: "Admin Operations", icon: Shield, roles: ["admin"], badge: "Root" },
    { id: "settings", label: "Settings", icon: Settings, roles: ["founder", "builder", "investor", "mentor", "admin"] }
  ];

  // Enforce effective role based strictly on authenticated Supabase user profile
  const effectiveRole: UserRole = currentUser?.role || activeRole || "founder";

  // Filter items based on user's authentic role
  const navItems = allNavItems.filter(item => item.roles.includes(effectiveRole));

  return (
    <div className="w-64 bg-white border-r border-neutral-100 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-neutral-100 justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode("landing")} title="Return to Landing Page">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            F
          </div>
          <div>
            <span className="font-bold text-neutral-900 tracking-tight text-base">FORGE</span>
            <span className="text-[9px] bg-brand-100 text-brand-700 font-bold ml-1.5 px-1.5 py-0.5 rounded uppercase tracking-wider">
              PROD
            </span>
          </div>
        </div>
      </div>

      {/* User Session Bar */}
      <div className="p-3 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-brand-500/10 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {currentUser?.fullName || "Authenticated User"}
              </p>
              <p className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                ROLE: <span className="text-brand-600 font-bold">{effectiveRole}</span>
              </p>
            </div>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => logoutUser()}
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true, "login")}
              className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition"
              title="Log In"
            >
              <LogIn size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Context Switcher (Personal vs Startup) */}
      <div className="p-3 border-b border-neutral-100">
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveContext("personal")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeContext === "personal"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <User size={12} /> Personal
          </button>
          <button
            onClick={() => {
              if (startups.length > 0) {
                setActiveContext("company");
              } else {
                alert("Please spin up a company blueprint in '3. Startup Blueprint' first!");
              }
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeContext === "company"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Building2 size={12} /> Startup
          </button>
        </div>
      </div>

      {/* Active Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-1">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon size={16} className={isActive ? "text-white" : "text-neutral-400"} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[8px] bg-brand-100 text-brand-700 font-bold px-1.5 py-0.5 rounded uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Authenticated Role Status Footer */}
      <div className="p-3 border-t border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center justify-between text-[10px] text-neutral-500 font-semibold">
          <span>Active Role:</span>
          <span className="bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded uppercase text-[9px]">
            {effectiveRole}
          </span>
        </div>
      </div>
    </div>
  );
}
