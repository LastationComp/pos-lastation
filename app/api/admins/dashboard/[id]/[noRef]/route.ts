import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { id: string; noRef: string } }) {
  const checkAdmin = await prisma.admins.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      name: true,
    },
  });

  if (!checkAdmin?.name) return responseError('Unauthorized', 401);

  const getNoRef = await prisma.transactions.findUnique({
    where: {
      no_ref: route.params.noRef,
    },
    select: {
      created_at: true,
      no_ref: true,
      change: true,
      pay: true,
      total_price: true,
      employee: {
        select: {
          name: true,
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
      transactionLists: {
        select: {
          sellingUnit: {
            select: {
              product: {
                select: {
                  product_name: true,
                },
              },
              unit: {
                select: {
                    name: true
                }
              },
              price: true,
            },
          },
          qty: true,
          total_price: true,
        },
      },
    },
  });

  if (!getNoRef) return responseError('No References Not Found', 401);

  return responseSuccess(getNoRef);
}
