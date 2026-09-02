"use client";

import { useState } from "react";

export function GoLiveControl({
  published,
  envLocked,
}: {
  published: boolean;
  envLocked: boolean;
}) {
  const [live, setLive] = useState(published);
  const [status, setStatus] = useState("");

  async function toggle(next: boolean) {
    setStatus("");
    const res = await fetch("/api/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sitePublished: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Could not update");
      return;
    }
    setLive(next);
    setStatus(next ? "Website is now public on this server." : "Website is hidden from the public.");
  }

  return (
    <div className="space-y-6">
      <div
        className={`border px-5 py-4 text-sm ${
          live
            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
            : "border-amber-400/40 bg-amber-400/10 text-amber-100"
        }`}
      >
        Current status:{" "}
        <strong>{live ? "PUBLIC / LIVE" : "HIDDEN — private preview"}</strong>
        {envLocked
          ? " (Vercel environment is currently forcing this state until you change SITE_PUBLISHED.)"
          : ""}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toggle(true)}
          className="rounded-sm bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
        >
          Make website live
        </button>
        <button
          type="button"
          onClick={() => toggle(false)}
          className="border border-white/20 px-6 py-3 text-sm text-white hover:bg-white/5"
        >
          Hide from public
        </button>
      </div>
      {status && <p className="text-sm text-amber-200">{status}</p>}

      <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-white/70">
        <li>
          For this computer / local preview, click <strong>Make website live</strong>{" "}
          above.
        </li>
        <li>
          For the internet (Vercel), open{" "}
          <a
            className="text-amber-300 underline"
            href="https://vercel.com/ishimwe0427-1380s-projects/axle-fleetrent"
            target="_blank"
            rel="noreferrer"
          >
            Vercel → axle-fleetrent
          </a>
          .
        </li>
        <li>
          Go to <strong>Settings → Environment Variables</strong> and set{" "}
          <code className="text-white">SITE_PUBLISHED</code> to{" "}
          <code className="text-white">true</code>.
        </li>
        <li>
          Open <strong>Deployments</strong> and click <strong>Redeploy</strong> on
          the latest production deployment. After that, the public site is live.
        </li>
      </ol>
    </div>
  );
}
