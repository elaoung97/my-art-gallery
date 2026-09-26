'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowUpRight,
  ArrowLeft,
  LayoutGrid,
  Columns,
  Landmark,
  Sparkles
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

export default function CollectionPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'editorial'>('grid');

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArtworks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = artworks.filter((art) => {
    const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || art.status === selectedStatus;
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.medium.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#3F5B49] text-[#F8FAF8] font-sans antialiased selection:bg-[#CBA458] selection:text-black flex flex-col justify-between">
      <div className="bg-[#FAF8F5] text-[#28382E] text-[10px] tracking-[0.25em] font-mono py-2.5 px-6 flex justify-between items-center border-b border-[#D8CEBF]">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-[#3F5B49]" />
          <span>LE CATALOGUE RAISONNÉ • TOUTES LES SALLES DU MUSÉE</span>
        </div>
        <div className="hidden sm:flex gap-6 uppercase text-[#697E71] text-[9px]">
          <span>{filtered.length} ŒUVRES INVENTORIÉES</span>
          <span>PARIS • CASABLANCA</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D8CEBF] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#3F5B49] hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>

          <Link
            href="/"
            className="font-serif text-2xl tracking-wider uppercase font-light text-[#223027]"
          >
            Maison d'Acrylique
          </Link>

          <Link
            href="/atelier"
            className="text-xs uppercase tracking-widest font-mono font-semibold text-[#3F5B49] hover:text-black transition"
          >
            L'Atelier
          </Link>
        </div>
      </header>

      <section className="py-12 lg:py-16 px-6 border-b border-[#2F4738] bg-gradient-to-b from-[#354E3E] to-[#3F5B49] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2C4133] border border-[#CBA458]/50 text-[10px] uppercase font-mono tracking-widest text-[#E8D19B]">
            <Sparkles className="w-3.5 h-3.5 text-[#CBA458]" /> Collection Permanente Complète
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white">
            Le Catalogue des Galeries
          </h1>
          <p className="text-sm text-[#C4D4C9] font-light max-w-xl mx-auto">
            Parcourez l'ensemble des études acryliques originales exécutées sur lin de Flandres et scellées sous vernis de grade muséal.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 mb-10 border-b border-[#4E705B]">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Abstract', 'Landscape', 'Expressive', 'Portrait'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-mono transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#CBA458] text-[#1E2C23] font-bold shadow-md'
                    : 'bg-[#344D3D] text-[#C4D4C9] hover:text-white border border-[#4D6D57]'
                }`}
              >
                {cat === 'All' ? 'Toutes les Salles' : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#CBA458]" />
              <input
                type="text"
                placeholder="Rechercher une pièce..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#2E4536] border border-[#4E705B] pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#CBA458] text-white font-mono placeholder:text-[#8AA493]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#2E4536] border border-[#4E705B] px-3 py-1.5 text-xs focus:outline-none focus:border-[#CBA458] uppercase tracking-wider text-[#DEBD78] font-mono font-semibold"
            >
              <option value="All">Tous Statuts</option>
              <option value="Available">Disponible</option>
              <option value="Reserved">Réservé</option>
              <option value="Sold">Archivée</option>
            </select>

            <div className="hidden sm:flex border border-[#4E705B] bg-[#2E4536] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-[#CBA458] text-black font-bold' : 'text-[#8AA493]'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                className={`p-1.5 transition ${viewMode === 'editorial' ? 'bg-[#CBA458] text-black font-bold' : 'text-[#8AA493]'}`}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((art, idx) => (
              <MuseumWallArtworkCard
                key={art.id}
                art={art}
                idx={idx}
              />
            ))}
          </div>
        )}

        {viewMode === 'editorial' && (
          <div className="space-y-8">
            {filtered.map((art, idx) => (
              <Link
                href={`/artwork/${art.id}`}
                key={art.id}
                className="cursor-pointer group grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#2E4536] gilded-border p-5 transition shadow-lg hover:shadow-2xl"
              >
                <div className="md:col-span-4 aspect-[4/3] bg-[#24362B] overflow-hidden border border-[#CBA458]/40">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  />
                </div>

                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#DEBD78] font-semibold">
                      Salle 0{idx + 1} • {art.category}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-[10px] font-mono text-[#A6BAAD]">{art.year}</span>
                  </div>

                  <h2 className="font-serif text-2xl font-normal text-white">
                    {art.title}
                  </h2>

                  <p className="text-xs text-[#C4D4C9] font-light line-clamp-2">
                    {art.story || art.medium}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-serif text-xl text-[#E8D19B]">${art.price.toLocaleString()}</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#DEBD78] font-semibold flex items-center gap-1">
                      Examiner la Pièce <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#A6BAAD] font-mono text-xs">
            Aucune œuvre ne correspond aux critères de recherche actuels.
          </div>
        )}
      </main>

      <footer className="border-t border-[#D4C3AB] py-10 px-6 bg-[#E5D7C3] text-[#4A5D51]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <span className="font-serif text-base tracking-wider uppercase text-[#223027] font-normal">
            Maison d'Acrylique • Catalogue Officiel
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