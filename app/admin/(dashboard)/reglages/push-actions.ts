"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyAdmin } from "@/lib/push";

export async function savePushSubscription(sub: { endpoint: string; keys: { p256dh: string; auth: string } }, userAgent: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth, user_agent: userAgent.slice(0, 300) }, { onConflict: "endpoint" });
  return error ? { error: "L'appareil n'a pas pu être enregistré." } : {};
}

export async function deletePushSubscription(endpoint: string) {
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  return {};
}

export async function sendTestPush(): Promise<{ sent: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sent: 0 };
  return notifyAdmin({ title: "Event Fiesta", body: "Les notifications fonctionnent sur cet appareil ✓", url: "/admin/reglages", tag: "test" });
}
