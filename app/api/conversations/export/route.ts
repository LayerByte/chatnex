import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { isAdmin } from '@/lib/auth/auth';

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const conversations = await db.conversation.findMany({ include: { messages: { orderBy: { createdAt: 'asc' } } }, orderBy: { startedAt: 'desc' } });
  return new NextResponse(JSON.stringify(conversations, null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="chatnex-conversations.json"' } });
}
