"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/db";

interface AgentActionsProps {
  order: Order & { customer: { name: string } };
  isAvailable?: boolean;
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  ASSIGNED: "PICKED_UP",
  PICKED_UP: "IN_TRANSIT",
  IN_TRANSIT: "DELIVERED",
};

const statusLabels: Partial<Record<OrderStatus, string>> = {
  ASSIGNED: "Mark Picked Up",
  PICKED_UP: "Mark In Transit",
  IN_TRANSIT: "Mark Delivered",
};

export default function AgentActions({
  order,
  isAvailable = false,
}: AgentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(body: object) {
    setLoading(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setLoading(false);
  }

  if (isAvailable) {
    return (
      <button
        onClick={() => handleAction({ action: "accept" })}
        disabled={loading}
        className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Accepting..." : "Accept Order"}
      </button>
    );
  }

  const next = nextStatus[order.status];
  if (!next) return null;

  return (
    <button
      onClick={() => handleAction({ status: next })}
      disabled={loading}
      className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
    >
      {loading ? "Updating..." : statusLabels[order.status]}
    </button>
  );
}
