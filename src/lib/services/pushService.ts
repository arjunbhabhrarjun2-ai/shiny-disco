import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

webpush.setVapidDetails(
  'mailto:admin@kandella.org',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendAdminPushNotifications(payload: { title: string; body: string; url?: string }) {
  const subscriptions = await prisma.pushSubscription.findMany();
  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({ title: payload.title, body: payload.body, url: payload.url ?? '/aK3m9Xq/pZ2vR7nL4wQ1fB/dashboard' })
      )
    )
  );
  // Optionally clean up invalid subscriptions here
  const failed: string[] = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      failed.push(subscriptions[i].endpoint);
    }
  });
  if (failed.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: failed } },
    });
  }
}
