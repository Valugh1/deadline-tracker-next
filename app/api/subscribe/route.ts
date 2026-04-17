import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // For PWA, we don't require authentication for subscription
    // In production, you should verify the user session
    const userId = 'pwa-user'; // Default for PWA users

    // Check if table exists, create if not
    try {
      await sql`CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        auth VARCHAR(255) NOT NULL,
        p256dh VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    } catch (e) {
      // Table might already exist
    }

    // Store or update subscription
    const { auth = '', p256dh = '' } = subscription.keys || {};

    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, auth, p256dh)
      VALUES (${userId}, ${subscription.endpoint}, ${auth}, ${p256dh})
      ON CONFLICT (endpoint) DO UPDATE SET
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
