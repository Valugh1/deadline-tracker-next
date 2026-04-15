'use client';

import { UserButton } from '@neondatabase/auth/react';

export default function UserAvatarButton() {
  return (
    <UserButton
      size="icon"
      classNames={{
        base: 'rounded-full border border-black/5 bg-white shadow-ios-card text-black transition-all hover:shadow-lg',
        trigger: {
          base: 'rounded-full overflow-hidden',
          avatar: {
            base: 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-ios-background text-sm font-bold text-ios-blue',
            fallback: 'inline-flex h-full w-full items-center justify-center rounded-full bg-ios-background text-sm font-bold text-ios-blue',
            image: 'h-full w-full object-cover',
          },
        },
        content: {
          base: 'rounded-3xl bg-white border border-black/5 shadow-ios-card p-2 z-50',
          menuItem: 'rounded-2xl px-4 py-3 text-sm text-black hover:bg-ios-background transition',
          separator: 'my-2 border-t border-black/5',
        },
      }}
    />
  );
}
