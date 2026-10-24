import React, { useState, useMemo } from 'react';
import {
  Clock,
  MessageCircle,
  ArrowRight,
  Search,
  FileText,
  Sparkles,
  Scissors,
  Heart,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { SalonService } from '../types/salon';
import { OFFICIAL_TARIFS_IMAGES } from '../data/defaultData';
import { getAssetUrl } from '../utils/assets';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
}) => {
  const { categories, services, settings } = useSalon();
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  // Active category tab: 'all' or specific category id
  const [activeTab, setActiveTab] = useState<string>('manucure-pedicure');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFlyerModal, setShowFlyerModal] = useState<boolean>(false);
  const [activeFlyerPage, setActiveFlyerPage] = useState<number>(0);

  // Filter services by category or search query
  const displayedServices = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return services.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.categoryName.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }
    if (activeTab === 'all') {
      return services;
    }
    return services.filter((s) => s.categoryId === activeTab);
  }, [services, activeTab, searchQuery]);

  const handleBookClick = (service: SalonService) => {
    onSelectServiceForBooking(`${service.title} (${service.price})`);
    const reservationElement = document.getElementById('reservation');
    if (reservationElement) {
      reservationElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper icons and clean short names for buttons
  const getCategoryInfo = (slug: string) => {
    switch (slug) {
      case 'all':
        return { icon: LayoutGrid, name: 'Tous les soins', count: services.length, start: 'dès 20 DH' };
      case 'manucure-pedicure':
        return { icon: Heart, name: 'Manucure & Pédicure', count: 10, start: 'dès 50 DH' };
      case 'cheveux':
        return { icon: Scissors, name: 'Cheveux', count: 13, start: 'dès 30 DH' };
      case 'epilation':
        return { icon: Sparkles, name: 'Épilation', count: 11, start: 'dès 20 DH' };
      case 'massage':
        return { icon: Heart, name: 'Massages', count: 2, start: 'dès 150 DH' };
      case 'regard-levres':
        return { icon: Eye, name: 'Cils, Sourcils & Lèvres', count: 4, start: 'dès 100 DH' };
      default:
        return { icon: Sparkles, name: 'Soins', count: 0, start: '' };
    }
  };

  // Full button list: "Tous les soins" + the 5 official categories = 6 buttons (perfect 2x3 on mobile, 3x2 on tablet, 6x1 on desktop)
  const tabButtons = useMemo(() => {
    return [
      { id: 'all', slug: 'all', name: 'Tous les soins' },
      ...categories,
    ];
  }, [categories]);

  const activeCategoryObj = categories.find((c) => c.id === activeTab);
  const activeTitle = activeTab === 'all' ? 'Toutes les Prestations' : activeCategoryObj?.name;

  return (
    <section id="services" className="py-12 md:py-16 bg-[#FAF7F2] relative border-b border-[#EFE8DD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-1">
            Tarifs Officiels au Salon
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#3A2F29] tracking-tight">
            Nos Prestations & Tarifs
          </h2>
          <div className="w-10 h-0.5 bg-[#C4975C] mx-auto mt-2 mb-3" />
          <p className="text-[#6B5A50] text-xs sm:text-sm font-light">
            Choisissez une catégorie ou affichez tout le menu en un coup d'œil.
          </p>
        </div>

        {/* Top Controls: 6 Category Buttons in a Balanced Grid (2x3 mobile, 3x2 tablet, 6x1 desktop) */}
        <div className="space-y-4 mb-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabButtons.map((cat) => {
              const info = getCategoryInfo(cat.slug);
              const IconComp = info.icon;
              const isActive = activeTab === cat.id && !searchQuery;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    setSearchQuery('');
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#5C4D44] text-[#FAF7F2] border-[#5C4D44] shadow-sm'
                      : 'bg-white text-[#4A3E39] border-[#E8E0D2] hover:border-[#C4975C] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 mb-1.5 ${isActive ? 'text-[#E8D6C5]' : 'text-[#B08247]'}`} />
                  <span className="font-semibold text-xs leading-tight line-clamp-1">
                    {info.name}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-[#E8D6C5]' : 'text-[#8C7A70]'}`}>
                    {info.start}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search & Original Paper Flyer Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher (ex: brushing, gel, biab...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E0D5C3] rounded-xl pl-9 pr-8 py-2 text-xs text-[#3A2F29] placeholder-[#8C7A70] focus:outline-none focus:border-[#C4975C] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[#8C7A70] hover:text-[#3A2F29] text-xs font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFlyerModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#4A3E39] hover:text-[#B08247] border border-[#E0D5C3] text-xs font-medium transition-colors shadow-2xs hover:border-[#C4975C]"
            >
              <FileText className="w-3.5 h-3.5 text-[#B08247]" />
              <span>Voir les 2 cartes officielles en photo</span>
            </button>
          </div>
        </div>

        {/* Services List - Clean, Natural Height (NO nested inner scrollbar, NO clipped buttons!) */}
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-xs overflow-hidden">
          
          {/* Active Category Title Banner */}
          <div className="bg-[#F7F2EA] px-4 sm:px-5 py-3 border-b border-[#EAE2D5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#3A2F29]">
                {searchQuery ? `Recherche : "${searchQuery}"` : activeTitle}
              </span>
              <span className="text-[11px] text-[#8A5F26] bg-white px-2 py-0.5 rounded-md font-medium border border-[#E8E0D2]">
                {displayedServices.length} soin{displayedServices.length > 1 ? 's' : ''}
              </span>
            </div>

            <span className="text-[#8C7A70] text-[11px] hidden sm:inline">
              Tarifs nets en dirhams (DHS)
            </span>
          </div>

          {/* Service Items */}
          {displayedServices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8C7A70] space-y-2">
              <p>Aucune prestation trouvée pour "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#8A5F26] underline font-medium"
              >
                Effacer la recherche
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F2ECE1]">
              {displayedServices.map((service) => (
                <div
                  key={service.id}
                  className="p-3.5 sm:p-4 hover:bg-[#FAF7F2]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Title, Description, Duration */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-medium text-xs sm:text-sm text-[#3A2F29]">
                          {service.title}
                        </h4>
                        {activeTab === 'all' && (
                          <span className="text-[10px] text-[#8C7A70] bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#EFE8DD]">
                            {service.categoryName}
                          </span>
                        )}
                        {service.isPopular && (
                          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#F7EBE3] text-[#A66042]">
                            Populaire
                          </span>
                        )}
                      </div>

                      {/* On small phones, show price right next to title */}
                      <span className="sm:hidden font-serif font-bold text-sm text-[#8A5F26] ml-auto shrink-0">
                        {service.price}
                      </span>
                    </div>

                    {service.description && (
                      <p className="text-xs text-[#7A6F68] font-light leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    {service.duration && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#8C7A70] pt-0.5">
                        <Clock className="w-3 h-3 text-[#B08247]" />
                        <span>{service.duration}</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Desktop Price & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFEB]">
                    {/* Desktop Price */}
                    <span className="hidden sm:inline font-serif font-bold text-base text-[#8A5F26] whitespace-nowrap">
                      {service.price}
                    </span>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleBookClick(service)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-2xs"
                      >
                        <span>Réserver</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                          `Bonjour Glow by Rim, je souhaite réserver : ${service.title} (${service.price}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-600 bg-[#FAF7F2] hover:bg-emerald-50 border border-[#E8E0D2] rounded-xl transition-colors flex items-center justify-center shrink-0"
                        title="Demander sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Footer inside box */}
          <div className="bg-[#FAF7F2] px-4 py-2.5 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-[#8C7A70]">
            <span>🌿 Salon de beauté & coiffure • 15 Rue Jalal Eddine Sayouti, Casablanca</span>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                "Bonjour Glow by Rim, je souhaite des renseignements sur vos prestations."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A5F26] font-medium hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp : +212 669 33 05 54</span>
            </a>
          </div>
        </div>

      </div>

      {/* Official Flyer Modal */}
      {showFlyerModal && (
        <div
          className="fixed inset-0 z-50 bg-[#2D2420]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setShowFlyerModal(false)}
        >
          <div
            className="bg-[#FAF7F2] rounded-3xl border border-[#E8E0D2] shadow-2xl max-w-3xl w-full p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9] mb-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3A2F29]">
                  Cartes de Tarifs Officielles (Salon)
                </h3>
                <p className="text-xs text-[#8C7A70]">
                  Dépliants officiels affichés chez Glow by Rim
                </p>
              </div>

              <button
                onClick={() => setShowFlyerModal(false)}
                className="p-1.5 text-[#8C7A70] hover:text-[#3A2F29] rounded-lg hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {/* Switch between Page 1 and Page 2 */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveFlyerPage(0)}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeFlyerPage === 0
                    ? 'bg-[#5C4D44] text-[#FAF7F2]'
                    : 'bg-white text-[#6B5A50] border border-[#E0D5C3]'
                }`}
              >
                Page 1 : Ongles & Cheveux
              </button>
              <button
                onClick={() => setActiveFlyerPage(1)}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeFlyerPage === 1
                    ? 'bg-[#5C4D44] text-[#FAF7F2]'
                    : 'bg-white text-[#6B5A50] border border-[#E0D5C3]'
                }`}
              >
                Page 2 : Épilation, Massages & Regard
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#E0D5C3] shadow-sm max-w-xl mx-auto bg-white">
              <img
                src={getAssetUrl(OFFICIAL_TARIFS_IMAGES[activeFlyerPage].imageUrl)}
                alt={OFFICIAL_TARIFS_IMAGES[activeFlyerPage].title}
                className="w-full h-auto object-contain max-h-[65vh]"
              />
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowFlyerModal(false)}
                className="px-6 py-2 rounded-full bg-[#5C4D44] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4A3E39]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
