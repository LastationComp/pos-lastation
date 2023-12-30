import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma/client';

export async function GET(req: Request) {
  const session: any = await getServerSession(authOptions);
  const getEmployees = await prisma.admins.findFirst({
    where: {
      id: session?.user?.id,
      client: {
        license_key: session?.user?.license_key,
      },
    },
    orderBy: {},
    select: {
      name: true,
      employees: {
        orderBy: {
          employee_code: 'asc',
        },
        select: {
          name: true,
          id: true,
          employee_code: true,
          is_active: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  // const employees = getEmployees?.employees
  return responseSuccess({
    employees: getEmployees?.employees,
  });
}

export async function POST(req: Request) {
  const { name, id } = await req.json();
  if (!name) return responseError('Please fill Employee Name');
  const getAllData = await prisma.admins.findFirst({
    where: {
      id: id,
    },
    select: {
      name: true,
      employees: {
        orderBy: {
          created_at: 'desc',
        },
        select: {
          employee_code: true,
        },
        take: 1,
      },
      client: {
        select: {
          client_code: true,
        },
      },
    },
  });

  if (!getAllData?.name) return responseError('Data Not Found', 404);

  const employee_code_first = getAllData?.employees[0]?.employee_code ?? getAllData?.client?.client_code;
  const last_employee_code: any[] = employee_code_first.toString().split('_');
  const number: string = last_employee_code[1] ?? 0;
  const final_employee_code = Number(number) + 1;
  const employee_code = last_employee_code[0] + '_' + final_employee_code.toString().padStart(4, '0');
  const pin = await bcrypt.hash('12345678', 10);

  const createEmployee = await prisma.employees.create({
    data: {
      name: name,
      pin: pin,
      employee_code: employee_code,
      admin_id: id,
    },
  });

  await prisma.$disconnect();

  if (!createEmployee) return responseError('Create Employee Failed');

  return responseSuccess('Employee successfully created');
}
