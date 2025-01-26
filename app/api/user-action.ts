// import { NextApiRequest, NextApiResponse } from 'next';
// import { sql } from '@vercel/postgres';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { action, userIds } = req.body;

//   if (!action || !Array.isArray(userIds) || userIds.length === 0) {
//     return res.status(400).json({ error: 'Invalid request data' });
//   }

//   try {
//     let query: string;

//     switch (action) {
//       case 'block':
//         query = `UPDATE users SET status = 'Blocked' WHERE id = ANY($1)`;
//         break;
//       case 'unblock':
//         query = `UPDATE users SET status = 'Active' WHERE id = ANY($1)`;
//         break;
//       case 'delete':
//         query = `DELETE FROM users WHERE id = ANY($1)`;
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid action' });
//     }

//     // Execute query
//     await sql`${sql.raw(query)}`([userIds]);

//     // Fetch updated user list
//     const updatedUsers = await sql`SELECT * FROM users`;

//     return res.status(200).json(updatedUsers.rows);
//   } catch (error) {
//     console.error('Error processing user action:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }