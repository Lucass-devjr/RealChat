'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, MessageSquare, Trash2, Users, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { fetchApi } from '@/utils/api';
import { getInitials } from '@/utils/format';
import type { ContactWithUser } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApi<ContactWithUser[]>('/api/contacts').then((res) => {
      if (res.data) setContacts(res.data);
      setLoading(false);
    });
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const res = await fetchApi<ContactWithUser>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (res.data) {
      setContacts((prev) => [...prev, res.data!]);
      setAddOpen(false);
      toast.success('Contato adicionado');
    } else {
      toast.error(res.error);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetchApi(`/api/contacts/${id}`, { method: 'DELETE' });
    if (!res.error) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success('Contato removido');
    } else {
      toast.error(res.error);
    }
  }

  async function handleStartChat(contactUserId: string) {
    const res = await fetchApi<{ id: string }>('/api/conversations/direct', {
      method: 'POST',
      body: JSON.stringify({ userId: contactUserId }),
    });

    if (res.data) {
      router.push(`/chat/${res.data.id}`);
    } else {
      toast.error(res.error);
    }
  }

  const filtered = contacts.filter((c) =>
    c.contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar contato</DialogTitle>
              <DialogDescription>Adicione um contato pelo email</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email do contato</Label>
                <Input id="email" name="email" type="email" placeholder="contato@email.com" required />
              </div>
              <Button type="submit" className="w-full">Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar contatos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">
              {searchQuery ? 'Nenhum contato encontrado' : 'Nenhum contato'}
            </p>
            <p className="text-sm text-muted-foreground">Adicione contatos para comecar a conversar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.contact.avatarUrl ?? undefined} />
                      <AvatarFallback>{getInitials(contact.contact.fullName)}</AvatarFallback>
                    </Avatar>
                    {contact.contact.status === 'online' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{contact.contact.fullName}</p>
                    <p className="text-xs text-muted-foreground">{contact.contact.email}</p>
                  </div>
                  <Badge variant={contact.contact.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                    {contact.contact.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartChat(contact.contact.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
