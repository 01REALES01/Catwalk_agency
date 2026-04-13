import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

const THUMB_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAq9lyrlN102bUgM9J3NPDkjvLbcHXQR4pEhvQVhul2WTPrgtF7w_YN7GjGGTO0sOmrKYsmttMTBvEjO5OfmeVaxFiHUbhjrX86Qef9OSF_IlSt0CSg1xZlsCOd-egpuRuSkrc3xgL-06DcVfRBG6MaYUeYeq9nQfuREJIoYMBBHBw9vOsW_bbbB9T8C2t-29hB-XLw6YBob8HH1uTPRkpqfJivu5wiFlswgvFiLO1EQ-xCxO_Wr9E8JpyivzQ1vfGnXKrPu0Y4sA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0KKtXEdIJ70MFqA34KsW1nK5VVhCMRa6KkWDwyzXjelxb56zUyaqih46RSKE4HuX6sBFMT7RJi1s9htS2Klr1FsCdW2KSNRlsNv73fIB-NncuEIMolE6huxfnSj_k0SiGQWety1H2L9ZU0jemtqojDIvRG13Q2t1B3RcSpADCCBmNdt-etp0evU_I5gltIWMnzhNOB5n88vqKIVK4F3YoG_8LWRvj4Ajx7t0zPj54ao3TPvIETMODZYPrb1cIDfemSQmBJ1ZQeg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9NVbvuN5W3d26SJKdOYeCNY3LnAkCsQ_z2jOMM3RegR71uKPosqkJul2MxEiiHQo16iElCvstsUlhpPdzpSXHnh_xaY9bV3KrmYWOIgnCLw7ZAzuDM_DVZ_1qyHnP7iEsyc1T3PyDlmtEfP8oDCNqRK32KLlAcwRO49STttr8gfv0tGg8xfQ42PAfZS3SK2mDq1iHZKGfXF8mn-nuJoxwHuVG8eou0T_BS7IkUPumgJwwPTpSXgBMsFwsKnUqdL09hwjIXA_TzA",
];

