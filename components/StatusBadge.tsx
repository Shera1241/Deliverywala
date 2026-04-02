import type { OrderStatus } from "@/lib/db";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  ASSIGNED: { label: "Assigned", className: "bg-purple-100 text-purple-700" },
  PICKED_UP: { label: "Picked Up", className: "bg-indigo-100 text-indigo-700" },
  IN_TRANSIT: { label: "In Transit", className: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
