import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { id, role, name } = session.user;

  let orders;
  if (role === "ADMIN") {
    orders = await prisma.order.findMany({
      take: 10,
      include: {
        customer: { select: { name: true } },
        agent: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "AGENT") {
    orders = await prisma.order.findMany({
      where: { agentId: id },
      take: 10,
      include: {
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    orders = await prisma.order.findMany({
      where: { customerId: id },
      take: 10,
      include: {
        agent: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const stats =
    role === "ADMIN"
      ? await prisma.$transaction([
          prisma.order.count(),
          prisma.order.count({ where: { status: "PENDING" } }),
          prisma.order.count({ where: { status: "DELIVERED" } }),
          prisma.user.count({ where: { role: "AGENT" } }),
        ])
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={name} role={role} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {role === "ADMIN"
                ? "Admin Overview"
                : role === "AGENT"
                ? "My Deliveries"
                : "My Orders"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {name}</p>
          </div>
          {role === "CUSTOMER" && (
            <Link
              href="/orders/new"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              + New Order
            </Link>
          )}
          {role === "AGENT" && (
            <Link
              href="/agent"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Browse Available Orders
            </Link>
          )}
          {role === "ADMIN" && (
            <div className="flex gap-2">
              <Link
                href="/admin/orders"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                All Orders
              </Link>
              <Link
                href="/admin/users"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: stats[0] },
              { label: "Pending", value: stats[1] },
              { label: "Delivered", value: stats[2] },
              { label: "Agents", value: stats[3] },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-medium">No orders yet</p>
              {role === "CUSTOMER" && (
                <Link
                  href="/orders/new"
                  className="mt-3 inline-block text-orange-600 hover:underline text-sm"
                >
                  Place your first order
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {order.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {"customer" in order
                        ? `Customer: ${(order as { customer: { name: string } }).customer.name}`
                        : "agent" in order && (order as { agent: { name: string } | null }).agent
                        ? `Agent: ${(order as { agent: { name: string } }).agent.name}`
                        : "No agent assigned"}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
