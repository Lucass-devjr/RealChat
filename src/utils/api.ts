import type { ApiResponse } from '@/types';

export async function fetchApi<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || 'Erro desconhecido' };
    }

    return { data: json.data ?? json };
  } catch {
    return { error: 'Erro de conexao' };
  }
}
