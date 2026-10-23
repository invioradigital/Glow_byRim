import React, { useState } from 'react';
import { Star, Quote, CheckCircle, ExternalLink } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, settings } = useSalon();
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section id="reviews" className="py-16 md:py-20 bg-[#FAF7F2] relative border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C4975C] font-semibold block mb-2">
            Elles Témoignent
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3A2F29] tracking-tight">
            Les Mots Doux de Nos Clientes
          </h2>
          <div className="w-12 h-0.5 bg-[#C4975C] mx-auto mt-3 mb-5" />

          {/* Google Verified Card */}
          <div className="inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-[#EFE8DD] shadow-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-left border-l border-[#EFE8DD] pl-4">
              <div className="flex items-center gap-1 text-xs font-bold text-[#3A2F29]">
                <span>{settings.googleRating} sur 5</span>
                <span className="font-normal text-[#8C7A70]">
                  • Avis Google vérifiés
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                100% de clientes satisfaites
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-[#EFE8DD] flex flex-col justify-between cozy-card-hover relative"
            >
              <Quote className="w-6 h-6 text-[#C4975C]/20 absolute top-4 right-4" />

              <div>
                {/* Rating & Service */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  {rev.serviceTag && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EFE8DD] text-[#6B5A50]">
                      {rev.serviceTag}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed font-light italic mb-4">
                  "{rev.text}"
                </p>
              </div>

              {/* Author & Date */}
              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EFE7DC] text-[#5C4D44] flex items-center justify-center font-serif font-bold text-[11px]">
                    {rev.authorName.charAt(0)}
                  </div>
                  <span className="font-medium text-[#3A2F29]">{rev.authorName}</span>
                </div>
                <span className="text-[#8C7A70] text-[11px] font-light">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
