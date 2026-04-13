import Image from "next/image";
import Link from "next/link";
import { CatwalkHomeHero } from "@/components/catwalk-home-hero";
import { LandingRoster } from "@/components/landing-roster";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

const HERO_MOBILE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB6losC1JZxA0YE2a1e3FQOVhxlV4qeaY82lSit6PsaBM5cZVzRvDMTVRi89QfyHeIWXxFtqenSzFPi9jVo5hf4BCMaSmXLpsp03iRuFEfiRejrGepb7TRo7EUonsFbpf1HPYYlW6sxy1Fct9u5SwgqYPtJTk0_1gxUk1vA6LIeagi5avY7fNVOLNl1I2WWS4zAfAnrhi6s6N56gla0uJJGZMDFAB0tGj_dO3WpJmRHHbuWr_sjiOQINcvVGr8iKy2m61WVVYrVdg";

export default async function Home() {
  let models: ModelProfile[] = [];
  let userRole: "admin" | "model" | "client" | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("model_profiles")
      .select("*")
      .order("nombre", { ascending: true });
    models = (data as ModelProfile[]) ?? [];

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("model_profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      userRole = (profile?.role as typeof userRole) ?? null;
    }
  } catch {
    models = [];
  }

  const allTalent = models.filter((m) => m.role !== "admin" && m.role !== "client");
  const featured = allTalent.filter((m) => m.featured);
  const rest = allTalent.filter((m) => !m.featured);
  const talent = [...featured, ...rest];

  return (
    <>
      <SiteHeader role={userRole} />
      <main className="pt-14 pb-16 md:pb-0 md:pt-24">
        {/* Mobile hero — diseño editorial original (full bleed) */}
        <section
          className="relative flex h-[85vh] w-full flex-col justify-end overflow-hidden md:hidden"
          aria-label="Hero"
        >
          <Image
            src={HERO_MOBILE}
            alt="Editorial fashion"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 px-6 pb-24">
            <div>
              <h1 className="font-headline text-7xl font-black uppercase leading-[0.8] tracking-tighter text-surface">
                Catwalk
              </h1>
              <p className="mt-4 max-w-[200px] font-label text-[10px] uppercase tracking-[0.3em] text-surface/60">
                Redefining the digital silhouette since 2024.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center bg-secondary px-6 py-3.5 text-center font-headline text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-tertiary sm:w-auto sm:min-w-[11rem]"
              >
                Apply
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center border border-white/40 px-6 py-3.5 text-center font-headline text-[10px] font-bold uppercase tracking-widest text-surface transition-colors hover:bg-white/10 sm:w-auto sm:min-w-[11rem]"
              >
                Model login
              </Link>
            </div>
          </div>
        </section>

        {/* Desktop hero — minimalista + motion */}
        <section className="hidden w-full md:block" aria-label="Hero">
          <CatwalkHomeHero />
        </section>

        {/* Mobile Ethos */}
        <section className="bg-primary px-6 py-24 text-surface md:hidden">
          <span className="mb-8 block font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
            01 / Our ethos
          </span>
          <h2 className="mb-12 font-headline text-4xl font-bold uppercase italic leading-tight">
            The Monolith <br />
            of Expression.
          </h2>
          <p className="mb-8 max-w-sm font-body text-sm leading-relaxed text-surface/70">
            We don&apos;t represent faces; we curate legacies. At Catwalk, the
            void is as important as the form.
          </p>
          <Link
            href="/register"
            className="inline-block bg-secondary px-8 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-surface transition-all hover:bg-tertiary"
          >
            Apply to agency
          </Link>
        </section>

        {/* Desktop Philosophy */}
        <section
          id="philosophy"
          className="hidden bg-surface px-12 py-48 md:block"
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7">
              <span className="mb-8 block font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
                Our ethos
              </span>
              <h2 className="font-headline text-7xl font-black uppercase leading-none tracking-tighter text-primary">
                Where elegance <br /> meets the <br />
                <span className="font-normal italic">runway.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 md:mt-auto">
              <p className="mb-8 font-body text-lg leading-relaxed text-primary-fixed-dim">
                We don&apos;t just represent models; we curate personas that
                redefine the visual landscape of high fashion. At Catwalk,
                silence is the ultimate statement.
              </p>
              <Link
                href="/#roster"
                className="border-b-2 border-primary pb-2 font-label text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-secondary hover:text-secondary"
              >
                Explore our roster
              </Link>
            </div>
          </div>
        </section>

        <LandingRoster models={talent} />

        {/* Services — what we offer */}
        <section className="bg-surface px-6 py-24 md:px-12 md:py-48">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-16 md:mb-24">
              <span className="mb-4 block font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
                Our services
              </span>
              <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-7xl">
                What we <br className="hidden md:inline" />
                <span className="font-normal italic">deliver.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-[2px] bg-primary md:grid-cols-3 md:gap-4 md:bg-transparent">
              {[
                {
                  icon: "photo_camera",
                  title: "Editorial & Campaigns",
                  desc: "High-end editorial placements, brand campaigns, and lookbook production with world-class talent.",
                },
                {
                  icon: "straighten",
                  title: "Runway & Events",
                  desc: "Fashion week representation, private show castings, and exclusive event appearances globally.",
                },
                {
                  icon: "handshake",
                  title: "Talent Booking",
                  desc: "Seamless booking experience from inquiry to confirmation. Direct access to our curated roster.",
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col gap-6 bg-surface p-8 md:bg-surface-container-low md:p-12"
                >
                  <span className="material-symbols-outlined text-3xl text-secondary">
                    {s.icon}
                  </span>
                  <h3 className="font-headline text-xl font-bold uppercase tracking-tight md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-primary/60">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Process — how it works */}
        <section className="bg-primary px-6 py-24 text-surface md:px-12 md:py-48">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-16 md:mb-24">
              <span className="mb-4 block font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
                How it works
              </span>
              <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter md:text-7xl">
                Book in <br className="hidden md:inline" />
                <span className="font-normal italic">three steps.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
              {[
                {
                  step: "01",
                  title: "Browse",
                  desc: "Explore our curated roster of international talent. Filter by style, measurements, and availability.",
                },
                {
                  step: "02",
                  title: "Inquire",
                  desc: "Submit a booking request with your project details. Our team reviews every inquiry within 24 hours.",
                },
                {
                  step: "03",
                  title: "Confirm",
                  desc: "Receive confirmation with all logistical details. We handle contracts, scheduling, and coordination.",
                },
              ].map((s) => (
                <div key={s.step} className="flex flex-col gap-4">
                  <span className="font-headline text-5xl font-black text-secondary/40 md:text-7xl">
                    {s.step}
                  </span>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="max-w-xs font-body text-sm leading-relaxed text-surface/60">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-surface-container-low px-6 py-24 md:px-12 md:py-48">
          <div className="mx-auto max-w-[1440px] text-center">
            <span className="material-symbols-outlined mb-8 text-4xl text-secondary">
              format_quote
            </span>
            <blockquote className="mx-auto max-w-3xl font-headline text-2xl font-bold uppercase leading-tight tracking-tight text-primary md:text-4xl">
              &ldquo;Catwalk made the entire process seamless — from casting to
              the final shoot. Their talent is unmatched and the professionalism
              is world-class.&rdquo;
            </blockquote>
            <div className="mt-8 space-y-1">
              <p className="font-headline text-sm font-bold uppercase tracking-widest">
                Elena Marchetti
              </p>
              <p className="font-label text-[0.625rem] uppercase tracking-widest text-primary/40">
                Creative Director — Vogue Italia
              </p>
            </div>
          </div>
        </section>

        {/* Mobile CTA */}
        <section className="flex flex-col items-center bg-surface-container-low px-6 py-32 text-center md:hidden">
          <h3 className="mb-8 font-headline text-3xl font-bold uppercase">
            Join the Vanguard.
          </h3>
          <p className="mb-12 max-w-[280px] font-body text-xs uppercase tracking-wide text-primary-fixed-dim">
            We are constantly seeking the next generation of faces that define
            the cultural zeitgeist.
          </p>
          <Link
            href="/register"
            className="group flex w-full items-center justify-between border-b-2 border-secondary py-6 font-label text-[11px] uppercase tracking-[0.4em]"
          >
            Apply to agency
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
              arrow_forward
            </span>
          </Link>
        </section>

        {/* Desktop CTA */}
        <section className="hidden px-12 py-48 md:block">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-12 border border-outline-variant/20 bg-primary p-24 text-white md:flex-row">
            <div>
              <h2 className="mb-4 font-headline text-7xl font-black uppercase leading-none tracking-tighter">
                Join the <br /> monolith.
              </h2>
              <p className="font-label text-[0.75rem] uppercase tracking-[0.2em] text-white/60">
                Opportunities for talent &amp; global partnerships
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-end md:w-auto md:gap-4">
              <Link
                href="/#roster"
                className="inline-flex min-h-14 w-full items-center justify-center bg-secondary px-10 py-4 text-center font-headline text-[0.8125rem] font-bold uppercase tracking-widest text-white transition-all hover:bg-tertiary active:scale-[0.99] sm:flex-1 md:w-auto md:min-w-[11rem] md:flex-none"
              >
                Hire talent
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-14 w-full items-center justify-center border border-white bg-transparent px-10 py-4 text-center font-headline text-[0.8125rem] font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-primary active:scale-[0.99] sm:flex-1 md:w-auto md:min-w-[11rem] md:flex-none"
              >
                Apply to agency
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-14 w-full items-center justify-center border border-white/40 bg-transparent px-10 py-4 text-center font-headline text-[0.8125rem] font-bold uppercase tracking-widest text-white/90 transition-all hover:border-white hover:text-white sm:flex-1 md:w-auto md:min-w-[11rem] md:flex-none"
              >
                Model login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileBottomNav role="public" />
    </>
  );
}
