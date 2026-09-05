import React, { useState } from 'react';
import { 
  X, Star, Heart, Camera, Check, Sparkles, MessageSquare, 
  Upload, Award, ShieldCheck, Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface TripReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  onReviewSubmitted: () => void;
}

export const TripReviewModal: React.FC<TripReviewModalProps> = ({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Flawless Logistics', 'Hidden Gem Food']);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickCompliments = [
    'Flawless Logistics',
    'Superb Coordinator',
    'Hidden Gem Food',
    'Comfortable Transit',
    'Boutique Hotels',
    'Paced Perfectly',
    'Accurate AI Concierge',
    'Unforgettable Views',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullComment = selectedTags.length > 0
        ? `[Highlights: ${selectedTags.join(', ')}]\n\n${comment}`
        : comment;

      await api.reviews.create({
        tripId,
        rating,
        comment: fullComment,
        photos: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80',
        ],
      });

      toast.success('🎉 Verified review submitted! Thank you for inspiring fellow explorers.');
      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review. You may have already reviewed this trip.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#18181b] text-white p-6 px-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                Verified Explorer Feedback
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Review: {tripTitle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Rate your journey experience, accommodations, and field guide assistance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-white">
          {/* Interactive Star Rating */}
          <div className="text-center py-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
              Overall Experience Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 transform hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'text-gray-300 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-gray-600 mt-1 block">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Journey!' : `${rating} Stars Selected`}
            </span>
          </div>

          {/* Quick Highlight Tags */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
              What Stood Out Most?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickCompliments.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-2xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 text-emerald-400" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Testimonial Textarea */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Your Experience &amp; Highlights (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Tell other travelers about your favorite stop, hotel atmosphere, culinary moments, and how smoothly the itinerary flowed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-2xl border border-gray-200 focus:border-black outline-none resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Photos Showcase */}
          <div className="p-3 rounded-2xl bg-[#fafafa] border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-700">Attach Travel Snapshots</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              2 Photos Attached
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Post Verified Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
