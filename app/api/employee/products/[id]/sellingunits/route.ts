import { responseError } from "@/app/_lib/PosResponse";
import { prisma } from "@/app/_lib/prisma/client";
export async function POST(req: Request, route:{params: {id:string}}) {
  const {selling_units, dump_unit, id, license_key } = await req.json();
try {

  const selUnits: any[] = selling_units;
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
      id: route.params.id,
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

  if (!findProductsExists?.barcode) return responseError('Products Cant Found.');

  const createProduct = await prisma.products.update({
    where: {
        id: route.params.id
    }, 
    data: {
        sellingUnits: {
            create: selling_units
        },
    }
  })

  if (!createProduct) return responseError('Failed to create product');
  return Response.json({
    success: true,
    message: 'Product Successfully created!',
  });
} catch (e: any) {
  console.log(e);
  return responseError('Create Failed');
} finally {
  await prisma.$disconnect();
}

}