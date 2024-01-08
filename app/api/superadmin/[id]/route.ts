import { responseError } from "@/app/_lib/PosResponse"
import { prisma } from "@/app/_lib/prisma/client"


export async function POST(req: Request, route:{params:{id: string}})
{
    const {name} = await req.json()
    const id = route.params.id
    const superAdmin = await prisma.superAdmin.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
    await prisma.$disconnect()

    if(!superAdmin) return responseError('Super Admin not found.')
    return Response.json({
        success: true,
        message: 'Data successfully updated!'
    })
}

export async function DELETE(req: Request, route:{params:{id:string}})
{
    const id = route.params.id
    const superAdmin = await prisma.superAdmin.delete({
        where: {
            id : id
        }
    })

    await prisma.$disconnect()

    if(!superAdmin) return responseError('Super Admin not Found')
    return Response.json({
        success:true
    })


}