import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';
  const id = route.params.id;
  const getProductByID = await prisma.products.findFirst({
    where: {
      id: id,
      employee: {
        admin: {
          client: {
            license_key: license_key,
          },
        },
      },
    },
    select: {
      barcode: true,
      product_name: true,
    },
  });

  await prisma.$disconnect();

  return responseSuccess({
    product: getProductByID,
  });
}

export async function POST(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';
  const { product_name } = await req.json();
  const id = route.params.id;
  const updateProducts = await prisma.products.update({
    where: {
      id: id,
      employee: {
        admin: {
          client: {
            license_key: license_key,
          },
        },
      },
    },
    data: {
      product_name: product_name,
    },
  });

  await prisma.$disconnect();

  if (!updateProducts) return responseError('Failed to update Products');
  return Response.json({
    success: true,
    message: 'Product successfully updated',
  });
}

export async function DELETE(req: Request, route: { params: { id: string } }) {
  const id = route.params.id;
  try {
    const deleteProduct = await prisma.products.delete({
      where: {
        id: id,
      },
    });

    if (!deleteProduct) return responseError('Product Error Deleted');

    return responseSuccess('Product Successfully Deleted');
  } catch (err: any) {
    console.log(err)
    if (err?.code === 'P2003') return responseError('This Product already use in transactions.')
    return responseError('Delete Failed');
  }
}
