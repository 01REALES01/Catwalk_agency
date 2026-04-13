import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no está configurada en el servidor." },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "No autorizado. Inicia sesión de nuevo." },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("model_profiles")
    .select("nombre, altura, color_ojos, medidas, bio_profesional")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: `Error cargando perfil: ${profileError.message}` },
      { status: 500 },
    );
  }

  if (!profile || !profile.nombre) {
    return NextResponse.json(
      { error: "Primero guarda tu perfil con al menos tu nombre." },
      { status: 400 },
    );
  }

  const prompt = `Eres un redactor experto de agencias de modelaje de alta moda. 
Genera una biografía profesional en español (2-3 párrafos, máximo 150 palabras) para una modelo con estos datos:
- Nombre: ${profile.nombre}
${profile.altura ? `- Altura: ${profile.altura} cm` : ""}
${profile.color_ojos ? `- Color de ojos: ${profile.color_ojos}` : ""}
${profile.medidas ? `- Medidas: ${profile.medidas}` : ""}
${profile.bio_profesional ? `- Experiencia/notas: ${profile.bio_profesional}` : ""}

La biografía debe sonar elegante, atractiva y profesional, como si fuera para el book de una agencia top.
No incluyas datos inventados. Solo embellece lo proporcionado.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.8,
    });

    const bio = completion.choices[0]?.message?.content?.trim() ?? "";

    const { error: updateError } = await supabase
      .from("model_profiles")
      .update({ bio_profesional: bio })
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Bio generada pero error al guardar: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ bio });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de OpenAI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
