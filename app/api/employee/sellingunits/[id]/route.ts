import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

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
      is_smallest: true,
      product_id: true,
      price: true,
      unit: {
        select: {
          name: true,
        },
      },
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
  const { stock, price, unit_id, is_smallest, unit_name } = await req.json();
  const id = route.params.id;

  const updateSellingUnits = await prisma.sellingUnits.update({
    where: {
      id: id,
    },
    data: {
      unit_id: unit_id,
      price: price,
      stock: stock,
    },
  });

  if (is_smallest) {
    await prisma.sellingUnits.update({
      where: {
        id: id,
      },
      data: {
        product: {
          update: {
            data: {
              smallest_selling_unit: unit_name,
            },
          },
        },
      },
    });
  }

  await prisma.$disconnect();
  if (!updateSellingUnits) return responseError('Failed to Update Selling Unit');
  return Response.json({
    success: true,
    message: 'Selling Unit Successfully Updated',
  });
}

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('pid') ?? '';
    const id = route.params.id;
    const deleteProduct = await prisma.sellingUnits.delete({
      where: {
        id: id,
        product: {
          id: productId,
        },
      },
    });

    if (!deleteProduct) return responseError('Error Delete Selling Units');

    return responseSuccess('Selling Units successfully deleted');
  } catch (err: any) {
    // console.log(err?.code);
    if (err?.code === 'P2003') return responseError('This Selling Unit already use in transactions');
    return responseError('Delete Failed');
  } finally {
    await prisma.$disconnect();
  }
}
