import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
export async function POST(req: Request, route: {params: {id: any}})
{
    const {name, pin, avatar_url} = await req.json()
    const prisma = new PrismaClient()
    const hashedPin = await bcrypt.hash(pin,10)
    const id = route.params.id
    const updateEmployee = await prisma.employees.update({
        where: {
            id: id
        },
        data: {
            name: name,
            pin: hashedPin,
            avatar_url: avatar_url
        }
    })

    await prisma.$disconnect()

    if(!updateEmployee) return Response.json({
        message:"Failed to update your data"
    })

    return Response.json({
        message:"Your data successfully updated!"
    })
}

export async function DELETE(req: Request, route:{params:{id:any}})
{
    const prisma = new PrismaClient()
    const id = route.params.id
    const deleteData = await prisma.employees.update({
        where: {
            id: id
        },
        data: {
            is_active: false
        }
    })

    await prisma.$disconnect()

    if(!deleteData) return Response.json({
        message:"Failed to Deactivate Employee"
    })

    return Response.json({
        message:"Employee successfully Deactivated!"
    })
}