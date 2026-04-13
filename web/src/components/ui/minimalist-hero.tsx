"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MinimalistHeroNavLink {
  label: string;
  href: string;
}

export interface MinimalistHeroSocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export interface MinimalistHeroProps {
  logoText: string;
  navLinks: MinimalistHeroNavLink[];
  mainText: string;
  readMoreHref: string;
  readMoreLabel?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: { part1: string; part2: string };
  socialLinks: MinimalistHeroSocialLink[];
  locationText: string;
  showBuiltInHeader?: boolean;
  applyHref?: string;
  loginHref?: string;
  applyLabel?: string;
  loginLabel?: string;
  className?: string;
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-headline text-[0.6875rem] uppercase tracking-widest text-white/50 transition-colors duration-150 hover:text-secondary"
    >
      {children}
    </Link>
  );
}

function SocialIcon({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 transition-colors hover:text-secondary"
    >
      <Icon className="h-5 w-5" strokeWidth={1.25} aria-hidden />
    </a>
  );
}

export function MinimalistHero({
  logoText,
  navLinks,
  mainText,
  readMoreHref,
  readMoreLabel = "Descubrir ethos",
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  showBuiltInHeader = false,
  applyHref = "/register",
  loginHref = "/login",
  applyLabel = "Apply",
  loginLabel = "Model login",
  className,
}: MinimalistHeroProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-stretch justify-between overflow-x-hidden bg-primary px-5 py-8 font-body sm:px-8 md:min-h-[calc(100dvh-7rem)] md:overflow-y-visible md:px-6 md:py-8 lg:px-12 xl:px-16",
        className,
      )}
    >
      {showBuiltInHeader ? (
        <header className="z-30 mb-8 flex w-full items-center justify-between self-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="font-headline text-xl font-black uppercase tracking-tighter text-white"
          >
            {logoText}
          </motion.div>
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
      ) : null}

      {/* Full-bleed editorial width: sides anchor to edges, center column carries the figure */}
      <div className="relative mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 items-center gap-10 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.38fr)_minmax(0,1fr)] md:items-end md:gap-x-6 md:gap-y-0 md:py-0 md:pb-10 lg:gap-x-10 xl:gap-x-14">
        {/* Left — brand name + copy + CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.0 }}
          className="z-20 order-2 max-w-lg justify-self-center text-center md:order-1 md:max-w-lg md:justify-self-start md:text-left"
        >
          {/* Brand name — large, impossible to miss */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
            className="mb-6 font-headline text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white sm:text-6xl md:mb-8 md:text-7xl lg:text-8xl"
          >
            {logoText}
          </motion.h2>
          <p className="mx-auto font-body text-sm leading-relaxed text-white/70 md:mx-0 md:text-base lg:text-lg">
            {mainText}
          </p>
          <Link
            href={readMoreHref}
            className="mt-5 inline-block border-b border-secondary/60 pb-0.5 font-label text-[0.6875rem] uppercase tracking-widest text-secondary transition-colors hover:border-secondary hover:text-white"
          >
            {readMoreLabel}
          </Link>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href={applyHref}
              className="inline-flex min-h-14 items-center justify-center bg-secondary px-10 py-4 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-white transition-colors hover:bg-tertiary"
            >
              {applyLabel}
            </Link>
            <Link
              href={loginHref}
              className="inline-flex min-h-14 items-center justify-center border border-white/25 px-10 py-4 text-center font-headline text-[0.75rem] font-bold uppercase tracking-widest text-white/90 transition-colors hover:border-secondary hover:text-secondary"
            >
              {loginLabel}
            </Link>
          </div>
        </motion.div>

        {/* Center — person emerges from below (scale on inner div so it does not fight motion transform) */}
        <div className="relative order-1 flex min-h-[min(58vh,512px)] w-full items-end justify-center overflow-visible md:order-2 md:min-h-[min(66vh,720px)] lg:min-h-[min(68vh,768px)]">
          {/* 1) Solid terracota circle — rises up first */}
          <motion.div
            initial={{ opacity: 0, y: 140, scale: 0.65 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.75, ease: "easeOut", delay: 0.45 },
              y: { type: "spring", stiffness: 64, damping: 22, delay: 0.45 },
              scale: { type: "spring", stiffness: 70, damping: 20, delay: 0.45 },
            }}
            className="absolute bottom-[10%] z-0 aspect-square h-[min(72vw,336px)] rounded-full bg-secondary/35 md:bottom-[8%] md:h-[min(46vw,480px)] lg:bottom-[7%] lg:h-[min(42vw,540px)] xl:h-[min(38vw,580px)]"
            aria-hidden
          />

          {/* 2) Soft glow — follows the circle */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeOut", delay: 0.65 },
              y: { type: "spring", stiffness: 58, damping: 24, delay: 0.65 },
            }}
            className="absolute bottom-[6%] z-0 aspect-square h-[min(82vw,400px)] rounded-full bg-secondary/25 blur-[72px] md:bottom-[4%] md:h-[min(54vw,580px)] lg:h-[min(48vw,640px)] xl:h-[min(44vw,680px)]"
            aria-hidden
          />

          {/* 3) Person — ~20% smaller than previous; spring in after circle */}
          <motion.div
            initial={{ opacity: 0, y: "36%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.55, ease: "easeOut", delay: 0.95 },
              y: {
                type: "spring",
                stiffness: 52,
                damping: 20,
                mass: 0.85,
                delay: 0.95,
              },
            }}
            className="relative z-10 flex h-[min(70vh,544px)] w-full max-w-[min(88vw,480px)] items-end justify-center md:h-[min(69vh,656px)] md:max-w-none md:w-[min(100%,52vw)] lg:w-[min(100%,48vw)] xl:w-[min(100%,44vw)]"
          >
            <div className="relative h-[90%] w-full max-w-[min(88vw,640px)] origin-bottom scale-[1.24] md:max-w-[min(100%,720px)] md:scale-[1.56] lg:max-w-[min(100%,800px)] lg:scale-[1.8]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 88vw, (max-width: 1280px) 52vw, 800px"
                className="object-contain object-bottom"
              />
            </div>
          </motion.div>
        </div>

        {/* Right — editorial headline (appears with person) — large and bold */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.0 }}
          className="z-20 order-3 flex flex-col justify-center text-center md:justify-self-end md:items-end md:text-right"
        >
          <h1 className="font-headline text-6xl font-black uppercase leading-[0.88] tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]">
            <span className="block text-white">{overlayText.part1}</span>
            <span className="mt-1 block font-normal italic text-secondary">
              {overlayText.part2}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Footer bar */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="z-30 mt-10 flex w-full max-w-[1920px] flex-col items-center justify-between gap-6 self-center border-t border-white/10 pt-8 sm:flex-row"
      >
        <div className="flex items-center gap-5">
          {socialLinks.map((link, index) => (
            <SocialIcon
              key={index}
              href={link.href}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
        <p className="text-center font-label text-[0.6875rem] uppercase tracking-[0.2em] text-white/40">
          {locationText}
        </p>
      </motion.footer>
    </div>
  );
}
