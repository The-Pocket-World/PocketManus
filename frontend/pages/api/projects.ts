import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../backend/src/config';

// Create a new project
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await createProject(req, res);
      break;
    case 'GET':
      await getProjects(req, res);
      break;
    case 'PUT':
      await updateProject(req, res);
      break;
    case 'DELETE':
      await deleteProject(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Create a new project
async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, propertyId, inspectionId, estimateId } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO projects (name, description, property_id, inspection_id, estimate_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, propertyId, inspectionId, estimateId]
    );

    const project = result.rows[0];
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all projects
async function getProjects(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query('SELECT * FROM projects');
    const projects = result.rows;
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a project by ID
async function updateProject(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, description, propertyId, inspectionId, estimateId } = req.body;

  try {
    const result = await db.query(
      'UPDATE projects SET name = $1, description = $2, property_id = $3, inspection_id = $4, estimate_id = $5 WHERE id = $6 RETURNING *',
      [name, description, propertyId, inspectionId, estimateId, id]
    );

    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a project by ID
async function deleteProject(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  try {
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
