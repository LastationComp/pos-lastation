import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { PrismaClient } from '@prisma/client';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
export const checkPassword = async (value: string) => {
  const isMatch = await bcrypt.compare('12345678', value);
  return isMatch;
};

export const prisma = new PrismaClient();

export async function GET(req: Request, route: { params: { username: string } }) {
  const url = new URL(req.url);

  const getAdmins = await prisma.clients.findFirst({
    where: {
      license_key: url.searchParams.get('license') ?? '',
      admin: {
        username: route.params.username,
      },
    },
    select: {
      client_name: true,
      admin: {
        select: {
          name: true,
          username: true,
          pin: true,
        },
      },
    },
  });

  prisma.$disconnect();
  if (!getAdmins) return Response.json(null);
  const neverChangePassword = await checkPassword(getAdmins?.admin?.pin ?? '');
  return Response.json({
    client: getAdmins?.client_name,
    admin: {
      name: getAdmins.admin?.name,
      username: getAdmins.admin?.username,
    },
    neverChangePassword: neverChangePassword,
  });
}

export async function POST(req: Request, route: { params: { username: string } }) {
  const { license_key, new_password, re_password, old_password } = await req.json();

  if (new_password.length < 8) return responseError('Password length is min 8');
  if (new_password !== re_password) return responseError('New Password and Re Password is not match');

  const checkAdmins = await prisma.admins.findFirst({
    where: {
      username: route.params.username,
      client: {
        license_key: license_key ?? '',
      },
    },
  });

  if (!checkAdmins || !new_password || !old_password) return responseError('Please check your credentials');

  const matchPassword = await bcrypt.compare(old_password, checkAdmins?.pin ?? '');

  if (!matchPassword) return responseError('Old Password not Match');

  const hashedPin = await bcrypt.hash(new_password, 10);

  try {
    const updatePassword = await prisma.admins.update({
      where: {
        id: checkAdmins?.id,
      },
      data: {
        pin: hashedPin,
      },
    });
    if (!updatePassword) return responseError('Update Failed');
  } catch (err: any) {
    return responseError('Internal Server Error');
  }

  return responseSuccess('Update Successfully');
}
