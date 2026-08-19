'use client';

import { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type MessageInputProps = {
  onSend: (content: string) => void;
  replyTo?: { id: string; senderName: string; content: string } | null;
  onCancelReply?: () => void;
  disabled?: boolean;
};

export function MessageInput({ onSend, replyTo, onCancelReply, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="border-t bg-card p-4">
      {replyTo && (
        <div className="mb-2 flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
          <div className="flex-1 truncate">
            <span className="font-medium">{replyTo.senderName}</span>
            <span className="ml-2 text-muted-foreground">{replyTo.content}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCancelReply}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button type="button" variant="ghost" size="icon" className="shrink-0" disabled={disabled}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
          disabled={disabled}
        />
        <Button type="submit" size="icon" className="shrink-0" disabled={!message.trim() || disabled}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
