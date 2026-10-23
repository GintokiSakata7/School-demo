# School-demo

A modern, editorial React + TypeScript school website and content-management administrative dashboard for **Majin Schools**, built with a distinctive visual identity, animated learning journey, dynamic admissions system, and responsive layouts.

## 📦 Project Structure

```
School-demo/
├── majin-schools/               # Complete React + Vite source code
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Brand, Reveal, SectionHeading, SiteLayout
│   │   ├── context/            # SiteDataContext state management
│   │   ├── data/               # Seed data, types, image banks
│   │   ├── lib/                # Local data store & optional Supabase client
│   │   ├── pages/              # Public pages & Admin dashboard
│   │   └── styles/             # Global, Admin, and Revamp editorial CSS
│   ├── index.html              # HTML entry point with DM Serif & Manrope typography
│   ├── package.json            # Project dependencies & scripts
│   ├── supabase-schema.sql     # Database schema for Supabase integration
│   └── vite.config.ts          # Vite configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Repository overview
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm (v10+)

### Running Locally

```bash
cd majin-schools
npm install
npm run dev
```

Open the local development URL shown in your terminal (typically `http://localhost:5180/` or `http://localhost:5173/`).

### Production Build

```bash
npm run build
npm run preview
```

## 🔐 Admin Dashboard

Access the school administrative dashboard at `/admin`.

**Local Demo Credentials:**
- **Email:** `admin@majinschools.demo`
- **Password:** `Majin@2026`

*Note: In local demo mode, changes to faculty, achievements, events, gallery, and admissions inquiries persist locally in the browser.*
