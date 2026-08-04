"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { SiteContent } from "@/lib/types";

export function AdminContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onHeroUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await upload(file);
      const next = { ...content, heroImage: url };
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImage: url }),
      });
      if (!res.ok) throw new Error("Could not save hero image");
      setContent(next);
      setMessage("Hero image updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onAboutUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await upload(file);
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutImage: url }),
      });
      if (!res.ok) throw new Error("Could not save about image");
      setContent((c) => ({ ...c, aboutImage: url }));
      setMessage("About image updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const patch = {
      heroTitle: String(form.get("heroTitle")),
      heroSubtitle: String(form.get("heroSubtitle")),
      aboutTitle: String(form.get("aboutTitle")),
      aboutBody: String(form.get("aboutBody")),
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      address: String(form.get("address")),
      tagline: String(form.get("tagline")),
    };
    const res = await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setContent(data.content);
    setMessage("Content saved.");
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="relative aspect-video overflow-hidden border border-white/10">
            <Image
              src={content.heroImage}
              alt="Hero"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <label className="mt-3 inline-flex cursor-pointer rounded-sm bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950">
            {uploading ? "Uploading…" : "Change hero image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onHeroUpload(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        <div>
          <div className="relative aspect-video overflow-hidden border border-white/10">
            <Image
              src={content.aboutImage}
              alt="About"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <label className="mt-3 inline-flex cursor-pointer rounded-sm border border-amber-400/50 px-4 py-2 text-sm text-amber-300">
            Change about image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAboutUpload(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        {(
          [
            ["heroTitle", "Hero title", content.heroTitle],
            ["heroSubtitle", "Hero subtitle", content.heroSubtitle],
            ["aboutTitle", "About title", content.aboutTitle],
            ["tagline", "Footer tagline", content.tagline],
            ["phone", "Phone", content.phone],
            ["email", "Email", content.email],
            ["address", "Address", content.address],
          ] as const
        ).map(([name, label, value]) => (
          <label key={name} className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">
              {label}
            </span>
            <input
              name={name}
              defaultValue={value}
              className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
            />
          </label>
        ))}
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/50">
            About body
          </span>
          <textarea
            name="aboutBody"
            rows={6}
            defaultValue={content.aboutBody}
            className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-sm bg-amber-400 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
        >
          Save content
        </button>
      </form>
      {message && <p className="text-sm text-amber-200">{message}</p>}
    </div>
  );
}
