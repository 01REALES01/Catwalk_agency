import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/app/model/[id]/booking-form";
import { MobileBottomNav } from "@/components/mobile-nav";
import { PageBack } from "@/components/page-back";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

const PLACEHOLDER_PHOTO = "/placeholder-model.svg";

type Stat = { label: string; value: string };

export default async function ModelPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from("model_profiles")
    .select("user_id, nombre, altura, color_ojos, medidas, bio_profesional, foto_url, role")
    .eq("user_id", id)
    .maybeSingle();

  if (profileError || !profile) notFound();
  const m = profile as Pick<ModelProfile, "user_id" | "nombre" | "altura" | "color_ojos" | "medidas" | "bio_profesional" | "foto_url" | "role">;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isClient = false;
  let userEmail = "";
  if (user) {
    const { data: userProfile } = await supabase
      .from("model_profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    isClient = userProfile?.role === "client";
    userEmail = user.email ?? "";
  }

  const stats: Stat[] = [];
  if (m.altura) stats.push({ label: "Height", value: `${m.altura} cm` });
  if (m.color_ojos) stats.push({ label: "Eyes", value: m.color_ojos });
  if (m.medidas) {
    const parts = m.medidas.split("-");
    if (parts.length >= 3) {
      stats.push({ label: "Bust", value: `${parts[0]} cm` });
      stats.push({ label: "Waist", value: `${parts[1]} cm` });
      stats.push({ label: "Hips", value: `${parts[2]} cm` });
    } else {
      stats.push({ label: "Measurements", value: m.medidas });
    }
  }

  const photo = m.foto_url ?? PLACEHOLDER_PHOTO;
  const firstName = m.nombre.split(" ")[0];
  const lastName = m.nombre.split(" ").slice(1).join(" ");

  return (
    <>
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-center border-b-[0.5px] border-primary/10 bg-surface px-4 py-3 md:hidden">
        <div className="relative flex w-full items-center justify-between gap-2">
          <PageBack href="/#roster" label="Roster" className="shrink-0" />
          <Link
            href="/"
            className="absolute left-1/2 min-w-0 max-w-[48%] -translate-x-1/2 truncate text-center font-headline text-lg font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
          <Link
            href="/login"
            className="shrink-0 font-label text-[10px] font-semibold uppercase tracking-widest text-secondary"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Desktop header */}
      <header className="fixed left-0 right-0 top-0 z-50 hidden bg-surface md:block">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-12 py-8">
          <div className="flex min-w-0 items-center gap-4">
            <PageBack href="/#roster" label="Roster" />
            <Link href="/" className="truncate font-headline text-3xl font-black uppercase tracking-tighter text-primary">
              Catwalk
            </Link>
          </div>
          <div className="flex items-center gap-12">
            <Link href="/#roster" className="border-b-2 border-secondary pb-1 font-headline text-[0.6875rem] uppercase tracking-widest text-secondary">Models</Link>
            <Link href="/#philosophy" className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100">Philosophy</Link>
            <Link href="/register" className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100">Apply</Link>
          </div>
          <Link href="/login" className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100">Client Login</Link>
        </nav>
      </header>

      <main className="pb-20 pt-14 md:pb-0 md:pt-32">
        {/* Mobile hero name */}
        <section className="mb-8 px-6 md:hidden">
          <span className="mb-2 block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            New Face / Editorial
          </span>
          <h1 className="font-headline text-6xl font-black uppercase leading-none tracking-tighter">
            {firstName}
            <br />
            {lastName}
          </h1>
        </section>

        {/* Mobile profile + measurements */}
        <section className="mb-16 grid grid-cols-12 gap-0 md:hidden">
          <div className="col-span-8 overflow-hidden">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={photo}
                alt={m.nombre}
                fill
                sizes="70vw"
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                priority
              />
            </div>
          </div>
          <div className="col-span-4 flex flex-col items-start justify-center space-y-6 pl-4 pr-2">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="mb-1 font-label text-[9px] uppercase tracking-widest text-outline">{s.label}</span>
                <span className="font-headline text-lg font-bold italic">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Desktop hero name */}
        <section className="mb-32 hidden grid-cols-12 items-end gap-8 px-12 md:grid">
          <div className="col-span-12 md:col-span-9">
            <h1 className="mb-4 font-headline text-[12vw] font-black uppercase leading-[0.85] tracking-tighter text-primary">
              {firstName}<br />{lastName}
            </h1>
            <div className="flex items-center gap-3 text-secondary">
              <span className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em]">Premier Division</span>
            </div>
          </div>
          <div className="col-span-12 pb-4 md:col-span-3">
            <Link
              href={isClient ? "#booking" : "/register"}
              className="block w-full bg-secondary py-6 px-8 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-on-secondary transition-colors duration-150 hover:bg-tertiary active:scale-95"
            >
              {isClient ? "Book now" : "Register to book"}
            </Link>
          </div>
        </section>

        {/* Desktop profile + measurements */}
        <section className="mb-48 hidden px-12 md:block">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                <Image src={photo} alt={m.nombre} fill sizes="60vw" className="object-cover" priority />
              </div>
            </div>
            <div className="col-span-12 flex flex-col justify-center md:col-span-4 md:col-start-9">
              {m.bio_profesional && (
                <p className="mb-8 max-w-sm font-body text-sm leading-relaxed text-on-surface/80">{m.bio_profesional}</p>
              )}
              {stats.length > 0 && (
                <div className="space-y-6 border-l border-outline-variant/20 pl-8">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2">
                      <span className="font-label text-[0.625rem] uppercase tracking-widest opacity-40">{s.label}</span>
                      <span className="font-body text-sm font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile bio */}
        {m.bio_profesional ? (
          <section className="mb-12 px-6 md:hidden">
            <h3 className="mb-3 font-headline text-xs font-bold uppercase tracking-widest text-secondary">
              About
            </h3>
            <p className="font-body text-sm leading-relaxed text-on-surface/75">
              {m.bio_profesional}
            </p>
          </section>
        ) : null}

        {/* Mobile booking section */}
        <section
          id="booking-mobile"
          className="px-6 pb-8 md:hidden"
        >
          <div className="mb-8 space-y-4 text-center">
            <h3 className="font-headline text-4xl font-black uppercase tracking-tighter">
              Book {firstName}
            </h3>
            <p className="mx-auto max-w-xs font-label text-sm text-outline">
              Currently accepting bookings for New York and Milan Fashion Week.
            </p>
          </div>
          {isClient ? (
            <BookingForm
              modelId={id}
              modelName={m.nombre}
              clientEmail={userEmail}
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/register"
                className="w-full max-w-md bg-secondary py-6 text-center font-headline font-bold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-tertiary active:scale-[0.98]"
              >
                Register to book
              </Link>
              <p className="font-label text-[0.625rem] uppercase tracking-widest text-primary/40">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-secondary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </section>

        {/* Desktop booking section */}
        <section
          id="booking"
          className="hidden px-12 py-32 md:block"
        >
          <h2 className="mb-12 text-center font-headline text-7xl font-black uppercase tracking-tighter text-primary lg:text-8xl">
            Book {firstName}
          </h2>
          {isClient ? (
            <div className="mx-auto max-w-2xl">
              <BookingForm
                modelId={id}
                modelName={m.nombre}
                clientEmail={userEmail}
              />
            </div>
          ) : (
            <div className="mx-auto max-w-md text-center">
              <p className="mb-8 font-body text-sm text-primary/60">
                Create an account as a client to request a booking for this model.
              </p>
              <Link
                href="/register"
                className="block w-full bg-secondary py-8 font-headline text-[0.875rem] font-bold uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-tertiary"
              >
                Register to book
              </Link>
              <p className="mt-4 font-label text-[0.625rem] uppercase tracking-widest text-primary/40">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-secondary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </section>

        {/* Mobile floating booking button */}
        <div className="fixed bottom-20 right-6 z-40 md:hidden">
          <Link
            href={isClient ? "#booking-mobile" : "/register"}
            className="flex h-14 w-14 items-center justify-center bg-secondary text-on-primary shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">mail</span>
          </Link>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav role="public" />
    </>
  );
}
