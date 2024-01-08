import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { PrismaClient } from '@prisma/client';

export async function GET(req: Request, route: { params: { customerCode: string } }) {
  const prisma = new PrismaClient();
  const customer_code = route.params.customerCode;
  const getMember = await prisma.customers.findFirst({
    where: {
      customer_code: customer_code,
    },
  });

  await prisma.$disconnect();
  if (!getMember) return responseError('Data Not Found');
  return Response.json({
    member: getMember,
  });
}

export async function POST(req: Request, route: { params: { customerCode: string } }) {
  const { name, email, phone, point } = await req.json();
  const prisma = new PrismaClient();
  const customer_code = route.params.customerCode;
  const updateMembers = await prisma.customers.update({
    where: {
      customer_code: customer_code,
    },
    data: {
      name: name,
      email: email,
      phone: phone,
      point: point,
    },
  });

  await prisma.$disconnect();

  if (!updateMembers) return responseError('Failed to Update Member');

  return responseSuccess('Members Successfully Deleted!');
}

export async function DELETE(req: Request, route: { params: { customerCode: string } }) {
  const prisma = new PrismaClient();
  const customer_code = route.params.customerCode;
  const deleteMembers = await prisma.customers.delete({
    where: {
      customer_code: customer_code,
    },
  });

  await prisma.$disconnect();
  if (!deleteMembers) return responseError('Failed to Delete Member');
  return responseSuccess('Member Successfully Deleted!');
}
