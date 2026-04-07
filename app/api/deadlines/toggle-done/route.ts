import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

//modifica is_done delle card daily
export async function PATCH(request: Request) {
  const { id, isDone } = await request.json();
  try {
    await sql`UPDATE deadlines SET is_done = ${isDone} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}