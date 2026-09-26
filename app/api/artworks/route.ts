import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export interface Artwork {
  id: string;
  title: string;
  year: number;
  category: string;
  medium: string;
  dimensions: string;
  price: number;
  status: 'Available' | 'Reserved' | 'Sold';
  imageUrl: string;
  story: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'paintings.json');

const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    title: 'Whispers in Raw Umber',
    year: 2025,
    category: 'Abstract',
    medium: 'Heavy-body acrylic with raw mineral pigments on Belgian linen',
    dimensions: '120 × 160 cm',
    price: 4800,
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
    story: 'Exploration of tectonic depth and ancient stone facade erosion. Sixteen translucent glazes layered over structural pumice paste.',
  },
  {
    id: 'art-2',
    title: 'Horizon at Low Tide',
    year: 2024,
    category: 'Landscape',
    medium: 'Fluid acrylics & semi-gloss UV barrier on cradle wood panel',
    dimensions: '90 × 120 cm',
    price: 3600,
    status: 'Sold',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80',
    story: 'Atmospheric study of morning sea mist against low tide mudflats. Wet-on-wet feathering combined with palette knife incisions.',
  },
];

async function readData(): Promise<Artwork[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(INITIAL_ARTWORKS, null, 2), 'utf-8');
    return INITIAL_ARTWORKS;
  }
}

async function writeData(data: Artwork[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('studio_session')?.value;
  const secret = process.env.ADMIN_SECRET_KEY || 'atelier2026';
  return session === secret;
}

export async function GET() {
  const artworks = await readData();
  return NextResponse.json(artworks);
}

export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const artworks = await readData();

    const newPiece: Artwork = {
      id: `piece-${Date.now()}`,
      title: body.title || 'Untitled Artwork',
      year: Number(body.year) || new Date().getFullYear(),
      category: body.category || 'Abstract',
      medium: body.medium || 'Heavy acrylic on linen',
      dimensions: body.dimensions || '100 × 120 cm',
      price: Number(body.price) || 0,
      status: body.status || 'Available',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
      story: body.story || '',
    };

    const updated = [newPiece, ...artworks];
    await writeData(updated);
    return NextResponse.json(updated, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add artwork' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, price } = await req.json();
    const artworks = await readData();

    const updated = artworks.map((item) =>
      item.id === id
        ? { ...item, status: status ?? item.status, price: price !== undefined ? Number(price) : item.price }
        : item
    );

    await writeData(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const artworks = await readData();
    const updated = artworks.filter((item) => item.id !== id);
    await writeData(updated);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}