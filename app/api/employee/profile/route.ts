import { responseSuccess } from "@/app/_lib/PosResponse"
import { PrismaClient } from "@prisma/client"



const prisma = new PrismaClient()
export async function GET(req: Request) {
    const {id} = await req.json()

    const getProfile = await prisma.employees.findUnique({
        where: {
            id: id
        },
        select: {
            avatar_url: true,
            name: true,
        }
    })

    return responseSuccess({
        data: getProfile
    })
}