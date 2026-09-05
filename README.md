# 🌐 Tripweave — Dual-Sided Personalized Dynamic Tour Planning & Operations Platform

> **Problem Statement (PS7)**: Personalized Dynamic Tour Planning and Operations Platform.
> Bridging travelers seeking bespoke journeys with tour operators needing real-time fleet, hotel, guide, and disruption management.

Tripweave is an enterprise-grade full-stack **PERN** web application (PostgreSQL, Express.js, React 19, Node.js + TypeScript & Tailwind CSS) designed for end-to-end multi-city travel orchestration. It supports dual role workflows: **Traveler Experience** and **Admin / Tour Operations Command Center**.

---

## 🚀 Key Innovations & Capabilities

## 🚀 Comprehensive Architecture & Capabilities (Phases 1–6)

### 1. 🎛️ Dual-Sided Role & Operations Architecture (Phases 1 & 2)
- **4 Role Hierarchies**: `TRAVELER`, `OPERATOR`, `COORDINATOR`, and `ADMIN` with granular JWT claims and route guards.
- **Tour Operator Command Hub (`/app/operator`)**:
  - Live KPI metric cards (Active departures, occupancy rates, pending bookings, revenue settled).
  - Booking & Inventory Management (`/app/operator/bookings`) with 1-click confirmation or cancellation.
  - Supplier & Vendor directory (`/app/operator/vendors`) for hotel chains, airlines, rail lines, and local guides.
  - Tour Cohorts & Groups (`/app/operator/tour-groups`) tracking capacities and participant manifests.
  - Field Coordinator Roster (`/app/operator/coordinators`) for dispatching ground guides.
  - Stripe Financial Ledger (`/app/operator/payments`) auditing payment transactions and refunds.

### 2. 🧳 Traveler Enhancements & Booking Flow (Phase 3)
- **Onboarding Preference Engine**: Syncs traveler styles, dietary requirements, and mobility needs to database profiles.
- **Stop Logistics Comparison Drawer (`HotelTransportSelectorModal.tsx`)**: Side-by-side accommodation and transit selection with live pricing.
- **Multi-Step Booking Checkout Wizard (`BookingWizardModal.tsx`)**: 4-step flow covering package review, guest details, Stripe payment simulation, and digital voucher pass issuance.
- **Traveler Bookings Hub (`/app/bookings`)**: Centralized dashboard for tickets, QR confirmation codes, check-in timelines, and self-service cancellations.

### 3. ⚡ Dynamic Disruption Engine & AI Concierge (Phase 4)
- **Dynamic Cascading Impact Engine**: Server-side calculation of schedule shifts, budget variance, and ranked alternatives when transit slips or weather strikes.
- **Weather-Aware Rerouting (`WeatherDisruptionAlert.tsx`)**: Automated rain detection with 1-click indoor activity auto-substitution.
- **Real-Time Notification System**: Notification bell in topbar with unread count and direct actionable deep links.
- **Curated Travel Concierge (`curatedTravelEngine.ts` + `AiChatWidget.tsx`)**: 100% reliable, zero-latency travel Q&A engine with 1-click prompt pills for dining, budget trajectory, weather advisories, delayed transit protocols, and local customs.
- **Disruption Scenario Simulator (`ChangeSimulationModal.tsx`)**: Interactive audit view displaying severity levels, cascade impacts, and alternative substitutions.

### 4. 🌟 Trip Review & Completion Lifecycle (Phase 5)
- **Trip Completion Workflow**: Mark journeys as complete (`PUT /api/trips/:id/complete`) with congratulatory notification triggers and summary memory stats.
- **Verified Review Modal (`TripReviewModal.tsx`)**: 1–5 star ratings, compliment highlight tags, photo attachments, and traveler testimonials.
- **Community Review Showcase**: Displays verified traveler ratings directly on itinerary pages.

### 5. 🎭 Presentation & Pitch Demo Flow (Phase 6)
- **Interactive Demo Quick-Switch Bar (`DemoSwitcherBar.tsx`)**: Floating presenter toolbar enabling 1-click switching between **Traveler Hub**, **Vouchers Hub**, **Weather & AI Disruption**, and **Operator Command Center**.
- **Pre-Seeded Showcase Scenario**: Complete multi-city European tour with pre-attached luxury hotels, high-speed rail, Stripe bookings, tour group coordinators, and review testimonials.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide Icons, Recharts, Leaflet / React-Leaflet, jsPDF |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, Nodemailer, Zod, JWT Authentication |
| **Database** | PostgreSQL |
| **APIs** | Open-Meteo (Weather), OpenStreetMap / Nominatim (Geocoding), Google Gemini AI |

---

## 🏁 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database running locally or hosted (e.g. Supabase / Neon)

### 2. Clone the Repository
```bash
git clone https://github.com/Faizkhan-3005/TripWeave.git
cd TripWeave
```

### 3. Install Dependencies
```bash
# Install root/client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 4. Configure Environment Variables
Create a `.env` file in the `server` directory (see `server/.env.example`):
```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripweave?schema=public"
JWT_SECRET="tripweave_super_secret_jwt_key_2026"
CLIENT_URL="http://localhost:3000"
```

### 5. Initialize Database & Seed Sample Data
```bash
cd server
npx prisma db push
npx prisma db seed
cd ..
```
*Seeds destinations, curated activities, sample bookings, hotels, transport options, and tour groups.*

### 6. Run the Application
Run both frontend and backend concurrently from the root directory:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API**: `http://localhost:5001`

---

## 🔑 Demo Access

- **Traveler Account**: `faiz@tripweave.com` (or `demo@tripweave.com`)
- **Operator / Admin Account**: `admin@tripweave.com`
- **Password**: `password123`

---

## 📄 License
MIT License © 2026 Faiz Khan — Tripweave.