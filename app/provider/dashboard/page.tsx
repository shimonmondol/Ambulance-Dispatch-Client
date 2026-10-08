"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ambulance,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Loader2,
  User,
  Power,
  Activity,
  AlertCircle,
  Ban,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";
import Footer from "@/components/Footer";

interface TaskItem {
  id: string;
  pickupAddress: string;
  destination: string;
  ambulanceType: string;
  fareAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  customer?: {
    name: string;
    phone: string;
  };
  payment?: {
    status: "PAID" | "UNPAID" | "FAILED";
    transactionId?: string;
  };
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function ProviderDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthStore();

  const statusFilter = searchParams.get("status") || "ALL";
  const [cancellingTask, setCancellingTask] = useState<TaskItem | null>(null);

  // URL state synchronization helper
  const updateFilter = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus && newStatus !== "ALL") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // 1. Fetch provider duty profile
  const { data: profileData } = useQuery({
    queryKey: ["providerProfile", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/provider/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load provider profile");
      return (await res.json()).data;
    },
    enabled: !!token && isAuthenticated,
  });

  // 2. Fetch provider tasks and pending requests
  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["providerTasks", token, statusFilter],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/provider/tasks?status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to load tasks from server");
      return (await res.json()).data as TaskItem[];
    },
    enabled: !!token && isAuthenticated,
    refetchInterval: 5000,
  });

  // 3. Mutation: Toggle availability status
  const { mutate: toggleDuty, isPending: isToggling } = useMutation({
    mutationFn: async (newStatus: boolean) => {
      const res = await fetch(`${API_BASE}/provider/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update availability status");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["providerProfile"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // 4. Mutation: Complete ride request directly
  const { mutate: completeRide, isPending: isCompleting } = useMutation({
    mutationFn: async (rideId: string) => {
      const res = await fetch(`${API_BASE}/provider/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to complete ride");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Ride completed successfully");
      queryClient.invalidateQueries({ queryKey: ["providerTasks"] });
      queryClient.invalidateQueries({ queryKey: ["providerCompletedTasks"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // 5. Mutation: Cancel / Reject ride request
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
        throw new Error(errJson.message || "Failed to cancel ride");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Ride cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["providerTasks"] });
      setCancellingTask(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Render status badge
  const renderStatusBadge = (status: TaskItem["status"]) => {
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const isAvailable = profileData?.isAvailable ?? false;
  const taskList = tasks || [];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Availability Command Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
            Provider Dashboard
          </h1>
        </div>
        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/provider/profile"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-green-500 hover:bg-green-600 text-white transition shadow-xs"
          >
            Profile
          </Link>
          <Link
            href="/provider/earnings"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-500 hover:bg-blue-600 text-white transition shadow-xs"
          >
            Earnings
          </Link>
        </div>
      </div>

      {/* 2. Tasks Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation & Status Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <h2 className="font-black text-sm text-slate-900 tracking-tight">
              Active & Pending Rides
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((tab) => (
              <button
                key={tab}
                onClick={() => updateFilter(tab)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
                  statusFilter === tab
                    ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="p-8 space-y-3">
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Failed to load dispatch missions
            </p>
            <p className="text-xs text-slate-400">
              {(error as any)?.message || "Please check backend connection."}
            </p>
          </div>
        ) : taskList.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ambulance className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              No dispatch missions found
            </p>
            <p className="text-xs text-slate-400">
              Keep your duty status Online to receive incoming emergency dispatches.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {taskList.map((task) => {
              const isPaid = task.payment?.status === "PAID";

              return (
                <div
                  key={task.id}
                  className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Mission Identifiers, Badges & Route */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900">
                        #{task.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {task.ambulanceType.replace(/_/g, " ")}
                      </span>
                      {renderStatusBadge(task.status)}
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Pickup: {task.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Hospital: {task.destination}</span>
                      </div>
                    </div>

                    {task.customer && (
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3 h-3 text-slate-400" />{" "}
                          {task.customer.name}
                        </span>
                        {task.customer.phone && (
                          <a
                            href={`tel:${task.customer.phone}`}
                            className="flex items-center gap-1 text-rose-600 font-bold hover:underline"
                          >
                            <Phone className="w-3 h-3" /> {task.customer.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Fare & Direct Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right pr-2">
                      <span className="text-base font-black text-slate-900 block">
                        ৳{task.fareAmount}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase ${isPaid ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {isPaid ? "Paid via SSL" : "Unpaid"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* PENDING State Actions */}
                      {task.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => completeRide(task.id)}
                            disabled={isCompleting}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {isCompleting ? "Completing..." : "Complete Ride"}
                          </button>
                          <button
                            onClick={() => setCancellingTask(task)}
                            className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl border border-slate-200 transition active:scale-95 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* COMPLETED State */}
                      {task.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Trip Finished
                        </span>
                      )}

                      {/* CANCELLED State */}
                      {task.status === "CANCELLED" && (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs px-3 py-2 bg-rose-50 rounded-xl border border-rose-200">
                          <Ban className="w-4 h-4" /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Cancel Dispatch Mission?
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    ID: #{cancellingTask.id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancellingTask(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to cancel or reject this emergency ride? This will mark the ride as CANCELLED and free up your vehicle.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-700">Pickup:</span>{" "}
                  {cancellingTask.pickupAddress}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Destination:</span>{" "}
                  {cancellingTask.destination}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingTask(null)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                No, Keep Mission
              </button>
              <button
                type="button"
                onClick={() => cancelRide(cancellingTask.id)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    Yes, Cancel Ride
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

export default function ProviderDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading command center...
            </div>
          }
        >
          <ProviderDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}