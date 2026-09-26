'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Check,
  Maximize2,
  ZoomIn,
  Award,
  Layers,
  Mail,
  ShieldCheck,
  Palette,
  X,
  Eye
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

function MuseumMagnifier({ src, alt }: { src: string; alt: string }) {
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef<HTMLImageElement>(null);
  const zoomFactor = 2.5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLensPosition((prev) => ({ ...prev, visible: false }));
      return;
    }

    setLensPosition({ x, y, visible: true });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLensPosition((prev) => ({ ...prev, visible: false }))}
      className="relative overflow-hidden cursor-crosshair flex items-center justify-center p-6 bg-[#2D4234] border border-[#CBA458]/50 shadow-2xl"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-h-[75vh] w-auto object-contain mx-auto border border-[#CBA458]/40 shadow-xl"
      />

      {lensPosition.visible && imgRef.current && (
        <div
          className="pointer-events-none absolute w-52 h-52 rounded-full border-2 border-[#DEBD78] shadow-[0_0_35px_rgba(203,164,88,0.4)] overflow-hidden z-30 bg-black"
          style={{
            left: `${lensPosition.x - 104}px`,
            top: `${lensPosition.y - 104}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgRef.current.width * zoomFactor}px ${imgRef.current.height * zoomFactor}px`,
            backgroundPosition: `-${lensPosition.x * zoomFactor - 104}px -${lensPosition.y * zoomFactor - 104}px`,
          }}
        >
          <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-mono uppercase tracking-widest text-[#E8D19B] bg-black/85 py-0.5 font-bold">
            2.5× Loupe de Restauration
          </div>
        </div>
      )}

      {!lensPosition.visible && (
        <div className="absolute bottom-4 right-4 bg-[#1C2C22]/90 border border-[#CBA458]/40 px-3.5 py-1.5 rounded-none text-[#E8D19B] text-[10px] font-mono flex items-center gap-1.5 pointer-events-none shadow-md">
          <ZoomIn className="w-3.5 h-3.5 text-[#CBA458]" /> Survolez pour inspecter la matière
        </div>
      )}
    </div>
  );
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const artworkId = params?.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewOnWall, setViewOnWall] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [wallStyle, setWallStyle] = useState<'green' | 'white' | 'concrete'>('green');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data: Artwork[]) => {
        if (Array.isArray(data)) {
          const piece = data.find((a) => a.id === artworkId);
          setArtwork(piece || null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [artworkId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!artwork) return;
    setSubmittingOrder(true);

    const form = e.currentTarget;
    const clientName = (form.elements.namedItem('name') as HTMLInputElement).value;
    const clientEmail = (form.elements.namedItem('email') as HTMLInputElement).value;
    const clientPhone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const shippingAddress = (form.elements.namedItem('address') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: artwork.id,
          artworkTitle: artwork.title,
          price: artwork.price,
          clientName,
          clientEmail,
          clientPhone,
          shippingAddress,
          message,
        }),
      });

      if (res.ok) {
        alert(`Merci ${clientName}! Votre ordre d'acquisition a été transmis à l'atelier.`);
        form.reset();
        setIsOrderModalOpen(false);
      } else {
        alert('Échec de transmission de la commande.');
      }
    } catch {
      alert('Erreur réseau.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3F5B49] flex items-center justify-center font-mono text-xs text-[#E8D19B]">
        Ouverture des archives de la galerie...
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#3F5B49] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl mb-2">Œuvre Non Trouvée</h1>
        <p className="text-sm text-[#C4D4C9] mb-6">Cette pièce a peut-être été archivée.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#CBA458] text-[#1E2C23] font-bold text-xs uppercase tracking-widest"
        >
          Retour aux Galeries
        </Link>
      </div>
    );
  }

  const visualArtworkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    image: artwork.imageUrl,
    dateCreated: artwork.year.toString(),
    artMedium: artwork.medium,
    artform: 'Painting',
    artworkSurface: 'Belgian Linen',
    size: artwork.dimensions,
    description: artwork.story || `${artwork.title} - Acrylic painting on linen.`,
    creator: {
      '@type': 'Person',
      name: "Maison d'Acrylique Atelier",
    },
    offers: {
      '@type': 'Offer',
      price: artwork.price,
      priceCurrency: 'USD',
      availability:
        artwork.status === 'Available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
  };

  return (
    <div className="min-h-screen bg-[#3F5B49] text-[#F8FAF8] font-sans antialiased selection:bg-[#CBA458] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(visualArtworkJsonLd),
        }}
      />

      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D8CEBF] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#3F5B49] hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la Galerie
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewOnWall(!viewOnWall)}
              className="px-4 py-2 bg-[#EFE5D6] hover:bg-[#E5D7C3] border border-[#D4C3AB] text-[#28382E] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition font-semibold cursor-pointer shadow-sm"
            >
              {viewOnWall ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#3F5B49]" />
                  <span>Vue Rapprochée</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#3F5B49]" />
                  <span>Accrochage sur le Mur</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 bg-[#EFE5D6] hover:bg-[#E5D7C3] border border-[#D4C3AB] text-[#28382E] transition cursor-pointer"
              title="Partager"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            {viewOnWall ? (
              <div className="w-full aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden rounded-xl shadow-2xl border-2 border-[#CBA458]/60 flex flex-col justify-between select-none">
                <div
                  className={`absolute inset-0 transition-colors duration-700 ${
                    wallStyle === 'green'
                      ? 'bg-[#3F5B49]'
                      : wallStyle === 'white'
                      ? 'bg-[#F2EFE9]'
                      : 'bg-[#B0AAA0]'
                  }`}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-56 bg-amber-100/15 blur-3xl rounded-full pointer-events-none" />
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center p-6 pb-2">
                  <div
                    className="relative transition-all duration-500 max-w-[290px] w-[50%]"
                    style={{
                      transform: 'translateY(-10px)',
                    }}
                  >
                    <div
                      className="p-1.5 bg-[#17120B] border-2 border-[#DEBD78]"
                      style={{
                        boxShadow:
                          '0 25px 40px -10px rgba(0,0,0,0.65), 0 10px 20px -5px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-black">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-3 mx-auto w-fit px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-center">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#E8D19B] block font-semibold">
                        {artwork.title}
                      </span>
                      <span className="text-[8px] font-mono text-stone-300">
                        {artwork.dimensions} • {artwork.year}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 w-full">
                  <div
                    className={`h-4 w-full border-t border-black/20 ${
                      wallStyle === 'green' ? 'bg-[#2A3F33]' : 'bg-[#DCD5C9]'
                    }`}
                  />
                  <div
                    className="h-16 w-full shadow-inner border-t border-[#C7AF91] relative overflow-hidden"
                    style={{
                      backgroundColor: '#DFCEB7',
                      backgroundImage:
                        'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(0,0,0,0.04) 121px)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-black/85 backdrop-blur-md px-4 py-2 rounded-lg border border-[#CBA458]/40 shadow-xl z-20">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[#DEBD78] font-bold">Accrochage sur le mur :</span>
                    <span className="text-stone-300">Hauteur des yeux (150 cm)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <button
                      onClick={() => setWallStyle('green')}
                      className={`px-3 py-1 rounded transition cursor-pointer ${
                        wallStyle === 'green'
                          ? 'bg-[#CBA458] text-[#1E2C23] font-bold shadow-sm'
                          : 'bg-white/10 text-stone-300 hover:text-white'
                      }`}
                    >
                      Mur Vert Palmer
                    </button>
                    <button
                      onClick={() => setWallStyle('white')}
                      className={`px-3 py-1 rounded transition cursor-pointer ${
                        wallStyle === 'white'
                          ? 'bg-[#CBA458] text-[#1E2C23] font-bold shadow-sm'
                          : 'bg-white/10 text-stone-300 hover:text-white'
                      }`}
                    >
                      Mur Blanc Musée
                    </button>
                    <button
                      onClick={() => setWallStyle('concrete')}
                      className={`px-3 py-1 rounded transition cursor-pointer ${
                        wallStyle === 'concrete'
                          ? 'bg-[#CBA458] text-[#1E2C23] font-bold shadow-sm'
                          : 'bg-white/10 text-stone-300 hover:text-white'
                      }`}
                    >
                      Mur Pierre & Béton
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <MuseumMagnifier src={artwork.imageUrl} alt={artwork.title} />
            )}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-[#2D4234] p-4 border border-[#CBA458]/40 flex items-center gap-3">
                <Award className="w-5 h-5 text-[#DEBD78] shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase text-[10px]">Pièce Unique 1/1</span>
                  <span className="text-[#C4D4C9] text-[11px]">Œuvre Originale</span>
                </div>
              </div>

              <div className="bg-[#2D4234] p-4 border border-[#CBA458]/40 flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#DEBD78] shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase text-[10px]">Lin Pur de Flandres</span>
                  <span className="text-[#C4D4C9] text-[11px]">Châssis Noble à Clés</span>
                </div>
              </div>

              <div className="bg-[#2D4234] p-4 border border-[#CBA458]/40 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase text-[10px]">Protection UV</span>
                  <span className="text-[#C4D4C9] text-[11px]">Vernis Archival Scellé</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-[#DEBD78] font-bold">
                  {artwork.category} • Réf. Cat. {artwork.id.slice(-4)}
                </span>
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider px-3 py-1 font-semibold border ${
                    artwork.status === 'Available'
                      ? 'bg-[#1E3024] text-emerald-300 border-emerald-500/40'
                      : artwork.status === 'Reserved'
                      ? 'bg-[#3A2A16] text-amber-200 border-amber-500/40'
                      : 'bg-[#1C2420] text-stone-300 border-stone-600/40'
                  }`}
                >
                  {artwork.status}
                </span>
              </div>

              <h1 className="font-serif text-4xl lg:text-5xl text-white font-light leading-tight">
                {artwork.title}
              </h1>

              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-xs font-mono text-[#C4D4C9] uppercase tracking-wider">
                  Valeur d'Acquisition :
                </span>
                <span className="font-serif text-4xl text-[#E8D19B] font-light">
                  ${artwork.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 shadow-xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#DEBD78] font-bold border-b border-[#3F5B49] pb-3">
                Fiche Technique d'Atelier
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A6BAAD] uppercase font-mono">Médium & Matière</span>
                  <span className="text-white font-medium text-right max-w-[220px]">{artwork.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6BAAD] uppercase font-mono">Dimensions</span>
                  <span className="text-white font-mono font-medium">{artwork.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6BAAD] uppercase font-mono">Année d'Exécution</span>
                  <span className="text-white font-mono">{artwork.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6BAAD] uppercase font-mono">Authentification</span>
                  <span className="text-[#DEBD78]">Signée • Scellée à la Cire</span>
                </div>
              </div>
            </div>

            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 shadow-xl space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#DEBD78] font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Note de Création & Pigments
              </h3>
              <p className="text-sm text-[#C4D4C9] leading-relaxed font-light">
                {artwork.story || 'Étude acrylique composée par superposition de glacis minéraux et empâtements structuraux exécutés au couteau sur lin noble.'}
              </p>
            </div>

            <div className="bg-[#24362B] p-6 border-2 border-[#CBA458] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#DEBD78] font-bold block">
                  Pièce Unique au Catalogue
                </span>
                <span className="text-xs text-[#A6BAAD] font-mono">
                  Livraison internationale assurée en caisse sécurisée.
                </span>
              </div>

              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#CBA458] via-[#DEBD78] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Commander l'Œuvre</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#24362B] max-w-lg w-full p-8 border-2 border-[#CBA458] shadow-2xl relative">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#DEBD78] hover:text-white transition cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DEBD78] font-bold block mb-1">
                Protocole d'Acquisition Privée
              </span>
              <h3 className="font-serif text-3xl text-white">Réserver "{artwork.title}"</h3>
              <p className="text-xs text-[#A6BAAD] font-mono mt-1 mb-6">
                Valeur : ${artwork.price.toLocaleString()} • Caisse sécurisée & expédition assurée
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[10px] text-[#DEBD78] mb-1">
                  Nom & Prénom de l'Acquéreur *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Jean-Luc Moreau"
                  className="w-full bg-[#1C2C22] border border-[#3F5B49] p-3 text-white focus:outline-none focus:border-[#CBA458] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-mono text-[10px] text-[#DEBD78] mb-1">
                    Adresse Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="jeanluc@collection.com"
                    className="w-full bg-[#1C2C22] border border-[#3F5B49] p-3 text-white focus:outline-none focus:border-[#CBA458] font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase font-mono text-[10px] text-[#DEBD78] mb-1">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    name="phone"
                    required
                    placeholder="+212 600 000 000"
                    className="w-full bg-[#1C2C22] border border-[#3F5B49] p-3 text-white focus:outline-none focus:border-[#CBA458] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[10px] text-[#DEBD78] mb-1">
                  Destination de Livraison (Ville, Pays) *
                </label>
                <input
                  name="address"
                  required
                  placeholder="Paris, France"
                  className="w-full bg-[#1C2C22] border border-[#3F5B49] p-3 text-white focus:outline-none focus:border-[#CBA458] font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[10px] text-[#DEBD78] mb-1">
                  Précisions ou Demande d'Encadrement
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Questions sur l'accrochage ou la livraison..."
                  className="w-full bg-[#1C2C22] border border-[#3F5B49] p-3 text-white focus:outline-none focus:border-[#CBA458] font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full py-4 bg-gradient-to-r from-[#CBA458] via-[#DEBD78] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Mail className="w-4 h-4" />
                {submittingOrder ? 'Transmission en cours...' : `Transmettre l'Ordre — $${artwork.price.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-[#D4C3AB] py-12 px-6 bg-[#E5D7C3] text-[#4A5D51] mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <span className="font-serif text-lg tracking-wider uppercase text-[#223027]">
            Maison d'Acrylique • The Green Galleries
          </span>
          <p>© {new Date().getFullYear()} Studio Archive. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}