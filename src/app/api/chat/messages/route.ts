import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addChatMessage, getChatThread } from "@/lib/db";
import { isStaff } from "@/lib/types";
import { z } from "zod";

const schema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const thread = await getChatThread(parsed.data.threadId);
  if (!thread) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }
  if (!isStaff(user.role) && thread.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const message = await addChatMessage({
      threadId: parsed.data.threadId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      body: parsed.data.body,
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 400 },
    );
  }
}
