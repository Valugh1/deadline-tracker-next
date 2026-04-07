'use client';

import { useState } from 'react';
import DeadlineCard, { Deadline } from './DeadlineCard';

interface DeadlineGridProps {
  deadlines: Deadline[];
  onRefresh: () => void;
  onEdit: (deadline: Deadline) => void;
  onInfo: (deadline: Deadline) => void;
  activeView: 'long-term' | 'daily';
  onActiveViewChange: (view: 'long-term' | 'daily') => void;

}

export default function DeadlineGrid({ deadlines,
   onRefresh,
    onEdit,
     onInfo,
     activeView,
     onActiveViewChange
     }: DeadlineGridProps) {
  // Funzione per eliminare una scadenza dal database
  const handleDelete = async (id: number) => {
    if (confirm("Vuoi eliminare questa scadenza definitivamente?")) {
      try {
        const response = await fetch(`/api/deadlines?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          onRefresh(); // Ricarica la lista dal DB dopo l'eliminazione
        }
      } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
      }
    }
  };

  

  // Filtriamo le scadenze in base al tipo selezionato nello switch
  const filteredDeadlines = deadlines.filter(d => d.type === activeView);

  return (
    <section className="w-full max-w-[1800px] mx-auto">
      
      {/* --- Segmented control e titolo --- */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-200/50 p-1 rounded-2xl flex relative w-full max-w-md backdrop-blur-sm border border-white/20">
          {/* Sfondo animato dello switch */}
          <div 
            className={`absolute top-1 bottom-1 w-[49%] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
              activeView === 'daily' ? 'translate-x-[102%]' : 'translate-x-0'
            }`}
          />
          
          <button
            onClick={() => onActiveViewChange('long-term')}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors duration-200 ${
              activeView === 'long-term' ? 'text-ios-blue' : 'text-gray-500'
            }`}
          >
            📅 Lungo Termine
          </button>
          
          <button
            onClick={() => onActiveViewChange('daily')}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors duration-200 ${
              activeView === 'daily' ? 'text-ios-blue' : 'text-gray-500'
            }`}
          >
            ☀️ Giornaliere
          </button>
        </div>
      </div>

      {/* TITOLO DINAMICO */}
      <div className="mb-8 px-4 flex justify-between items-end">
        <h3 className="text-xl font-bold text-black/80">
          {activeView === 'long-term' ? 'Scadenze Annuali e Mensili' : 'Impegni di Oggi'}
        </h3>
        <span className="text-ios-gray text-sm font-medium">
          {filteredDeadlines.length} {filteredDeadlines.length === 1 ? 'elemento' : 'elementi'}
        </span>
      </div>

      {/* GRIGLIA DELLE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
        {filteredDeadlines.map((d) => (
          <DeadlineCard 
            key={d.id} 
            deadline={d} 
            onDelete={handleDelete}
            onEdit={onEdit}
            onInfo={onInfo}
            onRefresh={onRefresh}
          />
        ))}

        {/* MESSAGGIO SE LA CATEGORIA È VUOTA */}
        {filteredDeadlines.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/40 rounded-ios-card border-2 border-dashed border-gray-200">
            <p className="text-ios-gray italic text-lg">
              Ottimo! Nessuna scadenza in sospeso qui.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}