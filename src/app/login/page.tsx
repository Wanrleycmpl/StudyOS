import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
        <CardHeader className="items-center text-center">
          <span className="mb-2 grid size-11 place-items-center rounded-xl bg-blue-600 text-white">
            <GraduationCap className="size-6" />
          </span>
          <CardTitle className="text-2xl tracking-tight">Bem-vindo ao StudyOS</CardTitle>
          <CardDescription>Entre para continuar sua jornada de estudos.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
