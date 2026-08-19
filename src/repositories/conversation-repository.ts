import { prisma } from '@/lib/prisma';

const memberSelect = {
  id: true,
  userId: true,
  role: true,
  lastReadAt: true,
  user: {
    select: { id: true, fullName: true, avatarUrl: true, status: true },
  },
} as const;

const lastMessageSelect = {
  id: true,
  content: true,
  createdAt: true,
  sender: { select: { id: true, fullName: true } },
} as const;

export const conversationRepository = {
  async findAllByUser(userId: string) {
    return prisma.conversation.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { select: memberSelect },
        messages: {
          select: lastMessageSelect,
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async findById(id: string, userId: string) {
    return prisma.conversation.findFirst({
      where: { id, members: { some: { userId } } },
      include: {
        members: { select: memberSelect },
        _count: { select: { messages: true } },
      },
    });
  },

  async findDirectBetween(userId1: string, userId2: string) {
    return prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: userId1 } } },
          { members: { some: { userId: userId2 } } },
        ],
      },
    });
  },

  async createDirect(userId: string, otherUserId: string) {
    return prisma.conversation.create({
      data: {
        isGroup: false,
        members: {
          create: [
            { userId, role: 'MEMBER' },
            { userId: otherUserId, role: 'MEMBER' },
          ],
        },
      },
      include: {
        members: { select: memberSelect },
      },
    });
  },

  async createGroup(name: string, creatorId: string, memberIds: string[]) {
    const allMemberIds = [creatorId, ...memberIds.filter((id) => id !== creatorId)];
    return prisma.conversation.create({
      data: {
        name,
        isGroup: true,
        members: {
          create: allMemberIds.map((id) => ({
            userId: id,
            role: id === creatorId ? 'ADMIN' : 'MEMBER',
          })),
        },
      },
      include: {
        members: { select: memberSelect },
      },
    });
  },

  async updateLastRead(conversationId: string, userId: string) {
    return prisma.conversationMember.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    });
  },

  async delete(id: string) {
    return prisma.conversation.delete({ where: { id } });
  },
};
