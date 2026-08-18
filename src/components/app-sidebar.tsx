"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  ChartNoAxesCombined,
  CircleHelp,
  Clock3,
  GraduationCap,
  LogOut,
} from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Visão geral", icon: ChartNoAxesCombined },
  { href: "/materias", label: "Matérias", icon: BookOpenCheck },
  { href: "/sessoes", label: "Sessões", icon: Clock3 },
  { href: "/questoes", label: "Questões", icon: CircleHelp },
];

type AppSidebarProps = { userEmail: string };

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const links = navigation.map(({ href, label, icon: Icon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-blue-500/15 text-blue-300"
            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
        )}
        href={href}
        key={href}
      >
        <Icon className="size-4" />
        {label}
      </Link>
    );
  });

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5 lg:flex">
        <Link className="flex items-center gap-2 px-2" href="/dashboard">
          <span className="grid size-8 place-items-center rounded-lg bg-blue-600 text-white">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-100">StudyOS</span>
        </Link>
        <nav className="mt-10 flex flex-col gap-1">{links}</nav>
        <div className="mt-auto rounded-lg bg-slate-900 p-3">
          <p className="truncate text-sm font-medium text-slate-200">Minha conta</p>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
          <form action={signOut} className="mt-3">
            <Button className="w-full justify-start" size="sm" type="submit" variant="ghost">
              <LogOut data-icon="inline-start" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-blue-600 text-white">
            <GraduationCap className="size-4" />
          </span>
          <span className="font-semibold tracking-tight text-slate-100">StudyOS</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-0.5">{links}</nav>
      </header>
    </>
  );
}
