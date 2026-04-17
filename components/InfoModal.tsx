'use client';

import { Deadline } from './DeadlineCard';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadline: Deadline | null;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: number) => void;
}

export default function InfoModal({ isOpen, onClose, deadline, onEdit, onDelete }: InfoModalProps) {
  if (!isOpen || !deadline) return null;

  const timeLeft = Math.ceil((new Date(deadline.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const dueText = timeLeft < 0 ? 'Scaduta' : `${timeLeft} giorni rimasti`;

  return (
    <div className="ios-modal-backdrop flex items-end justify-center p-4 sm:items-center sm:p-6">
      <div className="ios-card w-full max-w-lg overflow-hidden p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Dettaglio scadenza</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{deadline.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="ios-modal-close">✕</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Data</p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {new Date(deadline.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Stato</p>
            <p className={`mt-2 text-base font-semibold ${timeLeft < 0 ? 'text-red-600' : 'text-slate-950'}`}>{dueText}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Note</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{deadline.notes || 'Nessuna nota disponibile.'}</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onEdit(deadline);
              onClose();
            }}
            className="ios-btn w-full"
          >
            Modifica
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(deadline.id);
              onClose();
            }}
            className="ios-btn-secondary w-full"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
