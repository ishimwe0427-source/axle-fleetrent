import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getEmailLogs, getMailSettings, updateMailSettings } from "@/lib/db";
import { sendOfficialEmail, officialEmailShell, mailIsReady, getResolvedMailSettings } from "@/lib/mail";
import { z } from "zod";

export async function GET() {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [settings, logs] = await Promise.all([
    getMailSettings(),
    getEmailLogs(50),
  ]);
  const resolved = await getResolvedMailSettings();
  return NextResponse.json({
    settings: { ...settings, pass: settings.pass ? "••••••••" : "" },
    configured: mailIsReady(resolved),
    logs,
  });
}

const schema = z.object({
  enabled: z.boolean().optional(),
  host: z.string().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  secure: z.boolean().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
});

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email settings." }, { status: 400 });
  }

  const patch = { ...parsed.data };
  if (patch.pass === "••••••••") delete patch.pass;
  const settings = await updateMailSettings(patch);
  return NextResponse.json({
    settings: { ...settings, pass: settings.pass ? "••••••••" : "" },
  });
}

const testSchema = z.object({
  to: z.string().email(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = testSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid test email." }, { status: 400 });
  }

  const body = officialEmailShell({
    company: "AXLE",
    legalName: "AXLE Inc. Ltd",
    title: "Test email",
    intro: "If you received this, official booking emails are working.",
    footer: "You can now receive automatic booking confirmations.",
  });

  const status = await sendOfficialEmail({
    to: parsed.data.to,
    subject: "AXLE — official email test",
    html: body.html,
    text: body.text,
    kind: "test",
  });

  return NextResponse.json({ status });
}
