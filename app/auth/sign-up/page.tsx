'use client';

import { AuthView } from '@neondatabase/auth/react';
import AuthPageShell from '@/components/AuthPageShell';

const authViewClassNames = {
  base: 'space-y-6',
  header: 'text-center',
  title: 'text-2xl font-extrabold tracking-tight text-black',
  description: 'text-sm text-ios-gray',
  content: 'space-y-5',
  footer: 'text-center text-xs text-ios-gray',
  footerLink: 'text-ios-blue font-semibold',
  separator: 'text-ios-gray',
  continueWith: 'pt-2',
  form: {
    base: 'space-y-5',
    label: 'text-xs font-semibold uppercase tracking-[0.18em] text-ios-gray',
    input: 'input-ios',
    button: 'btn-ios w-full',
    primaryButton: 'btn-ios w-full',
    outlineButton: 'btn-ios-secondary w-full',
    secondaryButton: 'btn-ios-secondary w-full',
    providerButton: 'btn-ios-secondary w-full text-sm',
    forgotPasswordLink: 'text-xs text-ios-blue font-semibold',
    error: 'rounded-3xl border border-ios-red/10 bg-[#fff1f0] px-4 py-3 text-sm text-ios-red',
  },
};

export default function SignUpPage() {
  return (
    <AuthPageShell title="Registrati" subtitle="Registrazione">
      <AuthView path="sign-up" classNames={authViewClassNames} />
    </AuthPageShell>
  );
}
