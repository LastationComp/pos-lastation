import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { license_key } = await req.json();

  const checkLicenseKey = await prisma.clients.findFirst({
    where: {
      license_key: license_key,
      created_at: {
        lte: new Date()
      }
    },
    select: {
      license_key: true,
      client_code: true,
      is_active: true,
      expired_at: true,
    },
  });
  if (!checkLicenseKey)
    return Response.json(
      {
        message: 'Incorrect License Key, Please input the correct License Key',
      },
      { status: 400 }
    );

  if (!checkLicenseKey.is_active || checkLicenseKey.expired_at < new Date())
    return Response.json(
      {
        message: 'Looks like the License Key is expired or not been activated, Please contact the Web Owner',
        
      },
      { status: 400 }
    );

    
  return Response.json({
    message: 'License Key correct',
    client: checkLicenseKey
  });
}
