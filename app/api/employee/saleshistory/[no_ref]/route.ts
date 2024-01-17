import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { no_ref: string } }) {
  const no_ref = route.params.no_ref;
  const getReceipt = await prisma.transactions.findFirst({
    where: {
      no_ref: no_ref,
    },
    select: {
      no_ref: true,
      created_at: true,
      total_price: true,
      pay: true,
      change: true,
      employee: {
        select: {
          name: true,
          admin: {
            select: {
              client: {
                select: {
                  client_name: true,
                },
              },
            },
          },
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
      transactionLists: {
        select: {
          id: true,
          qty: true,
          total_price: true,
          created_at: true,
          price_per_qty: true,
          sellingUnit: {
            select: {
              price: true,
              product: {
                select: {
                  product_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();
  return Response.json({
    receiptDetail: getReceipt,
  });
}
