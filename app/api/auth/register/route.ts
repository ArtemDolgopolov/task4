import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
 try {
   const { name, email, password, status = "active" } = await request.json();

   if (!name || !email || !password) {
     return NextResponse.json(
       { errors: { name: "Name is required", email: "Email is required", password: "Password is required" } },
       { status: 400 }
     );
   }

   const hashedPassword = await hash(password, 10);

   const { rows } = await sql`
     INSERT INTO users (email, name, password, status, created_at, last_login)
     VALUES (${email}, ${name}, ${hashedPassword}, ${status}, NOW(), NOW())
     RETURNING *
   `;

   const newUser = rows[0];

   // После регистрации возвращаем новый список пользователей
   const updatedUsers = await sql`
     SELECT email, name, status, created_at, last_login FROM users ORDER BY last_login DESC
   `;

   const response = NextResponse.json(
     { message: "User registered successfully", user: newUser, users: updatedUsers },
     { status: 200 }
   );

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
    
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