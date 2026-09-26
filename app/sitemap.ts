import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

interface Artwork {
  id: string;
  title: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisondacrylique.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/atelier`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let artworkRoutes: MetadataRoute.Sitemap = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'paintings.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const artworks: Artwork[] = JSON.parse(fileContent);

    artworkRoutes = artworks.map((art) => ({
      url: `${baseUrl}/artwork/${art.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error reading artworks for sitemap:', err);
  }

  return [...staticRoutes, ...artworkRoutes];
}