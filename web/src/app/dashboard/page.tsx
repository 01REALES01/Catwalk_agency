import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { ProfileForm } from "@/app/dashboard/profile-form";
import { GenerateBioButton } from "@/app/dashboard/generate-bio-button";
import { Button } from "@/components/ui/button";
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

  if (!user) {
    redirect("/login");
  }

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
              href="/"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 hover:opacity-100 transition-opacity"
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

      <main className="mx-auto max-w-[1440px] px-6 pb-32 pt-32 md:px-12 md:pt-40">
        {/* Welcome header — matches stitch dashboard */}
        <header className="mb-24 grid grid-cols-12 gap-8 items-end md:mb-32">
          <div className="col-span-12 md:col-span-8">
            <p className="mb-4 font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
              Internal dashboard
            </p>
            <h1 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-6xl lg:text-7xl">
              Welcome back,
              <br />
              {displayName}.
            </h1>
          </div>
          <div className="col-span-12 text-left md:col-span-4 md:text-right">
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.1em] text-primary opacity-40">
              Career status
            </span>
            <div className="mt-2 flex items-center gap-3 md:justify-end">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-headline text-lg font-bold uppercase text-primary md:text-xl">
                Active representative
              </span>
            </div>
          </div>
        </header>

        {/* Form + Status Cards Grid — matches stitch */}
        <div className="mb-40 grid grid-cols-12 gap-8 md:gap-16">
          {/* Left: Update Measurements */}
          <div className="col-span-12 lg:col-span-5">
            <h2 className="mb-12 font-headline text-2xl font-black uppercase tracking-tight text-primary">
              Update profile
            </h2>
            <ProfileForm profile={p} />
          </div>

          {/* Right: Status Cards */}
          <div className="col-span-12 space-y-8 lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex aspect-square flex-col justify-between bg-surface-container-low p-10">
                <span className="font-headline text-3xl text-secondary">
                  ✦
                </span>
                <div>
                  <h3 className="mb-2 font-headline text-2xl font-black uppercase">
                    Availability
                  </h3>
                  <p className="font-body text-xs leading-relaxed opacity-60">
                    Currently set as available for Fashion Week bookings. Update
                    your calendar when needed.
                  </p>
                </div>
                <span className="mt-4 w-fit border-b border-primary pb-1 font-label text-[0.6875rem] uppercase tracking-widest transition-colors hover:border-secondary hover:text-secondary">
                  Manage dates
                </span>
              </div>
              <div className="hidden aspect-square flex-col justify-between bg-primary p-10 text-on-primary md:flex asymmetric-offset">
                <span className="font-headline text-3xl text-secondary">
                  ◆
                </span>
                <div>
                  <h3 className="mb-2 font-headline text-2xl font-black uppercase">
                    Contract status
                  </h3>
                  <p className="font-body text-xs leading-relaxed opacity-60">
                    Exclusive representation active. Tier A status verified.
                  </p>
                </div>
                <span className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary">
                  Secured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Bio Generation */}
        <section className="mb-40">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-primary md:text-5xl">
              AI biography
            </h2>
            <p className="font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-40">
              Powered by OpenAI
            </p>
          </div>
          {p?.bio_profesional && (
            <div className="mb-8 max-w-3xl border-l-2 border-secondary pl-8">
              <p className="font-body text-sm leading-relaxed text-on-surface/80">
                {p.bio_profesional}
              </p>
            </div>
          )}
          <GenerateBioButton />
          <p className="mt-4 font-label text-[0.625rem] uppercase tracking-widest text-primary opacity-30">
            Genera o regenera tu biografía profesional con inteligencia
            artificial a partir de tus datos.
          </p>
        </section>

        {/* Notification Banner — matches stitch */}
        <div className="flex flex-col items-center justify-between gap-6 bg-surface-container-highest p-8 md:flex-row">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center bg-secondary text-on-primary">
              <span className="font-headline text-lg font-bold">!</span>
            </div>
            <div>
              <h4 className="font-headline text-sm font-black uppercase tracking-wider">
                New casting call
              </h4>
              <p className="font-body text-xs opacity-60">
                High-end editorial shoot — Requested for presence.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="bg-primary px-10 py-4 font-headline text-[0.625rem] font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
          >
            View details
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
