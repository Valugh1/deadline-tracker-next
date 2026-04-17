'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-ios-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center gap-3 rounded-[2rem] bg-white p-4 shadow-ios-card">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(60,60,67,0.12)] bg-slate-50 text-slate-950 transition hover:bg-slate-100">
            ‹
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{subtitle}</p>
            <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
          </div>
        </div>

        <div className="ios-card p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600">Accesso sicuro per gestire scadenze e promemoria dalla tua dashboard iOS.</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
