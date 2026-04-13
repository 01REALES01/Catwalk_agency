import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

const PORTFOLIO_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JOjJyjXR3-VHhfS-RVb2XKwS-WfQQAvqIlCkHrbWvEMASOJXSNluUE6bYL-QDL3uHzsAjjeQSItM5lzofd9MJvqw58bljEqM5matjEqeX4NXERlfHEoHUJ4wq7JDRcq0XaNyqxmQ4kXagVxF1PAdKLl8P47T72vkfv2-NviFoMlrucA6PPpT-SxveiIqRFVTiKsdvxqgtLKiAjdCUaqFdTLEUTvbMd15PfgancUymFLqnSPG6flRwYgSltvMbpv08Ot7G-qoZQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZcFwQXgMIps5jx0_aR4Fr_zCypfq5MmdvJykLgtyz6WTV8zLVklDQ8YPJ87GF4yGGa6Um-MOXOmWekGSvJvlwMAlxYJdMEaHfIh7kA-LZIJ8I1F_DqnCOX95WH3ydJuCLdxL8oJdR49RAHoUEBax1z0sx-KxkMKk04_2tFPFWUIBbZ91_HZkxMOe7i0JJapnJsyE8VIEO5d2-MCzik2Iby6Hg2fjYBJ8cydrbFM0ujIEhvsUQp2aTYHmnI6vs0CwF-GfE3W3sAg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCMYJzAjFcs79lzhSYovclq1eZJ-ks_QhNUrKdGdt9CvQhMKkL51swRxLlotKb_zvwrtVRnh9LQH60wpJNl71JAl8okgz04YlrUUorPGVxjG-00IOiAYGfEjSpCv2UNXXg4vCVMzin7n2O3aYSjcIj3UBFcU9WM3NpY8LXOz2V-cpv5ydk8-NNnjFnvIWhARAuuBEA8fAYpdyBPJXExLWR0ISSHG7HxY9ESZOX3fGmEdDB7SSOHLSaGvZxgWeZjtUcLVNyFnzw9aQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC6-4eoozlXUGPa36XNSxYP4ZnmTY8kjsq621LJcSSztsRBqLAS7BNYqlW3I2r0o3HjeQ6FefCcTjdwync1VPp6tccIAc2WZFXqXmOu3E5-GG69-c6YdExigZUkHzEMd1eKyiSpXqL4X1FJZBw_dbIUNOD7QTglwgeZjtqGfMKJN82I8vS7TVCnzNi4EkYaROwt69MESaPYUm5Jcdey4kcre6zIhOQQhVvSZmSiqKWsPHEanLbhn1lQZwrAU6c91inj6WtLlS4ToA",
];

const MAIN_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDD0kR1Lze66LcS-BADWJz5CCPe7kzBgtPEztcVrJi6w2RvYgTitMB-vCeAdj1vd0mqBmGrueo4wvbp3fyduk9Wm8XZIWupJ-V-s--OIuq951Yioc9_9TAL2PSZyVE4TT9V73KbKXMxkdc9XCbSnVfH6A0n54IL1JzjCvgHR5kI8M1p_CSP4z0Wgf24Wx0oKkQ6RVhCZgUmHdQZOsAM-Krn6viZAvWzH5LtznsRlyjumiGvN9ADNXJjPCcYEBRNPCMNl-oeGv_bVw";

type Stat = { label: string; value: string };

