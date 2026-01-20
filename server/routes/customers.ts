import { Router } from 'express';
import prisma from '../prisma';
import crypto from 'crypto';

const router = Router();

// Helper function to generate simple JWT (for demo purposes)
const generateToken = (customerId: string) => {
  return Buffer.from(JSON.stringify({
    customerId,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  })).toString('base64');
};

// Helper function to hash password (simple hash for demo)
const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if customer already exists
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        fullName,
        email,
        phone,
        whatsapp: phone,
        // In production, use bcrypt. For now, store simple hash
        // password: hashPassword(password),
      },
    });

    const token = generateToken(customer.id);

    res.status(201).json({
      token,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // In production, compare with bcrypt hash
    // For demo, we'll accept any password for existing users
    const token = generateToken(customer.id);

    res.json({
      token,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            orders: true,
            bespoke: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
        bespoke: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// GET customer orders
router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.params.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
        customer: {
          select: { fullName: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Transform items for frontend
    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
    
    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// UPDATE customer
router.put('/:id', async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone, whatsapp: phone }),
      },
    });

    res.json({
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

export default router;
