// app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // wait until we know the auth state

    if (status === 'authenticated') {
      router.replace('/main/home');
    } else if (status === 'unauthenticated') {
      router.replace('/auth/log-in');
    }
  }, [status, router]);

  return null; // no UI, just redirect
}
