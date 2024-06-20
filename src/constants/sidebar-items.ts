import { LayoutDashboardIcon, ListOrderedIcon, ShirtIcon } from "lucide-react";

export const sidebarItems = [
  { id: 0, label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { id: 1, label: "Orders", href: "/dashboard/orders", icon: ListOrderedIcon },
  { id: 2, label: "Products", href: "/dashboard/products", icon: ShirtIcon },
];
