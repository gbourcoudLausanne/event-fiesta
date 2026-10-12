"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellSlash, CheckCircle } from "@phosphor-icons/react";
import { savePushSubscription, deletePushSubscription, sendTestPush } from "./push-actions";

type Status = "loading" | "unsupported" | "ios-browser" | "denied" | "off" | "on";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const SW_URL = "/admin-sw.js";

export default function PushSettings() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus(ios && !standalone ? "ios-browser" : "unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration("/admin/");
      const sub = await reg?.pushManager.getSubscription();
      setStatus(sub ? "on" : "off");
    })().catch(() => setStatus("unsupported"));
  }, []);

  function enable() {
    setMessage(null);
    startTransition(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setStatus(permission === "denied" ? "denied" : "off");
          return;
        }
        const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/admin/" });
        await navigator.serviceWorker.ready;
        const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!key) throw new Error("clé manquante");
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) }));
        const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
        const res = await savePushSubscription(json, navigator.userAgent);
        if (res.error) throw new Error(res.error);
        setStatus("on");
        setMessage("Notifications activées sur cet appareil.");
      } catch (err) {
        console.error(err);
        setMessage("L'activation n'a pas fonctionné. Réessaie depuis l'icône EF Admin.");
      }
    });
  }

  function disable() {
    setMessage(null);
    startTransition(async () => {
      const reg = await navigator.serviceWorker.getRegistration("/admin/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await deletePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
      setMessage("Notifications désactivées sur cet appareil.");
    });
  }

  function test() {
    setMessage(null);
    startTransition(async () => {
      const res = await sendTestPush();
      setMessage(res.sent > 0 ? `Notification envoyée (${res.sent} appareil${res.sent > 1 ? "s" : ""}).` : "Aucun appareil inscrit.");
    });
  }

  const btn = "flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 font-sans text-[13px] font-medium disabled:opacity-60 sm:py-2.5";

  return (
    <div className="mt-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <p className="flex items-center gap-2 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
        <Bell size={16} /> Notifications sur cet appareil
      </p>
      <p className="mb-3 mt-1 font-sans text-[12px] leading-relaxed" style={{ color: "rgba(13,11,8,0.55)" }}>
        Nouvelle demande via le site, devis signé, ajouts confirmés par le client, et un récap le matin s&apos;il y a des choses à faire.
      </p>

      {status === "loading" && <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>Vérification…</p>}

      {status === "ios-browser" && (
        <p className="rounded-xl px-4 py-3 font-sans text-[12.5px] leading-relaxed" style={{ background: "var(--creme-2)", color: "var(--noir)" }}>
          Sur iPhone, ouvre l&apos;admin depuis l&apos;icône <strong>EF Admin</strong> de ton écran d&apos;accueil (pas depuis Safari), puis reviens ici.
        </p>
      )}

      {status === "unsupported" && (
        <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.55)" }}>Ce navigateur ne gère pas les notifications.</p>
      )}

      {status === "denied" && (
        <p className="rounded-xl px-4 py-3 font-sans text-[12.5px] leading-relaxed" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          Les notifications ont été refusées. Sur iPhone : Réglages → Notifications → EF Admin → Autoriser.
        </p>
      )}

      {status === "off" && (
        <button type="button" onClick={enable} disabled={isPending} className={btn + " w-full sm:w-auto"} style={{ background: "var(--rose-deep)", color: "var(--creme)" }}>
          <Bell size={15} /> {isPending ? "Activation…" : "Activer les notifications"}
        </button>
      )}

      {status === "on" && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold" style={{ color: "#3B7D55" }}>
            <CheckCircle size={16} weight="fill" /> Activées
          </span>
          <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex">
            <button type="button" onClick={test} disabled={isPending} className={btn} style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}>
              Envoyer un test
            </button>
            <button type="button" onClick={disable} disabled={isPending} className={btn} style={{ border: "1px solid rgba(13,11,8,0.14)", color: "rgba(13,11,8,0.6)" }}>
              <BellSlash size={15} /> Désactiver
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-2 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.6)" }}>{message}</p>}
    </div>
  );
}
