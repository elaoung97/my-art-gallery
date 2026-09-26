'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  ArrowLeft,
  Upload,
  Layers,
  DollarSign,
  CheckCircle2,
  Lock,
  LogOut,
  KeyRound,
  Mail,
  MessageSquare,
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

interface Order {
  id: string;
  artworkId: string;
  artworkTitle: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  message: string;
  date: string;
  status: 'Pending' | 'Contacted' | 'Completed';
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'paintings' | 'orders'>('paintings');

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: 'Abstract',
    medium: 'Heavy-body acrylic on Belgian linen',
    dimensions: '100 × 120 cm',
    price: 3500,
    status: 'Available',
    story: '',
  });

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          loadData();
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const loadData = async () => {
    try {
      const [artRes, orderRes] = await Promise.all([
        fetch('/api/artworks'),
        fetch('/api/inquiries')
      ]);

      if (artRes.ok) {
        const artData = await artRes.json();
        setArtworks(artData);
      }
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPasswordInput('');
        loadData();
      } else {
        setAuthError('Mot de passe incorrect');
      }
    } catch {
      setAuthError('Erreur de connexion au serveur');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1400;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Veuillez selectionner une photographie.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl: imagePreview }),
      });

      if (res.ok) {
        const updated = await res.json();
        setArtworks(updated);
        setImagePreview('');
        setFormData({
          title: '',
          year: new Date().getFullYear(),
          category: 'Abstract',
          medium: 'Heavy-body acrylic on Belgian linen',
          dimensions: '100 × 120 cm',
          price: 3500,
          status: 'Available',
          story: '',
        });
        showToast('✓ Oeuvre enregistree et publiee en salle !');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer definitivement "${title}" ?`)) return;

    try {
      const res = await fetch(`/api/artworks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = await res.json();
        setArtworks(updated);
        showToast('✓ Oeuvre retiree du catalogue');
      }
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Available' | 'Reserved' | 'Sold') => {
    const previous = [...artworks];
    setArtworks(artworks.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));

    try {
      const res = await fetch('/api/artworks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setArtworks(updated);
        showToast(`✓ Statut mis a jour : "${newStatus}"`);
      } else {
        setArtworks(previous);
        alert('Erreur de session. Veuillez vous reconnecter.');
      }
    } catch {
      setArtworks(previous);
      alert('Erreur reseau.');
    }
  };

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#3F5B49] text-white flex flex-col justify-between items-center p-6 font-sans">
        <div className="w-full max-w-md pt-12">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#E8D19B] hover:text-white flex items-center gap-1.5 font-mono">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour a la Galerie
          </Link>
        </div>

        <div className="w-full max-w-md bg-[#2D4234] border border-[#CBA458]/50 p-10 shadow-2xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#24362B] border border-[#CBA458]/50 flex items-center justify-center text-[#DEBD78]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-3xl font-light text-white">Atelier OS Vault</h1>
            <p className="text-xs text-[#C4D4C9] font-mono">Entrez votre mot de passe secret pour deverrouiller</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Passphrase"
                className="w-full bg-[#1E2E24] border border-[#3F5B49] p-3 text-sm text-white focus:outline-none focus:border-[#CBA458] font-mono"
              />
              <KeyRound className="w-4 h-4 absolute right-3 top-3.5 text-[#CBA458]" />
            </div>
            {authError && <p className="text-xs text-red-300 font-mono">{authError}</p>}
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#CBA458] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition cursor-pointer">
              Deverrouiller le Studio
            </button>
          </form>
        </div>

        <p className="text-[11px] font-mono text-[#D8E4DC] pb-6 uppercase tracking-widest">
          Maison d'Acrylique • Systeme de Gestion Securise
        </p>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#3F5B49] flex items-center justify-center text-xs font-mono text-[#E8D19B]">Verification des acces...</div>;
  }

  const totalValue = artworks.reduce((acc, a) => acc + (a.price || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#2D4234] text-[#F8FAF8] font-sans antialiased selection:bg-[#CBA458] selection:text-black">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#CBA458] text-[#1E2C23] text-xs font-bold px-5 py-3 tracking-wider uppercase shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {notification}
        </div>
      )}

      <header className="border-b border-[#3F5B49] bg-[#24362B] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#DEBD78]" />
              <h1 className="font-serif tracking-widest text-sm uppercase text-white font-medium">
                Atelier OS
              </h1>
            </div>

            <div className="flex bg-[#1E2E24] border border-[#3F5B49] p-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('paintings')}
                className={`px-4 py-1.5 transition cursor-pointer ${activeTab === 'paintings' ? 'bg-[#CBA458] text-[#1E2C23] font-bold' : 'text-[#C4D4C9] hover:text-white'}`}
              >
                Catalogue ({artworks.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-1.5 transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'orders' ? 'bg-[#CBA458] text-[#1E2C23] font-bold' : 'text-[#C4D4C9] hover:text-white'}`}
              >
                <span>Commandes ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingOrders}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs uppercase tracking-widest text-[#E8D19B] hover:text-white px-3 py-2 border border-[#3F5B49]">
              Galerie Publique
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 border border-red-800 text-red-200 text-xs uppercase tracking-wider hover:bg-red-900/60 transition cursor-pointer font-mono"
            >
              <LogOut className="w-3.5 h-3.5" /> Verrouiller
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-white">Ordres d'Acquisition & Inquiries</h2>

            {orders.length === 0 ? (
              <div className="bg-[#24362B] border border-[#3F5B49] p-16 text-center text-[#C4D4C9] font-mono text-sm">
                Aucune commande pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const cleanPhone = order.clientPhone.replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Bonjour ${order.clientName}, c'est l'artiste de la Maison d'Acrylique concernant votre reservation de "${order.artworkTitle}".`
                  )}`;
                  const mailtoUrl = `mailto:${order.clientEmail}?subject=${encodeURIComponent(
                    `Acquisition: ${order.artworkTitle}`
                  )}`;

                  return (
                    <div key={order.id} className="bg-[#24362B] border border-[#3F5B49] p-6 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#3F5B49] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-xl text-white">{order.clientName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1E2E24] text-[#DEBD78] border border-[#3F5B49]">
                            {order.date}
                          </span>
                        </div>
                        <div className="text-sm font-mono text-[#E8D19B]">
                          Reservation : <strong className="text-white">{order.artworkTitle}</strong> (${order.price.toLocaleString()})
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[#C4D4C9]">
                        <div>
                          <span className="text-[#8AA493] block uppercase text-[10px]">Email</span>
                          <a href={mailtoUrl} className="text-white hover:underline">{order.clientEmail}</a>
                        </div>
                        <div>
                          <span className="text-[#8AA493] block uppercase text-[10px]">Telephone / WhatsApp</span>
                          <span className="text-white">{order.clientPhone || 'Non renseigne'}</span>
                        </div>
                        <div>
                          <span className="text-[#8AA493] block uppercase text-[10px]">Destination</span>
                          <span className="text-white">{order.shippingAddress || 'Non renseignee'}</span>
                        </div>
                      </div>

                      {order.message && (
                        <div className="bg-[#1E2E24] border border-[#3F5B49] p-3 text-xs text-[#E8EDE9]">
                          <span className="text-[10px] font-mono uppercase text-[#8AA493] block mb-1">Message client:</span>
                          "{order.message}"
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {order.clientPhone && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono uppercase tracking-wider hover:bg-emerald-900 transition flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            Contacter sur WhatsApp
                          </a>
                        )}

                        <a
                          href={mailtoUrl}
                          className="px-4 py-2 bg-[#1E2E24] border border-[#3F5B49] text-white text-xs font-mono uppercase tracking-wider hover:border-[#CBA458] transition flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#DEBD78]" />
                          Repondre par Email
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'paintings' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#24362B] border border-[#3F5B49] p-6 shadow-xl">
                <div className="flex items-center justify-between text-[#8AA493] mb-2 text-xs uppercase tracking-widest font-mono">
                  <span>Oeuvres au Catalogue</span>
                  <Layers className="w-4 h-4 text-[#DEBD78]" />
                </div>
                <p className="font-serif text-4xl text-white font-light">{artworks.length}</p>
              </div>

              <div className="bg-[#24362B] border border-[#3F5B49] p-6 shadow-xl">
                <div className="flex items-center justify-between text-[#8AA493] mb-2 text-xs uppercase tracking-widest font-mono">
                  <span>Disponibles en Salle</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="font-serif text-4xl text-white font-light">
                  {artworks.filter((a) => a.status === 'Available').length}
                </p>
              </div>

              <div className="bg-[#24362B] border border-[#3F5B49] p-6 shadow-xl">
                <div className="flex items-center justify-between text-[#8AA493] mb-2 text-xs uppercase tracking-widest font-mono">
                  <span>Valeur de la Galerie</span>
                  <DollarSign className="w-4 h-4 text-[#DEBD78]" />
                </div>
                <p className="font-serif text-4xl text-white font-light">${totalValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#24362B] border border-[#3F5B49] p-8 shadow-2xl">
              <h2 className="font-serif text-2xl text-white tracking-wide mb-6 border-b border-[#3F5B49] pb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#DEBD78]" /> Enregistrer une Nouvelle Oeuvre
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-[#DEBD78] font-semibold mb-2 block font-mono">
                    Photographie de l'Oeuvre *
                  </label>
                  <div className="flex-1 min-h-[280px] border-2 border-dashed border-[#3F5B49] hover:border-[#CBA458] transition flex flex-col items-center justify-center relative bg-[#1E2E24] p-4 text-center group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover max-h-[320px]" />
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <Upload className="w-8 h-8 mx-auto text-[#8AA493]" />
                        <p className="text-xs text-[#C4D4C9]">Cliquer pour importer une photo</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Titre *</label>
                    <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Categorie</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]">
                      <option value="Abstract">Abstract</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Expressive">Expressive</option>
                      <option value="Portrait">Portrait</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Medium</label>
                    <input value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Dimensions</label>
                    <input value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Prix ($ USD)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Annee</label>
                    <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-2.5 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-[#DEBD78] mb-2 font-mono">Histoire & Pigments</label>
                    <textarea rows={3} value={formData.story} onChange={(e) => setFormData({ ...formData, story: e.target.value })} className="w-full bg-[#1E2E24] border border-[#3F5B49] p-3 text-sm text-white focus:outline-none focus:border-[#CBA458]" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={saving} className="w-full py-3.5 bg-gradient-to-r from-[#CBA458] to-[#BA9447] text-[#1E2C23] font-bold text-xs uppercase tracking-[0.25em] hover:brightness-110 transition cursor-pointer">
                      {saving ? 'Publication en cours...' : 'Accrocher la Toile au Catalogue'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-[#24362B] border border-[#3F5B49]">
              <div className="p-6 border-b border-[#3F5B49]">
                <h2 className="font-serif text-xl text-white">Toiles Presentes ({artworks.length})</h2>
              </div>

              <div className="divide-y divide-[#3F5B49]">
                {artworks.map((art) => (
                  <div key={art.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#1E2E24] transition">
                    <div className="flex items-center gap-5">
                      <img src={art.imageUrl} alt={art.title} className="w-16 h-20 object-cover border border-[#CBA458]/40" />
                      <div>
                        <h3 className="font-serif text-lg text-white font-medium">{art.title}</h3>
                        <p className="text-xs text-[#8AA493] font-mono mt-0.5">{art.dimensions} • ${art.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 border border-[#3F5B49] bg-[#1A261F] p-1">
                        {(['Available', 'Reserved', 'Sold'] as const).map((s) => {
                          const isActive = art.status === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleStatusChange(art.id, s)}
                              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
                                isActive
                                  ? s === 'Available'
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : s === 'Reserved'
                                    ? 'bg-amber-500 text-black font-bold'
                                    : 'bg-stone-500 text-white font-bold'
                                  : 'text-[#8AA493] hover:text-white hover:bg-[#2D4234]'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-2.5 text-[#8AA493] hover:text-red-400 transition cursor-pointer"
                        title="Supprimer l'Oeuvre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}