import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query: string = url.searchParams.get('q') ?? '';
  const getUnits = await prisma.units.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  await prisma.$disconnect();
  return responseSuccess({
    units: getUnits,
  });
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const createUnit = await prisma.units.create({
    data: {
      name: name,
    },
  });

  await prisma.$disconnect();

  if (!createUnit) return responseError('Failed to create unit');
  return Response.json({
    success: true,
    message: 'Unit Successfully Created!',
  });
}
