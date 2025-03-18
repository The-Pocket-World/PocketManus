import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../backend/src/config';

// Create a new listing
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await createListing(req, res);
      break;
    case 'GET':
      await getListings(req, res);
      break;
    case 'PUT':
      await updateListing(req, res);
      break;
    case 'DELETE':
      await deleteListing(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Create a new listing
async function createListing(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, contractorId, supplierId } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO listings (title, description, contractor_id, supplier_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, contractorId, supplierId]
    );

    const listing = result.rows[0];
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all listings
async function getListings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query('SELECT * FROM listings');
    const listings = result.rows;
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a listing by ID
async function updateListing(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, description, contractorId, supplierId } = req.body;

  try {
    const result = await db.query(
      'UPDATE listings SET title = $1, description = $2, contractor_id = $3, supplier_id = $4 WHERE id = $5 RETURNING *',
      [title, description, contractorId, supplierId, id]
    );

    const listing = result.rows[0];

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a listing by ID
async function deleteListing(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  try {
    const result = await db.query('DELETE FROM listings WHERE id = $1 RETURNING *', [id]);
    const listing = result.rows[0];

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
