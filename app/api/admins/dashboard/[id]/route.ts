import { prisma } from "@/app/_lib/prisma/client";


export async function GET(req: Request, route: { params: { id: string } }) {
  const id = route.params.id;
  const getEmployeeActive = await prisma.employees.count({
    where: {
      admin_id: id,
      is_active: true,
    },
  });

  const getEmployeeNonActive = await prisma.employees.count({
    where: {
      admin_id: id,
      is_active: false,
    },
  });

  const transaction = await prisma.transactions.findMany({
    where: {
      employee: {
        admin: {
          id: id,
        },
      },
    },
    select: {
      created_at: true,
      total_price: true,
    },
  });

  let totalTrx = 0;
  let totalPriceTrx = 0;
  transaction
    .filter((data) => data.created_at.getDate() === new Date().getDate())
    .map((data) => {
      totalPriceTrx += Number(data.total_price);
      totalTrx += 1;
    });

  const totalTransactionToday = {
    total_price: totalPriceTrx,
    total_trx: totalTrx,
  };

  totalTrx = 0;
  totalPriceTrx = 0;

  transaction
    .filter((data) => data.created_at.getMonth() === new Date().getMonth())
    .map((data) => {
      totalPriceTrx += Number(data.total_price);
      totalTrx += 1;
    });

  const totalTransactionMonthly = {
    total_price: totalPriceTrx,
    total_trx: totalTrx,
  };

  await prisma.$disconnect();
  return Response.json({
    total_emp_active: getEmployeeActive,
    total_emp_nonactive: getEmployeeNonActive,
    total_transactions_today: totalTransactionToday,
    total_transactions_monthly: totalTransactionMonthly,
    transactions: transaction
  });
}
