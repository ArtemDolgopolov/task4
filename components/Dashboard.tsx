'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

interface User {
  id: number
  name: string
  email: string
  status: string
  last_login: string
  created_at: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  console.log('Session after login:', session)

  // Загрузка списка пользователей
  const fetchUsers = async () => {
   setLoading(true)
   try {
     const res = await fetch('/api/users')
     if (!res.ok) {
       throw new Error(`Failed to fetch: ${res.statusText}`)
     }
     const data: User[] = await res.json()
     console.log('Users fetched:', data)
     setUsers(data)
   } catch (error) {
     console.error('Error fetching users:', error)
   } finally {
     setLoading(false)
   }
 }

  // Обработка действий над пользователями
  const handleAction = async (id: number, action: string) => {
    setLoading(true)
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      await fetchUsers()
    } catch (error) {
      console.error("Failed to ${action} user: ", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [session])

  return (
    <div className="relative z-[1] flex flex-col gap-4 items-center">
      <div className="text-center mb-6">
        <p className="text-white text-sm">{session?.user?.email}</p>
        <p className="text-white text-sm">{session?.user?.name}</p>
        <button
          className="text-white bg-primary p-4 rounded-md"
          onClick={() => signOut()}
        >
          Log Out
        </button>
      </div>

      <div className="w-full max-w-4xl p-4 bg-gray-800 rounded-md">
        <h2 className="text-xl text-white mb-4">User Management</h2>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.last_login}</td>
                  <td>{user.status}</td>
                  <td>
                    <button
                      className="bg-red-500 text-white px-3 py-1 mr-2 rounded"
                      onClick={() => handleAction(user.id, 'block')}
                    >
                      Block
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
                      onClick={() => handleAction(user.id, 'unblock')}
                    >
                      Unblock
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                      onClick={() => handleAction(user.id, 'delete')}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}