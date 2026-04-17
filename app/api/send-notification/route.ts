import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import webpush from 'web-push';

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { title, body, tag = 'deadline-notification' } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Fetch all subscriptions
    const result = await sql`SELECT * FROM push_subscriptions`;
    const subscriptions = result.rows;

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { success: true, sent: 0, message: 'No subscribers found' },
        { status: 200 }
      );
    }

    const notificationPayload = {
      title,
      body,
      tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((sub: any) => {
        const subscription = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        };

        return webpush
          .sendNotification(subscription, JSON.stringify(notificationPayload))
          .catch(async (error) => {
            // If subscription is no longer valid, remove it
            if (error.statusCode === 410 || error.statusCode === 404) {
              await sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`;
            }
            throw error;
          });
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json(
      {
        success: true,
        sent: successful,
        failed,
        message: `Sent to ${successful} subscribers`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
