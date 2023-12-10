import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";


export async function POST(req: Request, route:{params:{id:string}})
{
    
}

export async function DELETE(req: Request, route:{params:{id:string}})
{
    const prisma = new PrismaClient()
    const id = route.params.id
    const deleteMembers = await prisma.customers.delete({
        where:{
            id:id
        }
    })

    await prisma.$disconnect()
    if(!deleteMembers) return responseError("Failed to Delete Member")
    return responseSuccess("Member Successfully Deleted!")
}