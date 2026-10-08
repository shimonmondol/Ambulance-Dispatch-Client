"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Activity,
  AlertCircle,
  Truck,
  Loader2,
  Filter,
  Hash,
} from "lucide-react";
import Footer from "@/components/Footer";

// Data model interface (image backend theke asbe)
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
  } | null;
}

export default function ServicesPage() {
  const [ambulances, setAmbulances] = useState<AmbulanceItem[]>([]);
  const [filteredAmbulances, setFilteredAmbulances] = useState<AmbulanceItem[]>(
    [],
  );
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/ambulances`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Server returned error status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          const dataList: AmbulanceItem[] = Array.isArray(result.data)
            ? result.data
            : result.data?.data || [];
          setAmbulances(dataList);
          setFilteredAmbulances(dataList);
        } else {
          setError(result.message || "Failed to load ambulances.");
        }
      } catch (err: any) {
        setError(
          err.message ||
            "Unable to connect to the server. Please check backend connection.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, []);

  // Filter Selection
  const handleFilterChange = (type: string) => {
    setSelectedType(type);
    if (type === "ALL") {
      setFilteredAmbulances(ambulances);
    } else {
      setFilteredAmbulances(ambulances.filter((amb) => amb.type === type));
    }
  };

  // Type-based Pricing Fallback
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

  const formatAmbulanceType = (type: string) => {
    return type.replace(/_/g, " ");
  };

  return (
    <main className="w-full bg-slate-50 font-sans text-slate-800">
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1600&q=80"
            alt="Ambulance Services"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-red-400">Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Available Fleet <br />
              <span className="text-red-500">24/7 Emergency Dispatch</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed">
              Explore registered emergency and critical transport ambulances.
              Every vehicle is inspected, certified, and ready for immediate
              deployment.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. AMBULANCES LISTING ================= */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                Emergency Fleet{" "}
                <span className="h-0.5 w-6 bg-red-500 inline-block"></span>
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                Select Your Required Ambulance
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Transparent fares with rapid response across all urban zones.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
    <Filter className="w-3.5 h-3.5" /> Filter:
  </span>
  {[
    "ALL",
    "ICU",
    "ADVANCED_LIFE_SUPPORT",
    "BASIC_LIFE_SUPPORT",
  ].map((type) => (
    <button
      key={type}
      type="button"
      onClick={() => handleFilterChange(type)}
      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
        selectedType === type
          ? "bg-red-600 text-white shadow-sm shadow-red-200"
          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {type === "ALL"
        ? "All Ambulances"
        : formatAmbulanceType(type)}
    </button>
  ))}
</div>
          </div>

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
                Failed to Retrieve Fleet
              </h3>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* Empty Records */}
          {!loading && !error && filteredAmbulances.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
              <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">
                No Ambulances Found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                No active ambulances currently match this criteria.
              </p>
            </div>
          )}

          {/* Ambulance Cards Grid */}
          {!loading && !error && filteredAmbulances.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAmbulances.map((item) => {
                const priceInfo = getAmbulancePrice(
                  item.type,
                  item.baseFare,
                  item.perKmRate,
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Vehicle Image (Direct backend image property) */}
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || item.registrationNo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                            <Truck className="w-10 h-10 stroke-[1.5]" />
                            <span className="text-[11px] font-medium">
                              No Image Uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details Box */}
                      <div className="p-6 space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            {/* Ambulance Name / Fallback Type */}
                            <div>
                              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                {item.name || formatAmbulanceType(item.type)}
                              </h3>
                              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
                                {formatAmbulanceType(item.type)}
                              </span>
                            </div>

                            {/* Operational Status Badge */}
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${
                                item.isOperational
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                  : "text-amber-700 bg-amber-50 border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isOperational
                                    ? "bg-emerald-500 animate-pulse"
                                    : "bg-amber-500"
                                }`}
                              />
                              {item.isOperational
                                ? "Operational"
                                : "Maintenance"}
                            </span>
                          </div>

                          {/* Registration No */}
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
                            <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Reg No:</span>
                            <span className="font-semibold text-slate-700">
                              {item.registrationNo}
                            </span>
                          </p>
                        </div>

                        {/* Specs & Pricing */}
                        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />{" "}
                              Response Time
                            </span>
                            <span className="font-bold text-slate-900">
                              8 - 15 Mins
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                              Onboard Paramedic
                            </span>
                            <span className="font-bold text-slate-900">
                              Available
                            </span>
                          </div>

                          {/* Estimated Fare */}
                          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-dashed border-slate-200">
                            <div>
                              <span className="font-bold text-slate-700 block text-xs">
                                Estimated Fare
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Base + Per KM
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-red-600">
                                ৳{priceInfo.base}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500 block">
                                + ৳{priceInfo.perKm}/km
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking & Call CTA */}
                    <div className="p-6 pt-0 flex gap-2">
                      <a
                        href="tel:911"
                        className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition"
                        title="Call Dispatch"
                      >
                        <Phone className="w-4 h-4 fill-slate-700" />
                      </a>

                      <Link
                        href={`/services/${item.id}`}
                        className="flex-1 py-3 px-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-xs"
                      >
                        <span>Ambulance Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
