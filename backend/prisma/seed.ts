import { faker } from "@faker-js/faker";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client';
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();

  // seed items
  const itemsData = Array.from({ length: 20 }).map(() => ({
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
    description: faker.commerce.productDescription(),
  }));

  await prisma.item.createMany({
    data: itemsData,
  });

  const allItems = await prisma.item.findMany();

  // seed orders with orders items
  const orderTypes = ["delivery", "dine_in", "pickup"] as const;
  const statuses = ["pending", "preparing", "ready", "completed", "cancelled"] as const;

  for (let i = 1; i <= 100; i++) {
    const itemsCount = faker.number.int({ min: 1, max: 5 });

    const selectedItems = faker.helpers.arrayElements(allItems, itemsCount);

    const orderItemsData = selectedItems.map((item) => ({
      itemId: item.id,
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: item.price
    }));

    const total = orderItemsData.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);

    await prisma.order.create({
      data: {
        customerName: faker.person.fullName(),
        customerEmail: faker.internet.email(),
        customerPhone: faker.phone.number({ style: 'human' }),
        orderNumber: generateOrderNumber(),
        customerRewardPoints: faker.number.int({ min: 0, max: 500 }),
        orderType: faker.helpers.arrayElement(orderTypes),
        status: faker.helpers.arrayElement(statuses),
        total: parseFloat(total.toFixed(2)),
        items: {
          create: orderItemsData,
        },
      },
    });
  }

  console.log("Seed completed: Items, Orders, and OrderItems created!");
}

function generateOrderNumber(length: number = 6): string {
  const randomStr = crypto
    .randomBytes(length)
    .toString("hex")
    .toUpperCase()
    .slice(0, length);
  return `ORDER-${randomStr}`;
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
