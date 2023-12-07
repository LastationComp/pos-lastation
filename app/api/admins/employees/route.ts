import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";



export async function GET()
{
    const prisma = new PrismaClient()
    const getEmployees = await prisma.employees.findMany()
    await prisma.$disconnect()
    return Response.json(getEmployees)
}

export async function POST(req: Request)
{
    const {name, id, } = await req.json()
    const prisma = new PrismaClient()
    const admin_id = id
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

    

    if(!createEmployee) return responseError('Create Employee Failed');

    return responseSuccess('Employee successfully created');

}