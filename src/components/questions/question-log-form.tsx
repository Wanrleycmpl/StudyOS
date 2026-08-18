"use client";

import { useActionState, useEffect, useRef } from "react";
import { Save } from "lucide-react";

import { saveQuestionLog, type QuestionLogActionState } from "@/app/actions/question-logs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Subject } from "@/types/study";

const initialState: QuestionLogActionState = {};

function currentLocalDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function QuestionLogForm({ subjects }: { subjects: Subject[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(saveQuestionLog, initialState);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar questões</CardTitle>
        <CardDescription>Registre o resultado de hoje em poucos segundos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2" ref={formRef}>
          <input name="date" type="hidden" value={currentLocalDate()} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="question-subject">Matéria</label>
            <select className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="question-subject" name="subjectId" required>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="bank">Banca</label>
            <Input id="bank" maxLength={80} name="bank" placeholder="Ex.: Cebraspe" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="correct-count">Acertos</label>
            <Input defaultValue={0} id="correct-count" min={0} name="correctCount" required type="number" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="wrong-count">Erros</label>
            <Input defaultValue={0} id="wrong-count" min={0} name="wrongCount" required type="number" />
          </div>
          <div className="sm:col-span-2">
            {state.error && <p aria-live="polite" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
            {state.success && <p aria-live="polite" className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Questões registradas com sucesso.</p>}
            <Button disabled={isPending} type="submit">
              <Save data-icon="inline-start" />
              {isPending ? "Registrando..." : "Registrar questões"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
