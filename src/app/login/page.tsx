"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    const dest =
      data.user?.role === "admin" || data.user?.role === "superadmin"
        ? "/admin"
        : next.startsWith("/")
          ? next
          : "/dashboard";
    router.push(dest);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md border border-white/10 bg-white/5 p-8 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
        Client access
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white">
        Log in to rent
      </h1>
      <p className="mt-3 text-sm text-white/65">
        Access your rental dashboard or continue a booking request.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            placeholder="you@company.com"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full border border-white/15 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-400"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-amber-400 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/60">
        New client?{" "}
        <Link href="/register" className="text-amber-300 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100svh-80px)] items-center justify-center bg-stone-950 px-5 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/fleet/hero.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/85 to-stone-950" />
      <div className="relative w-full">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
