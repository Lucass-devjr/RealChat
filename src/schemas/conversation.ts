import { z } from 'zod/v4';

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Nome do grupo deve ter no minimo 2 caracteres').max(50),
  memberIds: z.array(z.string().uuid()).min(1, 'Selecione pelo menos um membro'),
});

export const createDirectSchema = z.object({
  userId: z.string().uuid('ID de usuario invalido'),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type CreateDirectInput = z.infer<typeof createDirectSchema>;
