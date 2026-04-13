import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

type Stats = { label: string; value: string }[];

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

  const stats: Stats = [];
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
      <header className="fixed left-0 right-0 top-0 z-50 bg-surface">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
          <Link
            href="/"
            className="font-headline text-2xl font-black uppercase tracking-tighter text-primary md:text-3xl"
          >
            Catwalk
          </Link>
          <div className="hidden items-center gap-8 md:flex md:gap-12">
            <Link
              href="/#roster"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-secondary border-b-2 border-secondary pb-1"
            >
              Models
            </Link>
            <Link
              href="/#philosophy"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 hover:opacity-100 transition-opacity duration-150"
            >
              Philosophy
            </Link>
            <Link
              href="/register"
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 hover:opacity-100 transition-opacity duration-150"
            >
              Apply
            </Link>
          </div>
          <Link
            href="/login"
            className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 hover:opacity-100 transition-opacity duration-150"
          >
            Client Login
          </Link>
        </nav>
      </header>

      <main className="pt-32">
        {/* Hero Name */}
        <section className="mb-32 grid grid-cols-12 gap-8 px-6 md:px-12 items-end">
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-headline text-[12vw] font-black uppercase leading-[0.85] tracking-tighter text-primary mb-4">
              {firstName}
              <br />
              {lastName}
            </h1>
            <div className="flex items-center gap-3 text-secondary">
              <span className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em]">
                Premier Division
              </span>
            </div>
          </div>
          <div className="col-span-12 pb-4 md:col-span-3">
            <Link
              href="/login"
              className="block w-full bg-secondary py-6 px-8 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-on-secondary transition-colors duration-150 hover:bg-tertiary active:scale-95"
            >
              Request booking
            </Link>
          </div>
        </section>

        {/* Profile + Measurements */}
        <section className="mb-48 px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                <Image
                  src={photo}
                  alt={`Editorial portrait — ${m.nombre}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="col-span-12 flex flex-col justify-center md:col-span-4 md:col-start-9">
              {m.bio_profesional && (
                <p className="mb-8 max-w-sm font-body text-sm leading-relaxed text-on-surface/80">
                  {m.bio_profesional}
                </p>
              )}
              {stats.length > 0 && (
                <div className="space-y-6 border-l border-outline-variant/20 pl-8">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2"
                    >
                      <span className="font-label text-[0.625rem] uppercase tracking-widest opacity-40">
                        {s.label}
                      </span>
                      <span className="font-body text-sm font-semibold">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="mb-64 px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 mb-16 md:col-span-8 md:col-start-3 md:mb-32">
              <div className="group relative aspect-video w-full overflow-hidden bg-surface-container-low">
                <Image
                  src={PORTFOLIO_IMAGES[0]}
                  alt="Runway motion"
                  fill
                  sizes="80vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="bg-primary px-3 py-1 font-label text-[0.6875rem] uppercase tracking-widest text-on-primary">
                    Vogue Editorial, 2024
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 md:translate-y-24">
              <div className="group relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                <Image
                  src={PORTFOLIO_IMAGES[1]}
                  alt="Avant-garde look"
                  fill
                  sizes="40vw"
                  className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <div className="group relative aspect-[2/3] w-full overflow-hidden bg-surface-container-low">
                <Image
                  src={PORTFOLIO_IMAGES[2]}
                  alt="Street editorial"
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="col-span-12 mt-16 md:col-span-4 md:col-start-2 md:mt-48">
              <div className="relative aspect-[3/5] w-full overflow-hidden bg-surface-container-low">
                <Image
                  src={PORTFOLIO_IMAGES[3]}
                  alt="Shadow play"
                  fill
                  sizes="33vw"
                  className="object-cover grayscale"
                />
              </div>
            </div>
            <div className="col-span-12 self-center md:col-span-5 md:col-start-7">
              <h3 className="mb-6 font-headline text-4xl font-bold uppercase leading-tight">
                Raw.
                <br />
                Unfiltered.
                <br />
                Timeless.
              </h3>
              <p className="max-w-xs font-body text-sm uppercase leading-loose tracking-widest opacity-60">
                Captured exclusively for the &ldquo;Monolith&rdquo; series. Shot on
                35mm film.
              </p>
            </div>
          </div>
        </section>

        {/* Booking CTA */}
        <section className="bg-primary px-6 py-24 text-center md:px-12 md:py-32">
          <h2 className="mb-12 font-headline text-5xl font-black uppercase tracking-tighter text-on-primary md:text-7xl lg:text-8xl">
            Book {firstName}
          </h2>
          <div className="mx-auto max-w-md">
            <Link
              href="/login"
              className="block w-full bg-secondary py-8 font-headline text-[0.875rem] font-bold uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-tertiary"
            >
              Send booking inquiry
            </Link>
            <div className="mt-8 flex justify-center gap-8">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/40">
                Comp Card PDF
              </span>
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-primary/40">
                Portfolio Zip
              </span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
