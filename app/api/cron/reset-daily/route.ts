import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Solo Vercel può chiamare questa rotta se configurata nel vercel.json
  try {
    await sql`UPDATE deadlines SET is_done = false WHERE type = 'daily'`;
    return NextResponse.json({ message: "Reset giornaliero completato" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}