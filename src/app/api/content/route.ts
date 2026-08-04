import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getContent, updateContent } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const content = await getContent();
  return NextResponse.json({ content });
}

const schema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutBody: z.string().optional(),
  aboutImage: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  tagline: z.string().optional(),
});

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  const content = await updateContent(parsed.data);
  return NextResponse.json({ content });
}
