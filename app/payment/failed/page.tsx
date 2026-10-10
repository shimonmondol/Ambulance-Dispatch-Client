"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  XCircle,
  RotateCcw,
  ArrowRight,
  Ambulance,
  Hash,
  AlertTriangle,
  Clock,
  Loader2,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const rideId = searchParams.get("rideId") || "";
  const tranId = searchParams.get("tran_id") || "";
  const reason = searchParams.get("reason") || "declined";

  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) {
      router.push("/customer/dashboard");
      return;
    }

    // ১. স্টোর অথবা লোকাল স্টোরেজ থেকে নিরাপদ টোকেন রিকভারি
    let effectiveToken = token;
    if (!effectiveToken && typeof window !== "undefined") {
      try {
        const rawStore = localStorage.getItem("auth-storage");
        if (rawStore) {
          effectiveToken = JSON.parse(rawStore)?.state?.token || null;
        }
      } catch {}
    }

    const fetchRide = async () => {
      try {
        setLoading(true);
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (effectiveToken) {
          headers["Authorization"] = `Bearer ${effectiveToken}`;
        }

        const res = await fetch(`${API_BASE}/rides/${rideId}`, { headers });
        if (res.ok) {
          const json = await res.json();
          setRideDetails(json.data);
        }
      } catch {
        // ব্যাকএন্ড কল ফেইল করলেও পেজ ক্র্যাশ করবে না
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId, token]);

  // ফেইল হওয়ার কারণ অনুযায়ী বার্তা
  const getFailureReason = () => {
    switch (reason) {
      case "user_cancelled":
        return "Transaction was cancelled by user on the payment gateway.";
      case "server_error":
        return "A server communication issue occurred during transaction confirmation.";
      default:
        return "Your transaction was declined by the bank or gateway operator.";
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600 mb-3" />
        <p className="text-xs font-semibold">Verifying transaction status...</p>
      </div>
    );
  }

  const payableAmount = rideDetails?.fareAmount || 1500;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans space-y-6">
      {/* Failed Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-center">
        {/* Animated Red Badge */}
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-xs animate-in zoom-in-50 duration-300">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Payment Unsuccessful
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
            Payment Failed
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {getFailureReason()}
          </p>
        </div>

        {/* Transaction Summary Box */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs space-y-3 text-left">
          {tranId && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Transaction ID
              </span>
              <span className="font-mono font-bold text-slate-800">
                {tranId}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Ambulance className="w-3.5 h-3.5 text-slate-400" /> Dispatch Ticket
            </span>
            <span className="font-mono font-bold text-slate-800">
              #{rideId.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Gateway
            </span>
            <span className="font-semibold text-slate-800">
              SSLCommerz
            </span>
          </div>

          {rideDetails && (
            <div className="flex items-start justify-between pb-3 border-b border-slate-200/60 gap-4">
              <span className="text-slate-500 flex items-center gap-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Route
              </span>
              <span className="font-semibold text-slate-800 text-right">
                {rideDetails.pickupAddress} → {rideDetails.destination}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-slate-700">Amount Due</span>
            <span className="text-base font-black text-rose-600">
              ৳{payableAmount.toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Security / Safe Alert Notice */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-amber-900 text-[11px] flex items-start gap-2.5 text-left">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            No funds have been permanently deducted from your account. You can retry safely with bKash, Nagad, or another card.
          </span>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/booking?retryRideId=${rideId}`}
            className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </Link>
          <Link
            href="/customer/dashboard"
            className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-slate-400">
              Loading error details...
            </div>
          }
        >
          <PaymentFailedContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}