import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getSlides, saveSlides } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const slides = await getSlides();
  return NextResponse.json({ slides });
}

const schema = z.object({
  slides: z.array(
    z.object({
      id: z.string(),
      image: z.string().min(1),
      title: z.string().min(1),
      subtitle: z.string().min(1),
    }),
  ),
});

export async function PUT(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid slides." }, { status: 400 });
  }

  const slides = await saveSlides(parsed.data.slides);
  return NextResponse.json({ slides });
}
