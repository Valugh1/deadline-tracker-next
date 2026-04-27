import { env } from 'process';

interface QStashSchedule {
  scheduleId: string;
  destination: string;
  cron: string;
  body?: string;
  method: string;
  headers?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

interface CreateScheduleRequest {
  destination: string;
  cron: string;
  body?: string;
  method?: string;
  headers?: Record<string, string>;
}

/**
 * Get QStash API headers with authentication
 */
function getQStashHeaders(): Record<string, string> {
  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    throw new Error('QSTASH_TOKEN environment variable is required');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Get QStash base URL
 */
function getQStashUrl(): string {
  const url = process.env.QSTASH_URL;
  if (!url) {
    throw new Error('QSTASH_URL environment variable is required');
  }
  return url;
}

/**
 * Schedule a recurring notification job for a user at a specific time
 * @param userId - The user ID
 * @param notificationTime - Time in HH:MM format (Europe/Rome timezone)
 */
export async function scheduleNotificationJob(userId: string, notificationTime: string): Promise<string> {
  const [hours, minutes] = notificationTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid notification time format: ${notificationTime}. Expected HH:MM`);
  }

  // Convert Europe/Rome time to UTC for QStash cron
  // QStash uses UTC, so we need to adjust for timezone offset
  const romeOffset = 2; // CEST (Central European Summer Time) - assuming summer time for now
  const utcHours = (hours - romeOffset + 24) % 24;

  const cron = `0 ${minutes} ${utcHours} * * *`; // Every day at specified UTC time

  const destination = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron-notifications`;
console.log(`[QStash] Target destination URL: ${destination}`);
  const body: CreateScheduleRequest = {
    destination,
    cron,
    method: 'POST',
    body: JSON.stringify({
      userId,
      notificationTime,
      type: 'daily-notification'
    }),
    headers: {
      'Content-Type': 'application/json',
      // QStash will add signature headers automatically
    }
  };

  const response = await fetch(`${getQStashUrl()}/v2/schedules`, {
    method: 'POST',
    headers: getQStashHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to schedule QStash job: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log(`[QStash] Scheduled job for user ${userId} at ${notificationTime} (UTC ${utcHours}:${minutes}): ${result.scheduleId}`);

  return result.scheduleId;
}

/**
 * Cancel a scheduled notification job
 * @param userId - The user ID
 * @param notificationTime - Time in HH:MM format
 */
export async function cancelNotificationJob(userId: string, notificationTime: string): Promise<void> {
  // First, find the job by userId and notificationTime
  const jobs = await getAllScheduledJobs();
  const jobToCancel = jobs.find(job => {
    try {
      const body = JSON.parse(job.body || '{}');
      return body.userId === userId && body.notificationTime === notificationTime && body.type === 'daily-notification';
    } catch {
      return false;
    }
  });

  if (!jobToCancel) {
    console.log(`[QStash] No job found to cancel for user ${userId} at ${notificationTime}`);
    return;
  }

  const response = await fetch(`${getQStashUrl()}/v2/schedules/${jobToCancel.scheduleId}`, {
    method: 'DELETE',
    headers: getQStashHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to cancel QStash job: ${response.status} ${errorText}`);
  }

  console.log(`[QStash] Canceled job ${jobToCancel.scheduleId} for user ${userId} at ${notificationTime}`);
}

/**
 * Get all scheduled jobs from QStash
 */
export async function getAllScheduledJobs(): Promise<QStashSchedule[]> {
  const response = await fetch(`${getQStashUrl()}/v2/schedules`, {
    method: 'GET',
    headers: getQStashHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch QStash jobs: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.schedules || [];
}

/**
 * Validate QStash webhook signature
 * @param body - Raw request body
 * @param signature - X-Qstash-Signature header
 * @param url - The URL that was called
 */
export async function validateQStashSignature(
  body: string,
  signature: string,
  url: string
): Promise<boolean> {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    throw new Error('QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY are required');
  }

  // QStash signature validation logic
  // This is a simplified version - in production you'd use the @upstash/qstash SDK
  const crypto = await import('crypto');

  const verifyWithKey = (key: string) => {
    const expectedSignature = crypto
      .createHmac('sha256', key)
      .update(`${url}${body}`)
      .digest('hex');
    return `v1=${expectedSignature}` === signature;
  };

  return verifyWithKey(currentKey) || verifyWithKey(nextKey);
}