import React from 'react';
import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSalon();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  return (
    <>
      {/* Desktop Floating WhatsApp Button - Cozy & Warm */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40 group">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            "Bonjour Glow by Rim, je souhaite prendre rendez-vous."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-103"
          aria-label="Contacter sur WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-emerald-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider pr-1">
            WhatsApp Direct
          </span>
        </a>
      </div>

      {/* Mobile Sticky Action Bar - Warm Cozy Palette */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EFE8DD] p-2 px-3 shadow-lg flex items-center justify-between gap-2">
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white text-[#4A3E39] border border-[#E8E0D2] rounded-xl text-xs font-medium"
        >
          <Phone className="w-3.5 h-3.5 text-[#B08247]" />
          <span>Appeler</span>
        </a>

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            "Bonjour Glow by Rim, je souhaite prendre rendez-vous."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        <a
          href="#reservation"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] rounded-xl text-xs font-semibold shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[#E8D6C5]" />
          <span>Réserver</span>
        </a>
      </div>
    </>
  );
};
