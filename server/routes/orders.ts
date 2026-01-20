import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, subtotal, shippingFee, total, shippingAddress, notes } = req.body;
    
    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerInfo.email },
    });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          whatsapp: customerInfo.whatsapp || customerInfo.phone,
        },
      });
    }
    
    // Generate order number
    const orderNumber = `FF${Date.now()}`;
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        subtotal,
        shippingFee,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        notes,
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID (for tracking without auth)
router.get('/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Try finding by orderNumber or id
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
        ],
      },
      include: {
        items: true,
        customer: true,
      },
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get order by number and email (for tracking)
router.get('/track', async (req, res) => {
  try {
    const { orderNumber, email } = req.query;
    
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber as string,
        customer: {
          email: email as string,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order (admin)
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus, paymentRef } = req.body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentRef) updateData.paymentRef = paymentRef;
    
    if (paymentStatus === 'paid' && !updateData.paidAt) {
      updateData.paidAt = new Date();
      updateData.confirmedAt = new Date();
    }
    
    if (status === 'delivered' && !updateData.deliveredAt) {
      updateData.deliveredAt = new Date();
    }
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Confirm payment (admin) - shortcut to mark as paid
router.put('/:id/confirm-payment', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: 'paid',
        paymentStatus: 'paid',
        paidAt: new Date(),
        confirmedAt: new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
