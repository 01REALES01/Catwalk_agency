import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { AdminTalentTable } from "@/app/admin/admin-talent-table";
import { MobileBottomNav } from "@/components/mobile-nav";
import { PageBack } from "@/components/page-back";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin HQ — Catwalk",
};

function isPendingProfile(m: ModelProfile) {
  return !m.bio_profesional || m.altura == null;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("model_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (myProfile?.role !== "admin") redirect("/dashboard");

  const { data: allProfiles } = await supabase
    .from("model_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const models = (allProfiles as ModelProfile[]) ?? [];
  const talent = models.filter((m) => m.role !== "admin");

  const activeModels = talent.filter((m) => m.approved).length;
  const newApplicants = talent.filter((m) => !m.approved).length;

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select("*, model_profiles!bookings_model_id_fkey(nombre)")
    .order("created_at", { ascending: false });

  const allBookings = (bookingsRaw as Booking[]) ?? [];
  const pendingBookings = allBookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile — top bar */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b-[0.5px] border-primary/10 bg-surface px-4 py-3 md:hidden">
        <div className="relative flex w-full items-center justify-between gap-2">
          <PageBack href="/" label="Inicio" className="shrink-0" />
          <Link
            href="/"
            className="absolute left-1/2 min-w-0 max-w-[40%] -translate-x-1/2 truncate text-center font-headline text-lg font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <span className="material-symbols-outlined text-primary/60" aria-hidden>
              notifications
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="material-symbols-outlined flex h-11 w-11 items-center justify-center text-primary/60"
                aria-label="Cerrar sesión"
              >
                logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Desktop — admin_panel_catwal */}
      <div className="hidden md:block">
        <SiteHeader variant="admin" adminSession />
      </div>

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-20 md:px-12 md:pb-24 md:pt-32">
        {/* HQ Control + stats (asymmetric) */}
        <header className="mb-24 grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="mb-4 font-headline text-[3.5rem] font-black uppercase leading-none tracking-tighter text-primary md:text-[5rem]">
              HQ Control
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.2em] text-primary opacity-60">
              Internal Management Portal / v2.04
            </p>
          </div>
          <div className="col-span-12 grid grid-cols-3 gap-4 lg:col-span-5">
            <div className="flex flex-col justify-between bg-surface-container-low p-6 lg:p-8">
              <span className="font-label text-[0.625rem] uppercase tracking-widest text-primary opacity-40">
                Active Models
              </span>
              <span className="mt-4 font-headline text-4xl font-bold text-primary lg:text-5xl">
                {activeModels}
              </span>
            </div>
            <div className="flex flex-col justify-between bg-primary p-6 text-on-primary lg:p-8">
              <span className="font-label text-[0.625rem] uppercase tracking-widest text-on-primary opacity-60">
                Applicants
              </span>
              <span className="mt-4 font-headline text-4xl font-bold text-white lg:text-5xl">
                {newApplicants}
              </span>
            </div>
            <div className="flex flex-col justify-between bg-secondary p-6 text-white lg:p-8">
              <span className="font-label text-[0.625rem] uppercase tracking-widest text-white/70">
                Bookings
              </span>
              <span className="mt-4 font-headline text-4xl font-bold lg:text-5xl">
                {allBookings.length}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile overview */}
        <section className="mb-8 space-y-6 md:hidden">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary-fixed-dim">
                HQ Control
              </p>
              <h2 className="font-headline text-4xl font-black tracking-tighter">
                Overview
              </h2>
            </div>
            <p className="font-label text-[10px] font-bold uppercase italic tracking-[0.2em] text-secondary">
              Live status
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-outline-variant/20 bg-outline-variant/20">
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">
                Active models
              </p>
              <p className="font-headline text-3xl font-bold">{activeModels}</p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">
                New applicants
              </p>
              <p className="font-headline text-3xl font-bold">{newApplicants}</p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">
                Pending review
              </p>
              <p className="font-headline text-3xl font-bold text-secondary">
                {newApplicants}
              </p>
            </div>
            <div className="space-y-2 bg-surface p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.1em] text-primary-fixed-dim">
                Roster
              </p>
              <p className="font-headline text-3xl font-bold">{activeModels}</p>
            </div>
          </div>
        </section>

        <AdminTalentTable models={talent} />

        {/* Bookings management */}
        <section className="mt-32">
          <div className="mb-12 flex items-baseline justify-between">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter md:text-5xl">
              Bookings
            </h2>
            <span className="font-label text-[0.625rem] uppercase tracking-widest text-secondary">
              {pendingBookings} pending
            </span>
          </div>

          {allBookings.length === 0 ? (
            <p className="py-16 text-center font-body text-sm text-primary opacity-40">
              No bookings yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allBookings.map((b) => {
                const modelName =
                  (b.model_profiles as { nombre?: string } | null)?.nombre ??
                  "Model";
                const stColor =
                  b.status === "confirmed"
                    ? "bg-green-600/10 text-green-700"
                    : b.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-700"
                      : b.status === "declined"
                        ? "bg-red-500/10 text-red-600"
                        : "bg-outline-variant/20 text-primary/50";
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-4 border border-outline-variant/15 p-6 md:flex-row md:items-center md:justify-between md:p-8"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="font-headline text-sm font-bold uppercase tracking-tight">
                          {b.client_name}
                        </span>
                        <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40">
                          → {modelName}
                        </span>
                        <span
                          className={`px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest ${stColor}`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
                        <span>{b.event_type}</span>
                        {b.event_date ? (
                          <span>
                            {new Date(b.event_date).toLocaleDateString()}
                          </span>
                        ) : null}
                        {b.event_location ? (
                          <span>{b.event_location}</span>
                        ) : null}
                        <span>{b.client_email}</span>
                      </div>
                      {b.message ? (
                        <p className="mt-2 line-clamp-2 font-body text-xs text-primary/50">
                          {b.message}
                        </p>
                      ) : null}
                    </div>
                    <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/25">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav role="admin" />
    </div>
  );
}
