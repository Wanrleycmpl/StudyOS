"use client";

import { useActionState, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { deleteSubject, type SubjectActionState } from "@/app/actions/subjects";
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
import type { Subject } from "@/types/study";

const initialState: SubjectActionState = {};

export function DeleteSubjectDialog({ subject }: { subject: Subject }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteSubject, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button size="icon-sm" variant="ghost" />}>
        <Trash2 className="text-red-600" />
        <span className="sr-only">Excluir {subject.name}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir {subject.name}?</DialogTitle>
          <DialogDescription>
            As sessões e questões vinculadas a esta matéria também serão excluídas.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input name="id" type="hidden" value={subject.id} />
          {state.error && <p aria-live="polite" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
          <DialogFooter>
            <Button disabled={isPending} type="submit" variant="destructive">
              <Trash2 data-icon="inline-start" />
              {isPending ? "Excluindo..." : "Excluir matéria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
