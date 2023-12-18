import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);

  const license_key = url.searchParams.get('license') ?? '';

  const getAllProduct = await prisma.products.findMany({
    where: {
      AND: [
        {
          employee: {
            admin: {
              client: {
                license_key: license_key,
              },
            },
          },
        },
        {
          sellingUnits: {
            some: {
              stock: {
                not: 0,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      barcode: true,
      product_name: true,
      sellingUnits: {
        where: {
          stock: {
            not: 0,
          },
        },
        orderBy: {
          is_smallest: 'desc',
        },
        select: {
          id: true,
          price: true,
          product_id: true,
          unit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();

  return responseSuccess({
    list_products: getAllProduct,
  });
}

export async function POST(req: Request) {
  const { selling_units, pay, change, total_price, license_key, id, customer_id } = await req.json();

  if (pay < total_price) {
    return responseError('Pay must be not less than Total Price');
  }

  let sellingUnits: any[] = [];
  selling_units.forEach((data: any) => {
    sellingUnits.push(data.selling_unit_id);
  });

  let stockNotEnough = {
    isNotEnough: false,
    message: '',
  };

  let success = {
    isSuccess: false,
    message: '',
  };

  try {
    await prisma.$transaction(async (tx) => {
      const checkStock = await tx.sellingUnits.findMany({
        where: {
          id: {
            in: sellingUnits,
          },
        },
        select: {
          id: true,
          stock: true,
          unit: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              product_name: true,
            },
          },
        },
      });

      selling_units.forEach((trx: any) => {
        const sellingUnit = checkStock.find((sel) => sel.id === trx.selling_unit_id);
        if (sellingUnit && sellingUnit?.stock < trx.qty) {
          stockNotEnough.isNotEnough = true;
          stockNotEnough.message = `Stock Product ${sellingUnit.product.product_name} in unit ${sellingUnit.unit?.name} is not enough, has ${sellingUnit.stock} left.`;
          return false;
        }
      });
    });

    if (stockNotEnough.isNotEnough) return responseError(stockNotEnough.message);

    const checkEmployee = await prisma.employees.findFirst({
      where: {
        id: id,
        admin: {
          client: {
            license_key: license_key,
          },
        },
      },
    });

    if (!checkEmployee) return responseError("Employee Can't Found");

    const date = new Date();
    const randNumber = Math.floor(Math.random() * 99999);
    const noRef = `${date.getTime()}${randNumber}`;

    await prisma.$transaction(async (tx) => {
      const createTransaction = await tx.employees.update({
        where: {
          id: id,
        },
        data: {
          transactions: {
            create: {
              no_ref: noRef,
              customer_id: customer_id,
              pay: pay,
              change: change,
              total_price: total_price,
              transactionLists: {
                create: selling_units,
              },
            },
          },
        },
      });


      if (createTransaction) {
        success.isSuccess = true;
        success.message = 'Transaction Success';
        if (customer_id) {
          const customer = await tx.customers.findFirst({
            where: {
              id: customer_id
            },
            select: {
              id: true,
              point: true
            }
          })

          if (customer?.point) {
            await tx.customers.update({
              where: {
                id: customer.id
              },
              data: {
                point: customer.point + (Math.round(total_price / 100)) * 0.5
              }
            })
          }
        }
      }
    });


    if (success.isSuccess) return responseSuccess(success.message);

    return responseError('Transaction Failed');
  } catch (e: any) {
    console.log(e);
    return responseError('Transaction Failed');
  } finally {
    await prisma.$disconnect();
  }
}
