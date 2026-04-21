import { sendDeadlinePushNotification } from './push-server';

export interface DeadlineNotification {
  id: number;
  title: string;
  date: string;
  daysBefore: number;
  type: 'long-term' | 'daily';
  notes: string;
  notificationTime?: string;
}

const SUMMARY_NOTIFICATION_ID = 9999;
const DAILY_BASE_ID = 20000;
const LONG_TERM_BASE_ID = 30000;

const timers: { [id: number]: NodeJS.Timeout } = {};

function parseTime(time = '09:00') {
  const [hours, minutes] = time.split(':').map((part) => Number(part));
  return {
    hours: Number.isNaN(hours) ? 9 : hours,
    minutes: Number.isNaN(minutes) ? 0 : minutes,
  };
}

function getDaysLeft(dateString: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getNextNotificationTime(hours: number, minutes: number) {
  const next = new Date();
  next.setHours(hours, minutes, 0, 0);

  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

function getLongTermNotificationDate(deadline: DeadlineNotification) {
  const { hours, minutes } = parseTime(deadline.notificationTime ?? '09:00');
  const dueDate = new Date(deadline.date);
  const notificationDate = new Date(dueDate);
  notificationDate.setDate(notificationDate.getDate() - (deadline.daysBefore ?? 1));
  notificationDate.setHours(hours, minutes, 0, 0);
  return notificationDate;
}

function buildSummaryBody(deadlines: DeadlineNotification[]) {
  const upcoming = deadlines
    .map((deadline) => ({
      ...deadline,
      daysLeft: getDaysLeft(deadline.date),
    }))
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  if (upcoming.length === 0) {
    return 'Nessuna scadenza imminente. Buona giornata!';
  }

  return upcoming
    .map((deadline) => {
      const label = deadline.type === 'daily' ? 'Ogni giorno' : `${deadline.daysLeft} giorno${deadline.daysLeft === 1 ? '' : 'i'} rimasto${deadline.daysLeft === 1 ? '' : 'i'}`;
      return `${deadline.title}: ${label}`;
    })
    .join('\n');
}

async function ensurePermission() {
  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  return Notification.permission === 'granted';
}

export async function scheduleDeadlineNotifications(deadlines: DeadlineNotification[]) {
  if (typeof window === 'undefined') return;

  const granted = await ensurePermission();
  if (!granted) return;

  // Clear existing timers
  Object.values(timers).forEach(clearTimeout);
  Object.values(timers).forEach(clearInterval);
  Object.keys(timers).forEach(key => delete timers[Number(key)]);

  // Summary notification: schedule for next 9:00, then repeat daily
  const nextSummary = getNextNotificationTime(9, 0);
  const summaryDelay = nextSummary.getTime() - Date.now();
  timers[SUMMARY_NOTIFICATION_ID] = setTimeout(() => {
    new Notification('Scadenze in arrivo', { body: buildSummaryBody(deadlines) });
    // Set interval for daily repeats
    timers[SUMMARY_NOTIFICATION_ID] = setInterval(() => {
      new Notification('Scadenze in arrivo', { body: buildSummaryBody(deadlines) });
    }, 24 * 60 * 60 * 1000); // 24 hours
  }, summaryDelay);

  for (const deadline of deadlines) {
    if (deadline.type === 'daily') {
      const { hours, minutes } = parseTime(deadline.notificationTime ?? '09:00');
      const nextDaily = getNextNotificationTime(hours, minutes);
      const dailyDelay = nextDaily.getTime() - Date.now();
      timers[DAILY_BASE_ID + deadline.id] = setTimeout(() => {
        new Notification('Promemoria giornaliero', { body: `${deadline.title} — è il momento del tuo promemoria giornaliero.` });
        // Set interval for daily repeats
        timers[DAILY_BASE_ID + deadline.id] = setInterval(() => {
          new Notification('Promemoria giornaliero', { body: `${deadline.title} — è il momento del tuo promemoria giornaliero.` });
        }, 24 * 60 * 60 * 1000);
      }, dailyDelay);
      continue;
    }

    // Long-term notifications
    const notificationDate = getLongTermNotificationDate(deadline);
    const daysLeft = getDaysLeft(deadline.date);

    if (notificationDate.getTime() <= Date.now()) {
      if (daysLeft >= 0) {
        // Show immediately if due or upcoming
        const label = daysLeft === 0 ? 'Scade oggi' : `Mancano ${daysLeft} giorno${daysLeft === 1 ? '' : 'i'}`;
        new Notification('Promemoria scadenza', { body: `${deadline.title} — ${label}.` });
      }
    } else {
      // Schedule for future
      const delay = notificationDate.getTime() - Date.now();
      timers[LONG_TERM_BASE_ID + deadline.id] = setTimeout(() => {
        const currentDaysLeft = getDaysLeft(deadline.date);
        const label = currentDaysLeft === 0 ? 'Scade oggi' : `Mancano ${currentDaysLeft} giorno${currentDaysLeft === 1 ? '' : 'i'}`;
        new Notification('Promemoria scadenza', { body: `${deadline.title} — ${label}.` });
      }, delay);
    }
  }
}
