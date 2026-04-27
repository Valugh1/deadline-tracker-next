import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add user_id column to push_subscriptions table if it doesn't exist
    await sql`
      ALTER TABLE push_subscriptions
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)
    `;

    // Create index on user_id for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
      ON push_subscriptions(user_id)
    `;

    return NextResponse.json({
      message: "push_subscriptions table updated successfully",
      changes: "Added user_id column and index"
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}