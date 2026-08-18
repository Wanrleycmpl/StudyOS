import { BookOpenCheck } from "lucide-react";

import { DeleteSubjectDialog } from "@/components/subjects/delete-subject-dialog";
import { SubjectFormDialog } from "@/components/subjects/subject-form-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import type { Subject } from "@/types/study";

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, color, created_at")
    .order("name");
  const subjects = (data ?? []) as Subject[];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-400">Organização do edital</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Matérias</h1>
          <p className="mt-2 text-sm text-slate-400">Cadastre as matérias que orientam o seu plano de estudos.</p>
        </div>
        <SubjectFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas matérias</CardTitle>
          <CardDescription>{subjects.length} {subjects.length === 1 ? "matéria cadastrada" : "matérias cadastradas"}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-300">
              Não foi possível carregar as matérias. Confirme se a migration do Supabase foi executada.
            </div>
          ) : subjects.length === 0 ? (
            <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
              <div>
                <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
                  <BookOpenCheck className="size-5" />
                </span>
                <p className="font-medium text-slate-200">Nenhuma matéria cadastrada</p>
                <p className="mt-1 text-sm text-slate-400">Comece adicionando a primeira matéria do edital.</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria</TableHead>
                  <TableHead className="w-32">Cor</TableHead>
                  <TableHead className="w-28 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full" style={{ backgroundColor: subject.color }} />
                        <span className="font-medium text-slate-200">{subject.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs uppercase text-slate-400">{subject.color}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <SubjectFormDialog subject={subject} />
                        <DeleteSubjectDialog subject={subject} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
