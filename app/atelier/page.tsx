'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Landmark
} from 'lucide-react';

export default function AtelierPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#3F5B49] text-[#F8FAF8] font-sans antialiased selection:bg-[#CBA458] selection:text-black flex flex-col justify-between">
      {/* 1. TOP CURATORIAL MARQUEE */}
      <div className="bg-[#FAF8F5] text-[#28382E] text-[10px] tracking-[0.25em] font-mono py-2.5 px-6 flex justify-between items-center border-b border-[#D8CEBF]">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-[#3F5B49]" />
          <span>LE MANIFESTE DE L'ATELIER • TECHNIQUE DE MATIÈRE & DE GLAÇAGE</span>
        </div>
        <div className="hidden sm:flex gap-6 uppercase text-[#697E71] text-[9px]">
          <span>PARIS • CASABLANCA</span>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D8CEBF] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#3F5B49] hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux Galeries
          </Link>

          <Link
            href="/"
            className="font-serif text-2xl tracking-wider uppercase font-light text-[#223027]"
          >
            Maison d'Acrylique
          </Link>

          <Link
            href="/#collection"
            className="text-xs uppercase tracking-widest font-mono font-semibold text-[#3F5B49] hover:text-black transition"
          >
            Collection
          </Link>
        </div>
      </header>

      {/* 3. HERO: ATELIER PHILOSOPHY */}
      <section className="py-20 lg:py-24 px-6 border-b border-[#2F4738] bg-gradient-to-b from-[#354E3E] to-[#3F5B49]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#2C4133] border border-[#CBA458]/50 text-[10px] uppercase font-mono tracking-widest text-[#E8D19B]">
            <Compass className="w-3.5 h-3.5 text-[#CBA458]" /> Philosophie & Protocole Muséal
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-[1.08] tracking-tight">
            L'Acrylique comme <span className="italic font-normal text-[#E8D19B]">Sculpture Liquide</span>
          </h1>

          <p className="text-[#C4D4C9] text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Dans la quiétude des salles vertes ouvertes sur la lumière du paysage, chaque toile explore la frontière entre géologie brute, glacis translucides et réfraction lumineuse.
          </p>
        </div>
      </section>

      {/* 4. THE 4 STEPS OF EXECUTION */}
      <main className="max-w-7xl mx-auto px-6 py-20 w-full space-y-20">
        <div>
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D8BC79] font-semibold block mb-2">
              Protocole d'Atelier
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white">
              De la Toile Brute à la Matière Scellée
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 space-y-4 shadow-xl">
              <span className="font-mono text-2xl text-[#DEBD78] font-light block">01</span>
              <h3 className="font-serif text-xl text-white font-normal">Le Lin & L'Enduit</h3>
              <p className="text-xs text-[#C4D4C9] font-light leading-relaxed">
                Lin pur de Flandres (450g/m²). La toile reçoit trois couches de blanc d'Espagne et de colle végétale pour créer un grain minéral récepteur.
              </p>
            </div>

            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 space-y-4 shadow-xl">
              <span className="font-mono text-2xl text-[#DEBD78] font-light block">02</span>
              <h3 className="font-serif text-xl text-white font-normal">Pâte & Structure</h3>
              <p className="text-xs text-[#C4D4C9] font-light leading-relaxed">
                Application au couteau de mortiers d'empâtement et de poudre de pierre ponce pour bâtir des arêtes en relief qui retiennent les ombres.
              </p>
            </div>

            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 space-y-4 shadow-xl">
              <span className="font-mono text-2xl text-[#DEBD78] font-light block">03</span>
              <h3 className="font-serif text-xl text-white font-normal">Glacis Minéraux</h3>
              <p className="text-xs text-[#C4D4C9] font-light leading-relaxed">
                Superposition de seize à vingt voiles translucides d'ocres, de terres d'Ombre et de pigments purs, apportant une profondeur optique incomparable.
              </p>
            </div>

            <div className="bg-[#2D4234] p-8 border border-[#CBA458]/40 space-y-4 shadow-xl">
              <span className="font-mono text-2xl text-[#DEBD78] font-light block">04</span>
              <h3 className="font-serif text-xl text-white font-normal">Isolation Archival</h3>
              <p className="text-xs text-[#C4D4C9] font-light leading-relaxed">
                Vernis satiné protecteur anti-UV à polymères croisés. La toile est imperméable à la lumière solaire directe et scellée pour les générations futures.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#2D4234] border border-[#CBA458]/50 p-8 lg:p-14 shadow-2xl">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#DEBD78] font-semibold block">
              Engagement de l'Atelier
            </span>
            <h3 className="font-serif text-3xl lg:text-4xl text-white font-light leading-snug">
              Des pièces uniques, authentifiées et traçables mondialement.
            </h3>
            <p className="text-sm text-[#C4D4C9] font-light leading-relaxed">
              Toute œuvre issue de la Maison d'Acrylique est une pièce unique (1/1). Aucune reproduction giclée ou tirage en série n'est réalisé : chaque toile conserve sa signature manuelle, son certificat d'authenticité et son enregistrement au catalogue officiel.
            </p>
            <div className="pt-2">
              <Link
                href="/#collection"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#CBA458] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-widest font-mono hover:brightness-110 transition shadow-lg"
              >
                Parcourir les Œuvres de la Galerie <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 bg-[#24362B] p-8 border border-[#3F5B49]">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#2D4234] border border-[#CBA458]/40">
                <Award className="w-5 h-5 text-[#DEBD78]" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-white font-normal">Certificat d'Authenticité</h4>
                <p className="text-xs text-[#C4D4C9] font-light mt-1">
                  Document officiel sous scellé remis avec chaque acquisition, mentionnant les pigments et l'historique d'atelier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[#3F5B49]">
              <div className="p-2.5 bg-[#2D4234] border border-[#CBA458]/40">
                <Layers className="w-5 h-5 text-[#DEBD78]" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-white font-normal">Châssis en Bois Noble</h4>
                <p className="text-xs text-[#C4D4C9] font-light mt-1">
                  Châssis à clés en pin sylvestre séché au séchoir, évitant tout gauchissement au fil des saisons climatiques.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[#3F5B49]">
              <div className="p-2.5 bg-[#2D4234] border border-[#CBA458]/40">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-white font-normal">Livraison en Caisse Sécurisée</h4>
                <p className="text-xs text-[#C4D4C9] font-light mt-1">
                  Caisse en bois renforcée, calage mousse haute densité et transport assuré avec suivi direct par l'atelier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. BLONDE OAK FOOTER */}
      <footer className="border-t border-[#D4C3AB] py-10 px-6 bg-[#E5D7C3] text-[#4A5D51]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <span className="font-serif text-base tracking-wider uppercase text-[#223027]">
            Maison d'Acrylique • L'Atelier
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