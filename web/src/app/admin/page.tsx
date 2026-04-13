import { redirect } from "next/navigation";
import { AdminTalentTable } from "@/app/admin/admin-talent-table";
import { AdminBookings } from "@/app/admin/admin-bookings";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin HQ — Catwalk",
};

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

  const all = (allProfiles as ModelProfile[]) ?? [];
  const models = all.filter((m) => m.role === "model" || (!m.role && m.role !== "admin" && m.role !== "client"));
  const clients = all.filter((m) => m.role === "client");

  const activeModels = models.filter((m) => m.approved).length;
  const pendingModels = models.filter((m) => !m.approved).length;
  const featuredModels = models.filter((m) => m.featured).length;

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select("*, model_profiles!bookings_model_id_fkey(nombre)")
    .order("created_at", { ascending: false });

  const allBookings = (bookingsRaw as Booking[]) ?? [];
  const pendingBookings = allBookings.filter((b) => b.status === "pending").length;

  const modelNames = models.reduce<Record<string, string>>((acc, m) => {
    acc[m.user_id] = m.nombre;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="admin" />

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-20 md:px-12 md:pb-24 md:pt-32">
        {/* Stats */}
        <header className="mb-16 md:mb-24">
          <h1 className="mb-4 font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-[5rem]">
            HQ Control
          </h1>
          <p className="mb-8 font-label text-[0.625rem] uppercase tracking-[0.2em] text-primary opacity-40 md:text-sm">
            Internal Management Portal
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            <div className="flex flex-col gap-1 bg-surface-container-low p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">
                Active Models
              </span>
              <span className="font-headline text-3xl font-bold md:text-5xl">
                {activeModels}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-primary p-5 text-on-primary md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-on-primary/60 md:text-[0.625rem]">
                Pending
              </span>
              <span className="font-headline text-3xl font-bold text-white md:text-5xl">
                {pendingModels}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-surface-container-low p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">
                Featured
              </span>
              <span className="font-headline text-3xl font-bold md:text-5xl">
                {featuredModels}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-secondary p-5 text-white md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-white/70 md:text-[0.625rem]">
                Bookings
              </span>
              <span className="font-headline text-3xl font-bold md:text-5xl">
                {allBookings.length}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-surface-container-low p-5 md:p-8">
              <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40 md:text-[0.625rem]">
                Clients
              </span>
              <span className="font-headline text-3xl font-bold md:text-5xl">
                {clients.length}
              </span>
            </div>
          </div>
        </header>

        {/* Models section */}
        <section id="models" className="mb-24 scroll-mt-24 md:mb-32">
          <AdminTalentTable models={models} />
        </section>

        {/* Bookings section */}
        <section id="bookings" className="mb-24 scroll-mt-24 md:mb-32">
          <AdminBookings
            bookings={allBookings}
            modelNames={modelNames}
            pendingCount={pendingBookings}
          />
        </section>

        {/* Clients section */}
        <section id="clients" className="scroll-mt-24">
          <div className="mb-8 flex items-baseline justify-between md:mb-12">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter md:text-4xl">
              Registered Clients
            </h2>
            <span className="font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
              {clients.length} total
            </span>
          </div>

          {clients.length === 0 ? (
            <p className="py-12 text-center font-body text-sm text-primary/40">
              No clients registered yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((c) => (
                <div
                  key={c.user_id}
                  className="flex items-center gap-4 border border-outline-variant/15 p-5 transition-colors hover:bg-surface-container-low"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-container-high text-primary/25">
                    <span className="material-symbols-outlined text-lg">person</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-headline text-sm font-bold uppercase tracking-tight">
                      {c.nombre}
                    </p>
                    <p className="font-label text-[0.5rem] uppercase tracking-widest text-primary/40">
                      Client
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav role="admin" />
    </div>
  );
}
