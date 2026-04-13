"use client";

import { Globe, Share2 } from "lucide-react";
import { MinimalistHero } from "@/components/ui/minimalist-hero";

const NAV = [
  { label: "Models", href: "/#roster" },
  { label: "Philosophy", href: "/#philosophy" },
  { label: "Apply", href: "/register" },
];

const SOCIAL = [
  { icon: Share2, href: "https://instagram.com", label: "Instagram" },
  { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
];

export function CatwalkHomeHero() {
  return (
    <MinimalistHero
      logoText="Catwalk"
      navLinks={NAV}
      mainText="No representamos solo rostros; curamos presencias que redefinen el paisaje visual de la alta moda. En Catwalk, el silencio es la declaración más fuerte."
      readMoreHref="/#philosophy"
      readMoreLabel="Descubrir ethos"
      imageSrc="/persona_hero_nobg.png"
      imageAlt="Editorial Catwalk — moda y silueta"
      overlayText={{ part1: "Where", part2: "elegance lives." }}
      socialLinks={SOCIAL}
      locationText="London — New York — Milan"
      showBuiltInHeader={false}
      applyHref="/register"
      loginHref="/login"
      applyLabel="Apply"
      loginLabel="Model login"
    />
  );
}
