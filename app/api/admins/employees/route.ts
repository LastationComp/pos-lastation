import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


export const responseError = (message: any, code: number = 400) => {
    return Response.json({
        message: message
    }, {status: code})
}
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
    const admin_id = "501cd053-0c46-4f52-b7b9-c96cd0eeba84"
    const getAllData = await prisma.admins.findFirst({
        where: {
            id: admin_id
        },
        select: {
            name: true,
            employees: {
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    employee_code: true
                },
                take: 1
            },
            client: {
                select: {
                    client_code: true
                }
            }
        }
    })

    if(!getAllData?.name) return responseError("Data Not Found",404)

    const employee_code_first = getAllData?.employees[0]?.employee_code ?? getAllData?.client?.client_code 
    const last_employee_code :any[] = employee_code_first.toString().split("_")
    const number: string = last_employee_code[1] ?? 0
    const final_employee_code = Number(number)+1
    const employee_code = last_employee_code[0] + '_' + final_employee_code.toString().padStart(4,"0")
    const pin = await bcrypt.hash('12345678', 10)
    
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