import { Review } from '../types';
import { APP_ASSETS } from './toursData';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Sarah Jenkins',
    authorAvatar: APP_ASSETS.avatars[0],
    location: 'London, UK',
    rating: 5,
    date: 'August 14, 2026',
    tourName: 'Paris Explorer',
    tourId: 'paris-elegance',
    comment: 'GlobeTraveller made our Paris trip effortless! Booking took literally 2 minutes on the app, the VIP skip-the-line at the Louvre was seamless, and the private Seine champagne cruise at twilight was unforgettable.',
    verified: true
  },
  {
    id: 'rev-2',
    authorName: 'Marcus Lindqvist',
    authorAvatar: APP_ASSETS.avatars[1],
    location: 'Stockholm, Sweden',
    rating: 5,
    date: 'July 28, 2026',
    tourName: 'Bali Sanctuary & Temples',
    tourId: 'bali-paradise',
    comment: 'The clifftop villa in Uluwatu was out of this world. The 24/7 concierge in the mobile app assisted us with last-minute helicopter transfers and local artisan dining. Worth every single penny!',
    verified: true
  },
  {
    id: 'rev-3',
    authorName: 'Elena Rostova',
    authorAvatar: APP_ASSETS.avatars[2],
    location: 'Geneva, Switzerland',
    rating: 5,
    date: 'July 05, 2026',
    tourName: 'Grand Italy Tour',
    tourId: 'italy-renaissance',
    comment: 'The Tuscan farmhouse cooking masterclass and private gondola tour in Venice exceeded all expectations. Having all tickets and hotel confirmations in one clean mobile wallet saved so much stress.',
    verified: true
  },
  {
    id: 'rev-4',
    authorName: 'David Chen',
    authorAvatar: APP_ASSETS.avatars[3],
    location: 'San Francisco, USA',
    rating: 5,
    date: 'June 19, 2026',
    tourName: 'Imperial China & Great Wall',
    tourId: 'china-heritage',
    comment: 'Walking along the quiet, unrestored sections of the Great Wall at sunset was a lifetime bucket-list moment. The high-speed bullet train transfers were smooth and the guides were exceptionally knowledgeable.',
    verified: true
  }
];
