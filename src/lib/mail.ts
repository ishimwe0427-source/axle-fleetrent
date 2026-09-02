import nodemailer from "nodemailer";
import {
  addEmailLog,
  getBranding,
  getMailSettings,
} from "@/lib/db";
import type { EmailLog, MailSettings } from "@/lib/types";

function resolveSettings(stored: MailSettings): MailSettings {
  return {
    enabled:
      stored.enabled ||
      Boolean(process.env.SMTP_USER) ||
      Boolean(process.env.RESEND_API_KEY),
    host: process.env.SMTP_HOST || stored.host,
    port: Number(process.env.SMTP_PORT || stored.port || 465),
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : stored.secure,
    user: process.env.SMTP_USER || stored.user,
    pass: process.env.SMTP_PASS || stored.pass,
    fromName: process.env.SMTP_FROM_NAME || stored.fromName,
    fromEmail: process.env.SMTP_FROM_EMAIL || stored.fromEmail,
  };
}

export async function getResolvedMailSettings(): Promise<MailSettings> {
  return resolveSettings(await getMailSettings());
}

export function mailIsReady(settings: MailSettings): boolean {
  if (process.env.RESEND_API_KEY) return true;
  return Boolean(
    settings.enabled && settings.host && settings.user && settings.pass && settings.fromEmail,
  );
}

async function sendViaResend(input: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Resend failed (${res.status})`);
  }
}

async function sendViaSmtp(
  settings: MailSettings,
  input: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
  },
) {
  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: {
      user: settings.user,
      pass: settings.pass,
    },
  });
  await transporter.sendMail({
    from: input.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

export async function sendOfficialEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  kind: EmailLog["kind"];
  rentalId?: string;
}): Promise<EmailLog["status"]> {
  const branding = await getBranding();
  const settings = await getResolvedMailSettings();
  const fromEmail = settings.fromEmail || branding.supportEmail;
  const fromName = settings.fromName || branding.legalName;
  const from = `${fromName} <${fromEmail}>`;

  if (!input.to) {
    await addEmailLog({
      to: "",
      subject: input.subject,
      kind: input.kind,
      status: "skipped",
      error: "No recipient email",
      rentalId: input.rentalId,
    });
    return "skipped";
  }

  if (!mailIsReady(settings) || !fromEmail) {
    await addEmailLog({
      to: input.to,
      subject: input.subject,
      kind: input.kind,
      status: "skipped",
      error: "Email is not configured yet. Add SMTP in Admin → Official email.",
      rentalId: input.rentalId,
    });
    return "skipped";
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend({ ...input, from });
    } else {
      await sendViaSmtp(settings, { ...input, from });
    }
    await addEmailLog({
      to: input.to,
      subject: input.subject,
      kind: input.kind,
      status: "sent",
      rentalId: input.rentalId,
    });
    return "sent";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Send failed";
    await addEmailLog({
      to: input.to,
      subject: input.subject,
      kind: input.kind,
      status: "failed",
      error: message,
      rentalId: input.rentalId,
    });
    return "failed";
  }
}

export function officialEmailShell(opts: {
  company: string;
  legalName: string;
  title: string;
  intro: string;
  rows?: { label: string; value: string }[];
  footer: string;
  phone?: string;
  email?: string;
}) {
  const rows = (opts.rows || [])
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 0;color:#6b6560;font-size:13px;width:140px;">${row.label}</td>
          <td style="padding:8px 0;color:#171411;font-size:14px;font-weight:600;">${row.value}</td>
        </tr>`,
    )
    .join("");

  const html = `
  <div style="background:#f4f5f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e4;">
      <div style="background:#121417;padding:22px 28px;">
        <p style="margin:0;color:#f5a623;letter-spacing:0.18em;font-size:12px;text-transform:uppercase;">${opts.company}</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">${opts.title}</h1>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 16px;color:#44403c;line-height:1.6;font-size:15px;">${opts.intro}</p>
        ${
          rows
            ? `<table style="width:100%;border-collapse:collapse;margin:18px 0;">${rows}</table>`
            : ""
        }
        <p style="margin:18px 0 0;color:#57534e;line-height:1.6;font-size:14px;">${opts.footer}</p>
        <p style="margin:18px 0 0;color:#78716c;font-size:13px;">
          ${opts.phone ? `Phone: ${opts.phone}<br/>` : ""}
          ${opts.email ? `Email: ${opts.email}` : ""}
        </p>
      </div>
      <div style="padding:14px 28px;background:#fafafa;color:#a8a29e;font-size:11px;">
        Official message from ${opts.legalName}. Please do not reply with payments to unsolicited accounts.
      </div>
    </div>
  </div>`;

  const text = [
    opts.title,
    "",
    opts.intro,
    "",
    ...(opts.rows || []).map((r) => `${r.label}: ${r.value}`),
    "",
    opts.footer,
    opts.phone ? `Phone: ${opts.phone}` : "",
    opts.email ? `Email: ${opts.email}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
