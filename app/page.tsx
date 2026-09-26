'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Sparkles,
  Landmark
} from 'lucide-react';

interface Artwork {
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

function MuseumWallArtworkCard({
  art,
  idx,
}: {
  art: Artwork;
  idx: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <Link
      href={`/artwork/${art.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer group flex flex-col relative transition-all duration-400 hover:-translate-y-1.5"
    >
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-24 bg-amber-100/10 blur-xl pointer-events-none rounded-full group-hover:bg-amber-100/20 transition duration-500" />

      <div className="bg-[#2D4234] p-2 gilded-border transition-all duration-300 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.55)]">
        <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#24362B] border border-[#CBA458]/40">
          <img
            src={art.imageUrl}
            alt={art.title}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />

          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,248,220,0.5) 0%, transparent 60%)`,
            }}
          />

          <span
            className={`absolute top-2.5 right-2.5 text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 font-semibold backdrop-blur-md shadow-sm border ${
              art.status === 'Available'
                ? 'bg-[#1E3024]/90 text-emerald-300 border-emerald-500/40'
                : art.status === 'Reserved'
                ? 'bg-[#3A2A16]/90 text-amber-200 border-amber-500/40'
                : 'bg-[#1C2420]/90 text-stone-300 border-stone-600/40'
            }`}
          >
            {art.status}
          </span>
        </div>

        <div className="pt-3 pb-1 px-1 flex flex-col justify-between text-[#F8FAF8]">
          <div>
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[9px] font-mono text-[#D8BC79] uppercase tracking-widest font-semibold">
                SALLE 0{idx + 1}
              </span>
              <span className="font-mono text-[10px] text-stone-300">{art.year}</span>
            </div>

            <h2 className="font-serif text-lg text-white group-hover:text-[#DEBD78] transition font-normal truncate">
              {art.title}
            </h2>

            <p className="text-[11px] text-[#C4D4C9] font-light truncate">{art.medium}</p>
            <p className="text-[10px] text-[#A6BAAD] font-mono mt-0.5">{art.dimensions}</p>
          </div>

          <div className="pt-2 mt-2 border-t border-[#4D6C58] flex justify-between items-center">
            <span className="font-serif text-lg text-[#E8D19B] font-light">
              ${art.price.toLocaleString()}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-mono text-[#DEBD78] group-hover:text-white flex items-center gap-0.5 font-semibold transition">
              Examine <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArtworks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const featured = artworks[0];
  const homePreviewPieces = artworks.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#3F5B49] text-[#F8FAF8] font-sans antialiased selection:bg-[#CBA458] selection:text-black flex flex-col justify-between">
      {/* 1. TOP MARQUEE */}
      <div className="bg-[#FAF8F5] text-[#28382E] text-[10px] tracking-[0.25em] font-mono py-2.5 px-6 flex justify-between items-center border-b border-[#D8CEBF]">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-[#3F5B49]" />
          <span className="font-semibold">PALMER MUSEUM OF ART • PERMANENT EUROPEAN & AMERICAN GALLERIES</span>
        </div>
        <div className="hidden sm:flex gap-6 uppercase text-[#697E71] text-[9px]">
          <span>ARBORETUM BOTANIC VISTA</span>
          <span>ORIGINAL WORKS</span>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D8CEBF] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3F5B49] font-mono font-bold block">
              The Arboretum Pavilions
            </span>
            <Link
              href="/"
              className="font-serif text-2xl tracking-wider uppercase font-light text-[#223027]"
            >
              Maison d'Acrylique
            </Link>
          </div>

          <nav className="flex items-center gap-8">
            <Link href="/collection" className="text-xs uppercase tracking-widest font-mono font-semibold text-[#3F5B49] hover:text-black transition">
              Collection
            </Link>
            <Link href="/atelier" className="text-xs uppercase tracking-widest font-mono font-semibold text-[#3F5B49] hover:text-black transition">
              L'Atelier
            </Link>
          </nav>
        </div>
      </header>

      {/* 3. HERO EXHIBITION */}
      <section className="relative border-b border-[#2F4738] bg-gradient-to-b from-[#354E3E] to-[#3F5B49] py-16 lg:py-20 px-6 gallery-spotlight">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2C4133] border border-[#CBA458]/50 text-[10px] uppercase font-mono tracking-widest text-[#E8D19B]">
              <Sparkles className="w-3.5 h-3.5 text-[#CBA458]" /> Salle des Maîtres • Collection Permanente
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-light text-white leading-[1.08] tracking-tight">
              Where <span className="italic font-normal text-[#E8D19B]">Light, Nature</span> & Canvas Harmonize
            </h1>

            <p className="text-[#C4D4C9] text-lg font-light max-w-xl leading-relaxed">
              Curated acrylic studies framed against architectural sage-green walls, illuminated by diffused clerestory daylight and framed landscape vistas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-5">
              <Link
                href="/collection"
                className="px-8 py-3.5 bg-gradient-to-r from-[#CBA458] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-[0.2em] font-mono transition shadow-lg hover:brightness-110 flex items-center gap-2"
              >
                <span>Accéder au Catalogue</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono text-[#D8E4DC]">
                {artworks.filter((a) => a.status === 'Available').length} Œuvres Disponibles à l'Acquisition
              </span>
            </div>
          </div>

          {/* Symmetrical Hero Frame */}
          {featured && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <Link
                href={`/artwork/${featured.id}`}
                className="w-full max-w-[340px] sm:max-w-[360px] cursor-pointer group bg-[#2D4234] p-3 gilded-border shadow-2xl transition hover:-translate-y-1 block"
              >
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#24362B] border border-[#CBA458]/50">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#1C2C22]/95 backdrop-blur-md p-3 text-white text-xs flex justify-between items-center border border-[#CBA458]/40 shadow-lg">
                    <span className="font-serif italic truncate mr-2 text-white">{featured.title}</span>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#DEBD78] font-bold shrink-0">Examiner la Pièce →</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs font-mono text-[#C4D4C9] px-1">
                  <span className="uppercase tracking-widest text-[#E8D19B] font-semibold">Chef-d'œuvre à l'honneur</span>
                  <span>{featured.dimensions}</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. PREVIEW GALLERY */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        <div className="flex justify-between items-end border-b border-[#4E705B] pb-4 mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#DEBD78] font-semibold block mb-1">
              Sélection de la Grande Galerie
            </span>
            <h2 className="font-serif text-3xl text-white font-light">
              Œuvres Sélectionnées
            </h2>
          </div>

          <Link
            href="/collection"
            className="text-xs font-mono uppercase tracking-widest text-[#E8D19B] hover:text-white flex items-center gap-1 font-semibold transition"
          >
            Tout le Catalogue ({artworks.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {homePreviewPieces.map((art, idx) => (
            <MuseumWallArtworkCard
              key={art.id}
              art={art}
              idx={idx}
            />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3">
          <Link
            href="/collection"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#2D4234] hover:bg-[#344E3D] border-2 border-[#CBA458] text-[#DEBD78] hover:text-white text-xs font-mono uppercase tracking-[0.2em] transition shadow-xl group cursor-pointer"
          >
            <span>Voir Toute la Collection ({artworks.length} Œuvres)</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <p className="text-[11px] font-mono text-[#A6BAAD]">
            Accédez à la totalité des œuvres, filtres de styles et recherche détaillée
          </p>
        </div>
      </main>

      {/* 5. ATELIER BANNER */}
      <section className="border-t border-[#D4C3AB] py-16 px-6 bg-[#EFE5D6] text-[#28382E] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#556F5E] font-bold">
            Conservation & Atelier
          </span>
          <h2 className="font-serif text-3xl font-light text-[#1F2C23]">
            Explore the Studio & Technique
          </h2>
          <p className="text-[#4E6255] text-sm leading-relaxed font-light">
            Discover the mineral pigments, 20-layer glazes, and archival Belgian linen grounds behind every painting.
          </p>
          <div className="pt-2">
            <Link
              href="/atelier"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3F5B49] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#2C4133] transition shadow-md"
            >
              Consulter le Dossier d'Atelier →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-[#D4C3AB] py-10 px-6 bg-[#E5D7C3] text-[#4A5D51]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <span className="font-serif text-base tracking-wider uppercase text-[#223027] font-normal">
            Maison d'Acrylique • The Green Galleries
          </span>

          <p>
            <span
              onDoubleClick={() => router.push('/lalalo')}
              className="cursor-default select-none hover:text-black transition"
              title="Atelier Access"
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} Studio Archive. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}