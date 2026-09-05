import { Tour } from '../types';

export const APP_ASSETS = {
  heroMockup: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwFegR9nfofb-MzlG343dFW2JBGCxiHv6CyOi0mZZxyuOE3zo8x4u32sMocIRLiQny0_URPLtLtqSkE0cjJAPyEEbrCwYGfe2OoY4mDsXaamuauGvYLgIF1ZgZAIUt07Vd2hszzXeteUxbO_WHyteHtIL5ysP5TwNvzLjHHmeOobatGT2DYn94ljdfiPUYIuo2reqtj4Bbcztw5B3KGUhxMZaC8qgeT4Lhft-KlCADHCFNExeIKY6xVSxg3vH7UmRTmUY',
  trioMockup: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD89BESnatQSjHUYPP4vPXTptqy21EPC5xGZpnrD0D2AKuQBC5ctcXVgX6VsFnFXLVIg7GwdlSOXSZD4pJSKl7rzikZnx-OWRNcS2PQtdH2zmzcIywUKT5iwo2KOoZZA398Y8c19xvWpqcOJdmv2XxcD6SWxjYXDjyAAYNdyJkqQTiArVViLLOQBGtDXgYODNc4ZD-jspz4QoBVAiojH4Y_yvKm56mKp4ve_occoWRFpvz8kM7QyCNog',
  avatars: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAw4E6sAAXuFAf3nhkDypyCDUJleeYeyGlMpN7ZYFCtorGBVMTuVg32GEf_1ykz7IP5r_4qRXHFfFa6VVsqvOOsNRTmU4cVR4th3LlrZFnja3gzeJWaqv5_sTKbxeFNOBVVLS1zk896bz5vm_n-7dHXHa83d-E1SkqPivyeHVP4vbSQVsSdEUJDOROeLVQq1W8jAv0sudZq4O_WdgDuaBy4errBtcCufoY3I-Ji6J62TKxZUtVxCzJooA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDn5dUQl6pgMVFer1HHvR3waZ-lm05ePQx_FEaMXF49bABbo8QzuNpAebnLAGDJvn72ZuCoFiCkL0wHLBjffT0zrkK3osbIdnBrOOoH_HwXkozIUE_rBJEsHnVMHQjC2YtPtUrkCSWsTfOadFcXE16QTanX28JN5fZWr2nO1XQXgR1IQq6EjbBMqSxq4q5-S8rUbES339j63hW3LnrtWl2NayVokQY_ZvIujNa1IlCyhbf_U0uqgFVGqg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBAEIk2k3cjpnReHO5S_PmjwwVS1nWTTR91VJ8bFcak5uwONfzzwsiWXmGeGDlp93LWd9ci4ToqtFSXaxo2WznTonb2QQSIIYfRWvXbHSRp7Kqnpzzha33zQ_QatgjKsCYVx5nN7UCshJxHDYM7gdQNPO1gypClGc1ieCSaZ7OvIhIB9fDN8theD4dUeNJXb-2BLmkuhz3eZrYz5NFPpf7AMf-xdI1jUI6zhzTYQDJuaIeQCHRFY6BlrA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBGsxUew5HhWjSx4EkbTzvtm_GQx36KtlT6zjTpttL_aMUdbWJZDzreDLnBdO_cmXkYT4-AodmBxM12DTECQsVOWDK5G1JPLCG5rI45IWloQfdBrKx8uwCQY61WWZlEPqe_ag5xip48dJfmc6Ikm9au32i52sxySYZCUkftjmhGLZ8lKJI2x6y3Oq5XTqsNTBTznkitex5V24RTihvgHIWR2hngNvt1AOJFCljPo4dBev82h5l53RaIAA',
  ],
};

