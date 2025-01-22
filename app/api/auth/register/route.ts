import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          errors: {
            name: "Name is required",
            email: "Email is required",
            password: "Password is required",
          },
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
  } catch (error: any) {
    if (error.code === "23505" && error.detail.includes("email")) {
      return NextResponse.json(
        { errors: { email: "Email already exists" } },
        { status: 400 }
      );
    }

    console.error("Server Error:", error);
    return NextResponse.json(
      { errors: { general: "Server error occurred" } },
      { status: 500 }
    );
  }
}