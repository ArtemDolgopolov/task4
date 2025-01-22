import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export default async function Layout({
 children,
}: {
 children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="flex flex-col flex-grow items-center justify-center">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}