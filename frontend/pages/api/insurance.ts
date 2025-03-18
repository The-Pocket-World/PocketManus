import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../backend/src/config';

// Create a new claim
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await createClaim(req, res);
      break;
    case 'GET':
      await getClaims(req, res);
      break;
    case 'PUT':
      await updateClaim(req, res);
      break;
    case 'DELETE':
      await deleteClaim(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Create a new claim
async function createClaim(req: NextApiRequest, res: NextApiResponse) {
  const { userId, projectId, status } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO claims (user_id, project_id, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, projectId, status]
    );

    const claim = result.rows[0];
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all claims
async function getClaims(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query('SELECT * FROM claims');
    const claims = result.rows;
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a claim by ID
async function updateClaim(req: NextApiRequest, res: NextApiResponse) {
  const { id, userId, projectId, status } = req.body;

  try {
    const result = await db.query(
      'UPDATE claims SET user_id = $1, project_id = $2, status = $3 WHERE id = $4 RETURNING *',
      [userId, projectId, status, id]
    );

    const claim = result.rows[0];

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a claim by ID
async function deleteClaim(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  try {
    const result = await db.query('DELETE FROM claims WHERE id = $1 RETURNING *', [id]);
    const claim = result.rows[0];

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
