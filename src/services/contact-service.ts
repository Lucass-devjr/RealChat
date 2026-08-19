import { contactRepository } from '@/repositories/contact-repository';
import { userRepository } from '@/repositories/user-repository';

export const contactService = {
  async getAll(userId: string) {
    return contactRepository.findAllByUser(userId);
  },

  async add(userId: string, email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Usuario nao encontrado');
    if (user.id === userId) throw new Error('Voce nao pode adicionar a si mesmo');

    const existing = await contactRepository.findByEmail(userId, email);
    if (existing) throw new Error('Contato ja adicionado');

    return contactRepository.create(userId, user.id);
  },

  async remove(id: string, userId: string) {
    return contactRepository.delete(id, userId);
  },

  async search(email: string, userId: string) {
    return userRepository.searchByEmail(email, userId);
  },
};
