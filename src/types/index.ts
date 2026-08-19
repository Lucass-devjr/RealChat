import type { Message, User, Conversation, ConversationMember } from '@prisma/client';

export type MessageWithSender = Message & {
  sender: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
  replyTo?: (Message & { sender: Pick<User, 'id' | 'fullName'> }) | null;
};

export type ConversationWithDetails = Conversation & {
  members: (ConversationMember & {
    user: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'status'>;
  })[];
  messages: (Message & { sender: Pick<User, 'id' | 'fullName'> })[];
  _count: { messages: number };
};

export type ConversationListItem = {
  id: string;
  name: string | null;
  isGroup: boolean;
  avatarUrl: string | null;
  lastMessage: {
    content: string;
    createdAt: string;
    senderName: string;
  } | null;
  unreadCount: number;
  otherUser?: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'status'> | null;
};

export type ContactWithUser = {
  id: string;
  nickname: string | null;
  contact: Pick<User, 'id' | 'fullName' | 'email' | 'avatarUrl' | 'status'>;
};

export type UserProfile = Pick<User, 'id' | 'fullName' | 'email' | 'avatarUrl' | 'status'>;

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
};

export type TypingUser = {
  userId: string;
  fullName: string;
};
