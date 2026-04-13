"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  toggleModelApproval,
  toggleModelFeatured,
} from "@/app/actions/admin";
import type { ModelProfile } from "@/types/database";

const THUMB_FALLBACK = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAq9lyrlN102bUgM9J3NPDkjvLbcHXQR4pEhvQVhul2WTPrgtF7w_YN7GjGGTO0sOmrKYsmttMTBvEjO5OfmeVaxFiHUbhjrX86Qef9OSF_IlSt0CSg1xZlsCOd-egpuRuSkrc3xgL-06DcVfRBG6MaYUeYeq9nQfuREJIoYMBBHBw9vOsW_bbbB9T8C2t-29hB-XLw6YBob8HH1uTPRkpqfJivu5wiFlswgvFiLO1EQ-xCxO_Wr9E8JpyivzQ1vfGnXKrPu0Y4sA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0KKtXEdIJ70MFqA34KsW1nK5VVhCMRa6KkWDwyzXjelxb56zUyaqih46RSKE4HuX6sBFMT7RJi1s9htS2Klr1FsCdW2KSNRlsNv73fIB-NncuEIMolE6huxfnSj_k0SiGQWety1H2L9ZU0jemtqojDIvRG13Q2t1B3RcSpADCCBmNdt-etp0evU_I5gltIWMnzhNOB5n88vqKIVK4F3YoG_8LWRvj4Ajx7t0zPj54ao3TPvIETMODZYPrb1cIDfemSQmBJ1ZQeg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9NVbvuN5W3d26SJKdOYeCNY3LnAkCsQ_z2jOMM3RegR71uKPosqkJul2MxEiiHQo16iElCvstsUlhpPdzpSXHnh_xaY9bV3KrmYWOIgnCLw7ZAzuDM_DVZ_1qyHnP7iEsyc1T3PyDlmtEfP8oDCNqRK32KLlAcwRO49STttr8gfv0tGg8xfQ42PAfZS3SK2mDq1iHZKGfXF8mn-nuJoxwHuVG8eou0T_BS7IkUPumgJwwPTpSXgBMsFwsKnUqdL09hwjIXA_TzA",
];

type Tab = "all" | "pending" | "featured";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Talent" },
  { id: "pending", label: "Pending Review" },
  { id: "featured", label: "Featured List" },
];

export function AdminTalentTable({ models }: { models: ModelProfile[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return models.filter((m) => {
      if (needle && !m.nombre.toLowerCase().includes(needle)) return false;
      if (tab === "pending") return !m.approved;
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
        <table className="min-w-[800px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/10 font-label text-[0.625rem] uppercase tracking-[0.2em] opacity-40">
              <th className="px-4 pb-6">Talent Identity</th>
              <th className="px-4 pb-6">Status</th>
              <th className="px-4 pb-6">Portfolio</th>
              <th className="px-4 pb-6 text-right">Approve</th>
              <th className="px-4 pb-6 text-right">Feature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((m, i) => {
              const thumb =
                m.foto_url ?? THUMB_FALLBACK[i % THUMB_FALLBACK.length];
              return (
                <tr
                  key={m.user_id}
                  className="group transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-4 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-surface-container-high">
                        <Image
                          src={thumb}
                          alt={m.nombre}
                          fill
                          sizes="64px"
                          className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                      </div>
                      <div>
                        <h4 className="font-headline text-lg font-bold uppercase tracking-tight text-primary">
                          {m.nombre}
                        </h4>
                        <p className="font-label text-[0.625rem] uppercase tracking-widest opacity-40">
                          {m.role === "client" ? "CLIENT" : !m.approved ? "NEW APPLICANT" : "MODEL"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-8">
                    {m.approved ? (
                      <span className="inline-block bg-surface-container-highest px-3 py-1 font-label text-[0.625rem] uppercase tracking-widest">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block bg-secondary/10 px-3 py-1 font-label text-[0.625rem] uppercase tracking-widest text-secondary">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-8">
                    <Link
                      href={`/model/${m.user_id}`}
                      className="border-b border-primary/20 font-label text-[0.625rem] uppercase tracking-widest transition-colors hover:border-primary"
                    >
                      View Profile
                    </Link>
                  </td>
                  <td className="px-4 py-8 text-right">
                    <div className="inline-flex items-center gap-2">
                      {m.approved ? (
                        <span className="mr-2 font-label text-[0.625rem] uppercase tracking-widest opacity-40">
                          Verified
                        </span>
                      ) : null}
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
                    </div>
                  </td>
                  <td className="px-4 py-8 text-right">
                    <div className="inline-flex items-center gap-2">
                      {m.featured ? (
                        <span className="mr-2 font-label text-[0.625rem] uppercase tracking-widest text-secondary">
                          Featured
                        </span>
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
                  colSpan={5}
                  className="px-4 py-12 text-center font-body text-sm text-primary opacity-40"
                >
                  No talent matches this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
