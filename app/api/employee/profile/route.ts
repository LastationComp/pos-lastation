import { responseSuccess } from "@/app/_lib/PosResponse"
import { prisma } from "@/app/_lib/prisma/client"

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