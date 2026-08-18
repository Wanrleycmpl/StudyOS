"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { createSubject, type SubjectActionState, updateSubject } from "@/app/actions/subjects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Subject } from "@/types/study";

const initialState: SubjectActionState = {};

type SubjectFormDialogProps = {
  subject?: Subject;
};

export function SubjectFormDialog({ subject }: SubjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const action = subject ? updateSubject : createSubject;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEditing = Boolean(subject);
  const nameInputId = subject ? `name-${subject.id}` : "name";
  const colorInputId = subject ? `color-${subject.id}` : "color";

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    setOpen(false);
  }, [state.success]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button size={isEditing ? "icon-sm" : "default"} variant={isEditing ? "ghost" : "default"} />}>
        {isEditing ? <Pencil /> : <Plus data-icon="inline-start" />}
        {!isEditing && "Nova matéria"}
        {isEditing && <span className="sr-only">Editar {subject?.name}</span>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar matéria" : "Nova matéria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da matéria." : "Adicione uma matéria do seu edital."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4" ref={formRef}>
          {subject && <input name="id" type="hidden" value={subject.id} />}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor={nameInputId}>
              Nome da matéria
            </label>
            <Input defaultValue={subject?.name} id={nameInputId} maxLength={80} name="name" placeholder="Ex.: Direito Constitucional" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor={colorInputId}>
              Cor de identificação
            </label>
            <Input className="h-10 w-16 cursor-pointer p-1" defaultValue={subject?.color ?? "#2563eb"} id={colorInputId} name="color" type="color" />
          </div>
          {state.error && <p aria-live="polite" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar matéria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
