'use client';

import Image from 'next/image';

// Definiamo l'interfaccia basata su quella che abbiamo raffinato insieme
export interface Deadline {
  id: number;
  title: string;
  date: string; // Formato YYYY-MM-DD
  daysBefore: number;
  notified: boolean;
  type: 'long-term' | 'daily'; // Aggiunto per il supporto alla doppia logica
}

interface DeadlineCardProps {
  deadline: Deadline;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: number) => void;
}

export default function DeadlineCard({ deadline, onEdit, onDelete }: DeadlineCardProps) {
  
  // Calcolo dei giorni rimanenti e dello stato di urgenza (Logica v1.1.0)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline.date);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Logica di preavviso per il colore
  const notificationDate = new Date(deadlineDate);
  notificationDate.setDate(deadlineDate.getDate() - (deadline.daysBefore || 0));

  // Determina lo stato e il colore della card
  let statusColor = "bg-white/95"; // Default
  let textColor = "text-ios-gray";
  let daysLeftText = "";

  if (diffDays < 0) {
    statusColor = "bg-red-50/95"; // Scaduta (Rosso Apple sfocato)
    daysLeftText = "Scaduta";
    textColor = "text-ios-red";
  } else if (diffDays === 0) {
    statusColor = "bg-red-50/95"; // Oggi
    daysLeftText = "Oggi!";
    textColor = "text-ios-red";
  } else if (today >= notificationDate) {
    statusColor = "bg-amber-50/95"; // Preavviso attivo (Giallo morbido)
    daysLeftText = diffDays === 1 ? "1 giorno rimasto" : `${diffDays} giorni rimasti`;
    textColor = "text-amber-700";
  } else {
    daysLeftText = diffDays === 1 ? "1 giorno rimasto" : `${diffDays} giorni rimasti`;
    textColor = "text-ios-gray";
  }

  return (
    <div className={`group relative p-8 rounded-ios-card shadow-ios-card backdrop-blur-sm ${statusColor} border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out`}>
      
      {/* 1. HEADER (Titolo) */}
      <div className="mb-6 pr-10">
        <p className="text-ios-gray/70 font-semibold uppercase tracking-widest text-[9px] mb-1">
          {deadline.type === 'long-term' ? 'Lungo Termine' : 'Giornaliera'}
        </p>
        <h4 className="text-2xl font-bold text-black tracking-tight leading-tight group-hover:text-ios-blue transition-colors">
          {deadline.title}
        </h4>
      </div>

      {/* 2. BODY (Data e Giorni) */}
      <div className="flex items-end justify-between gap-4 mt-auto">
        <div className="flex flex-col">
          <p className="text-ios-gray font-semibold text-xs mb-1">Scade il:</p>
          <div className="flex items-center gap-2">
            {/* Icona Calendario Semplice */}
            <span className="text-xl">📅</span>
            <p className="text-xl font-extrabold text-black/80 tracking-tight">
              {new Date(deadline.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Badge Giorni Rimanenti */}
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusColor === "bg-red-50/95" ? 'bg-ios-red/10' : statusColor === "bg-amber-50/95" ? 'bg-amber-100' : 'bg-gray-100'} ${textColor}`}>
          {daysLeftText}
        </div>
      </div>

      {/* 3. AZIONI (Pulsanti che appaiono all'hover) */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        {/* Pulsante Modifica (Matita) */}
        <button 
          onClick={() => onEdit(deadline)}
          className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 text-ios-gray hover:bg-ios-blue hover:text-white hover:scale-110 active:scale-95 transition-all"
          title="Modifica"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        {/* Pulsante Elimina (Cestino) */}
        <button 
          onClick={() => onDelete(deadline.id)}
          className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 text-ios-gray hover:bg-ios-red hover:text-white hover:scale-110 active:scale-95 transition-all"
          title="Elimina"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.78 0-.34-6m9.9 3.92a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

    </div>
  );
}