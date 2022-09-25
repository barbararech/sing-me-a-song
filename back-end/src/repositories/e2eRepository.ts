import { prisma } from "../database.js";

export async function truncate() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export function findByName(name: string) {
  return prisma.recommendation.findUnique({
    where: { name },
  });
}
