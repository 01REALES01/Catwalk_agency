import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { ProfileForm } from "@/app/dashboard/profile-form";
import { GenerateBioButton } from "@/app/dashboard/generate-bio-button";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

export const metadata = {
  title: "Dashboard — Catwalk",
};

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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile TopAppBar */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b-[0.5px] border-primary/10 bg-surface px-6 py-4 md:hidden">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="material-symbols-outlined text-primary/60 hover:text-primary transition-opacity"
          >
            logout
          </button>
        </form>
      </header>

      {/* Desktop nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 hidden bg-surface md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-12 py-6">
          <Link
            href="/"
            className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity hover:opacity-100"
            >
              Home
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-6 md:px-12 md:pb-32 md:pt-40">
        {/* Mobile welcome */}
        <section className="mb-8 space-y-2 md:hidden">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            Model dashboard
          </p>
          <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter">
            Welcome back,
            <br />
            {displayName}.
          </h2>
        </section>

        {/* Mobile career status grid */}
        <section className="mb-8 grid grid-cols-2 gap-[2px] bg-primary md:hidden">
          <div className="space-y-1 bg-surface p-6">
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/50">Status</p>
            <p className="font-headline text-lg font-bold uppercase italic">Active</p>
          </div>
          <div className="space-y-1 bg-surface p-6">
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/50">Rank</p>
            <p className="font-headline text-lg font-bold uppercase italic">Premier</p>
          </div>
          <div className="space-y-1 bg-surface p-6">
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/50">Upcoming</p>
            <p className="font-headline text-lg font-bold uppercase italic">3 Shoots</p>
          </div>
          <div className="space-y-1 bg-surface p-6">
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/50">Agency</p>
            <p className="font-headline text-lg font-bold uppercase italic">NYC/LDN</p>
          </div>
        </section>

        {/* Desktop welcome header */}
        <header className="mb-24 hidden grid-cols-12 items-end gap-8 md:grid md:mb-32">
          <div className="col-span-12 md:col-span-8">
            <p className="mb-4 font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
              Internal dashboard
            </p>
            <h1 className="font-headline text-6xl font-black uppercase leading-none tracking-tighter text-primary lg:text-7xl">
              Welcome back,
              <br />
              {displayName}.
            </h1>
          </div>
          <div className="col-span-12 text-right md:col-span-4">
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.1em] text-primary opacity-40">
              Career status
            </span>
            <div className="mt-2 flex items-center justify-end gap-3">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-headline text-xl font-bold uppercase text-primary">
                Active representative
              </span>
            </div>
          </div>
        </header>

        {/* Profile form */}
        <section className="mb-12 md:mb-40">
          <div className="flex items-end justify-between border-b border-primary/10 pb-2 md:border-0 md:pb-0">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight md:text-2xl md:font-black">
              Measurements
            </h3>
            <span className="font-label text-[10px] uppercase italic tracking-widest text-primary/40 md:hidden">
              Update profile
            </span>
          </div>
          <div className="mt-8 max-w-3xl">
            <ProfileForm profile={p} />
          </div>
        </section>

        {/* Desktop status cards */}
        <div className="mb-40 hidden grid-cols-12 gap-16 md:grid">
          <div className="col-span-12 space-y-8 lg:col-span-7 lg:col-start-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex aspect-square flex-col justify-between bg-surface-container-low p-10">
                <span className="font-headline text-3xl text-secondary">✦</span>
                <div>
                  <h3 className="mb-2 font-headline text-2xl font-black uppercase">Availability</h3>
                  <p className="font-body text-xs leading-relaxed opacity-60">
                    Currently available for Fashion Week bookings.
                  </p>
                </div>
                <span className="mt-4 w-fit border-b border-primary pb-1 font-label text-[0.6875rem] uppercase tracking-widest transition-colors hover:border-secondary hover:text-secondary">
                  Manage dates
                </span>
              </div>
              <div className="flex aspect-square flex-col justify-between bg-primary p-10 text-on-primary asymmetric-offset">
                <span className="font-headline text-3xl text-secondary">◆</span>
                <div>
                  <h3 className="mb-2 font-headline text-2xl font-black uppercase">Contract</h3>
                  <p className="font-body text-xs leading-relaxed opacity-60">
                    Exclusive representation active. Tier A verified.
                  </p>
                </div>
                <span className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary">Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile action items (monolith blocks) */}
        <section className="mb-12 space-y-[2px] bg-primary md:hidden">
          {["Bookings", "Contracts", "Travel"].map((label) => (
            <div
              key={label}
              className="group flex cursor-pointer items-center justify-between bg-surface p-8 transition-colors duration-300 hover:bg-primary hover:text-white"
            >
              <span className="font-headline text-2xl font-black uppercase italic tracking-tighter">
                {label}
              </span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                arrow_forward_ios
              </span>
            </div>
          ))}
        </section>

        {/* AI Bio Generation */}
        <section className="mb-12 md:mb-40">
          <div className="mb-6 flex items-baseline justify-between md:mb-12">
            <h2 className="font-headline text-xl font-black uppercase tracking-tighter text-primary md:text-5xl">
              AI biography
            </h2>
            <p className="font-label text-[10px] uppercase tracking-widest text-primary opacity-40 md:text-[0.6875rem]">
              Powered by OpenAI
            </p>
          </div>
          {p?.bio_profesional && (
            <div className="mb-6 border-l-2 border-secondary pl-6 md:mb-8 md:max-w-3xl md:pl-8">
              <p className="font-body text-sm leading-relaxed text-on-surface/80">
                {p.bio_profesional}
              </p>
            </div>
          )}
          <GenerateBioButton />
          <p className="mt-4 font-label text-[9px] uppercase tracking-widest text-primary opacity-30 md:text-[0.625rem]">
            Genera o regenera tu biografía profesional con inteligencia
            artificial.
          </p>
        </section>

        {/* Notification */}
        <div className="flex flex-col items-center justify-between gap-4 bg-surface-container-highest p-6 md:flex-row md:gap-6 md:p-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-on-primary md:h-12 md:w-12">
              <span className="material-symbols-outlined text-sm md:text-lg">priority_high</span>
            </div>
            <div>
              <h4 className="font-headline text-xs font-black uppercase tracking-wider md:text-sm">
                New casting call
              </h4>
              <p className="font-body text-[10px] opacity-60 md:text-xs">
                High-end editorial shoot — Requested for presence.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full bg-primary px-8 py-3 font-headline text-[0.625rem] font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary md:w-auto md:py-4 md:px-10"
          >
            View details
          </button>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav role="model" />
    </div>
  );
}
