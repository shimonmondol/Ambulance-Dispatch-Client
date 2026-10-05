"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Role } from "@/lib/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer" as Role,
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      toast.error("Password must be at least 6 characters long!", {
        position: "top-center",
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!rawBackendUrl) {
        throw new Error("Backend URL is not defined in .env file.");
      }

      const backendUrl = rawBackendUrl.replace(/\/+$/, "");

      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: formData.role.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Registration failed. Please try again."
        );
      }

      setIsSuccess(true);

      toast.success("Account Registered Successfully! Please Login.", {
        position: "top-center",
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      const errMsg = err.message || "Failed to Register Account";
      setError(errMsg);
      toast.error(errMsg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 sm:p-6 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6 mb-10">
        
        {/* Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Account
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Create account for ambulance dispatch and ride tracking
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="p-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account registered successfully! Redirecting to login page...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {/* Account Role Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Role
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: "customer" });
                  if (error) setError("");
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center cursor-pointer transition ${
                  formData.role === "customer"
                    ? "border-red-600 bg-red-50 text-red-600 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: "provider" });
                  if (error) setError("");
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center cursor-pointer transition ${
                  formData.role === "provider"
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: "admin" });
                  if (error) setError("");
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center cursor-pointer transition ${
                  formData.role === "admin"
                    ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder:text-slate-400 transition"
              />
            </div>
          </div>
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder:text-slate-400 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder:text-slate-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder:text-slate-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Register Button */}
          <button
            type="submit"
            disabled={loading || isSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all active:scale-[0.99] mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Account
              </>
            )}
          </button>
        </form>

        {/* Bottom Login Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-600 hover:text-red-700 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}