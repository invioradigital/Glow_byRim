import React from 'react';
import { Coffee, Scissors, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { getAssetUrl } from '../utils/assets';

export const About: React.FC = () => {
  const { settings } = useSalon();

  const highlights = [
    {
      icon: Coffee,
      title: "Accueil Chaleureux & Thé Marocain",
      desc: "Un thé à la menthe parfumé et des dattes fraîches vous sont toujours offerts. Prenez place dans notre salon velours bleu et détendez-vous.",
    },
    {
      icon: Scissors,
      title: "Coiffure & Balayages Naturels",
      desc: "Des coupes adaptées à votre quotidien, des balayages fondus lumineux et des soins botox pour redonner vie et brillance à vos cheveux.",
    },
    {
      icon: Sparkles,
      title: "Manucure & Nail Bar Doux",
      desc: "Une manucure méticuleuse qui respecte la santé de vos ongles, vernis semi-permanent longue tenue et jolis motifs discrets.",
    },
    {
      icon: Heart,
      title: "Pédicure Spa en Fauteuil Massant",
      desc: "Un vrai moment de déconnexion : bain bouillonnant délassant, gommage et massage des pieds dans des fauteuils spa grand confort.",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-2">
            L'Esprit du Salon
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3A2F29] tracking-tight">
            Un Salon à Taille Humaine, Où l'On Prend le Temps
          </h2>
          <div className="w-12 h-0.5 bg-[#C4975C] mx-auto mt-3 mb-5" />
          <p className="text-[#6B5A50] text-sm sm:text-base font-light leading-relaxed">
            Situé au <span className="font-medium text-[#3A2F29]">15 Rue Jalal Eddine Sayouti</span>, Glow by Rim a été pensé
            comme un cocon chaleureux et accessible. Ici, pas de précipitation : nous prenons le temps d'écouter
            vos envies pour que vous repartiez sereine, radieuse et reposée.
          </p>
        </div>

        {/* Visual Grid & Friendly Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
          
          {/* Collage of real salon details */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xs border border-[#EFE8DD]">
                <img
                  src={getAssetUrl("/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.00_a87a3188.jpeg")}
                  alt="Plateau thé marocain et dattes au salon"
                  className="w-full h-48 sm:h-56 object-cover hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xs border border-[#EFE8DD]">
                <img
                  src={getAssetUrl("/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.00__2__cc2e07ac.jpeg")}
                  alt="Cabine de soin esthétique reposante"
                  className="w-full h-40 sm:h-48 object-cover hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 sm:pt-10">
              <div className="rounded-2xl overflow-hidden shadow-xs border border-[#EFE8DD]">
                <img
                  src={getAssetUrl("/assets/aistudio/WhatsApp_Image_2026-10-23_at_16.31.01_2bb55787.jpeg")}
                  alt="Fauteuils spa pédicure confortables"
                  className="w-full h-52 sm:h-64 object-cover hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DD] text-center">
                <p className="font-serif text-2xl font-semibold text-[#3A2F29]">
                  100% Cocooning
                </p>
                <p className="text-xs text-[#8C7A70] mt-0.5">
                  Confort, hygiène et écoute
                </p>
              </div>
            </div>
          </div>

          {/* Text & Warm commitments */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3A2F29]">
                Une Pause Bien-Être Comme à la Maison
              </h3>
              <p className="text-[#6B5A50] text-sm leading-relaxed font-light">
                Chaque femme mérite un espace où elle se sent écoutée et comprise. Chez Glow by Rim, nous privilégions la simplicité, la douceur et la qualité du travail bien fait.
              </p>
              <p className="text-[#6B5A50] text-sm leading-relaxed font-light">
                Que ce soit pour un simple brushing de semaine, un balayage lumineux, une pose de vernis ou une pédicure délassante, notre équipe veille à votre bien-être du début à la fin.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2">
              {[
                "Conseil personnalisé et bienveillant avant chaque prestation",
                "Matériel systématiquement désinfecté et stérilisé",
                "Fauteuils pédicure avec bains bouillonnants et massages",
                "Thé à la menthe chaud et douceurs offerts avec le sourire",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C4975C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#4A3E39] font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#services"
                className="inline-flex items-center justify-center bg-[#5C4D44] hover:bg-[#4A3E39] text-[#FAF7F2] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                Découvrir la carte des soins
              </a>
            </div>
          </div>

        </div>

        {/* 4 Cozy Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#EFE8DD] cozy-card-hover space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#B08247] shadow-xs">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-semibold text-[#3A2F29]">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#6B5A50] leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
