import { responseError } from "@/app/_lib/PosResponse"
import { Prisma, PrismaClient } from "@prisma/client"

export async function GET(req: Request, route:{params:{id:any}})
{
    const prisma = new PrismaClient()
    const id = Number(route.params.id)
    const getUnit = await prisma.units.findFirst({
        where:{
            id:id
        }
    })

    await prisma.$disconnect()
    return Response.json({
        unit: getUnit
    })
}

export async function POST(req: Request, route:{params:{id:any}})
{
    const {name} = await req.json()
    const id = Number(route.params.id)
    const prisma = new PrismaClient()
    const updateUnit = await prisma.units.update({
        where: {
            id:id
        },
        data: {
            name:name
        }
    })

    await prisma.$disconnect()

    if(!updateUnit) return responseError("Failed to update unit")
    return Response.json({
        success:true,
        message:"Unit Successfully Updated"
    })
}

export async function DELETE(req: Request, route:{params:{id:any}})
{
    const prisma = new PrismaClient()
    const id = Number(route.params.id)
    const deleteUnit = await prisma.units.delete({
        where:{
            id:id
        }
    })

    await prisma.$disconnect()
    if(!deleteUnit) return responseError("Failed to Delete Unit")
    return Response.json({
        success:true,
        message:"Unit Successfully Deleted"
    })
}