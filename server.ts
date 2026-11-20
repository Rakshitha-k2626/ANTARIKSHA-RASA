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
  serviceMode: 'Orbital Dine-In' | 'Delivery Service';
  diningPod: string;
  deliveryDestination: string;
  deliveryTier: string;
  notes: string;
  items: OrderLineItem[];
  totalItems: number;
  createdAt: string;
  status: string;
}

interface CustomerFeedback {
  id: string;
  authorName: string;
  roleOrMission: string;
  experienceType: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

const SEED_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'fb-1',
    authorName: 'Dr. Kavita Deshmukh',
    roleOrMission: 'Payload Specialist · Gaganyaan Orbital Lab',
    experienceType: 'Chandra Zero-G Salon',
    rating: 5,
    comment:
      'In microgravity, terrestrial meals always felt muted on the palate. The Stellar Thali Kashmiri saffron velouté and Nebula Bites kept every aromatic note vibrant with zero floating crumbs.',
    createdAt: '2026-10-14T18:20:00.000Z',
  },
  {
    id: 'fb-2',
    authorName: 'Commander Henrik Lindqvist',
    roleOrMission: 'Flight Operations · Nordic Orbital Transit',
    experienceType: 'Station Airlock Delivery',
    rating: 5,
    comment:
      'Ordered six Galaxy Smoothies and a Lunar Dessert flight to Docking Ring 3 before EVA prep. The cryo-thermal capsule arrived in 14 minutes with spiral vessels still chilled to 6 °C.',
    createdAt: '2026-11-02T09:45:00.000Z',
  },
  {
    id: 'fb-3',
    authorName: 'Meera Subramanian',
    roleOrMission: 'Astrophysics Fellow · Bengaluru Deep Space Array',
    experienceType: 'Nakshatra Observatory Alcove',
    rating: 5,
    comment:
      'Watching the aurora arc beneath the Surya Dome while sipping cardamom-infused Stellar Chai felt both deeply grounding and utterly otherworldly.',
    createdAt: '2026-11-11T21:10:00.000Z',
  },
];

const memoryOrders: StoredOrder[] = [];
const memoryFeedback: CustomerFeedback[] = [...SEED_FEEDBACK];

function readJsonFile<T>(filePath: string, fallback: T[]): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as T[];
      }
    }
  } catch {
    // Fall back to in-memory store
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, items: T[], memoryTarget: T[]) {
  memoryTarget.length = 0;
  memoryTarget.push(...items);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, {recursive: true});
    }
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch {
    // Keep memory store if disk write is unavailable
  }
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
    const orders = readJsonFile<StoredOrder>(ORDERS_FILE, memoryOrders);
    res.json({orders});
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as Partial<{
      guestName: string;
      guestEmail: string;
      serviceMode: 'Orbital Dine-In' | 'Delivery Service';
      diningPod: string;
      deliveryDestination: string;
      deliveryTier: string;
      notes: string;
      items: OrderLineItem[];
    }>;

    const guestName =
      typeof body.guestName === 'string' ? body.guestName.trim() : '';
    const guestEmail =
      typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '';
    const serviceMode =
      body.serviceMode === 'Delivery Service'
        ? 'Delivery Service'
        : 'Orbital Dine-In';
    const diningPod =
      typeof body.diningPod === 'string' ? body.diningPod.trim() : '';
    const deliveryDestination =
      typeof body.deliveryDestination === 'string'
        ? body.deliveryDestination.trim()
        : '';
    const deliveryTier =
      typeof body.deliveryTier === 'string' ? body.deliveryTier.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!guestName) {
      res
        .status(400)
        .json({error: 'Please enter your name for the orbital galley order.'});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      res.status(400).json({error: 'Please provide a valid email address.'});
      return;
    }

    if (serviceMode === 'Delivery Service' && !deliveryDestination) {
      res.status(400).json({
        error:
          'Please enter a docking bay, habitat module, or terrestrial delivery address.',
      });
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
        category:
          typeof item.category === 'string' ? item.category : 'Cosmic Course',
        quantity: Math.min(Math.floor(item.quantity), 20),
      }));

    if (validItems.length === 0) {
      res
        .status(400)
        .json({error: 'Please add at least one dish from the Cosmic Menu.'});
      return;
    }

    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    const newOrder: StoredOrder = {
      orderId: generateOrderId(),
      guestName,
      guestEmail,
      serviceMode,
      diningPod: diningPod || 'Surya Dome Pod',
      deliveryDestination:
        serviceMode === 'Delivery Service' ? deliveryDestination : 'On-Station',
      deliveryTier:
        serviceMode === 'Delivery Service'
          ? deliveryTier || 'Station Airlock Transfer'
          : 'Table Service',
      notes,
      items: validItems,
      totalItems,
      createdAt: new Date().toISOString(),
      status:
        serviceMode === 'Delivery Service'
          ? 'Capsule Dispatched from Galley'
          : 'Received by Galley',
    };

    const existing = readJsonFile<StoredOrder>(ORDERS_FILE, memoryOrders);
    const updated = [newOrder, ...existing].slice(0, 60);
    writeJsonFile(ORDERS_FILE, updated, memoryOrders);
    res.status(201).json({order: newOrder});
  });

  app.get('/api/feedback', (_req, res) => {
    const feedback = readJsonFile<CustomerFeedback>(
      FEEDBACK_FILE,
      memoryFeedback,
    );
    res.json({feedback});
  });

  app.post('/api/feedback', (req, res) => {
    const body = req.body as Partial<{
      authorName: string;
      roleOrMission: string;
      experienceType: string;
      rating: number;
      comment: string;
    }>;

    const authorName =
      typeof body.authorName === 'string' ? body.authorName.trim() : '';
    const roleOrMission =
      typeof body.roleOrMission === 'string' ? body.roleOrMission.trim() : '';
    const experienceType =
      typeof body.experienceType === 'string'
        ? body.experienceType.trim()
        : '';
    const comment =
      typeof body.comment === 'string' ? body.comment.trim() : '';
    const ratingNum =
      typeof body.rating === 'number'
        ? Math.max(1, Math.min(5, Math.round(body.rating)))
        : 5;

    if (!authorName || authorName.length < 2) {
      res.status(400).json({error: 'Please enter your name.'});
      return;
    }

    if (!comment || comment.length < 8) {
      res.status(400).json({
        error: 'Please share a brief note about your dining or delivery experience.',
      });
      return;
    }

    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      authorName,
      roleOrMission: roleOrMission || 'Orbital Guest',
      experienceType: experienceType || 'Orbital Dining',
      rating: ratingNum,
      comment,
      createdAt: new Date().toISOString(),
    };

    const existing = readJsonFile<CustomerFeedback>(
      FEEDBACK_FILE,
      memoryFeedback,
    );
    const updated = [newFeedback, ...existing].slice(0, 60);
    writeJsonFile(FEEDBACK_FILE, updated, memoryFeedback);
    res.status(201).json({feedback: newFeedback});
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
