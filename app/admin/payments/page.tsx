"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  DollarSign,
  User,
  Phone,
  MapPin,
  Ambulance,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

// Interfaces & Types
type PaymentStatusType = "PAID" | "UNPAID" | "FAILED";

interface PaymentItem {
  id: string;
  amount: number;
  status: PaymentStatusType;
  transactionId?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  rideRequest?: {
    id: string;
    pickupAddress: string;
    destination: string;
    ambulanceType: string;
    customer?: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
  } | null;
}

interface PaymentLedgerResponse {
  summary: {
    totalPaid: number;
    totalPending: number;
    totalFailed: number;
    totalTransactions: number;
  };
  payments: PaymentItem[];
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

// Main Content Component
function AdminPaymentsContent() {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1. Fetch Payments Ledger & Financial Analytics
  const { data, isLoading, isError, error, refetch } =
    useQuery<PaymentLedgerResponse>({
      queryKey: ["adminPayments", token, statusFilter],
      queryFn: async () => {
        const url =
          statusFilter === "ALL"
            ? `${API_BASE}/admin/payments`
            : `${API_BASE}/admin/payments?status=${statusFilter}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(
            errJson.message || "Failed to load payment transactions",
          );
        }

        const json = await res.json();
        return json.data;
      },
      enabled: Boolean(token && isAuthenticated),
    });

  const payments = data?.payments || [];
  const summary = data?.summary || {
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    totalTransactions: 0,
  };

  // 2. Mutation: Update Transaction Settlement Status
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: PaymentStatusType;
    }) => {
      setUpdatingId(id);
      const res = await fetch(`${API_BASE}/admin/payments/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update settlement status");
      }

      return res.json();
    },
    onSuccess: (resData) => {
      toast.success(resData.message || "Payment status updated");
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
    },
    onError: (err: any) => toast.error(err.message),
    onSettled: () => setUpdatingId(null),
  });

  // Client-side search filtering
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const term = searchQuery.trim().toLowerCase();
      if (!term) return true;

      const txId = (item.transactionId || "").toLowerCase();
      const customerName = (
        item.rideRequest?.customer?.name || ""
      ).toLowerCase();
      const phone = item.rideRequest?.customer?.phone || "";
      const missionId = (item.rideRequest?.id || "").toLowerCase();
      const pickup = (item.rideRequest?.pickupAddress || "").toLowerCase();
      const dropoff = (item.rideRequest?.destination || "").toLowerCase();

      return (
        txId.includes(term) ||
        customerName.includes(term) ||
        phone.includes(term) ||
        missionId.includes(term) ||
        pickup.includes(term) ||
        dropoff.includes(term)
      );
    });
  }, [payments, searchQuery]);

  // Badge Helper
  const renderStatusBadge = (status: PaymentStatusType) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAID
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> PENDING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> FAILED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Header Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Financial Accounting
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Payment & Revenue Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Audit emergency trip fare settlements, transaction gateways, and
            cash disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer"
            title="Refresh Transactions"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Collected Revenue */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Collected Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              ৳{summary.totalPaid.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Pending Settlements */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Pending Settlements
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              ৳{summary.totalPending.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Failed / Disputed */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Failed / Unsettled
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              ৳{summary.totalFailed.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by TxID, patient name, phone, or route..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "PAID", "UNPAID", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
              }`}
            >
              {status === "UNPAID" ? "PENDING" : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transactions Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-xs font-semibold">
              Streaming financial transactions...
            </p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Failed to load transactions
            </p>
            <p className="text-xs text-slate-400">
              {(error as Error)?.message}
            </p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              No payment records found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Transaction & Mission</th>
                  <th className="py-3.5 px-4">Patient / Caller</th>
                  <th className="py-3.5 px-4">Transit Route</th>
                  <th className="py-3.5 px-4">Fleet Type</th>
                  <th className="py-3.5 px-4">Fare Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => {
                  const customer = payment.rideRequest?.customer;
                  const isProcessing = updatingId === payment.id;

                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      {/* Transaction ID & Date */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-slate-900">
                          {payment.transactionId ||
                            `TX-${payment.id.slice(-6).toUpperCase()}`}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(payment.createdAt).toLocaleString()}
                        </div>
                        {payment.rideRequest?.id && (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            Trip: #
                            {payment.rideRequest.id.slice(-6).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Caller / Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {customer?.name || "Emergency Patient"}
                        </div>
                        {customer?.phone && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {customer.phone}
                          </div>
                        )}
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate text-slate-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">
                            {payment.rideRequest?.pickupAddress || "N/A"}
                          </span>
                        </div>
                        <div className="truncate text-[11px] text-slate-400 mt-0.5">
                          To: {payment.rideRequest?.destination || "N/A"}
                        </div>
                      </td>

                      {/* Fleet Type */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                          {payment.rideRequest?.ambulanceType || "STANDARD"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          ৳{payment.amount.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase">
                          {payment.paymentMethod || "CARD / STRIPE"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(payment.status)}
                      </td>

                      {/* Settlement Action Toggle */}
                      <td className="py-3.5 px-5 text-right">
                        {payment.status !== "PAID" ? (
                          <button
                            onClick={() =>
                              updateStatus({ id: payment.id, status: "PAID" })
                            }
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateStatus({ id: payment.id, status: "UNPAID" })
                            }
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[10px] transition cursor-pointer disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                            Set Pending
                          </button>
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
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading financial ledger...
            </div>
          }
        >
          <AdminPaymentsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
