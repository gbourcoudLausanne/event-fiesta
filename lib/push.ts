import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

// Envoie une notification push à tous les appareils de l'admin inscrits.
// Non bloquant : un échec n'interrompt jamais l'action qui l'a déclenchée.
export async function notifyAdmin(message: { title: string; body: string; url?: string; tag?: string }) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return { sent: 0 };

  try {
    webpush.setVapidDetails("mailto:contact@eventfiesta.ch", publicKey, privateKey);
    const supabase = createAdminClient();
    const { data: subs } = await supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth");
    let sent = 0;
    await Promise.all(
      (subs ?? []).map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            JSON.stringify({ ...message, url: message.url ?? "/admin" }),
            { TTL: 60 * 60 * 24 },
          );
          sent++;
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          // Appareil désinscrit ou abonnement expiré : on le retire
          if (status === 404 || status === 410) await supabase.from("push_subscriptions").delete().eq("id", s.id);
          else console.error("notifyAdmin: envoi échoué", status, err);
        }
      }),
    );
    return { sent };
  } catch (err) {
    console.error("notifyAdmin: erreur", err);
    return { sent: 0 };
  }
}
