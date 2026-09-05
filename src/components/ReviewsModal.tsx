import React, { useState } from 'react';
import { X, Star, CheckCircle, MessageSquarePlus, ThumbsUp, Sparkles, Filter } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS_DATA } from '../data/reviewsData';
import { APP_ASSETS } from '../data/toursData';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [filterTour, setFilterTour] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedTour, setSelectedTour] = useState<string>('Paris Explorer');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  if (!isOpen) return null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorName: name,
      authorAvatar: APP_ASSETS.avatars[Math.floor(Math.random() * APP_ASSETS.avatars.length)],
      location: location || 'World Traveler',
      rating,
      date: 'Just now',
      tourName: selectedTour,
      tourId: 'custom',
      comment,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setShowAddForm(false);
    setName('');
    setLocation('');
    setComment('');
  };

  const filteredReviews = filterTour === 'all' 
    ? reviews 
    : reviews.filter((r) => r.tourName.toLowerCase().includes(filterTour.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl border border-[#dadada] overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e2e2e2] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 mb-1">
                <Star className="w-3.5 h-3.5 fill-black" />
                Verified Traveler Stories
              </span>
              <h3 className="text-3xl font-bold text-black tracking-tight font-sans">
                Traveler Reviews &amp; Ratings
              </h3>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showAddForm ? 'View All Reviews' : 'Leave a Review'}</span>
            </button>
          </div>

          {/* Rating Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-black/10 text-center">
            <div className="p-2.5 rounded-xl bg-white/70">
              <span className="text-2xl font-bold text-black">4.9 / 5</span>
              <span className="text-[11px] text-[#5c5d6e] block">Overall Rating</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70">
              <span className="text-2xl font-bold text-black">99.4%</span>
              <span className="text-[11px] text-[#5c5d6e] block">Recommendation</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70">
              <span className="text-2xl font-bold text-black">24/7</span>
              <span className="text-[11px] text-[#5c5d6e] block">Support Help</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70">
              <span className="text-2xl font-bold text-black">10K+</span>
              <span className="text-[11px] text-[#5c5d6e] block">Happy Guests</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-8 py-3 bg-[#f9f9f9] border-b border-[#dadada]/60 overflow-x-auto">
          <span className="text-xs font-bold text-[#5c5d6e] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['all', 'Paris', 'Bali', 'China', 'Italy'].map((key) => (
            <button
              key={key}
              onClick={() => setFilterTour(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filterTour === key
                  ? 'bg-black text-white'
                  : 'bg-[#f3f3f4] text-[#5c5d6e] hover:bg-[#e2e2e2]'
              }`}
            >
              {key === 'all' ? 'All Tours' : key}
            </button>
          ))}
        </div>

        {/* Scrollable Reviews List or Submission Form */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          {showAddForm ? (
            /* Add Review Form */
            <form onSubmit={handleAddReview} className="flex flex-col gap-4 bg-[#f9f9f9] p-6 rounded-2xl border border-[#dadada]/60">
              <h4 className="text-lg font-bold text-black">Share Your Travel Experience</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white text-sm border border-[#dadada] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Your City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Sydney, Australia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white text-sm border border-[#dadada] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Tour Taken</label>
                  <select
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white text-sm border border-[#dadada] focus:outline-none focus:border-black"
                  >
                    <option value="Paris Explorer">Paris Explorer &amp; Seine Yacht</option>
                    <option value="Bali Sanctuary">Bali Sanctuary &amp; Temples</option>
                    <option value="Imperial China">Imperial China &amp; Great Wall</option>
                    <option value="Grand Italy">Grand Italy &amp; Tuscany</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Rating</label>
                  <div className="flex items-center gap-1 pt-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the highlights, hotels, guides, or moments you loved..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white text-sm border border-[#dadada] focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          ) : (
            /* Reviews Feed */
            <div className="flex flex-col gap-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#f9f9f9] border border-[#dadada]/60 flex flex-col gap-3 transition-colors hover:border-black/20"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-11 h-11 rounded-full object-cover border border-black/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-black">{rev.authorName}</h4>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> Verified Guest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5c5d6e]">{rev.location} &bull; {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3 py-1 rounded-md w-fit border border-[#dadada]/50">
                    Tour: {rev.tourName}
                  </span>

                  <p className="text-xs sm:text-sm text-[#1a1c1c] leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
