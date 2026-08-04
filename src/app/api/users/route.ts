import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listUsers, updateUserRole } from "@/lib/db";
import { isSuperAdmin, type UserRole } from "@/lib/types";
import { z } from "zod";

export async function GET() {
  const user = await getSession();
  if (!user || !isSuperAdmin(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await listUsers();
  return NextResponse.json({
    users: users.map(({ passwordHash: _, ...safe }) => safe),
  });
}

const roleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["superadmin", "admin", "customer"]),
});

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || !isSuperAdmin(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = roleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role update." }, { status: 400 });
  }

  try {
    const updated = await updateUserRole(
      parsed.data.id,
      parsed.data.role as UserRole,
    );
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { passwordHash: _, ...safe } = updated;
    return NextResponse.json({ user: safe });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 },
    );
  }
}
