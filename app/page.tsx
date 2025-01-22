import { redirect } from '@/node_modules/next/navigation';
import { getServerSession } from 'next-auth'
import Dashboard from '../components/Dashboard'


export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }
  
  return (
    <Dashboard />
  );
}