import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Calendar, Coffee, MapPin, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export const Hero: React.FC = () => {
  const { settings } = useSalon();
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  const heroPhotos = [
    {
      src: "/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.01__1__5b110762.jpeg",
      tag: "Espace Coiffure & Salon",
      subtitle: "Fauteuils confortables, miroirs chaleureux et salon velours bleu"
    },
    {
      src: "/assets/aistudio/Fa_ade__l_gante_du_salon_GLOW_by_Rim_c0f1903e.png",
      tag: "Façade du Salon",
      subtitle: "15 Rue Jalal Eddine Sayouti, Casablanca"
    },
    {
      src: "/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.00_a87a3188.jpeg",
      tag: "Hospitalité & Ongles",
      subtitle: "Thé à la menthe, dattes fraîches et espace manucure lumineux"
    },
    {
      src: "/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.01_2bb55787.jpeg",
      tag: "Espace Pédicure Spa",
      subtitle: "Fauteuils spa massants pour un moment de pure détente"
    }
  ];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-swipe images every 3.8 seconds with pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % heroPhotos.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered, heroPhotos.length]);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-8 pb-14 md:pt-12 md:pb-20 border-b border-[#EFE8DD]">
      {/* Soft warm ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8D6C5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5E6DC]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Text & Warm CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Friendly Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#EFE7DC] text-[#5C4D44] border border-[#E3D8C8]">
                <Coffee className="w-3.5 h-3.5 text-[#B08247]" />
                Votre salon cocon à Casablanca
              </span>

              {/* Google Reviews rating badge */}
              <a
                href="#reviews"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#4A3E39] border border-[#E8E0D2] shadow-xs hover:border-[#C4975C] transition-colors"
              >
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">{settings.googleRating}/5</span>
                <span className="text-[#8C7A70]">• Avis Google vérifiés</span>
              </a>
            </div>

            {/* Cozy Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3A2F29] leading-[1.18] tracking-tight">
                Prenez le temps de souffler dans{' '}
                <span className="italic text-[#B08247] font-normal">
                  votre cocon de beauté
                </span>{' '}
                à Casablanca
              </h1>
              <p className="text-sm sm:text-base text-[#6B5A50] font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Chez Rim, chaque visite est une pause chaleureuse. Installez-vous confortablement dans nos fauteuils moelleux, dégustez un thé à la menthe avec quelques dattes, et laissez nos mains expertes prendre soin de vos cheveux, de vos mains et de vos pieds.
              </p>
            </div>

            {/* Address snippet */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#4A3E39] bg-[#F2ECE1] px-4 py-2 rounded-xl border border-[#E5DACB]">
              <MapPin className="w-4 h-4 text-[#C4975C] shrink-0" />
              <span>{settings.address}</span>
            </div>

            {/* Action Buttons: Friendly WhatsApp & Form */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Bonjour Glow by Rim, je souhaite prendre rendez-vous."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Prendre rendez-vous sur WhatsApp</span>
              </a>

              <a
                href="#reservation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#4A3E39] border border-[#DDD3C4] hover:border-[#C4975C] px-5 py-3.5 rounded-xl text-xs font-medium tracking-wide transition-all shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#C4975C]" />
                <span>Formulaire de demande</span>
              </a>

              <a
                href="#services"
                className="inline-flex items-center gap-1.5 text-xs text-[#8C7A70] hover:text-[#3A2F29] underline underline-offset-4 font-medium transition-colors sm:ml-2 py-2"
              >
                <span>Voir les prestations & tarifs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Cozy Warm Badges */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs text-[#6B5A50] bg-white/70 p-2.5 rounded-xl border border-[#EFE8DD]">
                <Coffee className="w-4 h-4 text-[#C4975C] shrink-0" />
                <span>Thé marocain & douceurs offerts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B5A50] bg-white/70 p-2.5 rounded-xl border border-[#EFE8DD]">
                <Heart className="w-4 h-4 text-[#C4975C] shrink-0" />
                <span>Accueil bienveillant & attentif</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B5A50] bg-white/70 p-2.5 rounded-xl border border-[#EFE8DD] col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-[#C4975C] shrink-0" />
                <span>Hygiène & matériel stérilisé</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase with Auto-Swipe Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Frame with Crossfade Transitions */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#3A2F29] group aspect-4/5"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {heroPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      activePhotoIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.tag}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />

                    {/* Overlay Caption */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 text-white">
                      <span className="text-[11px] uppercase tracking-wider text-[#F7D8AC] font-medium block mb-0.5">
                        {photo.tag}
                      </span>
                      <p className="text-xs sm:text-sm font-light text-white/90">
                        {photo.subtitle}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Auto-swipe slide indicators */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                  {heroPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activePhotoIdx === idx
                          ? 'w-6 bg-white shadow-xs'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-3.5 grid grid-cols-4 gap-2">
                {heroPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-[#C4975C] shadow-sm ring-2 ring-[#C4975C]/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.tag}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
