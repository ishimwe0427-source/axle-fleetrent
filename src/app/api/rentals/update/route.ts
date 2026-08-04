import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { updateRentalStatus } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  status: z.enum(["pending", "approved", "active", "completed", "rejected"]),
});

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rental = await updateRentalStatus(parsed.data.id, parsed.data.status);
  if (!rental) {
    return NextResponse.json({ error: "Rental not found." }, { status: 404 });
  }

  return NextResponse.json({ rental });
}
