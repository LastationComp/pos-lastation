import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
export async function GET() {
  const prisma = new PrismaClient();
  const getClient = await prisma.clients.findMany({
    include: {
      admin: {
        select: {
          username: true,
          pin: true,
        },
      },
    },
  });

  await prisma.$disconnect();

  //   if (!getClient) return false;
  return Response.json(getClient);
}

export async function POST(req: Request) {
  const { client_name, super_admin_id, service_days } = await req.json();
  const prisma = new PrismaClient();
  const string_client_name: string = client_name;
  const client_code_first: any[] = string_client_name.trim().toString().split(' ');
  let client_code_final: any = '';
  let super_admin: string;
  let firstLetterBackup: any[];
  client_code_first.forEach((data: string) => {
    const firstLetter: any[] = data.split('');
    client_code_final += firstLetter[0];
  });

  const clients = await prisma.clients.findMany({
    where: {
      client_code: {
        startsWith: client_code_final,
      },
    },
    select: {
      client_name: true,
      client_code: true,
    },
  });
  const checkClient1 = clients.filter((data) => data.client_name === client_name)[0];
  if (checkClient1?.client_name === client_name)
    return Response.json(
      {
        message: 'Client already exists',
      },
      { status: 404 }
    );

  if (checkClient1?.client_name !== client_name && clients.length !== 0) {
    firstLetterBackup = client_code_first[0].split('');
    client_code_final += firstLetterBackup[Math.abs(Math.round(Math.random() * (firstLetterBackup.length - 1)))];
  }

  let session: any;
  super_admin = super_admin_id;
  if (!super_admin_id) {
    session = await getServerSession(authOptions);
    super_admin = session?.user.id;
  }
  const admin_username = string_client_name.replace(/\s+/g, '').toLocaleLowerCase();
  const license_key = randomUUID() + Math.abs(Math.floor(Math.random() * 10101010));
  const service_days_number: number = service_days;
  const expired_at = new Date();
  expired_at.setDate(expired_at.getDate() + service_days_number);
  const hashedPin = await bcrypt.hash('12345678', 10);
  const createClient = await prisma.clients.create({
    data: {
      license_key: license_key,
      client_name: client_name,
      client_code: client_code_final.toLocaleUpperCase(),
      super_admin_id: super_admin,
      expired_at: expired_at,
      admin: {
        create: {
          pin: hashedPin,
          name: 'Admin ' + client_name,
          username: admin_username,
          setting: {
            create: {
              emp_can_login: true,
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();

  if (!createClient) return false;

  return Response.json({
    success: true,
    message: 'Client successfully added',
  });
}
