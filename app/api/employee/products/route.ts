import { PrismaClient } from "@prisma/client";
import { responseError } from "@/app/_lib/PosResponse";
export async function GET(req: Request)
{
    const {license_key} = await req.json()
    const prisma = new PrismaClient()
    const getAllProduct = await prisma.products.findMany({
        where: {
            employee: {
                admin: {
                    client: {
                        license_key: license_key ?? ''
                    }
                }
            }
        },
        select: {
            product_name: true,
            smallest_selling_unit: true,
        }
    })

    await prisma.$disconnect()

    return Response.json(getAllProduct)
}

export async function POST(req:Request)
{
    const {product_name} = await req.json()
    const prisma = new PrismaClient()
    const createProduct = await prisma.products.create({
        data: {
            barcode: "ABC-abc-1234",
            product_name: product_name,
            created_by:"cac712a5-6be0-4992-8fd0-ebe157fed397",
        }
    })

    await prisma.$disconnect()

    if(!createProduct) return responseError("Failed to create product")
    return Response.json({
        success:true,
        message:"Product Successfully created!"
    })
}