"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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

        {/* Dynamic Route Highlight */}
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

        {/* Top Auth CTAs */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  );
}