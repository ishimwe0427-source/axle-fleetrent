import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { createRental, getRentals, getRentalsByUser } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isStaff(user.role)) {
    const rentals = await getRentals();
    return NextResponse.json({ rentals });
  }

  const rentals = await getRentalsByUser(user.id);
  return NextResponse.json({ rentals });
}

const schema = z.object({
  fleetId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  location: z.string().min(2),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Please log in to rent." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rental details." }, { status: 400 });
  }

  const rental = await createRental({
    userId: user.id,
    fleetId: parsed.data.fleetId,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
    location: parsed.data.location,
    notes: parsed.data.notes || "",
  }).catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Could not create booking.";
    return { error: message };
  });

  if ("error" in rental) {
    return NextResponse.json({ error: rental.error }, { status: 400 });
  }

  return NextResponse.json({ rental });
}
