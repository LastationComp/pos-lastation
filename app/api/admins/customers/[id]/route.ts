import { prisma } from "@/app/_lib/prisma/client"


export async function GET(req: Request, route:{params:{id:string}})
{
    const id = route.params.id
    const getCustomer = await prisma.customers.findFirst({
        where:{
            id:id
        }
    })

    await prisma.$disconnect()

    return Response.json(getCustomer)
}

// export async function POST(req: Request, route:{params:{id:string}})
// {
//     const {name, email, phone} = await req.json()
//     const id = route.params.id
//     const prisma = new PrismaClient()
//     const updateCustomer = await prisma.customers.update({
//         where:{
//             id:id
//         },
//         data:{

//         }
//     })
// }

export async function DELETE(req: Request, route:{params:{id:string}})
{
    const id = route.params.id
    const deleteCustomer = await prisma.customers.delete({
        where: {
            id: id
        }
    })

    await prisma.$disconnect()

    return Response.json({
        success:true,
        message:"Customer Sucessfully Deleted!"
    })
}