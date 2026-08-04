"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { GalleryCategory } from "@/lib/types";

export function AdminGalleryManager({
  initialCategories,
}: {
  initialCategories: GalleryCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState(initialCategories[0]?.id || "");
  const selected = categories.find((c) => c.id === selectedId);
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

  async function save(category: GalleryCategory) {
    setMessage("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === data.category.id);
      return exists
        ? prev.map((c) => (c.id === data.category.id ? data.category : c))
        : [...prev, data.category];
    });
    setSelectedId(data.category.id);
    setMessage("Category saved.");
  }

  async function onCoverUpload(file: File | null) {
    if (!file || !selected) return;
    setUploading(true);
    try {
      const url = await upload(file);
      await save({
        ...selected,
        coverImage: url,
        images: selected.images.includes(url)
          ? selected.images
          : [url, ...selected.images],
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onAddImage(file: File | null) {
    if (!file || !selected) return;
    setUploading(true);
    try {
      const url = await upload(file);
      await save({
        ...selected,
        images: [...selected.images, url],
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    if (!selected) return;
    const images = selected.images.filter((img) => img !== url);
    if (images.length === 0) {
      setMessage("Keep at least one image.");
      return;
    }
    void save({
      ...selected,
      coverImage:
        selected.coverImage === url ? images[0] : selected.coverImage,
      images,
      updatedAt: new Date().toISOString(),
    });
  }

  function onSaveDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const form = new FormData(e.currentTarget);
    void save({
      ...selected,
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      description: String(form.get("description")),
      updatedAt: new Date().toISOString(),
    });
  }

  function createCategory() {
    const slug = `category-${Date.now()}`;
    void save({
      id: `cat_${Date.now()}`,
      slug,
      name: "New Category",
      description: "Describe this machine category.",
      coverImage: "/fleet/excavator.png",
      images: ["/fleet/excavator.png"],
      updatedAt: new Date().toISOString(),
    });
  }

  async function removeCategory(id: string) {
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMessage("Could not delete category");
      return;
    }
    const next = categories.filter((c) => c.id !== id);
    setCategories(next);
    setSelectedId(next[0]?.id || "");
    setMessage("Category deleted.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-2">
        <button
          onClick={createCategory}
          className="mb-3 w-full rounded-sm border border-amber-400/40 px-3 py-2 text-sm text-amber-300"
        >
          + Add category
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedId(category.id);
              setMessage("");
            }}
            className={`block w-full border px-3 py-3 text-left text-sm ${
              selectedId === category.id
                ? "border-amber-400 bg-amber-400/10"
                : "border-white/10 hover:border-white/25"
            }`}
          >
            {category.name}
          </button>
        ))}
      </aside>

      {selected && (
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden border border-white/10">
            <Image
              src={selected.coverImage}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="60vw"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer rounded-sm bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950">
              {uploading ? "Uploading…" : "Change cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onCoverUpload(e.target.files?.[0] || null)}
              />
            </label>
            <label className="cursor-pointer rounded-sm border border-amber-400/50 px-4 py-2.5 text-sm text-amber-300">
              Add gallery photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAddImage(e.target.files?.[0] || null)}
              />
            </label>
            <button
              onClick={() => removeCategory(selected.id)}
              className="rounded-sm border border-white/20 px-4 py-2.5 text-sm text-white/70"
            >
              Delete category
            </button>
          </div>

          <form onSubmit={onSaveDetails} className="grid gap-4 sm:grid-cols-2">
            <label className="block">
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
                Slug
              </span>
              <input
                name="slug"
                defaultValue={selected.slug}
                key={`${selected.id}-slug`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Description
              </span>
              <textarea
                name="description"
                rows={3}
                defaultValue={selected.description}
                key={`${selected.id}-desc`}
                className="mt-2 w-full border border-white/15 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 rounded-sm bg-amber-400 py-3 text-sm font-semibold text-stone-950"
            >
              Save category details
            </button>
          </form>

          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-amber-300">
              Gallery images
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {selected.images.map((image) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden border border-white/10"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <button
                    onClick={() => removeImage(image)}
                    className="absolute right-2 top-2 bg-stone-950/80 px-2 py-1 text-xs text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && <p className="text-sm text-amber-200">{message}</p>}
        </div>
      )}
    </div>
  );
}
