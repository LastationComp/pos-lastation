import { responseError } from "@/app/_lib/PosResponse"
import { PrismaClient } from "@prisma/client"

export async function GET(req:Request, route:{params:{barcode:string}})
{
    const prisma = new PrismaClient()
    const barcode = route.params.barcode
    const getProductByID = await prisma.products.findFirst({
        where:{
            barcode:barcode
        }
    })

    await prisma.$disconnect()

    if(getProductByID == null) return responseError("Product not found")
    return Response.json(getProductByID)
}

export async function POST(req: Request, route:{params:{barcode: string}})
{
    const {product_name} = await req.json()
    const barcode = route.params.barcode    
    const prisma = new PrismaClient()
    const updateProducts = await prisma.products.update({
        where:{
            barcode: barcode
        },
        data:{
            product_name:product_name
        }
    })

    await prisma.$disconnect()

    if(!updateProducts) return responseError("Failed to update Products")
    return Response.json({
        success:true,
        message:"Product successfully updated"
    })
}

export async function DELETE(req:Request, route:{params:{barcode:string}})
{
    const prisma = new PrismaClient()
    const barcode = route.params.barcode
    const deleteProduct = await prisma.products.delete({
        where:{
            barcode:barcode
        }
    })

    if(!deleteProduct) return responseError("Failed to delete Data")
    return Response.json({
        success:true,
        message:"Product Successfully Deleted!"
    })
}