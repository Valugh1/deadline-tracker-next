'use client';

import { AccountView } from '@neondatabase/auth/react';
import { use } from 'react';
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
    description: 'Password e sessioni attive',
  },
};

const accountViewClassNames = {
  base: 'space-y-6',
  cards: 'space-y-4',
  drawer: {
    menuItem: 'rounded-3xl px-4 py-3 text-sm text-ios-gray hover:bg-ios-background transition',
  },
  sidebar: {
    base: 'space-y-3',
    button: 'rounded-3xl px-4 py-3 text-sm text-ios-gray hover:bg-ios-background transition',
    buttonActive: 'rounded-3xl px-4 py-3 bg-ios-blue text-white shadow-ios-card',
  },
  card: {
    base: 'rounded-3xl border border-black/5 bg-white shadow-ios-card',
    content: 'space-y-4',
    title: 'text-base font-bold',
    description: 'text-sm text-ios-gray',
    input: 'input-ios',
    primaryButton: 'btn-ios w-full',
    secondaryButton: 'btn-ios-secondary w-full',
    button: 'btn-ios-secondary w-full',
    checkbox: 'rounded-md border border-black/10 text-ios-blue focus:ring-ios-blue/30',
  },
};

export default function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = use(params);
  const current = paths[path];

  return (
    <main className="min-h-screen bg-ios-background">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-ios-background/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white shadow-ios-card flex items-center justify-center text-ios-blue font-bold text-lg transition-all active:scale-90"
          >
            ‹
          </Link>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ios-gray">
              Account
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-black leading-tight">
              {current?.label ?? 'Impostazioni'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* NAV TABS */}
        <div className="bg-white rounded-3xl shadow-ios-card p-2 flex gap-2">
          {Object.entries(paths).map(([key, val]) => (
            <Link
              key={key}
              href={`/account/${key}`}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold text-center transition-all active:scale-95 ${
                path === key
                  ? 'bg-ios-blue text-white shadow-ios-card'
                  : 'text-ios-gray hover:bg-ios-background'
              }`}
            >
              {val.icon} {val.label}
            </Link>
          ))}
        </div>

        {/* DESCRIPTION CARD */}
        {current && (
          <div className="bg-white rounded-3xl shadow-ios-card px-6 py-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ios-background flex items-center justify-center text-2xl">
              {current.icon}
            </div>
            <div>
              <p className="font-bold text-black">{current.label}</p>
              <p className="text-sm text-ios-gray">{current.description}</p>
            </div>
          </div>
        )}

        {/* ACCOUNT VIEW */}
        <div className="bg-white rounded-3xl shadow-ios-card overflow-hidden">
          <div className="p-6">
            <AccountView path={path} classNames={accountViewClassNames} />
          </div>
        </div>

        {/* SIGN OUT LINK */}
        <div className="bg-white rounded-3xl shadow-ios-card overflow-hidden">
          <Link
            href="/auth/sign-out"
            className="flex items-center justify-between px-6 py-5 text-ios-red font-bold active:bg-ios-background transition-all"
          >
            <span>Esci dall'account</span>
            <span className="text-ios-gray">›</span>
          </Link>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-ios-gray pb-8">
          Deadline Tracker · v1.0
        </p>
      </div>
    </main>
  );
}