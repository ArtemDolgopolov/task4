import Form from "./form"
import { getServerSession } from 'next-auth'
import { redirect } from "next/navigation"

export default async function RegisterPage() {
 const session = await getServerSession()
 if (session) {
  redirect('/')
 }
 console.log('Session after register:', session)
 return (
  <Form />
 )
}