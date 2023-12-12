import { responseError } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, route:{params:{id:string}})
{
    const prisma = new PrismaClient()
    const id = route.params.id
    const getSellingUnits = await prisma.sellingUnits.findFirst({
        where:{
            id:id
        }
    })

    await prisma.$disconnect()
    if(!getSellingUnits) return responseError("There is no Selling Units")
    return Response.json(getSellingUnits)
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