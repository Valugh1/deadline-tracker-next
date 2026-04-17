'use client';

import { AuthView } from '@neondatabase/auth/react';
import AuthPageShell from '@/components/AuthPageShell';

const authViewClassNames = {
  base: 'space-y-6',
  header: 'text-center',
  title: 'text-2xl font-semibold text-slate-950',
  description: 'text-sm text-slate-500',
  content: 'space-y-5',
  footer: 'text-center text-xs text-slate-500',
  footerLink: 'text-ios-blue font-semibold',
  separator: 'text-slate-400',
  continueWith: 'pt-2',
  form: {
    base: 'space-y-5',
    label: 'text-xs font-semibold uppercase tracking-[0.24em] text-slate-500',
    input: 'ios-input',
    button: 'ios-btn w-full',
    primaryButton: 'ios-btn w-full',
    outlineButton: 'ios-btn-secondary w-full',
    secondaryButton: 'ios-btn-secondary w-full',
    providerButton: 'ios-btn-secondary w-full text-sm',
    forgotPasswordLink: 'text-xs text-ios-blue font-semibold',
    error: 'rounded-[1.5rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700',
  },
};

export default function SignUpPage() {
  return (
    <AuthPageShell title="Registrati" subtitle="Inizia ora">
      <AuthView path="sign-up" classNames={authViewClassNames} />
    </AuthPageShell>
  );
}
