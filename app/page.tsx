"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DeadlineModal from "@/components/DeadlineModal";
import DeadlineGrid from "@/components/DeadlineGrid";
import { Deadline } from "@/components/DeadlineCard";
import InfoModal from "@/components/InfoModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  // STATO PER L'EDITING: Memorizza la scadenza da modificare (o null se nuova)
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  //MODALE dettaglio su deadline specifica
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(
    null,
  );

  const fetchDeadlines = async () => {
    try {
      const response = await fetch("/api/deadlines");
      if (!response.ok) throw new Error("Errore nel caricamento");
      const data = await response.json();
      setDeadlines(data);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
    }
  };

  // Funzione per aprire il dettaglio
  const handleOpenInfo = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsInfoModalOpen(true);
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  // Apre la modale per la CREAZIONE
  const handleOpenCreateModal = () => {
    setEditingDeadline(null); // Reset dello stato di editing
    setIsModalOpen(true);
  };

  // Apre la modale per la MODIFICA
  const handleOpenEditModal = (deadline: Deadline) => {
    setEditingDeadline(deadline); // Memorizza la scadenza da modificare
    setIsModalOpen(true);
  };

  // Chiude la modale e pulisce lo stato
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeadline(null);
  };

  // Funzione unificata per SALVARE (Crea o Aggiorna)
  const handleSave = async (formData: Partial<Deadline>) => {
    console.log("dati inviati:", {
      ...formData,
      _type: typeof formData,
      _keys: Object.keys(formData),
    });

    try {
      let response;

      if (editingDeadline) {
        // MODALITÀ AGGIORNAMENTO (PUT)
        response = await fetch("/api/deadlines", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingDeadline.id, ...formData }), // Include l'ID
        });
      } else {
        // MODALITÀ CREAZIONE (POST)
        response = await fetch("/api/deadlines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        handleCloseModal(); // Chiude e pulisce
        fetchDeadlines(); // Rinfresca la lista dal DB
      } else {
        const errorData = await response.json();
        console.error("Errore nel salvataggio server:", errorData);
        alert("Errore durante il salvataggio. Riprova.");
      }
    } catch (error) {
      console.error("Errore di rete nel salvataggio:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Vuoi eliminare questa scadenza definitivamente?")) {
      try {
        const response = await fetch(`/api/deadlines?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchDeadlines(); // Ricarica la lista aggiornata dal database
          setIsInfoModalOpen(false); // Chiude la modale info se era aperta
        } else {
          alert("Errore durante l'eliminazione.");
        }
      } catch (error) {
        console.error("Errore:", error);
      }
    }
  };

  return (
    <main className="w-full min-h-screen bg-ios-background antialiased text-black">
      <div className="w-full px-6 py-10 md:px-12 md:py-16 lg:px-20">
        {/* HEADER */}
        <header className="grid grid-cols-3 items-end mb-12 max-w-[1800px] mx-auto px-2">
          <div className="hidden md:block"></div>
          <div className="text-center col-span-3 md:col-span-1">
            <p className="text-ios-gray font-semibold uppercase tracking-widest text-[10px] md:text-xs mb-1">
              I miei promemoria
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Scadenze
            </h1>
          </div>
          <div className="flex justify-end items-center absolute right-6 top-10 md:static">
            {/* Usa la funzione handleOpenCreateModal */}
            <button
              onClick={handleOpenCreateModal}
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

        {/* Passiamo la funzione handleOpenEditModal alla Grid */}
        <DeadlineGrid
          deadlines={deadlines}
          onRefresh={fetchDeadlines}
          onEdit={handleOpenEditModal}
          onInfo={handleOpenInfo}
        />
      </div>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        deadline={selectedDeadline}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete} // Assicurati di avere la funzione handleDelete definita qui
      />

      <DeadlineModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingDeadline={editingDeadline} // Passa la scadenza attuale (o null)
      />
    </main>
  );
}
