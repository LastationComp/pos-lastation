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
    const {name} = await req.json()
    const prisma = new PrismaClient()
    const client_code = "SK_"
    const getEmployeeCode = await prisma.employees.findFirst({
        orderBy: {
            created_at: "desc"
        }
    })
    const last_employee_code :any[] = getEmployeeCode?.employee_code.toString().split("_")??[]
    const number: string = last_employee_code.length != 0 ? last_employee_code[1]  : 0
    const final_employee_code = Number(number)+1
    const employee_code = client_code + final_employee_code.toString().padStart(4,"0")
    const pin = await bcrypt.hash('12345678', 10)
    const admin_id = "18cf3c3f-fb35-496f-a862-bac3987bb689"
    const createEmployee = await prisma.employees.create({
        data: {
            name: name,
            pin: pin,
            employee_code: employee_code,
            admin_id: admin_id
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