export const TOURS_DATA: Tour[] = [
  {
    id: 'bali-paradise',
    title: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy58L1ClwwEXJjoDKOrwNEFU6r_pxDW1bEr6qk38DdiO0SP30VRAL4ziZZvhh2Tj9ck1AZHXeeXd-XtphIraKXq7GYsERpidfaFxp_t_EX2G45fj6tHDKtY23UxI8RbT7Ea_vVeVyvPe3-z-yoVCPCGSUtojFNjge7yxaSfL4GolQVHEJZi17H6nlE1aOSGddTYg7AmtGOpCsYF_YSOv8VotHtbxhDeJodJdDXDJUbh6-y7n9HWP_MRQ',
    price: 1999,
    durationDays: 8,
    hotelCount: 10,
    rating: 4.9,
    reviewsCount: 342,
    partnerDiscount: true,
    bgAccent: 'lavender',
    description: 'Immerse yourself in lush emerald rice terraces, sacred ancient temples, and crystal-clear turquoise waters with private island villas.',
    highlights: [
      'Ubud Sacred Monkey Forest Sanctuary & Art Market',
      'Tegallalang Rice Terrace sunrise private yoga session',
      'Ulun Danu Beratan Temple lake tour',
      'Luxury oceanfront cliff villa in Uluwatu with infinity pool',
      'Sunset seafood dining at Jimbaran Bay'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Seminyak Welcome Dinner', description: 'VIP airport transfer, check-in to boutique villa, and traditional Balinese cuisine.' },
      { day: 2, title: 'Ubud Culture & Rice Terraces', description: 'Explore royal palaces, local craft workshops, and private swings over the valleys.' },
      { day: 3, title: 'Water Temples & Holy Springs', description: 'Tirta Empul purification ritual and scenic highland coffee plantations.' },
      { day: 4, title: 'Nusa Penida Day Cruise', description: 'Speedboat to Kelingking beach, snorkel with gentle manta rays at Crystal Bay.' },
      { day: 5, title: 'Mount Batur Sunrise Trek or Spa', description: 'Early morning volcano vista followed by natural hot springs relaxation.' },
      { day: 6, title: 'Uluwatu Cliffs & Kecak Fire Dance', description: 'Dramatic clifftop amphitheater experience at sunset.' },
      { day: 7, title: 'Free Leisure & Ocean Spa Day', description: 'Curated shopping, beach club daybeds, and full body massage.' },
      { day: 8, title: 'Farewell Bali', description: 'Breakfast with panoramic views and scheduled airport transfer.' }
    ],
    included: [
      '5-Star Boutique Hotels & Private Villas',
      'Daily Gourmet Breakfast & 4 Chef Dinners',
      'Private Chauffeur & English Speaking Tour Guide',
      'All Entry Fees, Temple Sarongs, & Ferry Passes',
      '24/7 Concierge Support via GlobeTraveller App'
    ],
    departureDates: ['Oct 12, 2026', 'Nov 05, 2026', 'Dec 01, 2026', 'Jan 15, 2027']
  },
  {
    id: 'china-heritage',
    title: 'China',
    country: 'China',
    continent: 'Asia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUAjWhR1_8WWdQaErER249FK1nw3uy3SmBinN5VDSSXSuWRFM2gNn2uqMY603Qew4xFBnWvotvPysGL5Ahk-IIctsA0XII9QwGV4v8ZcOBzFO_6NdjHFX27me7GgkWAS0olDxvTIBwiv13uJeQpI5y_SOwBPTPdPXFeDOYW4G5c_CzP3LqGm5HhHl720uqskwQ2uWr8rWXKpKQ9KM7gPzffZB6HSssxW63s05-J--m3CthxDhh0lI4IQ',
    price: 3199,
    durationDays: 10,
    hotelCount: 12,
    rating: 4.85,
    reviewsCount: 289,
    partnerDiscount: true,
    bgAccent: 'light',
    description: 'An epic journey across dynasties: walk along untouched sections of the Great Wall, uncover Xian terracotta warriors, and cruise the neon Bund of Shanghai.',
    highlights: [
      'Private Mutianyu Great Wall cable car & picnic',
      'Exclusive early access to Forbidden City chambers',
      'Terracotta Army archaeological workshop in Xi’an',
      'Li River karst mountain bamboo rafting in Guilin',
      'High-speed bullet train journey across the countryside'
    ],
    itinerary: [
      { day: 1, title: 'Beijing Imperial Welcome', description: 'Arrive in Beijing, check into historic courtyard hotel, Peking duck banquet.' },
      { day: 2, title: 'Forbidden City & Tiananmen', description: 'Deep historical exploration with a resident dynasty historian.' },
      { day: 3, title: 'The Great Wall of China', description: 'Climb watchtowers without tourist crowds and sunset wine tasting.' },
      { day: 4, title: 'Summer Palace & Bullet Train to Xi’an', description: 'Imperial gardens followed by 300km/h express transit.' },
      { day: 5, title: 'Xi’an Terracotta Warriors & Muslim Quarter', description: 'Marvel at 8,000 ancient sculpted soldiers and taste hand-pulled noodles.' },
      { day: 6, title: 'Fly to Guilin & Karst Landscapes', description: 'Breathtaking limestone peak horizons and evening cormorant fishing display.' },
      { day: 7, title: 'Yangshuo Countryside & River Cruise', description: 'Serene bamboo raft voyage through idyllic rural waterways.' },
      { day: 8, title: 'Shanghai Modernity & The Bund', description: 'Skyline views from Shanghai Tower and French Concession walking tour.' },
      { day: 9, title: 'Water Village of Zhujiajiao', description: 'Ancient arched stone bridges and private gondola cruise.' },
      { day: 10, title: 'Departure from Shanghai', description: 'Farewell tea ceremony and Maglev train transfer to Pudong airport.' }
    ],
    included: [
      'Luxury 5-Star Accommodations throughout',
      'First-Class Bullet Train & Domestic Flights',
      'Private English-speaking Expert Historians',
      'All Curated Dining & VIP Entrance Permits',
      'Offline Translation & Map Hub via App'
    ],
    departureDates: ['Oct 20, 2026', 'Nov 14, 2026', 'Dec 10, 2026', 'Feb 08, 2027']
  },
  {
    id: 'paris-elegance',
    title: 'Paris',
    country: 'France',
    continent: 'Europe',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMS5cNwmtb2hrCD9FPYhMiCWxOHrTssi0vVt1Mo5yCVAK97MgBuyV6Oi9bXcGivxwrlMmSGZGOBoOv7QXkHuT8hac3stv6UtaFErxsk6PIwyXnUQip58SgIwVMoP7KLmshYyu9Tf0f4zFBX4xLYTXt5ie8IIdHcyXJlxio2m44dWlaVIug2QVxMcIZexXDxbqnetj5yfOUtX8t-d8lTd49c6d1FtU3Ul8_JBrTa_qTRvbaUXVSebQw3A',
    price: 1999,
    durationDays: 7,
    hotelCount: 'over 100',
    rating: 4.95,
    reviewsCount: 512,
    partnerDiscount: true,
    bgAccent: 'peach',
    description: 'Fall in love with the City of Light: Michelin-starred gastronomy, private Louvre after-hours access, rooftop champagne, and romantic Seine cruises.',
    highlights: [
      'Skip-the-line VIP Louvre & Musée d’Orsay masterworks',
      'Private sunset Seine river cruise with sommelier champagne tasting',
      'Palace of Versailles Grand Apartments & secret King’s gardens',
      'Montmartre artisan pastry crawl & vintage Citroën 2CV tour',
      'Reserved Eiffel Tower summit dining'
    ],
    itinerary: [
      { day: 1, title: 'Bienvenue à Paris & Saint-Germain', description: 'Check into Haussmann-style luxury hotel, welcome macaron & wine reception.' },
      { day: 2, title: 'Art & Secret Passages', description: 'Louvre private highlights and 19th-century covered shopping galleries.' },
      { day: 3, title: 'Montmartre & Eiffel Tower Twilight', description: 'Bohemian artistic streets, Sacré-Cœur vistas, and illuminated Eiffel dining.' },
      { day: 4, title: 'Versailles Royalty & Sun King Gardens', description: 'Hall of Mirrors and Marie Antoinette’s rustic Petit Trianon retreat.' },
      { day: 5, title: 'Le Marais, Boutiques & French Culinary Masterclass', description: 'Bake authentic baguettes and delicate croissants with a Parisian chef.' },
      { day: 6, title: 'Champagne Day Trip or Opera Garnier', description: 'Cellar tastings in Reims or exclusive backstage tour of Palais Garnier.' },
      { day: 7, title: 'Au Revoir Paris', description: 'Morning espresso at Café de Flore and private transfer to CDG.' }
    ],
    included: [
      'Central Parisian 5-Star Boutique Hotel',
      'Daily French Continental Breakfasts & 3 Tasting Dinners',
      'Exclusive Fast-Track Museum & Monument Passes',
      'Private Seine Yacht Cruise with Fine Wines',
      'Digital Audio Tour Companion in App'
    ],
    departureDates: ['Oct 08, 2026', 'Oct 28, 2026', 'Nov 18, 2026', 'Dec 22, 2026']
  },
  {
    id: 'italy-renaissance',
    title: 'Italy',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1Ep-bs5qMUcMXW_72TiUw7jCRJsYb5i9LlV2Q0zhTuZMb6QymyWyXBJR3UL9mZaJSczPXbDDAiYgxJorOiWJMAgyvQOqRedBZfU1vQ-KxsO7ZE21xNadWsFriPD9WTXnOmeIZ9uPQEOIXcpZ_gy2vaqRg6SImNF9kHNur4zWgLXIdDgxSRBY5-KbIYe-LWJAwZMsZwoP1uSgrliM_dnWDLSSKX_VRdXLFSv7oGbiAP-Ks8fda8pH5Q',
    price: 1099,
    durationDays: 10,
    hotelCount: 8,
    rating: 4.88,
    reviewsCount: 467,
    partnerDiscount: true,
    bgAccent: 'sage',
    description: 'Experience Roman wonders, Florentine Renaissance masterworks, Chianti vineyard estates, and picturesque Venetian canals on this grand journey.',
    highlights: [
      'Gladiator gate entrance to Colosseum & Roman Forum',
      'Vatican Museums & Sistine Chapel before general public opening',
      'Tuscany wine estate truffle hunting & olive oil press',
      'Florence Uffizi Gallery & Duomo dome climb',
      'Venice private gondola serenades & Murano glass blowing'
    ],
    itinerary: [
      { day: 1, title: 'The Eternal City: Rome', description: 'Check into piazza hotel, evening stroll by Trevi Fountain and Spanish Steps.' },
      { day: 2, title: 'Ancient Rome & Colosseum', description: 'Step onto the arena floor where gladiators fought 2,000 years ago.' },
      { day: 3, title: 'Vatican Splendor', description: 'Michelangelo frescoes and St. Peter’s Basilica architecture.' },
      { day: 4, title: 'Tuscan Hills & Siena', description: 'Scenic drive through cypress-lined hills, wine tasting in San Gimignano.' },
      { day: 5, title: 'Florence Renaissance', description: 'Statue of David at the Accademia and golden sunset from Piazzale Michelangelo.' },
      { day: 6, title: 'Tuscan Farmhouse Cooking Class', description: 'Handmade pasta, wood-fired pizza, and rich Chianti Classico pairings.' },
      { day: 7, title: 'Venice: City of Bridges', description: 'Arrival by water taxi, check-in to palace hotel on the Grand Canal.' },
      { day: 8, title: 'St. Mark’s Basilica & Doge’s Palace', description: 'Gothic architecture and private gondola through quiet back canals.' },
      { day: 9, title: 'Islands of Murano & Burano', description: 'Vibrant colored fishermen houses and master glass artisans.' },
      { day: 10, title: 'Arrivederci Italia', description: 'Espresso overlooking the lagoon and water taxi transfer to airport.' }
    ],
    included: [
      'Historic 4 & 5-Star Boutique Hotels',
      'Frecciarossa High-Speed Trains Between Cities',
      'Private Guided City Walks with Licensed Art Historians',
      'Tuscan Wine & Olive Oil Tastings Included',
      'Direct Mobile Passports & Vouchers in App'
    ],
    departureDates: ['Oct 15, 2026', 'Nov 02, 2026', 'Dec 05, 2026', 'Jan 10, 2027']
  },
  {
    id: 'india-royal-rajasthan',
    title: 'India',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    price: 1499,
    durationDays: 9,
    hotelCount: 10,
    rating: 4.95,
    reviewsCount: 388,
    partnerDiscount: true,
    bgAccent: 'lavender',
    description: 'Experience the Golden Triangle & Royal Rajasthan: sunrise at the Taj Mahal, opulent hilltop Amber Fort palaces, and sacred Ganges aarti in Varanasi.',
    highlights: [
      'VIP Sunrise fast-track entry to the magnificent Taj Mahal',
      'Amber Fort private hilltop jeep safari & Sheesh Mahal mirror palace',
      'Mesmerizing grand evening Ganga Aarti on a private boat in Varanasi',
      'Palace heritage hotel stays with traditional Rajasthani royal dining',
      'Vibrant Johari Bazaar artisan textile & gemstone trail'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi & Welcome Reception', description: 'VIP airport transfer, check-in to heritage hotel, and Old Delhi culinary tour.' },
      { day: 2, title: 'Historic Delhi: Mughal & Imperial', description: 'Qutub Minar, Humayun’s Tomb, and rickshaw ride through Chandni Chowk spice markets.' },
      { day: 3, title: 'Express to Agra & Red Fort', description: 'Gatimaan Express high-speed train to Agra and tour of Emperor Akbar’s red sandstone citadel.' },
      { day: 4, title: 'Taj Mahal Sunrise & Mehtab Bagh', description: 'Watch the ivory marble glow at dawn followed by sunset river reflections.' },
      { day: 5, title: 'Fatehpur Sikri to the Pink City of Jaipur', description: 'Visit ghost city palace of Emperor Akbar and arrive at Jaipur heritage estate.' },
      { day: 6, title: 'Amber Fort & Hawa Mahal Honeycomb Palace', description: 'Ascend the hilltop fort by jeep and explore 953 ornate lattice windows.' },
      { day: 7, title: 'Flight to Varanasi: The Sacred City', description: 'Arrive at the holy Ganges river, check-in to riverfront palace, and explore old silk lanes.' },
      { day: 8, title: 'Dawn Ganges Boat Ride & Evening Aarti', description: 'Sunrise sacred rituals on ancient ghats followed by brass-lamp fire ceremony.' },
      { day: 9, title: 'Sarnath & Farewell India', description: 'Visit Lord Buddha’s first sermon site and private airport transfer.' }
    ],
    included: [
      '5-Star Heritage Palaces & Luxury Boutique Hotels',
      'Daily Royal Breakfast & Curated Chef Dinners',
      'Executive Class Express Trains & Domestic Flight to Varanasi',
      'Private Chauffeur & Government Certified Historian Guides',
      '24/7 Dedicated Concierge Support via Tripweave'
    ],
    departureDates: ['Oct 20, 2026', 'Nov 12, 2026', 'Dec 08, 2026', 'Jan 18, 2027']
  }
];
