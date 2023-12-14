import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, route: { params: { id: string } }) {
  const id = route.params.id;
  const getSellingUnits = await prisma.sellingUnits.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      stock: true,
      unit_id: true,
      product_id: true,
      price: true,
    },
  });

  const getUnits = await prisma.units.findMany({
    where: {
      OR: [
        {
          sellingUnits: {
            none: {
              product: {
                id: getSellingUnits?.product_id,
              },
            },
          },
        },
        {
          sellingUnits: {
            some: {
              id: getSellingUnits?.id,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
  });

  await prisma.$disconnect();

  return responseSuccess({
    selling_unit: getSellingUnits,
    units: getUnits,
  });
}

export async function POST(req: Request, route: { params: { id: string } }) {
  const { stock, price, unit_id } = await req.json();
  const id = route.params.id;
  const updateSellingUnits = await prisma.sellingUnits.update({
    where: {
      id: id,
    },
    data: {
      stock: stock,
      price: price,
      unit_id: unit_id,
    },
  });

  await prisma.$disconnect();
  if (!updateSellingUnits) return responseError('Failed to Update Selling Unit');
  return Response.json({
    success: true,
    message: 'Selling Unit Successfully Updated',
  });
}

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    const url = new URL(req.url)
    const productId = url.searchParams.get('pid') ?? ''
    const id = route.params.id;
    const deleteProduct = await prisma.sellingUnits.delete({
      where: {
        id: id,
        product: {
            id: productId
        }
      },
    });

    if (!deleteProduct) return responseError('Error Delete Selling Units');

    return responseSuccess('Selling Units successfully deleted');
  } catch (e: any) {
    return responseError('Delete Failed');
  } finally {
    await prisma.$disconnect();
  }
}
