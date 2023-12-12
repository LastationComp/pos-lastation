import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, route:{params:{id:string}})
{
    const prisma = new PrismaClient()
    const id = route.params.id
    const getSellingUnits = await prisma.sellingUnits.findFirst({
        where:{
            id:id
        },
        select: {
            id: true,
            stock: true,
            unit_id: true,
            product_id: true,
            price: true
        }
    })

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
                    id: getSellingUnits?.id
                }
            }
          }
        ],
      },
      select: {
        id: true,
        name: true
      }
    });

    await prisma.$disconnect()

    return responseSuccess({
        selling_unit: getSellingUnits,
        units: getUnits
    })
}

export async function POST(req:Request, route:{params:{id:string}})
{
    const {stock, price} = await req.json()
    const prisma = new PrismaClient()
    const id = route.params.id
    const updateSellingUnits = await prisma.sellingUnits.update({
        where:{
            id:id
        },
        data:{
            stock:stock,
            price:price
        }
    })
    
    await prisma.$disconnect()
    if(!updateSellingUnits) return responseError("Failed to Update Selling Unit")
    return Response.json({
        success:true,
        message:"Selling Unit Successfully Updated"
    })
}