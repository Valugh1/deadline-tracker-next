'use client';

import { useState } from 'react';
import DeadlineCard, { Deadline } from './DeadlineCard';

// Definiamo i tipi di visualizzazione
type ViewType = 'long-term' | 'daily';

export default function DeadlineGrid() {
  const [activeView, setActiveView] = useState<ViewType>('long-term');

  // Per ora usiamo dati finti per testare la griglia
  // In seguito questi arriveranno dalle tue API
  const mockDeadlines: Deadline[] = [
    { 
      id: 1, 
      title: "Assicurazione Auto", 
      date: "2026-05-20", 
      daysBefore: 7, 
      notified: false, 
      type: 'long-term' // Ora TS sa che questo DEVE essere 'long-term' o 'daily'
    },
    { 
      id: 2, 
      title: "Comprare il pane", 
      date: "2026-03-27", 
      daysBefore: 0, 
      notified: false, 
      type: 'daily' 
    },
  ];

  return (
    <section className="w-full max-w-[1800px] mx-auto">
      
      {/* SEGMENTED CONTROL (Selettore stile iOS) */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-200/50 p-1 rounded-2xl flex relative w-full max-w-md backdrop-blur-sm">
          {/* Sfondo animato dello switch */}
          <div 
            className={`absolute top-1 bottom-1 w-[49%] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
              activeView === 'daily' ? 'translate-x-[102%]' : 'translate-x-0'
            }`}
          />
          
          <button
            onClick={() => setActiveView('long-term')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors duration-200 ${
              activeView === 'long-term' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Lungo Termine
          </button>
          
          <button
            onClick={() => setActiveView('daily')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors duration-200 ${
              activeView === 'daily' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Giornaliere
          </button>
        </div>
      </div>

      {/* TITOLO SEZIONE DINAMICO */}
      <div className="mb-8 px-4">
        <h3 className="text-xl font-bold text-black/80">
          {activeView === 'long-term' ? '📅 Scadenze Annuali e Mensili' : '☀️ Impegni di Oggi'}
        </h3>
      </div>

      {/* GRIGLIA DELLE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
        {mockDeadlines
          .filter(d => (activeView === 'long-term' ? d.type === 'long-term' : d.type === 'daily'))
          .map((d) => (
            <DeadlineCard 
              key={d.id} 
              deadline={d} 
              onEdit={() => console.log('Edit', d.id)} 
              onDelete={() => console.log('Delete', d.id)} 
            />
          ))
        }

        {/* MESSAGGIO SE VUOTO */}
        {mockDeadlines.filter(d => d.type === activeView).length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-ios-gray italic">Nessuna scadenza in questa categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}