import React from 'react';
import { X, Plane, ShieldCheck, Mail, BookOpen, Compass, Award, Globe } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'blog' | 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
  onStartOnboarding: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose, onStartOnboarding }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[36px] shadow-2xl border border-[#dadada] overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e2e2e2] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ABOUT US MODAL */}
        {type === 'about' && (
          <>
            <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/40">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-3">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <h3 className="text-3xl font-bold text-black tracking-tight font-sans">
                About GlobeTraveller
              </h3>
              <p className="text-sm text-[#5c5d6e] mt-1">
                Redefining modern experiential exploration across 45+ countries.
              </p>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm text-[#5c5d6e] leading-relaxed">
              <p>
                GlobeTraveller was founded on a simple philosophy: travel should be effortless, deeply immersive, and tailored to the individual rather than rigid tour buses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-4 bg-[#f3f3f4] rounded-2xl">
                  <Globe className="w-6 h-6 text-black mb-2" />
                  <h4 className="font-bold text-black text-sm">1,000+ Escapes</h4>
                  <p className="text-xs mt-1">Vetted boutique villas &amp; historic estates.</p>
                </div>
                <div className="p-4 bg-[#f3f3f4] rounded-2xl">
                  <Award className="w-6 h-6 text-black mb-2" />
                  <h4 className="font-bold text-black text-sm">Top Rated 2026</h4>
                  <p className="text-xs mt-1">4.8+ App Store &amp; Trustpilot ratings.</p>
                </div>
                <div className="p-4 bg-[#f3f3f4] rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-black mb-2" />
                  <h4 className="font-bold text-black text-sm">100% Guaranteed</h4>
                  <p className="text-xs mt-1">24/7 dedicated personal concierges.</p>
                </div>
              </div>
              <p>
                Whether exploring secret Parisian passages, ascending the Great Wall at sunset, or relaxing in clifftop Uluwatu villas, our mobile-first platform handles all logistics so you can focus on making memories.
              </p>
            </div>
          </>
        )}

        {/* BLOG & ARTICLES MODAL */}
        {type === 'blog' && (
          <>
            <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/40">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold text-black tracking-tight font-sans">
                Our Travel Journal &amp; Guides
              </h3>
              <p className="text-sm text-[#5c5d6e] mt-1">
                Insider recommendations, destination tips, and packing guides from our global editors.
              </p>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {[
                {
                  title: 'How to Experience Bali Beyond the Crowds in 2026',
                  tag: 'Indonesia &bull; 5 min read',
                  date: 'Aug 18, 2026',
                  desc: 'Discover secluded water purification temples and private cliff villas away from congested tourist corridors.'
                },
                {
                  title: 'A Culinary Journey Through Parisian Secret Passages',
                  tag: 'France &bull; 4 min read',
                  date: 'Aug 12, 2026',
                  desc: 'Why 19th-century covered arcades host some of the city’s most inventive patisseries and sommelier caves.'
                },
                {
                  title: 'Tuscany Vineyard Secrets: The Harvest Season Guide',
                  tag: 'Italy &bull; 6 min read',
                  date: 'Aug 04, 2026',
                  desc: 'From fresh olive pressing to truffle hunting in San Gimignano with local master foragers.'
                }
              ].map((article, idx) => (
                <div key={idx} className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#dadada]/60 hover:border-black transition-colors">
                  <div className="flex justify-between text-xs text-[#5c5d6e] mb-1">
                    <span className="font-semibold text-black uppercase tracking-wider">{article.tag}</span>
                    <span>{article.date}</span>
                  </div>
                  <h4 className="font-bold text-base text-black mb-1 font-sans">{article.title}</h4>
                  <p className="text-xs text-[#5c5d6e]">{article.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRIVACY POLICY */}
        {type === 'privacy' && (
          <>
            <div className="bg-[#f3f3f4] p-8 pb-6 border-b border-[#dadada]/60">
              <h3 className="text-2xl font-bold text-black">Privacy Policy</h3>
              <p className="text-xs text-[#5c5d6e] mt-1">Last Updated: August 2026</p>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto text-xs text-[#5c5d6e] space-y-3 leading-relaxed">
              <p>
                At GlobeTraveller, we prioritize your security and data confidentiality. We collect minimal necessary personal information strictly to facilitate tour bookings, itinerary management, and personalized travel recommendations.
              </p>
              <p>
                We do not sell your personal information or browsing records to third parties. All payment processing and hotel passport tokens are secured using end-to-end industry encryption.
              </p>
            </div>
          </>
        )}

        {/* TERMS OF SERVICE */}
        {type === 'terms' && (
          <>
            <div className="bg-[#f3f3f4] p-8 pb-6 border-b border-[#dadada]/60">
              <h3 className="text-2xl font-bold text-black">Terms of Service</h3>
              <p className="text-xs text-[#5c5d6e] mt-1">GlobeTraveller Booking &amp; Member Terms</p>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto text-xs text-[#5c5d6e] space-y-3 leading-relaxed">
              <p>
                All tours booked through the GlobeTraveller application and web platform are backed by our 100% partner guarantee. Flexible date rescheduling is available up to 14 days prior to tour departure with no penalty fees.
              </p>
              <p>
                Complimentary 24/7 in-app concierge support is included for all verified itinerary bookings.
              </p>
            </div>
          </>
        )}

        {/* CONTACT US */}
        {type === 'contact' && (
          <>
            <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/40">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold text-black tracking-tight font-sans">
                Contact Us
              </h3>
              <p className="text-sm text-[#5c5d6e] mt-1">
                Reach out directly for support, inquiries, or feedback.
              </p>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#f3f3f4] border border-[#dadada]/60 text-xs space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lead Contact</p>
                  <p className="font-extrabold text-black text-base mt-0.5">Faiz Khan</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</p>
                  <a
                    href="mailto:faizkhan@varplabs.com"
                    className="font-bold text-blue-600 hover:underline text-sm mt-0.5 inline-block"
                  >
                    faizkhan@varplabs.com
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Organization</p>
                  <p className="font-semibold text-black text-xs mt-0.5">VarpLabs</p>
                </div>
              </div>

              <a
                href="mailto:faizkhan@varplabs.com"
                className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email to Faiz Khan</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
