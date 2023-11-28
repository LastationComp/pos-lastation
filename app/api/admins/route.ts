import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import bcrypt from 'bcrypt'
export async function POST(req: Request) {
  const formData = await req.formData();
  if (!formData.has('file')) return Response.json({
    success: false
  })
  const files: File = formData.get('file') as File;
  const publicPath = process.cwd() + '/public/'
  const buffer = Buffer.from(await files.arrayBuffer())
  console.log(files);
  await writeFile(publicPath + files.name, buffer);
  const prisma = new PrismaClient();
  
  const getAdmin = await prisma.admins.findMany();
  await prisma.$disconnect();

  return Response.json({
    success: true,
    data: getAdmin,
    image: files.type,
  });
}
