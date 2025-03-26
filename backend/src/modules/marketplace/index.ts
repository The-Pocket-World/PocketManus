import { Router, Request, Response } from 'express';
import { Listing } from './models/listing';

const router = Router();

// Create a new listing
router.post('/', async (req: Request, res: Response) => {
  const { title, description, contractorId, supplierId } = req.body;

  try {
    const newListing = new Listing({
      title,
      description,
      contractorId,
      supplierId,
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all listings
router.get('/', async (req: Request, res: Response) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single listing by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a listing by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, contractorId, supplierId } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { title, description, contractorId, supplierId },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a listing by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
