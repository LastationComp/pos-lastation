import { PrismaClient } from '@prisma/client';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
export const prisma = new PrismaClient()
export async function GET(req: Request, route: { params: { username: string } }) {
    const url = new URL(req.url)

    const getAdmins = await prisma.clients.findFirst({
      where: {
        license_key: url.searchParams.get('license') ?? '',
        admin: {
            username: route.params.username
        },
      },
      include: {
        admin: true
      },
    });

    prisma.$disconnect()
    if (!getAdmins) return Response.json(null)
    return Response.json({
        client: getAdmins?.client_name,
        admin: getAdmins?.admin
    })
}

export async function POST(req: Request, route: { params: { username: string } }) {
    const {license_key, new_password, old_password} = await req.json()
  const checkAdmins = await prisma.admins.findFirst({
    where: {
        username: route.params.username,
        client: {
            license_key: license_key ?? ''
        }
    },
  });

  if (!checkAdmins || !new_password || !old_password)
    return Response.json(
      {
        message: 'Please check your credentials',
      },
      { status: 400 }
    );

  const matchPassword = await bcrypt.compare(old_password, checkAdmins?.pin ?? '')

  if (!matchPassword) return Response.json({
    message: 'Old Password not Match'
  }, {status: 400})

  const hashedPin = await bcrypt.hash(new_password, 10)
  const updatePassword = await prisma.admins.update({
    where: {
        id: checkAdmins?.id
    }, 
    data: {
        pin: hashedPin
    }
  })
  if (!updatePassword) return Response.json({
    message: 'Update Failed'
  }, {status: 400});


  return Response.json({
    message: 'Update Successfully'
  });
}
