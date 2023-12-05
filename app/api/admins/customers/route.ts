import { PrismaClient } from "@prisma/client";
import { disconnect } from "process";

export async function GET()
{
    const prisma = new PrismaClient()
    const getCustomers = await prisma.customers.findMany()

    await prisma.$disconnect()

    return Response.json(getCustomers)
}

export async function POST(req: Request)
{
    const {name, email, phone} = await req.json()
    const prisma = new PrismaClient()
    const createCustomers = await prisma.customers.create({
        data: {
            customer_code : "6677",
            name : name,
            email : email,
            phone : phone,
            created_by: "4b572581-bcff-4bcc-8ff0-a195759a3786"
        }
    })

    await prisma.$disconnect()
    return Response.json({
        success:true,
        message:"Customers succesfully created!"
    })
}