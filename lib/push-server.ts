/**
 * Server-side utility for sending deadline push notifications
 */

export interface DeadlineNotificationPayload {
  title: string;
  body: string;
  tag?: string;
}

export async function sendDeadlinePushNotification(
  payload: DeadlineNotificationPayload
): Promise<{ success: boolean; sent: number }> {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      sent: data.sent || 0,
    };
  } catch (error) {
    console.error('Error sending deadline push notification:', error);
    return {
      success: false,
      sent: 0,
    };
  }
}

export function buildDeadlineNotificationBody(deadlines: Array<{
  title: string;
  date: string;
  daysLeft?: number;
}>): string {
  if (deadlines.length === 0) {
    return 'No upcoming deadlines. Buona giornata!';
  }

  if (deadlines.length === 1) {
    const deadline = deadlines[0];
    return `${deadline.title} — ${deadline.daysLeft === 0 ? 'Due today' : `${deadline.daysLeft} days left`}`;
  }

  return deadlines
    .slice(0, 3)
    .map((d) => `${d.title} (${d.daysLeft} days)`)
    .join(', ');
}
