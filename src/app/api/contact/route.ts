import { NextResponse } from "next/server";
import { addContactMessage, getBranding } from "@/lib/db";
import { officialEmailShell, sendOfficialEmail } from "@/lib/mail";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill all fields correctly." }, { status: 400 });
  }

  await addContactMessage(parsed.data);
  const branding = await getBranding();
  const body = officialEmailShell({
    company: branding.companyName,
    legalName: branding.legalName,
    title: "New website enquiry",
    intro: `${parsed.data.name} sent a message from the contact form.`,
    rows: [
      { label: "Name", value: parsed.data.name },
      { label: "Email", value: parsed.data.email },
      { label: "Message", value: parsed.data.message },
    ],
    footer: "Reply to the client from your rental desk.",
  });

  await sendOfficialEmail({
    to: branding.supportEmail,
    subject: `${branding.companyName} — website enquiry from ${parsed.data.name}`,
    html: body.html,
    text: body.text,
    kind: "contact",
  });

  return NextResponse.json({ ok: true });
}
