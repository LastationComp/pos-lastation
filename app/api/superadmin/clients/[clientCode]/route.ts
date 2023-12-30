import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request, route: { params: { clientCode: string } }) {
  const client_code = route.params.clientCode;
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
  const client_code = route.params.clientCode;
  const deactivateClient = await prisma.clients.update({
    where: {
      client_code: client_code,
    },
    data: {
      is_active: false,
    },
  });

  await prisma.$disconnect();
  if (!deactivateClient)
    return Response.json({
      message: 'Failed to Deactivate this Client',
    });

  return Response.json({
    message: 'Successfully Deactivate this Client!',
  });
}

export async function PUT(req: Request, route: { params: { clientCode: string } }) {
  const client_code = route.params.clientCode;
  const activateClient = await prisma.clients.update({
    where: {
      client_code: client_code,
    },
    data: {
      is_active: true,
    },
  });
  await prisma.$disconnect();
  if (!activateClient)
    return Response.json({
      message: 'Failed to Activate this Client',
    });

  return Response.json({
    message: 'Successfully Activate this Client!',
  });
}
