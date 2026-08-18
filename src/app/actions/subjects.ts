"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type SubjectActionState = {
  error?: string;
  success?: boolean;
};

const hexColor = /^#[0-9a-fA-F]{6}$/;

function readSubjectFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#2563eb");

  if (!name || name.length > 80) {
    return { error: "Informe um nome de até 80 caracteres." };
  }

  if (!hexColor.test(color)) {
    return { error: "Escolha uma cor válida." };
  }

  return { name, color };
}

async function authorize() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

function refreshSubjects() {
  revalidatePath("/materias");
  revalidatePath("/dashboard");
}

export async function createSubject(
  _: SubjectActionState,
  formData: FormData,
): Promise<SubjectActionState> {
  const fields = readSubjectFields(formData);
  if ("error" in fields) return fields;

  const { supabase, user } = await authorize();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("subjects").insert(fields);
  if (error) return { error: "Não foi possível criar a matéria. Tente novamente." };

  refreshSubjects();
  return { success: true };
}

export async function updateSubject(
  _: SubjectActionState,
  formData: FormData,
): Promise<SubjectActionState> {
  const id = String(formData.get("id") ?? "");
  const fields = readSubjectFields(formData);
  if (!id || "error" in fields) {
    return "error" in fields ? fields : { error: "Matéria inválida." };
  }

  const { supabase, user } = await authorize();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("subjects").update(fields).eq("id", id);
  if (error) return { error: "Não foi possível salvar as alterações." };

  refreshSubjects();
  return { success: true };
}

export async function deleteSubject(
  _: SubjectActionState,
  formData: FormData,
): Promise<SubjectActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Matéria inválida." };

  const { supabase, user } = await authorize();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) return { error: "Não foi possível excluir a matéria." };

  refreshSubjects();
  return { success: true };
}
