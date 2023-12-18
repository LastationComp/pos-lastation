import { PrismaClient } from '@prisma/client';

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';
  const getSalesHistory = await prisma.transactions.findMany({
    where: {
      employee: {
        admin: {
          client: {
            license_key: license_key,
          },
        },
      },
    },
    select: {
      id: true,
      no_ref: true,
      created_at: true,
      total_price: true,
      customer: {
        select: {
          name: true,
        },
      },
      employee: {
        select: {
          name: true,
        },
      },
    },
  });

  await prisma.$disconnect();
  if (!getSalesHistory)
    return Response.json({
      salesHistory: getSalesHistory,
    });
  return Response.json({
    salesHistory: getSalesHistory,
  });
}
