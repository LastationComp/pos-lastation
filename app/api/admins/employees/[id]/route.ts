import { responseError } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import bcrypt from 'bcrypt';
export async function POST(req: Request, route: { params: { id: any } }) {
  const { name, pin, avatar_url } = await req.json();
  const hashedPin = await bcrypt.hash(pin, 10);
  const id = route.params.id;
  const updateEmployee = await prisma.employees.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      pin: hashedPin,
      avatar_url: avatar_url,
    },
  });

  await prisma.$disconnect();

  if (!updateEmployee)
    return Response.json({
      message: 'Failed to update your data',
    });

  return Response.json({
    message: 'Your data successfully updated!',
  });
}

export async function DELETE(req: Request, route: { params: { id: any } }) {
  const id = route.params.id;
  try {
    const deleteData = await prisma.employees.update({
      where: {
        id: id,
      },
      data: {
        is_active: false,
      },
    });
    if (!deleteData) return responseError('Failed to Deactivate Employee');
    return Response.json({
      message: 'Employee successfully Deactivated!',
    });
  } catch (e: any) {
    return responseError('Failed to Deactivate Employee');
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request, route: { params: { id: any } }) {
  const id = route.params.id;
  try {
    const deleteData = await prisma.employees.update({
      where: {
        id: id,
      },
      data: {
        is_active: true,
      },
    });
    if (!deleteData) return responseError('Failed to Activate Employee');
    return Response.json({
      message: 'Employee successfully Activate!',
    });
  } catch (e: any) {
    return responseError('Failed to Activate Employee');
  } finally {
    await prisma.$disconnect();
  }
}
