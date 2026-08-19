import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatMessageTime(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return format(d, 'HH:mm');
  if (isYesterday(d)) return 'Ontem';
  return format(d, 'dd/MM/yyyy');
}

export function formatFullTime(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy 'as' HH:mm");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
