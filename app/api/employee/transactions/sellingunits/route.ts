import { responseSuccess } from "@/app/_lib/PosResponse";
import { prisma } from "@/app/_lib/prisma/client";
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