import { seedData } from '../data/seedData';
import type { AdmissionInquiry, SiteData } from '../data/types';
import { supabase, supabaseEnabled } from './supabase';

const SITE_STORAGE_KEY = 'majin-schools-site-data-v2';
const INQUIRIES_STORAGE_KEY = 'majin-schools-inquiries-v1';

function readLocalData(): SiteData {
  try {
    const saved = localStorage.getItem(SITE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SiteData;
      return { ...structuredClone(seedData), ...parsed, settings: { ...seedData.settings, ...parsed.settings } };
    }
  } catch (error) {
    console.warn('Could not read local school content; using starter data.', error);
  }
  localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(seedData));
  return structuredClone(seedData);
}

export async function loadSiteData(): Promise<SiteData> {
  if (supabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase.from('site_content').select('payload').eq('slug', 'main').maybeSingle();
      if (error) throw error;
      if (data?.payload) return data.payload as SiteData;
      return structuredClone(seedData);
    } catch (error) {
      console.error('Supabase content unavailable; falling back to this browser.', error);
    }
  }
  return readLocalData();
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from('site_content').upsert({ slug: 'main', payload: data, updated_at: new Date().toISOString() }, { onConflict: 'slug' });
    if (error) throw error;
    return;
  }
  localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(data));
}

export async function saveInquiry(inquiry: AdmissionInquiry): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from('admission_inquiries').insert({
      id: inquiry.id,
      parent_name: inquiry.parentName,
      email: inquiry.email,
      phone: inquiry.phone,
      student_name: inquiry.studentName,
      current_grade: inquiry.currentGrade,
      applying_for: inquiry.applyingFor,
      message: inquiry.message,
      created_at: inquiry.createdAt,
      status: inquiry.status,
    });
    if (error) throw error;
    return;
  }
  try {
    const current = JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY) || '[]') as AdmissionInquiry[];
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify([inquiry, ...current]));
  } catch {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify([inquiry]));
  }
}

export async function loadInquiries(): Promise<AdmissionInquiry[]> {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from('admission_inquiries').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id,
      parentName: row.parent_name,
      email: row.email,
      phone: row.phone,
      studentName: row.student_name,
      currentGrade: row.current_grade,
      applyingFor: row.applying_for,
      message: row.message,
      createdAt: row.created_at,
      status: row.status,
    })) as AdmissionInquiry[];
  }
  try { return JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY) || '[]') as AdmissionInquiry[]; }
  catch { return []; }
}

export async function updateInquiryStatus(id: string, status: AdmissionInquiry['status']): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from('admission_inquiries').update({ status }).eq('id', id);
    if (error) throw error;
    return;
  }
  const list = await loadInquiries();
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(list.map((item) => item.id === id ? { ...item, status } : item)));
}

export function adminUsesSupabase(): boolean { return supabaseEnabled; }
