"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Ambulance, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  AlertCircle,
  Plus,
  X,
  Ban,
  AlertTriangle,
  Loader2,
  Navigation
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";

interface RideRequestItem {
  id: string;
  pickupAddress: string;
  destination: string;
  ambulanceType: string;
  fareAmount: number;
  status: "PENDING" | "ACCEPTED" | "EN_ROUTE" | "ARRIVED_AT_SCENE" | "PATIENT_PICKED_UP" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  payment?: {
    id: string;
    amount: number;
    status: "PAID" | "UNPAID";
  } | null;
  provider?: {
    ambulance?: {
      registrationNo?: string;
      name?: string;
    };
  } | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const fetchMyRides = async (
  token: string | null,
  searchTerm: string,
  status: string,
  page: number
) => {
  if (!token) return { data: [], meta: { total: 0, totalPage: 1 } };

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: "5",
    ...(searchTerm ? { searchTerm } : {}),
    ...(status && status !== "ALL" ? { status } : {}),
  });

  const res = await fetch(`${API_BASE}/rides?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load ride requests from server");
  }

  const json = await res.json();
  return {
    data: (json.data || []) as RideRequestItem[],
    meta: json.meta || { total: 0, totalPage: 1 },
  };
};

const cancelRideApi = async (rideId: string, token: string | null) => {
  if (!token) throw new Error("Authentication token required");

  const res = await fetch(`${API_BASE}/rides/${rideId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cancellationReason: "Cancelled by customer from dashboard" }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Could not cancel ride request");
  }

  return json.data;
};

function CustomerDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { name, token, isAuthenticated } = useAuthStore();

  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [selectedRide, setSelectedRide] = useState<RideRequestItem | null>(null);
  const [rideToCancel, setRideToCancel] = useState<RideRequestItem | null>(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customerRides", token, search, statusFilter, page],
    queryFn: () => fetchMyRides(token, search, statusFilter, page),
    enabled: !!token && isAuthenticated,
  });

  const { mutate: handleCancelRide, isPending: isCancelling } = useMutation({
    mutationFn: (rideId: string) => cancelRideApi(rideId, token),
    onSuccess: () => {
      toast.success("Ride request cancelled. You can still complete payment if required.");
      queryClient.invalidateQueries({ queryKey: ["customerRides"] });
      setRideToCancel(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateUrl = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleGoToPayment = (ride: RideRequestItem) => {
    router.push(`/payment?rideId=${ride.id}&amount=${ride.fareAmount || 1500}`);
  };

  const getDisplayStatus = (item: RideRequestItem) => {
    const isPaid = item.payment?.status === "PAID";
    if (isPaid) {
      return "COMPLETED";
    }
    return item.status;
  };

  const ridesList = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const totalCount = data?.meta?.total || ridesList.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            Welcome back, {name || "Customer"}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ambulance dispatch tracking, status updates, and history.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Book New Ambulance
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            defaultValue={search}
            placeholder="Search by pickup, destination..."
            onChange={(e) => updateUrl({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => updateUrl({ status: e.target.value, page: 1 })}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="COMPLETED">Completed (Paid)</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Failed to load dispatch history</p>
            <p className="text-xs text-slate-400">{(error as any)?.message || "Check backend connection."}</p>
          </div>
        ) : ridesList.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ambulance className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No dispatch requests found</p>
            <p className="text-xs text-slate-400">Go to Services to request your first ambulance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Serial / ID</th>
                  <th className="py-3.5 px-4">Route (Pickup → Destination)</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Fare</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Dispatch Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ridesList.map((item, index) => {
                  const serialNo = (page - 1) * 5 + index + 1;
                  const isPaid = item.payment?.status === "PAID";
                  const displayStatus = getDisplayStatus(item);
                  const canCancel = !isPaid && item.status !== "CANCELLED";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">#{serialNo}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id.slice(-6).toUpperCase()}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{item.pickupAddress}</span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="text-slate-600">{item.destination}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {item.ambulanceType.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ৳{item.fareAmount || 1500} BDT
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                            UNPAID
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {displayStatus === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            COMPLETED
                          </span>
                        ) : displayStatus === "CANCELLED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Ban className="w-3 h-3 text-rose-600" />
                            CANCELLED
                          </span>
                        ) : displayStatus === "EN_ROUTE" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Navigation className="w-3 h-3 text-blue-600 animate-spin" />
                            EN ROUTE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                            PENDING
                          </span>
                        )}
                      </td>
                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid && (
                            <button
                              onClick={() => handleGoToPayment(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition active:scale-95"
                              title="Go to payment page"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay Now
                            </button>
                          )}
                          {canCancel && (
                            <button
                              onClick={() => setRideToCancel(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-[11px] rounded-lg transition active:scale-95"
                              title="Cancel Request"
                            >
                              <Ban className="w-3 h-3" />
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRide(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => updateUrl({ page: page - 1 })}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => updateUrl({ page: page + 1 })}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {rideToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Cancel Dispatch Request?</h3>
                  <p className="text-[10px] text-slate-400">ID: {rideToCancel.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setRideToCancel(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to cancel this emergency ride? The assigned driver will be notified.
              </p>
              
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                <div><span className="font-semibold text-slate-700">Pickup:</span> {rideToCancel.pickupAddress}</div>
                <div><span className="font-semibold text-slate-700">Destination:</span> {rideToCancel.destination}</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> You will still be able to complete payment for this ride using the <strong>Pay Now</strong> button on your dashboard.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRideToCancel(null)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={() => handleCancelRide(rideToCancel.id)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 disabled:opacity-60"
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
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Ride Details - {selectedRide.id.slice(-6).toUpperCase()}
                </h3>
              </div>
              <button onClick={() => setSelectedRide(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div><span className="font-bold text-slate-700">From:</span> {selectedRide.pickupAddress}</div>
                <div><span className="font-bold text-slate-700">To:</span> {selectedRide.destination}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Fare</span>
                  <span className="font-extrabold text-slate-800">৳{selectedRide.fareAmount} BDT</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Payment</span>
                  <span className={`font-extrabold ${selectedRide.payment?.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                    {selectedRide.payment?.status || "UNPAID"}
                  </span>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Effective Status</span>
                <span className="font-extrabold text-slate-800">{getDisplayStatus(selectedRide)}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRide(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading customer portal...</div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}