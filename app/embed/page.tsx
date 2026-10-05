import ChatWidget from '@/components/chat/ChatWidget';
export default async function Embed({ searchParams }: { searchParams: Promise<{ chatnex?: string }> }) { const params = await searchParams; return <ChatWidget widgetId={params.chatnex || 'demo'} embedded />; }
