"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send message");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 px-5 py-8 text-sm text-emerald-900">
        Thanks — your message reached the rental desk. We will follow up on the
        email you provided.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-stone-200 bg-white p-6">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-stone-500">Name</span>
        <input
          required
          name="name"
          className="mt-2 w-full border border-stone-200 px-4 py-3 outline-none focus:border-amber-400"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-stone-500">Email</span>
        <input
          required
          type="email"
          name="email"
          className="mt-2 w-full border border-stone-200 px-4 py-3 outline-none focus:border-amber-400"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-stone-500">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full border border-stone-200 px-4 py-3 outline-none focus:border-amber-400"
          placeholder="Machine needed, site location, and hire dates"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-amber-400 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
