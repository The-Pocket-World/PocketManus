import { Router, Request, Response } from 'express';
import { db } from '../config';

const router = Router();

// Create a new claim
router.post('/', async (req: Request, res: Response) => {
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
});

// Get all claims
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM claims');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single claim by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM claims WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a claim by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, projectId, status } = req.body;

  try {
    const result = await db.query(
      'UPDATE claims SET user_id = $1, project_id = $2, status = $3 WHERE id = $4 RETURNING *',
      [userId, projectId, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a claim by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM claims WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
