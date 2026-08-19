'use client';

import { useState } from 'react';
import { MoreVertical, Reply, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatFullTime, getInitials } from '@/utils/format';
import type { MessageWithSender } from '@/types';

type MessageBubbleProps = {
  message: MessageWithSender;
  isOwn: boolean;
  onReply: (message: MessageWithSender) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
};

export function MessageBubble({ message, isOwn, onReply, onEdit, onDelete }: MessageBubbleProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  function handleSaveEdit() {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setEditing(false);
  }

  return (
    <div className={cn('group flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xs">{getInitials(message.sender.fullName)}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn('max-w-[70%] space-y-1', isOwn ? 'items-end' : 'items-start')}>
        {!isOwn && (
          <p className="text-xs font-medium text-muted-foreground">{message.sender.fullName}</p>
        )}

        {message.replyTo && (
          <div className="rounded-md bg-muted/50 px-3 py-1 text-xs">
            <span className="font-medium">{message.replyTo.sender.fullName}</span>
            <p className="truncate text-muted-foreground">{message.replyTo.content}</p>
          </div>
        )}

        <div className="flex items-end gap-1">
          <div
            className={cn(
              'rounded-2xl px-4 py-2',
              isOwn
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground',
            )}
          >
            {editing ? (
              <div className="space-y-1">
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
                <div className="flex gap-1 text-xs">
                  <button onClick={handleSaveEdit} className="hover:underline">Salvar</button>
                  <span>|</span>
                  <button onClick={() => setEditing(false)} className="hover:underline">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] opacity-70">
                  <span>{formatFullTime(message.createdAt)}</span>
                  {message.editedAt && <span>(editado)</span>}
                </div>
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
              <DropdownMenuItem onClick={() => onReply(message)}>
                <Reply className="mr-2 h-4 w-4" />
                Responder
              </DropdownMenuItem>
              {isOwn && (
                <>
                  <DropdownMenuItem onClick={() => { setEditing(true); setEditContent(message.content); }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
