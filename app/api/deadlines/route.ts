import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// LEGGI le scadenze
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM deadlines ORDER BY date ASC;`;

    rows.forEach(row => {
        if (row.id === 5) {
            console.log(row.date);
        }
    });

    return NextResponse.json(
      rows.map(row => ({
        ...row,
        //date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
        daysBefore: row.days_before
      }))
    );
  } catch (error) {
    console.error("GET Deadlines Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// SALVA nuova scadenza
export async function POST(request: Request) {
  const { title, date, daysBefore, type } = await request.json();
  try {
    await sql`
      INSERT INTO deadlines (title, date, days_before, type)
      VALUES (${title}, ${date}, ${daysBefore}, ${type});
    `;
    return NextResponse.json({ message: "Scadenza salvata" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// ELIMINA scadenza
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await sql`DELETE FROM deadlines WHERE id = ${id};`;
    return NextResponse.json({ message: "Eliminata!" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// AGGIORNA una scadenza esistente
export async function PUT(request: Request) {

    const { id, title, date, daysBefore, type } = await request.json();
    try {
        // Aggiornamento nel database Postgres basato sull'ID
        const result = await sql`
        UPDATE deadlines
        SET title = ${title}, 
            date = ${date}, 
            days_before = ${daysBefore}, 
            type = ${type}
        WHERE id = ${id}
        RETURNING *; -- Ci restituisce la riga aggiornata per conferma
        `;

        if (result.rowCount === 0) {
        return NextResponse.json({ error: "Scadenza non trovata" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Aggiornata!", deadline: result.rows[0] });
    } catch (error) {
        console.error("Errore nell'aggiornamento API:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}