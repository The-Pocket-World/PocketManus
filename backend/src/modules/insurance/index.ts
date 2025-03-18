import { Router, Request, Response } from 'express';
import { Claim } from './models/claim';

const router = Router();

// Create a new claim
router.post('/', async (req: Request, res: Response) => {
  const { policyNumber, description, amount, status } = req.body;

  try {
    const newClaim = new Claim({
      policyNumber,
      description,
      amount,
      status,
    });

    await newClaim.save();

    res.status(201).json(newClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all claims
router.get('/', async (req: Request, res: Response) => {
  try {
    const claims = await Claim.find();
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single claim by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a claim by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { policyNumber, description, amount, status } = req.body;

  try {
    const updatedClaim = await Claim.findByIdAndUpdate(
      id,
      { policyNumber, description, amount, status },
      { new: true }
    );

    if (!updatedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a claim by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedClaim = await Claim.findByIdAndDelete(id);

    if (!deletedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
