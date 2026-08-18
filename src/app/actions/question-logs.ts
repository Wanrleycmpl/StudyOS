"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type QuestionLogActionState = { error?: string; success?: boolean };

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export async function saveQuestionLog(
  _: QuestionLogActionState,
  formData: FormData,
): Promise<QuestionLogActionState> {
  const subjectId = String(formData.get("subjectId") ?? "");
  const bank = String(formData.get("bank") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const correctCount = Number(formData.get("correctCount"));
  const wrongCount = Number(formData.get("wrongCount"));

  if (!subjectId || !bank || bank.length > 80 || !isoDate.test(date)) {
    return { error: "Informe a matéria e a banca." };
  }

  if (
    !Number.isInteger(correctCount) ||
    !Number.isInteger(wrongCount) ||
    correctCount < 0 ||
    wrongCount < 0 ||
    correctCount + wrongCount === 0
  ) {
    return { error: "Informe ao menos uma questão, sem valores negativos." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("question_logs").insert({
    subject_id: subjectId,
    bank,
    date,
    correct_count: correctCount,
    wrong_count: wrongCount,
  });

  if (error) return { error: "Não foi possível registrar as questões. Tente novamente." };

  revalidatePath("/dashboard");
  revalidatePath("/questoes");
  return { success: true };
}
