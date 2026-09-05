# 🌐 Tripweave — Dual-Sided Personalized Dynamic Tour Planning & Operations Platform

> **Problem Statement (PS7)**: Personalized Dynamic Tour Planning and Operations Platform.
> Bridging travelers seeking bespoke journeys with tour operators needing real-time fleet, hotel, guide, and disruption management.

Tripweave is an enterprise-grade full-stack **PERN** web application (PostgreSQL, Express.js, React 19, Node.js + TypeScript & Tailwind CSS) designed for end-to-end multi-city travel orchestration. It supports dual role workflows: **Traveler Experience** and **Admin / Tour Operations Command Center**.

---

## 🚀 Key Innovations & Capabilities

### 1. 🎛️ Dual-Sided Role Architecture
- **Traveler Portal**: Self-service multi-city trip creation, interactive day-by-day itinerary sequencing, real-time spending analytics, packing checklists, and document downloads.
- **Tour Operator Command Hub**: Live booking approvals, room inventory tracking, cohort coordination, dispatch workloads, and real-time disruption mitigation.
- **Instant Role-Switching**: Easily toggle between `Traveler` and `Operator` modes with role-based JWT authentication and protected views.

### 2. 🗺️ Multi-City Itinerary Builder & Live Maps
- **Interactive Leaflet Route Maps**: Auto-geocoding, numbered destination pins, and connecting route polylines.
- **Hour-by-Hour Scheduling**: Dynamic time slots, categories, and live budget updates.
- **Weather-Aware Forecasts**: Real-time 5-day Open-Meteo forecasts per destination stop.

### 3. 🛡️ Dynamic Tour Disruption & Audit Trail
- **Live Disruption Management**: Log weather reroutes (e.g. Seine flooding alerts, rain re-sequencing) and supplier schedule changes.
- **Audit & Impact Analysis**: Track schedule shift history, vendor reallocations, and coordinator dispatch logs.

### 4. 📊 Financial Analytics & Export Deliverables
- **Live Budget Tracking**: Donut charts, category expense splits, and budget threshold alerts powered by Recharts.
- **Automated CSV Tour Manifest**: 1-click spreadsheet export formatted with vendor breakdowns, costs, and timeline details.
- **Tripweave PDF Expedition Guide**: Client-side generated multi-page A4 travel guides featuring trip summaries, daily schedules, vouchers, and emergency contacts.

### 5. ⚡ Universal Spotlight Search (`Cmd + K` / `Ctrl + K`)
- Instant keyboard navigation across all tours, cities, activities, and operational tools.

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