"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function PhotoUpload({
  userId,
  currentUrl,
}: {
  userId: string;
  currentUrl: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/profile.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("model-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("model-photos").getPublicUrl(path);

    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("model_profiles")
      .update({ foto_url: publicUrl })
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setPreview(urlWithCacheBust);
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
      {/* Photo preview */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative h-32 w-32 shrink-0 overflow-hidden border border-outline-variant/20 bg-surface-container-low transition-all hover:border-secondary sm:h-40 sm:w-40"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            sizes="160px"
            className="object-cover transition-opacity group-hover:opacity-70"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary/25">
            <span className="material-symbols-outlined text-3xl">
              add_a_photo
            </span>
            <span className="font-label text-[8px] uppercase tracking-widest">
              Add photo
            </span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/50 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="material-symbols-outlined text-2xl text-white">
            {preview ? "edit" : "add_a_photo"}
          </span>
        </div>
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/70">
            <span className="font-label text-[9px] uppercase tracking-widest text-white">
              Uploading...
            </span>
          </div>
        ) : null}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <div className="text-center sm:text-left">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="font-label text-[0.625rem] uppercase tracking-widest text-secondary transition-colors hover:text-primary disabled:opacity-40"
        >
          {preview ? "Change photo" : "Upload photo"}
        </button>
        <p className="mt-1 font-label text-[8px] uppercase tracking-widest text-primary/30">
          JPG, PNG or WebP — Max 5 MB
        </p>
        {error ? (
          <p className="mt-2 font-body text-xs text-error">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
