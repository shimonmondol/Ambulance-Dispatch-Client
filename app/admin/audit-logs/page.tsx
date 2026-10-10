"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldAlert,
  Search,
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import Footer from "@/components/Footer";

interface AuditLogItem {
  id: string;
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ambulance-dispatch-mu.vercel.app";

function AdminAuditLogsContent() {
  const { token, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // 1. Fetch Audit Logs from Backend API
  const {
    data: logs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AuditLogItem[]>({
    queryKey: ["adminAuditLogs", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to load audit logs");
      }

      const json = await res.json();
      return json.data || [];
    },
    enabled: Boolean(token && isAuthenticated),
    refetchInterval: 12000, // অটোমেটিক প্রতি ১২ সেকেন্ডে রিফ্রেশ
  });

  // Search & Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesRole = roleFilter === "ALL" || log.user?.role === roleFilter;

      const term = searchQuery.trim().toLowerCase();
      const action = (log.action || "").toLowerCase();
      const details = (log.details || "").toLowerCase();
      const userName = (log.user?.name || "").toLowerCase();
      const userEmail = (log.user?.email || "").toLowerCase();

      const matchesSearch =
        !term ||
        action.includes(term) ||
        details.includes(term) ||
        userName.includes(term) ||
        userEmail.includes(term);

      return matchesRole && matchesSearch;
    });
  }, [logs, roleFilter, searchQuery]);

  // Action Badge Helper
  const renderActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (
      act.includes("DELETE") ||
      act.includes("BAN") ||
      act.includes("CANCEL")
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          {action}
        </span>
      );
    }
    if (
      act.includes("CREATE") ||
      act.includes("ADD") ||
      act.includes("VERIFY")
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
        <Info className="w-3 h-3 text-blue-600" />
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Header Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Security & Compliance
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            System Audit Trail & Access Logs
          </h1>
          <p className="text-xs text-slate-500">
            Monitor administrative events, sensitive changes, and system
            activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, details, user name, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ADMIN", "PROVIDER", "CUSTOMER"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer whitespace-nowrap ${
                roleFilter === role
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 bg-slate-50 border border-transparent"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
            <p className="text-xs font-semibold">Streaming audit records...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Failed to load audit logs
            </p>
            <p className="text-xs text-slate-400">
              {(error as Error)?.message}
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              No audit records found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Operator / User</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-5 text-right">Source IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    {/* Timestamp */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400 pl-5">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-4">
                      {log.user ? (
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {log.user.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="font-mono">{log.user.email}</span>
                            <span className="bg-slate-100 px-1 py-0.2 rounded font-bold text-[9px] text-slate-600">
                              {log.user.role}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          System Automation
                        </span>
                      )}
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="text-slate-700 font-medium line-clamp-2">
                        {log.details || "No supplementary parameters recorded"}
                      </p>
                    </td>

                    {/* IP Address */}
                    <td className="py-3.5 px-5 text-right font-mono text-[11px] text-slate-400">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading security audit trail...
            </div>
          }
        >
          <AdminAuditLogsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
