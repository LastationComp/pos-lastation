import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { readFileSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const checkEmployee = await prisma.employees.findFirst({
    where: {
      id: route.params.userId,
    },
    select: {
      avatar_url: true,
    },
  });

  if (!checkEmployee?.avatar_url) return responseError('Unauthorized');

  try {
    const filePath = path.resolve('.', `public/employees/${route.params.avatarUrl}`);
    const imageBuffer = readFileSync(filePath);
    const blob = new Blob([imageBuffer]);
    return new Response(blob);
  } catch (err: any) {
    return responseError('Unauthorized');
  }
}

export async function POST(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  const body = await req.blob();
  try {
    const publicPath = process.cwd() + '/public/employees/';
    const filePath = publicPath + route.params.avatarUrl;
    const buffer = Buffer.from(await body.arrayBuffer());
    await writeFile(filePath, buffer);
  } catch (err: any) {
    return responseError('File not Uploaded');
  }
  return responseSuccess('File Uploaded');
}

export async function DELETE(req: Request, route: { params: { userId: string; avatarUrl: string } }) {
  try {
    const filePath = path.resolve('.', `public/employees/${route.params.avatarUrl}`);
    await unlink(filePath);
  } catch (err: any) {
    return responseError('Unauthorized');
  }

  return responseSuccess('File Successfully Deleted')
}
