import { responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function POST(req: Request) {
    const {products} = await req.json()
    const getSellingUnits = await prisma.sellingUnits.findMany({
        where: {
            product_id: {
                in: products
            }
        }
    })

    return responseSuccess({
        slu: getSellingUnits
    })
}