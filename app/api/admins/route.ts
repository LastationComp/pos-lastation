
import { prisma } from '@/app/_lib/prisma/client';
import { writeFile } from 'fs/promises';
export async function POST(req: Request) {
  const formData = await req.formData();
  if (!formData.has('file')) return Response.json({
    success: false
  })
  const files: File = formData.get('file') as File;
  const publicPath = process.cwd() + '/public/'
  const buffer = Buffer.from(await files.arrayBuffer())
  await writeFile(publicPath + files.name, buffer);
  
  const getAdmin = await prisma.admins.findMany();
  await prisma.$disconnect();

  return Response.json({
    success: true,
    data: getAdmin,
    image: files.type,
  });
}

