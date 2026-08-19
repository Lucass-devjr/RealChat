import { prisma } from '@/lib/prisma';
import type { MessageType } from '@prisma/client';

const senderSelect = {
  id: true,
  fullName: true,
  avatarUrl: true,
} as const;

export const messageRepository = {
  async findByConversation(
    conversationId: string,
    cursor?: string,
    limit: number = 50,
  ) {
    const messages = await prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      include: {
        sender: { select: senderSelect },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;

    return {
      data: data.reverse(),
      nextCursor: hasMore ? data[0]?.id : undefined,
      hasMore,
    };
  },

  async create(data: {
    conversationId: string;
    senderId: string;
    content: string;
    type: MessageType;
    fileUrl?: string;
    fileName?: string;
    replyToId?: string;
  }) {
    const message = await prisma.message.create({
      data,
      include: {
        sender: { select: senderSelect },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: { select: { id: true, fullName: true } },
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  },

  async update(id: string, content: string) {
    return prisma.message.update({
      where: { id },
      data: { content, editedAt: new Date() },
      include: {
        sender: { select: senderSelect },
      },
    });
  },

  async softDelete(id: string) {
    return prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: { sender: { select: senderSelect } },
    });
  },

  async getUnreadCount(conversationId: string, lastReadAt: Date | null) {
    if (!lastReadAt) {
      return prisma.message.count({
        where: { conversationId, deletedAt: null },
      });
    }
    return prisma.message.count({
      where: {
        conversationId,
        deletedAt: null,
        createdAt: { gt: lastReadAt },
      },
    });
  },
};
