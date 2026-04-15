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
    <main className="min-h-screen bg-ios-background">
      <div className="sticky top-0 z-10 bg-ios-background/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white shadow-ios-card flex items-center justify-center text-ios-blue font-bold text-lg transition-all active:scale-95"
          >
            ‹
          </Link>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ios-gray">
              {subtitle}
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-black leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="card-ios overflow-hidden">
          <div className="p-6">{children}</div>
        </div>

        <p className="text-center text-xs text-ios-gray pb-8">
          Deadline Tracker · v1.0
        </p>
      </div>
    </main>
  );
}
