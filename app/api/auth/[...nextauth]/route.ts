import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from "bcrypt"
import { sql } from "@vercel/postgres"

const handler = NextAuth({
  session: {
   strategy: "jwt"
  },
  pages: {
   signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
     credentials: {
      name: {},
      email: {},
      password: {}
     },
     async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
       throw new Error("Email and password are required")
      }

      const response = await sql`
       SELECT * FROM users WHERE email=${credentials?.email}
      `
      const user = response.rows[0]

      if (!user) {
       throw new Error("User not found")
      }

      const passwordCorrect = await compare(credentials?.password, user.password)

      console.log({ passwordCorrect })

      if (passwordCorrect) {
       return {
        id: user.id,
        name: user.name,
        email: user.email
       }
      } else {
       throw new Error("Invalid credentials");
      }
     }
    })
  ],
})

export { handler as GET, handler as POST }