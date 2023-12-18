import { responseError } from '@/app/_lib/PosResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { license_key } = await req.json();

  const checkLicenseKey = await prisma.clients.findFirst({
    where: {
      license_key: license_key,
      created_at: {
        lte: new Date(),
      },
      is_active: true,
    },
    select: {
      license_key: true,
      client_code: true,
      is_active: true,
      expired_at: true,
    },
  });
  
  if (!checkLicenseKey) return responseError('Incorrect License Key, Please input the correct License Key');

  if (!checkLicenseKey.is_active || (checkLicenseKey.expired_at ?? '') < new Date()) {
    await prisma.clients.update({
      where: {
        license_key: checkLicenseKey.license_key,
        expired_at: {
          lt: new Date(),
        },
      },
      data: {
        is_active: false,
      },
    });
    return Response.json(
      {
        message: 'Looks like the License Key is expired, Please contact the Web Owner',
      },
      { status: 400 }
    );
  }

  await prisma.$disconnect();

  return Response.json({
    message: 'License Key correct',
    client: checkLicenseKey,
  });
}
