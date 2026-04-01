import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    //Creiamo la tabella con i campi che abbiamo deciso (incluso il 'type')
    await sql`
      CREATE TABLE IF NOT EXISTS deadlines (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        days_before INTEGER DEFAULT 1,
        notified BOOLEAN DEFAULT FALSE,
        type VARCHAR(50) NOT NULL,
        note TEXT,
        user_id VARCHAR(255)
      )`;
    return NextResponse.json({ message: "colonna creata con successo" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}