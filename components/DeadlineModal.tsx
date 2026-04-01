'use client';

import { useEffect, useState } from 'react';
import { Deadline } from './DeadlineCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadline: Partial<Deadline>) => void;
  editingDeadline?: Deadline | null;
}

export default function DeadlineModal({ isOpen, onClose, onSave, editingDeadline }: ModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [daysBefore, setDaysBefore] = useState(1);
  const [type, setType] = useState<'long-term' | 'daily'>('long-term');

  // Reset o Popolamento campi
  useEffect(() => {
    
    if (editingDeadline) {
      setTitle(editingDeadline.title);
      const d = new Date(editingDeadline.date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setDate(`${y}-${m}-${day}`);
      setDaysBefore(editingDeadline.daysBefore);
      setType(editingDeadline.type);
    } else {
      setTitle('');
      setDate('');
      setDaysBefore(1);
      setType('long-term');
    }
  }, [editingDeadline, isOpen]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      date,
      daysBefore: Number(daysBefore),
      type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300">
      <div className="bg-white/95 w-full max-w-lg rounded-ios-modal shadow-ios-modal overflow-hidden animate-zoom-in">
        <div className="p-8 md:p-12">
          
          {/* HEADER MODALE */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-black">
              {editingDeadline ? 'Modifica' : 'Nuova'} Scadenza
            </h2>
            <button 
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SWITCH TIPO SCADENZA */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-ios-label-gray uppercase ml-4 tracking-[0.2em]">Tipo di promemoria</label>
              <div className="bg-gray-100 p-1 rounded-2xl flex relative w-full">
                <div 
                  className={`absolute top-1 bottom-1 w-[49%] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
                    type === 'daily' ? 'translate-x-[102%]' : 'translate-x-0'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setType('long-term')}
                  className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${type === 'long-term' ? 'text-ios-blue' : 'text-gray-400'}`}
                >
                  📅 Lungo Termine
                </button>
                <button
                  type="button"
                  onClick={() => setType('daily')}
                  className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${type === 'daily' ? 'text-ios-blue' : 'text-gray-400'}`}
                >
                  ☀️ Giornaliera
                </button>
              </div>
            </div>

            {/* CAMPO TITOLO */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-ios-label-gray uppercase ml-4 tracking-[0.2em]">Cosa ricordare?</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text" 
                required 
                placeholder="Es. Revisione Auto"
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-ios-blue outline-none transition-all text-lg font-medium text-black placeholder:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CAMPO DATA */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-ios-label-gray uppercase ml-4 tracking-[0.2em]">Data</label>
                <input 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date" 
                  required 
                  min={today}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-ios-blue outline-none transition-all text-black font-medium"
                />
              </div>

              {/* CAMPO PREAVVISO (Solo se non è daily, o sempre visibile) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-ios-label-gray uppercase ml-4 tracking-[0.2em]">Preavviso</label>
                <div className="relative">
                  <select
                    value={daysBefore}
                    onChange={(e) => setDaysBefore(Number(e.target.value))}
                    disabled={type === 'daily'}
                    className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-ios-blue outline-none transition-all text-black font-medium appearance-none cursor-pointer ${type === 'daily' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value={0}>Lo stesso giorno</option>
                    <option value={1}>1 giorno prima</option>
                    <option value={3}>3 giorni prima</option>
                    <option value={7}>1 settimana prima</option>
                    <option value={30}>1 mese prima</option>
                  </select>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                </div>
              </div>
            </div>

            {/* BOTTONE SALVA */}
            <button 
              type="submit"
              className="w-full bg-ios-blue text-white font-bold py-6 rounded-2xl mt-4 shadow-lg hover:bg-ios-blue-hover active:scale-[0.98] transition-all text-xl"
            >
              {editingDeadline ? 'Aggiorna' : 'Crea Scadenza'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}