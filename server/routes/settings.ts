import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc',
      },
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// POST/PUT upsert setting
router.post('/', async (req, res) => {
  try {
    const { key, value, type } = req.body;
    
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type: type || 'text' },
    });
    
    res.json(setting);
  } catch (error) {
    console.error('Error upserting setting:', error);
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

// DELETE setting
router.delete('/:key', async (req, res) => {
  try {
    await prisma.siteSetting.delete({
      where: { key: req.params.key },
    });
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

export default router;
