"use client";

import { FormEvent, useState } from "react";
import type { EmailLog, MailSettings } from "@/lib/types";

type Props = {
  initial: Omit<MailSettings, "pass"> & { pass: string };
  configured: boolean;
  logs: EmailLog[];
};

export function AdminEmailManager({ initial, configured, logs }: Props) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [testTo, setTestTo] = useState("");

  const input =
    "mt-2 w-full border border-white/15 bg-stone-950/50 px-4 py-3 text-white outline-none focus:border-amber-400";

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        port: Number(form.port),
      }),
    });
    const data = await res.json();
    setSaving(false);
    setStatus(res.ok ? "Email settings saved." : data.error || "Save failed");
  }

  async function sendTest() {
    setStatus("");
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: testTo }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Test failed");
      return;
    }
    setStatus(
      data.status === "sent"
        ? "Test email sent. Check the inbox."
        : "Email was skipped — finish SMTP settings first.",
    );
  }

  return (
    <div className="space-y-10">
      <div className="border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        {configured
          ? "Official email is ready. Clients receive a confirmation as soon as they book."
          : "Turn this on and add SMTP (Gmail app password works). Until then, bookings still save, but emails wait in the log."}
      </div>

      <form onSubmit={save} className="grid gap-5 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-white/80 md:col-span-2">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          />
          Send official emails automatically
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            SMTP host
          </span>
          <input
            className={input}
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            placeholder="smtp.gmail.com"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Port
          </span>
          <input
            className={input}
            type="number"
            value={form.port}
            onChange={(e) => setForm({ ...form, port: Number(e.target.value) })}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            SMTP username
          </span>
          <input
            className={input}
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
            placeholder="your-gmail@gmail.com"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            SMTP password / app password
          </span>
          <input
            className={input}
            type="password"
            value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            From name
          </span>
          <input
            className={input}
            value={form.fromName}
            onChange={(e) => setForm({ ...form, fromName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            From email
          </span>
          <input
            className={input}
            type="email"
            value={form.fromEmail}
            onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-white/80 md:col-span-2">
          <input
            type="checkbox"
            checked={form.secure}
            onChange={(e) => setForm({ ...form, secure: e.target.checked })}
          />
          Use secure SMTP (SSL, port 465)
        </label>
        {status && (
          <p className="md:col-span-2 text-sm text-amber-200">{status}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save email settings"}
        </button>
      </form>

      <section className="border border-white/10 p-5">
        <h2 className="font-display text-2xl tracking-wide text-amber-300">
          Send a test
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className={input + " mt-0"}
            type="email"
            placeholder="you@company.com"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
          />
          <button
            type="button"
            onClick={sendTest}
            className="border border-white/20 px-5 py-3 text-sm text-white hover:bg-white/5"
          >
            Send test email
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-wide text-amber-300">
          Email archive
        </h2>
        <div className="mt-4 divide-y divide-white/10 border border-white/10">
          {logs.length === 0 ? (
            <p className="px-4 py-8 text-sm text-white/45">No emails yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="px-4 py-3 text-sm">
                <p className="text-white">
                  {log.subject}{" "}
                  <span className="text-white/45">→ {log.to || "n/a"}</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/40">
                  {log.status}
                  {log.error ? ` · ${log.error}` : ""} ·{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
