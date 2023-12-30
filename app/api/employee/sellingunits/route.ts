import { responseError } from "@/app/_lib/PosResponse";
import { prisma } from "@/app/_lib/prisma/client";

export async function GET()
{
    const getSellingUnits = await prisma.sellingUnits.findMany()

    await prisma.$disconnect()

    if(getSellingUnits.length == 0) return responseError("Selling unit not found")
    return Response.json(getSellingUnits)
}

export async function POST(req:Request)
{
    const {stock, price} = await req.json()
    const createSellingUnit = await prisma.sellingUnits.create({
        data: {
            stock:stock,
            price:price,
            product_id: "0e446d78-f38e-46cd-9236-691619acff29",
            unit_id: 1
        }
    })

    await prisma.$disconnect()
    if(!createSellingUnit) return responseError("Failed to create Selling Unit")
    return Response.json({
        success:true,
        message:"Selling Unit Successfully Created"
    })
}