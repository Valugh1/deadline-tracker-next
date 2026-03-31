import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Leggi le scadenze
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM deadlines ORDER BY date ASC;`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Salva una nuova scadenza
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