import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const { role, name, id: userId } = session.user;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      agent: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!order) notFound();

  if (
    role !== "ADMIN" &&
    order.customerId !== userId &&
    order.agentId !== userId
  ) {
    redirect("/dashboard");
  }

  const statusFlow = [
    "PENDING",
    "CONFIRMED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
  ] as const;

  const currentStep = statusFlow.indexOf(
    order.status as (typeof statusFlow)[number]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={name} role={role} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-orange-600"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tracking ID: <span className="font-mono">{order.trackingId}</span>
          </p>
        </div>

        {/* Status Timeline */}
        {order.status !== "CANCELLED" && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Delivery Progress
            </h2>
            <div className="flex items-center gap-0">
              {statusFlow.map((status, i) => (
                <div key={status} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      i <= currentStep
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    }`}
                  />
                  {i < statusFlow.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        i < currentStep ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {statusFlow.map((status) => (
                <span
                  key={status}
                  className="text-xs text-gray-400 capitalize"
                  style={{ width: `${100 / statusFlow.length}%`, textAlign: "center" }}
                >
                  {status.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Info</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Description</dt>
                <dd className="font-medium text-gray-900">{order.description}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Pickup Address</dt>
                <dd className="font-medium text-gray-900">{order.pickupAddress}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Delivery Address</dt>
                <dd className="font-medium text-gray-900">{order.deliveryAddress}</dd>
              </div>
              {order.weight && (
                <div>
                  <dt className="text-gray-500">Weight</dt>
                  <dd className="font-medium text-gray-900">{order.weight} kg</dd>
                </div>
              )}
              {order.notes && (
                <div>
                  <dt className="text-gray-500">Notes</dt>
                  <dd className="font-medium text-gray-900">{order.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Placed on</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* People */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">People</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Customer</dt>
                <dd>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-gray-400">{order.customer.email}</p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Delivery Agent</dt>
                <dd>
                  {order.agent ? (
                    <>
                      <p className="font-medium text-gray-900">
                        {order.agent.name}
                      </p>
                      <p className="text-gray-400">{order.agent.email}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">Not yet assigned</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
