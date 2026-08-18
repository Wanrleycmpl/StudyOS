import Link from "next/link";
import { CircleHelp } from "lucide-react";

import { QuestionLogForm } from "@/components/questions/question-log-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import type { QuestionLogRecord, Subject } from "@/types/study";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T12:00:00`));
}

export default async function QuestionsPage() {
  const supabase = await createClient();
  const [{ data: subjectData, error: subjectsError }, { data: logData, error: logsError }] = await Promise.all([
    supabase.from("subjects").select("id, name, color, created_at").order("name"),
    supabase.from("question_logs").select("id, subject_id, date, bank, correct_count, wrong_count").order("date", { ascending: false }).order("created_at", { ascending: false }).limit(10),
  ]);
  const subjects = (subjectData ?? []) as Subject[];
  const logs = (logData ?? []) as QuestionLogRecord[];
  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-blue-600">Métricas de desempenho</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Questões</h1>
        <p className="mt-2 text-sm text-slate-500">Registre acertos e erros para acompanhar sua evolução.</p>
      </div>

      {subjectsError ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Não foi possível carregar as matérias. Confirme a migration do Supabase.</div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="grid min-h-64 place-items-center p-6 text-center">
            <div>
              <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><CircleHelp className="size-5" /></span>
              <p className="font-medium text-slate-800">Cadastre uma matéria primeiro</p>
              <p className="mt-1 text-sm text-slate-500">Assim você poderá relacionar cada bloco de questões ao conteúdo correto.</p>
              <Button className="mt-4" render={<Link href="/materias" />}>Ir para matérias</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          <QuestionLogForm subjects={subjects} />
          <Card>
            <CardHeader><CardTitle>Registros recentes</CardTitle><CardDescription>Os 10 últimos blocos de questões registrados.</CardDescription></CardHeader>
            <CardContent>
              {logsError ? <p className="text-sm text-red-700">Não foi possível carregar os registros.</p> : logs.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">Seu primeiro registro aparecerá aqui.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Matéria</TableHead><TableHead>Banca</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Acertos</TableHead><TableHead className="text-right">Erros</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const subject = subjectsById.get(log.subject_id);
                      return <TableRow key={log.id}>
                        <TableCell><span className="flex items-center gap-2 font-medium text-slate-800"><span className="size-2.5 rounded-full" style={{ backgroundColor: subject?.color ?? "#94a3b8" }} />{subject?.name ?? "Matéria removida"}</span></TableCell>
                        <TableCell>{log.bank}</TableCell>
                        <TableCell>{formatDate(log.date)}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-700">{log.correct_count}</TableCell>
                        <TableCell className="text-right font-medium text-orange-700">{log.wrong_count}</TableCell>
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
