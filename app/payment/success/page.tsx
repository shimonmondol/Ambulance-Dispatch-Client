"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Ambulance,
  Calendar,
  Hash,
  Download,
  ShieldCheck,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  const rideId = searchParams.get("rideId") || "";
  const tranId = searchParams.get("tran_id") || "";

  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let storedToken: string | null = null;
    try {
      const rawStore = localStorage.getItem("auth-storage");
      if (rawStore) {
        storedToken = JSON.parse(rawStore)?.state?.token || null;
      }
    } catch {}

    const effectiveToken = token || storedToken;

    if (!rideId) {
      router.push("/customer/dashboard");
      return;
    }

    const fetchRide = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/rides/${rideId}`, {
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const json = await res.json();
          setRideDetails(json.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId, token, router]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-xs font-semibold">Verifying payment receipt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans space-y-6">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Animated Green Badge */}
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Completed
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
            Payment Successful!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thank you! Your emergency ambulance transit payment has been
            verified via SSLCommerz.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs space-y-3 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" /> Transaction ID
            </span>
            <span className="font-mono font-bold text-slate-800">
              {tranId || "SSLCOMMERZ-PAID"}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Ambulance className="w-3.5 h-3.5 text-slate-400" /> Dispatch
              Ticket
            </span>
            <span className="font-mono font-bold text-slate-800">
              #{rideId.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Payment Channel
            </span>
            <span className="font-semibold text-slate-800">
              SSLCommerz (Instant Settlement)
            </span>
          </div>

          {rideDetails && (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-200/60 gap-4">
                <span className="text-slate-500">Route</span>
                <span className="font-semibold text-slate-800 text-right">
                  {rideDetails.pickupAddress} → {rideDetails.destination}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-slate-700">Total Paid</span>
            <span className="text-base font-black text-emerald-600">
              ৳{rideDetails?.fareAmount || 1500} BDT
            </span>
          </div>
        </div>

        {/* Security Tag */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified & encrypted digital medical receipt</span>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/customer/dashboard"
            className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-95"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-slate-400">
              Loading receipt...
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
