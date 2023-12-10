import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request)
{

    const prisma = new PrismaClient()
    const getMembers = await prisma.customers.findMany({
        where:{
            employee:{
                admin:{
                    client:{
                        license_key:"a89352bb-3509-49bf-9d78-aec66d186dbc2785408"
                    }
                }
            }
        },
        select:{
            customer_code:true,
            name:true,
            phone:true,
            point:true,
            employee:{
                select:{
                    name:true
                }
            }
        }
    })


    await prisma.$disconnect()
    return responseSuccess({
        members: getMembers
    })
}

export async function POST(req:Request)
{
    const {name, email, phone, idEmployee , license_key, client_code} = await req.json()
    const prisma = new PrismaClient()
    const getCustomerCode = await prisma.customers.findFirst({
        where:{
            employee:{
                admin:{
                    client:{
                        license_key:license_key
                    }
                }
            }
        },
        orderBy:{
            customer_code:"desc"
        },
        select:{
           customer_code:true
        }
    })

    const splitCustomerCode = getCustomerCode?.customer_code.toString().split("_") ?? []
    const client_code_second = client_code + "_"; 
    const number: string = splitCustomerCode[1] ?? 0
    const client_code_final =  Number(number) + 1;
    const customer_code = client_code_second + client_code_final.toString().padStart(4,"0")
    const createPrisma = await prisma.customers.create({
        data:{
            customer_code:customer_code,
            name:name,
            email:email,
            phone:phone,
            created_by:idEmployee
        }
    })

    await prisma.$disconnect()
    if(!createPrisma) return responseError("Failed to Create Members")
    return responseSuccess("Members Successfully Created!")
}