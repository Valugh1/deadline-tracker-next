"use client";

import Image from "next/image";

export interface Deadline {
  id: number;
  title: string;
  date: string;
  daysBefore: number;
  notified: boolean;
  type: "long-term" | "daily";
  notes: string;
  notificationTime?: string;
}

interface DeadlineCardProps {
  deadline: Deadline;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: number) => void;
  onInfo: (deadline: Deadline) => void;
}

export default function DeadlineCard({ deadline, onEdit, onDelete, onInfo }: DeadlineCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline.date);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const notificationDate = new Date(deadlineDate);
  notificationDate.setDate(deadlineDate.getDate() - (deadline.daysBefore || 0));

  let stateLabel = "";
  let labelClass = "bg-slate-100 text-slate-700";
  if (deadline.type !== "daily") {
    if (diffDays < 0) {
      stateLabel = "Scaduta";
      labelClass = "bg-red-50 text-red-600";
    } else if (diffDays === 0) {
      stateLabel = "Oggi";
      labelClass = "bg-red-50 text-red-600";
    } else if (today >= notificationDate) {
      stateLabel = `${diffDays} giorni rimasti`;
      labelClass = "bg-amber-100 text-amber-800";
    } else {
      stateLabel = `${diffDays} giorni rimasti`;
      labelClass = "bg-slate-100 text-slate-700";
    }
  } else {
    stateLabel = "Routine";
    labelClass = "bg-blue-50 text-blue-700";
  }

  return (
    <article
      onClick={() => onInfo(deadline)}
      className="group cursor-pointer rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-ios-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-25px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {deadline.type === "daily" ? "Promemoria giornaliero" : "Scadenza"}
          </p>
          <h3 className="text-xl font-semibold text-slate-950">{deadline.title}</h3>
          <p className="text-sm leading-6 text-slate-600 line-clamp-2">{deadline.notes || "Nessuna descrizione aggiuntiva."}</p>
        </div>

        <div className="flex flex-col gap-3 items-end">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${labelClass}`}>
            {stateLabel}
          </span>
          <div className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {deadline.type === "daily" ? deadline.notificationTime?.slice(0, 5) ?? "08:00" : new Date(deadline.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit(deadline);
          }}
          className="inline-flex items-center gap-2 rounded-[1.5rem] border border-[rgba(60,60,67,0.12)] bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <span>Modifica</span>
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(deadline.id);
          }}
          className="inline-flex items-center gap-2 rounded-[1.5rem] bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Image src="/icons8-rimuovere.svg" alt="Elimina" width={16} height={16} />
          <span>Elimina</span>
        </button>
      </div>
    </article>
  );
}
