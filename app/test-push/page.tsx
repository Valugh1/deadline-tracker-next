'use client';
import { subscribeToPushNotifications } from '@/lib/push-client';

export default function TestPushPage() {
  const handleTestNotification = async () => {
    try {
      // 1. Assicurati che il device sia iscritto
      const isSubscribed = await subscribeToPushNotifications();
      if (!isSubscribed) {
        alert("Errore nell'iscrizione o permessi negati");
        return;
      }

      // 2. Chiama l'API di invio
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Hello World!',
          body: 'Questa è una notifica di test dal mio server!',
          tag: 'test-click'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Notifica inviata a ${data.sent} dispositivi!`);
        console.log('Richiesta di invio completata', data);
      } else {
        const errorData = await response.json();
        alert(`Errore nell'invio: ${errorData.error}`);
        console.error('Errore nell\'invio', errorData);
      }
    } catch (error) {
      alert('Errore durante il test della notifica');
      console.error('Errore durante il test:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Test Notifiche Push</h1>
      <button 
        onClick={handleTestNotification}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          cursor: 'pointer',
          backgroundColor: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Invia Notifica "Hello World"
      </button>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Chiudi questa pagina dopo aver cliccato il pulsante per verificare che la notifica viene ricevuta in background.
      </p>
    </div>
  );
}