// Legacy Tour Types for Landing Components
export interface Tour {
  id: string;
  title: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';
  image: string;
  price: number;
  durationDays: number;
  hotelCount: number | string;
  rating: number;
  reviewsCount: number;
  partnerDiscount?: boolean;
  description: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  included: string[];
  departureDates: string[];
  bgAccent?: 'lavender' | 'light' | 'peach' | 'sage';
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  location: string;
  rating: number;
  date: string;
  tourName: string;
  tourId: string;
  comment: string;
  verified: boolean;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  country: string;
  departureDate: string;
  guestsCount: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Completed';
  bookingRef: string;
  createdAt: string;
}

export interface OnboardingPreferences {
  travelStyle: string[];
  climateVibe: string[];
  duration: string;
  budget: string;
  groupType: string;
}

// ----------------------------------------------------
// FULL-STACK TRIPWEAVE APPLICATION MODELS (PERN)
// ----------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  currency?: string;
  budgetAlerts?: boolean;
  role?: 'TRAVELER' | 'OPERATOR' | 'COORDINATOR' | 'ADMIN';
  phone?: string | null;
  savedDestinations?: {
    id: string;
    cityId: string;
    city: CityModel;
  }[];
}

export interface CityModel {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  description: string;
  costIndex: number;
  popularity: number;
  activities?: ActivityModel[];
  _count?: {
    activities: number;
  };
}

export interface ActivityModel {
  id: string;
  cityId: string;
  name: string;
  category: string;
  cost: number;
  durationHours: number;
  image?: string | null;
  description?: string | null;
  rating: number;
  city?: CityModel;
}

export interface TripStopModel {
  id: string;
  tripId: string;
  cityId: string;
  orderIndex: number;
  arrivalDate?: string | null;
  departureDate?: string | null;
  notes?: string | null;
  city: CityModel;
  hotelId?: string | null;
  transportToNextId?: string | null;
  hotel?: HotelModel | null;
  transportToNext?: TransportModel | null;
}

export interface TripActivityModel {
  id: string;
  tripId: string;
  tripStopId?: string | null;
  activityId?: string | null;
  customTitle?: string | null;
  dayNumber: number;
  scheduledTime?: string | null;
  estimatedCost: number;
  category: string;
  orderIndex: number;
  notes?: string | null;
  isCompleted: boolean;
  activity?: ActivityModel | null;
  tripStop?: TripStopModel | null;
}

export interface ExpenseModel {
  id: string;
  tripId: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
}

export interface AiItinerarySuggestion {
  dayNumber: number;
  scheduledTime: string;
  title: string;
  category: string;
  estimatedCost: number;
  cityName: string;
  tripStopId?: string;
  activityId?: string;
  reason: string;
}

export interface PackingItemModel {
  id: string;
  tripId: string;
  label: string;
  category: string;
  isPacked: boolean;
  createdAt: string;
}

export interface TripModel {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  startDate: string;
  endDate: string;
  durationDays: number;
  budget: number;
  currency: string;
  shareSlug: string;
  isPublic: boolean;
  totalSpent: number;
  remainingBudget: number;
  stopsCount?: number;
  activitiesCount?: number;
  cities?: string[];
  stops: TripStopModel[];
  tripActivities?: TripActivityModel[];
  expenses?: ExpenseModel[];
  user?: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentUsed: number;
  isOverBudget: boolean;
  durationDays: number;
  dailyAverageSpent: number;
  remainingDailyAllowance: number;
  highestSpendingDay?: { date: string; amount: number } | null;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  spendingTrend: {
    date: string;
    amount: number;
  }[];
  expenses: ExpenseModel[];
}

export interface UserAnalytics {
  totalTrips: number;
  uniqueCitiesPlanned: number;
  uniqueCountriesPlanned: number;
  totalTravelDays: number;
  averageTripDuration: number;
  totalEstimatedBudget: number;
  totalSpent: number;
  averageSpendingPerTrip: number;
  spendingByCategory: { category: string; amount: number }[];
  activitiesByCategory: { category: string; count: number }[];
  tripComparison: { name: string; budget: number; spent: number }[];
}

