import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderLeadEmail, renderClientConfirmationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const TO_EMAIL = "contact@eventfiesta.ch";
const FROM_EMAIL = "Event Fiesta <notifications@eventfiesta.ch>";
const WA_LINK = "https://wa.me/41779143855";
const MAX_TOTAL_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

// Champs internes/techniques à ne pas recopier tels quels dans le corps de l'e-mail
const SKIP_FIELDS = new Set(["_honey", "Sujet", "Langue"]);

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY manquante");
    return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot — un bot remplit ce champ invisible, jamais un humain.
  // On répond "ok" sans rien envoyer, pour ne pas indiquer au bot qu'il a été détecté.
  const honey = form.get("_honey");
  if (typeof honey === "string" && honey.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const nom = String(form.get("Nom") ?? "").trim();
  const email = String(form.get("Email") ?? "").trim();
  if (!nom || !email) {
    return NextResponse.json({ error: "Nom et email requis." }, { status: 400 });
  }

  const fields: { label: string; value: string }[] = [];
  for (const [key, value] of form.entries()) {
    if (SKIP_FIELDS.has(key) || value instanceof File) continue;
    const v = String(value).trim();
    if (v) fields.push({ label: key, value: v });
  }

  const files = form.getAll("attachment").filter(
    (f): f is File => f instanceof File && f.size > 0,
  );
  const attachments: { filename: string; content: Buffer }[] = [];
  let totalBytes = 0;
  for (const file of files.slice(0, MAX_FILES)) {
    if (totalBytes + file.size > MAX_TOTAL_BYTES) break;
    totalBytes += file.size;
    attachments.push({
      filename: file.name || "photo.jpg",
      content: Buffer.from(await file.arrayBuffer()),
    });
  }

  const ref = String(form.get("Référence") ?? "");
  const lang = String(form.get("Langue") ?? "fr");
  const eventType = String(form.get("Type d'événement") ?? "");
  const date = String(form.get("Date souhaitée") ?? "");
  const venue = String(form.get("Lieu") ?? "");
  const subject = String(form.get("Sujet") ?? "") || "Nouvelle demande — Event Fiesta";
  const urgent = subject.startsWith("⚡");

  const recap = [
    eventType && { label: "Événement", value: eventType },
    date && { label: "Date", value: date },
    venue && { label: "Lieu", value: venue },
  ].filter((r): r is { label: string; value: string } => Boolean(r));

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      html: renderLeadEmail({ fields, ref, urgent }),
      text: fields.map((f) => `${f.label} : ${f.value}`).join("\n"),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("contact: erreur Resend (lead)", error);
      return NextResponse.json({ error: "Échec de l'envoi." }, { status: 502 });
    }

    // E-mail de confirmation au client — best effort : une panne ici ne doit
    // jamais faire échouer la demande, qui est déjà bien arrivée chez nous.
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: TO_EMAIL,
        subject: ref ? `Votre demande a bien été reçue — Réf. ${ref}` : "Votre demande a bien été reçue",
        html: renderClientConfirmationEmail({ lang, name: nom, recap, ref, waLink: WA_LINK }),
      });
    } catch (err) {
      console.error("contact: erreur Resend (confirmation client, non bloquant)", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact: erreur inattendue", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
