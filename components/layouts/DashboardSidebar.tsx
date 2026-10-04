"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  CalendarPlus,
  History,
  Users,
  Receipt,
  Ambulance,
  LogOut,
} from "lucide-react";
import { roleNavigation, NavItem } from "../../confiq/nav";

const iconMap = {
  LayoutDashboard,
  Truck,
  CalendarPlus,
  History,
  Users,
  Receipt,
};

interface SidebarProps {
  role: "customer" | "driver" | "admin";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = roleNavigation[role] || [];

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Ambulance className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">ResQRoute</h1>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {role === "customer"
              ? "Customer Portal"
              : role === "driver"
                ? "Driver Console"
                : "Admin Panel"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item: NavItem) => {
          const Icon = iconMap[item.iconName];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
