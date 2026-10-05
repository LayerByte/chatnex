import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { feedbackSchema } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = feedbackSchema.parse(await req.json());
    const widget = await db.widget.findUnique({ where: { publicId: body.widgetId } });
    if (!widget) return NextResponse.json({ error: 'Widget not found.' }, { status: 404 });
    const message = await db.message.findFirst({
      where: { id: body.messageId, role: 'assistant', conversation: { widgetId: widget.id, visitorId: body.visitorId } },
    });
    if (!message) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    await db.message.update({ where: { id: message.id }, data: { feedback: body.rating } });
    await db.analyticsEvent.create({ data: { widgetId: widget.id, type: body.rating === 1 ? 'positive_feedback' : body.rating === -1 ? 'negative_feedback' : 'feedback_removed', value: message.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid feedback request.' }, { status: 400 });
  }
}
