import { responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const license = url.searchParams.get('license') ?? '';
  const getUnits = await prisma.units.findMany({
    where: {
      sellingUnits: {
        none: {
          product: {
            id: route.params.id,
            employee: {
              admin: {
                client: {
                  license_key: license,
                },
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  await prisma.$disconnect()
  return responseSuccess({
    units: getUnits,
  });
}
