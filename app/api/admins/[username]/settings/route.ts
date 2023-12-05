import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export const prisma = new PrismaClient()
export async function GET(req: Request, route: {params: {username: string}}) {

    const url = new URL(req.url);

    const getSettingAdmin = await prisma.admins.findFirst({
        where: {
            client: {
                license_key: url.searchParams.get('license') ?? ''
            },
            username: route.params.username
        },
        select: {
            setting: {
                select: {
                    emp_can_create: true,
                    emp_can_delete: true,
                    emp_can_login: true,
                    emp_can_update: true
                }
            }
        }
    })


    await prisma.$disconnect()
    if (!getSettingAdmin) return responseError('Data not Found', 404)

    return Response.json({
        settings: getSettingAdmin.setting
    })
}

export async function POST(req: Request, route: {params: {username: string}}) {
    const url = new URL(req.url)
    const {canCreate, canLogin, canUpdate, canDelete} = await req.json()
    try {
    await prisma.admins.update({
        where: {
            username: route.params.username,
            client: {
                license_key: url.searchParams.get('license') ?? ''
            }
        }, 
        data: {
            setting: {
                update: {
                    emp_can_create: canCreate ?? false,
                    emp_can_delete: canDelete ?? false,
                    emp_can_login: canLogin ?? false,
                    emp_can_update: canUpdate ?? false
                }
            }
        },
        select: {
            setting: {
                select: {
                    emp_can_create: true,
                    emp_can_delete: true,
                    emp_can_login: true,
                    emp_can_update: true
                }
            }
        }
    })

    return responseSuccess('Success Saved')

    } catch (e: any) {
        return responseError('Update Failed')
    }
    
}