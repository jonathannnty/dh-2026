import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AuthUser {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = useMutation({
    mutationFn: async () => {
      await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    },
    onSuccess: () => {
      qc.setQueryData(['auth', 'me'], null);
      window.location.href = '/login';
    },
  });

  return { user: user ?? null, isLoading, logout: logout.mutate };
}
