import { sql } from '@vercel/postgres';
import { sendDeadlinePushNotification } from './push-server';

export interface Deadline {
  id: number;
  user_id: string;
  title: string;
  date: string;
  days_before: number;
  type: 'daily' | 'long-term';
  notes: string;
  notification_time: string;
}

/**
 * Get the current time in HH:MM format (UTC)
 */
function getCurrentTimeFormatted(): string {
  const now = new Date();
  
  // Formatta l'ora attuale usando il fuso orario italiano
  const italianTime = now.toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // italianTime restituirà qualcosa come "09:00" o "15:30"
  return italianTime;
}

/**
 * Get the current date in YYYY-MM-DD format (UTC)
 */
function getCurrentDateFormatted(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate days left until a deadline
 */
function getDaysLeft(dateString: string): number {
  const today = new Date(getCurrentDateFormatted());
  const deadline = new Date(dateString);
  const timeDiff = deadline.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date should be included in the long-term recap based on days_before
 */
function shouldNotifyLongTerm(deadline: Deadline): boolean {
  const daysLeft = getDaysLeft(deadline.date);
  const daysToNotify = deadline.days_before;
  
  // Notify from days_before until the day of the deadline
  return daysLeft >= 0 && daysLeft <= daysToNotify;
}

/**
 * Format long-term deadline for display in recap
 */
function formatLongTermDeadline(deadline: Deadline): string {
  const daysLeft = getDaysLeft(deadline.date);
  if (daysLeft === 0) {
    return `${deadline.title} — Scade oggi!`;
  }
  const dayText = daysLeft === 1 ? 'giorno' : 'giorni';
  return `${deadline.title} — Mancano ${daysLeft} ${dayText}`;
}

/**
 * Send daily notifications for deadlines that match the current time
 */
export async function checkAndSendDailyNotifications(): Promise<void> {
  try {
    const currentTime = getCurrentTimeFormatted();

    // Fetch all daily deadlines that match the current notification time
    const { rows: dailyDeadlines } = await sql<Deadline>`
      SELECT * FROM deadlines 
      WHERE type = 'daily' 
        AND notification_time = ${currentTime}
      ORDER BY title ASC
    `;
    console.log(`[Daily Notifications] Found ${dailyDeadlines.length} deadlines for time ${currentTime}`);
    if (dailyDeadlines.length === 0) {
      console.log(`[Daily Notifications] No deadlines to notify at ${currentTime}`);
      return;
    }

    // Group by user to send personalized notifications
    const deadlinesByUser = new Map<string, Deadline[]>();
    for (const deadline of dailyDeadlines) {
      if (!deadlinesByUser.has(deadline.user_id)) {
        deadlinesByUser.set(deadline.user_id, []);
      }
      deadlinesByUser.get(deadline.user_id)!.push(deadline);
    }

    // Send notifications per user
    for (const [userId, userDeadlines] of deadlinesByUser) {
      const titles = userDeadlines.map(d => d.title).join(', ');
      const body = userDeadlines.length === 1
        ? `${userDeadlines[0].title} — è il momento del tuo promemoria giornaliero.`
        : `${titles} — è il momento dei tuoi promemoria giornalieri.`;

      await sendDeadlinePushNotification({
        title: 'Promemoria giornaliero',
        body,
        tag: `daily-${currentTime}`
      });

      console.log(`[Daily Notifications] Sent to user ${userId}: ${titles}`);
    }
  } catch (error) {
    console.error('[Daily Notifications] Error:', error);
  }
}

/**
 * Send long-term notification recap for deadlines that need advance notice
 */
export async function checkAndSendLongTermNotifications(): Promise<void> {
  try {
    const currentTime = getCurrentTimeFormatted();
    const notificationTime = '09:00'; // Always send at 9:00 AM

    // Only check at 9:00 AM
    if (currentTime !== notificationTime) {
      return;
    }

    // Fetch all long-term deadlines
    const { rows: allLongTermDeadlines } = await sql<Deadline>`
      SELECT * FROM deadlines 
      WHERE type = 'long-term'
      ORDER BY date ASC
    `;

    if (allLongTermDeadlines.length === 0) {
      console.log('[Long-term Notifications] No long-term deadlines found');
      return;
    }

    // Filter deadlines that should be notified today
    const deadlinesToNotify = allLongTermDeadlines.filter(shouldNotifyLongTerm);

    if (deadlinesToNotify.length === 0) {
      console.log('[Long-term Notifications] No deadlines to notify today');
      return;
    }

    // Group by user
    const deadlinesByUser = new Map<string, Deadline[]>();
    for (const deadline of deadlinesToNotify) {
      if (!deadlinesByUser.has(deadline.user_id)) {
        deadlinesByUser.set(deadline.user_id, []);
      }
      deadlinesByUser.get(deadline.user_id)!.push(deadline);
    }

    // Send recap per user
    for (const [userId, userDeadlines] of deadlinesByUser) {
      const formattedDeadlines = userDeadlines
        .map(d => formatLongTermDeadline(d))
        .join('\n');

      await sendDeadlinePushNotification({
        title: 'Scadenze in arrivo',
        body: formattedDeadlines,
        tag: 'long-term-recap'
      });

      console.log(`[Long-term Notifications] Sent to user ${userId}`);
    }
  } catch (error) {
    console.error('[Long-term Notifications] Error:', error);
  }
}

/**
 * Main function to check and send all notifications
 * Called by the cron job
 */
export async function checkAndSendAllNotifications(): Promise<void> {
  console.log(`[Notifications] Checking at ${getCurrentTimeFormatted()} UTC`);
  
  await checkAndSendDailyNotifications();
  await checkAndSendLongTermNotifications();
  
  console.log('[Notifications] Check completed');
}
