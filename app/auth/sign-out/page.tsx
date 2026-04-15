import { AuthView } from '@neondatabase/auth/react';

export default function SignOutPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <AuthView path="sign-out" />
    </main>
  );
}