import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { readFileSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';
import { backendClient } from '@/app/_lib/EdgeStore/edgestore-server';

const production = process.env.NODE_ENV === 'production';
export async function GET(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get('callbackUrl') ?? '';
  const checkEmployee = await prisma.employees.findFirst({
    where: {
      id: route.params.userId,
    },
    select: {
      name: true,
      avatar_url: true,
    },
  });
  await prisma.$disconnect();
  if (!checkEmployee?.name) return responseError('Unauthorized', 401);

  try {
    if (!production) {
      const filePath = path.resolve('.', `public/employees/${callbackUrl}`);
      const imageBuffer = readFileSync(filePath);
      const blob = new Blob([imageBuffer]);
      return new Response(blob);
    } else {
      const blob = await backendClient.publicFiles.getFile({
        url: callbackUrl,
      });
      if (blob.url !== callbackUrl) return responseError('Unauthorized', 401);
      const responseImage = await fetch(blob.url, {
        cache: 'no-store',
      });
      const blobResult = await responseImage.blob();
      return new Response(blobResult.stream());
    }
  } catch (err: any) {
    return responseError('Unauthorized', 401);
  }
}

export async function POST(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const body = await req.blob();
  const requestUrl = new URL(req.url);
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') ?? null;
  const getEmployee = await prisma.employees.findFirst({
    where: {
      id: route.params.userId,
    },
    select: {
      name: true,
      avatar_url: true,
    },
  });

  if (!getEmployee?.name || !callbackUrl) return responseError('Unauthorized', 401);

  const buffer = Buffer.from(await body.arrayBuffer());
  let newCallBackUrl;
  try {
    if (!production) {
      const publicPath = process.cwd() + '/public/employees/';
      const filePath = publicPath + callbackUrl;

      await writeFile(filePath, buffer);
    } else {
      const fileEmployee = new Blob([buffer], {
        type: 'image/*',
      });
      const edgestore = await backendClient.publicFiles.upload({
        content: {
          blob: fileEmployee,
          extension: 'webp',
        },
        ctx: {
          userId: route.params.userId,
          userRole: 'employee',
        },
        input: {
          type: 'employees',
        },
      });
      newCallBackUrl = requestUrl.origin + '/api/images/' + route.params.userId + '?callbackUrl=' + edgestore.url
    }
    const updateAvatarUrl = await prisma.employees.update({
      where: {
        id: route.params.userId,
      },
      data: {
        avatar_url: newCallBackUrl,
      },
    });
    await prisma.$disconnect();
    if (updateAvatarUrl) return responseSuccess(newCallBackUrl);
  } catch (err) {
    console.log(err);
    return responseError('File not uploaded', 500);
  }
}

export async function DELETE(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get('callbackUrl') ?? '';
  const isAuthorized = prisma.employees.findFirst({
    where: {
      id: route.params.userId,
    },
    select: {
      name: true,
    },
  });
  if (!isAuthorized) return responseError('Unauthorized', 401);
  try {
    if (!production) {
      const filePath = path.resolve('.', `public/employees/${callbackUrl}`);
      await unlink(filePath);
    } else {
      await backendClient.publicFiles.deleteFile({
        url: callbackUrl,
      });
    }
  } catch (err: any) {
    return responseError('Unauthorized');
  }

  return responseSuccess('File Successfully Deleted');
}
