import type { SiteData } from './types';

export const imageBank = {
  // Photography is licensed demo imagery (Pexels/Unsplash), not school-owned content.
  // Replace with the school's own consent-cleared photographs before launch.
  hero: 'https://images.pexels.com/photos/8926542/pexels-photo-8926542.jpeg?auto=compress&cs=tinysrgb&w=2000',
  classroom: 'https://images.pexels.com/photos/18012456/pexels-photo-18012456.jpeg?auto=compress&cs=tinysrgb&w=1400',
  students: 'https://images.pexels.com/photos/40378015/pexels-photo-40378015.jpeg?auto=compress&cs=tinysrgb&w=1400',
  teacher: 'https://images.pexels.com/photos/8923042/pexels-photo-8923042.jpeg?auto=compress&cs=tinysrgb&w=1200',
  library: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=85',
  science: 'https://images.pexels.com/photos/8471975/pexels-photo-8471975.jpeg?auto=compress&cs=tinysrgb&w=1400',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=85',
  art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85',
  auditorium: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85',
  campus: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=90',
  principal: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=85',
  faculty1: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85',
  faculty2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  faculty3: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  students2: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=85',
};

export const seedData: SiteData = {
  settings: {
    schoolName: 'Majin Schools',
    tagline: 'Curiosity, character, capability.',
    phone: '+91 90000 12345',
    email: 'hello@majinschools.demo',
    address: 'Learning Avenue, Hyderabad, Telangana, India',
    academicYear: '2026–27',
    heroTitle: 'A bigger world begins with a question.',
    heroDescription: 'An ambitious, thoughtful education for young people ready to ask better questions, discover their strengths, and find their own way forward.',
  },
  faculty: [
    { id: 'faculty-1', name: 'Dr. Ananya Rao', role: 'Principal', subject: 'School Leadership', experience: '18 years in education', bio: 'Believes that every learner deserves high expectations, thoughtful support, and the confidence to ask better questions.', image: imageBank.faculty2 },
    { id: 'faculty-2', name: 'Arjun Mehta', role: 'Head of Mathematics', subject: 'Mathematics', experience: '12 years in education', bio: 'Makes abstract ideas tangible through real-world problems, collaborative challenges, and a strong culture of curiosity.', image: imageBank.faculty3 },
    { id: 'faculty-3', name: 'Priya Nair', role: 'Science Educator', subject: 'Science & Discovery', experience: '10 years in education', bio: 'Creates hands-on experiences that help students move from memorising answers to understanding how the world works.', image: imageBank.principal },
    { id: 'faculty-4', name: 'Kabir Menon', role: 'Humanities Lead', subject: 'Languages & Humanities', experience: '9 years in education', bio: 'Helps students find their voice through reading, discussion, creative expression, and meaningful perspectives.', image: imageBank.faculty1 },
  ],
  achievements: [
    { id: 'ach-1', name: 'Aarav Sharma', accolade: 'Academic Distinction', category: 'Academics', year: '2026', image: imageBank.students, story: 'A showcase story about steady practice, asking for help, and learning to approach challenges with confidence.' },
    { id: 'ach-2', name: 'Diya Reddy', accolade: 'Young Innovator', category: 'Innovation', year: '2026', image: imageBank.science, story: 'A student project story celebrating curiosity, experimentation, teamwork, and the courage to try again.' },
    { id: 'ach-3', name: 'Vihaan Patel', accolade: 'Team Spirit Award', category: 'Sports', year: '2025', image: imageBank.sports, story: 'A celebration of discipline, sportsmanship, and learning how a team can achieve more together.' },
  ],
  events: [
    { id: 'event-1', title: 'Discovery Week', category: 'Learning', date: '2026-11-12', description: 'A week of student-led experiments, creative challenges, demonstrations, and questions worth exploring.', image: imageBank.science },
    { id: 'event-2', title: 'The Majin Arts Festival', category: 'Arts & Culture', date: '2026-12-05', description: 'A celebration of student imagination through visual arts, performance, music, and storytelling.', image: imageBank.art },
    { id: 'event-3', title: 'Champions in the Making', category: 'Sports', date: '2027-01-18', description: 'An energetic day of teamwork, movement, healthy competition, and personal bests.', image: imageBank.sports },
  ],
  gallery: [
    { id: 'gallery-1', title: 'Learning by doing', category: 'Academics', image: imageBank.classroom },
    { id: 'gallery-2', title: 'Ideas in the making', category: 'Innovation', image: imageBank.science },
    { id: 'gallery-3', title: 'A place to explore', category: 'Campus', image: imageBank.library },
    { id: 'gallery-4', title: 'Move with purpose', category: 'Sports', image: imageBank.sports },
    { id: 'gallery-5', title: 'Create without limits', category: 'Arts', image: imageBank.art },
    { id: 'gallery-6', title: 'Together we grow', category: 'Community', image: imageBank.students2 },
  ],
  inquiries: [],
};
