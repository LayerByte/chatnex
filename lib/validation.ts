import { z } from 'zod';

export const chatSchema = z.object({
  widgetId: z.string().trim().min(1).max(100),
  conversationId: z.string().trim().max(100).optional(),
  visitorId: z.string().trim().min(8).max(100),
  message: z.string().trim().min(1).max(4000),
});

export const knowledgeSchema = z.object({
  widgetId: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().max(80),
  content: z.string().trim().min(1).max(20000),
  keywords: z.string().trim().max(1000).optional().default(''),
  enabled: z.boolean().default(true),
});

export const faqSchema = z.object({
  widgetId: z.string().trim().min(1).max(100),
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(10000),
  category: z.string().trim().max(80),
  enabled: z.boolean().default(true),
});

export const settingsSchema = z.object({
  systemPrompt: z.string().trim().min(1).max(10000).optional(),
  personality: z.string().trim().min(1).max(80).optional(),
  responseStyle: z.string().trim().min(1).max(80).optional(),
  language: z.string().trim().min(1).max(40).optional(),
  maxResponseLength: z.number().int().min(100).max(4000).optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  position: z.enum(['bottom-right', 'bottom-left']).optional(),
  widgetSize: z.enum(['small', 'medium', 'large']).optional(),
  borderRadius: z.number().int().min(0).max(32).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  placeholder: z.string().trim().min(1).max(120).optional(),
  quickActions: z.array(z.string().trim().min(1).max(100)).max(8).optional(),
  storeConversations: z.boolean().optional(),
});

export const widgetUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  statusText: z.string().trim().min(1).max(80).optional(),
  avatarUrl: z.string().url().max(1000).nullable().optional(),
  welcomeMessage: z.string().trim().min(1).max(1000).optional(),
});
