import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  WARNING: DATABASE_URL is not set. Using local SQLite for dev.');
}

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_biztrack_key_for_local_dev';

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, displayName, businessName } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
        businessName,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName, businessName: user.businessName } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName, businessName: user.businessName } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, businessName: user.businessName } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Sales
app.get('/api/sales', authenticateToken, async (req: any, res: any) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { date: 'desc' }
    });
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', authenticateToken, async (req: any, res: any) => {
  try {
    const { date, customerName, total, paymentMethod, items } = req.body;
    const sale = await prisma.sale.create({
      data: {
        date,
        customerName,
        total,
        paymentMethod,
        userId: req.user.userId,
        items: {
          create: items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory
app.get('/api/inventory', authenticateToken, async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.userId },
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', authenticateToken, async (req: any, res: any) => {
  try {
    const product = await prisma.product.create({
      data: { ...req.body, userId: req.user.userId }
    });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', authenticateToken, async (req: any, res: any) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId: req.user.userId },
    });
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;