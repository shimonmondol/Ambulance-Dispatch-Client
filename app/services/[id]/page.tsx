"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Activity,
  AlertCircle,
  Truck,
  Loader2,
  Hash,
  ArrowLeft,
  Building2,
  MapPin,
} from "lucide-react";
import Footer from "@/components/Footer";

// ServicesPage-এর সাথে হুবহু ডাটা মডেল
interface AmbulanceItem {
  id: string;
  name?: string;
  registrationNo: string;
  type: "ICU" | "ADVANCED_LIFE_SUPPORT" | "BASIC_LIFE_SUPPORT" | string;
  image?: string;
  isOperational: boolean;
  baseFare?: number;
  perKmRate?: number;
  providerId?: string | null;
  provider?: {
    id: string;
    organizationName?: string;
    contactNumber?: string;
    address?: string;
  } | null;
}

export default function AmbulanceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // params.id স্ট্রিং হিসেবে নেওয়া
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [ambulance, setAmbulance] = useState<AmbulanceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // id না পাওয়া পর্যন্ত থামবে
    if (!id || typeof id !== "string") return;

    const fetchAmbulanceDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://ambulance-dispatch-mu.vercel.app";

        const res = await fetch(`${baseUrl}/ambulances/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // ব্রাউজার ক্যাশ যাতে আটকে না রাখে
        });

        const result = await res.json();
        console.log("Single Ambulance Data:", result);

        if (result.success && result.data) {
          // ডেটা নেস্টিং ফিক্স
          const singleData =
            result.data.data || result.data.ambulance || result.data;
          setAmbulance(singleData);
        } else {
          setError(result.message || "Ambulance not found");
        }
      } catch (err: any) {
        setError("Failed to load ambulance details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulanceDetails();
  }, [id]);

  const getAmbulancePrice = (
    type: string,
    backendBase?: number,
    backendPerKm?: number,
  ) => {
    if (backendBase && backendBase > 0) {
      return { base: backendBase, perKm: backendPerKm || 40 };
    }

    switch (type) {
      case "ICU":
        return { base: 3500, perKm: 75 };
      case "ADVANCED_LIFE_SUPPORT":
        return { base: 2800, perKm: 60 };
      case "BASIC_LIFE_SUPPORT":
        return { base: 1800, perKm: 45 };
      default:
        return { base: 1500, perKm: 40 };
    }
  };

  const formatAmbulanceType = (type?: string) => {
    return type ? type.replace(/_/g, " ") : "Emergency";
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingPayload = {
      ambulanceId: id,
      pickupLocation,
      destination,
      phone: customerPhone,
      notes,
    };

    console.log("Customer ride request payload:", bookingPayload);

    setTimeout(() => {
      setSubmitting(false);
      router.push(`/customer/dashboard?booked=success`);
    }, 1200);
  };

  const priceInfo = ambulance
    ? getAmbulancePrice(ambulance.type, ambulance.baseFare, ambulance.perKmRate)
    : { base: 1500, perKm: 40 };

  return (
    <main className="w-full bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col justify-between">
      <div>
        {/* ================= 1. HERO BANNER ================= */}
        <section className="relative overflow-hidden bg-slate-900 py-14 md:py-20 text-white">
          {/* ব্যানারেও ব্যাকএন্ডের নিজস্ব ইমেজ ব্লারড/ডিম ব্যাকগ্রাউন্ড হিসেবে আসবে */}
          <div className="absolute inset-0 z-0">
            {ambulance?.image ? (
              <img
                src={ambulance.image}
                alt={ambulance.name || ambulance.registrationNo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // ইমেজ লিংক ইনভ্যালিড হলে যাতে এরর না দেয়
                  console.error(
                    "Image failed to load from URL:",
                    ambulance.image,
                  );
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                <Truck className="w-12 h-12 stroke-[1.5]" />
                <span className="text-xs font-medium">No Image Uploaded</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Breadcrumb / Back Link */}
              <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <Link href="/services" className="hover:text-white transition">
                  Services
                </Link>
                <span>/</span>
                <span className="text-red-400">Details</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                    {ambulance?.name ||
                      (ambulance
                        ? formatAmbulanceType(ambulance.type)
                        : "Ambulance Details")}
                  </h1>

                  {ambulance && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                        {formatAmbulanceType(ambulance.type)}
                      </span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-300 font-medium">
                        Immediate Response Dispatch
                      </span>
                    </div>
                  )}
                </div>

                {ambulance && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-700 bg-slate-800/80 self-start md:self-auto shrink-0">
                    <Hash className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-white">
                      {ambulance.registrationNo}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. DETAILS & BOOKING SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6 relative z-20">
          {/* Loading Indicator */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-500 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-3" />
              <p className="text-sm font-semibold">
                Connecting with dispatch server...
              </p>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-xl mx-auto my-10 shadow-sm">
              <AlertCircle className="w-9 h-9 text-red-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-red-900">
                Failed to Retrieve Vehicle
              </h3>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                {error}
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Services</span>
              </Link>
            </div>
          )}

          {/* Ambulance Profile + Booking Grid */}
          {!loading && ambulance && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Image, Vehicle Details & Fare (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                  {/* সরাসরি ব্যাকএন্ডের ambulance.image */}
                  <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {ambulance.image ? (
                      <img
                        src={ambulance.image}
                        alt={ambulance.name || ambulance.registrationNo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                        <Truck className="w-12 h-12 stroke-[1.5]" />
                        <span className="text-xs font-medium">
                          No Image Uploaded
                        </span>
                      </div>
                    )}

                    {/* Operational Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${
                          ambulance.isOperational
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ambulance.isOperational
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-amber-500"
                          }`}
                        />
                        {ambulance.isOperational
                          ? "Operational & Ready"
                          : "Under Maintenance"}
                      </span>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                            {ambulance.name ||
                              formatAmbulanceType(ambulance.type)}
                          </h2>
                          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
                            {formatAmbulanceType(ambulance.type)}
                          </span>
                        </div>
                      </div>

                      {/* Registration No */}
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
                        <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Reg No:</span>
                        <span className="font-semibold text-slate-700">
                          {ambulance.registrationNo}
                        </span>
                      </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Response Time
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            8 - 15 Mins rapid dispatch
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Onboard Paramedic
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Certified Emergency Medical Staff
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Provider Info (যদি থাকে) */}
                    {ambulance.provider && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Service Provider
                          </h4>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">
                            {ambulance.provider.organizationName ||
                              "Verified Emergency Fleet"}
                          </p>
                          {ambulance.provider.contactNumber && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Contact: {ambulance.provider.contactNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Estimated Fare Box */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-red-50/60 border border-red-100">
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">
                          Estimated Fare
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Base + Distance Fare
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-red-600">
                          ৳{priceInfo.base}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 block">
                          + ৳{priceInfo.perKm}/km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Ride Booking Form (5 Cols) */}
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40">
                <div className="mb-6">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    Request Ride{" "}
                    <span className="h-0.5 w-6 bg-red-500 inline-block"></span>
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Book {ambulance.name || "This Ambulance"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit the patient pickup location for instant dispatch.
                  </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pickup Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="House, Road, Area (e.g. Mohammadpur, Dhaka)"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Destination Hospital{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Hospital Name (e.g. Dhaka Medical College)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                      />
                      <Activity className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Oxygen cylinder needed, wheelchair support"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !ambulance.isOperational}
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                      ambulance.isOperational
                        ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        : "bg-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Ride Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <a
                    href="tel:911"
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-3.5 h-3.5 fill-slate-700" />
                    <span>Call 911 for Instant Emergency Support</span>
                  </a>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
