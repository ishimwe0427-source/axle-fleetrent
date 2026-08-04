import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import {
  deleteCategory,
  getCategories,
  upsertCategory,
} from "@/lib/db";
import type { GalleryCategory } from "@/lib/types";
import { z } from "zod";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(5),
  coverImage: z.string().min(1),
  images: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const category: GalleryCategory = {
    id: parsed.data.id || `cat_${Date.now()}`,
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description,
    coverImage: parsed.data.coverImage,
    images: parsed.data.images,
    updatedAt: new Date().toISOString(),
  };

  const saved = await upsertCategory(category);
  return NextResponse.json({ category: saved });
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

  await deleteCategory(id);
  return NextResponse.json({ ok: true });
}
