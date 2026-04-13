import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { ProfileForm } from "@/app/dashboard/profile-form";
import { GenerateBioButton } from "@/app/dashboard/generate-bio-button";
import { MobileBottomNav } from "@/components/mobile-nav";
import { PageBack } from "@/components/page-back";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — Catwalk" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const p = profile as ModelProfile | null;
  const displayName =
    p?.nombre?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Model";

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select("*")
    .eq("model_id", user.id)
    .order("created_at", { ascending: false });

  const bookings = (bookingsRaw as Booking[]) ?? [];
  const pendingBookings = bookings.filter(
    (b) => b.status === "pending",
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const profileComplete =
    !!p?.nombre && p.altura != null && !!p.color_ojos && !!p.medidas;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar (mobile) ── */}
      <header className="sticky top-0 z-50 border-b-[0.5px] border-primary/10 bg-surface px-4 py-3 md:hidden">
        <div className="relative flex w-full items-center justify-between gap-2">
          <PageBack href="/" label="Inicio" className="shrink-0" />
          <Link
            href="/"
            className="absolute left-1/2 min-w-0 max-w-[45%] -translate-x-1/2 truncate text-center font-headline text-lg font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
          <form action={signOut} className="shrink-0">
            <button
              type="submit"
              className="material-symbols-outlined flex h-11 w-11 items-center justify-center text-primary/60"
              aria-label="Cerrar sesión"
            >
              logout
            </button>
          </form>
        </div>
      </header>

      {/* ── Top bar (desktop) ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 hidden bg-surface md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-12 py-6">
          <div className="flex items-center gap-4">
            <PageBack href="/" label="Inicio" />
            <Link
              href="/"
              className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
            >
              Catwalk
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href={`/model/${user.id}`}
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity hover:opacity-100"
            >
              My Portfolio
            </Link>
            <Link
              href="/#roster"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity hover:opacity-100"
            >
              Roster
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-4 md:px-12 md:pb-32 md:pt-40">
        {/* ════════════════════════════════════════════════
            1. WELCOME + STATS
        ════════════════════════════════════════════════ */}
        <section className="mb-10 md:mb-24">
          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary md:mb-4 md:text-[0.6875rem]">
            Model dashboard
          </p>
          <h1 className="mb-8 font-headline text-4xl font-black uppercase leading-none tracking-tighter md:mb-12 md:text-7xl">
            Welcome back,
            <br />
            {displayName}.
          </h1>

          {/* Stats — 4 on mobile, 4 on desktop, all centered */}
          <div className="grid grid-cols-2 gap-[2px] bg-primary md:grid-cols-4 md:gap-4 md:bg-transparent">
            {[
              {
                label: "Status",
                value: p?.approved ? "Approved" : "Pending",
                accent: false,
              },
              {
                label: "Bookings",
                value: String(bookings.length),
                accent: false,
              },
              {
                label: "Pending",
                value: String(pendingBookings),
                accent: true,
              },
              {
                label: "Confirmed",
                value: String(confirmedBookings),
                accent: false,
                dark: true,
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 p-6 md:p-8 ${
                  s.dark
                    ? "bg-primary text-on-primary"
                    : "bg-surface md:bg-surface-container-low"
                }`}
              >
                <span
                  className={`font-label text-[9px] uppercase tracking-widest md:text-[0.625rem] ${
                    s.dark ? "text-on-primary/50" : "text-primary/45"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`font-headline text-2xl font-bold uppercase italic md:text-4xl ${
                    s.accent ? "text-secondary" : ""
                  }`}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            2. AI BIOGRAPHY — prominent, before the form
        ════════════════════════════════════════════════ */}
        <section className="mb-10 md:mb-24">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              AI Biography
            </h2>
            <span className="flex items-center gap-1.5 font-label text-[9px] uppercase tracking-widest text-secondary md:text-[0.625rem]">
              <span className="material-symbols-outlined text-base">
                auto_awesome
              </span>
              OpenAI
            </span>
          </div>

          {/* Current bio (if any) */}
          {p?.bio_profesional ? (
            <div className="mb-6 border-l-2 border-secondary pl-5 md:mb-8 md:pl-8">
              <p className="font-body text-sm leading-relaxed text-on-surface/80 md:text-base">
                {p.bio_profesional}
              </p>
            </div>
          ) : (
            <div className="mb-6 flex flex-col items-center gap-3 border border-dashed border-outline-variant/30 py-10 text-center md:mb-8 md:py-16">
              <span className="material-symbols-outlined text-4xl text-primary/15">
                edit_note
              </span>
              <p className="max-w-xs font-body text-sm text-primary/40">
                {profileComplete
                  ? "Generate your professional biography with one click using AI."
                  : "Complete your measurements first, then generate your bio with AI."}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <GenerateBioButton />
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/30 md:text-[0.5625rem]">
              {p?.bio_profesional
                ? "Click to regenerate with your latest profile data."
                : "Generates a professional bio based on your measurements."}
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            3. PROFILE / MEASUREMENTS FORM
        ════════════════════════════════════════════════ */}
        <section className="mb-10 md:mb-24">
          <div className="mb-6 flex items-baseline justify-between md:mb-8">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              Measurements
            </h2>
            <span className="font-label text-[9px] uppercase italic tracking-widest text-primary/35 md:text-[0.5625rem]">
              {profileComplete ? "Profile complete" : "Please complete"}
            </span>
          </div>
          <div className="max-w-3xl">
            <ProfileForm profile={p} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            4. BOOKINGS LIST
        ════════════════════════════════════════════════ */}
        <section className="mb-10 md:mb-24">
          <div className="mb-6 flex items-baseline justify-between md:mb-8">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              Bookings
            </h2>
            {bookings.length > 0 ? (
              <span className="font-label text-[9px] uppercase tracking-widest text-primary/35 md:text-[0.5625rem]">
                {bookings.length} total
              </span>
            ) : null}
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-4 border border-dashed border-outline-variant/30 py-12 text-center md:py-20">
              <span className="material-symbols-outlined text-5xl text-primary/15">
                event_available
              </span>
              <p className="max-w-xs font-body text-sm text-primary/40">
                No booking requests yet. Once clients find your profile,
                their requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
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
                    className="flex flex-col gap-3 border border-outline-variant/15 p-5 md:flex-row md:items-center md:justify-between md:p-8"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-headline text-sm font-bold uppercase tracking-tight">
                          {b.client_name}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest ${stColor}`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
                        <span>{b.event_type}</span>
                        {b.event_date ? (
                          <span>
                            {new Date(b.event_date).toLocaleDateString()}
                          </span>
                        ) : null}
                        {b.event_location ? (
                          <span>{b.event_location}</span>
                        ) : null}
                      </div>
                      {b.message ? (
                        <p className="mt-2 line-clamp-2 font-body text-xs text-primary/50">
                          {b.message}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 font-label text-[0.5rem] uppercase tracking-widest text-primary/25">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════
            5. PUBLIC PROFILE LINK
        ════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-4 bg-surface-container-highest p-5 md:flex-row md:gap-6 md:p-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-on-primary md:h-12 md:w-12">
              <span className="material-symbols-outlined text-sm md:text-lg">
                visibility
              </span>
            </div>
            <div>
              <h4 className="font-headline text-xs font-black uppercase tracking-wider md:text-sm">
                Your public profile
              </h4>
              <p className="font-body text-[10px] text-primary/50 md:text-xs">
                See how clients view your portfolio page.
              </p>
            </div>
          </div>
          <Link
            href={`/model/${user.id}`}
            className="w-full bg-primary px-8 py-3 text-center font-headline text-[0.625rem] font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary md:w-auto md:px-10 md:py-4"
          >
            View profile
          </Link>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav role="model" />
    </div>
  );
}
