"use client";

import { useFormState } from "react-dom";
import { upsertProfile, type ProfileActionState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ModelProfile } from "@/types/database";

const initial: ProfileActionState = {};

export function ProfileForm({ profile }: { profile: ModelProfile | null }) {
  const [state, formAction] = useFormState(upsertProfile, initial);

  return (
    <form action={formAction} className="space-y-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            required
            defaultValue={profile?.nombre ?? ""}
            placeholder="Nombre artístico o legal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altura">Altura (cm)</Label>
          <Input
            id="altura"
            name="altura"
            inputMode="decimal"
            defaultValue={
              profile?.altura != null ? String(profile.altura) : ""
            }
            placeholder="175"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color_ojos">Color de ojos</Label>
          <Input
            id="color_ojos"
            name="color_ojos"
            defaultValue={profile?.color_ojos ?? ""}
            placeholder="Marrón, verde…"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="medidas">Medidas (busto-cintura-cadera u otras)</Label>
          <Input
            id="medidas"
            name="medidas"
            defaultValue={profile?.medidas ?? ""}
            placeholder="84-61-89"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio_profesional">
            Bio / experiencia profesional
          </Label>
          <Textarea
            id="bio_profesional"
            name="bio_profesional"
            defaultValue={profile?.bio_profesional ?? ""}
            placeholder="Editoriales, pasarelas, campañas…"
          />
        </div>
      </div>
      {state.error ? (
        <p className="font-body text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="font-body text-sm text-secondary" role="status">
          Cambios guardados.
        </p>
      ) : null}
      <Button type="submit" className="w-full md:w-auto" size="lg">
        Guardar perfil
      </Button>
    </form>
  );
}
