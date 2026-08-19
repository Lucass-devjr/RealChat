'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/use-user';
import { getInitials } from '@/utils/format';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const userName = user?.user_metadata?.full_name as string | undefined;
  const userEmail = user?.email;

  return (
    <div className="flex-1 space-y-6 overflow-auto p-6">
      <h1 className="text-2xl font-bold">Configuracoes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informacoes de perfil</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url as string | undefined} />
            <AvatarFallback className="text-lg">{getInitials(userName ?? 'U')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{userName ?? 'Usuario'}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aparencia</CardTitle>
          <CardDescription>Escolha o tema da interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setTheme('light')}
            >
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setTheme('dark')}
            >
              <Moon className="mr-2 h-4 w-4" />
              Escuro
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setTheme('system')}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Sistema
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>RealChat v0.1.0</p>
          <Separator />
          <p>Plataforma de mensagens em tempo real construida com Next.js, Supabase e Prisma.</p>
        </CardContent>
      </Card>
    </div>
  );
}
