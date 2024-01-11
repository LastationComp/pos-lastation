import { responseError } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
export async function POST(req: Request) {
  const { license_key } = await req.json();

  const checkSetting = await prisma.clients.findFirst({
    where: {
      license_key: license_key,
    },
    select: {
      admin: {
        select: {
          setting: {
            select: {
              emp_can_login: true,
              shop_open_hours: true,
              shop_close_hours: true,
            },
          },
        },
      },
    },
  });

  const shopOpen = checkSetting?.admin?.setting?.shop_open_hours.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('24', '00') ?? '';
  const shopClose = checkSetting?.admin?.setting?.shop_close_hours.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('24', '00') ?? '';
  const dateNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace('24', '00');
  const workTime = shopOpen <= dateNow && dateNow < shopClose;
  if (!workTime)
    return responseError({
      message: "You can't login outside work time",
      shopOpen: shopOpen,
      dateNow: dateNow,
      shopClose: shopClose,
    });
  if (!checkSetting?.admin?.setting?.emp_can_login) return responseError("You can't login for now, please contact your Admin");

  await prisma.$disconnect();

  return Response.json({
    message: 'Employee Can Login',
    client: checkSetting,
  });
}
