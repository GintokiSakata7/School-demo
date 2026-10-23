export type FacultyMember = {
  id: string;
  name: string;
  role: string;
  subject: string;
  experience: string;
  bio: string;
  image: string;
};

export type Achievement = {
  id: string;
  name: string;
  accolade: string;
  category: string;
  year: string;
  image: string;
  story: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

export type AdmissionInquiry = {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  currentGrade: string;
  applyingFor: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Visit scheduled' | 'Closed';
};

export type SiteSettings = {
  schoolName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  academicYear: string;
  heroTitle: string;
  heroDescription: string;
};

export type SiteData = {
  settings: SiteSettings;
  faculty: FacultyMember[];
  achievements: Achievement[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  inquiries: AdmissionInquiry[];
};
