'use client';

import { Deadline } from './DeadlineCard';
import Image from 'next/image';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadline: Deadline | null;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: number) => void;
}

export default function InfoModal({ isOpen, onClose, deadline, onEdit, onDelete }: InfoModalProps) {
  if (!isOpen || !deadline) return null;

  // Calcolo giorni rimanenti per il display
  const timeLeft = new Date(deadline.date).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay sfumato */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header con Colore Dinamico */}
        <div className={`p-8 ${deadline.type === 'daily' ? 'bg-ios-blue' : 'bg-gray-900'} text-white`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">
              Dettaglio Scadenza
            </span>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">{deadline.title}</h2>
        </div>

        {/* Corpo della Modale */}
        <div className="p-8 space-y-8">
          
          {/* Info Principali */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Data Scadenza</p>
              <p className="text-lg font-bold text-black">
                {new Date(deadline.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Stato</p>
              <p className={`text-lg font-bold ${daysLeft < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {daysLeft < 0 ? 'Scaduta' : `${daysLeft} giorni rimasti`}
              </p>
            </div>
          </div>

          {/* Sezione Note */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Note aggiuntive</label>
            <div className="bg-gray-50 rounded-2xl p-5 min-h-[100px] border border-gray-100">
              {deadline.notes ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{deadline.notes}</p>
              ) : (
                <p className="text-gray-400 italic">Nessuna nota inserita per questa scadenza.</p>
              )}
            </div>
          </div>

          {/* Pulsanti Azione */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => { onEdit(deadline); onClose(); }}
              className="flex-1 bg-ios-blue text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Modifica
            </button>
            <button 
              onClick={() => { onDelete(deadline.id); onClose(); }}
              className="w-16 bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}