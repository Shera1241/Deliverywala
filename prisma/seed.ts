import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/db";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123!", 12);
  const agentPassword = await bcrypt.hash("agent123!", 12);
  const customerPassword = await bcrypt.hash("customer123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@deliverywala.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@deliverywala.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@deliverywala.com" },
    update: {},
    create: {
      name: "Raju Agent",
      email: "agent@deliverywala.com",
      password: agentPassword,
      role: "AGENT",
      phone: "+91-9876543210",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@deliverywala.com" },
    update: {},
    create: {
      name: "Priya Customer",
      email: "customer@deliverywala.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+91-9876543211",
    },
  });

  await prisma.order.createMany({
    data: [
      {
        description: "Electronics — Laptop",
        pickupAddress: "123 MG Road, Bengaluru, KA 560001",
        deliveryAddress: "456 Koramangala, Bengaluru, KA 560034",
        weight: 2.5,
        notes: "Handle with care",
        customerId: customer.id,
        status: "CONFIRMED",
      },
      {
        description: "Books — Academic textbooks",
        pickupAddress: "789 Indiranagar, Bengaluru, KA 560038",
        deliveryAddress: "321 Whitefield, Bengaluru, KA 560066",
        weight: 5.0,
        customerId: customer.id,
        agentId: agent.id,
        status: "IN_TRANSIT",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete!");
  console.log(`Admin: admin@deliverywala.com / admin123!`);
  console.log(`Agent: agent@deliverywala.com / agent123!`);
  console.log(`Customer: customer@deliverywala.com / customer123!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
