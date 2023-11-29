import { PrismaClient } from "@prisma/client";

export async function GET()
{
    const prisma = new PrismaClient()
    const getClient = await prisma.clients.findMany()

    await prisma.$disconnect()

    if(!getClient) return false
    return Response.json(getClient)
}

export async function POST(req: Request)
{
    const {license_key, client_name, client_code, super_admin_id, pin, name, username} = await req.json()
    const prisma = new PrismaClient()
    const expired_at = new Date(2024, 6, 29)
    const checkClientCode = await prisma.clients.findFirst({
        where:{
            client_code: client_code
        }
    })

    if(checkClientCode) return Response.json({
        message:"Client Code sudah ada!",
    }, {
        status: 404
    })

    const createClient = await prisma.clients.create({
        data: {
            license_key: license_key,
            client_name: client_name,
            client_code: client_code,
            super_admin_id: super_admin_id,
            expired_at: expired_at,
            admin: {
                create: {
                    pin: pin,
                    name: name,
                    username: username,
                }
            }

        }
    })

    await prisma.$disconnect()

    if(!createClient) return false

    return Response.json({
        success:true,
        message:"Client Added!"
    })
}

