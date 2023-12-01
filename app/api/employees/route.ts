import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function GET()
{
    const prisma = new PrismaClient()
    const getEmployees = await prisma.employees.findMany()
    await prisma.$disconnect()
    return Response.json(getEmployees)
}

export async function POST(req: Request)
{
    const {name, employee_code} = await req.json()
    const prisma = new PrismaClient()
    const pin = await bcrypt.hash('12345678', 10)
    const admin_id = ""
    return Response.json(pin)
    const createEmployee = await prisma.employees.create({
        data: {
            name: name,
            pin: pin,
            employee_code: employee_code,
            admin_id: 
        }
    })

    await prisma.$disconnect()

    if(!createEmployee) return Response.json({
        message: "Create Employee Failed"
    })

    return Response.json({
        message: "Employee successfully created"
    })

}