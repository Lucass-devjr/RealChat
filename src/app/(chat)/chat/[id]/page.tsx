'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Phone, Video, MoreVertical, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageBubble } from '@/components/message-bubble';
import { MessageInput } from '@/components/message-input';
import { fetchApi } from '@/utils/api';
import { getInitials } from '@/utils/format';
import { useUser } from '@/hooks/use-user';
import type { MessageWithSender, PaginatedResponse } from '@/types';
import type { Conversation, ConversationMember, User } from '@prisma/client';

type ConversationDetail = Conversation & {
  members: (ConversationMember & {
    user: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'status'>;
  })[];
};

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<{ id: string; senderName: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const convId = params.id;

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!convId) return;
    setLoading(true);

    Promise.all([
      fetchApi<ConversationDetail>(`/api/conversations/${convId}`),
      fetchApi<PaginatedResponse<MessageWithSender>>(`/api/conversations/${convId}/messages`),
    ]).then(([convRes, msgRes]) => {
      if (convRes.data) setConversation(convRes.data);
      if (msgRes.data) setMessages(msgRes.data.data);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });
  }, [convId, scrollToBottom]);

  async function handleSend(content: string) {
    if (!user || !convId) return;

    const res = await fetchApi<MessageWithSender>(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, replyToId: replyTo?.id }),
    });

    if (res.data) {
      setMessages((prev) => [...prev, res.data!]);
      setReplyTo(null);
      setTimeout(scrollToBottom, 50);
    } else {
      toast.error(res.error);
    }
  }

  async function handleEdit(id: string, content: string) {
    const res = await fetchApi<MessageWithSender>(`/api/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });

    if (res.data) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content, editedAt: new Date() } : m)));
    } else {
      toast.error(res.error);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetchApi(`/api/messages/${id}`, { method: 'DELETE' });
    if (!res.error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } else {
      toast.error(res.error);
    }
  }

  function handleReply(message: MessageWithSender) {
    setReplyTo({
      id: message.id,
      senderName: message.sender.fullName,
      content: message.content,
    });
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Conversa nao encontrada</p>
      </div>
    );
  }

  const otherMember = conversation.isGroup
    ? null
    : conversation.members.find((m) => m.userId !== user?.id);

  const displayName = conversation.isGroup
    ? conversation.name
    : otherMember?.user.fullName ?? 'Conversa';

  const displayAvatar = conversation.isGroup
    ? conversation.avatarUrl
    : otherMember?.user.avatarUrl;

  const statusText = conversation.isGroup
    ? `${conversation.members.length} membros`
    : otherMember?.user.status === 'online'
      ? 'Online'
      : 'Offline';

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={displayAvatar ?? undefined} />
              <AvatarFallback>{getInitials(displayName ?? 'C')}</AvatarFallback>
            </Avatar>
            {!conversation.isGroup && otherMember?.user.status === 'online' && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            )}
          </div>
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">{statusText}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
          {conversation.isGroup && (
            <Button variant="ghost" size="icon"><Users className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user?.id}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ScrollArea>

      <MessageInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
