"use client";

import React, { useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Phone,
  Mail,
  FileText,
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";
import Footer from "@/components/Footer";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

// Strict validation schema matching exactly what is rendered in the form
const providerProfileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(
      /^01[3-9]\d{8}$/,
      "Provide a valid Bangladeshi mobile number (e.g., 017xxxxxxxx)",
    ),
  licenseNo: z.string().min(3, "Driving or medical license number is required"),
});

type ProviderProfileFormData = z.infer<typeof providerProfileSchema>;

function ProviderProfileContent() {
  const {
    token,
    isAuthenticated,
    updateProfile: updateAuthStoreProfile,
  } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProviderProfileFormData>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      licenseNo: "",
    },
  });

  // 1. Fetch current provider profile
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["providerProfile", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/provider/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile details");
      return (await res.json()).data;
    },
    enabled: !!token && isAuthenticated,
  });

  // Auto-fill form fields once database profile is loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.user?.name || "",
        email: profile.user?.email || "",
        phone: profile.user?.phone || "",
        licenseNo: profile.licenseNumber || "",
      });
    }
  }, [profile, reset]);

  // 2. Mutation: Save profile configuration
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (formData: ProviderProfileFormData) => {
      const res = await fetch(`${API_BASE}/provider/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          licenseNo: formData.licenseNo,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to update profile");
      }
      return { response: await res.json(), submittedData: formData };
    },
    onSuccess: ({ response, submittedData }) => {
      toast.success(response.message || "Profile updated successfully!");

      // Update global auth store and cookie to sync navbar immediately
      if (updateAuthStoreProfile) {
        updateAuthStoreProfile({
          name: submittedData.name,
          email: submittedData.email,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["providerProfile"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Update failed");
    },
  });

  const onSubmit = (values: ProviderProfileFormData) => {
    updateProfile(values);
  };

  const onError = (formErrors: any) => {
    console.error("Form validation errors:", formErrors);
    toast.error("Please fill all required fields correctly.");
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-3" />
        <p className="text-xs font-semibold">
          Loading provider profile configuration...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-24 text-center space-y-3 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">
          Failed to load profile
        </h3>
        <p className="text-xs text-slate-400">
          {(error as Error)?.message || "Please check backend connection."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              Provider Profile
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage your personal credentials, transit license, and contact
            details.
          </p>
        </div>

        <Link
          href="/provider/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* 2. Main Profile Form */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Section 1: Personal & Credential Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-rose-600" />
            <h2 className="font-black text-sm text-slate-900 tracking-tight">
              Provider Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-none transition ${
                    errors.name
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  }`}
                  placeholder="e.g., Shimon Kumar"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  (Login identifier)
                </span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  readOnly
                  disabled
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register("phone")}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-none transition ${
                    errors.phone
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  }`}
                  placeholder="017xxxxxxxx"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Professional Driving / Medical License{" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register("licenseNo")}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-none transition ${
                    errors.licenseNo
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  }`}
                  placeholder="DL-DHAKA-XXXX"
                />
              </div>
              {errors.licenseNo && (
                <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                  {errors.licenseNo.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/provider/dashboard"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 transition active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProviderProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading settings...
            </div>
          }
        >
          <ProviderProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
