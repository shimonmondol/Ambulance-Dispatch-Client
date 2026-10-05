"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Ambulance,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role, name, email, syncFromCookies } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    syncFromCookies();
    setMounted(true);
  }, [syncFromCookies]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (role && role !== "admin") {
        router.replace(role === "provider" ? "/provider/dashboard" : "/customer/dashboard");
      }
    }
  }, [mounted, isAuthenticated, role, router]);

  // Auth & Admin Role verification loader
  if (!mounted || !isAuthenticated || (role && role !== "admin")) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs text-slate-400 font-medium">
          Verifying administrative privileges...
        </p>
      </div>
    );
  }

  const displayName = name || (email ? email.split("@")[0] : "Admin");

  return (
    <>
      <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
        {/* Admin Overview Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-950 p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                System Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Control Panel, <span className="capitalize">{displayName}</span>
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Real-time dispatch overview, ambulance fleet supervision, platform revenue
              audits, and customer account safety controls.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/dispatches"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                Monitor Live Dispatches
              </Link>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white/5 rounded-full flex items-center justify-center pointer-events-none">
            <ShieldCheck className="w-28 h-28 text-white/10" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Dispatches</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">0</p>
            <span className="text-[11px] text-slate-400">Platform-wide transit calls</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Registered Fleets</span>
              <Ambulance className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">1</p>
            <span className="text-[11px] text-slate-400">Active provider vehicles</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Customers</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">0</p>
            <span className="text-[11px] text-slate-400">Registered client accounts</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Gross Volume</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">$0.00</p>
            <span className="text-[11px] text-slate-400">Total Stripe transactions</span>
          </div>
        </div>

        {/* System Activity & Logs Placeholder */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Audit & Dispatch Logs</h3>
            </div>
            <Link
              href="/admin/logs"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              View detailed audit <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">No emergency incident flags</p>
            <p className="text-xs text-slate-400 max-w-sm">
              All ongoing rescue requests, driver assignments, and database audit events will stream
              here in real time.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}