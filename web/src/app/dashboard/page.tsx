import Link from "next/link";
import { redirect } from "next/navigation";
import { GenerateBioButton } from "@/app/dashboard/generate-bio-button";
import { ModelBookings } from "@/app/dashboard/model-bookings";
import { PhotoUpload } from "@/app/dashboard/photo-upload";
import { ProfileForm } from "@/app/dashboard/profile-form";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — Catwalk" };

function formatMoney(n: number | null) {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

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
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  const profileComplete =
    !!p?.nombre && p.altura != null && !!p.color_ojos && !!p.medidas;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="model" />

      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-20 md:px-12 md:pb-32 md:pt-40">
        {/* Welcome + Stats */}
        <section className="mb-10 md:mb-20">
          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary md:mb-4 md:text-[0.6875rem]">
            Model dashboard
          </p>
          <h1 className="mb-8 font-headline text-4xl font-black uppercase leading-none tracking-tighter md:mb-12 md:text-7xl">
            {displayName}
          </h1>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            <div className="flex flex-col gap-1 bg-surface-container-low p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">Status</span>
              <span className="font-headline text-xl font-bold uppercase md:text-3xl">
                {p?.approved ? "Approved" : "Pending"}
              </span>
            </div>
            <div className={`flex flex-col gap-1 p-5 md:p-8 ${pendingBookings > 0 ? "bg-yellow-500/10" : "bg-surface-container-low"}`}>
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">Pending</span>
              <span className={`font-headline text-xl font-bold md:text-3xl ${pendingBookings > 0 ? "text-yellow-700" : ""}`}>
                {pendingBookings}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-green-600/5 p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">Confirmed</span>
              <span className="font-headline text-xl font-bold text-green-700 md:text-3xl">
                {confirmedBookings}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-surface-container-low p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">Total</span>
              <span className="font-headline text-xl font-bold md:text-3xl">
                {bookings.length}
              </span>
            </div>
            <div className="col-span-2 flex flex-col gap-1 bg-primary p-5 text-on-primary md:col-span-1 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-on-primary/50 md:text-[0.625rem]">Rate/hr</span>
              <span className="font-headline text-xl font-bold md:text-3xl">
                {formatMoney(p?.tarifa_hora ?? null)}
              </span>
            </div>
          </div>
        </section>

        {/* Bookings — most important section */}
        <section className="mb-10 md:mb-24">
          <div className="mb-6 flex items-baseline justify-between md:mb-8">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              Bookings
            </h2>
            {pendingBookings > 0 ? (
              <span className="bg-yellow-500/10 px-3 py-1 font-label text-[0.5625rem] uppercase tracking-widest text-yellow-700">
                {pendingBookings} need response
              </span>
            ) : (
              <span className="font-label text-[9px] uppercase tracking-widest text-primary/35 md:text-[0.5625rem]">
                {bookings.length} total
              </span>
            )}
          </div>

          <ModelBookings bookings={bookings} />
        </section>

        {/* Profile overview + Edit button */}
        <section className="mb-10 md:mb-24">
          <div className="mb-6 flex items-baseline justify-between md:mb-8">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              My Profile
            </h2>
            <span className="font-label text-[9px] uppercase italic tracking-widest text-primary/35 md:text-[0.5625rem]">
              {profileComplete ? "Complete" : "Incomplete"}
            </span>
          </div>

          {/* Profile summary card */}
          <div className="mb-6 grid grid-cols-1 gap-6 border border-outline-variant/15 p-5 md:grid-cols-[140px_1fr] md:p-8">
            {/* Photo */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[140px] overflow-hidden bg-surface-container-high md:mx-0">
              {p?.foto_url ? (
                <img src={p.foto_url} alt={p.nombre} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-primary/15">
                  <span className="material-symbols-outlined text-3xl">person</span>
                  <span className="font-label text-[0.5rem] uppercase tracking-widest">No photo</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Name</p>
                  <p className="mt-0.5 font-headline text-sm font-bold">{p?.nombre ?? "—"}</p>
                </div>
                <div>
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Height</p>
                  <p className="mt-0.5 font-headline text-sm font-bold">{p?.altura ? `${p.altura} cm` : "—"}</p>
                </div>
                <div>
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Eyes</p>
                  <p className="mt-0.5 font-headline text-sm font-bold">{p?.color_ojos ?? "—"}</p>
                </div>
                <div>
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Measurements</p>
                  <p className="mt-0.5 font-headline text-sm font-bold">{p?.medidas ?? "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Rate / hour</p>
                  <p className="mt-0.5 font-headline text-sm font-bold text-secondary">{formatMoney(p?.tarifa_hora ?? null)}</p>
                </div>
                <div className="col-span-1 sm:col-span-3">
                  <p className="font-label text-[0.5rem] uppercase tracking-widest opacity-35">Bio</p>
                  <p className="mt-0.5 line-clamp-2 font-body text-xs text-primary/60">
                    {p?.bio_profesional ?? "No biography yet."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/dashboard/edit"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-label text-[0.5625rem] uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit profile
                </Link>
                <Link
                  href={`/model/${user.id}`}
                  className="inline-flex items-center gap-2 border border-primary/20 px-6 py-3 font-label text-[0.5625rem] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  View public profile
                </Link>
              </div>
            </div>
          </div>

          {/* AI Bio quick action */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <GenerateBioButton />
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/30 md:text-[0.5625rem]">
              {p?.bio_profesional
                ? "Regenerate with your latest profile data."
                : "Complete your profile, then generate a professional bio."}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav role="model" />
    </div>
  );
}
