"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DeadlineModal from "@/components/DeadlineModal";
import DeadlineGrid from "@/components/DeadlineGrid";
import { Deadline } from "@/components/DeadlineCard";
import InfoModal from "@/components/InfoModal";
import { scheduleDeadlineNotifications } from "@/lib/notifications";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

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

  useEffect(() => {
    fetchDeadlines();
  }, []);

  useEffect(() => {
    if (deadlines.length > 0) {
      scheduleDeadlineNotifications(deadlines);
    }
  }, [deadlines]);

  const handleOpenInfo = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsInfoModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingDeadline(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeadline(null);
  };

  const handleSave = async (formData: Partial<Deadline>) => {
    try {
      let response;

      if (editingDeadline) {
        response = await fetch("/api/deadlines", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingDeadline.id, ...formData }),
        });
      } else {
        response = await fetch("/api/deadlines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        handleCloseModal();
        fetchDeadlines();
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
    if (!confirm("Vuoi eliminare questa scadenza definitivamente?")) return;

    try {
      const response = await fetch(`/api/deadlines?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDeadlines();
        setIsInfoModalOpen(false);
      } else {
        alert("Errore durante l'eliminazione.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <main className="min-h-screen bg-ios-background px-4 py-8 sm:px-6 sm:py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-ios-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">I miei promemoria</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Scadenze</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Pianifica tutto in modo semplice e naturale, con schede morbide e controlli ottimizzati per schermi piccoli.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="ios-btn inline-flex items-center justify-center gap-2 px-5 py-3">
              <Image
                src="/icons/add-square-svgrepo-com.svg"
                alt="Aggiungi"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              Aggiungi scadenza
            </button>
          </div>
        </section>

        <DeadlineGrid deadlines={deadlines} onRefresh={fetchDeadlines} onEdit={handleOpenEditModal} onInfo={handleOpenInfo} />
      </div>

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} deadline={selectedDeadline} onEdit={handleOpenEditModal} onDelete={handleDelete} />
      <DeadlineModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} editingDeadline={editingDeadline} />
    </main>
  );
}
