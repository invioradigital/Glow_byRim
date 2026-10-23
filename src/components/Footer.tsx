import React from 'react';
import { MapPin, Phone, MessageCircle, Instagram, Lock, Coffee } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Logo } from './Logo';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings } = useSalon();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  return (
    <footer className="bg-[#382F2A] text-[#FAF7F2] pt-14 pb-10 border-t border-[#4A3E39] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-3.5">
            <Logo size="md" variant="light" />
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light leading-relaxed pt-1 max-w-sm">
              Votre cocon de beauté et de bien-être à Casablanca.
              Coiffure attentionnée, manucure soignée, pédicure relaxante et thé marocain offert avec le sourire.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C4975C] text-[#FAF7F2] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald-600 text-[#FAF7F2] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C4975C] text-[#FAF7F2] flex items-center justify-center transition-colors"
                aria-label="Téléphone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E8D6C5]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#FAF7F2]/80">
              <li>
                <a href="#about" className="hover:text-[#E8D6C5] transition-colors">
                  L'Esprit du Salon
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#E8D6C5] transition-colors">
                  Nos Prestations & Tarifs
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#E8D6C5] transition-colors">
                  Galerie Photos du Salon
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#E8D6C5] transition-colors">
                  Avis Clientes Vérifiés (5.0/5)
                </a>
              </li>
              <li>
                <a href="#reservation" className="hover:text-[#E8D6C5] transition-colors">
                  Prendre Rendez-vous
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#E8D6C5] transition-colors">
                  Horaires & Accès
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Info */}
          <div className="lg:col-span-5 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E8D6C5]">
              Contact & Horaires
            </h4>

            <div className="space-y-2 text-xs font-light text-[#FAF7F2]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C4975C] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C4975C] shrink-0" />
                <span>Téléphone : {settings.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#C4975C] shrink-0" />
                <span>WhatsApp : {settings.whatsapp}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 mt-2 space-y-1">
                <div className="flex justify-between text-[#E8D6C5] font-medium">
                  <span>Lundi – Samedi :</span>
                  <span>{settings.hoursMonSat || "10:00 – 20:00"}</span>
                </div>
                <div className="flex justify-between text-[#FAF7F2]/75">
                  <span>Dimanche :</span>
                  <span>{settings.hoursSun || "11:00 – 20:00"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#FAF7F2]/60 font-light">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span>© 2026 Glow by Rim. Tous droits réservés.</span>
            <span>•</span>
            <span className="text-[#E8D6C5]">Casablanca, Maroc</span>
            <span>•</span>
            <span>Salon de beauté chaleureux</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-[#E8D6C5] hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Propriétaire (Admin)</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
