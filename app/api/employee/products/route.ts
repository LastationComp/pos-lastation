import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';
  const query = url.searchParams.get('q') ?? '';
  const getAllProduct = await prisma.products.findMany({
    where: {
      OR: [
        {
          barcode: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          product_name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
      employee: {
        admin: {
          client: {
            license_key: license_key,
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    select: {
      id: true,
      barcode: true,
      product_name: true,
      smallest_selling_unit: true,
      employee: {
        select: {
          name: true,
        },
      },
    },
  });

  await prisma.$disconnect();

  return responseSuccess({
    products: getAllProduct,
  });
}

export async function POST(req: Request) {
  const { product_name, barcode, selling_units, dump_unit, id, license_key } = await req.json();

  try {
    const selUnits: any[] = selling_units;
    const existsIsSmallest = selUnits.find((data) => data.is_smallest == true);
    if (!existsIsSmallest) return responseError('Please check "Is Smallest" at least one');

    const smallest_selling_unit = dump_unit.find((data: any) => data.id == existsIsSmallest?.unit_id);

    let checkUnit = {
      duplicated: false,
      name: '',
    };

    dump_unit.forEach((data: any) => {
      const checkSameUnit = selUnits.filter((unit) => {
        return Number(unit.unit_id) === data.id;
      });
      if (checkSameUnit.length == 2) {
        checkUnit.duplicated = true;
        checkUnit.name = data.name;
        return false;
      }
    });

    if (checkUnit.duplicated) return responseError(`Unit "${checkUnit.name}" has duplicated, please select different Unit`);

    const findEmployee = await prisma.employees.findFirst({
      where: {
        id: id,
        admin: {
          client: {
            license_key: license_key ?? '',
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!findEmployee?.id) return responseError("Employee Can't Found");

    const findProductsExists = await prisma.products.findFirst({
      where: {
        barcode: barcode,
        employee: {
          admin: {
            client: {
              license_key: license_key ?? '',
            },
          },
        },
      },
      select: {
        barcode: true,
      },
    });

    if (findProductsExists?.barcode) return responseError('Products with this barcode already exists.');

    const createProduct = await prisma.products.create({
      data: {
        barcode: barcode,
        product_name: product_name,
        created_by: findEmployee.id,
        smallest_selling_unit: smallest_selling_unit?.name,
        sellingUnits: {
          create: selling_units,
        },
      },
    });

    if (!createProduct) return responseError('Failed to create product');
    return Response.json({
      success: true,
      message: 'Product Successfully created!',
    });
  } catch (e: any) {
    return responseError('Create Failed');
  } finally {
    await prisma.$disconnect();
  }
}