// User interface for landing page compatibility
export interface User extends AuthUser {
  avatar?: string;
  savedTourIds: string[];
  bookings: Booking[];
  preferences?: OnboardingPreferences;
}

// ----------------------------------------------------
// PS7: NEW MODEL INTERFACES
// ----------------------------------------------------

export type TripStatusType = 'DRAFT' | 'PLANNING' | 'BOOKED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type BookingStatusType = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type UserRoleType = 'TRAVELER' | 'OPERATOR' | 'COORDINATOR' | 'ADMIN';

export interface HotelModel {
  id: string;
  name: string;
  cityId: string;
  vendorId?: string | null;
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  address?: string | null;
  image?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isAvailable: boolean;
  city?: CityModel;
  vendor?: VendorModel | null;
}

export interface TransportModel {
  id: string;
  type: string; // flight, bus, train, car_rental
  operatorName: string;
  vendorId?: string | null;
  fromCityId: string;
  toCityId: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  durationHours: number;
  isAvailable: boolean;
  fromCity?: CityModel;
  toCity?: CityModel;
  vendor?: VendorModel | null;
}

export interface VendorModel {
  id: string;
  name: string;
  type: string; // hotel, transport, activity, mixed
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  rating: number;
  isVerified: boolean;
  logo?: string | null;
  _count?: {
    hotels: number;
    transports: number;
    activities: number;
    bookings: number;
  };
}

export interface BookingModel {
  id: string;
  tripId: string;
  userId: string;
  vendorId?: string | null;
  bookingType: string; // hotel, transport, activity
  status: BookingStatusType;
  totalPrice: number;
  checkIn?: string | null;
  checkOut?: string | null;
  guestsCount: number;
  specialRequests?: string | null;
  confirmationCode?: string | null;
  hotelId?: string | null;
  transportId?: string | null;
  activityId?: string | null;
  createdAt: string;
  trip?: { title: string; startDate: string; endDate: string };
  user?: { name: string; email: string };
  vendor?: { name: string } | null;
  hotel?: HotelModel | null;
  transport?: TransportModel | null;
  payments?: PaymentModel[];
}

export interface PaymentModel {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: PaymentStatusType;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface TourGroupModel {
  id: string;
  name: string;
  tripId: string;
  coordinatorId?: string | null;
  maxSize: number;
  status: string;
  trip?: { title: string; startDate: string; endDate: string };
  coordinator?: { id: string; name: string; email: string; avatarUrl?: string | null } | null;
  members?: TourGroupMemberModel[];
}

export interface TourGroupMemberModel {
  id: string;
  tourGroupId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: { id: string; name: string; email: string; avatarUrl?: string | null };
}

export interface ItineraryChangeModel {
  id: string;
  tripId: string;
  changeType: string; // cancellation, reschedule, substitute, weather, vendor_unavailable
  description: string;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
  impact?: string | null; // JSON string
  status: string; // pending, approved, rejected, auto_applied
  initiatedBy: string;
  resolvedBy?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  trip?: { title: string };
  initiator?: { name: string; email: string; role: string };
}

export interface NotificationModel {
  id: string;
  userId: string;
  type: string; // booking, change, weather, payment, system, coordinator
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

export interface ReviewModel {
  id: string;
  tripId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  photos: string[];
  createdAt: string;
  trip?: { title: string; coverImage?: string | null };
  user?: { name: string; avatarUrl?: string | null };
}

export interface TravelerPreferenceModel {
  userId: string;
  travelStyles: string[];
  accommodationType?: string | null;
  budgetRange?: string | null;
  dietaryRequirements?: string | null;
  mobilityNeeds?: string | null;
  preferredTransport: string[];
  interests: string[];
  climatePreference?: string | null;
}

export interface OperatorDashboard {
  summary: {
    activeTripsCount: number;
    pendingBookingsCount: number;
    pendingChangesCount: number;
    totalRevenue: number;
    totalBookings: number;
    totalVendors: number;
    totalGroups: number;
    totalTravelers: number;
  };
  activeTrips: any[];
  pendingBookings: BookingModel[];
  pendingChanges: ItineraryChangeModel[];
}
