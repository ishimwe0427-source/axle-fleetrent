"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatThread, SessionUser } from "@/lib/types";
import { isStaff } from "@/lib/types";

type ThreadRow = ChatThread & {
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
  customerName?: string;
  customerEmail?: string;
};

export function ChatWorkspace({
  mode,
  user,
}: {
  mode: "customer" | "staff";
  user: SessionUser;
}) {
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [subject, setSubject] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadThreads = useCallback(async () => {
    const res = await fetch("/api/chat/threads");
    const data = await res.json();
    if (res.ok) {
      setThreads(data.threads || []);
      setActiveId((current) => current ?? data.threads?.[0]?.id ?? null);
    }
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/chat/threads/${id}`);
    const data = await res.json();
    if (res.ok) {
      setMessages(data.messages || []);
      setActiveThread(data.thread);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const timer = setInterval(() => loadMessages(activeId), 4000);
    return () => clearInterval(timer);
  }, [activeId, loadMessages]);

  const sorted = useMemo(
    () =>
      [...threads].sort(
        (a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt),
      ),
    [threads],
  );

  async function startThread(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await fetch("/api/chat/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message: draft }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error || "Could not start chat");
      return;
    }
    setSubject("");
    setDraft("");
    setActiveId(data.thread.id);
    await loadThreads();
    await loadMessages(data.thread.id);
  }

  async function sendReply(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !draft.trim()) return;
    setSending(true);
    setError("");
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: activeId, body: draft }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error || "Could not send");
      return;
    }
    setDraft("");
    setMessages((prev) => [...prev, data.message]);
    await loadThreads();
  }

  async function toggleStatus() {
    if (!activeThread || !isStaff(user.role)) return;
    const next = activeThread.status === "open" ? "closed" : "open";
    const res = await fetch(`/api/chat/threads/${activeThread.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      const data = await res.json();
      setActiveThread(data.thread);
      await loadThreads();
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
            Archive
          </p>
          <p className="mt-1 text-sm text-white/60">
            {threads.length} conversation{threads.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="px-4 py-6 text-sm text-white/50">Loading…</p>
          )}
          {!loading && sorted.length === 0 && (
            <p className="px-4 py-6 text-sm text-white/50">
              No conversations yet.
            </p>
          )}
          {sorted.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={cn(
                "w-full border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5",
                activeId === thread.id && "bg-white/10",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-white">
                  {thread.subject}
                </p>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider",
                    thread.status === "open"
                      ? "text-emerald-300"
                      : "text-white/40",
                  )}
                >
                  {thread.status}
                </span>
              </div>
              {mode === "staff" && (
                <p className="mt-1 truncate text-xs text-white/45">
                  {thread.customerName}
                </p>
              )}
              <p className="mt-1 line-clamp-2 text-xs text-white/55">
                {thread.lastMessage || "No messages"}
              </p>
              <p className="mt-2 text-[10px] text-white/35">
                {thread.messageCount} msgs ·{" "}
                {new Date(thread.lastMessageAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[520px] flex-col border border-white/10 bg-white/5">
        {mode === "customer" && !activeId && (
          <form onSubmit={startThread} className="flex flex-1 flex-col p-5">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
              Start a conversation
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Your full chat history stays in the archive for this account.
            </p>
            <label className="mt-6 block">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Subject
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                minLength={3}
                className="mt-2 w-full border border-white/15 bg-stone-950/50 px-4 py-3 text-white outline-none focus:border-amber-400"
                placeholder="e.g. Excavator for Kigali road works"
              />
            </label>
            <label className="mt-4 flex flex-1 flex-col">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Message
              </span>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                required
                className="mt-2 min-h-[160px] flex-1 border border-white/15 bg-stone-950/50 px-4 py-3 text-white outline-none focus:border-amber-400"
                placeholder="Tell us about your project…"
              />
            </label>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="mt-4 rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Start chat"}
            </button>
          </form>
        )}

        {activeId && activeThread && (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  {activeThread.subject}
                </h2>
                <p className="text-xs text-white/45">
                  {messages.length} messages in archive · {activeThread.status}
                </p>
              </div>
              <div className="flex gap-2">
                {mode === "customer" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(null);
                      setActiveThread(null);
                      setMessages([]);
                    }}
                    className="border border-white/15 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                  >
                    New chat
                  </button>
                )}
                {mode === "staff" && (
                  <button
                    type="button"
                    onClick={toggleStatus}
                    className="border border-white/15 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                  >
                    Mark {activeThread.status === "open" ? "closed" : "open"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {messages.map((msg) => {
                const mine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] px-4 py-3 text-sm",
                        mine
                          ? "bg-amber-400 text-stone-950"
                          : "bg-white/10 text-white",
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-wider opacity-70">
                        {msg.senderName} · {msg.senderRole}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{msg.body}</p>
                      <p className="mt-2 text-[10px] opacity-60">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeThread.status === "open" ? (
              <form
                onSubmit={sendReply}
                className="border-t border-white/10 p-4"
              >
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-white/15 bg-stone-950/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                  placeholder="Write a reply…"
                />
                {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-3 rounded-sm bg-amber-400 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            ) : (
              <p className="border-t border-white/10 px-5 py-4 text-sm text-white/50">
                This conversation is closed. Staff can reopen it from the inbox.
              </p>
            )}
          </>
        )}

        {mode === "staff" && !activeId && (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-white/50">
            Select a conversation from the archive.
          </div>
        )}
      </section>
    </div>
  );
}
