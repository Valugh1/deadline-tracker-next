# Push Notification Testing Guide

## Overview

The app now supports background push notifications using Web Push Standard (VAPID keys) across multiple platforms:

- **Android Chrome PWA**: Full background notification support ✅
- **Android Firefox PWA**: Full background notification support ✅
- **iOS Safari PWA**: Limited background support (notifications only when app is active or during specific system events) ⚠️
- **Desktop Chrome PWA**: Full background notification support ✅

## Setup for Testing

### 1. Deploy to Vercel (Required for Push Notifications)

Push notifications require a secure HTTPS context. For testing on smartphones, you need to deploy to Vercel:

```bash
# First, ensure all changes are committed
git add .
git commit -m "Add background push notifications"

# Deploy to Vercel
npm install -g vercel
vercel
```

**VAPID Keys Note**: The `.env.local` file contains your VAPID keys. When deploying to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: `BBif1gv4_HeME0-qLK7Z2ZkTBKhGsADhfE6XEckKd3ddN4T2fnRx8N5vMSOUDrna_uNjznzTKyQeBa9GyPX2vE4`
   - `VAPID_PRIVATE_KEY`: `kDlnMB2x8AVZ_CCocqElKrc4i4NyEOkJt0BmWpxTkXc`
   - `VAPID_SUBJECT`: `mailto:deadlinetracker@example.com`

3. Redeploy after adding environment variables

### 2. Test Installation on Smartphone

#### On Android (Chrome):
1. Open your Vercel app URL in Google Chrome
2. Allow notifications when prompted
3. Tap the menu (three dots) → "Install app" or "Add to Home screen"
4. The app should now be installed as a PWA

#### On iOS (Safari):
1. Open your Vercel app URL in Safari
2. Allow notifications when prompted
3. Tap the share icon (square with arrow) at the bottom
4. Select "Add to Home Screen"
5. The app should now be installed as a PWA

## Testing Push Notifications

### Option 1: Using the Browser Console (Developer Tools)

1. On your smartphone, install the PWA as described above
2. Open the app and keep it running
3. On your desktop, open the same Vercel URL
4. Open DevTools (F12) → Console
5. Run this command to test sending a notification to all subscribers:

```javascript
fetch('/api/send-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test push notification!'
  })
}).then(r => r.json()).then(console.log)
```

### Option 2: Testing with curl (from your computer terminal)

```bash
curl -X POST https://your-vercel-url.vercel.app/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deadline Reminder",
    "body": "You have a deadline due tomorrow!"
  }'
```

### Option 3: Using a Webhook Service (Recommended for Automation)

For scheduling automatic notifications, you can use services like:
- **Zapier**: Trigger HTTP requests at specific times
- **IFTTT**: Create automated workflows
- **AWS EventBridge**: Scheduled events to trigger notifications

## Expected Behavior

### When App is in Background

**Android Chrome/Firefox PWA**:
- Notification appears in the system notification center
- Tapping the notification brings the app to the foreground
- Multiple notifications can queue up

**iOS Safari PWA**:
- Notifications may not appear if the app is completely closed
- This is a limitation of iOS PWA capabilities
- Users should keep the app running for reliable notifications

### When App is Active

**All platforms**:
- Notification appears in the notification center (if permission granted)
- Service worker handles the push event silently
- App can respond to the notification click event

## Troubleshooting

### Notifications Not Working?

1. **Check Service Worker Registration**:
   - Go to DevTools → Application → Service Workers
   - Ensure "sw.js" is registered and active
   - Check the "Offline" box to test offline functionality

2. **Check Notification Permission**:
   - DevTools → Application → Manifest
   - Verify app has notification permissions
   - If denied, uninstall the app and reinstall to prompt again

3. **Verify VAPID Keys**:
   - Ensure environment variables are set correctly on Vercel
   - Keys must match between frontend and backend
   - Redeploy if you change keys

4. **Database Issues**:
   - Check that `push_subscriptions` table was created:
   ```sql
   SELECT * FROM push_subscriptions;
   ```
   - If table doesn't exist, make a subscription request to create it

### Subscription Not Saving?

1. Check browser console for errors
2. Open DevTools → Network tab
3. Make a test POST request to `/api/subscribe`
4. Check the response status and body
5. Verify database is reachable in Vercel

## Mobile Browser DevTools

To inspect logs on your smartphone:

### Android Chrome:
1. Open Chrome on desktop
2. Go to `chrome://inspect`
3. Look for your Android device
4. Click "Inspect" next to the PWA
5. View console logs and network requests

### iOS Safari:
1. On Mac, enable Develop menu: Safari → Preferences → Advanced
2. Connect iPhone via USB
3. iPhone → Settings → Safari → Advanced → Web Inspector (enable)
4. Safari → Develop → [Your iPhone Name] → select your app
5. View console logs and network requests

## API Endpoints

### Subscribe to Push Notifications

```
POST /api/subscribe
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "auth": "...",
      "p256dh": "..."
    }
  }
}
```

### Send Notification to All Subscribers

```
POST /api/send-notification
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification body text",
  "tag": "optional-unique-tag"
}
```

## Security Considerations

1. **VAPID Keys**: Keep private key secure in `.env` variables only
2. **Rate Limiting**: Add rate limiting to `/api/send-notification` in production
3. **Authentication**: Consider adding authentication to send-notification endpoint
4. **Subscription Validation**: Validate and clean up invalid subscriptions regularly

## Next Steps

1. Deploy to Vercel and add environment variables
2. Test installation on both Android and iOS devices
3. Test notifications using the methods above
4. Integrate deadline notifications into your app's deadline creation/update flow
5. Monitor subscription growth and invalid endpoints

## Support Resources

- [Web Push Protocol (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Manifest (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [VAPID Keys Documentation](https://tools.ietf.org/html/draft-thomson-webpush-vapid)
