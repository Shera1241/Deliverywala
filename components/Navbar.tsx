"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Role } from "@/lib/db";

interface NavbarProps {
  userName: string;
  role: Role;
}

export default function Navbar({ userName, role }: NavbarProps) {
  const roleLinks: Record<Role, { href: string; label: string }[]> = {
    CUSTOMER: [
      { href: "/dashboard", label: "My Orders" },
      { href: "/orders/new", label: "New Order" },
    ],
    AGENT: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/agent", label: "Available Orders" },
    ],
    ADMIN: [
      { href: "/dashboard", label: "Overview" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/users", label: "Users" },
    ],
  };

  const links = roleLinks[role] || [];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🚚</span>
            <span className="font-bold text-orange-600">Deliverywala</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-orange-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            {userName}{" "}
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              {role}
            </span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
