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
  Award
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
    { id: "admin-os", label: "Admin Operations", icon: Shield, roles: ["admin"], badge: "Root" }
  ];

  // Filter items based on active role
  const navItems = allNavItems.filter(item => item.roles.includes(activeRole));

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
        {isLoggedIn && currentUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="h-7 w-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {currentUser.username?.[0] || "U"}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-neutral-800 block truncate">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-neutral-400 block truncate uppercase">
                  Role: {currentUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => logoutUser()}
              title="Log Out"
              className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-neutral-100 transition"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAuthModal(true, "login")}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition"
            >
              <LogIn size={12} /> Log In
            </button>
            <button
              onClick={() => setShowAuthModal(true, "register")}
              className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold text-xs py-1.5 px-2 rounded-lg transition"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Context Switcher (Personal vs Startup) */}
      <div className="p-3 border-b border-neutral-100">
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveContext("personal")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
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
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
              activeContext === "company"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            } ${startups.length === 0 ? "opacity-50" : ""}`}
          >
            <Building2 size={12} /> Startup
          </button>
        </div>
      </div>

      {/* Navigation Modules (Role Tailored) */}
      <div className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block px-2.5 mb-1.5">
          {activeRole.toUpperCase()} Navigation
        </label>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-brand-50 text-brand-800"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon 
                  size={16} 
                  className={`transition-colors shrink-0 ${
                    isActive ? "text-brand-600" : "text-neutral-400 group-hover:text-neutral-600"
                  }`}
                />
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

      {/* Role Switcher Footer */}
      <div className="p-3 border-t border-neutral-100 bg-neutral-50/50">
        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
          Active Persona Role
        </label>
        <div className="grid grid-cols-5 gap-0.5 bg-neutral-200/60 p-0.5 rounded-md text-[8px] font-bold uppercase">
          {(["founder", "builder", "investor", "mentor", "admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                if (role === "admin") setActiveModule("admin-os");
                else if (role === "mentor") setActiveModule("mentor-hub");
                else setActiveModule("dashboard");
              }}
              className={`py-1 rounded transition text-center truncate ${
                activeRole === role
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {role.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
