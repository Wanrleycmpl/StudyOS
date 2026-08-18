import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3, Flame, Play } from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { QuestionLog, StudySession } from "@/types/study";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", "");
}

function calculateStreak(sessionDates: string[], today: Date) {
  const studiedDays = new Set(sessionDates);
  let streak = 0;
  const cursor = new Date(today);

  while (studiedDays.has(toIsoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const [{ data: weeklySessions }, { data: questionLogs }, { data: allSessions }] = await Promise.all([
    supabase.from("study_sessions").select("date, duration_minutes").gte("date", toIsoDate(weekStart)).lte("date", toIsoDate(today)),
    supabase.from("question_logs").select("correct_count, wrong_count"),
    supabase.from("study_sessions").select("date"),
  ]);

  const sessions = (weeklySessions ?? []) as StudySession[];
  const questions = (questionLogs ?? []) as QuestionLog[];
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_minutes, 0);
  const totalCorrect = questions.reduce((sum, log) => sum + log.correct_count, 0);
  const totalWrong = questions.reduce((sum, log) => sum + log.wrong_count, 0);
  const totalQuestions = totalCorrect + totalWrong;
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const dailyStudy = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const isoDate = toIsoDate(date);
    const minutes = sessions.filter((session) => session.date === isoDate).reduce((sum, session) => sum + session.duration_minutes, 0);
    return { day: formatDay(date), hours: Number((minutes / 60).toFixed(1)) };
  });

  const streak = calculateStreak((allSessions ?? []).map((session) => session.date), today);
  const metrics = [
    { label: "Horas líquidas", value: `${(totalMinutes / 60).toFixed(1)}h`, description: "nos últimos 7 dias", icon: Clock3, color: "bg-blue-500/15 text-blue-300" },
    { label: "Questões resolvidas", value: totalQuestions.toLocaleString("pt-BR"), description: "total acumulado", icon: BookOpen, color: "bg-violet-500/15 text-violet-300" },
    { label: "Taxa de acertos", value: `${accuracy}%`, description: "aproveitamento geral", icon: CheckCircle2, color: "bg-emerald-500/15 text-emerald-300" },
    { label: "Sequência atual", value: `${streak} ${streak === 1 ? "dia" : "dias"}`, description: "estudando sem parar", icon: Flame, color: "bg-orange-500/15 text-orange-300" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-400">Seu painel de estudos</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Acompanhe seu progresso</h1>
          <p className="mt-2 text-sm text-slate-400">Transforme consistência em aprovação, uma sessão por vez.</p>
        </div>
        <Button render={<Link href="/sessoes" />} size="lg">
          <Play data-icon="inline-start" />
          Iniciar sessão
        </Button>
      </div>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, description, icon: Icon, color }) => (
          <Card key={label} size="sm">
            <CardContent className="flex items-start justify-between pt-1">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
              </div>
              <span className={`grid size-9 place-items-center rounded-lg ${color}`}>
                <Icon className="size-4" />
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardCharts correctAnswers={totalCorrect} dailyStudy={dailyStudy} wrongAnswers={totalWrong} />
    </div>
  );
}
