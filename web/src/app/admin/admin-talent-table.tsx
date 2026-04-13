"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  toggleModelApproval,
  toggleModelFeatured,
} from "@/app/actions/admin";
import type { ModelProfile } from "@/types/database";

type Tab = "all" | "pending" | "featured" | "clients";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Talent" },
  { id: "pending", label: "Pending Review" },
  { id: "featured", label: "Featured" },
  { id: "clients", label: "Clients" },
];

function ProfileCompleteness({ m }: { m: ModelProfile }) {
  const fields = [m.nombre, m.altura, m.color_ojos, m.medidas, m.bio_profesional, m.foto_url];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden bg-outline-variant/20">
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
      if (tab === "pending") return m.role !== "client" && !m.approved;
      if (tab === "featured") return m.featured;
      if (tab === "clients") return m.role === "client";
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
      <section className="mb-16 flex flex-col items-center justify-between gap-8 border-b border-outline-variant/20 py-6 md:flex-row">
        <div className="hide-scrollbar flex w-full gap-8 overflow-x-auto md:w-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "whitespace-nowrap border-b-2 border-primary pb-2 font-label text-[0.6875rem] uppercase tracking-widest"
                  : "whitespace-nowrap pb-2 font-label text-[0.6875rem] uppercase tracking-widest opacity-40 transition-opacity hover:opacity-100"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="group relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-sm opacity-40">
            search
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SEARCH DATABASE..."
            className="w-full border-0 border-b-2 border-outline-variant/20 bg-transparent py-2 pl-8 font-label text-[0.6875rem] uppercase tracking-widest placeholder:opacity-30 focus:border-secondary focus:outline-none focus:ring-0"
          />
        </div>
      </section>

      <section className={`hide-scrollbar overflow-x-auto ${isPending ? "opacity-60" : ""}`}>
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/10 font-label text-[0.625rem] uppercase tracking-[0.2em] opacity-40">
              <th className="px-4 pb-6">Talent</th>
              <th className="px-4 pb-6">Info</th>
              <th className="px-4 pb-6">Profile</th>
              <th className="px-4 pb-6">Status</th>
              <th className="px-4 pb-6 text-right">Approve</th>
              <th className="px-4 pb-6 text-right">Feature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((m) => {
              const isExpanded = expandedId === m.user_id;
              const isModel = m.role !== "client";
              return (
                <tr
                  key={m.user_id}
                  className="group cursor-pointer transition-colors hover:bg-surface-container-low"
                  onClick={() => setExpandedId(isExpanded ? null : m.user_id)}
                >
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-surface-container-high">
                        {m.foto_url ? (
                          <Image
                            src={m.foto_url}
                            alt={m.nombre}
                            fill
                            sizes="56px"
                            className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary/20">
                            <span className="material-symbols-outlined text-xl">person</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-headline text-sm font-bold uppercase tracking-tight text-primary">
                          {m.nombre}
                        </h4>
                        <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-40">
                          {m.role === "client" ? "CLIENT" : !m.approved ? "APPLICANT" : "MODEL"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    {isModel ? (
                      <div className="space-y-1">
                        {m.altura ? (
                          <span className="block font-label text-[0.5625rem] uppercase tracking-widest opacity-50">
                            {m.altura} cm
                          </span>
                        ) : null}
                        {m.medidas ? (
                          <span className="block font-label text-[0.5625rem] uppercase tracking-widest opacity-50">
                            {m.medidas}
                          </span>
                        ) : null}
                        {m.color_ojos ? (
                          <span className="block font-label text-[0.5rem] uppercase tracking-widest opacity-35">
                            {m.color_ojos}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="font-label text-[0.5rem] uppercase tracking-widest opacity-30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-6">
                    <div className="space-y-2">
                      <ProfileCompleteness m={m} />
                      <div className="flex gap-2">
                        {m.foto_url ? (
                          <span className="inline-block bg-green-600/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-green-700">Photo</span>
                        ) : (
                          <span className="inline-block bg-red-500/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-red-500">No photo</span>
                        )}
                        {m.bio_profesional ? (
                          <span className="inline-block bg-green-600/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-green-700">Bio</span>
                        ) : (
                          <span className="inline-block bg-red-500/10 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest text-red-500">No bio</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    {m.approved ? (
                      <span className="inline-block bg-surface-container-highest px-3 py-1 font-label text-[0.5rem] uppercase tracking-widest">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block bg-secondary/10 px-3 py-1 font-label text-[0.5rem] uppercase tracking-widest text-secondary">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={m.approved}
                      onClick={() =>
                        handleToggle("approve", m.user_id, !m.approved)
                      }
                      className={`relative flex h-5 w-10 cursor-pointer items-center px-1 transition-colors ${m.approved ? "bg-secondary" : "bg-outline-variant/40 hover:bg-secondary/40"}`}
                    >
                      <span
                        className={`h-3 w-3 bg-white transition-all ${m.approved ? "ml-auto" : ""}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-2">
                      {m.featured ? (
                        <span className="material-symbols-outlined text-sm text-secondary">star</span>
                      ) : null}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={m.featured}
                        onClick={() =>
                          handleToggle("feature", m.user_id, !m.featured)
                        }
                        className={`relative flex h-5 w-10 cursor-pointer items-center px-1 transition-colors ${m.featured ? "bg-primary" : "bg-outline-variant/40"}`}
                      >
                        <span
                          className={`h-3 w-3 bg-white transition-all ${m.featured ? "ml-auto" : ""}`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center font-body text-sm text-primary opacity-40"
                >
                  No talent matches this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {/* Expanded detail panel */}
      {expandedId ? (
        <DetailPanel
          model={models.find((m) => m.user_id === expandedId)!}
          onClose={() => setExpandedId(null)}
        />
      ) : null}
    </>
  );
}

function DetailPanel({ model: m, onClose }: { model: ModelProfile; onClose: () => void }) {
  return (
    <div className="mt-4 mb-8 border border-outline-variant/20 bg-surface-container-low">
      <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
        <h3 className="font-headline text-sm font-bold uppercase tracking-widest">
          {m.nombre} — Full Profile
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="material-symbols-outlined text-lg opacity-40 transition-opacity hover:opacity-100"
        >
          close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[200px_1fr]">
        {/* Photo */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden bg-surface-container-high md:mx-0">
          {m.foto_url ? (
            <Image
              src={m.foto_url}
              alt={m.nombre}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary/15">
              <span className="material-symbols-outlined text-4xl">person</span>
              <span className="font-label text-[0.5rem] uppercase tracking-widest">No photo</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Measurements grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoItem label="Height" value={m.altura ? `${m.altura} cm` : "—"} />
            <InfoItem label="Eyes" value={m.color_ojos ?? "—"} />
            <InfoItem label="Measurements" value={m.medidas ?? "—"} />
            <InfoItem label="Role" value={(m.role ?? "model").toUpperCase()} />
          </div>

          {/* Bio */}
          <div>
            <p className="mb-1 font-label text-[0.5625rem] uppercase tracking-widest opacity-40">
              Biography
            </p>
            {m.bio_profesional ? (
              <p className="max-w-2xl font-body text-sm leading-relaxed text-on-surface/75">
                {m.bio_profesional}
              </p>
            ) : (
              <p className="font-body text-sm italic text-primary/30">No biography yet.</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 pt-2">
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
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">{label}</p>
      <p className="mt-1 font-headline text-sm font-bold">{value}</p>
    </div>
  );
}
