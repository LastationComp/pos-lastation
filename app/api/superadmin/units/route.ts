import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page: number = Number(url.searchParams.get('page') ?? 1);
  const query: string = url.searchParams.get('q') ?? ''
  const paginate: number = Number(url.searchParams.get('paginate') ?? 10);
  const getUnits = await prisma.units.findMany({
    where: {
        name: {
            contains: query,
            mode: 'insensitive'
        }
    },
    skip: (page - 1) * paginate,
    take: paginate
  });
  const total_data = await prisma.units.count({
    where: {
      name: {
        contains: query,
      },
    },
  });

  await prisma.$disconnect();
  return responseSuccess({
    total_page: Math.ceil(total_data / paginate),
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
