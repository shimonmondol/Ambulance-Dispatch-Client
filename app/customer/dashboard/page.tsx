"use client";

import React, { useState, Suspense, useEffect } from "react";
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
  Navigation,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";
import Footer from "@/components/Footer";

interface RideRequestItem {
  id: string;
  pickupAddress: string;
  destination: string;
  ambulanceType: string;
  fareAmount: number;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "EN_ROUTE"
    | "ARRIVED_AT_SCENE"
    | "PATIENT_PICKED_UP"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
  payment?: {
    id: string;
    amount: number;
    status: "PAID" | "UNPAID" | "FAILED";
  } | null;
  provider?: {
    ambulance?: {
      registrationNo?: string;
      name?: string;
    };
  } | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

const fetchMyRides = async (
  token: string | null,
  searchTerm: string,
  status: string,
  page: number,
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
    throw new Error(
      errorData.message || "Failed to load ride requests from server",
    );
  }

  const json = await res.json();
  return {
    data: (json.data || []) as RideRequestItem[],
    meta: json.meta || { total: 0, totalPage: 1 },
  };
};

function CustomerDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthStore();

  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const paymentRedirectStatus = searchParams.get("payment");

  const [selectedRide, setSelectedRide] = useState<RideRequestItem | null>(
    null,
  );

  useEffect(() => {
    if (!paymentRedirectStatus) return;
    if (paymentRedirectStatus === "success") {
      toast.success("Payment successful! Ambulance dispatch confirmed.");
    } else if (paymentRedirectStatus === "failed") {
      toast.error("Payment failed on SSLCommerz. Ride has been cancelled.");
    } else if (paymentRedirectStatus === "cancelled") {
      toast.warning("Payment was cancelled on SSLCommerz.");
    }
    queryClient.invalidateQueries({ queryKey: ["customerRides"] });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("payment");
    const cleanUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", cleanUrl);
  }, [paymentRedirectStatus, pathname, searchParams, queryClient]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customerRides", token, search, statusFilter, page],
    queryFn: () => fetchMyRides(token, search, statusFilter, page),
    enabled: !!token && isAuthenticated,
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
    if (item.payment?.status === "PAID") {
      return "COMPLETED";
    }
    if (item.status === "CANCELLED" || item.payment?.status === "FAILED") {
      return "CANCELLED";
    }
    return item.status;
  };

  const ridesList = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const totalCount = data?.meta?.total || ridesList.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ambulance dispatch tracking, status updates, and history.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Book New Ambulance
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            defaultValue={search}
            placeholder="Search by pickup, destination..."
            onChange={(e) => updateUrl({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => updateUrl({ status: e.target.value, page: 1 })}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="COMPLETED">Completed (Paid)</option>
            <option value="CANCELLED">Cancelled (Failed)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Failed to load dispatch history
            </p>
            <p className="text-xs text-slate-400">
              {(error as any)?.message || "Check backend connection."}
            </p>
          </div>
        ) : ridesList.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ambulance className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              No dispatch requests found
            </p>
            <p className="text-xs text-slate-400">
              Go to Services to request your first ambulance.
            </p>
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
                  const isCancelled = displayStatus === "CANCELLED";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          #{serialNo}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {item.pickupAddress}
                        </span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="text-slate-600">
                          {item.destination}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {item.ambulanceType.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ৳{item.fareAmount || 1500} BDT
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAID
                          </span>
                        ) : isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            FAILED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                            UNPAID
                          </span>
                        )}
                      </td>

                      {/* Dispatch Status Badge */}
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

                      {/* ACTIONS COLUMN */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Payment Successful
                            </span>
                          ) : isCancelled ? (
                            <button
                              onClick={() => handleGoToPayment(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                              title="Retry Payment"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Retry Pay
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGoToPayment(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                              title="Go to payment page"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRide(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
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
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> (
              {totalCount} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => updateUrl({ page: page - 1 })}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => updateUrl({ page: page + 1 })}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Ride Details - {selectedRide.id.slice(-6).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRide(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div>
                  <span className="font-bold text-slate-700">From:</span>{" "}
                  {selectedRide.pickupAddress}
                </div>
                <div>
                  <span className="font-bold text-slate-700">To:</span>{" "}
                  {selectedRide.destination}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Fare
                  </span>
                  <span className="font-extrabold text-slate-800">
                    ৳{selectedRide.fareAmount} BDT
                  </span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Payment
                  </span>
                  <span
                    className={`font-extrabold ${selectedRide.payment?.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {selectedRide.payment?.status || "UNPAID"}
                  </span>
                </div>
              </div>
              <div className="p-2.5 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Effective Status
                </span>
                <span className="font-extrabold text-slate-800">
                  {getDisplayStatus(selectedRide)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRide(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading customer portal...
            </div>
          }
        >
          <CustomerDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
