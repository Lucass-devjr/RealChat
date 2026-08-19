import { prisma } from '@/lib/prisma';

export const contactRepository = {
  async findAllByUser(userId: string) {
    return prisma.contact.findMany({
      where: { userId },
      include: {
        contact: {
          select: { id: true, fullName: true, email: true, avatarUrl: true, status: true },
        },
      },
      orderBy: { contact: { fullName: 'asc' } },
    });
  },

  async findByEmail(userId: string, email: string) {
    return prisma.contact.findFirst({
      where: {
        userId,
        contact: { email },
      },
    });
  },

  async create(userId: string, contactId: string) {
    return prisma.contact.create({
      data: { userId, contactId },
      include: {
        contact: {
          select: { id: true, fullName: true, email: true, avatarUrl: true, status: true },
        },
      },
    });
  },

  async delete(id: string, userId: string) {
    return prisma.contact.deleteMany({
      where: { id, userId },
    });
  },
};
