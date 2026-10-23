# Majin Schools — Design research & art direction

## What this redesign is trying to solve

Majin Schools is a school-marketing concept for Majin Studios, not a school ERP and not a generic education theme. The site should help a parent understand the school's point of view, see the learning experience, trust the people, and take a clear next step toward admissions. It also needs to demonstrate to school management that Majin Studios can design and implement a coherent, maintainable digital experience.

The visual review of the previous prototype identified a few things to correct: the photo choices did not consistently read as Indian school life; similar compositions repeated from section to section; multiple decorative flourishes competed with the actual content; and generous whitespace made some sections feel unfinished. The new direction is photography-led and editorial, with stronger visual hierarchy, clearer image crops, more varied section compositions, and simpler motion.

## Reference research

These references were reviewed for information architecture and communication patterns, not to copy their branding or page layouts.

### 1. CHIREC International School — Hyderabad
https://www.chirec.ac.in/

**Useful pattern:** Clear separation of academic excellence, holistic development, school/campus information and admissions. It also makes learning stages and specific programmes discoverable from the top-level structure.

**What Majin takes from it:** Give curriculum, student growth, campus and admissions their own clear paths. Keep the main navigation smaller than CHIREC's deep content tree so a prospective parent can find key information quickly.

### 2. Indus International School — Hyderabad
https://hyderabad.indusschool.com/

**Useful pattern:** Curriculum, student achievements, beyond-academics programmes, parent testimonials and admissions FAQs all receive dedicated space.

**What Majin takes from it:** Academic results should not be the only proof of value. The website should show student projects, experiences outside the classroom, community stories and a helpful admissions process. Majin avoids reproducing a dense menu or duplicating navigation labels.

### 3. The Aga Khan Academy — Hyderabad
https://www.agakhanacademies.org/hyderabad

**Useful pattern:** A clear distinction between the academic programme, student life, facilities, admissions, and school-community stories, including campus-tour information.

**What Majin takes from it:** Different parent questions require different content: "What will my child learn?", "What happens beyond class?", "What is the campus like?", and "How do we visit or apply?" These should not be hidden in one long page.

### 4. Oakridge International Schools
https://www.oakridge.in/

**Useful pattern:** Campus-specific information, programme details, news, alumni stories, announcements, and updated results are treated as ongoing content rather than permanent brochure copy.

**What Majin takes from it:** School websites need a usable publishing workflow. The included admin experience is meant to let the team manage events, gallery items, achievements, faculty profiles and admissions enquiries instead of asking a developer to change the source for routine updates.

### 5. The Platos School — Hyderabad
https://www.theplatos.in/

**Useful pattern:** The school's philosophy and practical differentiators are explained before program details, with age-group learning programmes and a visible admissions enquiry route.

**What Majin takes from it:** Write about real practices rather than rely on empty superlatives. A school's methodology, teacher approach, student support, safety information and day-to-day experience are more useful to families than a string of generic claims.

### 6. American Embassy School redesign case study
https://www.theantialias.com/work/american-embassy-school

**Useful pattern:** A school website needs to serve several audiences—prospective families, current families and the wider community—without making the interface confusing.

**What Majin takes from it:** The public marketing site has a defined focus on discovery and admissions, while operational systems such as attendance, homework and student records should remain separate or link out to existing tools.

## Design decisions for the Majin concept

### Art direction

- **Palette:** midnight navy, warm ivory, and a restrained terracotta accent with muted gold details. The palette is warm and institutional without defaulting to the common bright-blue education template.
- **Typography:** keep the existing DM Serif Display + Manrope pairing. Serif is used for major editorial headlines; Manrope carries paragraphs, navigation, labels, buttons and forms.
- **Layout:** replace repeated full-bleed dark banners with a split editorial layout on inner pages. Use varied visual rhythms across the homepage: a decisive hero, an image-led introduction, a guided learning journey, a full-width campus story, people, achievements, student voice and events.
- **Photography:** prefer classroom activity, student collaboration, labs, sport, arts and campus context over unrelated corporate stock. Crop images intentionally and do not reuse one hero image across every section.
- **Motion:** use entrance and image transitions as a quiet guide. Avoid stacking unnecessary floating widgets, permanent parallax, or animation that delays access to information. The stylesheet supports reduced-motion preferences.
- **Conversion:** the admissions path is prominent in the header and content; mobile keeps a clear enquiry action. Forms should feel short, accessible and reassuring.

### Image references used in the demo

Remote demonstration imagery is sourced from Pexels and Unsplash, with image URLs centralised in `src/data/seedData.ts` so they are easy to replace. Pexels and Unsplash licensing information:

- https://www.pexels.com/license/
- https://unsplash.com/license

**Important:** the demo imagery is not Majin Schools photography and must not be presented as proof of the actual campus or people. Before a real launch, replace it with school-owned or properly licensed assets, and obtain appropriate consent for identifiable student imagery. Prefer one organised photoshoot with consistent uniforms, lighting, locations and framing rather than a mismatched collection of unrelated images.

## Visual content checklist before a client presentation

1. Replace the placeholder address, phone, email and academic year with approved values or clearly label them as sample details.
2. Obtain 8–12 strong school-owned photographs: a hero landscape, classroom activity, teacher interaction, lab/project work, sports, arts/culture, campus/building, library, event/community and 2–4 approved staff portraits.
3. Confirm the actual board, grade stages, curriculum, learning approach, facilities, fees/admissions stages and all achievements before publishing claims.
4. Use school-approved faculty names and student results only. Keep parent testimonials attributable and permissioned; do not invent quotations.
5. Test the homepage at desktop, tablet and common mobile widths. Check image crops, the menu, the admissions form, all routes, keyboard focus and reduced motion.
6. Test the admin data lifecycle and Supabase configuration separately before publishing as a live website.

## Comparison with the linked JSM Bags demo

The supplied Bags demo URL was reachable during research, but the web renderer exposed only its page title and not its rendered layout. This document therefore does not claim a pixel-level comparison with that site. The revamp has instead been grounded in the observed school-sector references above and the supplied recording of the earlier Majin Schools prototype. The intended distinction is deliberate editorial art direction, relevant school-life imagery, varied section compositions, and clear admissions intent—not extra decorative effects for their own sake.
