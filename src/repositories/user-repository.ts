import { prisma } from '@/lib/prisma';

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async searchByEmail(email: string, excludeId: string) {
    return prisma.user.findMany({
      where: {
        email: { contains: email, mode: 'insensitive' },
        id: { not: excludeId },
      },
      select: { id: true, fullName: true, email: true, avatarUrl: true, status: true },
      take: 10,
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.user.update({
      where: { id },
      data: { status, lastSeen: new Date() },
    });
  },

  async updateProfile(id: string, data: { fullName?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
