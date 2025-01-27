import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, email, name, status, created_at, last_login FROM users ORDER BY last_login DESC
    `;

    const response = NextResponse.json(rows, { status: 200 });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (e) {
    console.error("Server error: ", e);
    return NextResponse.json(
      { errors: { general: "Server error occurred" } },
      { status: 500 }
    );
  }
}