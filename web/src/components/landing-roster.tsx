import Image from "next/image";
import Link from "next/link";
import type { ModelProfile } from "@/types/database";

const PLACEHOLDER_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtyUcZ2AEVci9IPSppHBa16vrY8-wEcqdHAmBlWpmIJTvfleX9UPsmFFvlgBKZ2xYvE2cHSYB7fAhz4NYVwTzZjDr8ZvBWDxqWfz9RN1PQP9HKAodG3k92Ufw74L4r2pmpsh2Q181Kygz5Tud02CIuG62set0NBLYvEHrPCMep178KFREqC0YqEqcUDVynTCUDzWzxUI7PqQWNOe2Hoq821u_M_X87bKHPZ-04QALAVW4kDDHFGN1RTkS8x5b65z7tTyQJ4uI0g",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBWmiTUMmIRcbElm_glmI4-Z-kmhfix817JLn5aNiP3RRXw4ij6t3_4CXUq7dkc5-2Z1YjmDGMcMNfepyAt4L7x8S0DFQZU3cJHX8mhH4t3Aty1TavUH0sCWkq4hEiA2kIV3EdzlAm2cmoxvbg5RjyPnf2PUSMfmM6kjCVLwL7EKU1dAx2_ak_8bOvtL23dFJ54hmDSoKR3Ij1mCPnfIsyxV-GGNNQjAc2lOKz7brWsfeuSzOEdnXZMFwUEcQ6W2yGYBiXgFlrNBw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBpnzgjZoHdONkZCQSIcVHreq9DnAKgQ8iQQr6ZmXSZtCvXvlp_P1N81Ix1Y17nf6jVLxdiKyAAkZURNa0sZOuEpDUz9jsSnUqv6Ceap46zMSFgOeivfx2SMgNZ5RDk2DaSWM_IpVxGR87Yg1kSA3PLCLP5MhiVNx9KL8hj3MbNSzuAKlXAdFP0plNK08699f8eF8syI_60t17OBIfQOVXb5Z62AvK_UHIZ1nUSdpXcBPYlJqbd4x0Iv02tUv_BdVdqKtobzHhPmQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxfwHbnmCcyP9ktbEyz6GVLWi_w7epTrQY7pBy9A57bc4kMxnYZqjpEWMAz8QVftg0aQni8VypzeoPjdmOlr51Bhb7oSlJocp85Mt42nWhuOPgnS-br_6HLloBg65gIAGTExNYKiSHL6R65mO-CV5M4j8w4kGvAoM69nXZxP_HDScbhOP_yvwA4UylGPVx74S7UTw-daRE3LsZmSfptOV2aHWxp5bIiwlkaUkyVm_Xd5QuYu_n-L1FHvkkaSgXEPy6qlDBRCc01A",
];

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
              const photo =
                m.foto_url ?? PLACEHOLDER_PHOTOS[i % PLACEHOLDER_PHOTOS.length];
              return (
                <div key={m.user_id} className={grid}>
                  <Link href={`/model/${m.user_id}`} className="group block">
                    <div
                      className={`relative ${aspect} w-full overflow-hidden bg-surface-container-high`}
                    >
                      <Image
                        src={photo}
                        alt={m.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
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
