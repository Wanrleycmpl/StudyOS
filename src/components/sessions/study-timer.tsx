"use client";

import { useActionState, useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Save } from "lucide-react";

import { saveStudySession, type StudySessionActionState } from "@/app/actions/study-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyType, Subject } from "@/types/study";

const initialState: StudySessionActionState = {};
const typeLabels: Record<StudyType, string> = {
  teoria: "Teoria",
  revisao: "Revisão",
  questoes: "Questões",
};

function currentLocalDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTimer(seconds: number) {
  const hours = String(Math.floor(seconds / 3_600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3_600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${remainingSeconds}`;
}

export function StudyTimer({ subjects }: { subjects: Subject[] }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [state, formAction, isPending] = useActionState(saveStudySession, initialState);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1_000);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!state.success) return;
    setElapsedSeconds(0);
    setIsRunning(false);
  }, [state.success]);

  const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer de estudo</CardTitle>
        <CardDescription>Inicie o cronômetro e finalize para salvar a sessão automaticamente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} onSubmit={() => setIsRunning(false)}>
          <input name="date" type="hidden" value={currentLocalDate()} />
          <input name="durationMinutes" type="hidden" value={durationMinutes} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="session-subject">Matéria</label>
              <select className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="session-subject" name="subjectId" required>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="session-type">Tipo de estudo</label>
              <select className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" defaultValue="teoria" id="session-type" name="type">
                {(Object.keys(typeLabels) as StudyType[]).map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}
              </select>
            </div>
          </div>

          <div className="my-8 rounded-xl bg-slate-950 px-5 py-8 text-center text-white">
            <p className="mb-2 text-sm text-slate-300">Tempo líquido</p>
            <output className="font-mono text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">{formatTimer(elapsedSeconds)}</output>
            <p className="mt-3 text-xs text-slate-400">Ao finalizar, será registrado como {durationMinutes} {durationMinutes === 1 ? "minuto" : "minutos"}.</p>
          </div>

          {state.error && <p aria-live="polite" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
          {state.success && <p aria-live="polite" className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Sessão registrada com sucesso.</p>}

          <div className="flex flex-wrap justify-center gap-2">
            <Button disabled={isPending} onClick={() => setIsRunning((value) => !value)} size="lg" type="button">
              {isRunning ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
              {isRunning ? "Pausar" : elapsedSeconds ? "Retomar" : "Iniciar"}
            </Button>
            <Button disabled={isPending || elapsedSeconds === 0} onClick={() => { setElapsedSeconds(0); setIsRunning(false); }} size="lg" type="button" variant="outline">
              <RotateCcw data-icon="inline-start" />
              Zerar
            </Button>
            <Button disabled={isPending || elapsedSeconds === 0} size="lg" type="submit" variant="secondary">
              <Save data-icon="inline-start" />
              {isPending ? "Salvando..." : "Finalizar e salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
