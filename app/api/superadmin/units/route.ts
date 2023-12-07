import { responseError } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET()
{
    const prisma = new PrismaClient
    const getUnits = await prisma.units.findMany()
    
    await prisma.$disconnect()
    if(getUnits.length == 0) return responseError("There is no units")
    return Response.json(getUnits)
}