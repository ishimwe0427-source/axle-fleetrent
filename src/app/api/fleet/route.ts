import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { deleteFleet, getFleet, upsertFleet } from "@/lib/db";
import type { FleetItem } from "@/lib/types";
import { z } from "zod";

export async function GET() {
  const fleet = await getFleet();
  return NextResponse.json({ fleet });
}

const fleetSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  category: z.string().min(2),
  tagline: z.string().min(2),
  description: z.string().min(10),
  image: z.string().min(1),
  dailyRate: z.number().positive(),
  weeklyRate: z.number().positive(),
  monthlyRate: z.number().positive(),
  available: z.boolean(),
  featured: z.boolean(),
  specs: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = fleetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fleet data." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const item: FleetItem = {
    id: parsed.data.id || `fleet_${Date.now()}`,
    slug: parsed.data.slug,
    name: parsed.data.name,
    category: parsed.data.category,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    image: parsed.data.image,
    dailyRate: parsed.data.dailyRate,
    weeklyRate: parsed.data.weeklyRate,
    monthlyRate: parsed.data.monthlyRate,
    available: parsed.data.available,
    featured: parsed.data.featured,
    specs: parsed.data.specs,
    updatedAt: now,
  };

  const saved = await upsertFleet(item);
  return NextResponse.json({ fleet: saved });
}

export async function DELETE(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteFleet(id);
  return NextResponse.json({ ok: true });
}
