"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DailyStudy = { day: string; hours: number };

type DashboardChartsProps = {
  dailyStudy: DailyStudy[];
  correctAnswers: number;
  wrongAnswers: number;
};

const answerColors = ["#10b981", "#f97316"];

export function DashboardCharts({ dailyStudy, correctAnswers, wrongAnswers }: DashboardChartsProps) {
  const answerData = [
    { name: "Acertos", value: correctAnswers },
    { name: "Erros", value: wrongAnswers },
  ];
  const hasAnswers = correctAnswers + wrongAnswers > 0;

  return (
    <section className="grid gap-5 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Ritmo de estudo</CardTitle>
          <CardDescription>Horas líquidas nos últimos 7 dias.</CardDescription>
        </CardHeader>
        <CardContent className="h-72 pt-2">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={dailyStudy} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyHours" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis axisLine={false} dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value: number) => `${value}h`} tickLine={false} />
              <Tooltip contentStyle={{ borderColor: "#e2e8f0", borderRadius: 8 }} formatter={(value) => [`${Number(value).toFixed(1)} h`, "Estudo"]} />
              <Area dataKey="hours" fill="url(#studyHours)" stroke="#2563eb" strokeWidth={2.5} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Desempenho em questões</CardTitle>
          <CardDescription>Distribuição geral de respostas.</CardDescription>
        </CardHeader>
        <CardContent className="h-72 pt-2">
          {hasAnswers ? (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie cx="50%" cy="45%" data={answerData} dataKey="value" innerRadius={58} outerRadius={85} paddingAngle={3}>
                  {answerData.map((entry, index) => <Cell fill={answerColors[index]} key={entry.name} />)}
                </Pie>
                <Tooltip formatter={(value) => [value, "Questões"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-slate-500">Registre questões para acompanhar seus acertos.</div>
          )}
          {hasAnswers && (
            <div className="-mt-8 flex justify-center gap-5 text-xs">
              {answerData.map((item, index) => (
                <span className="flex items-center gap-1.5 text-slate-600" key={item.name}>
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: answerColors[index] }} />
                  {item.name}: {item.value}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
