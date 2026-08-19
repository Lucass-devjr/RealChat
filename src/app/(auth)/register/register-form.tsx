'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { registerAction } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>Cadastre-se para comecar a usar o RealChat</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input id="fullName" name="fullName" placeholder="Seu nome" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="••••••" required />
          </div>
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Ja tem conta?{' '}
          <Link href="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
