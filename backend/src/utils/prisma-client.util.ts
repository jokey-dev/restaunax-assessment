import { PrismaClient } from "../../prisma/generated/client";
import dotenv from 'dotenv';
import { PrismaPg } from "@prisma/adapter-pg";
dotenv.config();

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
let prisma: PrismaClient;

if (process.env.DATABASE_URL) {
  prisma = new PrismaClient({ adapter: pool });
} else {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

export { prisma };
