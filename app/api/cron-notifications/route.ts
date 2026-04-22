import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendAllNotifications } from '@/lib/notifications';

/**
 * Cron endpoint for checking and sending deadline notifications
 * Called every minute by Vercel Cron
 */
export async function GET(request: NextRequest) {
    console.log("--- CRON TRIGGERED ---");
  try {
    // Verify the request is from Vercel Cron (optional in development)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    console.log("Auth Header:", authHeader ? "Presente" : "Mancante");
    console.log("Secret configurato:", cronSecret ? "Sì" : "No");
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check and send notifications
    await checkAndSendAllNotifications();

    return NextResponse.json(
      { success: true, message: 'Notification check completed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Cron Notifications] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
