"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Ambulance,
  MapPin,
  Phone,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Hash,
  Clock,
  Zap,
  Activity,
  HeartPulse,
  Navigation,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";

interface AmbulanceDetail {
  id: string;
  name?: string;
  registrationNo: string;
  type: string;
  isOperational: boolean;
  baseFare?: number;
  perKmRate?: number;
  image?: string;
}

export default function AmbulanceBookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { token, isAuthenticated } = useAuthStore();

  const [ambulance, setAmbulance] = useState<AmbulanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const getAmbulanceImage = (type: string, customImage?: string) => {
    if (customImage) return customImage;
    switch (type) {
      case "ICU":
        return "https://i.ibb.co.com/DhbM5h1/Ambulance.jpg";
      case "ADVANCED_LIFE_SUPPORT":
        return "https://i.ibb.co.com/PGwVRSBr/Advance.jpg";
      default:
        return "https://i.ibb.co.com/0pK1WY2R/Basic.jpg";
    }
  };

  const getAmbulanceFeatures = (type: string) => {
    switch (type) {
      case "ICU":
        return [
          "Built-in Ventilator & Oxygen Monitor",
          "Cardiac Defibrillator & ECG",
          "Specialized Critical Care Paramedic",
          "Emergency Infusion Pump",
        ];
      case "ADVANCED_LIFE_SUPPORT":
        return [
          "Continuous Oxygen Support",
          "IV Fluid Administration Kit",
          "Trained Emergency Paramedic",
          "Multi-parameter Patient Monitor",
        ];
      default:
        return [
          "Standard Medical Oxygen Cylinder",
          "First Aid & Trauma Stabilization",
          "Hydraulic Stretcher Bed",
          "Rapid Urban Transit Clearance",
        ];
    }
  };

  useEffect(() => {
    const fetchAmbulanceDetails = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://ambulance-dispatch-mu.vercel.app";

        const res = await fetch(`${baseUrl}/ambulances/${id}`);
        if (res.ok) {
          const json = await res.json();
          setAmbulance(json.data || json);
        } else {
          const allRes = await fetch(`${baseUrl}/ambulances`);
          const allJson = await allRes.json();
          const list: AmbulanceDetail[] = Array.isArray(allJson)
            ? allJson
            : allJson.data || [];
          const found = list.find((item) => String(item.id) === String(id));
          if (found) setAmbulance(found);
          else throw new Error("Ambulance details not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load ambulance details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAmbulanceDetails();
  }, [id]);

  const handleConfirmRide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      toast.error("Please sign in as a customer to dispatch an ambulance.");
      router.push("/signin");
      return;
    }

    if (!pickupLocation.trim() || !destination.trim()) {
      toast.error("Please enter both pickup and destination locations.");
      return;
    }

    try {
      setSubmitting(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://ambulance-dispatch-mu.vercel.app";

      const payload = {
        ambulanceId: ambulance?.id || id,
        pickupLocation,
        dropLocation: destination,
        ambulanceType: ambulance?.type || "BASIC_LIFE_SUPPORT",
        contactNumber,
      };

      const res = await fetch(`${baseUrl}/rides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to submit emergency dispatch request",
        );
      }

      toast.success(
        "Emergency ride request created successfully! Redirecting...",
      );
      router.push("/customer/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Could not complete ride request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-rose-500 selection:text-white">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className="min-h-[55vh] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin" />
              <Ambulance className="w-6 h-6 text-rose-600 absolute" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Connecting with live fleet registry...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Checking vehicle operational status
            </p>
          </div>
        ) : error || !ambulance ? (
          <div className="min-h-[55vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 ring-8 ring-rose-50/50">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Vehicle Unavailable
            </h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              {error ||
                "We couldn't retrieve information for this specific ambulance."}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Available Fleet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Navigation & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Ambulance Overview
              </Link>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Unit Ready for Immediate Dispatch
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Vehicle Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Clean Vehicle Image (No Text/Badges Overlay) */}
                  <div className="relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={getAmbulanceImage(ambulance.type, ambulance.image)}
                      alt={ambulance.name || ambulance.registrationNo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vehicle Heading & Details Section (Below Image) */}
                  <div className="p-6 sm:p-7 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
                          {ambulance.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-500" />{" "}
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-lg">
                        <Hash className="w-3.5 h-3.5 text-rose-500" />
                        <span>Registration:</span>
                        <strong className="text-slate-800">
                          {ambulance.registrationNo}
                        </strong>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {ambulance.name || "Emergency Medical Transit"}
                    </h1>
                  </div>

                  {/* Highlights Strip */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50 p-4 text-center">
                    <div className="px-2">
                      <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Response Time
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        8 - 15 Mins
                      </span>
                    </div>
                    <div className="px-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Paramedic Support
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Certified
                      </span>
                    </div>
                    <div className="px-2">
                      <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Transit Route
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Priority ETA
                      </span>
                    </div>
                  </div>
                  {/* Pricing Footer */}
                  <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Standard Pricing
                      </span>
                      <span className="text-xs text-slate-300">
                        Base Dispatch + Per Km Rate
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black tracking-tight text-white">
                        BDT {ambulance.baseFare || 1500}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        + BDT {ambulance.perKmRate || 40}/km
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Booking Form */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs sticky top-8">
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                      Fast Dispatch
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Confirm Dispatch Details
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the patient&apos;s current address and target
                      destination to trigger assignment.
                    </p>
                  </div>
                  <form onSubmit={handleConfirmRide} className="space-y-4">
                    {/* Pickup Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        Patient Pickup Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                      />
                    </div>
                    {/* Destination Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        Destination Hospital
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Square Hospital, Panthapath"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                      />
                    </div>
                    {/* Contact Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        Emergency Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +880 17XXXXXXXX"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                      />
                    </div>
                    {/* Informational Notice */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5 text-amber-900 text-xs">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed text-[11px]">
                        The ride request will be initialized as{" "}
                        <strong>PENDING</strong> on your customer dashboard. You
                        can review <strong>PAY NOW</strong> or{" "}
                        <strong>CANCEL</strong> anytime prior to dispatch.
                      </p>
                    </div>
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed mt-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Ambulance...</span>
                        </>
                      ) : (
                        <>
                          <Ambulance className="w-4 h-4" />
                          <span>Ride Emergency Ambulance</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
