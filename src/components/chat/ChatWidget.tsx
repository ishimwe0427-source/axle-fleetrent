"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { isStaff } from "@/lib/types";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  const hide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  if (hide || user === undefined) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,360px)] border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-900/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-700">
                Support chat
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-stone-900">
                Talk to our team
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm p-1 text-stone-500 hover:bg-stone-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Ask about machines, availability, or project quotes. Every message
            is saved in your support archive.
          </p>
          {user ? (
            <Link
              href={isStaff(user.role) ? "/admin/chat" : "/chat"}
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-sm bg-[var(--brand-primary,#f5a623)] px-4 py-3 text-sm font-semibold text-stone-950 hover:brightness-110"
            >
              {isStaff(user.role) ? "Open inbox" : "Open my chats"}
            </Link>
          ) : (
            <div className="mt-5 space-y-2">
              <Link
                href="/login?next=/chat"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-sm bg-[var(--brand-primary,#f5a623)] px-4 py-3 text-sm font-semibold text-stone-950 hover:brightness-110"
              >
                Log in to chat
              </Link>
              <Link
                href="/register?next=/chat"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center border border-stone-300 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-[var(--brand-primary)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:scale-105"
        aria-label="Support chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
