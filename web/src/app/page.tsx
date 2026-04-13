import Image from "next/image";
import Link from "next/link";
import { LandingRoster } from "@/components/landing-roster";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jhlQlEm3wKwWh3LBsFwlSQB2nLeU24BXW5_35DfTxNkJaKKpZyXM3sf0fai_OkXIguSEWgVMQars0HMnorNb1zaQmvUHDyQIQUmdEt2mPzEqkbmf0Ex1fTQ7W4jfzjW--s2--B50HtAAPX7NlB4SoWnQ8RRmcS9EQeADbV1vOYpnlUQQOHWG2j2rimplo9HjlgA-fpC81eA600-a3sRGAsyGLakFV_qIAO7cg9fe0A66gL4MyOKXBy6PSvyTMve2RyJC-tVHlQ";

const HERO_MOBILE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB6losC1JZxA0YE2a1e3FQOVhxlV4qeaY82lSit6PsaBM5cZVzRvDMTVRi89QfyHeIWXxFtqenSzFPi9jVo5hf4BCMaSmXLpsp03iRuFEfiRejrGepb7TRo7EUonsFbpf1HPYYlW6sxy1Fct9u5SwgqYPtJTk0_1gxUk1vA6LIeagi5avY7fNVOLNl1I2WWS4zAfAnrhi6s6N56gla0uJJGZMDFAB0tGj_dO3WpJmRHHbuWr_sjiOQINcvVGr8iKy2m61WVVYrVdg";

export default async function Home() {
  let models: ModelProfile[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("model_profiles")
      .select("*")
      .order("nombre", { ascending: true });
    models = (data as ModelProfile[]) ?? [];
  } catch {
    models = [];
  }

  return (
    <>
      <SiteHeader />
      <main className="pt-14 pb-16 md:pb-0 md:pt-24">
        {/* Mobile Hero */}
        <section className="relative flex h-[85vh] w-full flex-col justify-end overflow-hidden md:hidden">
          <Image
            src={HERO_MOBILE}
            alt="Editorial fashion"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="relative z-10 px-6 pb-24">
            <h1 className="font-headline text-7xl font-black uppercase leading-[0.8] tracking-tighter text-surface">
              Catwalk
            </h1>
            <p className="mt-4 max-w-[200px] font-label text-[10px] uppercase tracking-[0.3em] text-surface/60">
              Redefining the digital silhouette since 2024.
            </p>
          </div>
        </section>

        {/* Desktop Hero */}
        <section className="relative hidden min-h-screen flex-col items-center justify-center overflow-hidden px-12 md:flex">
          <div className="absolute inset-0 z-0">
            <Image
              src={HERO}
              alt="Editorial fashion photography"
              fill
              priority
              className="object-cover brightness-95 grayscale"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 w-full max-w-[1440px]">
            <h1 className="editorial-shadow select-none text-center font-headline text-[12vw] font-black leading-none tracking-tighter text-white mix-blend-difference">
              Catwalk
            </h1>
            <div className="mt-12 flex flex-col justify-between gap-8 border-t border-white/20 pt-8 text-white md:flex-row md:items-end">
              <p className="max-w-xs font-label text-[0.6875rem] uppercase tracking-[0.2em]">
                Established MMXXIV <br /> London — New York — Milan
              </p>
              <Link
                href="/register"
                className="bg-secondary px-12 py-5 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-tertiary"
              >
                Apply to agency
              </Link>
            </div>
          </div>
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
              <button
                type="button"
                className="border-b-2 border-primary pb-2 font-label text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-secondary hover:text-secondary"
              >
                Discover the philosophy
              </button>
            </div>
          </div>
        </section>

        <LandingRoster models={models} />

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
            <div className="flex w-full flex-col gap-6 sm:flex-row md:w-auto">
              <Link
                href="/#roster"
                className="bg-secondary px-12 py-6 text-center font-headline text-[0.875rem] font-bold uppercase tracking-widest text-white transition-all hover:bg-tertiary active:scale-95"
              >
                Hire talent
              </Link>
              <Link
                href="/register"
                className="border border-white bg-transparent px-12 py-6 text-center font-headline text-[0.875rem] font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-primary active:scale-95"
              >
                Apply to agency
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
