import { conversationRepository } from '@/repositories/conversation-repository';
import { messageRepository } from '@/repositories/message-repository';
import type { ConversationListItem } from '@/types';

export const conversationService = {
  async getAll(userId: string): Promise<ConversationListItem[]> {
    const conversations = await conversationRepository.findAllByUser(userId);

    return conversations.map((conv) => {
      const lastMsg = conv.messages[0];
      const member = conv.members.find((m) => m.userId === userId);
      const otherMember = conv.isGroup
        ? null
        : conv.members.find((m) => m.userId !== userId);

      return {
        id: conv.id,
        name: conv.isGroup ? conv.name : (otherMember?.user.fullName ?? null),
        isGroup: conv.isGroup,
        avatarUrl: conv.isGroup ? conv.avatarUrl : (otherMember?.user.avatarUrl ?? null),
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              createdAt: lastMsg.createdAt.toISOString(),
              senderName: lastMsg.sender.fullName,
            }
          : null,
        unreadCount: member?.lastReadAt
          ? conv._count.messages
          : 0,
        otherUser: otherMember?.user ?? null,
      };
    });
  },

  async getById(id: string, userId: string) {
    return conversationRepository.findById(id, userId);
  },

  async createDirect(userId: string, otherUserId: string) {
    const existing = await conversationRepository.findDirectBetween(userId, otherUserId);
    if (existing) return existing;
    return conversationRepository.createDirect(userId, otherUserId);
  },

  async createGroup(name: string, creatorId: string, memberIds: string[]) {
    return conversationRepository.createGroup(name, creatorId, memberIds);
  },

  async markAsRead(conversationId: string, userId: string) {
    return conversationRepository.updateLastRead(conversationId, userId);
  },

  async getMessages(conversationId: string, cursor?: string) {
    return messageRepository.findByConversation(conversationId, cursor);
  },
};
