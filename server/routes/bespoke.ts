import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET all bespoke requests
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.bespokeRequest.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching bespoke requests:', error);
    res.status(500).json({ error: 'Failed to fetch bespoke requests' });
  }
});

// GET single bespoke request
router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.bespokeRequest.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
      },
    });
    if (!request) {
      return res.status(404).json({ error: 'Bespoke request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error('Error fetching bespoke request:', error);
    res.status(500).json({ error: 'Failed to fetch bespoke request' });
  }
});

// POST create bespoke request
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerWhatsapp,
      description,
      measurements,
      budgetRange,
      deadline,
      referenceImages,
    } = req.body;

    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: customerName,
          email: customerEmail,
          phone: customerPhone,
          whatsapp: customerWhatsapp,
        },
      });
    }

    // Generate request number
    const count = await prisma.bespokeRequest.count();
    const requestNumber = `BSP${String(count + 1).padStart(6, '0')}`;

    const request = await prisma.bespokeRequest.create({
      data: {
        requestNumber,
        customerId: customer.id,
        description,
        measurements: JSON.stringify(measurements),
        budgetRange,
        deadline,
        referenceImages: referenceImages ? JSON.stringify(referenceImages) : null,
        status: 'pending',
      },
      include: {
        customer: true,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating bespoke request:', error);
    res.status(500).json({ error: 'Failed to create bespoke request' });
  }
});

// PUT update bespoke request
router.put('/:id', async (req, res) => {
  try {
    const {
      status,
      adminNotes,
      quotedPrice,
      description,
      measurements,
      budgetRange,
      deadline,
    } = req.body;

    const updateData: any = {};

    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (quotedPrice !== undefined) {
      updateData.quotedPrice = parseFloat(quotedPrice);
      updateData.quotedAt = new Date();
    }
    if (description) updateData.description = description;
    if (measurements) updateData.measurements = JSON.stringify(measurements);
    if (budgetRange) updateData.budgetRange = budgetRange;
    if (deadline) updateData.deadline = deadline;

    // Set timestamps based on status
    if (status === 'approved' && !updateData.approvedAt) {
      updateData.approvedAt = new Date();
    }
    if (status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const request = await prisma.bespokeRequest.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        customer: true,
      },
    });

    res.json(request);
  } catch (error) {
    console.error('Error updating bespoke request:', error);
    res.status(500).json({ error: 'Failed to update bespoke request' });
  }
});

// DELETE bespoke request
router.delete('/:id', async (req, res) => {
  try {
    await prisma.bespokeRequest.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Bespoke request deleted successfully' });
  } catch (error) {
    console.error('Error deleting bespoke request:', error);
    res.status(500).json({ error: 'Failed to delete bespoke request' });
  }
});

export default router;
