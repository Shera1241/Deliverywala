"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/db";

interface AdminUserActionsProps {
  user: { id: string; name: string; role: Role };
  isSelf: boolean;
}

const ROLES: Role[] = ["CUSTOMER", "AGENT", "ADMIN"];

export default function AdminUserActions({
  user,
  isSelf,
}: AdminUserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function changeRole(role: Role) {
    setLoading(true);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
    setLoading(false);
  }

  async function deleteUser() {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  if (isSelf) return <span className="text-xs text-gray-300">—</span>;

  return (
    <div className="flex items-center gap-2">
      <select
        disabled={loading}
        defaultValue={user.role}
        onChange={(e) => changeRole(e.target.value as Role)}
        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button
        onClick={deleteUser}
        disabled={loading}
        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
