This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA Setup

This project is set up as a Progressive Web App (PWA), allowing it to be installed and run like a native app on mobile devices.

### Installing the PWA

#### On Android:
1. Open the app in Google Chrome.
2. Tap the three-dot menu in the top-right corner.
3. Select "Add to Home screen".
4. Confirm by tapping "Add".

#### On iOS:
1. Open the app in Safari.
2. Tap the share icon (square with an arrow pointing up) at the bottom of the screen.
3. Scroll down and select "Add to Home Screen".
4. Confirm by tapping "Add".

### Testing the PWA

- **Installation**: After adding to the home screen, the app icon should appear. Tap it to launch the PWA.
- **Offline Functionality**: Test by disconnecting from the internet. The app should still load cached content if a service worker is configured.
- **Updates**: PWAs can update automatically when the app is refreshed or relaunched.
- **Permissions**: Ensure push notifications and other features work as expected after installation.
