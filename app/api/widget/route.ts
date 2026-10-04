import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { isAdmin } from '@/lib/auth/auth';
import { settingsSchema, widgetUpdateSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Widget ID is required.' }, { status: 400 });
  const widget = await db.widget.findUnique({ where: { publicId: id }, include: { settings: true } });
  if (!widget?.settings) return NextResponse.json({ error: 'Widget not found.' }, { status: 404 });
  return NextResponse.json({
    publicId: widget.publicId, name: widget.name, statusText: widget.statusText, avatarUrl: widget.avatarUrl,
    welcomeMessage: widget.welcomeMessage,
    settings: { primaryColor: widget.settings.primaryColor, position: widget.settings.position, widgetSize: widget.settings.widgetSize,
      borderRadius: widget.settings.borderRadius, theme: widget.settings.theme, placeholder: widget.settings.placeholder,
      quickActionsJson: widget.settings.quickActionsJson, storeConversations: widget.settings.storeConversations }
  });
}

export async function PUT(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const widgetId = typeof body.widgetId === 'string' ? body.widgetId : '';
  const widgetData = widgetUpdateSchema.parse(body);
  const settingsData = settingsSchema.parse(body.settings ?? {});
  const widget = await db.widget.findUnique({ where: { publicId: widgetId } });
  if (!widget) return NextResponse.json({ error: 'Widget not found.' }, { status: 404 });
  const { quickActions, ...rest } = settingsData;
  const updated = await db.$transaction([
    db.widget.update({ where: { id: widget.id }, data: widgetData }),
    db.chatSettings.update({ where: { widgetId: widget.id }, data: { ...rest, ...(quickActions ? { quickActionsJson: JSON.stringify(quickActions) } : {}) } }),
  ]);
  return NextResponse.json(updated[0]);
}
