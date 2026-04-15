'use client';

import type { ReactNode } from 'react';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import UserAvatarButton from '@/components/UserAvatarButton';

export default function NeonAuthProvider({ children }: { children: ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient} emailOTP>
      <header className="flex justify-end px-6 py-4 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <UserAvatarButton />
      </header>
      {children}
    </NeonAuthUIProvider>
  );
}
