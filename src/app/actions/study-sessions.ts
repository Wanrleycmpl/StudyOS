"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { StudyType } from "@/types/study";

export type StudySessionActionState = { error?: string; success?: boolean };

const validTypes = new Set<StudyType>(["teoria", "revisao", "questoes"]);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export async function saveStudySession(
  _: StudySessionActionState,
  formData: FormData,
): Promise<StudySessionActionState> {
  const subjectId = String(formData.get("subjectId") ?? "");
  const type = String(formData.get("type") ?? "") as StudyType;
  const date = String(formData.get("date") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes"));

  if (!subjectId || !validTypes.has(type) || !isoDate.test(date)) {
    return { error: "Preencha a matéria e o tipo de estudo." };
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 1_440) {
    return { error: "A duração da sessão deve ter entre 1 minuto e 24 horas." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("study_sessions").insert({
    subject_id: subjectId,
    type,
    date,
    duration_minutes: durationMinutes,
  });

  if (error) return { error: "Não foi possível registrar a sessão. Tente novamente." };

  revalidatePath("/dashboard");
  revalidatePath("/sessoes");
  return { success: true };
}
