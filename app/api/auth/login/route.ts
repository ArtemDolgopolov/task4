import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { compare } from "bcrypt";

export async function POST(request: Request) {
 try {
   const { id, email, password } = await request.json();

   console.log("ID", id, email)

   if (!email || !password) {
     return NextResponse.json(
       { errors: { email: "Email is required", password: "Password is required" } },
       { status: 400 }
     );
   }

   const { rows } = await sql`
     SELECT * FROM users WHERE email = ${email}
   `;
   
   if (rows.length === 0) {
     return NextResponse.json(
       { errors: { email: "User with the email not found" } },
       { status: 400 }
     );
   }

   const user = rows[0];

   if (user.status === 'blocked') {
    return NextResponse.json(
     { errors: { email: "User is blocked" } },
     { status: 400 }
   );
   }

   const isValidPassword = await compare(password, user.password);
   if (!isValidPassword) {
     return NextResponse.json(
       { errors: { password: "Wrong password" } },
       { status: 400 }
     );
   }

   await sql`
     UPDATE users SET last_login = NOW() WHERE id = ${user.id}
   `;

   const updatedUsers = await sql`
     SELECT email, name, status, created_at, last_login FROM users ORDER BY last_login DESC
   `;

    const response = NextResponse.json({ message: "Authentication successful", users: updatedUsers }, { status: 200 });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
 } catch (e: any) {
     if (e.code === "401" && e.detail.includes("email")) {
       return NextResponse.json(
       { errors: { email: "User not found" } },
     );
 }

   return NextResponse.json(
     { errors: { general: "Server error occurred" } },
     { status: 500 }
   );
 }
}