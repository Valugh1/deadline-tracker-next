## Android + Capacitor Setup for Deadline Tracker

Your current app is a Next.js web app with API routes, so the cleanest Android path is:

- keep the Next.js app hosted or built as a web app
- wrap it with Capacitor
- add Android and push notification support

### 1. Install the Android environment

On Windows, install:

- Java JDK 17 or newer
- Android Studio
- Android SDK + Android SDK Platform 34+ (or latest stable)
- Android SDK Build Tools
- Android SDK Platform-Tools
- Enable USB debugging on your Android phone

Then verify:

- `node -v`
- `npm -v`
- `java -version`
- `adb devices`

### 2. Add Capacitor to your project

From `c:\Users\Nepta\Projects\deadline-tracker-next`:

- `npm install @capacitor/core @capacitor/cli @capacitor/android`
- `npx cap init deadline-tracker-next com.yourcompany.deadlinetracker`

This creates `capacitor.config.ts` and prepares Capacitor metadata.

### 3. Prepare your app for Android

#### Option A: Host the website remotely

- Deploy the Next.js app to Vercel, Render, or any HTTPS host
- In `capacitor.config.ts`, use `server.url: "https://your-deployed-site.com"`

This is usually easiest if your app needs API routes, auth, or backend logic.

#### Option B: Build locally as a static web app

- `npm run build`
- `npx next export`
- set `webDir` to `out`

This only works if your app can be fully exported statically.

### 4. Add Android support

Run:

- `npx cap add android`

Then after every web build:

- `npm run build`
- `npx cap copy android`

Open Android Studio:

- `npx cap open android`

### 5. Install on your phone

In Android Studio:

- connect your device
- select it from the device picker
- run the app

For a release APK:

- Build > Build Bundle(s) / APK(s) > Build APK(s)

### 6. Add push notifications

Use Capacitor’s push notification plugin:

- `npm install @capacitor/push-notifications`
- `npx cap sync android`

Then in your React app use:

- `import { PushNotifications } from '@capacitor/push-notifications'`

Essential steps:

- request permission
- register for push notifications
- listen for `registration`, `pushNotificationReceived`, and `pushNotificationActionPerformed`

### 7. Android / Firebase configuration

For Android push notifications you usually need Firebase Cloud Messaging:

- create a Firebase project
- add an Android app
- download `google-services.json`
- place it in `android/app/`
- add Firebase dependencies in Android Studio if needed
- configure `AndroidManifest.xml` if the plugin requires it

### Important note for this project

Because this app uses Next.js API routes and auth:

- packaging it as a fully local static app is not trivial
- the recommended workflow is to keep your web backend hosted
- use Capacitor as a native shell to install the app on Android

That gives you the install-on-phone experience without rewriting the whole backend.

### Recommended next step

1. Install Capacitor packages
2. run `npx cap init`
3. add Android with `npx cap add android`
4. configure push notifications with Firebase
5. open Android Studio and test on a phone