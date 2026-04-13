import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Primero completa tu perfil con al menos tu nombre." },
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

    await supabase
      .from("model_profiles")
      .update({ bio_profesional: bio })
      .eq("user_id", user.id);

    return NextResponse.json({ bio });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de OpenAI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
