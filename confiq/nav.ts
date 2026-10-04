export interface NavItem {
  title: string;
  href: string;
  iconName: "LayoutDashboard" | "Truck" | "CalendarPlus" | "History" | "Users" | "Receipt";
}

export const roleNavigation: Record<"customer" | "driver" | "admin", NavItem[]> = {
  customer: [
    { title: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" },
    { title: "Book Ambulance", href: "/dashboard/book", iconName: "CalendarPlus" },
    { title: "My Bookings", href: "/dashboard/bookings", iconName: "History" },
  ],
  driver: [
    { title: "Driver Board", href: "/provider", iconName: "LayoutDashboard" },
    { title: "Assigned Trips", href: "/provider/trips", iconName: "Truck" },
    { title: "Earnings & Stats", href: "/provider/earnings", iconName: "Receipt" },
  ],
  admin: [
    { title: "Overview", href: "/admin", iconName: "LayoutDashboard" },
    { title: "Live Dispatch", href: "/admin/dispatch", iconName: "Truck" },
    { title: "Fleet Management", href: "/admin/fleets", iconName: "CalendarPlus" },
    { title: "User Control", href: "/admin/users", iconName: "Users" },
  ],
};