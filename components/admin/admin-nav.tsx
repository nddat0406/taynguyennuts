"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { Package, TicketPercent } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin/orders",
      label: "Đơn hàng",
      icon: Package,
    },
    {
      href: "/admin/discount-codes",
      label: "Mã giảm giá",
      icon: TicketPercent,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-100 text-amber-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500"></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
