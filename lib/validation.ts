import { z } from 'zod';
export const chatSchema=z.object({widgetId:z.string().min(1).max(100),conversationId:z.string().optional(),visitorId:z.string().min(8).max(100),message:z.string().trim().min(1).max(4000)});
export const knowledgeSchema=z.object({widgetId:z.string().min(1),title:z.string().trim().min(1).max(160),category:z.string().trim().max(80),content:z.string().trim().min(1).max(20000),keywords:z.string().max(1000).optional(),enabled:z.boolean().optional()});
export const faqSchema=z.object({widgetId:z.string().min(1),question:z.string().trim().min(1).max(500),answer:z.string().trim().min(1).max(10000),category:z.string().trim().max(80),enabled:z.boolean().optional()});
