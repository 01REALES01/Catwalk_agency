"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  toggleModelApproval,
  toggleModelFeatured,
} from "@/app/actions/admin";
import type { ModelProfile } from "@/types/database";

type Tab = "all" | "pending" | "approved" | "featured";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Models" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "featured", label: "Featured" },
];

function ProfileBar({ m }: { m: ModelProfile }) {
  const fields = [m.nombre, m.altura, m.color_ojos, m.medidas, m.bio_profesional, m.foto_url];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden bg-outline-variant/20">
        <div
          className={`h-full transition-all ${pct === 100 ? "bg-green-600" : pct >= 50 ? "bg-secondary" : "bg-red-500/60"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-label text-[0.5rem] uppercase tracking-widest opacity-40">
        {pct}%
      </span>
    </div>
  );
}

export function AdminTalentTable({ models }: { models: ModelProfile[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return models.filter((m) => {
      if (needle && !m.nombre.toLowerCase().includes(needle)) return false;
      if (tab === "pending") return !m.approved;
      if (tab === "approved") return m.approved;
      if (tab === "featured") return m.featured;
      return true;
    });
  }, [models, q, tab]);

  function handleToggle(
    action: "approve" | "feature",
    modelId: string,
    value: boolean,
  ) {
    startTransition(async () => {
      if (action === "approve") {
        await toggleModelApproval(modelId, value);
      } else {
        await toggleModelFeatured(modelId, value);
      }
    });
  }

  return (
    <>
      <div className="mb-8 flex items-baseline justify-between md:mb-12">
        <h2 className="font-headline text-2xl font-black uppercase tracking-tighter md:text-4xl">
          Models
        </h2>
        <span className="font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
          {models.length} total
        </span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-outline-variant/20 pb-6 md:flex-row md:items-center">
        <div className="hide-scrollbar flex w-full gap-6 overflow-x-auto md:w-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "whitespace-nowrap border-b-2 border-primary pb-2 font-label text-[0.625rem] uppercase tracking-widest"
                  : "whitespace-nowrap pb-2 font-label text-[0.625rem] uppercase tracking-widest opacity-40 transition-opacity hover:opacity-100"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-sm opacity-40">
            search
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search models..."
            className="w-full border-0 border-b-2 border-outline-variant/20 bg-transparent py-2 pl-8 font-label text-[0.625rem] uppercase tracking-widest placeholder:opacity-30 focus:border-secondary focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className={`space-y-3 ${isPending ? "opacity-60" : ""}`}>
        {rows.map((m) => {
          const isExpanded = expandedId === m.user_id;
          return (
            <div key={m.user_id} className="border border-outline-variant/15 transition-colors hover:bg-surface-container-low/50">
              {/* Main row */}
              <div
                className="flex cursor-pointer items-center gap-4 p-4 md:p-5"
                onClick={() => setExpandedId(isExpanded ? null : m.user_id)}
              >
                {/* Photo */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-surface-container-high md:h-14 md:w-14">
                  {m.foto_url ? (
                    <Image
                      src={m.foto_url}
                      alt={m.nombre}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary/15">
                      <span className="material-symbols-outlined text-xl">person</span>
                    </div>
                  )}
                </div>

                {/* Name + status */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-headline text-sm font-bold uppercase tracking-tight">
                      {m.nombre}
                    </h4>
                    {m.featured ? (
                      <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {m.approved ? (
                      <span className="inline-block bg-green-600/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-green-700">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block bg-yellow-500/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-yellow-700">
                        Pending
                      </span>
                    )}
                    <ProfileBar m={m} />
                  </div>
                </div>

                {/* Quick info (desktop) */}
                <div className="hidden items-center gap-6 md:flex">
                  <div className="text-right">
                    <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Height</p>
                    <p className="font-headline text-xs font-bold">{m.altura ? `${m.altura} cm` : "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Measures</p>
                    <p className="font-headline text-xs font-bold">{m.medidas ?? "—"}</p>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={m.approved}
                      aria-label="Approve"
                      onClick={() => handleToggle("approve", m.user_id, !m.approved)}
                      className={`relative flex h-5 w-9 items-center px-0.5 transition-colors ${m.approved ? "bg-green-600" : "bg-outline-variant/40"}`}
                    >
                      <span className={`h-3.5 w-3.5 bg-white transition-all ${m.approved ? "ml-auto" : ""}`} />
                    </button>
                    <span className="font-label text-[7px] uppercase tracking-widest opacity-30">Approve</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={m.featured}
                      aria-label="Feature"
                      onClick={() => handleToggle("feature", m.user_id, !m.featured)}
                      className={`relative flex h-5 w-9 items-center px-0.5 transition-colors ${m.featured ? "bg-secondary" : "bg-outline-variant/40"}`}
                    >
                      <span className={`h-3.5 w-3.5 bg-white transition-all ${m.featured ? "ml-auto" : ""}`} />
                    </button>
                    <span className="font-label text-[7px] uppercase tracking-widest opacity-30">Feature</span>
                  </div>
                </div>

                {/* Expand icon */}
                <span className={`material-symbols-outlined text-lg text-primary/30 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </div>

              {/* Expanded detail */}
              {isExpanded ? (
                <div className="border-t border-outline-variant/10 bg-surface-container-low/50 p-5 md:p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr]">
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-[160px] overflow-hidden bg-surface-container-high md:mx-0">
                      {m.foto_url ? (
                        <Image src={m.foto_url} alt={m.nombre} fill sizes="160px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary/15">
                          <span className="material-symbols-outlined text-3xl">person</span>
                          <span className="font-label text-[0.5rem] uppercase tracking-widest">No photo</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Height</p>
                          <p className="mt-0.5 font-headline text-sm font-bold">{m.altura ? `${m.altura} cm` : "—"}</p>
                        </div>
                        <div>
                          <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Eyes</p>
                          <p className="mt-0.5 font-headline text-sm font-bold">{m.color_ojos ?? "—"}</p>
                        </div>
                        <div>
                          <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Measurements</p>
                          <p className="mt-0.5 font-headline text-sm font-bold">{m.medidas ?? "—"}</p>
                        </div>
                        <div>
                          <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Status</p>
                          <p className="mt-0.5 font-headline text-sm font-bold">
                            {m.approved ? "Approved" : "Pending"}{m.featured ? " · Featured" : ""}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 font-label text-[0.5rem] uppercase tracking-widest opacity-35">Biography</p>
                        {m.bio_profesional ? (
                          <p className="max-w-2xl font-body text-sm leading-relaxed text-on-surface/70">{m.bio_profesional}</p>
                        ) : (
                          <p className="font-body text-sm italic text-primary/25">No bio yet.</p>
                        )}
                      </div>
                      <Link
                        href={`/model/${m.user_id}`}
                        className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-label text-[0.5625rem] uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        View public profile
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
        {rows.length === 0 ? (
          <p className="py-12 text-center font-body text-sm text-primary/40">
            No models match this filter.
          </p>
        ) : null}
      </div>
    </>
  );
}
