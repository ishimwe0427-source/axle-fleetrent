"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { FleetItem } from "@/lib/types";
import { formatRwf } from "@/lib/db-client";

export function AdminFleetManager({
  initialFleet,
}: {
  initialFleet: FleetItem[];
}) {
  const [fleet, setFleet] = useState(initialFleet);
  const [selectedId, setSelectedId] = useState(initialFleet[0]?.id || "");
  const selected = fleet.find((f) => f.id === selectedId);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onUpload(file: File | null) {
    if (!file || !selected) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      const updated = { ...selected, image: url, updatedAt: new Date().toISOString() };
      const res = await fetch("/api/fleet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setFleet((prev) => prev.map((f) => (f.id === updated.id ? data.fleet : f)));
      setMessage("Image uploaded and saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setMessage("");
    const form = new FormData(e.currentTarget);
    const updated: FleetItem = {
      ...selected,
      name: String(form.get("name")),
      category: String(form.get("category")),
      tagline: String(form.get("tagline")),
      description: String(form.get("description")),
      dailyRate: Number(form.get("dailyRate")),
      weeklyRate: Number(form.get("weeklyRate")),
      monthlyRate: Number(form.get("monthlyRate")),
      available: form.get("available") === "on",
      featured: form.get("featured") === "on",
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch("/api/fleet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setFleet((prev) => prev.map((f) => (f.id === updated.id ? data.fleet : f)));
    setMessage("Fleet item saved.");
  }

  async function onCreate() {
    const slug = `machine-${Date.now()}`;
    const item: FleetItem = {
      id: `fleet_${Date.now()}`,
      slug,
      name: "New Machine",
      category: "Earthmoving",
      tagline: "Describe the machine in one line.",
      description: "Add a full description for clients browsing this equipment.",
      image: "/fleet/excavator.png",
      dailyRate: 200000,
      weeklyRate: 1200000,
      monthlyRate: 4000000,
      available: true,
      featured: false,
      specs: [
        { label: "Spec", value: "Value" },
        { label: "Spec", value: "Value" },
      ],
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/fleet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Could not create");
      return;
    }
    setFleet((prev) => [...prev, data.fleet]);
    setSelectedId(data.fleet.id);
    setMessage("New machine created.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-2">
        <button
          onClick={onCreate}
          className="mb-4 w-full rounded-sm border border-amber-400/40 px-3 py-2 text-sm text-amber-300 hover:bg-amber-400/10"
        >
          + Add machine
        </button>
        {fleet.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setMessage("");
            }}
            className={`block w-full border px-3 py-3 text-left text-sm ${
              selectedId === item.id
                ? "border-amber-400 bg-amber-400/10"
                : "border-white/10 hover:border-white/25"
            }`}
          >
            <span className="font-medium">{item.name}</span>
            <span className="mt-1 block text-xs text-white/45">
              {formatRwf(item.dailyRate)} ref/day
            </span>
          </button>
        ))}
      </aside>

      {selected && (
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden border border-white/10 bg-stone-900">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 60vw"
            />
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-sm bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-300">
            {uploading ? "Uploading…" : "Upload new picture"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUpload(e.target.files?.[0] || null)}
            />
          </label>

          <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Name
              </span>
              <input
                name="name"
                defaultValue={selected.name}
                key={`${selected.id}-name`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Category
              </span>
              <input
                name="category"
                defaultValue={selected.category}
                key={`${selected.id}-category`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Internal daily guide (RWF)
              </span>
              <input
                name="dailyRate"
                type="number"
                defaultValue={selected.dailyRate}
                key={`${selected.id}-daily`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Internal weekly guide
              </span>
              <input
                name="weeklyRate"
                type="number"
                defaultValue={selected.weeklyRate}
                key={`${selected.id}-weekly`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Internal monthly guide
              </span>
              <input
                name="monthlyRate"
                type="number"
                defaultValue={selected.monthlyRate}
                key={`${selected.id}-monthly`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Tagline
              </span>
              <input
                name="tagline"
                defaultValue={selected.tagline}
                key={`${selected.id}-tagline`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Description
              </span>
              <textarea
                name="description"
                rows={5}
                defaultValue={selected.description}
                key={`${selected.id}-desc`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="available"
                defaultChecked={selected.available}
                key={`${selected.id}-avail`}
              />
              Available (auto-updates when bookings are approved/active/completed)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={selected.featured}
                key={`${selected.id}-feat`}
              />
              Featured on homepage
            </label>
            <button
              type="submit"
              className="sm:col-span-2 rounded-sm bg-amber-400 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
            >
              Save changes
            </button>
          </form>

          {message && <p className="text-sm text-amber-200">{message}</p>}
        </div>
      )}
    </div>
  );
}
