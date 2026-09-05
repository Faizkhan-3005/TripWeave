import React from 'react';
import { Plane, MapPin, Mail, Github, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenReviews: () => void;
  onScrollToDestinations: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenReviews,
  onScrollToDestinations,
  onOpenLegal,
}) => {
  return (
    <footer id="main-footer" className="w-full bg-[#0d0d0d] text-white">

      {/* Main Footer Grid */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-5">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shrink-0">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tight font-sans">Tripweave</span>
            </button>
            <p className="text-sm text-[#8a8a9a] leading-relaxed max-w-xs">
              Your all-in-one personalized tour planning & operations platform. Build multi-city itineraries, manage vendors, and orchestrate group departures.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#6b6b7e]">
              <MapPin className="w-3.5 h-3.5 text-[#5c5d6e]" />
              <span>Built for travelers everywhere</span>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#5c5d6e]">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Destinations', action: onScrollToDestinations },
                { label: 'Features', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { label: 'Reviews', action: onOpenReviews },
                { label: 'About Tripweave', action: onOpenAbout },
              ].map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="text-sm text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#5c5d6e]">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', type: 'privacy' as const },
                { label: 'Terms of Service', type: 'terms' as const },
                { label: 'Contact Us', type: 'contact' as const },
              ].map(({ label, type }) => (
                <li key={type}>
                  <button
                    onClick={() => onOpenLegal(type)}
                    className="text-sm text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#5c5d6e]">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#8a8a9a]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Faiz Khan</p>
                  <a
                    href="mailto:faizkhan@varplabs.com"
                    className="text-sm text-[#8a8a9a] hover:text-white transition-colors break-all"
                  >
                    faizkhan@varplabs.com
                  </a>
                </div>
              </div>

              <button
                onClick={() => onOpenLegal('contact')}
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Get in Touch
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5c5d6e]">
            &copy; {new Date().getFullYear()} Tripweave. All rights reserved.
          </p>
          <p className="text-xs text-[#5c5d6e]">
            Crafted by{' '}
            <a
              href="mailto:faizkhan@varplabs.com"
              className="text-[#8a8a9a] hover:text-white transition-colors font-semibold"
            >
              Faiz Khan
            </a>
            {' '}·{' '}
            <span className="text-[#3d3d4d]">VarpLabs</span>
          </p>
        </div>
      </div>

    </footer>
  );
};
