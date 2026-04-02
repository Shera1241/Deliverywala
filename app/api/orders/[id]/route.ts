import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      agent: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { role, id: userId } = session.user;
  if (
    role !== "ADMIN" &&
    order.customerId !== userId &&
    order.agentId !== userId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role, id: userId } = session.user;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const validStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
  ];

  if (role === "ADMIN") {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: validStatuses.includes(body.status) ? body.status : undefined,
        agentId: body.agentId !== undefined ? body.agentId : undefined,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        agent: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(updated);
  }

  if (role === "AGENT") {
    const agentStatuses: OrderStatus[] = [
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
    ];

    if (body.action === "accept" && !order.agentId && order.status === "CONFIRMED") {
      const updated = await prisma.order.update({
        where: { id },
        data: { agentId: userId, status: "ASSIGNED" },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          agent: { select: { id: true, name: true, email: true } },
        },
      });
      return NextResponse.json(updated);
    }

    if (order.agentId === userId && agentStatuses.includes(body.status)) {
      const updated = await prisma.order.update({
        where: { id },
        data: { status: body.status },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          agent: { select: { id: true, name: true, email: true } },
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (role === "CUSTOMER" && order.customerId === userId && order.status === "PENDING") {
    if (body.status === "CANCELLED") {
      const updated = await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(updated);
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
