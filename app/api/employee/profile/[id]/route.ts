import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request, route: { params: { id: string } }) {
  const getProfile = await prisma.employees.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      avatar_url: true,
      name: true,
      employee_code: true,
    },
  });

  return responseSuccess({
    data: getProfile,
  });
}

export async function POST(req: Request, route: { params: { id: string } }) {
  const formData = await req.formData();
  const checkFirst = await prisma.employees.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      avatar_url: true,
      name: true,
      pin: true,
    },
  });

  if (!checkFirst) return responseError('User Not Found');

  const oldPassword = (formData.get('old-password') as string) ?? null;

  let newPassword = (formData.get('new-password') as string) ?? null;
  let rePassword = (formData.get('re-password') as string) ?? null;
  let isWithPassword = false;
  let finalPassword: any = null;
  if (oldPassword && newPassword && rePassword) {
    const matchRePass = newPassword === rePassword;
    if (!matchRePass) return responseError('Re-Password cant match with New Password');
    const match = compareSync(oldPassword, checkFirst.pin);
    if (!match) return responseError('Old Password is Wrong');
    finalPassword = hashSync(newPassword, 10);
    isWithPassword = true;
  }

  let fileName = null;
  let files = (formData.get('avatar') as Blob) ?? undefined;
  if (formData.has('avatar') && files.size !== 0) {
    const extension = files.type.split('/')[1];
    fileName = uuidv4() + '.' + extension;
  }
  const finalFileName = !fileName ? checkFirst.avatar_url : process.env.NEXT_URL + '/api/images/' + route.params.id + '?callbackUrl=' + fileName;
  try {
    await prisma.employees.update({
      where: {
        id: route.params.id,
      },
      data: {
        name: (formData.get('name') as string) ?? checkFirst.name,
        pin: finalPassword ?? checkFirst.pin,
      },
    });
  } catch (e: any) {
    return responseError('Update Profile Failed');
  } finally {
    await prisma.$disconnect();

    if (formData.has('avatar') && files.size !== 0) {
      if (checkFirst.avatar_url) {
        await fetch(checkFirst.avatar_url, {
          method: 'DELETE',
        });
      }
      if (finalFileName) {

        const res = await fetch(finalFileName, {
          method: 'POST',
          body: files,
        }).then((res) => res.json());

        return responseSuccess({
          message: 'Update Profile Successfully',
          isWithPassword: isWithPassword,
          avatar_url: res.message ?? checkFirst.avatar_url,
          name: formData.get('name') ?? checkFirst.name,
        });
      }
    }

    return responseSuccess({
      message: 'Update Profile Successfully',
      name: formData.get('name') ?? checkFirst.name,
      isWithPassword: isWithPassword,
    });
  }
}
