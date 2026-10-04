import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
export async function GET(){try{await db.$queryRaw`SELECT 1`;return NextResponse.json({status:'ok',service:'chatnex',database:'ok',timestamp:new Date().toISOString()})}catch{return NextResponse.json({status:'degraded',service:'chatnex',database:'error'},{status:503})}}
