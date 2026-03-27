'use client';

import { useState } from 'react';
import Image from 'next/image';
// Importiamo i componenti che creeremo tra un attimo
import DeadlineModal from '../components/DeadlineModal';
import DeadlineGrid from '../components/DeadlineGrid';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aggiungiamo una funzione temporanea per gestire il salvataggio
  const handleSave = (data: any) => {
    console.log("Dati ricevuti dalla modale:", data);
    setIsModalOpen(false);
  };

  return (
    <main className="w-full min-h-screen bg-ios-background antialiased text-black">
      <div className="w-full px-6 py-10 md:px-12 md:py-16 lg:px-20">
        
        {/* HEADER CENTRATO - Layout a 3 colonne */}
        <header className="grid grid-cols-3 items-end mb-12 max-w-[1800px] mx-auto px-2">
          
          {/* 1. Colonna Sinistra (Bilanciamento) */}
          <div className="hidden md:block"></div>

          {/* 2. Colonna Centrale (Titolo) */}
          <div className="text-center col-span-3 md:col-span-1">
            <p className="text-ios-gray font-semibold uppercase tracking-widest text-[10px] md:text-xs mb-1">
              I miei promemoria
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Scadenze
            </h1>
          </div>

          {/* 3. Colonna Destra (Pulsante +) */}
          <div className="flex justify-end items-center absolute right-6 top-10 md:static">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-ios-blue hover:bg-ios-blue-hover text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-ios-modal active:scale-90 transition-all duration-200"
            >
              <Image 
                src="/icons/add-square-svgrepo-com.svg" 
                alt="Aggiungi" 
                width={32} 
                height={32} 
                className="w-6 h-6 md:w-8 md:h-8 brightness-0 invert"
              />
            </button>
          </div>
        </header>

        {/* CONTENITORE GRIGLIA (Modulo separato) */}
        <DeadlineGrid />

      </div>

      {/* MODALE (Modulo separato) */}
      <DeadlineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingDeadline={null}
      />
    </main>
  );
}