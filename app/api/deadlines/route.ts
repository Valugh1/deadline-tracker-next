import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { syncQStashJobsForUser } from '@/lib/notification-job-sync';

// Helper to get current user or return 401
async function getCurrentUserId() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? null;
  if (!userId) return null;
  return userId;
}

// LEGGI le scadenze
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { rows } = await sql`
      SELECT * FROM deadlines 
      WHERE user_id = ${userId}
      ORDER BY date ASC;
    `;

    return NextResponse.json(
      rows.map(row => ({
        ...row,
        daysBefore: row.days_before,
        notificationTime: row.notification_time
      }))
    );
  } catch (error) {
    console.error("GET Deadlines Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// SALVA nuova scadenza
export async function POST(request: Request) {
  // ✅ Read body FIRST before calling getCurrentUserId
  const body = await request.json();
  
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, date, daysBefore, type, notes, notificationTime } = body;

  try {
    await sql`
      INSERT INTO deadlines (user_id, title, date, days_before, "type", notes, notification_time)
      VALUES (${userId}, ${title}, ${date || "9999-01-01"}::date, ${daysBefore}, ${type}, ${notes || ""}, ${notificationTime || "08:00"});
    `;

    // Sync QStash jobs after creating deadline
    try {
      await syncQStashJobsForUser(userId);
    } catch (syncError) {
      console.error('Failed to sync QStash jobs after deadline creation:', syncError);
      // Don't fail the request if job sync fails
    }

    return NextResponse.json({ message: "Scadenza salvata" }, { status: 201 });
  } catch (error) {
    console.error("Errore SQL POST:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// ELIMINA scadenza
export async function DELETE(request: Request) {
  // ✅ Read URL params first (safe, doesn't consume body)
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sql`DELETE FROM deadlines WHERE id = ${id} AND user_id = ${userId};`;

    // Sync QStash jobs after deleting deadline
    try {
      await syncQStashJobsForUser(userId);
    } catch (syncError) {
      console.error('Failed to sync QStash jobs after deadline deletion:', syncError);
      // Don't fail the request if job sync fails
    }

    return NextResponse.json({ message: "Eliminata!" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// AGGIORNA una scadenza esistente
export async function PUT(request: Request) {
  // ✅ Read body FIRST before calling getCurrentUserId
  const body = await request.json();

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, title, date, daysBefore, type, notes, notificationTime } = body;

  try {
    const result = await sql`
      UPDATE deadlines
      SET title = ${title}, 
          date = ${date}, 
          days_before = ${daysBefore}, 
          "type" = ${type},
          notes = ${notes},
          notification_time = ${notificationTime}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Scadenza non trovata" }, { status: 404 });
    }

    // Sync QStash jobs after updating deadline
    try {
      await syncQStashJobsForUser(userId);
    } catch (syncError) {
      console.error('Failed to sync QStash jobs after deadline update:', syncError);
      // Don't fail the request if job sync fails
    }

    return NextResponse.json({ message: "Aggiornata!", deadline: result.rows[0] });
  } catch (error) {
    console.error("Errore nell'aggiornamento API:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}