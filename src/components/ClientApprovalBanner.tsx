import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Coffee } from 'lucide-react';

export const ClientApprovalBanner: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#F7F2EA] border-b border-[#E8E0D2] text-xs text-[#5C4D44]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="w-3.5 h-3.5 text-[#B08247]" />
          <span className="font-medium text-[#3A2F29]">
            Ambiance salon cocooning & chaleureuse
          </span>
          <span className="hidden md:inline text-[#8C7A70]">
            — Photos réelles et tarifs personnalisables en direct
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[#8A5F26] hover:text-[#3A2F29] font-medium underline underline-offset-2"
          >
            <span>{isOpen ? 'Masquer' : 'Voir les éléments ajustables'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-lg bg-[#5C4D44] text-[#FAF7F2] text-[10px] font-semibold uppercase tracking-wider hover:bg-[#4A3E39]"
          >
            Espace Admin
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-white border-t border-[#E8E0D2] px-4 py-3.5 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#6B5A50]">
          <div className="space-y-1 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DD]">
            <p className="font-semibold text-[#3A2F29] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              1. Visuels Réels du Salon
            </p>
            <p className="font-light leading-relaxed">
              Vos photos réelles (fauteuils dorés, plateau thé marocain, pédicure spa, cabine soins) sont mises en valeur dans un cadre doux et chaleureux.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DD]">
            <p className="font-semibold text-[#3A2F29] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              2. Prestations « Sur demande »
            </p>
            <p className="font-light leading-relaxed">
              Les prix de coiffure et soins techniques sont indiqués avec bienveillance en <em>« Sur demande »</em> et modifiables en 1 clic dans l'Admin.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DD]">
            <p className="font-semibold text-[#3A2F29] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              3. WhatsApp & Réservations
            </p>
            <p className="font-light leading-relaxed">
              Le numéro <strong>+212 669 33 05 54</strong> reçoit directement les messages formatés avec le thé d'accueil mentionné.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
