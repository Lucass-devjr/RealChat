'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, Users, Settings, LogOut, Plus, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/lib/supabase/client';
import { fetchApi } from '@/utils/api';
import { formatMessageTime, getInitials, truncate } from '@/utils/format';
import { useDebounce } from '@/hooks/use-debounce';
import type { ConversationListItem } from '@/types';

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchApi<ConversationListItem[]>('/api/conversations').then((res) => {
      if (res.data) setConversations(res.data);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    if (!name) return;

    const res = await fetchApi<ConversationListItem>('/api/conversations/group', {
      method: 'POST',
      body: JSON.stringify({ name, memberIds: [] }),
    });

    if (res.data) {
      setConversations((prev) => [res.data!, ...prev]);
      setGroupOpen(false);
      toast.success('Grupo criado');
      router.push(`/chat/${res.data.id}`);
    } else {
      toast.error(res.error);
    }
  }

  const filtered = conversations.filter((c) => {
    if (!debouncedSearch) return true;
    const name = c.name ?? c.otherUser?.fullName ?? '';
    return name.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  const activeConvId = pathname.startsWith('/chat/') ? pathname.split('/chat/')[1] : null;

  return (
    <div className="flex h-full w-80 flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold">RealChat</h1>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Dialog open={groupOpen} onOpenChange={setGroupOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo grupo</DialogTitle>
                <DialogDescription>Crie um grupo de conversa</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do grupo</Label>
                  <Input id="name" name="name" placeholder="Ex: Equipe de trabalho" required />
                </div>
                <Button type="submit" className="w-full">Criar grupo</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search ? 'Nenhuma conversa encontrada' : 'Sem conversas ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filtered.map((conv) => {
              const displayName = conv.name ?? conv.otherUser?.fullName ?? 'Conversa';
              const isActive = activeConvId === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => router.push(`/chat/${conv.id}`)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent',
                    isActive && 'bg-accent',
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.avatarUrl ?? undefined} />
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    {!conv.isGroup && conv.otherUser?.status === 'online' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium">{displayName}</p>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.lastMessage
                          ? truncate(conv.lastMessage.content, 35)
                          : 'Sem mensagens'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="ml-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <Separator />

      <div className="flex items-center gap-2 p-3">
        <Button
          variant={pathname === '/contacts' ? 'secondary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => router.push('/contacts')}
        >
          <Users className="mr-1 h-4 w-4" />
          Contatos
        </Button>
        <Button
          variant={pathname === '/settings' ? 'secondary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => router.push('/settings')}
        >
          <Settings className="mr-1 h-4 w-4" />
          Config
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
