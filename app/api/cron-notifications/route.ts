import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendLongTermNotifications, checkAndSendDailyNotifications } from '@/lib/notifications';
import { validateQStashSignature } from '@/lib/qstash';

/**
 * Cron endpoint for checking and sending deadline notifications
 * - GET: Called by Vercel Cron for long-term notifications
 * - POST: Called by QStash for daily notifications at scheduled times
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional in development)

    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check and send long-term notifications (9:00 AM daily)
    await checkAndSendLongTermNotifications();

    return NextResponse.json(
      { success: true, message: 'Long-term notification check completed' },
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

/**
 * Handle QStash scheduled messages for daily notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature validation
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Validate QStash signature
    const signature = request.headers.get('x-qstash-signature');
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron-notifications`;

    if (!signature || !(await validateQStashSignature(rawBody, signature, url))) {
      console.error('[QStash] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Extract parameters from QStash message body
    const { userId, notificationTime, type } = body;

    if (!userId || !notificationTime || type !== 'daily-notification') {
      console.error('[QStash] Invalid message body:', body);
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    console.log(`[QStash] Processing daily notifications for user ${userId} at ${notificationTime}`);

    // Send daily notifications for this user at this time
    await checkAndSendDailyNotifications(userId, notificationTime);

    return NextResponse.json(
      { success: true, message: `Daily notifications sent for user ${userId} at ${notificationTime}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('[QStash] Error processing scheduled message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
