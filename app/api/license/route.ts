import { formatDateNowWithRegion } from '@/app/_lib/DateFormat';
import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
export async function POST(req: Request) {
  const { license_key } = await req.json();

  const checkLicenseKey = await prisma.clients.findFirst({
    where: {
      license_key: license_key,
    },
    select: {
      license_key: true,
      client_code: true,
      is_active: true,
      expired_at: true,
    },
  });

  if (!checkLicenseKey) return responseError('Incorrect License Key, Please input the correct License Key');

  if (!checkLicenseKey.is_active) return responseError('The License Key is not activated, Please contact the Web Owner');

  if ((checkLicenseKey.expired_at ?? '') < formatDateNowWithRegion('Asia/Jakarta')) {
    return responseError('Looks like the License Key is expired, Please contact the Web Owner');
  }

  await prisma.$disconnect();

  return responseSuccess({
    message: 'License Key correct',
    client: checkLicenseKey,
  });
}
