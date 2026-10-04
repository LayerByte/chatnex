import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { isAdmin } from '@/lib/auth/auth';
import { settingsSchema } from '@/lib/validation';
export async function GET(){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const w=await db.widget.findFirst({include:{settings:true}});return NextResponse.json(w)}
export async function PUT(req:Request){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const b=settingsSchema.parse(await req.json());const w=await db.widget.findFirst();if(!w)return NextResponse.json({error:'Widget not found'},{status:404});const {quickActions,...rest}=b;const s=await db.chatSettings.update({where:{widgetId:w.id},data:{...rest,...(quickActions?{quickActionsJson:JSON.stringify(quickActions)}:{})}});return NextResponse.json(s)}
