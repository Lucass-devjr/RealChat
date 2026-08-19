import { z } from 'zod/v4';

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid('ID de conversa invalido'),
  content: z.string().min(1, 'Mensagem nao pode ser vazia').max(5000, 'Mensagem muito longa'),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  replyToId: z.string().uuid().optional(),
});

export const editMessageSchema = z.object({
  content: z.string().min(1, 'Mensagem nao pode ser vazia').max(5000, 'Mensagem muito longa'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type EditMessageInput = z.infer<typeof editMessageSchema>;
