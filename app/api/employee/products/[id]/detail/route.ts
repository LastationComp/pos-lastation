import { responseSuccess } from "@/app/_lib/PosResponse";
import { prisma } from "@/app/_lib/prisma/client";

export async function GET(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';
  const id = route.params.id;
  const getProductDetail = await prisma.products.findFirst({
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
      sellingUnits: {
        orderBy: {
            is_smallest: 'desc'
        },
        select: {
          id: true,
          is_smallest: true,
          unit: {
            select: {
              name: true,
            },
          },
          stock: true,
          price: true,
        },
      },
    },
  });

  const totalUnit = await prisma.units.count()
  await prisma.$disconnect();

  return responseSuccess({
    isMaxUnit: totalUnit === getProductDetail?.sellingUnits.length,
    detail: getProductDetail
  })
}
