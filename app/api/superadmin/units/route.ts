import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET()
{
    const prisma = new PrismaClient()
    const getUnits = await prisma.units.findMany()
    
    await prisma.$disconnect()
    return responseSuccess({
    units:getUnits
    })
}

export async function POST(req: Request)
{
    const {name} = await req.json()
    const prisma = new PrismaClient()
    const createUnit = await prisma.units.create({
        data:{
            name:name
        }
    })

    await prisma.$disconnect()
    
    if(!createUnit) return responseError("Failed to create unit")
    return Response.json({
        success:true,
        message:"Unit Successfully Created!"
    })
}