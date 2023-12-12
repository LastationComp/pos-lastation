import { PrismaClient } from "@prisma/client";

export async function GET(req:Request, route:{params:{id:string}})
{
    const prisma = new PrismaClient()
    const id = route.params.id
    const getEmployee = await prisma.employees.count({
        where:{
            admin_id:id
        }
    })

    await prisma.$disconnect()
    return Response.json({
        TotalEmployee:getEmployee
    })
}