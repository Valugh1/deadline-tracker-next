'use client';

import { useState } from 'react';
import DeadlineCard, { Deadline } from './DeadlineCard';

interface DeadlineGridProps {
  deadlines: Deadline[];
  onRefresh: () => void;
  onEdit: (deadline: Deadline) => void;
  onInfo: (deadline: Deadline) => void;
}

export default function DeadlineGrid({ deadlines, onRefresh, onEdit, onInfo }: DeadlineGridProps) {
  const [activeView, setActiveView] = useState<'long-term' | 'daily'>('long-term');
  const filteredDeadlines = deadlines.filter((deadline) => deadline.type === activeView);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa scadenza?')) return;
    try {
      const response = await fetch(`/api/deadlines?id=${id}`, { method: 'DELETE' });
      if (response.ok) onRefresh();
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-4 shadow-ios-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Filtro</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Visualizza le tue scadenze</h2>
          </div>
          <div className="inline-flex rounded-[1.5rem] bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveView('long-term')}
              className={`rounded-[1.5rem] px-4 py-2 text-sm font-semibold transition ${activeView === 'long-term' ? 'bg-white text-slate-950 shadow-[0_10px_20px_-15px_rgba(0,0,0,0.18)]' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              Scadenze
            </button>
            <button
              type="button"
              onClick={() => setActiveView('daily')}
              className={`rounded-[1.5rem] px-4 py-2 text-sm font-semibold transition ${activeView === 'daily' ? 'bg-white text-slate-950 shadow-[0_10px_20px_-15px_rgba(0,0,0,0.18)]' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              Giornaliere
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDeadlines.map((deadline) => (
          <DeadlineCard key={deadline.id} deadline={deadline} onDelete={handleDelete} onEdit={onEdit} onInfo={onInfo} />
        ))}
      </div>

      {filteredDeadlines.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-[rgba(60,60,67,0.12)] bg-white p-8 text-center text-slate-600 shadow-ios-card">
          <p className="text-lg font-semibold">Nessuna scadenza in questa categoria.</p>
          <p className="mt-2 text-sm text-slate-500">Aggiungi una nuova scadenza per iniziare.</p>
        </div>
      )}
    </section>
  );
}
