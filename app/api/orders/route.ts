import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, role } = session.user;

  let orders;
  if (role === "ADMIN") {
    orders = await prisma.order.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        agent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "AGENT") {
    orders = await prisma.order.findMany({
      where: {
        OR: [{ agentId: id }, { status: "CONFIRMED", agentId: null }],
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        agent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    orders = await prisma.order.findMany({
      where: { customerId: id },
      include: {
        agent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { description, pickupAddress, deliveryAddress, weight, notes } =
      await req.json();

    if (!description || !pickupAddress || !deliveryAddress) {
      return NextResponse.json(
        { error: "Description, pickup address, and delivery address are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        description,
        pickupAddress,
        deliveryAddress,
        weight: weight ? parseFloat(weight) : null,
        notes,
        customerId: session.user.id,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
