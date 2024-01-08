import { responseError } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET(req: Request, route: { params: { userId: string } }) {

  const checkEmployee = await prisma.employees.findFirst({
    where: {
      id: route.params.userId
    },
    select: {
      avatar_url: true
    }
  })

  if (!checkEmployee?.avatar_url) return responseError('Image not Found');
  
  const filePath = path.resolve('.', `public/employees/4c8de533-5ab9-44c5-82f4-61bbf5286c5d.jpeg`);

  const imageBuffer = readFileSync(filePath);

  const blob = new Blob([imageBuffer]);
  return new Response(blob);
}
