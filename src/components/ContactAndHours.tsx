import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Instagram,
  Navigation,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { getSalonOpenStatus } from '../utils/hours';

export const ContactAndHours: React.FC = () => {
  const { settings } = useSalon();
  const [copied, setCopied] = useState(false);
  const openStatus = getSalonOpenStatus();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(settings.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Schedule mapping with day index (0: Dimanche, 1: Lundi, 2: Mardi, 3: Mercredi, 4: Jeudi, 5: Vendredi, 6: Samedi)
  const scheduleItems = [
    { day: "Lundi", dayIndex: 1, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Mardi", dayIndex: 2, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Mercredi", dayIndex: 3, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Jeudi", dayIndex: 4, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Vendredi", dayIndex: 5, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Samedi", dayIndex: 6, hours: settings.hoursMonSat || "10:00 – 20:00" },
    { day: "Dimanche", dayIndex: 0, hours: settings.hoursSun || "11:00 – 20:00" },
  ];

  return (
    <section id="contact" className="py-16 md:py-20 bg-[#FAF7F2] relative border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-2">
            Venir au Salon
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3A2F29] tracking-tight">
            Horaires & Accès au Salon
          </h2>
          <div className="w-12 h-0.5 bg-[#C4975C] mx-auto mt-3 mb-5" />
          <p className="text-[#6B5A50] text-sm sm:text-base font-light leading-relaxed">
            Facilement accessible au <span className="font-medium text-[#3A2F29]">15 Rue Jalal Eddine Sayouti</span>, Casablanca.
            Nous vous accueillons tous les jours de la semaine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hours Card & Contact details */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Opening Hours Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE8DD] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
                <div className="flex items-center gap-2 text-[#3A2F29]">
                  <Clock className="w-4 h-4 text-[#B08247]" />
                  <h3 className="font-serif text-lg font-semibold">Horaires d'Ouverture</h3>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    openStatus.isOpen
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {openStatus.statusText}
                </span>
              </div>

              {/* Day-by-day table */}
              <div className="space-y-1.5 text-xs">
                {scheduleItems.map((item) => {
                  const isToday = item.dayIndex === openStatus.todayIndex;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                        isToday
                          ? 'bg-[#F2ECE1] font-semibold text-[#3A2F29] border border-[#E0D5C3] shadow-xs'
                          : 'text-[#6B5A50] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.day}</span>
                        {isToday && (
                          <span className="text-[10px] bg-[#5C4D44] text-[#FAF7F2] px-2 py-0.5 rounded-full font-medium tracking-wide">
                            Aujourd'hui
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs">{item.hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DD] text-[11px] text-[#6B5A50] font-light">
                💡 {openStatus.nextOpenText}. Réservation conseillée par WhatsApp pour votre confort.
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone call */}
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EFE8DD] hover:border-[#C4975C] transition-colors shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B08247] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A70] block">
                    Téléphone
                  </span>
                  <span className="text-xs font-semibold text-[#3A2F29]">
                    {settings.phone}
                  </span>
                </div>
              </a>

              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EFE8DD] hover:border-[#C4975C] transition-colors shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A70] block">
                    WhatsApp
                  </span>
                  <span className="text-xs font-semibold text-[#3A2F29]">
                    Écrire en direct
                  </span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EFE8DD] hover:border-[#C4975C] transition-colors shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A70] block">
                    Instagram
                  </span>
                  <span className="text-xs font-semibold text-[#3A2F29]">
                    {settings.instagram}
                  </span>
                </div>
              </a>

              {/* Copy Address */}
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EFE8DD] hover:border-[#C4975C] transition-colors text-left shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B08247] shrink-0">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A70] block">
                    {copied ? "Copié !" : "Adresse"}
                  </span>
                  <span className="text-xs font-semibold text-[#3A2F29] truncate block max-w-[130px]">
                    15 Rue Sayouti
                  </span>
                </div>
              </button>
            </div>

          </div>

          {/* Right Column: Map & Directions */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EFE8DD] shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#B08247] font-medium block">
                  Emplacement
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#3A2F29]">
                  15 Rue Jalal Eddine Sayouti, Casablanca 20250
                </h4>
              </div>

              {/* Itinerary buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    "15 Rue Jalal Eddine Sayouti, Casablanca 20250"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5C4D44] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(
                    "15 Rue Jalal Eddine Sayouti Casablanca"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#4A3E39] border border-[#E8E0D2] text-xs font-medium hover:bg-[#F2ECE1] transition-colors"
                >
                  <span>Waze</span>
                  <ExternalLink className="w-3 h-3 text-[#8C7A70]" />
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#EFE8DD] relative">
              <iframe
                title="Google Maps Glow by Rim"
                src="https://maps.google.com/maps?q=15%20Rue%20Jalal%20Eddine%20Sayouti%2C%20Casablanca%2020250&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="text-center text-xs text-[#8C7A70] font-light">
              📍 Au cœur de Casablanca • À proximité immédiate des quartiers Bourgogne et Racine.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
