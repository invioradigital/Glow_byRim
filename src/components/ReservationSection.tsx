import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Send,
  Coffee,
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ReservationSectionProps {
  preselectedService?: string;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  preselectedService = '',
}) => {
  const { services, settings, createReservation } = useSalon();
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState(preselectedService || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ id: string; whatsappUrl: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const today = new Date().toISOString().split('T')[0];

  const timeSlots = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phoneNumber.trim() || !service.trim() || !preferredDate) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        service,
        preferredDate,
        preferredTime,
        notes: notes.trim(),
      });

      setSuccessResult(result);
      window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      setErrorMsg('Une erreur est survenue lors de l\'enregistrement. Vous pouvez réserver directement sur WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setFullName('');
    setPhoneNumber('');
    setNotes('');
  };

  return (
    <section id="reservation" className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-2">
            Réservation & Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3A2F29] tracking-tight">
            Planifiez Votre Moment Détente
          </h2>
          <div className="w-12 h-0.5 bg-[#C4975C] mx-auto mt-3 mb-5" />
          <p className="text-[#6B5A50] text-sm sm:text-base font-light leading-relaxed">
            Pour un rendez-vous rapide ou un conseil sur-mesure, choisissez l'option qui vous arrange le plus.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Option 1: Direct WhatsApp Card */}
          <div className="lg:col-span-5 bg-[#FAF7F2] p-7 rounded-3xl border border-[#EFE8DD] shadow-xs space-y-5">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B08247] block">
                Option 1 • Rapide & Directe
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#3A2F29]">
                Réservation Directe WhatsApp
              </h3>
              <p className="text-xs text-[#6B5A50] leading-relaxed font-light">
                Discutez en toute simplicité avec notre équipe pour poser vos questions, envoyer une photo d'inspiration ou caler votre créneau en 30 secondes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EFE8DD] space-y-2 text-xs text-[#3A2F29]">
              <div className="flex items-center gap-2 font-semibold">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+212 669 33 05 54</span>
              </div>
              <p className="text-[#6B5A50] leading-relaxed font-light">
                Disponible 7j/7 pendant nos horaires d'ouverture (10h-20h en semaine et samedi, 11h-20h le dimanche).
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                "Bonjour Glow by Rim, je souhaite prendre rendez-vous au salon. Quelles sont vos disponibilités ?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] py-3.5 px-6 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Ouvrir WhatsApp</span>
            </a>

            <div className="pt-2 border-t border-[#EAE3D9] space-y-2 text-xs text-[#6B5A50]">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#B08247] shrink-0" />
                <span>Un thé chaud vous attend à votre arrivée</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B08247] shrink-0" />
                <span>Réponse rapide et bienveillante</span>
              </div>
            </div>
          </div>

          {/* Option 2: Booking Form Card */}
          <div className="lg:col-span-7 bg-[#FAF7F2] p-7 rounded-3xl border border-[#EFE8DD] shadow-xs relative">
            
            <div className="mb-5 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B08247] block">
                Option 2 • Formulaire Préparé
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#3A2F29]">
                Formulaire de Demande
              </h3>
              <p className="text-xs text-[#6B5A50] font-light leading-relaxed">
                Renseignez vos coordonnées ci-dessous pour générer votre message pré-rempli sans rien oublier.
              </p>
            </div>

            {/* Success state */}
            {successResult ? (
              <div className="p-6 rounded-2xl bg-white border border-[#E8E0D2] text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#3A2F29]">
                    Demande Préparée !
                  </h4>
                  <p className="text-xs text-[#6B5A50] font-light mt-1 max-w-md mx-auto">
                    Votre message a été enregistré. Cliquez ci-dessous pour transmettre la demande à Rim sur WhatsApp :
                  </p>
                </div>

                <a
                  href={successResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer sur WhatsApp</span>
                </a>

                <div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-[#8C7A70] hover:text-[#3A2F29] underline mt-1"
                  >
                    Nouvelle demande
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Nom & Prénom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex : Salma Benjelloun"
                        className="w-full bg-white border border-[#E8E0D2] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Téléphone (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ex : 06 12 34 56 78"
                        className="w-full bg-white border border-[#E8E0D2] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                    Prestation Souhaitée <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white border border-[#E8E0D2] rounded-xl px-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors"
                  >
                    <option value="">Choisissez votre soin...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title} ({s.categoryName}) — {s.price}
                      </option>
                    ))}
                    <option value="Autre soin / Conseil sur place">
                      Autre soin / Conseil sur place
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Date Souhaitée <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                      <input
                        type="date"
                        required
                        min={today}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-white border border-[#E8E0D2] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Heure Souhaitée <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-white border border-[#E8E0D2] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                    Précision éventuelle (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex : Longueur de cheveux, dépose de vernis à prévoir..."
                    className="w-full bg-white border border-[#E8E0D2] rounded-xl px-3.5 py-2.5 text-xs text-[#3A2F29] focus:outline-none focus:border-[#C4975C] transition-colors resize-none"
                  />
                </div>

                {/* Notice disclaimer */}
                <div className="p-3 rounded-xl bg-white border border-[#E8E0D2] flex items-start gap-2 text-[11px] text-[#6B5A50] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-[#B08247] shrink-0 mt-0.5" />
                  <span>
                    <strong>À noter :</strong> Il s'agit d'une demande de réservation préalable. Notre équipe vous répondra par WhatsApp pour confirmer votre heure avec vous.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{isSubmitting ? "Préparation..." : "Envoyer ma demande par WhatsApp"}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
