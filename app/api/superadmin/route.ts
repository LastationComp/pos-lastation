import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
export async function GET()
{
    const prisma = new PrismaClient()
    const superAdmin = await prisma.superAdmin.findMany()
    await prisma.$disconnect()
    return Response.json(superAdmin)
}

export async function POST()
{
    const prisma = new PrismaClient()
    const hashedPassword = await bcrypt.hash("12345678",10)
    await prisma.superAdmin.create({
        data: {
            name: "Affansyah",
            username: "Hanan",
            password: hashedPassword
        }
    })
    await prisma.$disconnect()
    return Response.json({
        success: true
    })

}
