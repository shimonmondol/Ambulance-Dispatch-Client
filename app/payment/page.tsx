"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  Smartphone
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const rideId = searchParams.get("rideId") || "";
  const queryAmount = Number(searchParams.get("amount")) || 1500;
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loadingRide, setLoadingRide] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (!isClientMounted) return;

    let storedToken: string | null = null;
    try {
      const rawStore = localStorage.getItem("auth-storage");
      if (rawStore) {
        const parsed = JSON.parse(rawStore);
        storedToken = parsed?.state?.token || null;
      }
    } catch {}

    const effectiveToken = token || storedToken;

    if (!effectiveToken && !isAuthenticated) {
      toast.error("Please login to proceed with payment");
      router.push("/signin");
      return;
    }

    if (!rideId) {
      toast.error("Invalid payment session: Ride ID missing");
      router.push("/customer/dashboard");
      return;
    }

    const loadRide = async () => {
      try {
        setLoadingRide(true);
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
        // Fallback to query param
      } finally {
        setLoadingRide(false);
      }
    };

    if (effectiveToken) {
      loadRide();
    }
  }, [isClientMounted, token, isAuthenticated, rideId, router]);

  const finalAmount = rideDetails?.fareAmount || queryAmount;

  const handleCheckout = async () => {
    try {
      setProcessing(true);

      const activeToken = token || (() => {
        try {
          const raw = localStorage.getItem("auth-storage");
          return raw ? JSON.parse(raw)?.state?.token : null;
        } catch {
          return null;
        }
      })();

      const res = await fetch(`${API_BASE}/payment/ssl-init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ rideId }),
      });

      const json = await res.json();
      const gatewayUrl = json?.data?.GatewayPageURL || json?.GatewayPageURL;

      if (res.ok && gatewayUrl) {
        window.location.href = gatewayUrl;
        return;
      }
      throw new Error(json?.message || "Failed to initialize SSLCommerz gateway session");
    } catch (err: any) {
      toast.error(err.message || "Payment gateway connection error");
      setProcessing(false);
    }
  };

  if (!isClientMounted || loadingRide) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600 mb-3" />
        <p className="text-xs font-semibold">Verifying secure session & loading ride...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <Link
          href="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customer Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: SSLCommerz Payment Card */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Secure Checkout
                </span>
                <h1 className="text-xl font-black text-slate-900 mt-1">Payment Checkout</h1>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Ride Details Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Dispatch Ticket ID</span>
                <span className="font-mono font-bold text-slate-800">
                  {rideId ? rideId.slice(-8).toUpperCase() : "EMERGENCY"}
                </span>
              </div>
              {rideDetails?.pickupAddress && (
                <div className="flex items-start justify-between text-slate-500 gap-4">
                  <span>Pickup</span>
                  <span className="font-semibold text-slate-800 text-right">{rideDetails.pickupAddress}</span>
                </div>
              )}
              {rideDetails?.destination && (
                <div className="flex items-start justify-between text-slate-500 gap-4">
                  <span>Destination</span>
                  <span className="font-semibold text-slate-800 text-right">{rideDetails.destination}</span>
                </div>
              )}
            </div>

            {/* SSLCommerz Gateway Box */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Selected Payment Method
              </label>

              <div className="w-full p-4 rounded-2xl border border-rose-500 bg-rose-50/40 ring-1 ring-rose-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-slate-900">SSLCommerz Secured Gateway</p>
                    <p className="text-[11px] text-slate-500">bKash, Nagad, Rocket, Cards & Internet Banking</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting to SSLCommerz...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ৳{finalAmount} with SSLCommerz
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Fare Breakdown */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 tracking-tight border-b border-slate-100 pb-3">
              Fare Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ambulance Fare</span>
                <span className="font-semibold text-slate-800">৳{finalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Priority Dispatch</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway Processing Fee</span>
                <span className="font-semibold text-emerald-600">৳0.00</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900">Total Payable</span>
              <span className="font-black text-rose-600 text-lg">৳{finalAmount} BDT</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading checkout...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}