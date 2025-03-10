import { PrismaClient } from "@prisma/client";
import logger from "./logger";
const prisma = new PrismaClient();

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error disconnecting Prisma:", error);
  }
});

process.on("SIGTERM", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error disconnecting Prisma:", error);
  }
});

export default prisma;
