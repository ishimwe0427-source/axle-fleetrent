"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/rent";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        company: form.get("company"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    router.push(next.startsWith("/") ? next : "/rent");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-[calc(100svh-80px)] items-center justify-center bg-stone-950 px-5 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/fleet/excavator.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/90 to-stone-950" />

      <div className="relative mx-auto w-full max-w-lg border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          New client
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white">
          Open a rental account
        </h1>
        <p className="mt-3 text-sm text-white/65">
          Register once, then request excavators, loaders, graders, and Howo
          trucks anytime.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-white/55">
              Full name
            </span>
            <input
              name="name"
              required
              className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-white/55">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/55">
              Phone
            </span>
            <input
              name="phone"
              required
              className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/55">
              Company
            </span>
            <input
              name="company"
              className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-white/55">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </label>
          {error && (
            <p className="sm:col-span-2 text-sm text-red-300">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 w-full rounded-sm bg-amber-400 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/60">
          Already registered?{" "}
          <Link href="/login" className="text-amber-300 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
