import Image from "next/image";
import Link from "next/link";
import type { ModelProfile } from "@/types/database";

function rosterLayout(i: number) {
  const mod = i % 4;
  const grid =
    mod === 0
      ? "col-span-12 md:col-span-6 lg:col-span-5"
      : mod === 1
        ? "col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7 asymmetric-offset"
        : mod === 2
          ? "col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-2"
          : "col-span-12 md:col-span-4 lg:col-span-5 lg:col-start-7";
  const aspect =
    mod === 1 ? "aspect-[4/5]" : mod === 2 ? "aspect-square" : "aspect-[3/4]";
  return { grid, aspect };
}

export function LandingRoster({ models }: { models: ModelProfile[] }) {
  return (
    <section
      id="roster"
      className="bg-surface-container-low px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex items-end justify-between md:mb-24">
          <h3 className="font-headline text-4xl font-black uppercase tracking-tighter text-primary md:text-5xl">
            Elite roster
          </h3>
          <div className="mb-4 hidden h-[2px] w-1/3 bg-outline-variant opacity-20 md:block" />
        </div>

        {models.length === 0 ? (
          <p className="max-w-xl font-body text-lg leading-relaxed text-primary-fixed-dim">
            Aún no hay perfiles públicos. Las modelos registradas aparecerán aquí
            al completar su ficha.
          </p>
        ) : (
          <div className="grid grid-cols-12 gap-x-12 gap-y-24 md:gap-y-32">
            {models.map((m, i) => {
              const { grid, aspect } = rosterLayout(i);
              if (!m.foto_url) return null;
              return (
                <div key={m.user_id} className={grid}>
                  <Link href={`/model/${m.user_id}`} className="group block">
                    <div
                      className={`relative ${aspect} w-full overflow-hidden bg-surface-container-high`}
                    >
                      <Image
                        src={m.foto_url}
                        alt={m.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      {m.featured ? (
                        <div className="absolute left-4 top-4">
                          <span className="bg-secondary px-3 py-1.5 font-label text-[0.5625rem] uppercase tracking-widest text-white">
                            Featured
                          </span>
                        </div>
                      ) : null}
                      <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="bg-primary px-4 py-2 font-label text-[0.6875rem] uppercase tracking-widest text-white">
                          {m.color_ojos
                            ? `${m.color_ojos} eyes`
                            : "On roster"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-headline text-2xl font-bold uppercase tracking-tighter text-primary">
                        {m.nombre}
                      </h4>
                      <p className="font-label text-[0.6875rem] uppercase tracking-[0.1em] text-primary opacity-60">
                        {m.medidas ?? "Measurements on file"}
                        {m.altura != null ? ` · ${m.altura} cm` : ""}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
