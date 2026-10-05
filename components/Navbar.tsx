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
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, name, role, email, logout, syncFromCookies } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    syncFromCookies();
    setMounted(true);
  }, [syncFromCookies]);

  // Route change hole mobile drawer auto close hobe
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const hiddenRoutes = ["/login", "/register"];
  const shouldHideNavbar = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideNavbar) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success("Logged out successfully", {
      position: "top-center",
    });

    if (pathname !== "/") {
      router.push("/");
    }
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Admin";
    if (role === "provider") return "Provider";
    return "Customer";
  };

  const getDashboardPath = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "provider") return "/provider/dashboard";
    return "/customer/dashboard";
  };

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
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
              Ambulance<span className="text-red-600"> Dispatch</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider uppercase font-semibold block">
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

        {/* Right Section: Auth Desktop + Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Auth Section (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <div className="h-10 w-28 bg-slate-100 animate-pulse rounded-full" />
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition shadow-sm text-left cursor-pointer"
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
                      className="fixed inset-0 z-10 cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-20 space-y-1">
                      <Link
                        href={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-green-600 hover:bg-slate-50 rounded-xl transition text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-green-600" />
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 py-5 space-y-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-red-600 bg-red-50 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <hr className="border-slate-100" />

          {/* Mobile Auth Actions */}
          <div className="pt-1">
            {!mounted ? (
              <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
            ) : isAuthenticated ? (
              <div className="space-y-3">
                {/* Customer Info Capsule */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate capitalize">
                      {displayName}
                    </span>
                    <span className="text-[11px] font-semibold text-red-600">
                      {getRoleLabel()} Account
                    </span>
                  </div>
                </div>

                {/* Dashboard Button */}
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}