import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

interface OrderLineItem {
  dishId: string;
  dishName: string;
  category: string;
  quantity: number;
}

interface StoredOrder {
  orderId: string;
  guestName: string;
  guestEmail: string;
  diningPod: string;
  notes: string;
  items: OrderLineItem[];
  totalItems: number;
  createdAt: string;
  status: 'Received by Galley';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const memoryOrders: StoredOrder[] = [];

function loadOrders(): StoredOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as StoredOrder[];
      }
    }
  } catch {
    // Fall back to in-memory orders if filesystem read fails
  }
  return memoryOrders;
}

function saveOrder(order: StoredOrder): StoredOrder[] {
  const existing = loadOrders();
  const updated = [order, ...existing].slice(0, 50);
  memoryOrders.length = 0;
  memoryOrders.push(...updated);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, {recursive: true});
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {
    // Keep memory store even if disk write is unavailable
  }
  return updated;
}

function generateOrderId(): string {
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
  const timeSuffix = Date.now().toString().slice(-4);
  return `AR-${timeSuffix}-${randomCode}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '1mb'}));

  app.get('/api/health', (_req, res) => {
    res.json({ok: true});
  });

  app.get('/api/orders', (_req, res) => {
    const orders = loadOrders();
    res.json({orders});
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as Partial<{
      guestName: string;
      guestEmail: string;
      diningPod: string;
      notes: string;
      items: OrderLineItem[];
    }>;

    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : '';
    const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '';
    const diningPod = typeof body.diningPod === 'string' ? body.diningPod.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!guestName) {
      res.status(400).json({error: 'Please enter your name for the orbital galley order.'});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      res.status(400).json({error: 'Please provide a valid email address.'});
      return;
    }

    const validItems: OrderLineItem[] = rawItems
      .filter(
        (item) =>
          item &&
          typeof item.dishId === 'string' &&
          typeof item.dishName === 'string' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0,
      )
      .map((item) => ({
        dishId: item.dishId,
        dishName: item.dishName,
        category: typeof item.category === 'string' ? item.category : 'Cosmic Course',
        quantity: Math.min(Math.floor(item.quantity), 20),
      }));

    if (validItems.length === 0) {
      res.status(400).json({error: 'Please add at least one dish from the Cosmic Menu.'});
      return;
    }

    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    const newOrder: StoredOrder = {
      orderId: generateOrderId(),
      guestName,
      guestEmail,
      diningPod: diningPod || 'Surya Dome Pod',
      notes,
      items: validItems,
      totalItems,
      createdAt: new Date().toISOString(),
      status: 'Received by Galley',
    };

    saveOrder(newOrder);
    res.status(201).json({order: newOrder});
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANTARIKSHA RASA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
