"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ambulance,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  ArrowUpRight,
  Loader2,
  Navigation,
  ShieldAlert,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role, name, email, syncFromCookies } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    syncFromCookies();
    setMounted(true);
  }, [syncFromCookies]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (role && role !== "provider") {
        router.replace(role === "admin" ? "/admin" : "/customer/dashboard");
      }
    }
  }, [mounted, isAuthenticated, role, router]);

  // Auth & Role checking loader
  if (!mounted || !isAuthenticated || (role && role !== "provider")) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs text-slate-400 font-medium">
          Verifying provider credentials...
        </p>
      </div>
    );
  }

  const displayName = name || (email ? email.split("@")[0] : "Provider");

  return (
    <>
      <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
        {/* Provider Operational Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                Emergency Fleet Provider
              </span>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                  isAvailable
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                {isAvailable ? "Online (Accepting)" : "Offline (Paused)"}
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="capitalize">{displayName}</span>
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Stay connected for inbound customer emergency dispatches. Ensure GPS
              tracking is active to receive proximity-based rescue requests.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/provider/trips"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                View Active Missions
              </Link>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white/5 rounded-full flex items-center justify-center pointer-events-none">
            <Ambulance className="w-28 h-28 text-white/10" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Active Missions</span>
              <Ambulance className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">0</p>
            <span className="text-[11px] text-slate-400">Ongoing customer rescues</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Trips Completed</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">0</p>
            <span className="text-[11px] text-slate-400">Successfully delivered</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Earnings</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">$0.00</p>
            <span className="text-[11px] text-slate-400">Available balance</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Vehicle Status</span>
              <MapPin className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-white">Stationed</p>
            <span className="text-[11px] text-slate-400">Ready for assignment</span>
          </div>
        </div>

        {/* Live Inbound Requests Placeholder */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Incoming Emergency Requests</h3>
            </div>
            <Link
              href="/provider/trips"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              Dispatch logs <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">No pending emergency alerts</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Live customer requests matching your ambulance location will appear here
              with instant route details.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}