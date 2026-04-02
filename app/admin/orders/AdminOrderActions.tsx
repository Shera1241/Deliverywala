"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/db";

interface AdminOrderActionsProps {
  order: Order & {
    customer: { id: string; name: string };
    agent: { id: string; name: string } | null;
  };
  agents: { id: string; name: string }[];
}

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrderActions({
  order,
  agents,
}: AdminOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(body: object) {
    setLoading(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        disabled={loading}
        defaultValue={order.status}
        onChange={(e) => update({ status: e.target.value })}
        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <select
        disabled={loading}
        defaultValue={order.agentId || ""}
        onChange={(e) =>
          update({ agentId: e.target.value || null })
        }
        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        <option value="">No agent</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  );
}
