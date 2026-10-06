"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Sparkles,
  Zap,
  Activity,
  HeartPulse,
  Navigation
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
          "Emergency Infusion Pump"
        ];
      case "ADVANCED_LIFE_SUPPORT":
        return [
          "Continuous Oxygen Support",
          "IV Fluid Administration Kit",
          "Trained Emergency Paramedic",
          "Multi-parameter Patient Monitor"
        ];
      default:
        return [
          "Standard Medical Oxygen Cylinder",
          "First Aid & Trauma Stabilization",
          "Hydraulic Stretcher Bed",
          "Rapid Urban Transit Clearance"
        ];
    }
  };

  useEffect(() => {
    const fetchAmbulanceDetails = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/ambulances/${id}`);
        if (res.ok) {
          const json = await res.json();
          setAmbulance(json.data || json);
        } else {
          const allRes = await fetch(`${baseUrl}/ambulances`);
          const allJson = await allRes.json();
          const list: AmbulanceDetail[] = Array.isArray(allJson) ? allJson : allJson.data || [];
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
        throw new Error(result.message || "Failed to submit emergency dispatch request");
      }

      toast.success("Emergency ride request created successfully! Redirecting...");
      router.push("/customer/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Could not complete ride request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500 bg-slate-50 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-3" />
        <p className="text-sm font-semibold">Connecting with live fleet registry...</p>
      </div>
    );
  }

  if (error || !ambulance) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50 font-sans">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Vehicle Not Available</h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">{error || "Vehicle information could not be retrieved."}</p>
        <Link href="/services" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Services
        </Link>
      </div>
    );
  }

  const features = getAmbulanceFeatures(ambulance.type);
  const vehicleImg = getAmbulanceImage(ambulance.type, ambulance.image);

  return (
    <main className="min-h-screen bg-slate-50/70 py-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet Overview
          </Link>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Dispatch Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: Image & Rich Details ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Visual Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="relative h-64 sm:h-80 w-full bg-slate-900">
                <img
                  src={vehicleImg}
                  alt={ambulance.name || ambulance.registrationNo}
                  className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    {ambulance.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" /> Operational
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
                    {ambulance.name || "Emergency Medical Transit"}
                  </h1>
                  <p className="text-xs text-slate-200 font-mono flex items-center gap-1.5 mt-1">
                    <Hash className="w-3.5 h-3.5 text-red-400" />
                    <span>Registration:</span>
                    <strong className="tracking-wide text-white">{ambulance.registrationNo}</strong>
                  </p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="p-6 grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/50 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
                  <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Response</span>
                  <span className="text-xs font-black text-slate-800">8 - 15 Mins</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Paramedic</span>
                  <span className="text-xs font-black text-slate-800">Onboard</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transit</span>
                  <span className="text-xs font-black text-slate-800">Priority Corridor</span>
                </div>
              </div>

              {/* Onboard Capabilities */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-600" />
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Onboard Life-Support Equipment</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fare Summary Footer */}
              <div className="p-6 bg-slate-900 text-white rounded-b-3xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Standard Fare Rate</span>
                  <span className="text-xs text-slate-300">Base Dispatch + Per Kilometer</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">৳{ambulance.baseFare || 1500}</span>
                  <span className="text-[11px] text-slate-400 block font-normal">+ ৳{ambulance.perKmRate || 40}/km transit</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Clean Dispatch Form ================= */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 sticky top-6">
              
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-full border border-red-200 inline-block mb-2">
                  Direct Dispatch
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Confirm Ride Request</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify patient pickup and hospital details. Ambulance allocates immediately.
                </p>
              </div>

              <form onSubmit={handleConfirmRide} className="space-y-4 text-xs">
                
                {/* Pickup Location */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Pickup Location (রোগীর বর্তমান অবস্থান)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                </div>

                {/* Destination Location */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Destination Hospital (গন্তব্য হাসপাতাল)
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Square Hospital, Panthapath"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Emergency Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017xxxxxxxx"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                </div>

                {/* Important Notice Box */}
                <div className="p-3.5 bg-red-50/60 border border-red-100 rounded-2xl text-[11px] text-red-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Request status will initialize as <strong>PENDING</strong> on your customer dashboard. You can cancel or complete payment securely.
                  </span>
                </div>

                {/* Confirm Dispatch Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.99] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching Request...
                    </>
                  ) : (
                    <>
                      <Ambulance className="w-4 h-4" />
                      Confirm Ride Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}