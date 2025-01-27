import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { error: "ID and action are required." },
        { status: 400 }
      );
    }

    if (action === "block") {
      await sql`
        UPDATE users 
        SET status = 'blocked' 
        WHERE id = ${id}
      `;
    } else if (action === "unblock") {
      await sql`
        UPDATE users 
        SET status = 'active' 
        WHERE id = ${id}
      `;
    } else if (action === "delete") {
      await sql`
        DELETE FROM users 
        WHERE id = ${id}
      `;
    } else {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing action:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the action." },
      { status: 500 }
    );
  }
}