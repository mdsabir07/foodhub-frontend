# 🍲 DishMarket — Local Culinary Marketplace

<p align="center">
  <img src="public/readme/banner.webp" alt="DishMarket Banner" width="100%">
</p>

DishMarket is a modern, responsive, and performance-optimized e-commerce platform connecting local culinary artists and master chefs directly with food enthusiasts in their communities. Featuring full basket mechanics, dynamic search/filters, live reviews, and checkout workflows.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Pnpm](https://img.shields.io/badge/pnpm-9.0+-orange?logo=pnpm)](https://pnpm.io/)
[![Database](https://img.shields.io/badge/PostgreSQL-Prisma-blue?logo=prisma)](https://www.prisma.io/)

---

## ✨ Features

- **⚡ Fast Marketplace Catalog**: Search, debounce inputs (400ms buffer), and instantly filter items dynamically by categories or sorting parameters (price, recommended, ratings).
- **🛒 Persistent Basket Mechanics**: Custom context hook with full local storage persistence, modular cart drawer, item line clearance, and smooth interactive updates.
- **💬 Real-Time Review Pipeline**: Native user feedback with relational database storage. Includes average calculation fallbacks for spotless page listings.
- **📱 Fluid Responsiveness**: Designed using a mobile-first philosophy with modern touch-slide mechanics for simulated viewport wrappers.
- **🎨 Cinematic Hero Overlays**: Supports dynamic cinematic video backgrounds alongside modular styling.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, Client & Server Components, Suspense boundaries)
- **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
- **Database**: PostgreSQL (Relational DB)
- **ORM**: Prisma (Explicit relations for reviews, users, and food listings)
- **State & Hooks**: React Context APIs & Custom Hooks (`useCart`, `useAppRouter`)
- **Authentication**: Custom modular Session Provider

---

## 📁 Directory Structure Overview

```text
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── page.tsx            # Spotlight home & cinematic hero
│   │   ├── meals/              # Catalog marketplace listings
│   │   └── meals/[id]/         # Dynamic single asset profile details
│   ├── components/             # Reusable UI Blocks
│   │   ├── MealCard.tsx        # Catalog product visual representation
│   │   ├── MealReviews.tsx     # Rating submission pipeline 
│   │   ├── CartDrawer.tsx      # Sidebar cart utility
│   │   └── Hero.tsx            # Cinematic visual entry
│   ├── hooks/                  # Global helper hooks
│   │   ├── useCart.ts          # Core cart engine
│   │   └── useAppRouter.ts     # Wrapper for custom history routing
│   └── services/               # API endpoint configurations


# 🚀 Local Quickstart Setup

## 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later)
- **pnpm** (installed globally)

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Setup Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dishmarket"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4. Database Initialization

Synchronize your Prisma schema with your PostgreSQL database:

```bash
npx prisma db push
```

---

## 5. Start the Development Server

```bash
pnpm run dev
```

Once the server is running, open:

**http://localhost:3000**

to view the application.

---

# 📦 Production Build (Vercel Type-Checking Verification)

To verify that the project builds successfully and passes Vercel's production pipeline:

```bash
pnpm build
```

---

# 🎨 Asset Optimization & Layout Reference Guide

To ensure fast page loads, minimize **Cumulative Layout Shift (CLS)**, and maintain consistent visuals across light and dark themes, use the following asset specifications.

---

## 1. Hero Cinematic Banner (Video/Image)

**Replacement Target**

```text
./src/components/Hero.tsx
```

### Specifications

| Property | Value |
|----------|-------|
| Aspect Ratio | 16:9 (Widescreen) |
| Dimensions | 1920 × 1080 px |

### Format Guidelines

- **Video:** Compress looping background videos to **under 5 MB** using the `.mp4` format.
- **Image:** Use optimized `.webp` images.

---

## 2. Meal Item Cards (Main Grid & Profile View)

**Replacement Targets**

```text
./src/components/MealCard.tsx
./src/app/meals/[id]/page.tsx
```

### Specifications

| Property | Value |
|----------|-------|
| Aspect Ratio | 1:1 (Square) or 4:3 |
| Dimensions | 600 × 600 px |

### Format Guidelines

- Export images as **`.webp`** or **`.avif`**.
- Keep a consistent aspect ratio to ensure uniform card heights across the grid, regardless of varying text lengths.

---

## 3. Kitchen Story / Chef Spotlight Card

**Replacement Target**

```text
Secondary section in:
./src/app/page.tsx
```

### Specifications

| Property | Value |
|----------|-------|
| Aspect Ratio | 1:1 (Square) or 4:5 (Portrait) |
| Dimensions | 800 × 800 px |

### Format Guidelines

- Use high-resolution compressed **`.webp`** images.
- These dimensions maintain visual alignment with adjacent typography on desktop while scaling smoothly for mobile devices.