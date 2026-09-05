import { 
  AuthUser, CityModel, ActivityModel, TripModel, BudgetStats, UserAnalytics, PackingItemModel,
  HotelModel, TransportModel, VendorModel, BookingModel, PaymentModel,
  TourGroupModel, ItineraryChangeModel, NotificationModel, ReviewModel,
  TravelerPreferenceModel, OperatorDashboard
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tripweave_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    signup: (data: { email: string; password: string; name: string; currency?: string }) =>
      request<{ token: string; user: AuthUser; message: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: AuthUser; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string; debugLink?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (data: { token: string; email: string; newPassword: string }) =>
      request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getProfile: () =>
      request<{ user: AuthUser }>('/users/profile'),
    updateProfile: (data: Partial<AuthUser>) =>
      request<{ message: string; user: AuthUser }>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Trips
  trips: {
    list: () =>
      request<{ trips: TripModel[] }>('/trips'),
    create: (data: {
      title: string;
      description?: string;
      coverImage?: string;
      startDate: string;
      endDate: string;
      budget?: number;
      currency?: string;
      cityIds?: string[];
    }) =>
      request<{ message: string; trip: TripModel }>('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (id: string) =>
      request<{ trip: TripModel }>(`/trips/${id}`),
    update: (id: string, data: Partial<TripModel>) =>
      request<{ message: string; trip: TripModel }>(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/trips/${id}`, {
        method: 'DELETE',
      }),
    complete: (id: string) =>
      request<{ message: string; trip: TripModel; summary: any }>(`/trips/${id}/complete`, {
        method: 'PUT',
      }),
    exportCsvUrl: (id: string) => {
      const token = localStorage.getItem('tripweave_token');
      return `/api/trips/${id}/export-csv${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    },
    downloadTripCsv: async (id: string, title?: string) => {
      const token = localStorage.getItem('tripweave_token');
      const response = await fetch(`/api/trips/${id}/export-csv`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to download itinerary CSV');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanTitle = (title || 'trip').toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${cleanTitle}_itinerary.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  },

  // Stops
  stops: {
    add: (tripId: string, data: { cityId: string; arrivalDate?: string; departureDate?: string; notes?: string }) =>
      request<{ message: string; stop: any }>(`/trips/${tripId}/stops`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    reorder: (tripId: string, stops: { stopId: string; orderIndex: number }[]) =>
      request<{ message: string; stops: any[] }>(`/trips/${tripId}/stops/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ stops }),
      }),
    remove: (tripId: string, stopId: string) =>
      request<{ message: string }>(`/trips/${tripId}/stops/${stopId}`, {
        method: 'DELETE',
      }),
    update: (tripId: string, stopId: string, data: { hotelId?: string | null; transportToNextId?: string | null; arrivalDate?: string; departureDate?: string; notes?: string }) =>
      request<{ message: string; stop: any }>(`/trips/${tripId}/stops/${stopId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Activities & Itinerary
  activities: {
    list: (params?: { cityId?: string; category?: string; maxCost?: number; search?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ activities: ActivityModel[] }>(`/activities${q ? `?${q}` : ''}`);
    },
    addToTrip: (tripId: string, data: {
      activityId?: string;
      tripStopId?: string;
      customTitle?: string;
      dayNumber: number;
      scheduledTime?: string;
      estimatedCost?: number;
      category?: string;
      notes?: string;
    }) =>
      request<{ message: string; tripActivity: any }>(`/trips/${tripId}/activities`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateInTrip: (tripId: string, activityId: string, data: any) =>
      request<{ message: string; tripActivity: any }>(`/trips/${tripId}/activities/${activityId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    reorderInTrip: (tripId: string, activities: { id: string; dayNumber?: number; orderIndex?: number }[]) =>
      request<{ message: string }>(`/trips/${tripId}/activities/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ activities }),
      }),
    removeFromTrip: (tripId: string, activityId: string) =>
      request<{ message: string }>(`/trips/${tripId}/activities/${activityId}`, {
        method: 'DELETE',
      }),
  },

  // Budget & Expenses
  budget: {
    getStats: (tripId: string) =>
      request<BudgetStats>(`/trips/${tripId}/expenses`),
    addExpense: (tripId: string, data: {
      title: string;
      category: string;
      amount: number;
      date?: string;
      notes?: string;
      attachmentUrl?: string | null;
      attachmentName?: string | null;
    }) =>
      request<{ message: string; expense: any }>(`/trips/${tripId}/expenses`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    deleteExpense: (tripId: string, expenseId: string) =>
      request<{ message: string }>(`/trips/${tripId}/expenses/${expenseId}`, {
        method: 'DELETE',
      }),
  },

  // AI Itinerary Assistant
  ai: {
    suggest: (tripId: string) =>
      request<{
        tripTitle: string;
        durationDays: number;
        totalSuggested: number;
        suggestions: Array<{
          dayNumber: number;
          scheduledTime: string;
          title: string;
          category: string;
          estimatedCost: number;
          cityName: string;
          tripStopId?: string;
          activityId?: string;
          reason: string;
        }>;
      }>(`/trips/${tripId}/ai-suggest`),
    apply: (tripId: string, suggestions: any[]) =>
      request<{ message: string; count: number }>(`/trips/${tripId}/ai-apply`, {
        method: 'POST',
        body: JSON.stringify({ suggestions }),
      }),
    chat: (data: { tripId?: string; messages: { role: 'user' | 'assistant'; content: string }[]; userMessage: string }) =>
      request<{ reply: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Cities
  cities: {
    list: (params?: { country?: string; continent?: string; search?: string; minCost?: number; maxCost?: number }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ cities: CityModel[] }>(`/cities${q ? `?${q}` : ''}`);
    },
    get: (id: string) =>
      request<{ city: CityModel }>(`/cities/${id}`),
    toggleSave: (cityId: string) =>
      request<{ message: string; isSaved: boolean }>(`/cities/${cityId}/save`, {
        method: 'POST',
      }),
  },

  // Search
  search: (params: { q?: string; category?: string; continent?: string; maxCost?: number }) => {
    const filtered = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));
    const q = new URLSearchParams(filtered as any).toString();
    return request<{ query: string; resultsCount: number; cities: CityModel[]; activities: ActivityModel[] }>(
      `/search${q ? `?${q}` : ''}`
    );
  },

  // Analytics
  analytics: {
    getUserStats: () =>
      request<UserAnalytics>('/analytics'),
  },

  // Public Share & Copy
  share: {
    getPublicTrip: (shareSlug: string) =>
      request<{ trip: TripModel }>(`/share/${shareSlug}`),
    copyTrip: (shareSlug: string) =>
      request<{ message: string; tripId: string }>(`/share/${shareSlug}/copy`, {
        method: 'POST',
      }),
  },

  // Admin Telemetry
  admin: {
    getTelemetry: () =>
      request<{
        summary: {
          totalUsers: number;
          totalTrips: number;
          totalDestinations: number;
          totalActivities: number;
          totalExpensesSum: number;
          totalExpensesCount: number;
        };
        currentUserId: string;
        users: any[];
        trips: any[];
        topDestinations: any[];
        categoryAdoption: any[];
        platformGrowth: any[];
      }>('/admin/telemetry'),
  },

  // Packing Checklist
  packing: {
    list: (tripId: string) =>
      request<{ items: PackingItemModel[] }>(`/trips/${tripId}/packing`),
    create: (tripId: string, data: { label: string; category: string }) =>
      request<{ item: PackingItemModel }>(`/trips/${tripId}/packing`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (tripId: string, itemId: string, data: { isPacked?: boolean; label?: string; category?: string }) =>
      request<{ updated: number }>(`/trips/${tripId}/packing/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (tripId: string, itemId: string) =>
      request<{ success: boolean }>(`/trips/${tripId}/packing/${itemId}`, {
        method: 'DELETE',
      }),
    applyTemplate: (tripId: string) =>
      request<{ items: PackingItemModel[]; message: string }>(`/trips/${tripId}/packing/template`, {
        method: 'POST',
      }),
  },

  // ── PS7: Hotels ──────────────────────────────────────────────────────────
  hotels: {
    list: (params?: { cityId?: string; minPrice?: number; maxPrice?: number; minStars?: number; search?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ hotels: HotelModel[] }>(`/hotels${q ? `?${q}` : ''}`);
    },
    get: (id: string) => request<{ hotel: HotelModel }>(`/hotels/${id}`),
    create: (data: Partial<HotelModel>) =>
      request<{ message: string; hotel: HotelModel }>('/hotels', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<HotelModel>) =>
      request<{ message: string; hotel: HotelModel }>(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/hotels/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Transport ───────────────────────────────────────────────────────
  transport: {
    list: (params?: { fromCityId?: string; toCityId?: string; type?: string; maxPrice?: number }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ transports: TransportModel[] }>(`/transport${q ? `?${q}` : ''}`);
    },
    get: (id: string) => request<{ transport: TransportModel }>(`/transport/${id}`),
    create: (data: Partial<TransportModel>) =>
      request<{ message: string; transport: TransportModel }>('/transport', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TransportModel>) =>
      request<{ message: string; transport: TransportModel }>(`/transport/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/transport/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Vendors ─────────────────────────────────────────────────────────
  vendors: {
    list: (params?: { type?: string; search?: string; verified?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ vendors: VendorModel[] }>(`/vendors${q ? `?${q}` : ''}`);
    },
    get: (id: string) => request<{ vendor: VendorModel }>(`/vendors/${id}`),
    create: (data: Partial<VendorModel>) =>
      request<{ message: string; vendor: VendorModel }>('/vendors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<VendorModel>) =>
      request<{ message: string; vendor: VendorModel }>(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/vendors/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Bookings ────────────────────────────────────────────────────────
  bookings: {
    list: (params?: { tripId?: string; status?: string; bookingType?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ bookings: BookingModel[] }>(`/bookings${q ? `?${q}` : ''}`);
    },
    get: (id: string) => request<{ booking: BookingModel }>(`/bookings/${id}`),
    create: (data: { tripId: string; bookingType: string; hotelId?: string; transportId?: string; activityId?: string; vendorId?: string; totalPrice: number; checkIn?: string; checkOut?: string; guestsCount?: number; specialRequests?: string }) =>
      request<{ message: string; booking: BookingModel }>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<{ message: string; booking: BookingModel }>(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id: string) =>
      request<{ message: string }>(`/bookings/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Payments ────────────────────────────────────────────────────────
  payments: {
    list: (params?: { bookingId?: string; status?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ payments: PaymentModel[] }>(`/payments${q ? `?${q}` : ''}`);
    },
    create: (data: { bookingId: string; amount: number; method?: string }) =>
      request<{ message: string; payment: PaymentModel }>('/payments', { method: 'POST', body: JSON.stringify(data) }),
    refund: (id: string) =>
      request<{ message: string; payment: PaymentModel }>(`/payments/${id}/refund`, { method: 'PUT' }),
  },

  // ── PS7: Tour Groups ─────────────────────────────────────────────────────
  tourGroups: {
    list: (params?: { tripId?: string; status?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ groups: TourGroupModel[] }>(`/tour-groups${q ? `?${q}` : ''}`);
    },
    create: (data: { name: string; tripId: string; coordinatorId?: string; maxSize?: number }) =>
      request<{ message: string; group: TourGroupModel }>('/tour-groups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TourGroupModel>) =>
      request<{ message: string; group: TourGroupModel }>(`/tour-groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/tour-groups/${id}`, { method: 'DELETE' }),
    addMember: (groupId: string, data: { userId: string; role?: string }) =>
      request<{ message: string; member: any }>(`/tour-groups/${groupId}/members`, { method: 'POST', body: JSON.stringify(data) }),
    removeMember: (groupId: string, memberId: string) =>
      request<{ message: string }>(`/tour-groups/${groupId}/members/${memberId}`, { method: 'DELETE' }),
  },

  // ── PS7: Itinerary Changes ───────────────────────────────────────────────
  changes: {
    list: (params?: { tripId?: string; status?: string; changeType?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ changes: ItineraryChangeModel[] }>(`/changes${q ? `?${q}` : ''}`);
    },
    create: (data: { tripId: string; changeType: string; description: string; oldValue?: string; newValue?: string; reason?: string }) =>
      request<{ message: string; change: ItineraryChangeModel }>('/changes', { method: 'POST', body: JSON.stringify(data) }),
    resolve: (id: string, status: 'approved' | 'rejected') =>
      request<{ message: string; change: ItineraryChangeModel }>(`/changes/${id}/resolve`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },

  // ── PS7: Notifications ───────────────────────────────────────────────────
  notifications: {
    list: (unreadOnly?: boolean) =>
      request<{ notifications: NotificationModel[]; unreadCount: number }>(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`),
    markAsRead: (id: string) =>
      request<{ message: string }>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () =>
      request<{ message: string }>('/notifications/read-all', { method: 'PUT' }),
    delete: (id: string) =>
      request<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Reviews ─────────────────────────────────────────────────────────
  reviews: {
    list: (params?: { tripId?: string; userId?: string }) => {
      const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''));
      const q = new URLSearchParams(filtered as any).toString();
      return request<{ reviews: ReviewModel[] }>(`/reviews${q ? `?${q}` : ''}`);
    },
    create: (data: { tripId: string; rating: number; comment?: string; photos?: string[] }) =>
      request<{ message: string; review: ReviewModel }>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/reviews/${id}`, { method: 'DELETE' }),
  },

  // ── PS7: Traveler Preferences ────────────────────────────────────────────
  preferences: {
    get: () => request<{ preferences: TravelerPreferenceModel }>('/preferences'),
    save: (data: Partial<TravelerPreferenceModel>) =>
      request<{ message: string; preferences: TravelerPreferenceModel }>('/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // ── PS7: Operator Dashboard & Management ────────────────────────────────
  operator: {
    getDashboard: () => request<OperatorDashboard>('/operator/dashboard'),
    getCoordinators: () => request<{ coordinators: any[] }>('/operator/coordinators'),
    assignCoordinator: (data: { groupId: string; coordinatorId: string | null }) =>
      request<{ message: string; group: TourGroupModel }>('/operator/assign-coordinator', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getSchedule: () => request<{ schedule: TripModel[] }>('/operator/schedule'),
  },
};
