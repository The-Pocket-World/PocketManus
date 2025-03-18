import { Router, Request, Response } from 'express';
import { Project } from './models/project';

const router = Router();

// Create a new project
router.post('/', async (req: Request, res: Response) => {
  const { name, description, propertyId, inspectionId, estimateId } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      propertyId,
      inspectionId,
      estimateId,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a project by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, propertyId, inspectionId, estimateId } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, propertyId, inspectionId, estimateId },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
