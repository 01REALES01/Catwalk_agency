import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
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
      <nav className="fixed left-0 right-0 top-0 z-50 bg-surface">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12">
          <Link
            href="/"
            className="font-headline text-xl font-black uppercase tracking-tighter text-primary md:text-2xl"
          >
            Catwalk
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 hover:opacity-100 transition-opacity"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-32 md:px-12">
        {/* Header + Stats */}
        <header className="mb-24 grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="mb-4 font-headline text-[3.5rem] font-black uppercase leading-none tracking-tighter text-primary md:text-[5rem]">
              HQ Control
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.2em] text-primary opacity-60">
              Internal management portal / v2.04
            </p>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5">
            <div className="flex aspect-square flex-col justify-between bg-surface-container-low p-8">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-40">
                Active models
              </span>
              <span className="font-headline text-5xl font-bold text-primary">
                {models.length}
              </span>
            </div>
            <div className="flex aspect-square flex-col justify-between bg-primary p-8 text-on-primary">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/60">
                Total profiles
              </span>
              <span className="font-headline text-5xl font-bold text-white">
                {models.length}
              </span>
            </div>
          </div>
        </header>

        {/* Filter bar */}
        <section className="mb-16 flex flex-col items-center justify-between gap-8 border-b border-outline-variant/20 py-6 md:flex-row">
          <div className="flex w-full gap-8 overflow-x-auto md:w-auto">
            <button
              type="button"
              className="whitespace-nowrap border-b-2 border-primary pb-2 font-label text-[0.6875rem] uppercase tracking-widest"
            >
              All talent
            </button>
            <button
              type="button"
              className="whitespace-nowrap pb-2 font-label text-[0.6875rem] uppercase tracking-widest opacity-40"
            >
              With bio
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-x-auto">
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
                const thumb =
                  m.foto_url ?? THUMB_PHOTOS[i % THUMB_PHOTOS.length];
                return (
                  <tr
                    key={m.user_id}
                    className="group transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-4 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 overflow-hidden bg-surface-container-high">
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
                          <p className="font-label text-[0.625rem] uppercase tracking-widest text-primary opacity-40">
                            {m.color_ojos ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-8 font-body text-sm">
                      {m.altura ? `${m.altura} cm` : "—"}
                    </td>
                    <td className="px-4 py-8 font-body text-sm">
                      {m.medidas ?? "—"}
                    </td>
                    <td className="px-4 py-8 font-body text-sm">
                      {m.color_ojos ?? "—"}
                    </td>
                    <td className="px-4 py-8 text-right">
                      <Link
                        href={`/model/${m.user_id}`}
                        className="border-b border-primary/20 pb-0.5 font-label text-[0.625rem] uppercase tracking-widest transition-colors hover:border-primary"
                      >
                        View deck
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {models.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center font-body text-sm text-primary opacity-40"
                  >
                    No model profiles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Admin footer cards */}
        <aside className="mt-32 grid grid-cols-12 gap-8">
          <div className="col-span-12 flex aspect-[4/3] flex-col justify-between bg-surface-container-highest p-12 lg:col-span-4">
            <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">
              System
              <br />
              Maintenance
            </h3>
            <div>
              <p className="mb-6 font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-60">
                Database integrity check available.
              </p>
              <button
                type="button"
                className="bg-primary px-8 py-4 font-label text-[0.625rem] uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
              >
                Run audit
              </button>
            </div>
          </div>
          <div className="col-span-12 flex flex-col justify-end border border-outline-variant/20 p-12 lg:col-span-8">
            <div className="flex flex-col items-baseline gap-12 md:flex-row">
              <div className="flex-1">
                <span className="mb-4 block font-label text-[0.6875rem] uppercase tracking-widest text-secondary">
                  Upcoming review cycle
                </span>
                <h3 className="mb-4 font-headline text-4xl font-bold uppercase tracking-tighter">
                  Batch Selection 04
                </h3>
                <p className="max-w-md text-sm opacity-60">
                  The editorial board will meet to finalize the
                  Autumn/Winter talent lineup for the digital lookbook.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
