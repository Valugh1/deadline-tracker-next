import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { auth } from '@/lib/auth/server';

// Helper to get current user or return 401
async function getCurrentUserId() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? null;
  if (!userId) return null;
  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Get authenticated user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Store or update subscription
    const { auth: authKey = '', p256dh = '' } = subscription.keys || {};

    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, auth, p256dh)
      VALUES (${userId}, ${subscription.endpoint}, ${authKey}, ${p256dh})
      ON CONFLICT (endpoint) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        auth = EXCLUDED.auth,
        p256dh = EXCLUDED.p256dh,
        updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json(
      { success: true, message: 'Subscription saved' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
