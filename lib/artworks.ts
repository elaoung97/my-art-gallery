'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

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

const filePath = path.join(process.cwd(), 'data', 'paintings.json');

// 1. Get all paintings
export async function getArtworks(): Promise<Artwork[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [
      {
        id: '1',
        title: 'Whispers of Ochre',
        year: 2025,
        category: 'Abstract',
        medium: 'Heavy acrylic on linen',
        dimensions: '100 x 120 cm',
        price: 3200,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
        story: 'Created with layered mineral glazes and heavy impasto palette knife technique.',
      },
    ];
  }
}

// 2. Add artwork with computer file upload OR URL
export async function addArtwork(formData: FormData) {
  const dir = path.join(process.cwd(), 'data');
  await fs.mkdir(dir, { recursive: true });

  const file = formData.get('imageFile') as File | null;
  let imageUrl = (formData.get('imageUrl') as string) || '';

  // If the user uploaded a file from their computer
  if (file && file.size > 0 && file.name) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    await fs.writeFile(path.join(uploadDir, safeName), buffer);
    imageUrl = `/uploads/${safeName}`;
  }

  // Fallback placeholder if no image provided
  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80';
  }

  const current = await getArtworks();

  const newPainting: Artwork = {
    id: Date.now().toString(),
    title: (formData.get('title') as string) || 'Untitled',
    year: Number(formData.get('year')) || new Date().getFullYear(),
    category: (formData.get('category') as string) || 'Abstract',
    medium: (formData.get('medium') as string) || 'Heavy Acrylic on Canvas',
    dimensions: (formData.get('dimensions') as string) || '80 x 100 cm',
    price: Number(formData.get('price')) || 0,
    status: (formData.get('status') as Artwork['status']) || 'Available',
    imageUrl,
    story: (formData.get('story') as string) || '',
  };

  const updated = [newPainting, ...current];
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

  revalidatePath('/');
  revalidatePath('/admin');
}

// 3. Quick Update Status (Available <-> Reserved <-> Sold)
export async function updateArtworkStatus(id: string, newStatus: 'Available' | 'Reserved' | 'Sold') {
  const current = await getArtworks();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

  revalidatePath('/');
  revalidatePath('/admin');
}

// 4. Delete an artwork
export async function removeArtwork(id: string) {
  const current = await getArtworks();
  const updated = current.filter((item) => item.id !== id);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

  revalidatePath('/');
  revalidatePath('/admin');
}