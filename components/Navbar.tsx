"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Heart, 
  LogIn, 
  UserPlus, 
  LogOut, 
  ChevronDown, 
  User,
  LayoutDashboard
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, name, role, email, logout, syncFromCookies } = useAuthStore();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    syncFromCookies();
    setMounted(true);
  }, [syncFromCookies]);

  // শুধুমাত্র সাইন-ইন ও সাইন-আপ রুটে Navbar লুকানো থাকবে; /customer/dashboard এ দৃশ্যমান থাকবে
  const hiddenRoutes = ["/signin", "/signup"];
  const shouldHideNavbar = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideNavbar) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success("Signed out successfully");

    if (pathname !== "/") {
      router.push("/");
    }
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Admin";
    if (role === "provider") return "Provider";
    return "Customer";
  };

  // Customer er jonno dashboard path http://localhost:3000/customer/dashboard
  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "provider") return "/provider";
    return "/customer/dashboard";
  };

  // Name fallback: jodi name na pay tobe email theke ba 'Customer'
  const displayName = name || (email ? email.split("@")[0] : "Customer");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
              Ambulance<span className="text-red-600"> Dispatch</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
              Fast Response. Better Care.
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all duration-200 pb-1 border-b-2 ${
                  isActive
                    ? "text-red-600 border-red-600 font-bold"
                    : "text-slate-600 border-transparent hover:text-red-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {!mounted ? (
            <div className="h-10 w-28 bg-slate-100 animate-pulse rounded-full" />
          ) : isAuthenticated ? (
            /* Authenticated Customer: Name (Role) + Dropdown */
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition shadow-sm text-left"
              >
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-900 max-w-[130px] truncate capitalize">
                    {displayName}
                  </span>
                  <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 text-[11px]">
                    ({getRoleLabel()})
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-20 space-y-1">
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </Link>
                    
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Unauthenticated View: Sign In & Sign Up */
            <>
              <Link
                href="/signin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}