export default async function ModelPortfolioPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("model_profiles")
    .select("*")
    .eq("user_id", params.id)
    .maybeSingle();

  if (!profile) notFound();
  const m = profile as ModelProfile;

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

  const photo = m.foto_url ?? MAIN_PHOTO;
  const firstName = m.nombre.split(" ")[0];
  const lastName = m.nombre.split(" ").slice(1).join(" ");

  return (
    <>
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between border-b-[0.5px] border-primary/10 bg-surface px-6 py-4 md:hidden">
        <Link href="/" className="font-headline text-2xl font-black uppercase tracking-tighter text-primary">
          Catwalk
        </Link>
      </header>

      {/* Desktop header */}
      <header className="fixed left-0 right-0 top-0 z-50 hidden bg-surface md:block">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-12 py-8">
          <Link href="/" className="font-headline text-3xl font-black uppercase tracking-tighter text-primary">Catwalk</Link>
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
            <Link href="/login" className="block w-full bg-secondary py-6 px-8 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-on-secondary transition-colors duration-150 hover:bg-tertiary active:scale-95">
              Request booking
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

        {/* Mobile editorial gallery */}
        <section className="mb-16 space-y-8 px-6 md:hidden">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image src={PORTFOLIO_IMAGES[0]} alt="Editorial 1" fill sizes="100vw" className="object-cover" />
              </div>
              <p className="mt-3 font-label text-[10px] uppercase tracking-widest text-outline">Paris Collection — 2024</p>
            </div>
          </div>
          <div className="bg-primary p-8 text-center md:p-24">
            <h2 className="mb-6 font-headline text-3xl font-black uppercase italic leading-tight text-on-primary">
              &ldquo;Fashion is the armor to survive the reality of everyday life.&rdquo;
            </h2>
            <div className="mx-auto h-px w-12 bg-secondary" />
          </div>
          <div className="grid grid-cols-12 items-start gap-4">
            <div className="col-span-5">
              <div className="relative aspect-[3/5] w-full overflow-hidden">
                <Image src={PORTFOLIO_IMAGES[1]} alt="Editorial 2" fill sizes="40vw" className="object-cover" />
              </div>
            </div>
            <div className="col-span-7">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={PORTFOLIO_IMAGES[2]} alt="Editorial 3" fill sizes="60vw" className="object-cover" />
              </div>
              <p className="mt-3 text-right font-label text-[10px] uppercase tracking-widest text-outline">Vogue Italia / Digital</p>
            </div>
          </div>
        </section>

        {/* Desktop portfolio gallery */}
        <section className="mb-64 hidden px-12 md:block">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 mb-32 md:col-span-8 md:col-start-3">
              <div className="group relative aspect-video w-full overflow-hidden bg-surface-container-low">
                <Image src={PORTFOLIO_IMAGES[0]} alt="Runway motion" fill sizes="80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="bg-primary px-3 py-1 font-label text-[0.6875rem] uppercase tracking-widest text-on-primary">Vogue Editorial, 2024</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 md:translate-y-24">
              <div className="group relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                <Image src={PORTFOLIO_IMAGES[1]} alt="Avant-garde" fill sizes="40vw" className="object-cover grayscale transition-all duration-500 hover:grayscale-0" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <div className="group relative aspect-[2/3] w-full overflow-hidden bg-surface-container-low">
                <Image src={PORTFOLIO_IMAGES[2]} alt="Street editorial" fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
            <div className="col-span-12 mt-16 md:col-span-4 md:col-start-2 md:mt-48">
              <div className="relative aspect-[3/5] w-full overflow-hidden bg-surface-container-low">
                <Image src={PORTFOLIO_IMAGES[3]} alt="Shadow play" fill sizes="33vw" className="object-cover grayscale" />
              </div>
            </div>
            <div className="col-span-12 self-center md:col-span-5 md:col-start-7">
              <h3 className="mb-6 font-headline text-4xl font-bold uppercase leading-tight">Raw.<br />Unfiltered.<br />Timeless.</h3>
              <p className="max-w-xs font-body text-sm uppercase leading-loose tracking-widest opacity-60">Captured exclusively for the &ldquo;Monolith&rdquo; series. Shot on 35mm film.</p>
            </div>
          </div>
        </section>

        {/* Mobile CTA */}
        <section className="flex flex-col items-center justify-center space-y-8 px-6 pb-8 md:hidden">
          <div className="space-y-4 text-center">
            <h3 className="font-headline text-4xl font-black uppercase tracking-tighter">Secure availability</h3>
            <p className="mx-auto max-w-xs font-label text-sm text-outline">
              Currently accepting bookings for New York and Milan Fashion Week.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full max-w-md bg-secondary py-6 text-center font-headline font-bold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-tertiary active:scale-[0.98]"
          >
            Request booking
          </Link>
          <div className="flex space-x-8">
            <span className="border-b border-primary/10 pb-1 font-label text-[10px] uppercase tracking-widest">Portfolio PDF</span>
            <span className="border-b border-primary/10 pb-1 font-label text-[10px] uppercase tracking-widest">Comp Card</span>
          </div>
        </section>

        {/* Desktop booking CTA */}
        <section className="hidden bg-primary px-12 py-32 text-center md:block">
          <h2 className="mb-12 font-headline text-7xl font-black uppercase tracking-tighter text-on-primary lg:text-8xl">
            Book {firstName}
          </h2>
          <div className="mx-auto max-w-md">
            <Link href="/login" className="block w-full bg-secondary py-8 font-headline text-[0.875rem] font-bold uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-tertiary">
              Send booking inquiry
            </Link>
            <div className="mt-8 flex justify-center gap-8">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/40">Comp Card PDF</span>
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/40">Portfolio Zip</span>
            </div>
          </div>
        </section>

        {/* Mobile floating booking button */}
        <div className="fixed bottom-20 right-6 z-40 md:hidden">
          <Link
            href="/login"
            className="flex h-14 w-14 items-center justify-center bg-secondary text-on-primary active:scale-90 transition-transform"
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
