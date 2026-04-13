import { redirect } from "next/navigation";
import { PhotoUpload } from "@/app/dashboard/photo-upload";
import { ProfileForm } from "@/app/dashboard/profile-form";
import { MobileBottomNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ModelProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Profile — Catwalk" };

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const p = profile as ModelProfile | null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="model" />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-20 md:px-12 md:pb-32 md:pt-40">
        <header className="mb-10 md:mb-16">
          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary md:mb-3 md:text-[0.6875rem]">
            Profile settings
          </p>
          <h1 className="font-headline text-3xl font-black uppercase leading-none tracking-tighter md:text-5xl">
            Edit Profile
          </h1>
        </header>

        {/* Photo upload */}
        <section className="mb-10 md:mb-14">
          <p className="mb-4 font-label text-[0.5625rem] uppercase tracking-widest text-primary/45 md:text-[0.625rem]">
            Profile photo
          </p>
          <PhotoUpload userId={user.id} currentUrl={p?.foto_url ?? null} />
        </section>

        {/* Profile form */}
        <section className="mb-10 md:mb-14">
          <p className="mb-4 font-label text-[0.5625rem] uppercase tracking-widest text-primary/45 md:text-[0.625rem]">
            Measurements &amp; info
          </p>
          <ProfileForm profile={p} />
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav role="model" />
    </div>
  );
}
