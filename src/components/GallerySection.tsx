import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { getAssetUrl } from '../utils/assets';

export const GallerySection: React.FC = () => {
  const { gallery } = useSalon();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'salon', label: 'Le Salon & Façade' },
    { id: 'ongles', label: 'Manucure & Ongles' },
    { id: 'pedicure', label: 'Pédicure Spa' },
    { id: 'soins', label: 'Soins & Cabine' },
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-20 bg-white relative border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-2">
            Visite en Images
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3A2F29] tracking-tight">
            Les Espaces du Salon
          </h2>
          <div className="w-12 h-0.5 bg-[#C4975C] mx-auto mt-3 mb-5" />
          <p className="text-[#6B5A50] text-sm sm:text-base font-light leading-relaxed">
            Un aperçu de notre atmosphère chaleureuse au 15 Rue Jalal Eddine Sayouti à Casablanca.
          </p>
        </div>

        {/* Filter buttons - Warm and cozy */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#5C4D44] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6B5A50] hover:text-[#3A2F29] border border-[#E8E0D2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#FAF7F2] border border-[#EFE8DD] shadow-xs aspect-4/3 transition-all duration-300 hover:shadow-md"
            >
              <img
                src={getAssetUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F7D8AC] font-medium mb-1">
                  {item.categoryLabel}
                </span>
                <h3 className="font-serif text-base font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-white/80 line-clamp-2 mt-0.5 font-light">
                    {item.description}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#F7D8AC] font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Agrandir</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#2D2420]/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation arrows */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 sm:left-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 sm:right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Modal content */}
          <div
            className="max-w-4xl w-full bg-[#3A2F29] rounded-2xl overflow-hidden border border-[#E8E0D2]/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] flex items-center justify-center bg-black/30">
              <img
                src={getAssetUrl(filteredItems[lightboxIndex].imageUrl)}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#3A2F29]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#F7D8AC] font-medium block mb-0.5">
                  {filteredItems[lightboxIndex].categoryLabel}
                </span>
                <h4 className="font-serif text-lg font-semibold">
                  {filteredItems[lightboxIndex].title}
                </h4>
                {filteredItems[lightboxIndex].description && (
                  <p className="text-xs text-white/70 font-light mt-0.5">
                    {filteredItems[lightboxIndex].description}
                  </p>
                )}
              </div>

              <span className="text-xs text-[#F7D8AC] font-mono shrink-0">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
