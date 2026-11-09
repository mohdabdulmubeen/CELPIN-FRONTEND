import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee,
  CupSoda,
  Utensils,
  Leaf,
  Cookie,
  Candy,
  Salad,
  Cake,
  IceCream,
  Plus,
  Check,
  Star,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Eye,
  MapPin,
  Building2
} from 'lucide-react';
import { api } from '../services/api';
import { MenuItem } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { CITY_CAFES, CafeOption } from '../components/LocationSelectorBar';
import { CafeInteriorPreviewModal } from '../components/CafeInteriorPreviewModal';

interface CafePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CafePage: React.FC<CafePageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // 4K Interior Preview State
  const [previewCafe, setPreviewCafe] = useState<CafeOption | null>(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');

  const allCafes = useMemo(() => {
    return Object.entries(CITY_CAFES).flatMap(([city, cafes]) =>
      cafes.map(c => ({ ...c, city }))
    );
  }, []);

  const displayedCafes = useMemo(() => {
    if (selectedCityFilter === 'All') return allCafes;
    return allCafes.filter(c => c.city === selectedCityFilter);
  }, [allCafes, selectedCityFilter]);

  useEffect(() => {
    api.getMenu().then(data => setItems(data.items));
  }, []);

  const categories = [
    { id: 'all', label: t('cafe.all') },
    { id: 'coffee', label: t('cafe.coffee') },
    { id: 'tea', label: t('cafe.tea') },
    { id: 'snacks', label: t('cafe.snacks') },
    { id: 'meals', label: t('cafe.meals') },
    { id: 'desserts', label: t('cafe.desserts') }
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(i => i.category === activeCategory);

  const popularItems = items.filter(i => i.isPopular);

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    setAddedNotice(`${t('cafe.addedToOrder')}: ${item.name}`);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'coffee': return <Coffee className="h-6 w-6" />;
      case 'cup-soda': return <CupSoda className="h-6 w-6" />;
      case 'leaf': return <Leaf className="h-6 w-6" />;
      case 'cookie': return <Cookie className="h-6 w-6" />;
      case 'candy': return <Candy className="h-6 w-6" />;
      case 'salad': return <Salad className="h-6 w-6" />;
      case 'cake': return <Cake className="h-6 w-6" />;
      case 'ice-cream': return <IceCream className="h-6 w-6" />;
      default: return <Utensils className="h-6 w-6" />;
    }
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground mb-3">
          {t('cafe.badge')}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{t('cafe.title')}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
              {t('cafe.subtitle')}
            </p>
          </div>
          {totalCartCount > 0 && (
            <button
              onClick={() => onNavigate('booking', { preselectedCart: cart })}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium shadow-md hover:bg-primary/90 transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {t('cafe.orderWithSeat')} ({totalCartCount})
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {addedNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
          {addedNotice}
        </div>
      )}

      {/* Most Popular Highlight Section */}
      <div className="mb-12" role="region" aria-label={t('cafe.mostPopular')}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">{t('cafe.mostPopular')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularItems.map(item => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card shadow-xs group hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform" aria-hidden="true">
                    {getItemIcon(item.icon)}
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground gap-1">
                    <Star className="h-3 w-3 fill-current" aria-hidden="true" /> {t('cafe.mostPopular')}
                  </span>
                </div>
                <h3 className="font-semibold text-base">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-base text-foreground">₹{item.price}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{t('cafe.deskDelivery')}</span>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  aria-label={`${t('cafe.add')} ${item.name}`}
                  className="inline-flex items-center justify-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-[36px] h-9 rounded-lg px-3 gap-1.5 shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> {t('cafe.add')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="Café categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium min-h-[40px] transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* All / Filtered Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="region" aria-label="Café Items">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0" aria-hidden="true">
              {getItemIcon(item.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              <p className="text-xs text-foreground font-bold mt-1">₹{item.price} • <span className="text-primary font-medium">{t('cafe.deskDelivery')}</span></p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-[36px] min-w-[36px] h-9 w-9 transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`${t('cafe.add')} ${item.name}`}
              title={`${t('cafe.add')} ${item.name}`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* 4K Interior Preview Modal */}
      <CafeInteriorPreviewModal
        cafe={previewCafe}
        isOpen={!!previewCafe}
        onClose={() => setPreviewCafe(null)}
        onSelectCafe={(cafeName) => {
          const found = allCafes.find(c => c.name === cafeName);
          onNavigate('booking', {
            initialLocation: {
              country: 'India',
              state: 'Telangana',
              city: found?.city || 'Warangal',
              cafe: cafeName,
              cafeDesk: cafeName
            }
          });
        }}
      />

      {/* Preview Every Listed Café's Interior Section */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Immersive 4K visuals</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Preview café interiors &amp; seating layouts
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Explore high-resolution interior photos of every listed café before reserving. Check out lighting, ergonomic seating, quiet zones, and barista brew stations.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Warangal', 'Hanamkonda', 'Kazipet', 'Hyderabad'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCityFilter(city)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCityFilter === city
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border/60'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Cafés Preview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCafes.map((cafe) => (
            <div
              key={cafe.id}
              className="group rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo & Overlay */}
              <div className="relative aspect-16/10 overflow-hidden bg-muted">
                <img
                  src={cafe.coverPhoto || '/images/cafes/starbucks-interior.webp'}
                  alt={cafe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                <div className="absolute top-2.5 right-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-white shadow-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {cafe.rating}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white/90 drop-shadow-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{cafe.area}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setPreviewCafe(cafe)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Interior</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                    {cafe.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {cafe.address}
                  </p>

                  <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/40 p-2 rounded-lg border border-border/50 mt-2.5 line-clamp-2">
                    {cafe.atmosphereTag || 'Peaceful workspace ambiance with high-speed Wi-Fi and power outlets.'}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewCafe(cafe)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Seating &amp; Layout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('booking', {
                        initialLocation: {
                          country: 'India',
                          state: 'Telangana',
                          city: (cafe as any).city || 'Warangal',
                          cafe: cafe.name,
                          cafeDesk: cafe.name
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-foreground text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
