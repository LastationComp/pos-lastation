import { responseError } from "@/app/_lib/PosResponse";
import { prisma } from "@/app/_lib/prisma/client";

export async function GET(req: Request, route:{params:{id:string}})
{
    const id = route.params.id
    const checkSuperAdmin = await prisma.superAdmin.findFirst({
        where:{
            id:id
        }
    })

    if(!checkSuperAdmin) return responseError("Unauthorized", 403)

    const getTotalClient = await prisma.clients.count({
        select:{
            _all:true
        }
    })

    const getTotalEmployee = await prisma.employees.count({
        select:{
            _all:true
        }
    })


    await prisma.$disconnect()

    return Response.json({
        TotalClient:getTotalClient?._all,
        TotalEmployee:getTotalEmployee?._all
    })
}