"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { FleetItem } from "@/lib/types";

export function RentForm({
  fleet,
  initialSlug,
}: {
  fleet: FleetItem[];
  initialSlug?: string;
}) {
  const router = useRouter();
  const availableFleet = fleet.filter((f) => f.available);
  const preferred =
    fleet.find((f) => f.slug === initialSlug && f.available) ||
    availableFleet[0] ||
    fleet[0];
  const [fleetId, setFleetId] = useState(preferred?.id || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = fleet.find((f) => f.id === fleetId);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected && !selected.available) {
      setError("This machine is currently on hire and cannot be booked.");
      return;
    }
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/rentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fleetId,
        startDate: form.get("startDate"),
        endDate: form.get("endDate"),
        location: form.get("location"),
        notes: form.get("notes"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not submit booking");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 border border-white/10 bg-white/5 p-6 md:p-8"
    >
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/55">
          Machine
        </span>
        <select
          value={fleetId}
          onChange={(e) => setFleetId(e.target.value)}
          className="mt-2 w-full border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-400"
        >
          {fleet.map((item) => (
            <option key={item.id} value={item.id} disabled={!item.available}>
              {item.name}
              {item.available ? "" : " — on hire"}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <p className="text-sm text-white/60">
          {selected.tagline}
          {!selected.available && (
            <span className="mt-1 block text-red-300">
              This machine is on site and not available for new bookings.
            </span>
          )}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55">
            Start date
          </span>
          <input
            name="startDate"
            type="date"
            required
            className="mt-2 w-full border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55">
            End date
          </span>
          <input
            name="endDate"
            type="date"
            required
            className="mt-2 w-full border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/55">
          Site location
        </span>
        <input
          name="location"
          required
          placeholder="e.g. Kigali, Musanze quarry"
          className="mt-2 w-full border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/55">
          Notes for negotiation
        </span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Project type, operator needed, duration, budget discussion…"
          className="mt-2 w-full border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </label>

      <p className="text-xs text-white/45">
        Final hire price is negotiated with AXLE after your request.
      </p>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-300">
          Booking submitted. Redirecting to your dashboard…
        </p>
      )}

      <button
        type="submit"
        disabled={loading || success || !selected?.available}
        className="w-full rounded-sm bg-amber-400 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit booking request"}
      </button>
    </form>
  );
}
