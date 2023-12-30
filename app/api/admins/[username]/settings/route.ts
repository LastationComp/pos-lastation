import { responseError, responseSuccess } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


const prisma = new PrismaClient().$extends({
    result: {
        settings: {
            openHours: {
                needs: {shop_open_hours: true},
                compute(data) {
                    const openHours = new Date(data.shop_open_hours);
                    return openHours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                },
            },
            closeHours: {
                needs: {shop_close_hours: true},
                compute(data) {
                   const closeHours = new Date(data.shop_close_hours);
                   return closeHours.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
                },
            }
        }
    }
})
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
                    emp_can_update: true,
                    openHours: true,
                    closeHours: true
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
    const {canCreate, canLogin, canUpdate, canDelete, openHours, closeHours} = await req.json()


    if (closeHours <= openHours) return responseError('Shop Close Time cant be below Shop Open Time')
    
    const splitOpenHours = openHours.toString().replace('24', '00').split(':')
    const splitCloseHours = closeHours.toString().split(':');

    const dateOpenHours = new Date()
    const dateCloseHours = new Date()
    dateOpenHours.setHours(splitOpenHours[0] ?? '0')
    dateOpenHours.setMinutes(splitOpenHours[1] ?? '0')
    dateOpenHours.setSeconds(0)
    dateCloseHours.setHours(splitCloseHours[0] ?? '0')
    dateCloseHours.setMinutes(splitCloseHours[1] ?? '0')
    dateCloseHours.setSeconds(0)
    
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
                    emp_can_update: canUpdate ?? false,
                    shop_open_hours: dateOpenHours,
                    shop_close_hours: dateCloseHours
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