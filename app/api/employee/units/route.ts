import { responseSuccess } from "@/app/_lib/PosResponse"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient().$extends({
    result: {
        units: {
            is_selected: {
                needs: {},
                compute(data) {
                    return false
                },
            }
        }
    }
})
export async function GET(req: Request) {
    const getUnits = await prisma.units.findMany({
        select: {
            id: true,
            name: true,
            is_selected: true
        }
    })

    return responseSuccess({
        units: getUnits
    })
}