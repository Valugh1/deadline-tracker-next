import { NextRequest, NextResponse } from 'next/server';
import { syncQStashJobsForAllUsers } from '@/lib/notification-job-sync';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check for admin access
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('[Admin] Starting full QStash job sync for all users');

    await syncQStashJobsForAllUsers();

    return NextResponse.json(
      { success: true, message: 'QStash jobs synced for all users' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Admin] Error syncing QStash jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}