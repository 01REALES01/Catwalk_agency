import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      {/* Mobile footer */}
      <div className="flex flex-col items-center justify-center space-y-6 bg-primary px-6 py-12 text-center md:hidden">
        <div className="flex space-x-8">
          {["Instagram", "Privacy", "Terms"].map((label) => (
            <Link
              key={label}
              href="#"
              className="font-label text-[10px] uppercase tracking-[0.2em] text-surface/50 transition-colors hover:text-secondary"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-surface/50">
          &copy; {new Date().getFullYear()} Catwalk Agency. All rights reserved.
        </p>
      </div>

      {/* Desktop footer */}
      <div className="hidden bg-surface md:block">
        <div className="mx-auto mt-24 grid w-full max-w-[1440px] grid-cols-12 gap-8 bg-surface-container-low px-12 py-24">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-8 font-headline text-2xl font-black uppercase tracking-tighter text-primary">
              Catwalk
            </div>
            <p className="font-label text-[0.6875rem] uppercase leading-relaxed tracking-[0.1em] text-primary opacity-40">
              &copy; {new Date().getFullYear()} Catwalk Agency. All rights
              reserved.
              <br />
              Crafting the future of the runway.
            </p>
          </div>
          <div className="col-span-6 lg:col-span-2 lg:col-start-7">
            <h5 className="mb-6 font-label text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary">
              Information
            </h5>
            <ul className="space-y-4">
              {["Privacy", "Terms"].map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="font-label text-[0.6875rem] uppercase tracking-[0.1em] text-primary opacity-40 transition-colors duration-150 hover:text-secondary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <h5 className="mb-6 font-label text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary">
              Connect
            </h5>
            <ul className="space-y-4">
              {["Instagram", "LinkedIn"].map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="font-label text-[0.6875rem] uppercase tracking-[0.1em] text-primary opacity-40 transition-colors duration-150 hover:text-secondary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-2">
            <h5 className="mb-6 font-label text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary">
              Global offices
            </h5>
            <p className="font-label text-[0.6875rem] uppercase leading-loose tracking-[0.1em] text-primary opacity-40">
              5th Ave, New York
              <br />
              Via Montenapoleone, Milan
              <br />
              Mayfair, London
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
