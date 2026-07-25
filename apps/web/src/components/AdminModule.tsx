"use client";

import React, { useState } from "react";
import { Shield, Users, Building2, Activity, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";
import { useForgeStore } from "@/stores/useStore";

export default function AdminModule() {
  const { registeredUsers, startups, ideas } = useForgeStore();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="text-brand-600" size={24} />
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Admin Operations & Moderation</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            System overview, user role management, startup moderation, and platform audit logs.
          </p>
        </div>
        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Super Admin Mode
        </span>
      </div>

      {/* Admin KPI Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold">Total Accounts</span>
            <Users size={16} />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{registeredUsers.length + 5}</div>
          <span className="text-[10px] text-emerald-600 font-bold">+12% this week</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold">Active Startups</span>
            <Building2 size={16} />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{startups.length + 3}</div>
          <span className="text-[10px] text-brand-600 font-bold">100% verified</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold">Submitted Ideas</span>
            <Activity size={16} />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{ideas.length}</div>
          <span className="text-[10px] text-neutral-500 font-semibold">Under validation</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold">Pending Moderation</span>
            <AlertTriangle className="text-amber-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-neutral-900">0</div>
          <span className="text-[10px] text-emerald-600 font-bold">Queue clean</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900">Platform User Registry</h2>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase text-[10px]">
              <th className="py-2">User</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="py-2.5 font-bold text-neutral-800">Alex Rivera</td>
              <td className="py-2.5 text-neutral-500">alex@forge.os</td>
              <td className="py-2.5"><span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Founder</span></td>
              <td className="py-2.5"><span className="text-emerald-600 font-bold">Active</span></td>
              <td className="py-2.5 text-right"><button className="text-brand-600 hover:underline font-bold">Manage</button></td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold text-neutral-800">Sarah Chen</td>
              <td className="py-2.5 text-neutral-500">sarah@forge.os</td>
              <td className="py-2.5"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Builder</span></td>
              <td className="py-2.5"><span className="text-emerald-600 font-bold">Active</span></td>
              <td className="py-2.5 text-right"><button className="text-brand-600 hover:underline font-bold">Manage</button></td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold text-neutral-800">Marcus Vance</td>
              <td className="py-2.5 text-neutral-500">marcus@vance.cap</td>
              <td className="py-2.5"><span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Investor</span></td>
              <td className="py-2.5"><span className="text-emerald-600 font-bold">Active</span></td>
              <td className="py-2.5 text-right"><button className="text-brand-600 hover:underline font-bold">Manage</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
