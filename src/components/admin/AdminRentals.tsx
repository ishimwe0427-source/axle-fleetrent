"use client";

import { useState } from "react";
import type { RentalStatus } from "@/lib/types";

type Row = {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  machineName: string;
  startDate: string;
  endDate: string;
  location: string;
  notes: string;
  status: RentalStatus;
  createdAt: string;
  emailStatus?: "sent" | "failed" | "skipped";
};

const statuses: RentalStatus[] = [
  "pending",
  "approved",
  "active",
  "completed",
  "rejected",
];

export function AdminRentals({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [message, setMessage] = useState("");

  async function updateStatus(id: string, status: RentalStatus) {
    setMessage("");
    const res = await fetch("/api/rentals/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Update failed");
      return;
    }
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    setMessage(
      status === "approved" || status === "active"
        ? `Updated → ${status}. Machine is now unavailable for new bookings.`
        : status === "completed" || status === "rejected"
          ? `Updated → ${status}. Machine availability refreshed.`
          : `Updated ${id} → ${status}`,
    );
  }

  if (rows.length === 0) {
    return (
      <p className="border border-white/10 px-5 py-10 text-center text-white/50">
        No rental requests yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        <strong>Availability rule:</strong> set a booking to{" "}
        <span className="font-semibold">approved</span> or{" "}
        <span className="font-semibold">active</span> while the machine is on
        site — it becomes unavailable for new bookings. Set it to{" "}
        <span className="font-semibold">completed</span> or{" "}
        <span className="font-semibold">rejected</span> to free the machine
        again.
      </div>
      {rows.map((row) => (
        <article
          key={row.id}
          className="border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-amber-300">
                {row.machineName}
              </h3>
              <p className="mt-2 text-sm text-white/75">
                {row.userName} · {row.userEmail}
                {row.userPhone ? ` · ${row.userPhone}` : ""}
              </p>
              <p className="mt-1 text-sm text-white/55">
                {row.startDate} → {row.endDate} · {row.location}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">
                Confirmation email: {row.emailStatus || "pending"}
              </p>
              {row.notes && (
                <p className="mt-3 text-sm text-white/65">{row.notes}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(row.id, status)}
                  className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider ${
                    row.status === status
                      ? "bg-amber-400 text-stone-950"
                      : "border border-white/15 text-white/70 hover:border-white/40"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
      {message && <p className="text-sm text-amber-200">{message}</p>}
    </div>
  );
}
