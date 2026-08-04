import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createChatThread,
  getChatMessages,
  getChatThreads,
  getChatThreadsByUser,
  getUserById,
} from "@/lib/db";
import { isStaff } from "@/lib/types";
import { z } from "zod";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threads = isStaff(user.role)
    ? await getChatThreads()
    : await getChatThreadsByUser(user.id);

  const withPreview = await Promise.all(
    threads.map(async (thread) => {
      const messages = await getChatMessages(thread.id);
      const last = messages[messages.length - 1];
      const owner = await getUserById(thread.userId);
      return {
        ...thread,
        messageCount: messages.length,
        lastMessage: last?.body ?? "",
        lastMessageAt: last?.createdAt ?? thread.updatedAt,
        customerName: owner?.name ?? "Customer",
        customerEmail: owner?.email ?? "",
      };
    }),
  );

  return NextResponse.json({ threads: withPreview });
}

const createSchema = z.object({
  subject: z.string().min(3).max(120),
  message: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const result = await createChatThread({
    userId: user.id,
    subject: parsed.data.subject,
    firstMessage: parsed.data.message,
    senderName: user.name,
    senderRole: user.role,
  });

  return NextResponse.json(result, { status: 201 });
}
