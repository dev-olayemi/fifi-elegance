import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET all banks
router.get('/', async (req, res) => {
  try {
    const banks = await prisma.bankAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

// GET active banks
router.get('/active', async (req, res) => {
  try {
    const banks = await prisma.bankAccount.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(banks);
  } catch (error) {
    console.error('Error fetching active banks:', error);
    res.status(500).json({ error: 'Failed to fetch active banks' });
  }
});

// POST create bank
router.post('/', async (req, res) => {
  try {
    const { bankName, accountName, accountNumber, isActive } = req.body;
    
    const bank = await prisma.bankAccount.create({
      data: {
        bankName,
        accountName,
        accountNumber,
        isActive,
      },
    });
    
    res.status(201).json(bank);
  } catch (error) {
    console.error('Error creating bank:', error);
    res.status(500).json({ error: 'Failed to create bank' });
  }
});

// PUT update bank
router.put('/:id', async (req, res) => {
  try {
    const { bankName, accountName, accountNumber, isActive } = req.body;
    
    const bank = await prisma.bankAccount.update({
      where: { id: req.params.id },
      data: {
        bankName,
        accountName,
        accountNumber,
        isActive,
      },
    });
    
    res.json(bank);
  } catch (error) {
    console.error('Error updating bank:', error);
    res.status(500).json({ error: 'Failed to update bank' });
  }
});

// DELETE bank
router.delete('/:id', async (req, res) => {
  try {
    await prisma.bankAccount.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank:', error);
    res.status(500).json({ error: 'Failed to delete bank' });
  }
});

export default router;
