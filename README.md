# DirTrace — Motorsport Racing Communities & Club SaaS Platform 🏁

DirTrace is a high-octane SaaS platform engineered for motorcycle and automotive racing communities, sanctioned clubs, and event organizers. 

The platform is seeded and verified with the real-world **Deccan Conqueror Dirt Track : Pune 2.0** championship meet (14th & 15th November 2026 at AISSMS College Ground, Pune).

---

## 🎨 Strict 3-Color Motorsport Design System

The platform strictly adheres to a **3-color palette**:
1. **Asphalt Void Black (`#0B0C10` / `#14161D`)** — Deep tarmac dark background, card surfaces, carbon-fiber undertone.
2. **Throttle Blaze Orange (`#FF5500`)** — High-adrenaline accent, CTAs, race badges, borders, dirt-track racing identity.
3. **Pure Trophy White (`#FFFFFF`)** — High-contrast typography, stats, and scrutiny passes.

---

## 🏎️ Core Business Model & Platform Mechanics

### 1. Paid Official Club Accreditation
- Creating an official club/committee profile requires an accreditation fee (**₹2,999**).
- Prevents spam clubs and guarantees verified organizers.
- Upon payment, the club receives a **Verified Club Badge** and **1 Free Event Hosting Quota** (up to 15 racers free of charge).

### 2. Free Tier (15-Racer Quota) & Pro Event Pass
- Every verified club can host events on the **Free Tier**, which includes up to **15 racer registrations**.
- If a race meet scales beyond 15 racers or hosts an expansive championship grid, the organizer upgrades to the **Pro Event Pass (₹1,499)** to unlock **Unlimited Racers**.
- Once upgraded, the 15-racer cap is permanently lifted for that event.

### 3. Anti-Duplication Banning Engine
- Protects authentic organizers who secure physical grounds (e.g., AISSMS College Ground) and official sanctions.
- Compares title similarity, venue name, and overlapping dates across all accounts.
- If an account attempts to host a duplicate event, the system **flags and bans the duplicate from publishing**, protecting organizer revenue and platform integrity.

---

## 🏍️ Deccan Conqueror Dirt Track : Pune 2.0 Showcase

Seeded with the real-world race flyer data:
- **Event**: Deccan Conqueror Dirt Track : Pune 2.0
- **Headline**: PUNE FULL THROTTLE
- **Dates**: 14th & 15th November 2026
- **Venue**: AISSMS College Ground, Pune, Maharashtra
- **Sanction**: FMSCI (The Federation of Motor Sports Clubs of India)
- **Host Club**: Roadiez Adventure Club (Contact: Amarendra Sathe Sir +91 98230 97512)
- **17 Official Classes**: Foreign Open, Indian Bike 261-460, Ladies, Intermediate, Two Stroke, Scooter, Stock, etc.
- **Prize Structure**: Cash 1st (₹10,000 / ₹7,000 / ₹5,000), 2nd (₹6,000 / ₹5,000 / ₹3,000), 3rd (₹4,000 / ₹3,000 / ₹2,000) + Medals for 4th & 5th.
- **Entry Fee**: ₹1,500 per class.
- **Choice Numbers**: Live First-Come, First-Served choice number reservation (One Bike = One Number).
- **Championship Rule**: Maximum 4 classes eligible for championship points.
- **Mandatory Scrutiny**: FMSCI License, Bike RC Book, and Insurance copy strictly mandatory.

---

## 🚀 Quick Start & Run

### 1. Run the Full-Stack Application
```bash
# Starts the full Express server with static React app at http://localhost:5000
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### 2. Run Frontend in Vite Dev Mode (Optional)
```bash
npm run client
```
Runs Vite hot-reloading dev server on **http://localhost:5173** (with automatic `/api` proxying to port 5000).

---

## 🔑 Pre-Configured Demo Accounts (1-Click Login)

| Persona | Email | Password | Role & Data |
|---|---|---|---|
| **Racer** | `pranav@racing.com` | `racer123` | Scrutinized racer, #97 Kawasaki KX250 Motocross, active pass |
| **Club Organizer** | `roadiez@puneadventure.com` | `roadiez123` | Roadiez Adventure Club president, Pune 2.0 host HQ |
| **Admin** | `admin@dirtrace.com` | `admin123` | Platform overseer |

---

## 🛠️ API Endpoints Summary

- `POST /api/auth/register` — Register racer or club organizer.
- `POST /api/auth/login` — JWT bearer token authentication.
- `GET /api/auth/me` — Current user profile, associated club, and active registrations.
- `GET /api/events` — Published events with live capacity indicators.
- `GET /api/events/:id` — Event details, 17 classes, prize sheet, taken competition numbers.
- `POST /api/events/check-duplicate` — Anti-duplication pre-check engine.
- `POST /api/events` — Host new event (validates active club status & anti-duplicate rules).
- `POST /api/events/:id/register` — Racer registration with choice number lock and 15-racer limit checks.
- `POST /api/events/:id/upgrade-pro` — Upgrade event to Pro Unlimited Tier.
- `POST /api/clubs` — Create club (pending accreditation fee).
- `POST /api/clubs/:id/pay-activation` — Pay accreditation fee (₹2,999) to unlock active status & 1 free event.
- `GET /api/dashboard/club` — Club metrics, revenue, 15-racer capacity gauge, and rider roster.
- `GET /api/dashboard/rider` — My race passes, allocated competition numbers, and QR tickets.
