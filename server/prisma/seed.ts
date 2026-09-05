import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Tripweave database seeding...');

  // Clean existing tables (in dependency order)
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.itineraryChange.deleteMany();
  await prisma.tourGroupMember.deleteMany();
  await prisma.tourGroup.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.travelerPreference.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users for all roles
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@tripweave.com',
      name: 'Faiz Khan',
      passwordHash,
      role: 'TRAVELER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      currency: 'USD',
      budgetAlerts: true,
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@tripweave.com',
      name: 'Elena Rostova (Lead Tour Operator)',
      passwordHash,
      role: 'OPERATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      currency: 'USD',
      budgetAlerts: true,
    },
  });

  const coordinatorUser = await prisma.user.create({
    data: {
      email: 'coordinator@tripweave.com',
      name: 'Marco Bellini (Field Coordinator)',
      passwordHash,
      role: 'COORDINATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      currency: 'EUR',
      budgetAlerts: true,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tripweave.com',
      name: 'Operations Admin',
      passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      currency: 'USD',
      budgetAlerts: true,
    },
  });

  console.log('👤 Created demo users for all 4 roles:');
  console.log('   - Traveler: demo@tripweave.com');
  console.log('   - Operator: operator@tripweave.com');
  console.log('   - Coordinator: coordinator@tripweave.com');
  console.log('   - Admin: admin@tripweave.com');

  // 2. Seed Cities with authentic imagery and rich metadata
  const citiesData = [
    {
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      description: 'The City of Light renowned for world-class art, Haussmannian architecture, Michelin dining, and romantic Seine river vistas.',
      costIndex: 4,
      popularity: 4.95,
      activities: [
        { name: 'Louvre Museum VIP After-Hours', category: 'Culture', cost: 75, durationHours: 3.0, rating: 4.95, description: 'Skip-the-line private access to view the Mona Lisa, Venus de Milo, and Winged Victory with a resident art historian.' },
        { name: 'Sunset Seine Champagne Cruise', category: 'Sightseeing', cost: 65, durationHours: 2.0, rating: 4.9, description: 'Panoramic glass-canopy yacht cruise along the illuminated Eiffel Tower, Notre-Dame, and Pont Alexandre III with sommelier champagne.' },
        { name: 'Montmartre Artisan Pastry Crawl', category: 'Food', cost: 50, durationHours: 2.5, rating: 4.85, description: 'Taste award-winning croissants, delicate macarons, and artisan cheeses through the cobbled artistic alleys of Sacré-Cœur.' },
        { name: 'Palace of Versailles Grand Tour', category: 'Culture', cost: 90, durationHours: 4.5, rating: 4.92, description: 'Explore the shimmering Hall of Mirrors, King’s Grand Apartments, and expansive fountain gardens with golf cart transport.' },
        { name: 'Eiffel Tower Summit Twilight Dinner', category: 'Food', cost: 140, durationHours: 2.5, rating: 4.88, description: 'Gourmet French tasting menu with direct elevator passes to the summit for breathtaking 360-degree city views.' },
      ],
    },
    {
      name: 'Rome',
      country: 'Italy',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      description: 'The Eternal City where millennia of history, ancient amphitheaters, Vatican treasures, and authentic pasta trattorias converge.',
      costIndex: 3,
      popularity: 4.9,
      activities: [
        { name: 'Colosseum Gladiator Arena Floor Access', category: 'Sightseeing', cost: 65, durationHours: 2.5, rating: 4.94, description: 'Walk through the Gladiator Gate onto the reconstructed arena floor and explore the underground hypogeum dungeons.' },
        { name: 'Vatican Museums & Sistine Chapel Early Entry', category: 'Culture', cost: 85, durationHours: 3.5, rating: 4.96, description: 'Experience Michelangelo’s breathtaking fresco ceiling before the general public gates open.' },
        { name: 'Trastevere Sunset Food & Wine Walk', category: 'Food', cost: 55, durationHours: 3.0, rating: 4.9, description: 'Handmade cacio e pepe, crispy supplì, artisanal gelato, and rich Chianti in Rome’s most bohemian neighborhood.' },
        { name: 'Borghese Gallery Masterpiece Tour', category: 'Culture', cost: 45, durationHours: 2.0, rating: 4.82, description: 'Sculptures by Bernini and paintings by Caravaggio set within lush villa gardens.' },
      ],
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      description: 'Island of the Gods featuring lush emerald rice terraces, sacred volcanic water temples, and private clifftop ocean villas.',
      costIndex: 2,
      popularity: 4.92,
      activities: [
        { name: 'Tegallalang Rice Terrace Sunrise Yoga', category: 'Nature', cost: 35, durationHours: 2.0, rating: 4.88, description: 'Serene morning yoga surrounded by terraced valleys followed by the iconic jungle swing photo shoot.' },
        { name: 'Nusa Penida Manta Ray Snorkeling Cruise', category: 'Adventure', cost: 85, durationHours: 6.0, rating: 4.95, description: 'Speedboat cruise to Kelingking T-Rex cliff and snorkeling alongside gentle giant manta rays in Crystal Bay.' },
        { name: 'Uluwatu Sunset Clifftop Kecak Fire Dance', category: 'Culture', cost: 30, durationHours: 2.0, rating: 4.85, description: 'Dramatic coral-cliff amphitheater traditional performance overlooking the Indian Ocean at sunset.' },
        { name: 'Ubud Sacred Monkey Forest & Organic Cooking', category: 'Food', cost: 45, durationHours: 4.0, rating: 4.89, description: 'Visit temple ruins with native macaque monkeys and prepare traditional Balinese sambal and satay with a local chef.' },
      ],
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      description: 'An electrifying metropolis seamlessly blending futuristic neon skylines, historic Shinto shrines, and unparalleled culinary mastery.',
      costIndex: 4,
      popularity: 4.96,
      activities: [
        { name: 'Shibuya Crossing & Secret Izakaya Crawl', category: 'Food', cost: 70, durationHours: 3.0, rating: 4.93, description: 'Experience the world’s busiest pedestrian crossing followed by yakitori and craft sake in lantern-lit alleyways.' },
        { name: 'teamLab Planets Digital Art Immersive', category: 'Culture', cost: 42, durationHours: 2.5, rating: 4.95, description: 'Wade through water and lose yourself in infinite floating floral projections and mirror crystal rooms.' },
        { name: 'Mount Fuji & Lake Kawaguchiko Day Trip', category: 'Nature', cost: 110, durationHours: 8.0, rating: 4.9, description: 'Scenic bullet train ride to panoramic Fuji viewpoints, Chureito Pagoda, and tranquil lakeside hot springs.' },
        { name: 'Tsukiji Outer Market Sushi Masterclass', category: 'Food', cost: 80, durationHours: 2.5, rating: 4.89, description: 'Learn to slice premium otoro tuna and roll sushi under the guidance of a veteran master chef.' },
      ],
    },
    {
      name: 'Kyoto',
      country: 'Japan',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      description: 'The cultural heart of Japan brimming with 10,000 torii gates, bamboo groves, golden Zen pavilions, and Geisha tea ceremonies.',
      costIndex: 3,
      popularity: 4.91,
      activities: [
        { name: 'Fushimi Inari 1,000 Torii Gate Sunrise Trek', category: 'Culture', cost: 25, durationHours: 2.5, rating: 4.96, description: 'Hike through sacred vermilion mountain gates in early morning tranquility.' },
        { name: 'Arashiyama Bamboo Grove & Monkey Park', category: 'Nature', cost: 35, durationHours: 3.0, rating: 4.87, description: 'Walk towering bamboo stalks and cross the Togetsukyo bridge to feed friendly snow monkeys.' },
        { name: 'Traditional Gion Geisha Tea Ceremony', category: 'Culture', cost: 60, durationHours: 1.5, rating: 4.92, description: 'Authentic matcha preparation ritual in a 200-year-old wooden machiya teahouse.' },
      ],
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
      description: 'Vibrant Mediterranean haven of Gaudí architecture, sun-soaked beaches, tapas bars, and the Gothic Quarter.',
      costIndex: 3,
      popularity: 4.88,
      activities: [
        { name: 'Sagrada Família Towers Fast-Track Entry', category: 'Culture', cost: 45, durationHours: 2.0, rating: 4.95, description: 'Marvel at Gaudí’s stained-glass kaleidoscope basilica and ascend the Nativity facade tower.' },
        { name: 'Park Güell Monumental Zone Guided Tour', category: 'Sightseeing', cost: 30, durationHours: 2.0, rating: 4.86, description: 'Mosaic serpent benches and fairy-tale pavilions with sweeping panoramas of Barcelona.' },
        { name: 'El Born Tapas & Sangria Tasting Walk', category: 'Food', cost: 55, durationHours: 2.5, rating: 4.9, description: 'Sample Iberian acorn-fed ham, patatas bravas, and sparkling Catalan Cava in hidden medieval taverns.' },
      ],
    },
    {
      name: 'New York City',
      country: 'United States',
      continent: 'North America',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      description: 'The City That Never Sleeps featuring iconic Manhattan skylines, Broadway productions, Central Park, and world-renowned museums.',
      costIndex: 5,
      popularity: 4.94,
      activities: [
        { name: 'Summit One Vanderbilt Glass Skydeck', category: 'Sightseeing', cost: 52, durationHours: 2.0, rating: 4.92, description: 'Multi-sensory mirrored observation deck towering 1,200 feet above Midtown Manhattan.' },
        { name: 'Central Park Bike & Hidden Bridges Tour', category: 'Nature', cost: 40, durationHours: 2.0, rating: 4.85, description: 'Cycle past Bethesda Fountain, Bow Bridge, and Strawberry Fields with a local historian.' },
        { name: 'Broadway Show Prime Orchestra Seating', category: 'Culture', cost: 135, durationHours: 3.0, rating: 4.96, description: 'World-class theatre production in the dazzling heart of Times Square.' },
      ],
    },
    {
      name: 'Dubai',
      country: 'United Arab Emirates',
      continent: 'Middle East',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      description: 'Futuristic desert oasis boasting towering Burj Khalifa, luxury artificial islands, and sunset desert safaris.',
      costIndex: 4,
      popularity: 4.87,
      activities: [
        { name: 'Burj Khalifa 148th Floor VIP Lounge', category: 'Sightseeing', cost: 95, durationHours: 2.0, rating: 4.91, description: 'Fast-track elevator to the highest observation deck in the world with luxury dates and Arabic coffee.' },
        { name: 'Red Dune Desert Safari & BBQ Camp', category: 'Adventure', cost: 75, durationHours: 6.0, rating: 4.93, description: 'Thrilling 4x4 dune bashing, camel riding, sandboarding, and traditional Tanoura dance dinner under the stars.' },
        { name: 'Dubai Marina Yacht Sunset Cruise', category: 'Sightseeing', cost: 65, durationHours: 2.5, rating: 4.88, description: 'Luxury yacht cruise sailing past Ain Dubai wheel and the iconic Atlantis Palm.' },
      ],
    },
    {
      name: 'Jaipur',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      description: 'The iconic Pink City of Rajasthan, famed for majestic hilltop Amber Fort, honeycomb Hawa Mahal, and royal Rajasthani palace hospitality.',
      costIndex: 2,
      popularity: 4.93,
      activities: [
        { name: 'Amber Fort Private Sunrise Jeep Safari', category: 'Sightseeing', cost: 35, durationHours: 3.5, rating: 4.95, description: 'Ascend the dramatic hilltop fortress of Rajput kings and explore the dazzling Sheesh Mahal mirror palace.' },
        { name: 'Hawa Mahal & City Palace Royal Heritage Walk', category: 'Culture', cost: 25, durationHours: 3.0, rating: 4.91, description: 'Explore the 953 ornate honeycomb windows and the royal courtyards with traditional turban-tying and textile block-printing.' },
        { name: 'Nahargarh Fort Sunset Panorama & Dinner', category: 'Food', cost: 40, durationHours: 2.5, rating: 4.88, description: 'Savor traditional Dal Baati Churma and fiery Laal Maas with sweeping sunset views over the entire illuminated Pink City.' },
        { name: 'Johari Bazaar Gem & Artisan Spice Trail', category: 'Culture', cost: 20, durationHours: 2.0, rating: 4.85, description: 'Bustling bazaar walk for handcrafted Kundan jewelry, blue pottery, and fragrant masala chai.' },
      ],
    },
    {
      name: 'Agra',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      description: 'Home to the magnificent Taj Mahal, one of the Seven Wonders of the World, and the red sandstone fortress of Mughal emperors.',
      costIndex: 2,
      popularity: 4.97,
      activities: [
        { name: 'Taj Mahal Sunrise VIP Guided Experience', category: 'Sightseeing', cost: 40, durationHours: 3.0, rating: 4.98, description: 'Watch the ivory-white marble mausoleum change colors in the golden morning light with priority fast-track entry.' },
        { name: 'Agra Red Fort & Mughal Royal Chambers', category: 'Culture', cost: 25, durationHours: 2.5, rating: 4.9, description: 'Walk the imperial citadel where Shah Jahan spent his final days gazing at the Taj across the Yamuna river.' },
        { name: 'Mehtab Bagh Sunset Reflection Walk', category: 'Nature', cost: 20, durationHours: 2.0, rating: 4.87, description: 'Tranquil charbagh garden across the river offering the most breathtaking postcard reflections of the Taj at twilight.' },
      ],
    },
    {
      name: 'Goa',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      description: 'Tropical coastal paradise blending golden palm-fringed Arabian Sea beaches, Portuguese colonial villas, and vibrant seafood shacks.',
      costIndex: 2,
      popularity: 4.92,
      activities: [
        { name: 'Dudhsagar 4-Tier Waterfall Jungle Trek', category: 'Adventure', cost: 45, durationHours: 5.0, rating: 4.92, description: '4x4 safari through Bhagwan Mahavir Wildlife Sanctuary to swim in emerald natural pools beneath roaring 1,000-foot cascades.' },
        { name: 'Fontainhas Latin Quarter Heritage & Bakery Walk', category: 'Culture', cost: 25, durationHours: 2.0, rating: 4.88, description: 'Wander past vibrant pastel Portuguese mansions, azulejo tiles, and century-old bakeries for warm bebinca and poee.' },
        { name: 'Sunset Catamaran Cruise & Dolphin Spotting', category: 'Sightseeing', cost: 35, durationHours: 2.5, rating: 4.85, description: 'Sail the Mandovi river mouth past historic Fort Aguada lighthouse with tropical cocktails.' },
      ],
    },
    {
      name: 'Varanasi',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      description: 'One of the world’s oldest living cities on the banks of the sacred Ganges river, renowned for spiritual ghats, silk weaving, and evening aarti.',
      costIndex: 1,
      popularity: 4.94,
      activities: [
        { name: 'Dawn Ganges Boat Ride & Ancient Ghats', category: 'Culture', cost: 25, durationHours: 2.5, rating: 4.96, description: 'Row along the misty morning Ganges as pilgrims perform sacred sunrise rituals along Dashashwamedh and Assi Ghats.' },
        { name: 'Grand Ganga Aarti Evening Ceremony from Private Boat', category: 'Culture', cost: 30, durationHours: 2.0, rating: 4.97, description: 'Watch the mesmerizing brass-lamp fire ritual choreographed to rhythmic Vedic chants and bells.' },
        { name: 'Sarnath Buddhist Monasteries & Deer Park', category: 'Culture', cost: 20, durationHours: 3.0, rating: 4.89, description: 'Visit where Gautama Buddha delivered his first sermon and marvel at the 3rd-century BC Ashoka Pillar.' },
      ],
    },
    {
      name: 'Kerala',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      description: 'God’s Own Country, famed for serene palm-shaded backwaters, traditional luxury houseboats, spice plantations, and Ayurvedic wellness.',
      costIndex: 2,
      popularity: 4.93,
      activities: [
        { name: 'Alleppey Private Luxury Houseboat Cruise', category: 'Nature', cost: 85, durationHours: 6.0, rating: 4.96, description: 'Glide through tranquil backwaters on a traditional thatched kettuvallam with fresh Karimeen fish curry cooked onboard.' },
        { name: 'Munnar Emerald Tea Estate Trek & Factory Tasting', category: 'Nature', cost: 35, durationHours: 3.5, rating: 4.91, description: 'Hike through misty rolling tea plantations and learn artisan orthodox tea processing.' },
        { name: 'Fort Kochi Chinese Fishing Nets & Kathakali Show', category: 'Culture', cost: 30, durationHours: 2.5, rating: 4.88, description: 'Watch the cantilevered fishing nets dip at sunset followed by an elaborate classical Kathakali dance drama.' },
      ],
    },
    {
      name: 'Mumbai',
      country: 'India',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
      description: 'The City of Dreams — a dynamic metropolis featuring the Gateway of India, Victorian Gothic architecture, Marine Drive, and street food cuisine.',
      costIndex: 3,
      popularity: 4.9,
      activities: [
        { name: 'Elephanta Island UNESCO Cave Sculptures Cruise', category: 'Sightseeing', cost: 35, durationHours: 4.0, rating: 4.9, description: 'Ferry ride from the Gateway of India to 5th-century rock-cut cave temples dedicated to Lord Shiva.' },
        { name: 'Marine Drive Queen’s Necklace Sunset Walk & Street Food', category: 'Food', cost: 25, durationHours: 2.5, rating: 4.92, description: 'Savor spicy Pav Bhaji, crispy Bhel Puri at Chowpatty Beach, and Irani cafe bun maska with cutting chai.' },
        { name: 'Victorian Gothic Heritage & Crawford Market Tour', category: 'Culture', cost: 30, durationHours: 3.0, rating: 4.87, description: 'Explore Chhatrapati Shivaji Terminus station, Fort heritage district, and historic spice bazaars.' },
      ],
    },
  ];


  const createdCities: any = {};
  for (const cData of citiesData) {
    const { activities, ...cityInfo } = cData;
    const city = await prisma.city.create({
      data: {
        ...cityInfo,
        activities: {
          create: activities,
        },
      },
      include: {
        activities: true,
      },
    });
    createdCities[city.name] = city;
    console.log(`📍 Seeded City: ${city.name} (${city.activities.length} activities)`);
  }

  // 3. Save a few destinations for the demo user
  await prisma.savedDestination.createMany({
    data: [
      { userId: demoUser.id, cityId: createdCities['Paris'].id },
      { userId: demoUser.id, cityId: createdCities['Bali'].id },
      { userId: demoUser.id, cityId: createdCities['Tokyo'].id },
    ],
  });

  // 4. Create Demo Multi-City Trip: "European Grand Odyssey"
  const parisCity = createdCities['Paris'];
  const romeCity = createdCities['Rome'];
  const barcelonaCity = createdCities['Barcelona'];

  const trip1 = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'European Grand Odyssey',
      description: 'A 10-day multi-city journey across Paris, Rome, and Barcelona with private museum access, gourmet tastings, and architectural marvels.',
      coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-20'),
      budget: 4500,
      currency: 'USD',
      shareSlug: 'european-grand-odyssey-2026',
      isPublic: true,
      stops: {
        create: [
          { cityId: parisCity.id, orderIndex: 0, arrivalDate: new Date('2026-10-10'), departureDate: new Date('2026-10-14'), notes: 'Stay at Boutique Hotel Saint-Germain' },
          { cityId: romeCity.id, orderIndex: 1, arrivalDate: new Date('2026-10-14'), departureDate: new Date('2026-10-17'), notes: 'High-speed train from Paris / Piazza Navona Hotel' },
          { cityId: barcelonaCity.id, orderIndex: 2, arrivalDate: new Date('2026-10-17'), departureDate: new Date('2026-10-20'), notes: 'Gothic Quarter boutique stay' },
        ],
      },
    },
    include: {
      stops: true,
    },
  });

  // Fetch stops for linking activities
  const parisStop = trip1.stops.find((s) => s.cityId === parisCity.id)!;
  const romeStop = trip1.stops.find((s) => s.cityId === romeCity.id)!;
  const barcaStop = trip1.stops.find((s) => s.cityId === barcelonaCity.id)!;

  // Add Trip Activities
  await prisma.tripActivity.createMany({
    data: [
      {
        tripId: trip1.id,
        tripStopId: parisStop.id,
        activityId: parisCity.activities[0].id,
        customTitle: 'Louvre Museum VIP After-Hours',
        dayNumber: 1,
        scheduledTime: '10:00',
        estimatedCost: 75,
        category: 'Culture',
        orderIndex: 0,
        notes: 'Meeting private guide at Pyramid entrance',
      },
      {
        tripId: trip1.id,
        tripStopId: parisStop.id,
        activityId: parisCity.activities[1].id,
        customTitle: 'Sunset Seine Champagne Cruise',
        dayNumber: 1,
        scheduledTime: '18:30',
        estimatedCost: 65,
        category: 'Sightseeing',
        orderIndex: 1,
        notes: 'Boarding at Port de la Bourdonnais',
      },
      {
        tripId: trip1.id,
        tripStopId: parisStop.id,
        activityId: parisCity.activities[2].id,
        customTitle: 'Montmartre Artisan Pastry Crawl',
        dayNumber: 2,
        scheduledTime: '09:30',
        estimatedCost: 50,
        category: 'Food',
        orderIndex: 0,
      },
      {
        tripId: trip1.id,
        tripStopId: romeStop.id,
        activityId: romeCity.activities[0].id,
        customTitle: 'Colosseum Gladiator Arena Floor Access',
        dayNumber: 5,
        scheduledTime: '11:00',
        estimatedCost: 65,
        category: 'Sightseeing',
        orderIndex: 0,
      },
      {
        tripId: trip1.id,
        tripStopId: romeStop.id,
        activityId: romeCity.activities[2].id,
        customTitle: 'Trastevere Sunset Food & Wine Walk',
        dayNumber: 6,
        scheduledTime: '17:30',
        estimatedCost: 55,
        category: 'Food',
        orderIndex: 0,
      },
      {
        tripId: trip1.id,
        tripStopId: barcaStop.id,
        activityId: barcelonaCity.activities[0].id,
        customTitle: 'Sagrada Família Towers Fast-Track Entry',
        dayNumber: 8,
        scheduledTime: '10:30',
        estimatedCost: 45,
        category: 'Culture',
        orderIndex: 0,
      },
    ],
  });

  // Add Initial Expenses for Trip 1
  await prisma.expense.createMany({
    data: [
      { tripId: trip1.id, title: 'Saint-Germain Boutique Hotel (4 nights)', category: 'Accommodation', amount: 840, date: new Date('2026-10-10') },
      { tripId: trip1.id, title: 'Flight: London to Paris CDG', category: 'Transport', amount: 180, date: new Date('2026-10-10') },
      { tripId: trip1.id, title: 'Louvre VIP Passes & Seine Cruise', category: 'Activities', amount: 140, date: new Date('2026-10-11') },
      { tripId: trip1.id, title: 'Dinner at Le Comptoir du Relais', category: 'Meals', amount: 165, date: new Date('2026-10-11') },
      { tripId: trip1.id, title: 'Flight: Paris to Rome FCO', category: 'Transport', amount: 110, date: new Date('2026-10-14') },
      { tripId: trip1.id, title: 'Piazza Navona Suite (3 nights)', category: 'Accommodation', amount: 620, date: new Date('2026-10-14') },
    ],
  });

  // 5. Create Second Trip: "Bali Tropical Villa & Sanctuary"
  const baliCity = createdCities['Bali'];
  // 6. Seed PS7 Vendors (Hotels, Transports, Activity Operators)
  console.log('🏨 Seeding PS7 Vendors, Hotels & Transports...');
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Accor Luxury & Boutique Escapes',
      type: 'hotel',
      email: 'partnerships@accor-boutique.com',
      phone: '+33 1 45 67 89 00',
      website: 'https://all.accor.com',
      rating: 4.8,
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'EuroRail & Mediterranean Transit',
      type: 'transport',
      email: 'dispatch@eurorail-med.eu',
      phone: '+39 06 698 1234',
      website: 'https://eurorail-med.eu',
      rating: 4.7,
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=200&q=80',
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      name: 'AeroConnect Global Charters',
      type: 'transport',
      email: 'ops@aeroconnect.com',
      phone: '+44 20 7946 0991',
      website: 'https://aeroconnect.com',
      rating: 4.9,
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    },
  });

  const vendor4 = await prisma.vendor.create({
    data: {
      name: 'Heritage Voyages & Expeditions',
      type: 'mixed',
      email: 'concierge@heritagevoyages.com',
      phone: '+1 212 555 0199',
      website: 'https://heritagevoyages.com',
      rating: 4.95,
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
    },
  });

  // Seed Hotels across cities
  const hotelParis = await prisma.hotel.create({
    data: {
      name: 'Hôtel Saint-Germain Des Prés Luxury Suites',
      cityId: parisCity.id,
      vendorId: vendor1.id,
      starRating: 5,
      pricePerNight: 240,
      amenities: ['WiFi', 'Breakfast', 'Spa', 'Concierge', 'Airport Shuttle', 'Air Conditioning'],
      address: '42 Rue Bonaparte, 75006 Paris, France',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      description: 'Elegant Parisian boutique suite located in the chic 6th arrondissement steps from Boulevard Saint-Germain and the Louvre.',
      latitude: 48.8540,
      longitude: 2.3331,
      isAvailable: true,
    },
  });

  const hotelRome = await prisma.hotel.create({
    data: {
      name: 'Palazzo Navona Heritage Residence',
      cityId: romeCity.id,
      vendorId: vendor1.id,
      starRating: 4,
      pricePerNight: 195,
      amenities: ['WiFi', 'Rooftop Bar', 'Breakfast', 'Historic Courtyard'],
      address: 'Largo Sapienza 8, 00186 Rome, Italy',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: 'Modern luxury embedded within 16th-century architecture overlooking Piazza Navona.',
      latitude: 41.8992,
      longitude: 12.4731,
      isAvailable: true,
    },
  });

  const hotelBarcelona = await prisma.hotel.create({
    data: {
      name: 'Grand Hotel Central Gothic Haven',
      cityId: createdCities['Barcelona'].id,
      vendorId: vendor4.id,
      starRating: 5,
      pricePerNight: 210,
      amenities: ['Infinity Pool', 'WiFi', 'Rooftop Lounge', 'Michelin Tapas'],
      address: 'Via Laietana 30, 08003 Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      description: 'Infinity rooftop swimming pool with majestic vistas over the historic Gothic quarter.',
      latitude: 41.3851,
      longitude: 2.1784,
      isAvailable: true,
    },
  });

  const hotelBali = await prisma.hotel.create({
    data: {
      name: 'Uluwatu Clifftop Ocean Villas',
      cityId: baliCity.id,
      vendorId: vendor4.id,
      starRating: 5,
      pricePerNight: 320,
      amenities: ['Private Pool', 'Ocean View', 'Floating Breakfast', 'Spa Pavilions', 'Butler Service'],
      address: 'Jl. Pantai Suluban, Uluwatu, Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      description: 'Private infinity villas suspended 150m above the turquoise Indian Ocean reef breaks.',
      latitude: -8.8149,
      longitude: 115.0884,
      isAvailable: true,
    },
  });

  // Seed Transports
  const transport1 = await prisma.transport.create({
    data: {
      type: 'flight',
      operatorName: 'Air France AF1404',
      vendorId: vendor3.id,
      fromCityId: parisCity.id,
      toCityId: romeCity.id,
      price: 135,
      departureTime: '11:15',
      arrivalTime: '13:20',
      durationHours: 2.1,
      isAvailable: true,
    },
  });

  const transport2 = await prisma.transport.create({
    data: {
      type: 'train',
      operatorName: 'Frecciarossa 1000 High-Speed',
      vendorId: vendor2.id,
      fromCityId: romeCity.id,
      toCityId: createdCities['Barcelona'].id,
      price: 95,
      departureTime: '08:45',
      arrivalTime: '16:30',
      durationHours: 7.75,
      isAvailable: true,
    },
  });

  // Link hotel to Paris stop and Rome stop
  await prisma.tripStop.update({
    where: { id: parisStop.id },
    data: { hotelId: hotelParis.id, transportToNextId: transport1.id },
  });
  await prisma.tripStop.update({
    where: { id: romeStop.id },
    data: { hotelId: hotelRome.id, transportToNextId: transport2.id },
  });
  await prisma.tripStop.update({
    where: { id: barcaStop.id },
    data: { hotelId: hotelBarcelona.id },
  });

  // 7. Seed Bookings & Payments for Trip 1
  console.log('💳 Seeding sample Bookings & Payments...');
  const booking1 = await prisma.booking.create({
    data: {
      tripId: trip1.id,
      userId: demoUser.id,
      vendorId: vendor1.id,
      hotelId: hotelParis.id,
      bookingType: 'hotel',
      status: 'CONFIRMED',
      totalPrice: 960,
      checkIn: new Date('2026-10-10'),
      checkOut: new Date('2026-10-14'),
      guestsCount: 2,
      specialRequests: 'High floor, Eiffel Tower view preferred.',
      confirmationCode: 'ACCOR-PA-78921',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 960,
      method: 'card',
      status: 'PAID',
      transactionId: 'TXN-STRIPE-98234710',
      paidAt: new Date(),
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      tripId: trip1.id,
      userId: demoUser.id,
      vendorId: vendor3.id,
      transportId: transport1.id,
      bookingType: 'transport',
      status: 'CONFIRMED',
      totalPrice: 270,
      guestsCount: 2,
      specialRequests: 'Window seats booked together.',
      confirmationCode: 'AF-ROM-44120',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      amount: 270,
      method: 'card',
      status: 'PAID',
      transactionId: 'TXN-STRIPE-98234711',
      paidAt: new Date(),
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      tripId: trip1.id,
      userId: demoUser.id,
      vendorId: vendor1.id,
      hotelId: hotelRome.id,
      bookingType: 'hotel',
      status: 'PENDING',
      totalPrice: 585,
      checkIn: new Date('2026-10-14'),
      checkOut: new Date('2026-10-17'),
      guestsCount: 2,
      specialRequests: 'Late check-in requested (19:00).',
      confirmationCode: 'ACCOR-RM-55112',
    },
  });

  // 8. Seed Tour Group & Members
  console.log('👥 Seeding Tour Group & Members...');
  const tourGroup = await prisma.tourGroup.create({
    data: {
      name: 'Autumn European Odyssey - VIP Cohort 01',
      tripId: trip1.id,
      coordinatorId: coordinatorUser.id,
      maxSize: 14,
      status: 'active',
      members: {
        create: [
          { userId: demoUser.id, role: 'lead' },
          { userId: operatorUser.id, role: 'operator' },
        ],
      },
    },
  });

  // 9. Seed Dynamic Itinerary Change Event
  console.log('⚡ Seeding Dynamic Itinerary Changes...');
  await prisma.itineraryChange.create({
    data: {
      tripId: trip1.id,
      changeType: 'weather',
      description: 'Heavy rain forecasted for Day 2 Paris afternoon. Swapped Seine Outdoor Cruise with Louvre Museum indoor gallery visit.',
      oldValue: 'Seine Champagne Sunset Cruise at 15:00',
      newValue: 'Louvre After-Hours Wing Tour at 14:30',
      reason: 'Thunderstorm warning issued by Météo-France.',
      impact: JSON.stringify({ costDifference: 10, scheduleShiftHours: 1.5, affectedAttendees: 2 }),
      status: 'auto_applied',
      initiatedBy: operatorUser.id,
      resolvedBy: coordinatorUser.id,
      resolvedAt: new Date(),
    },
  });

  await prisma.itineraryChange.create({
    data: {
      tripId: trip1.id,
      changeType: 'reschedule',
      description: 'Colosseum underground tour slot shifted 30 minutes earlier due to state dignitary visitation.',
      oldValue: '11:00 AM',
      newValue: '10:30 AM',
      reason: 'Archaeological park scheduled maintenance notice.',
      impact: JSON.stringify({ costDifference: 0, scheduleShiftHours: -0.5 }),
      status: 'pending',
      initiatedBy: coordinatorUser.id,
    },
  });

  // 10. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'booking',
        title: 'Booking Confirmed!',
        message: 'Your stay at Hôtel Saint-Germain Des Prés Luxury Suites is confirmed (Ref: ACCOR-PA-78921).',
        isRead: false,
        actionUrl: '/bookings',
      },
      {
        userId: demoUser.id,
        type: 'change',
        title: 'Itinerary Weather Adjustment',
        message: 'Weather update: Day 2 Paris schedule optimized to avoid afternoon showers.',
        isRead: false,
        actionUrl: `/trips/${trip1.id}/itinerary`,
      },
      {
        userId: operatorUser.id,
        type: 'booking',
        title: 'New Booking Request',
        message: 'Traveler Faiz Khan booked Palazzo Navona Heritage Residence (Pending confirmation).',
        isRead: false,
        actionUrl: '/operator/bookings',
      },
    ],
  });

  // 11. Seed Traveler Preference for demoUser
  await prisma.travelerPreference.create({
    data: {
      userId: demoUser.id,
      travelStyles: ['cultural', 'luxury', 'foodie'],
      accommodationType: 'hotel',
      budgetRange: 'luxury',
      dietaryRequirements: 'Vegetarian friendly, loves local wines',
      mobilityNeeds: 'None',
      preferredTransport: ['flight', 'train'],
      interests: ['history', 'food', 'art', 'architecture'],
      climatePreference: 'temperate',
    },
  });

  // 12. Seed Trip Review
  await prisma.review.create({
    data: {
      tripId: trip1.id,
      userId: demoUser.id,
      rating: 5,
      comment: 'An absolute dream of an itinerary! The private Louvre guide and clifftop sunset in Rome were unforgettable. The operator coordination was flawless.',
      photos: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      ],
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('📊 Seed Summary:');
  console.log(`- 4 Demo Users (Traveler, Operator, Coordinator, Admin) - password: password123`);
  console.log(`- ${Object.keys(createdCities).length} Global Cities with 30+ Activities`);
  console.log(`- 4 Verified Vendors, 4 Luxury/Boutique Hotels, 2 Inter-City Transports`);
  console.log(`- 3 Bookings with 2 Stripe Payments`);
  console.log(`- 1 Active Tour Group with Coordinator & Lead Member`);
  console.log(`- 2 Itinerary Changes (1 auto-applied weather swap, 1 pending)`);
  console.log(`- Notifications, Traveler Preferences, and Trip Reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
