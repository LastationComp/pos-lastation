import { Prisma } from '@prisma/client';
import {z} from 'zod'
export const SuperAdminCreateInput = z.object({
  name: z.string().max(100),
  username: z
    .string()
    .max(100)
    .regex(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/, 'igm'), 'Username not Validated'),
  password: z.string().min(8).max(100),
}) satisfies z.Schema<Prisma.SuperAdminUncheckedCreateInput>;

