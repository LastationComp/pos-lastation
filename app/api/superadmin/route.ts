import { SuperAdminCreateInput } from '@/app/_lib/ZodValidator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
export async function GET() {
  const prisma = new PrismaClient();
  const superAdmin = await prisma.superAdmin.findMany();
  await prisma.$disconnect();
  return Response.json(superAdmin);
}

export async function POST(req: Request) {
  const { name, username, password } = await req.json();

  const prisma = new PrismaClient().$extends({
    query: {
      superAdmin: {
        async create({ args, query }) {
          args.data = SuperAdminCreateInput.required().parse(args.data);
          args.data.password = await bcrypt.hash(args.data.password ?? '', 10);
          return query(args);
        },
      },
    },
  });

  const checkSuperAdmin = await prisma.superAdmin.findFirst({
    where: {
      username: username,
    },
    select: {
      username: true,
    },
  });

  if (checkSuperAdmin?.username)
    return Response.json(
      {
        errors: 'Username already exists',
      },
      { status: 400 }
    );

  try {
    await prisma.superAdmin.create({
      data: {
        name: name,
        username: username,
        password: password,
      },
    });
  } catch (err: any) {
    return Response.json(
      {
        errors: err?.issues[0]?.message,
      },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }

  await prisma.$disconnect();

  return Response.json({
    success: true,
  });
}
