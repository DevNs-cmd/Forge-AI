"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runPersistenceDiagnostic, DiagnosticReport, DiagnosticCheck } from "@/services/supabaseDiagnostic";
import { Bug, X, Play, CheckCircle2, XCircle, AlertTriangle, Copy, ClipboardCheck, Loader2 } from "lucide-react";

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DiagnosticCheck["status"] }) {
  const map = {
    PASS: { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={12} />, label: "PASS" },
    FAIL: { cls: "bg-rose-100 text-rose-700 border-rose-200", icon: <XCircle size={12} />, label: "FAIL" },
    WARN: { cls: "bg-amber-100 text-amber-700 border-amber-200", icon: <AlertTriangle size={12} />, label: "WARN" },
    SKIP: { cls: "bg-neutral-100 text-neutral-500 border-neutral-200", icon: null, label: "SKIP" }
  };
  const { cls, icon, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {icon}{label}
    </span>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-auto text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1 text-[10px] font-semibold">
      {copied ? <><ClipboardCheck size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

// ── Check row ─────────────────────────────────────────────────────────────────
function CheckRow({ check }: { check: DiagnosticCheck }) {
  const [open, setOpen] = useState(check.status === "FAIL");
  return (
    <div className={`rounded-xl border mb-2 overflow-hidden ${
      check.status === "FAIL" ? "border-rose-200 bg-rose-50/40" :
      check.status === "PASS" ? "border-emerald-100 bg-emerald-50/20" :
      "border-neutral-200 bg-white"
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={check.status} />
          <span className="text-xs font-semibold text-neutral-800 truncate">{check.id}</span>
          <span className="text-[11px] text-neutral-400 truncate hidden sm:block">{check.label}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-[10px] text-neutral-400">{check.durationMs}ms</span>
          <span className="text-neutral-300 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-neutral-200/60 pt-3">
              <p className="text-[11px] text-neutral-500 leading-relaxed">{check.label}</p>

              {check.diagnosis && (
                <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  🔍 Diagnosis: {check.diagnosis}
                </div>
              )}

              {check.error && (
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Supabase Error</span>
                    <CopyButton text={check.error} />
                  </div>
                  <pre className="text-[10px] bg-neutral-900 text-rose-300 rounded-lg p-3 overflow-x-auto leading-relaxed">
                    {check.error}
                  </pre>
                </div>
              )}

              {check.data && (
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Response Data</span>
                    <CopyButton text={check.data} />
                  </div>
                  <pre className="text-[10px] bg-neutral-900 text-emerald-300 rounded-lg p-3 overflow-x-auto leading-relaxed max-h-40">
                    {check.data}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export default function DiagnosticPanel() {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  const runDiagnostic = async () => {
    setRunning(true);
    setReport(null);
    try {
      const result = await runPersistenceDiagnostic();
      setReport(result);
    } catch (e: any) {
      console.error("[DiagnosticPanel] runPersistenceDiagnostic threw:", e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="forge-diagnostic-btn"
        onClick={() => setOpen(true)}
        title="Open DB Persistence Diagnostic"
        className="fixed bottom-6 right-6 z-[100] h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-lg hover:bg-neutral-700 transition"
      >
        <Bug size={16} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <div>
                  <h2 className="font-extrabold text-neutral-900 text-base flex items-center gap-2">
                    <Bug size={16} className="text-purple-600" />
                    Forge Persistence Diagnostic
                  </h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Tests every DB write the onboarding flow depends on. Check the browser console for full logs.
                  </p>
                </div>
                <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Run button */}
                <button
                  id="forge-run-diagnostic"
                  onClick={runDiagnostic}
                  disabled={running}
                  className="w-full mb-6 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md shadow-purple-600/20 transition"
                >
                  {running
                    ? <><Loader2 className="animate-spin" size={15} /> Running checks...</>
                    : <><Play size={14} /> Run Persistence Diagnostic</>
                  }
                </button>

                {/* Summary banner */}
                {report && (
                  <div className={`mb-5 rounded-xl p-4 border ${
                    report.summary.failed > 0
                      ? "bg-rose-50 border-rose-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-sm font-bold text-neutral-900">
                        {report.summary.failed === 0
                          ? "🎉 All checks passed — persistence layer is working"
                          : `❌ ${report.summary.failed} check(s) failed`}
                      </div>
                      <div className="flex gap-2 text-[11px]">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{report.summary.passed} passed</span>
                        {report.summary.failed > 0 && (
                          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">{report.summary.failed} failed</span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 ml-auto">{report.runAt}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-600">
                      <span className="font-semibold">User:</span> {report.userEmail ?? "not logged in"} &nbsp;|&nbsp;
                      <span className="font-semibold">Session:</span> {report.sessionActive ? "✅ active" : "❌ none"} &nbsp;|&nbsp;
                      <span className="font-semibold">ID:</span> <code className="font-mono text-[10px]">{report.userId ?? "—"}</code>
                    </div>
                  </div>
                )}

                {/* SQL Fixes */}
                {report && report.sqlFixes.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">🔧 SQL to fix RLS / policies</h3>
                      <CopyButton text={report.sqlFixes.join("\n\n")} />
                    </div>
                    <pre className="text-[10px] bg-neutral-900 text-amber-300 rounded-xl p-4 overflow-x-auto leading-relaxed max-h-48 whitespace-pre-wrap">
                      {report.sqlFixes.join("\n\n")}
                    </pre>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Run this SQL in the <strong>Supabase Dashboard → SQL Editor</strong>.
                    </p>
                  </div>
                )}

                {/* Check list */}
                {report && (
                  <div>
                    <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">Check Results</h3>
                    {report.checks.map(check => (
                      <CheckRow key={check.id} check={check} />
                    ))}
                  </div>
                )}

                {!report && !running && (
                  <div className="text-center text-sm text-neutral-400 py-8">
                    Press <strong>"Run Persistence Diagnostic"</strong> above to begin.
                    <br />
                    <span className="text-[11px]">You must be logged in for the DB checks to work.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

