"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
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
  MapPin,
  Navigation,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

interface OverviewData {
  metrics: {
    totalUsers: number;
    totalCustomers: number;
    totalProviders: number;
    totalAmbulances: number;
    totalRides: number;
    completedRides: number;
    pendingRides: number;
    cancelledRides: number;
    totalRevenue: number;
  };
  revenueChart: Array<{ day: string; amount: number }>;
  recentRides: Array<{
    id: string;
    pickupAddress: string;
    destination: string;
    ambulanceType: string;
    fareAmount: number;
    status: string;
    createdAt: string;
    customer?: { name: string; phone: string };
    payment?: { status: string; amount: number; transactionId?: string };
  }>;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function AdminDashboardContent() {
  const router = useRouter();
  const { token, isAuthenticated, role, name, email, syncFromCookies } =
    useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    syncFromCookies();
    setMounted(true);
  }, [syncFromCookies]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (role && role.toUpperCase() !== "ADMIN") {
        router.replace(
          role.toUpperCase() === "PROVIDER"
            ? "/provider/dashboard"
            : "/customer/dashboard"
        );
      }
    }
  }, [mounted, isAuthenticated, role, router]);

  // Fetch live system metrics & chart data from backend
  const { data, isLoading, isError, error } = useQuery<OverviewData>({
    queryKey: ["adminOverview", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to load admin overview");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!token && isAuthenticated && role?.toUpperCase() === "ADMIN",
    refetchInterval: 10000,
  });

  // Auth & Admin Role verification loader
  if (!mounted || !isAuthenticated || (role && role.toUpperCase() !== "ADMIN")) {
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

  const metrics = data?.metrics || {
    totalUsers: 0,
    totalCustomers: 0,
    totalProviders: 0,
    totalAmbulances: 0,
    totalRides: 0,
    completedRides: 0,
    pendingRides: 0,
    cancelledRides: 0,
    totalRevenue: 0,
  };

  const revenueChart = data?.revenueChart || [];
  const recentRides = data?.recentRides || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Admin Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 p-6 sm:p-8 border border-white/10 shadow-xl">
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
            Real-time dispatch telemetry, fleet allocation tracking, platform
            revenue settlement audits, and customer security oversight.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              Manage Users & Roles
            </Link>
            <Link
              href="/admin/rides"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition active:scale-95 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              View Global Missions
            </Link>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white/5 rounded-full flex items-center justify-center pointer-events-none">
          <ShieldCheck className="w-28 h-28 text-white/10" />
        </div>
      </div>

      {/* 2. Key Metrics Cards (Live DB Powered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Dispatches */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Dispatches
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {isLoading ? "..." : metrics.totalRides}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {metrics.completedRides} Done
            </span>
            <span className="text-amber-600 flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> {metrics.pendingRides} Pending
            </span>
          </div>
        </div>

        {/* Registered Fleets */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Registered Fleets
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ambulance className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {isLoading ? "..." : metrics.totalAmbulances}
          </p>
          <span className="text-[11px] text-slate-500 font-semibold block">
            {metrics.totalProviders} Active vehicle providers
          </span>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {isLoading ? "..." : metrics.totalCustomers}
          </p>
          <span className="text-[11px] text-slate-500 font-semibold block">
            {metrics.totalUsers} Total registered accounts
          </span>
        </div>

        {/* Gross Volume */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Gross Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {isLoading
              ? "..."
              : `৳${metrics.totalRevenue.toLocaleString()}`}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Settled via Gateways
          </span>
        </div>
      </div>

      {/* 3. Recharts Weekly Gross Volume Visualization */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Weekly Revenue Volume
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated settlement flow across all dispatched missions
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Last 7 Days
          </span>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueChart}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`৳${value} BDT`, "Gross Volume"]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="amount"
                fill="#059669"
                radius={[8, 8, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Live System Activity & Recent Dispatches */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recent Dispatch Missions
            </h3>
          </div>
          <Link
            href="/admin/rides"
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            View all logs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : isError ? (
          <div className="py-10 text-center space-y-2">
            <AlertCircle className="w-7 h-7 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 font-bold">
              {(error as Error)?.message || "Failed to load live missions."}
            </p>
          </div>
        ) : recentRides.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              No recent emergency dispatches
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              All ongoing rescue requests, driver assignments, and database
              audit events will stream here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentRides.map((ride) => (
              <div
                key={ride.id}
                className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      #{ride.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {ride.ambulanceType.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        ride.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : ride.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{ride.pickupAddress}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{ride.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-left md:text-right">
                    <span className="font-black text-slate-900 block">
                      ৳{ride.fareAmount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {ride.customer?.name || "Customer"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(ride.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading admin command center...
            </div>
          }
        >
          <AdminDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}