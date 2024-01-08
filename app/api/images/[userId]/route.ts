import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { readFileSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { put, head, del } from '@vercel/blob';
import path from 'path';

const production = process.env.NODE_ENV === 'production';
export async function GET(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get('callbackUrl');
  const checkEmployee = await prisma.employees.findFirst({
    where: {
      id: route.params.userId,
    },
    select: {
      name: true,
      avatar_url: true,
    },
  });

  if (!checkEmployee?.name) return responseError('Unauthorized', 401);

  try {
    if (!production) {
      const filePath = path.resolve('.', `public/employees/${callbackUrl}`);
      const imageBuffer = readFileSync(filePath);
      const blob = new Blob([imageBuffer]);
      return new Response(blob);
    } else {
      const callbackUrl: string = url.searchParams.get('callbackUrl') ?? '';
      const blob = await head(callbackUrl, {
        token: process.env.POS_READ_WRITE_TOKEN,
      });
      if (blob.url !== callbackUrl) return responseError('Unauthorized', 401);
      const responseImage = await fetch(blob.url);
      return new Response(await responseImage.blob());
    }
  } catch (err: any) {
    return responseError('Unauthorized', 401);
  }
}

export async function POST(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const body = await req.blob();
  const requestUrl = new URL(req.url);
  const token = process.env.POS_READ_WRITE_TOKEN;
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

  try {
    if (!production) {
      const publicPath = process.cwd() + '/public/employees/';
      const filePath = publicPath + callbackUrl;
      const buffer = Buffer.from(await body.arrayBuffer());
      await writeFile(filePath, buffer);
    } else {
      const buffer = Buffer.from(await body.arrayBuffer());
      const { url } = await put(callbackUrl, buffer, {
        token: token,
        access: 'public',
      });
      requestUrl.searchParams.set('callbackUrl', url);
    }
    const updateAvatarUrl = await prisma.employees.update({
      where: {
        id: route.params.userId,
      },
      data: {
        avatar_url: requestUrl.toString(),
      },
    });

    if (updateAvatarUrl) return responseSuccess(requestUrl.toString());
  } catch (err) {
    console.log(err);
    return responseError('File not uploaded', 500);
  }
}

export async function DELETE(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get('callbackUrl') ?? '';
  try {
    if (!production) {
      const filePath = path.resolve('.', `public/employees/${callbackUrl}`);
      await unlink(filePath);
    } else {
      await del(callbackUrl, {
        token: process.env.POS_READ_WRITE_TOKEN,
      });
    }
  } catch (err: any) {
    return responseError('Unauthorized');
  }

  return responseSuccess('File Successfully Deleted');
}
