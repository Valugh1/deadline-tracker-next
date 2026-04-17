"use client";

import { useEffect, useState } from "react";
import { Deadline } from "./DeadlineCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadline: Partial<Deadline>) => void;
  editingDeadline?: Deadline | null;
}

export default function DeadlineModal({ isOpen, onClose, onSave, editingDeadline }: ModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [daysBefore, setDaysBefore] = useState(1);
  const [type, setType] = useState<"long-term" | "daily">("long-term");
  const [notes, setNotes] = useState("");
  const [notificationTime, setNotificationTime] = useState("08:00");

  useEffect(() => {
    if (editingDeadline) {
      setTitle(editingDeadline.title);
      const d = new Date(editingDeadline.date);
      setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      setDaysBefore(editingDeadline.daysBefore);
      setType(editingDeadline.type);
      setNotes(editingDeadline.notes || "");
      setNotificationTime(editingDeadline.notificationTime || "08:00");
    } else {
      setTitle("");
      setDate("");
      setDaysBefore(1);
      setType("long-term");
      setNotes("");
      setNotificationTime("08:00");
    }
  }, [editingDeadline, isOpen]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({ title, date, daysBefore: Number(daysBefore), type, notes, notificationTime });
  };

  return (
    <div className="ios-modal-backdrop flex items-center justify-center p-4">
      <div className="ios-modal-panel">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{editingDeadline ? 'Modifica' : 'Nuova'} scadenza</h2>
            <p className="mt-1 text-sm text-slate-500">Crea o aggiorna il promemoria in pochi passaggi.</p>
          </div>
          <button type="button" onClick={onClose} className="ios-modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ios-field-label">Titolo</label>
            <input className="ios-input" value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Es. Revisione Auto" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="ios-field-label">Tipo</label>
              <div className="inline-flex rounded-[1.75rem] bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setType('long-term')}
                  className={`rounded-[1.5rem] px-4 py-3 text-sm font-semibold transition ${type === 'long-term' ? 'bg-white text-slate-950 shadow-[0_10px_20px_-15px_rgba(0,0,0,0.18)]' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  Scadenza
                </button>
                <button
                  type="button"
                  onClick={() => setType('daily')}
                  className={`rounded-[1.5rem] px-4 py-3 text-sm font-semibold transition ${type === 'daily' ? 'bg-white text-slate-950 shadow-[0_10px_20px_-15px_rgba(0,0,0,0.18)]' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  Giornaliera
                </button>
              </div>
            </div>

            {type === 'long-term' ? (
              <div>
                <label className="ios-field-label">Data</label>
                <input className="ios-input" type="date" value={date} min={today} required onChange={(event) => setDate(event.target.value)} />
              </div>
            ) : (
              <div>
                <label className="ios-field-label">Orario</label>
                <input className="ios-input" type="time" value={notificationTime} onChange={(event) => setNotificationTime(event.target.value)} />
              </div>
            )}
          </div>

          {type === 'long-term' && (
            <div>
              <label className="ios-field-label">Preavviso</label>
              <select className="ios-select" value={daysBefore} onChange={(event) => setDaysBefore(Number(event.target.value))}>
                <option value={1}>1 giorno prima</option>
                <option value={3}>3 giorni prima</option>
                <option value={7}>1 settimana prima</option>
              </select>
            </div>
          )}

          <div>
            <label className="ios-field-label">Note</label>
            <textarea className="ios-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Aggiungi dettagli..." />
            <p className="ios-field-note">Facoltativo — utile per contesto e dettagli.</p>
          </div>

          <button type="submit" className="ios-btn w-full">{editingDeadline ? 'Aggiorna scadenza' : 'Crea scadenza'}</button>
        </form>
      </div>
    </div>
  );
}
