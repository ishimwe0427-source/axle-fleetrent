import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getChatMessages,
  getChatThread,
  setChatThreadStatus,
} from "@/lib/db";
import { isStaff } from "@/lib/types";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const thread = await getChatThread(id);
  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!isStaff(user.role) && thread.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await getChatMessages(id);
  return NextResponse.json({ thread, messages });
}

const statusSchema = z.object({
  status: z.enum(["open", "closed"]),
});

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const thread = await setChatThreadStatus(id, parsed.data.status);
  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ thread });
}
