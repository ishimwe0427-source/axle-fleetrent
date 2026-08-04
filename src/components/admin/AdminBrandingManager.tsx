"use client";

import { FormEvent, useState } from "react";
import type { Branding, NavItem } from "@/lib/types";

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

export function AdminBrandingManager({ initial }: { initial: Branding }) {
  const [form, setForm] = useState<Branding>(initial);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof Branding>(key: K, value: Branding[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateNav(index: number, patch: Partial<NavItem>) {
    setForm((prev) => ({
      ...prev,
      navItems: prev.navItems.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addNav() {
    setForm((prev) => ({
      ...prev,
      navItems: [
        ...prev.navItems,
        {
          id: `nav_${Date.now()}`,
          label: "New tab",
          href: "/",
          enabled: true,
        },
      ],
    }));
  }

  function removeNav(index: number) {
    setForm((prev) => ({
      ...prev,
      navItems: prev.navItems.filter((_, i) => i !== index),
    }));
  }

  async function onUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "favicon",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setField(field, url);
      setStatus(`${field} uploaded`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setStatus(data.error || "Save failed");
      return;
    }
    setForm(data.branding);
    setStatus("Branding saved. Refresh the public site to see changes.");
  }

  const input =
    "mt-2 w-full border border-white/15 bg-stone-950/50 px-4 py-3 text-white outline-none focus:border-amber-400";

  return (
    <form onSubmit={onSave} className="space-y-10">
      <section className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Company name
          </span>
          <input
            className={input}
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Legal name
          </span>
          <input
            className={input}
            value={form.legalName}
            onChange={(e) => setField("legalName", e.target.value)}
            required
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Tagline
          </span>
          <input
            className={input}
            value={form.tagline}
            onChange={(e) => setField("tagline", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Region label
          </span>
          <input
            className={input}
            value={form.regionLabel}
            onChange={(e) => setField("regionLabel", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            CTA button label
          </span>
          <input
            className={input}
            value={form.ctaLabel}
            onChange={(e) => setField("ctaLabel", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Support email
          </span>
          <input
            type="email"
            className={input}
            value={form.supportEmail}
            onChange={(e) => setField("supportEmail", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Support phone
          </span>
          <input
            className={input}
            value={form.supportPhone}
            onChange={(e) => setField("supportPhone", e.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Footer text
          </span>
          <textarea
            className={input}
            rows={3}
            value={form.footerText}
            onChange={(e) => setField("footerText", e.target.value)}
          />
        </label>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Logo
          </p>
          <div className="mt-2 flex items-center gap-4 border border-white/10 bg-white/5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.logo}
              alt="Logo preview"
              style={{ height: form.logoHeight }}
              className="w-auto object-contain"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(e, "logo")}
              className="text-sm text-white/70"
            />
          </div>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-wider text-white/50">
              Logo height (px): {form.logoHeight}
            </span>
            <input
              type="range"
              min={28}
              max={80}
              value={form.logoHeight}
              onChange={(e) => setField("logoHeight", Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Favicon
          </p>
          <div className="mt-2 flex items-center gap-4 border border-white/10 bg-white/5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.favicon} alt="Favicon" className="h-10 w-10" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(e, "favicon")}
              className="text-sm text-white/70"
            />
          </div>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Primary color
          </span>
          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setField("primaryColor", e.target.value)}
              className="h-12 w-16 border border-white/15 bg-transparent"
            />
            <input
              className={input + " mt-0"}
              value={form.primaryColor}
              onChange={(e) => setField("primaryColor", e.target.value)}
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            Accent color
          </span>
          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => setField("accentColor", e.target.value)}
              className="h-12 w-16 border border-white/15 bg-transparent"
            />
            <input
              className={input + " mt-0"}
              value={form.accentColor}
              onChange={(e) => setField("accentColor", e.target.value)}
            />
          </div>
        </label>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-amber-300">
            Navigation tabs
          </h2>
          <button
            type="button"
            onClick={addNav}
            className="border border-white/20 px-3 py-2 text-xs text-white/80 hover:bg-white/5"
          >
            Add tab
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {form.navItems.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <input
                className={input + " mt-0"}
                value={item.label}
                onChange={(e) => updateNav(index, { label: e.target.value })}
                placeholder="Label"
              />
              <input
                className={input + " mt-0"}
                value={item.href}
                onChange={(e) => updateNav(index, { href: e.target.value })}
                placeholder="/path"
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    updateNav(index, { enabled: e.target.checked })
                  }
                />
                Enabled
              </label>
              <button
                type="button"
                onClick={() => removeNav(index)}
                className="text-sm text-red-300 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-6">
        {(
          [
            ["showTeam", "Show team section"],
            ["showGallery", "Show category galleries"],
            ["showChat", "Show support chat"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-white/75">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => setField(key, e.target.checked)}
            />
            {label}
          </label>
        ))}
      </section>

      {status && <p className="text-sm text-amber-200">{status}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-sm bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save white-label branding"}
      </button>
    </form>
  );
}
