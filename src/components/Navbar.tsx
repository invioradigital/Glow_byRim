import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  MapPin,
  Menu,
  X,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Logo } from './Logo';
import { getSalonOpenStatus } from '../utils/hours';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { settings, isAdmin } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openStatus, setOpenStatus] = useState(getSalonOpenStatus());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpenStatus(getSalonOpenStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Le Salon', href: '#about' },
    { name: 'Nos Prestations', href: '#services' },
    { name: 'Galerie', href: '#gallery' },
    { name: 'Avis Clientes', href: '#reviews' },
    { name: 'Horaires & Plan', href: '#contact' },
    { name: 'Réservation', href: '#reservation' },
  ];

  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  return (
    <>
      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs border-b border-[#E8E0D2] py-2'
            : 'bg-[#FDFBF7] border-b border-[#EFE8DD] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center focus:outline-none">
              <Logo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.14em] text-[#5C4D44] hover:text-[#B08247] font-medium transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C4975C] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right actions: Status, Friendly WhatsApp CTA & Admin Access */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Live Open / Closed indicator */}
              <div
                className={`hidden xl:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                  openStatus.isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
                title={openStatus.nextOpenText}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    openStatus.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{openStatus.statusText}</span>
              </div>

              {/* Direct WhatsApp Reservation CTA - Warm and friendly */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Bonjour Glow by Rim, je souhaite prendre rendez-vous."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>

              {/* Admin Button */}
              <button
                onClick={onOpenAdmin}
                className="p-2 text-[#8C7A70] hover:text-[#4A3E39] hover:bg-[#EFE8DD] rounded-full transition-colors relative"
                title={isAdmin ? "Tableau de bord Admin (Connecté)" : "Espace Admin Propriétaire"}
                aria-label="Accès Administration"
              >
                <Lock className="w-4 h-4" />
                {isAdmin && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="p-2 text-[#8C7A70] hover:text-[#4A3E39]"
                aria-label="Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#4A3E39] hover:text-[#B08247] focus:outline-none"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-t border-[#EFE8DD] px-5 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
            {/* Live Status Mobile */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${
                openStatus.isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  openStatus.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>
                {openStatus.statusText} • {openStatus.nextOpenText}
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-3 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm text-[#4A3E39] hover:text-[#B08247] font-medium py-2 border-b border-[#F2ECE1]"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#C4975C]" />
                </a>
              ))}
            </nav>

            {/* WhatsApp CTA Mobile */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Bonjour Glow by Rim, je souhaite prendre rendez-vous."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#5C4D44] text-[#FAF7F2] py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Prendre rendez-vous sur WhatsApp</span>
              </a>
            </div>

            {/* Contact info */}
            <div className="text-center text-xs text-[#8C7A70] pt-2">
              <p>15 Rue Jalal Eddine Sayouti, Casablanca</p>
              <p className="mt-1 font-medium text-[#4A3E39]">{settings.phone}</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
