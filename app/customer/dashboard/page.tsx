"use client";

import React from "react";
import Link from "next/link";
import { Ambulance, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";

export default function CustomerDashboardPage() {
  const { name, email } = useAuthStore();
  const displayName = name || (email ? email.split("@")[0] : "Customer");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/90 via-rose-700 to-slate-900 p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
            Emergency & Non-Emergency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="capitalize">{displayName}</span>
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Need immediate medical transit? Dispatch nearby verified ICU or basic
            life-support ambulances with a single click.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/customer/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95"
            >
              <Ambulance className="w-4 h-4 text-red-600" />
              Request Ambulance Now
            </Link>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white/5 rounded-full flex items-center justify-center pointer-events-none">
          <Ambulance className="w-28 h-28 text-white/10" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Dispatch</span>
            <Ambulance className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-white">0</p>
          <span className="text-[11px] text-slate-400">No ongoing ride requests</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Completed</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">0</p>
          <span className="text-[11px] text-slate-400">Lifetime completed rides</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Saved Locations</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">Home</p>
          <span className="text-[11px] text-slate-400">Ready for instant dispatch</span>
        </div>
      </div>

      {/* Ride History Placeholder */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Dispatch Requests</h3>
          <Link
            href="/customer/history"
            className="text-xs text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-300">No recent rides found</p>
          <p className="text-xs text-slate-400 max-w-sm">
            Your emergency transit records, driver details, and receipts will appear
            here once booked.
          </p>
        </div>
      </div>
    </div>
  );
}