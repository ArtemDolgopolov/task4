'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { FiTrash, FiUnlock, FiLock, FiLogOut } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  last_login: string;
  created_at: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', { cache: "reload" });
      if (!res.ok) {
        throw new Error('Failed to fetch users.');
      }
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
        cache: 'reload'
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user.`);
      }

      setUsers((prevUsers) => {
        if (action === 'delete') {
          return prevUsers.filter((user) => user.id !== id);
        }
        return prevUsers.map((user) =>
          user.id === id
            ? { ...user, status: action === 'block' ? 'blocked' : 'active' }
            : user
        );
      });
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedIds.length) return;

    for (const id of selectedIds) {
      await handleAction(id, action);
    }
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <p>{session?.user?.email}</p>
          <p>{session?.user?.name}</p>
        </div>
        <button onClick={() => signOut()} className="bg-blue-500 text-white px-4 py-2">
          <FiLogOut size={24} />
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => handleBulkAction('block')}
          className="bg-red-500 text-white px-4 py-2 mr-2"
          disabled={loading || !selectedIds.length}
        >
          <FiLock size={24} />
        </button>
        <button
          onClick={() => handleBulkAction('unblock')}
          className="bg-green-500 text-white px-4 py-2 mr-2"
          disabled={loading || !selectedIds.length}
        >
          <FiUnlock size={24} />
        </button>
        <button
          onClick={() => handleBulkAction('delete')}
          className="bg-gray-500 text-white px-4 py-2"
          disabled={loading || !selectedIds.length}
        >
          <FiTrash size={24} />
        </button>
      </div>

      <table className="w-full text-left text-sm text-white">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length === users.length}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-700">
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleSelectOne(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email.toLowerCase()}</td>
              <td>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(user.last_login))}
              </td>              
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}