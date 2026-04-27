import { sql } from '@vercel/postgres';
import { scheduleNotificationJob, cancelNotificationJob, getAllScheduledJobs } from './qstash';

/**
 * Sync QStash scheduled jobs for a user based on their current daily deadlines
 * This ensures each unique notification_time has exactly one QStash job
 * @param userId - The user ID to sync jobs for
 */
export async function syncQStashJobsForUser(userId: string): Promise<void> {
  try {
    console.log(`[Job Sync] Starting sync for user ${userId}`);

    // Get all unique notification times for this user's daily deadlines
    const { rows: dailyDeadlines } = await sql`
      SELECT DISTINCT notification_time
      FROM deadlines
      WHERE user_id = ${userId}
        AND type = 'daily'
        AND notification_time IS NOT NULL
        AND notification_time != ''
      ORDER BY notification_time ASC
    `;

    const currentTimes = dailyDeadlines.map(row => row.notification_time as string);
    console.log(`[Job Sync] User ${userId} has daily deadlines at times: ${currentTimes.join(', ')}`);

    // Get all existing QStash jobs for this user
    const allJobs = await getAllScheduledJobs();
    const userJobs = allJobs.filter(job => {
      try {
        const body = JSON.parse(job.body || '{}');
        return body.userId === userId && body.type === 'daily-notification';
      } catch {
        return false;
      }
    });

    const existingTimes = userJobs.map(job => {
      try {
        const body = JSON.parse(job.body || '{}');
        return body.notificationTime;
      } catch {
        return null;
      }
    }).filter(Boolean) as string[];

    console.log(`[Job Sync] User ${userId} has existing QStash jobs at times: ${existingTimes.join(', ')}`);

    // Find times that need new jobs (in current but not existing)
    const timesToSchedule = currentTimes.filter(time => !existingTimes.includes(time));

    // Find times that need job cancellation (in existing but not current)
    const timesToCancel = existingTimes.filter(time => !currentTimes.includes(time));

    // Schedule new jobs
    for (const time of timesToSchedule) {
      try {
        await scheduleNotificationJob(userId, time);
        console.log(`[Job Sync] Scheduled new job for user ${userId} at ${time}`);
      } catch (error) {
        console.error(`[Job Sync] Failed to schedule job for user ${userId} at ${time}:`, error);
      }
    }

    // Cancel obsolete jobs
    for (const time of timesToCancel) {
      try {
        await cancelNotificationJob(userId, time);
        console.log(`[Job Sync] Canceled job for user ${userId} at ${time}`);
      } catch (error) {
        console.error(`[Job Sync] Failed to cancel job for user ${userId} at ${time}:`, error);
      }
    }

    console.log(`[Job Sync] Completed sync for user ${userId}: +${timesToSchedule.length} scheduled, -${timesToCancel.length} canceled`);

  } catch (error) {
    console.error(`[Job Sync] Error syncing jobs for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Sync QStash jobs for all users (admin function for maintenance)
 * This is expensive and should be used sparingly
 */
export async function syncQStashJobsForAllUsers(): Promise<void> {
  try {
    console.log(`[Job Sync] Starting sync for all users`);

    // Get all unique user_ids that have daily deadlines
    const { rows: users } = await sql`
      SELECT DISTINCT user_id
      FROM deadlines
      WHERE type = 'daily'
        AND notification_time IS NOT NULL
        AND notification_time != ''
    `;

    console.log(`[Job Sync] Found ${users.length} users with daily deadlines`);

    for (const { user_id } of users) {
      await syncQStashJobsForUser(user_id as string);
    }

    console.log(`[Job Sync] Completed sync for all users`);

  } catch (error) {
    console.error(`[Job Sync] Error syncing jobs for all users:`, error);
    throw error;
  }
}