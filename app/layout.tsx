import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisondacrylique.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maison d'Acrylique | The Palmer Green Galleries",
    template: "%s | Maison d'Acrylique",
  },
  description:
    'Contemporary original acrylic paintings, mineral glaze studies on Belgian linen, and private atelier commissions.',
  keywords: [
    'Contemporary Art',
    'Acrylic Paintings',
    'Original Art Gallery',
    'Belgian Linen',
    'Art Collection Paris',
    'Mineral Glazes',
  ],
  authors: [{ name: "Maison d'Acrylique Atelier" }],
  creator: "Maison d'Acrylique",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: "Maison d'Acrylique",
    title: "Maison d'Acrylique | Fine Art & Contemporary Paintings",
    description:
      'Curated acrylic studies framed against architectural sage-green walls, illuminated by natural gallery light.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Maison d'Acrylique Gallery",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Maison d'Acrylique | Contemporary Art",
    description: 'Original fine art paintings, mineral pigments, and private commissions.',
  },
};

const galleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ArtGallery',
  name: "Maison d'Acrylique",
  url: siteUrl,
  description:
    'Contemporary fine art atelier and gallery specializing in layered heavy-body acrylics on archival Belgian linen.',
  currenciesAccepted: 'USD, EUR, MAD',
  paymentAccepted: 'Credit Card, Bank Wire',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#CBA458] selection:text-black">
        {children}
      </body>
    </html>
  );
}