import { z } from 'zod/v4';

export const addContactSchema = z.object({
  email: z.string().email('Email invalido'),
});

export type AddContactInput = z.infer<typeof addContactSchema>;
