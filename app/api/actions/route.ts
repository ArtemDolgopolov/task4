import { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, status } = req.body
  if (!id || !status) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  try {
    if (status === 'block') {
      await client.query('UPDATE users SET status = $1 WHERE id = $2', ['blocked', id])
    } else if (status === 'unblock') {
      await client.query('UPDATE users SET status = $1 WHERE id = $2', ['active', id])
    } else if (status === 'delete') {
      await client.query('DELETE FROM users WHERE id = $1', [id])
    } else {
      return res.status(400).json({ error: 'Invalid action' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error processing action' })
  }
}
