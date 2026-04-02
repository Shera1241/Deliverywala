import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import AgentActions from "./AgentActions";

export default async function AgentPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "AGENT") redirect("/dashboard");

  const { id, name, role } = session.user;

  const [available, myOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: "CONFIRMED", agentId: null },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.findMany({
      where: { agentId: id, status: { notIn: ["DELIVERED", "CANCELLED"] } },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={name} role={role} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Agent Dashboard
        </h1>

        {myOrders.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Active Deliveries ({myOrders.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Customer: {order.customer.name}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>
                      <span className="font-medium">From:</span>{" "}
                      {order.pickupAddress}
                    </p>
                    <p>
                      <span className="font-medium">To:</span>{" "}
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <AgentActions order={order} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Orders ({available.length})
          </h2>
          {available.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">🎉</div>
              <p>No available orders right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {available.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Customer: {order.customer.name}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>
                      <span className="font-medium">From:</span>{" "}
                      {order.pickupAddress}
                    </p>
                    <p>
                      <span className="font-medium">To:</span>{" "}
                      {order.deliveryAddress}
                    </p>
                    {order.weight && (
                      <p>
                        <span className="font-medium">Weight:</span>{" "}
                        {order.weight} kg
                      </p>
                    )}
                  </div>
                  <AgentActions order={order} isAvailable />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
