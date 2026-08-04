"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { HeroSlide } from "@/lib/types";

export function AdminSlidesManager({
  initialSlides,
}: {
  initialSlides: HeroSlide[];
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  async function upload(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function save(next: HeroSlide[]) {
    setMessage("");
    const res = await fetch("/api/slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setSlides(data.slides);
    setMessage("Hero slides saved.");
  }

  async function onUpload(id: string, file: File | null) {
    if (!file) return;
    setUploading(id);
    try {
      const url = await upload(file);
      const next = slides.map((s) => (s.id === id ? { ...s, image: url } : s));
      await save(next);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function onEdit(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next = slides.map((s) =>
      s.id === id
        ? {
            ...s,
            title: String(form.get("title")),
            subtitle: String(form.get("subtitle")),
          }
        : s,
    );
    void save(next);
  }

  function addSlide() {
    const next = [
      ...slides,
      {
        id: `slide_${Date.now()}`,
        image: "/fleet/excavator.png",
        title: "New slide title",
        subtitle: "Describe this machine slide.",
      },
    ];
    void save(next);
  }

  function removeSlide(id: string) {
    if (slides.length <= 1) {
      setMessage("Keep at least one slide.");
      return;
    }
    void save(slides.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-8">
      <button
        onClick={addSlide}
        className="rounded-sm border border-amber-400/40 px-4 py-2 text-sm text-amber-300 hover:bg-amber-400/10"
      >
        + Add slide
      </button>

      {slides.map((slide, index) => (
        <article
          key={slide.id}
          className="border border-white/10 bg-white/5 p-5"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Slide {index + 1}
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="relative aspect-video overflow-hidden border border-white/10">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <label className="mt-3 inline-flex cursor-pointer rounded-sm bg-amber-400 px-3 py-2 text-sm font-semibold text-stone-950">
                {uploading === slide.id ? "Uploading…" : "Change picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onUpload(slide.id, e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <form
              onSubmit={(e) => onEdit(e, slide.id)}
              className="space-y-3"
            >
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-white/50">
                  Title
                </span>
                <input
                  name="title"
                  defaultValue={slide.title}
                  key={`${slide.id}-title`}
                  className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-white/50">
                  Subtitle
                </span>
                <textarea
                  name="subtitle"
                  rows={3}
                  defaultValue={slide.subtitle}
                  key={`${slide.id}-sub`}
                  className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-sm bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950"
                >
                  Save slide
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  className="rounded-sm border border-white/20 px-4 py-2.5 text-sm text-white/70"
                >
                  Remove
                </button>
              </div>
            </form>
          </div>
        </article>
      ))}

      {message && <p className="text-sm text-amber-200">{message}</p>}
    </div>
  );
}
