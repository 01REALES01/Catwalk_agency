import Image from "next/image";
import Link from "next/link";
import { LandingRoster } from "@/components/landing-roster";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jhlQlEm3wKwWh3LBsFwlSQB2nLeU24BXW5_35DfTxNkJaKKpZyXM3sf0fai_OkXIguSEWgVMQars0HMnorNb1zaQmvUHDyQIQUmdEt2mPzEqkbmf0Ex1fTQ7W4jfzjW--s2--B50HtAAPX7NlB4SoWnQ8RRmcS9EQeADbV1vOYpnlUQQOHWG2j2rimplo9HjlgA-fpC81eA600-a3sRGAsyGLakFV_qIAO7cg9fe0A66gL4MyOKXBy6PSvyTMve2RyJC-tVHlQ";

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
      <main className="pt-24">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-12">
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
              <p className="font-label max-w-xs text-[0.6875rem] uppercase tracking-[0.2em]">
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

        <section
          id="philosophy"
          className="section-philosophy bg-surface px-6 py-24 md:px-12 md:py-48"
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7">
              <span className="mb-8 block font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
                Our ethos
              </span>
              <h2 className="font-headline text-5xl font-black uppercase leading-tight tracking-tighter text-primary md:text-7xl md:leading-none">
                Where elegance <br /> meets the <br />{" "}
                <span className="font-normal italic">runway.</span>
              </h2>
            </div>
            <div className="col-span-12 mt-12 md:col-span-4 md:col-start-9 md:mt-auto">
              <p className="mb-8 font-body text-lg leading-relaxed text-primary-fixed-dim">
                We don&apos;t just represent models; we curate personas that
                redefine the visual landscape of high fashion. At Catwalk,
                silence is the ultimate statement.
              </p>
              <button
                type="button"
                className="font-label border-b-2 border-primary pb-2 text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-secondary hover:text-secondary"
              >
                Discover the philosophy
              </button>
            </div>
          </div>
        </section>

        <LandingRoster models={models} />

        <section className="px-6 py-24 md:px-12 md:py-48">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-12 border border-outline-variant/20 bg-primary p-8 text-white md:flex-row md:p-24">
            <div>
              <h2 className="mb-4 font-headline text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl lg:text-7xl">
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
    </>
  );
}
