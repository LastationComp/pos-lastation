import { responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q') ?? '';
  const transaction = await prisma.transactions.findMany({
    where: {
      employee: {
        admin: {
          id: route.params.id,
        },
      },
      no_ref: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      no_ref: true,
      employee: {
        select: {
          name: true,
        },
      },
      created_at: true,
      total_price: true,
    },
  });

  return responseSuccess({
    transactions: transaction,
  });
}
