"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  DollarSign,
  TrendingUp,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Link from "next/link";
import Footer from "@/components/Footer";

interface CompletedRide {
  id: string;
  fareAmount: number;
  pickupAddress: string;
  destination: string;
  ambulanceType: string;
  createdAt: string;
  status: string;
  payment?: {
    status: string;
    transactionId?: string;
    provider?: string;
  } | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function EarningsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuthStore();

  const filter = searchParams.get("filter") || "ALL";

  // URL state synchronization helper
  const updateFilter = (newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter && newFilter !== "ALL") {
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Fetch exactly the same completed rides shown on the provider dashboard
  const {
    data: rides = [],
    isLoading,
    isError,
    error,
  } = useQuery<CompletedRide[]>({
    queryKey: ["providerCompletedTasks", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/provider/tasks?status=COMPLETED`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to load completed trips");
      }
      const json = await res.json();
      return (json.data || []) as CompletedRide[];
    },
    enabled: !!token && isAuthenticated,
  });

  // Calculate gross revenue and metrics directly from completed rides
  const totalEarnings = useMemo(() => {
    return rides.reduce((sum, item) => sum + (Number(item.fareAmount) || 0), 0);
  }, [rides]);

  const completedTrips = rides.length;

  const avgFare = useMemo(() => {
    if (completedTrips === 0) return 0;
    return Math.round(totalEarnings / completedTrips);
  }, [totalEarnings, completedTrips]);

  // Aggregate weekly chart data matching the rides
  const chartData = useMemo(() => {
    const weeklyMap: Record<string, number> = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    rides.forEach((ride) => {
      const dayIdx = new Date(ride.createdAt).getDay();
      const dayKey = DAYS_OF_WEEK[dayIdx] ?? "Sun";
      weeklyMap[dayKey] =
        (weeklyMap[dayKey] || 0) + (Number(ride.fareAmount) || 0);
    });

    return Object.keys(weeklyMap).map((day) => ({
      day,
      amount: weeklyMap[day] ?? 0,
    }));
  }, [rides]);

  // Filter rides based on payment settlement status
  const filteredRides = useMemo(() => {
    if (filter === "PAID") {
      return rides.filter((r) => r.payment?.status === "PAID");
    }
    if (filter === "PENDING") {
      return rides.filter((r) => r.payment?.status !== "PAID");
    }
    return rides;
  }, [rides, filter]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-3" />
        <p className="text-xs font-semibold">
          Loading earnings and revenue metrics...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-24 text-center space-y-3 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">
          Failed to load earnings metrics
        </h3>
        <p className="text-xs text-slate-400">
          {(error as Error)?.message || "Please check backend connection."}
        </p>
        <Link
          href="/provider/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/provider/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Financial Performance
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Earnings & Trip Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time calculation of completed ambulance mission settlements and
            payouts.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" /> Export
          Statement
        </button>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ৳{totalEarnings.toLocaleString()}{" "}
            <span className="text-xs font-bold text-slate-400">BDT</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Cumulative dispatch income
          </p>
        </div>

        {/* Completed Trips Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Completed Trips
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {completedTrips}{" "}
            <span className="text-xs font-bold text-slate-400">Rides</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            All successful dispatches to hospitals
          </p>
        </div>

        {/* Average Fare Per Ride */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Average Ticket
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ৳{avgFare.toLocaleString()}{" "}
            <span className="text-xs font-bold text-slate-400">BDT</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Mean payout per transit mission
          </p>
        </div>
      </div>

      {/* 3. Recharts Weekly Earnings Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Weekly Revenue Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Day-by-day earnings aggregated from completed dispatches
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Current Week
          </span>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
                formatter={(value: any) => [`৳${value} BDT`, "Earnings"]}
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
                fill="#e11d48"
                radius={[8, 8, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Settlements / Completed Trips Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-sm text-slate-900 tracking-tight">
            Completed Trip Settlements
          </h3>

          <div className="flex items-center gap-1.5">
            {["ALL", "PAID", "PENDING"].map((item) => (
              <button
                key={item}
                onClick={() => updateFilter(item)}
                className={`px-3 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                  filter === item
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredRides.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              No completed trip settlements found
            </p>
            <p className="text-xs text-slate-400">
              Complete ambulance missions to generate earnings history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Settlement</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRides.map((ride) => {
                  const isPaid = ride.payment?.status === "PAID";

                  return (
                    <tr
                      key={ride.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{ride.id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-800">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{ride.pickupAddress}</span>
                          <span className="text-slate-400 mx-1">→</span>
                          <Navigation className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{ride.destination}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {ride.ambulanceType.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 block">
                          ৳{ride.fareAmount} BDT
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isPaid ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {isPaid ? "Settled" : "Pending Payment"}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {ride.payment?.transactionId || "SSLCOMMERZ"}
                      </td>

                      <td className="py-3 px-4 text-right text-slate-400 font-medium">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProviderEarningsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading metrics...
            </div>
          }
        >
          <EarningsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
