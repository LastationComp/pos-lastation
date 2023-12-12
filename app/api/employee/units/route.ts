import { responseSuccess } from "@/app/_lib/PosResponse"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()
export async function GET(req: Request) {
    const getUnits = await prisma.units.findMany({
        select: {
            id: true,
            name: true,
        }
    })

    await prisma.$disconnect()
    return responseSuccess({
        units: getUnits
    })
}