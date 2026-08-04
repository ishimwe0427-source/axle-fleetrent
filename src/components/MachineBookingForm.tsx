"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { FleetItem } from "@/lib/types";

export function MachineBookingForm({
  machine,
  isLoggedIn,
}: {
  machine: FleetItem;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!machine.available) return;
    if (!isLoggedIn) {
      router.push(`/login?next=/fleet/${machine.slug}`);
      return;
    }

    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/rentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fleetId: machine.id,
        startDate: form.get("startDate"),
        endDate: form.get("endDate"),
        location: form.get("location"),
        notes: form.get("notes"),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.status === 401) {
      router.push(`/login?next=/fleet/${machine.slug}`);
      return;
    }
    if (!res.ok) {
      setError(data.error || "Could not submit booking");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  if (!machine.available) {
    return (
      <aside className="h-fit border border-stone-200 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-700">
          Booking
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-wide text-stone-900">
          Not available right now
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          This machine is currently booked and working on a site. Once that hire
          is completed in admin, it will show as available again.
        </p>
        <Link
          href="/fleet"
          className="mt-6 inline-flex rounded-sm border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
        >
          Browse other machines
        </Link>
      </aside>
    );
  }

  return (
    <aside className="h-fit border border-stone-200 bg-white p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-700">
        Book this machine
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-wide text-stone-900">
        Request a hire
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Prices are negotiated per project. Send your dates and site details —
        AXLE will confirm availability and quote.
      </p>

      {!isLoggedIn && (
        <p className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          You need an account to book.{" "}
          <Link
            href={`/login?next=/fleet/${machine.slug}`}
            className="font-semibold underline"
          >
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold underline">
            register
          </Link>
          .
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Start date
            </span>
            <input
              name="startDate"
              type="date"
              required
              className="mt-2 w-full border border-stone-200 px-3 py-2.5 outline-none focus:border-amber-400"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              End date
            </span>
            <input
              name="endDate"
              type="date"
              required
              className="mt-2 w-full border border-stone-200 px-3 py-2.5 outline-none focus:border-amber-400"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-stone-500">
            Site location
          </span>
          <input
            name="location"
            required
            placeholder="e.g. Kigali, Musanze quarry"
            className="mt-2 w-full border border-stone-200 px-3 py-2.5 outline-none focus:border-amber-400"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-stone-500">
            Project notes
          </span>
          <textarea
            name="notes"
            rows={4}
            placeholder="Work type, operator needed, access notes, budget talk…"
            className="mt-2 w-full border border-stone-200 px-3 py-2.5 outline-none focus:border-amber-400"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="text-sm text-emerald-700">
            Booking request sent. Redirecting to your dashboard…
          </p>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-sm bg-amber-400 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading
            ? "Sending…"
            : isLoggedIn
              ? "Submit booking request"
              : "Log in to book"}
        </button>
        <p className="text-center text-xs text-stone-500">
          Available for booking · Final price negotiated with AXLE
        </p>
      </form>
    </aside>
  );
}
