# Majin Schools — Premium School Website

A React + TypeScript concept website for a modern school brand. This version includes a major editorial design revamp: a photography-led homepage, clearer inner-page hierarchy, a warmer and more distinctive palette, restrained motion, responsive page compositions, and a companion content-management dashboard. See [`DESIGN-RESEARCH.md`](./DESIGN-RESEARCH.md) for the school-site review and visual rationale.

> **Demo/content notice:** This project intentionally uses illustrative school facts, fictional student/faculty profiles, sample contact details, and remote stock photography. It is a visual and functional prototype. Verify and replace all content, results, claims, photos, dates, and contact details before using it as a real school's public website.

## Stack

- React + TypeScript + Vite
- React Router
- Framer Motion
- Lucide React
- Tailwind is not required; the visual system is implemented in structured CSS for fine-grained control.
- Optional Supabase support for shared content, admin authentication, and admissions enquiries

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`). To create a production build:

```bash
npm run build
npm run preview
```

## Routes

Public pages:

- `/` — high-impact landing page
- `/about` — school story, values, vision, mission
- `/academics` — learning approach and stages
- `/faculty` — faculty directory
- `/achievements` — searchable/filterable achievement stories
- `/student-life` — sport, arts, innovation, community
- `/campus` — image-led campus gallery with full-screen viewer
- `/news` — school events and stories
- `/admissions` — validated enquiry form and confirmation state
- `/contact` — contact pathways and map-style concept visual

Admin:

- `/admin` — dashboard, content managers, enquiry inbox, site settings

## Demo admin access

With no Supabase environment configured, sign in at `/admin` with:

- **Email:** `admin@majinschools.demo`
- **Password:** `Majin@2026`

The login intentionally supports a local demo mode so the dashboard is immediately testable. It is **not production authentication**: demo credentials are client-side, and content/inquiries are stored in the current browser's local storage. A new browser/device will not share demo changes. Do not deploy the demo login as a public production admin system.

The admin panel can create, edit, and delete faculty, achievements, events, and gallery items; update school/contact/homepage settings; and track admissions enquiry statuses. Changes are reflected by the public pages in the same browser.

## Optional Supabase setup

The project uses a generic `site_content` row (`slug = 'main'`) for website content and an `admission_inquiries` table for enquiry submissions. When Supabase environment variables are missing, the app uses local storage instead.

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and set:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

3. In Supabase SQL Editor, run [`supabase-schema.sql`](./supabase-schema.sql).
4. Create the first admin user through Supabase Authentication (email/password).
5. In SQL Editor, insert the matching Auth user's UUID into `public.profiles`:

   ```sql
   insert into public.profiles (user_id, role)
   values ('YOUR_AUTH_USER_UUID', 'admin');
   ```

6. Restart the Vite dev server after changing environment variables.
7. Sign in to `/admin` with the Supabase email/password. The first content save creates the `site_content` row; the public site reads that shared content row.

**Security notes:** The SQL schema enables row-level security and limits content writes and enquiry reads/updates to users whose UUID has an `admin` role in `profiles`. Public users can submit enquiries but cannot read them. Before public launch, add rate limiting/CAPTCHA or another anti-spam control to admissions submissions, validate and sanitise content, review the database policies, add backups, and publish the school's actual privacy policy. Never put a Supabase service-role key in frontend variables.

## Images and fonts

- The fonts are loaded from Google Fonts (DM Serif Display and Manrope).
- Demo photography uses Pexels and Unsplash image URLs configured in `src/data/seedData.ts`. Image URLs are centralised so they can be replaced without searching the component tree. Replace them with school-owned/approved photos and consider downloading/optimising images into local assets or a managed CDN for production. The image selection and design rationale are documented in `DESIGN-RESEARCH.md`.
- Respect image permissions and obtain appropriate parental/guardian consent before publishing identifiable student photos.

## Project structure

```text
src/
  components/   Shared logo, layout, section heading, reveal animations
  context/      Shared website content and admissions context
  data/         Types and fictional starter content
  lib/          Local storage and optional Supabase data access
  pages/        Public pages and admin content-management experience
  styles/       Public design system and admin UI styles
  App.tsx       Route composition
  main.tsx      React entry point
public/
  favicon.svg
supabase-schema.sql
.env.example
```

## Before a real launch

- Replace fictional profiles, sample contact information, placeholder results, and event dates with school-approved content.
- Confirm the curriculum, board/affiliation, grade ranges, learning programmes, facilities, and admissions requirements against official records.
- Replace stock imagery with authorised campus photography and consented student/faculty portraits.
- Add the school's legal identity, applicable disclosures, privacy notice, cookie/analytics decisions, and accessibility review.
- Set up production hosting, environment variables, Supabase backups, spam controls, error reporting, and analytics only as appropriate.
- Test keyboard navigation, screen readers, reduced motion, and mobile layouts on real devices.
