import React, { useState } from 'react';
import { Tag, Building2, Search } from 'lucide-react';
import { Tour } from '../types';
import { APP_ASSETS } from '../data/toursData';

interface DestinationsSectionProps {
  tours: Tour[];
  savedTourIds: string[];
  onToggleSaveTour: (tourId: string) => void;
  onExploreTour: (tourId: string) => void;
  onOpenAppPreview: () => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  tours,
  onExploreTour,
  onOpenAppPreview
}) => {
  return (
    <section id="destinations-section" className="max-w-[1360px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
      {/* Top Banner: Community Callout + Social Proof Avatars */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
        {/* Left Sub-Header */}
        <div className="flex flex-col gap-4 max-w-lg">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight leading-tight">
            JOIN OUR COMMUNITY
          </h2>
          <p className="text-base sm:text-lg text-[#5c5d6e] leading-relaxed">
            Become a user of our mobile app and your travels will become more enjoyable and amazing.
          </p>
          <div>
            <button
              id="community-download-app-btn"
              onClick={onOpenAppPreview}
              className="bg-black text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              Download App
            </button>
          </div>
        </div>

        {/* Right Sub-Header & Avatars */}
        <div className="flex flex-col gap-3 max-w-md lg:text-right">
          <h3 className="text-2xl sm:text-3xl text-black font-normal italic font-serif uppercase tracking-tight">
            THE BEST EXPERIENCE IN TRAVEL
          </h3>
          <p className="text-sm sm:text-base text-[#5c5d6e]">
            They have already joined our community. And you?
          </p>

          {/* Overlapping Avatar Stack */}
          <div className="flex lg:justify-end items-center mt-1">
            <div className="flex -space-x-3">
              {APP_ASSETS.avatars.map((avatarUrl, idx) => (
                <img
                  key={idx}
                  src={avatarUrl}
                  alt={`Tripweave community member ${idx + 1}`}
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-11 h-11 rounded-full bg-[#e8e8e8] flex items-center justify-center text-xs font-bold text-black z-10 border-2 border-white shadow-xs">
                +1K
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Destinations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tours.slice(0, 4).map((tour) => {
          return (
            <div
              key={tour.id}
              id={`destination-card-${tour.id}`}
              onClick={() => onExploreTour(tour.id)}
              className="bg-[#f3f3f4] rounded-[28px] overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-[#eaeaea]"
            >
              {/* Card Image */}
              <div className="h-56 sm:h-52 overflow-hidden">
                <img
                  src={tour.image}
                  alt={`${tour.title} Tour`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-2xl font-bold text-black tracking-tight font-sans">
                      {tour.title}
                    </h4>

                    {tour.partnerDiscount && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-white px-2.5 py-1 rounded-full border border-black/10 whitespace-nowrap">
                        <Tag className="w-3 h-3 text-black" />
                        Partner discount
                      </span>
                    )}
                  </div>
                </div>

                {/* Price, Duration & Explore Button */}
                <div className="flex justify-between items-end pt-2 border-t border-black/5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-black">
                      From ${tour.price.toLocaleString()} / {tour.durationDays} days
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#5c5d6e] flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {typeof tour.hotelCount === 'number' ? `${tour.hotelCount} recommended hotels` : `${tour.hotelCount} hotels`}
                    </span>
                  </div>

                  <button
                    id={`explore-btn-${tour.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreTour(tour.id);
                    }}
                    className="bg-black text-white px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
