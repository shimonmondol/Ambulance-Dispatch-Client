"use client";

import React, { useState, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Shield,
  Ambulance,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";
import Footer from "@/components/Footer";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "PROVIDER" | "CUSTOMER";
  isVerified: boolean;
  deletedAt: string | null;
  createdAt: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function AdminUsersContent() {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 1. Fetch Users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserItem[]>({
    queryKey: ["adminUsers", token, roleFilter],
    queryFn: async () => {
      const url =
        roleFilter === "ALL"
          ? `${API_BASE}/admin/users`
          : `${API_BASE}/admin/users?role=${roleFilter}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to load users");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!token && isAuthenticated,
  });

  // 2. Mutation: Toggle Ban / Suspend
  const { mutate: toggleBan, isPending: isTogglingBan } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-ban`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to update account status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Account status updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // 3. Mutation: Toggle Verification Status
  const { mutate: toggleVerify } = useMutation({
    mutationFn: async ({
      userId,
      isVerified,
    }: {
      userId: string;
      isVerified: boolean;
    }) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to toggle verification");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification status updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Role Badge Renderer
  const renderRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-green-50 text-green-700 border border-green-200">
            <Shield className="w-3 h-3 text-green-600" />
            ADMIN
          </span>
        );
      case "PROVIDER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            <Ambulance className="w-3 h-3 text-blue-600" />
            PROVIDER
          </span>
        );
      case "CUSTOMER":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
            <User className="w-3 h-3 text-rose-500" />
            CUSTOMER
          </span>
        );
    }
  };

  // Search filtering
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
    );
  });

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
              User Governance
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Accounts & Role Management
          </h1>
          <p className="text-xs text-slate-500">
            Control platform roles, driver authorizations, and security suspension states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "CUSTOMER", "PROVIDER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
                roleFilter === role
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. User Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-xs font-semibold">Loading platform users...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Failed to load users</p>
            <p className="text-xs text-slate-400">
              {(error as Error)?.message || "Please check backend connection."}
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No users found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isBanned = Boolean(u.deletedAt);

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/60 transition ${
                        isBanned ? "bg-rose-50/20" : ""
                      }`}
                    >
                      {/* Name & Account ID */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: #{u.id.slice(-6).toUpperCase()}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700">{u.email}</div>
                        <div className="text-[11px] text-slate-400">
                          {u.phone || "No phone linked"}
                        </div>
                      </td>

                      {/* Role Static Badge (No Dropdown) */}
                      <td className="py-3.5 px-4">
                        {renderRoleBadge(u.role)}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() =>
                            toggleVerify({
                              userId: u.id,
                              isVerified: !u.isVerified,
                            })
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] transition cursor-pointer ${
                            u.isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Unverified
                            </>
                          )}
                        </button>
                      </td>

                      {/* Active / Suspended State */}
                      <td className="py-3.5 px-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <UserCheck className="w-3 h-3 text-emerald-600" /> Active
                          </span>
                        )}
                      </td>

                      {/* Action Button: Ban/Unban */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => toggleBan(u.id)}
                          disabled={isTogglingBan}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition active:scale-95 cursor-pointer disabled:opacity-50 ${
                            isBanned
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          {isBanned ? "Lift Ban" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading user registry...
            </div>
          }
        >
          <AdminUsersContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}