export const metadata = {
  title: "Admin HQ — Catwalk",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: allProfiles } = await supabase
    .from("model_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const models = (allProfiles as ModelProfile[]) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile TopAppBar */}
      <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between border-b-[0.5px] border-primary/10 bg-surface px-6 py-4 md:hidden">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-headline text-2xl font-black uppercase tracking-tighter text-primary">
            Catwalk
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary/60">notifications</span>
          <form action={signOut}>
            <button type="submit" className="material-symbols-outlined text-primary/60">logout</button>
          </form>
        </div>
      </header>

      {/* Desktop nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 hidden bg-surface md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-12 py-6">
          <Link href="/" className="font-headline text-2xl font-black uppercase tracking-tighter text-primary">
            Catwalk
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity hover:opacity-100"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">Salir</Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-20 md:px-12 md:pb-24 md:pt-32">
        {/* Mobile HQ overview */}
        <section className="mb-8 space-y-6 md:hidden">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary-fixed-dim">HQ Control</p>
              <h2 className="font-headline text-4xl font-black tracking-tighter">Overview</h2>
            </div>
            <p className="font-label text-[10px] font-bold uppercase italic tracking-[0.2em] text-secondary">Live status</p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-outline-variant/20 bg-outline-variant/20">
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">Total models</p>
              <p className="font-headline text-3xl font-bold">{models.length}</p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">Active gigs</p>
              <p className="font-headline text-3xl font-bold">28</p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">Pending apps</p>
              <p className="font-headline text-3xl font-bold text-secondary">12</p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">Revenue MTD</p>
              <p className="font-headline text-3xl font-bold">$84K</p>
            </div>
          </div>
        </section>

        {/* Desktop header + stats */}
        <header className="mb-24 hidden grid-cols-12 items-end gap-8 md:grid">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="mb-4 font-headline text-[5rem] font-black uppercase leading-none tracking-tighter text-primary">
              HQ Control
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.2em] text-primary opacity-60">
              Internal management portal / v2.04
            </p>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5">
            <div className="flex aspect-square flex-col justify-between bg-surface-container-low p-8">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-40">Active models</span>
              <span className="font-headline text-5xl font-bold text-primary">{models.length}</span>
            </div>
            <div className="flex aspect-square flex-col justify-between bg-primary p-8 text-on-primary">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/60">Total profiles</span>
              <span className="font-headline text-5xl font-bold text-white">{models.length}</span>
            </div>
          </div>
        </header>

        {/* Mobile manage talent — card layout */}
        <section className="mb-12 space-y-8 md:hidden">
          <div className="flex items-center justify-between border-b-2 border-primary pb-2">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight">Manage talent</h3>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer text-sm hover:text-secondary">filter_list</span>
              <span className="material-symbols-outlined cursor-pointer text-sm hover:text-secondary">search</span>
            </div>
          </div>
          <div className="space-y-16">
            {models.map((m, i) => {
              const photo = m.foto_url ?? THUMB_PHOTOS[i % THUMB_PHOTOS.length];
              const offset = i % 2 === 1 ? "pl-8" : i % 3 === 2 ? "pr-8" : "";
              return (
                <div key={m.user_id} className={`flex flex-col gap-6 ${offset}`}>
                  <Link href={`/model/${m.user_id}`} className="relative block w-full">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-low">
                      <Image
                        src={photo}
                        alt={m.nombre}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-headline text-2xl font-black uppercase italic tracking-tighter">
                        {m.nombre}
                      </h4>
                      <p className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">
                        {m.altura ? `${m.altura} cm` : "—"} &bull; {m.color_ojos ?? "—"}
                      </p>
                    </div>
                    <Link
                      href={`/model/${m.user_id}`}
                      className="font-label text-[10px] uppercase tracking-widest text-secondary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Desktop filter bar */}
        <section className="mb-16 hidden flex-col items-center justify-between gap-8 border-b border-outline-variant/20 py-6 md:flex md:flex-row">
          <div className="flex w-full gap-8 overflow-x-auto md:w-auto">
            <button type="button" className="whitespace-nowrap border-b-2 border-primary pb-2 font-label text-[0.6875rem] uppercase tracking-widest">All talent</button>
            <button type="button" className="whitespace-nowrap pb-2 font-label text-[0.6875rem] uppercase tracking-widest opacity-40">With bio</button>
          </div>
        </section>

        {/* Desktop table */}
        <section className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 font-label text-[0.625rem] uppercase tracking-[0.2em] text-primary opacity-40">
                <th className="px-4 pb-6">Talent identity</th>
                <th className="px-4 pb-6">Height</th>
                <th className="px-4 pb-6">Measurements</th>
                <th className="px-4 pb-6">Eyes</th>
                <th className="px-4 pb-6 text-right">Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {models.map((m, i) => {
                const thumb = m.foto_url ?? THUMB_PHOTOS[i % THUMB_PHOTOS.length];
                return (
                  <tr key={m.user_id} className="group transition-colors hover:bg-surface-container-low">
                    <td className="px-4 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 overflow-hidden bg-surface-container-high">
                          <Image src={thumb} alt={m.nombre} fill sizes="64px" className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0" />
                        </div>
                        <div>
                          <h4 className="font-headline text-lg font-bold uppercase tracking-tight text-primary">{m.nombre}</h4>
                          <p className="font-label text-[0.625rem] uppercase tracking-widest text-primary opacity-40">{m.color_ojos ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-8 font-body text-sm">{m.altura ? `${m.altura} cm` : "—"}</td>
                    <td className="px-4 py-8 font-body text-sm">{m.medidas ?? "—"}</td>
                    <td className="px-4 py-8 font-body text-sm">{m.color_ojos ?? "—"}</td>
                    <td className="px-4 py-8 text-right">
                      <Link href={`/model/${m.user_id}`} className="border-b border-primary/20 pb-0.5 font-label text-[0.625rem] uppercase tracking-widest transition-colors hover:border-primary">View deck</Link>
                    </td>
                  </tr>
                );
              })}
              {models.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center font-body text-sm text-primary opacity-40">No model profiles yet.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Mobile HQ settings */}
        <section className="mb-12 space-y-8 bg-primary p-8 text-white md:hidden">
          <h3 className="border-b border-white/20 pb-4 font-headline text-xl font-bold uppercase tracking-[0.2em]">HQ Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-label text-xs font-bold uppercase tracking-widest">Accepting applications</p>
                <p className="font-body text-[10px] text-white/60">Toggle public portal visibility</p>
              </div>
              <div className="relative h-6 w-12 bg-secondary">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white" />
              </div>
            </div>
            <button type="button" className="w-full bg-surface py-4 font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-all hover:bg-secondary hover:text-white">
              Export talent ledger (CSV)
            </button>
          </div>
        </section>

        {/* Desktop admin footer cards */}
        <aside className="mt-32 hidden grid-cols-12 gap-8 md:grid">
          <div className="col-span-12 flex aspect-[4/3] flex-col justify-between bg-surface-container-highest p-12 lg:col-span-4">
            <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">System<br />Maintenance</h3>
            <div>
              <p className="mb-6 font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-60">Database integrity check available.</p>
              <button type="button" className="bg-primary px-8 py-4 font-label text-[0.625rem] uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">Run audit</button>
            </div>
          </div>
          <div className="col-span-12 flex flex-col justify-end border border-outline-variant/20 p-12 lg:col-span-8">
            <div className="flex flex-col items-baseline gap-12 md:flex-row">
              <div className="flex-1">
                <span className="mb-4 block font-label text-[0.6875rem] uppercase tracking-widest text-secondary">Upcoming review cycle</span>
                <h3 className="mb-4 font-headline text-4xl font-bold uppercase tracking-tighter">Batch Selection 04</h3>
                <p className="max-w-md text-sm opacity-60">The editorial board will meet to finalize the A/W talent lineup for the digital lookbook.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <SiteFooter />
      <MobileBottomNav role="admin" />
    </div>
  );
}
