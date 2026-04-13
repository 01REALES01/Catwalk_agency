import Link from "next/link";
import { redirect } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Booking } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Bookings — Catwalk" };

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Pending",
    class: "bg-yellow-500/10 text-yellow-700",
  },
  confirmed: {
    label: "Confirmed",
    class: "bg-green-600/10 text-green-700",
  },
  declined: {
    label: "Declined",
    class: "bg-red-500/10 text-red-600",
  },
  completed: {
    label: "Completed",
    class: "bg-primary/10 text-primary",
  },
  cancelled: {
    label: "Cancelled",
    class: "bg-outline-variant/20 text-primary/50",
  },
};

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("role, nombre")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "client") redirect("/dashboard");

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select("*, model_profiles!bookings_model_id_fkey(nombre, foto_url)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const bookings = (bookingsRaw as Booking[]) ?? [];
  const displayName =
    profile?.nombre ?? user.email?.split("@")[0] ?? "Client";

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="client" />

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-40">
        {/* Welcome */}
        <header className="mb-12 md:mb-24">
          <p className="mb-2 font-label text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-secondary md:mb-4">
            Client Portal
          </p>
          <h1 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-7xl">
            Welcome,
            <br />
            {displayName}.
          </h1>
        </header>

        {/* Stats */}
        <section className="mb-12 grid grid-cols-3 gap-[2px] bg-primary md:mb-24 md:grid-cols-3 md:gap-4 md:bg-transparent">
          <div className="flex flex-col gap-1 bg-surface p-6 md:bg-surface-container-low md:p-10">
            <span className="font-label text-[9px] uppercase tracking-widest text-primary/50 md:text-[0.625rem]">
              Total
            </span>
            <span className="font-headline text-3xl font-bold md:text-5xl">
              {bookings.length}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-surface p-6 md:bg-surface-container-low md:p-10">
            <span className="font-label text-[9px] uppercase tracking-widest text-primary/50 md:text-[0.625rem]">
              Pending
            </span>
            <span className="font-headline text-3xl font-bold text-secondary md:text-5xl">
              {pending}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-surface p-6 md:bg-surface-container-low md:p-10">
            <span className="font-label text-[9px] uppercase tracking-widest text-primary/50 md:text-[0.625rem]">
              Confirmed
            </span>
            <span className="font-headline text-3xl font-bold md:text-5xl">
              {confirmed}
            </span>
          </div>
        </section>

        {/* Bookings list */}
        <section>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter md:text-4xl">
              Your Bookings
            </h2>
            <Link
              href="/#roster"
              className="font-label text-[0.625rem] uppercase tracking-widest text-secondary transition-colors hover:text-primary"
            >
              Browse models
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <span className="material-symbols-outlined text-6xl text-primary/20">
                event_available
              </span>
              <p className="max-w-sm font-body text-sm text-primary/50">
                You haven&apos;t made any bookings yet. Browse our roster and
                request your first booking.
              </p>
              <Link
                href="/#roster"
                className="bg-secondary px-8 py-4 font-headline text-[0.6875rem] font-bold uppercase tracking-widest text-white transition-colors hover:bg-tertiary"
              >
                Explore Models
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const modelName =
                  (b.model_profiles as { nombre?: string } | null)?.nombre ??
                  "Model";
                const st = STATUS_LABELS[b.status] ?? STATUS_LABELS.pending;
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-4 border border-outline-variant/15 p-6 transition-colors hover:bg-surface-container-low md:flex-row md:items-center md:justify-between md:p-8"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-headline text-lg font-bold uppercase tracking-tight">
                          {modelName}
                        </h3>
                        <span
                          className={`inline-block px-3 py-0.5 font-label text-[0.5625rem] uppercase tracking-widest ${st.class}`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-label text-[0.625rem] uppercase tracking-widest text-primary/50">
                        <span>{b.event_type}</span>
                        {b.event_date ? (
                          <span>
                            {new Date(b.event_date).toLocaleDateString()}
                          </span>
                        ) : null}
                        {b.event_location ? (
                          <span>{b.event_location}</span>
                        ) : null}
                        {b.hours ? <span>{b.hours}h</span> : null}
                        {b.budget ? (
                          <span className="font-bold text-secondary">${b.budget.toLocaleString("en-US")}</span>
                        ) : null}
                      </div>
                      {b.message ? (
                        <p className="mt-3 font-body text-xs text-primary/60">
                          {b.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right font-label text-[0.5625rem] uppercase tracking-widest text-primary/30">
                      {new Date(b.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav role="client" />
    </div>
  );
}
