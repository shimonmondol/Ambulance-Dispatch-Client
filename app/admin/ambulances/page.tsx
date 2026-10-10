"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ambulance,
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  X,
  AlertTriangle,
  ImageIcon,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

// ==========================================
// 3 Specific Fleet Types
// ==========================================
type AmbulanceCategory =
  | "ADVANCED_LIFE_SUPPORT"
  | "BASIC_LIFE_SUPPORT_"
  | "ICU";

interface AmbulanceItem {
  id: string;
  registrationNo: string;
  type: string;
  name?: string | null;
  image?: string | null;
  baseFare?: number | null;
  perKmFare?: number | null;
  createdAt: string;
  provider?: {
    id: string;
    licenseNumber: string;
    isAvailable: boolean;
    user?: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
}

const FLEET_DEFINITIONS: Record<
  AmbulanceCategory,
  { label: string; defaultTitle: string; defaultImage: string; baseFare: number; perKm: number; badgeColor: string }
> = {
  ADVANCED_LIFE_SUPPORT: {
    label: "ADVANCED LIFE SUPPORT",
    defaultTitle: "Advanced Life Support Ambulance",
    defaultImage: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=300&q=80",
    baseFare: 2800,
    perKm: 60,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  BASIC_LIFE_SUPPORT_: {
    label: "BASIC LIFE SUPPORT",
    defaultTitle: "Basic Life Support Ambulance",
    defaultImage: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300&q=80",
    baseFare: 1800,
    perKm: 45,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  ICU: {
    label: "ICU",
    defaultTitle: "ICU Specialized Mobile Unit",
    defaultImage: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=300&q=80",
    baseFare: 3500,
    perKm: 75,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

const normalizeCategory = (rawType: string = ""): AmbulanceCategory => {
  const t = rawType.toUpperCase().trim();
  if (t === "ICU") return "ICU";
  if (t === "ADVANCED_LIFE_SUPPORT" || t === "ADVANCED" || t === "AC") {
    return "ADVANCED_LIFE_SUPPORT";
  }
  return "BASIC_LIFE_SUPPORT_";
};

// ==========================================
// Main Component
// ==========================================
function AdminAmbulancesContent() {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAmbulance, setActiveAmbulance] = useState<AmbulanceItem | null>(null);
  const [targetForDelete, setTargetForDelete] = useState<AmbulanceItem | null>(null);

  // Form State
  const [formValues, setFormValues] = useState({
    name: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.defaultTitle,
    type: "ADVANCED_LIFE_SUPPORT" as AmbulanceCategory,
    image: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.defaultImage,
    registrationNo: "",
    baseFare: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.baseFare,
    perKmFare: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.perKm,
  });

  // Query: Fetch ambulance list
  const {
    data: ambulances = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AmbulanceItem[]>({
    queryKey: ["adminAmbulances", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/ambulances`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch fleet data");
      }

      const json = await res.json();
      return json.data || [];
    },
    enabled: Boolean(token && isAuthenticated),
  });

  // Type change helper
  const handleTypeSelect = (type: AmbulanceCategory) => {
    const meta = FLEET_DEFINITIONS[type] || FLEET_DEFINITIONS.BASIC_LIFE_SUPPORT_;
    setFormValues((prev) => ({
      ...prev,
      type,
      name: meta.defaultTitle,
      image: meta.defaultImage,
      baseFare: meta.baseFare,
      perKmFare: meta.perKm,
    }));
  };

  // Mutation: Save Ambulance (Create or Update)
  const { mutate: saveAmbulance, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const isUpdating = Boolean(activeAmbulance?.id);
      const endpoint = isUpdating
        ? `${API_BASE}/admin/ambulances/${activeAmbulance?.id}`
        : `${API_BASE}/admin/ambulances`;

      const res = await fetch(endpoint, {
        method: isUpdating ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Operation failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Fleet successfully updated");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
      closeFormModal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Mutation: Delete Ambulance
  const { mutate: removeAmbulance, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/admin/ambulances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete ambulance");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Ambulance removed from platform");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
      setTargetForDelete(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const openCreateModal = () => {
    setActiveAmbulance(null);
    setFormValues({
      name: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.defaultTitle,
      type: "ADVANCED_LIFE_SUPPORT",
      image: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.defaultImage,
      registrationNo: "",
      baseFare: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.baseFare,
      perKmFare: FLEET_DEFINITIONS.ADVANCED_LIFE_SUPPORT.perKm,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AmbulanceItem) => {
    const categoryKey = normalizeCategory(item.type);
    const meta = FLEET_DEFINITIONS[categoryKey];
    setActiveAmbulance(item);
    setFormValues({
      name: item.name || meta.defaultTitle,
      type: categoryKey,
      image: item.image || meta.defaultImage,
      registrationNo: item.registrationNo,
      baseFare: item.baseFare ?? meta.baseFare,
      perKmFare: item.perKmFare ?? meta.perKm,
    });
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    setActiveAmbulance(null);
  };

  // Filtered dataset with Smart Normalization
  const filteredFleet = useMemo(() => {
    return ambulances.filter((vehicle) => {
      const normalized = normalizeCategory(vehicle.type);

      // ফিল্টারিং চেক: ALL অথবা নর্মালাইজড ক্যাটাগরি ম্যাচ
      const matchesType = activeFilter === "ALL" || normalized === activeFilter;

      const query = searchQuery.trim().toLowerCase();
      const meta = FLEET_DEFINITIONS[normalized];
      const title = (vehicle.name || meta.defaultTitle).toLowerCase();
      const matchesText =
        !query ||
        vehicle.registrationNo.toLowerCase().includes(query) ||
        title.includes(query);

      return matchesType && matchesText;
    });
  }, [ambulances, activeFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Header Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Fleet Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Ambulances & Fleet Supervision
          </h1>
          <p className="text-xs text-slate-500">
            Configure vehicle classifications, dynamic tariffs, and fleet registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition active:scale-95 shadow-md shadow-emerald-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Ambulance
          </button>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Controls & 3 Filter Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by registration number or ambulance title..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
              activeFilter === "ALL"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setActiveFilter("ADVANCED_LIFE_SUPPORT")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
              activeFilter === "ADVANCED_LIFE_SUPPORT"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
            }`}
          >
            ADVANCED LIFE SUPPORT
          </button>
          <button
            onClick={() => setActiveFilter("BASIC_LIFE_SUPPORT_")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
              activeFilter === "BASIC_LIFE_SUPPORT_"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
            }`}
          >
            BASIC LIFE SUPPORT
          </button>
          <button
            onClick={() => setActiveFilter("ICU")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
              activeFilter === "ICU"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
            }`}
          >
            ICU
          </button>
        </div>
      </div>

      {/* 3. Fleet Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-xs font-semibold">Loading ambulance registry...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Failed to load ambulances</p>
            <p className="text-xs text-slate-400">{(error as Error)?.message}</p>
          </div>
        ) : filteredFleet.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ambulance className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No vehicles match criteria</p>
            <p className="text-xs text-slate-400">Add a new unit or reset your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Reg No</th>
                  <th className="py-3.5 px-4">Fare (Base + Per KM)</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFleet.map((vehicle) => {
                  const normalized = normalizeCategory(vehicle.type);
                  const meta = FLEET_DEFINITIONS[normalized];
                  const displayTitle = vehicle.name || meta.defaultTitle;
                  const displayImage = vehicle.image || meta.defaultImage;
                  const baseFare = vehicle.baseFare ?? meta.baseFare;
                  const perKmFare = vehicle.perKmFare ?? meta.perKm;

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50/60 transition">
                      {/* Name with Image Thumbnail */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {displayImage ? (
                              <Image
                                src={displayImage}
                                alt={displayTitle}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-rose-50">
                                <Ambulance className="w-5 h-5 text-rose-600" />
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {displayTitle}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Added {new Date(vehicle.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider inline-flex items-center gap-1 ${meta.badgeColor}`}
                        >
                          <HeartPulse className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </td>

                      {/* Reg No */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {vehicle.registrationNo}
                        </span>
                      </td>

                      {/* Fare */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          ৳{baseFare}
                          <span className="text-emerald-600 font-semibold text-[11px] ml-1">
                            (+ ৳{perKmFare}/km)
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(vehicle)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit specs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTargetForDelete(vehicle)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                            title="Decommission vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* 4. MODAL: Add / Edit Ambulance */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Ambulance className="w-4 h-4 text-emerald-600" />
                {activeAmbulance ? "Edit Ambulance Specs" : "Register New Ambulance"}
              </h3>
              <button
                onClick={closeFormModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formValues.registrationNo.trim()) {
                  return toast.error("Please enter a valid registration number");
                }
                saveAmbulance();
              }}
              className="space-y-4 text-xs"
            >
              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ambulance Name
                </label>
                <input
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  placeholder="e.g. Basic Life Support Ambulance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ambulance Type
                </label>
                <select
                  value={formValues.type}
                  onChange={(e) => handleTypeSelect(e.target.value as AmbulanceCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white font-semibold"
                >
                  <option value="ADVANCED_LIFE_SUPPORT">ADVANCED LIFE SUPPORT</option>
                  <option value="BASIC_LIFE_SUPPORT_">BASIC LIFE SUPPORT</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>

              {/* Image Input & Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ambulance Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formValues.image}
                    onChange={(e) => setFormValues({ ...formValues, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {formValues.image ? (
                      <Image
                        src={formValues.image}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={formValues.registrationNo}
                  onChange={(e) =>
                    setFormValues({ ...formValues, registrationNo: e.target.value.toUpperCase() })
                  }
                  placeholder="DHAKA-METRO-BPS-018"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              {/* Fares */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Base Fare (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formValues.baseFare}
                    onChange={(e) =>
                      setFormValues({ ...formValues, baseFare: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Per KM Rate (+ ৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formValues.perKmFare}
                    onChange={(e) =>
                      setFormValues({ ...formValues, perKmFare: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {activeAmbulance ? "Update" : "Add Ambulance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Delete Confirmation */}
      {targetForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Decommission Vehicle?
                </h3>
              </div>
              <button
                onClick={() => setTargetForDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently remove vehicle{" "}
              <strong className="text-slate-900 font-mono">
                {targetForDelete.registrationNo}
              </strong>
              ? It will be removed from dispatch assignment.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTargetForDelete(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Keep Fleet
              </button>
              <button
                type="button"
                onClick={() => removeAmbulance(targetForDelete.id)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-rose-200"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAmbulancesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading fleet supervision registry...
            </div>
          }
        >
          <AdminAmbulancesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}