import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export async function GET(req: Request, route: {params: {customerCode: string}}) {
    const url = new URL(req.url)

    const license_key = url.searchParams.get('license') ?? ''

    const getCustomer = await prisma.customers.findFirst({
        where: {
            customer_code: route.params.customerCode,
            employee: {
                admin: {
                    client: {
                        license_key: license_key
                    }
                }
            }
        },
        select: {
            id: true,
            customer_code: true,
            name: true
        }
    })

    if (!getCustomer) return responseError('Member not Found.')

    return responseSuccess({
        customer: getCustomer
    })
}