import { responseError, responseSuccess } from "@/app/_lib/PosResponse"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const {service_days, client_code } = await req.json()

    const getClient = await prisma.clients.findFirst({
        where: {
            client_code: client_code,
        },
        select: {
            expired_at: true
        }
    })

    if (!getClient) return responseError('Client Not Found.')
    const date = getClient?.expired_at as Date
    const newExpired = date.setDate(date.getDate() + Number(service_days))

    const updateData = await prisma.clients.update({
        where: {
            client_code: client_code
        },
        data: {
            expired_at: new Date(newExpired)
        }
    })

    await prisma.$disconnect()
    if (!updateData) return responseError('Update Expires Error')
    return responseSuccess('Update Expires Successfully')
}