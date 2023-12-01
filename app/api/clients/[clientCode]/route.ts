import { PrismaClient } from '@prisma/client';

export async function GET(req: Request, route: { params: { clientCode: string } }) {
  const client_code = route.params.clientCode;
  const prisma = new PrismaClient();
  const getClient = await prisma.clients.findFirst({
    where: {
      client_code: client_code,
    },
  });
  await prisma.$disconnect();
  return Response.json(getClient);
}

export async function POST(req: Request, route: { params: { clientCode: string } }) {
  const { license_key, is_active, expired_at, super_admin_id } = await req.json();
  const prisma = new PrismaClient();
  const client_code = route.params.clientCode;
  const updateData = await prisma.clients.update({
    where: {
      client_code: client_code,
    },
    data: {
      license_key: license_key,
      is_active: is_active,
      expired_at: expired_at,
      super_admin_id: super_admin_id,
    },
  });
  await prisma.$disconnect();
  if (!updateData) return false;
  return Response.json({
    success: true,
    message: 'Data Successfully Update',
  });
}

export async function DELETE(req: Request, route: { params: { clientCode: string } }) {
  const prisma = new PrismaClient();
  const client_code = route.params.clientCode;
  const deleteData = await prisma.clients.delete({
    where: {
      client_code: client_code,
    },
  });

  await prisma.$disconnect();
  if (!deleteData) return false;
  return Response.json({
    success: true,
    message: 'Data Client berhasil dihapus!',
  });
}
