import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBranding, updateBranding } from "@/lib/db";
import { isSuperAdmin, type NavItem } from "@/lib/types";
import { z } from "zod";

export async function GET() {
  const branding = await getBranding();
  return NextResponse.json({ branding });
}

const navSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean(),
});

const brandingSchema = z.object({
  companyName: z.string().min(1).optional(),
  legalName: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  logo: z.string().min(1).optional(),
  favicon: z.string().min(1).optional(),
  logoHeight: z.number().min(24).max(96).optional(),
  primaryColor: z.string().min(4).optional(),
  accentColor: z.string().min(4).optional(),
  regionLabel: z.string().min(1).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().min(3).optional(),
  ctaLabel: z.string().min(1).optional(),
  navItems: z.array(navSchema).optional(),
  showTeam: z.boolean().optional(),
  showGallery: z.boolean().optional(),
  showChat: z.boolean().optional(),
  sitePublished: z.boolean().optional(),
  footerText: z.string().min(1).optional(),
});

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || !isSuperAdmin(user.role)) {
    return NextResponse.json(
      { error: "Only the platform owner can change branding." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parsed = brandingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid branding data." }, { status: 400 });
  }

  const branding = await updateBranding({
    ...parsed.data,
    navItems: parsed.data.navItems as NavItem[] | undefined,
  });
  return NextResponse.json({ branding });
}
