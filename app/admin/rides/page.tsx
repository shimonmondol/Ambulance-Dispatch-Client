"use client";

import React, { useState, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ambulance,
  Search,
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  Ban,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Loader2,
  User,
  Phone,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";
import Footer from "@/components/Footer";

interface RideLog {
  id: string;
  pickupAddress: string;
  destination: string;
  ambulanceType: string;
  fareAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
  };
  payment?: {
    id: string;
    status: "PAID" | "UNPAID" | "FAILED";
    amount: number;
    transactionId?: string;
  };
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function AdminRidesContent() {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cancellingRide, setCancellingRide] = useState<RideLog | null>(null);

  // 1. Fetch Global Rides
  const {
    data: rides = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RideLog[]>({
    queryKey: ["adminRides", token, statusFilter],
    queryFn: async () => {
      const url =
        statusFilter === "ALL"
          ? `${API_BASE}/admin/rides`
          : `${API_BASE}/admin/rides?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to load dispatch logs");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!token && isAuthenticated,
    refetchInterval: 8000,
  });

  // 2. Mutation: Admin Force-Cancel Ride
  const { mutate: cancelRide, isPending: isCancelling } = useMutation({
    mutationFn: async (rideId: string) => {
      const res = await fetch(`${API_BASE}/provider/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to cancel dispatch");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Ride cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["adminRides"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
      setCancellingRide(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Render Status Badge
  const renderStatusBadge = (status: RideLog["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            PENDING
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            COMPLETED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <Ban className="w-3 h-3 text-rose-600" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Search filter
  const filteredRides = rides.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(term) ||
      r.pickupAddress.toLowerCase().includes(term) ||
      r.destination.toLowerCase().includes(term) ||
      (r.customer?.name && r.customer.name.toLowerCase().includes(term)) ||
      (r.customer?.phone && r.customer.phone.includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Header Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Fleet Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Global Dispatch & Mission Logs
          </h1>
          <p className="text-xs text-slate-500">
            Track emergency routes, fare settlements, and supervise active medical transits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by mission ID, location, or patient..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Global Rides Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-3" />
            <p className="text-xs font-semibold">Streaming global dispatches...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Failed to load dispatch missions</p>
            <p className="text-xs text-slate-400">
              {(error as Error)?.message || "Please check backend connection."}
            </p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ambulance className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No dispatch records found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Mission ID</th>
                  <th className="py-3.5 px-4">Patient / Caller</th>
                  <th className="py-3.5 px-4">Transit Route</th>
                  <th className="py-3.5 px-4">Fleet Type</th>
                  <th className="py-3.5 px-4">Settlement</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRides.map((ride) => {
                  const isPaid = ride.payment?.status === "PAID";

                  return (
                    <tr key={ride.id} className="hover:bg-slate-50/60 transition">
                      {/* Mission ID & Date */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-slate-900">
                          #{ride.id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Patient / Caller Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {ride.customer?.name || "Anonymous Patient"}
                        </div>
                        {ride.customer?.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {ride.customer.phone}
                          </div>
                        )}
                      </td>

                      {/* Transit Route */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{ride.pickupAddress}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate">
                          <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{ride.destination}</span>
                        </div>
                      </td>

                      {/* Fleet Type */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {ride.ambulanceType.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Settlement & Fare */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">
                          ৳{ride.fareAmount}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            isPaid ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {isPaid ? "PAID" : "UNPAID"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(ride.status)}
                      </td>

                      {/* Admin Force Action */}
                      <td className="py-3.5 px-5 text-right">
                        {ride.status === "PENDING" ? (
                          <button
                            onClick={() => setCancellingRide(ride)}
                            className="px-3 py-1.5 rounded-xl font-bold text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition active:scale-95 cursor-pointer"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold">
                            Archived
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Cancel Confirmation Modal */}
      {cancellingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Admin Force Cancel
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    ID: #{cancellingRide.id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancellingRide(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to administratively cancel this mission?
                This will release the assigned provider immediately.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-700">Pickup:</span>{" "}
                  {cancellingRide.pickupAddress}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Destination:</span>{" "}
                  {cancellingRide.destination}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingRide(null)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Keep Mission
              </button>
              <button
                type="button"
                onClick={() => cancelRide(cancellingRide.id)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRidesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading mission logs...
            </div>
          }
        >
          <AdminRidesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}