import Link from "next/link";
import { Clock3 } from "lucide-react";

import { StudyTimer } from "@/components/sessions/study-timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import type { StudySessionRecord, StudyType, Subject } from "@/types/study";

const typeLabels: Record<StudyType, string> = { teoria: "Teoria", revisao: "Revisão", questoes: "Questões" };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T12:00:00`));
}

export default async function SessionsPage() {
  const supabase = await createClient();
  const [{ data: subjectData, error: subjectsError }, { data: sessionData, error: sessionsError }] = await Promise.all([
    supabase.from("subjects").select("id, name, color, created_at").order("name"),
    supabase.from("study_sessions").select("id, subject_id, date, duration_minutes, type").order("date", { ascending: false }).order("created_at", { ascending: false }).limit(10),
  ]);
  const subjects = (subjectData ?? []) as Subject[];
  const sessions = (sessionData ?? []) as StudySessionRecord[];
  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-blue-600">Foco e consistência</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Sessões de estudo</h1>
        <p className="mt-2 text-sm text-slate-500">Cronometre o estudo e salve seu tempo líquido ao finalizar.</p>
      </div>

      {subjectsError ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Não foi possível carregar as matérias. Confirme a migration do Supabase.</div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="grid min-h-64 place-items-center p-6 text-center">
            <div>
              <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><Clock3 className="size-5" /></span>
              <p className="font-medium text-slate-800">Cadastre uma matéria primeiro</p>
              <p className="mt-1 text-sm text-slate-500">A matéria é necessária para classificar cada sessão.</p>
              <Button className="mt-4" render={<Link href="/materias" />}>Ir para matérias</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          <StudyTimer subjects={subjects} />
          <Card>
            <CardHeader>
              <CardTitle>Últimas sessões</CardTitle>
              <CardDescription>Os 10 registros mais recentes.</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsError ? <p className="text-sm text-red-700">Não foi possível carregar as sessões.</p> : sessions.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">Sua primeira sessão aparecerá aqui.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Matéria</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Duração</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {sessions.map((session) => {
                      const subject = subjectsById.get(session.subject_id);
                      return <TableRow key={session.id}>
                        <TableCell><span className="flex items-center gap-2 font-medium text-slate-800"><span className="size-2.5 rounded-full" style={{ backgroundColor: subject?.color ?? "#94a3b8" }} />{subject?.name ?? "Matéria removida"}</span></TableCell>
                        <TableCell>{typeLabels[session.type]}</TableCell>
                        <TableCell>{formatDate(session.date)}</TableCell>
                        <TableCell className="text-right">{session.duration_minutes} min</TableCell>
                      </TableRow>;
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
