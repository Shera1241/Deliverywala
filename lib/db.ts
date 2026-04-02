// Re-export Prisma types and client for easy consumption
export { PrismaClient } from "@/app/generated/prisma/client";
export type { Role, OrderStatus } from "@/app/generated/prisma/enums";
export type { UserModel as User } from "@/app/generated/prisma/models/User";
export type { OrderModel as Order } from "@/app/generated/prisma/models/Order";
