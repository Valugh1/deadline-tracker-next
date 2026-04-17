'use client';

import { AccountView } from '@neondatabase/auth/react';
import Link from 'next/link';

const paths: Record<string, { label: string; icon: string; description: string }> = {
  settings: {
    label: 'Profilo',
    icon: '👤',
    description: 'Modifica le tue informazioni personali',
  },
  security: {
    label: 'Sicurezza',
    icon: '🔒',
    description: 'Gestisci password e sessioni attive',
  },
};

const accountViewClassNames = {
  base: 'space-y-6',
  cards: 'space-y-4',
  drawer: {
    menuItem: 'rounded-[1.5rem] px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 transition',
  },
  sidebar: {
    base: 'space-y-3',
    button: 'rounded-[1.5rem] px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 transition',
    buttonActive: 'rounded-[1.5rem] px-4 py-3 bg-[var(--color-ios-blue)] text-white shadow-ios-card',
  },
  card: {
    base: 'rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white shadow-ios-card',
    content: 'space-y-4',
    title: 'text-base font-semibold text-slate-950',
    description: 'text-sm text-slate-500',
    input: 'ios-input',
    primaryButton: 'ios-btn w-full',
    secondaryButton: 'ios-btn-secondary w-full',
    button: 'ios-btn-secondary w-full',
    checkbox: 'rounded-md border border-[rgba(60,60,67,0.12)] text-[var(--color-ios-blue)] focus:ring-[var(--color-ios-blue)]',
  },
};

export default function AccountPage({ params }: { params: { path: string } }) {
  const path = params.path;
  const current = paths[path] ?? paths.settings;

  return (
    <main className="min-h-screen bg-ios-background px-4 py-8 sm:px-6 sm:py-10 text-slate-950">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-5 shadow-ios-card">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(60,60,67,0.12)] bg-slate-50 text-slate-950 transition hover:bg-slate-100">
              ‹
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Account</p>
              <h1 className="text-2xl font-semibold text-slate-950">{current.label}</h1>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-4 shadow-ios-card">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(paths).map(([key, value]) => (
              <Link
                key={key}
                href={`/account/${key}`}
                className={`rounded-[1.75rem] border p-4 text-sm font-semibold transition ${path === key ? 'border-[var(--color-ios-blue)] bg-[var(--color-ios-blue-soft)] text-slate-950 shadow-[0_16px_40px_-24px_rgba(0,122,255,0.45)]' : 'border-[rgba(60,60,67,0.12)] bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-slate-100 p-3 text-xl">{value.icon}</span>
                  <div className="text-left">
                    <p>{value.label}</p>
                    <p className="text-xs text-slate-500">{value.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-5 shadow-ios-card">
          <AccountView path={path} classNames={accountViewClassNames} />
        </div>
      </div>
    </main>
  );
}
