'use client';

import { useEffect, useState } from 'react';
import {
  subscribeToPushNotifications,
  isPushNotificationSupported,
  isPushNotificationSubscribed,
} from '@/lib/push-client';

export default function PushNotificationSubscriber() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        // Check if push notifications are supported
        const supported = await isPushNotificationSupported();
        setIsSupported(supported);

        if (supported) {
          // Check if already subscribed
          const subscribed = await isPushNotificationSubscribed();
          setIsSubscribed(subscribed);

          // If not subscribed, try to subscribe
          if (!subscribed) {
            const success = await subscribeToPushNotifications();
            setIsSubscribed(success);
          }
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePushNotifications();
  }, []);

  // This component doesn't render anything visible
  // It just handles push notification subscription in the background
  return null;
}
