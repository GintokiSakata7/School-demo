import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { seedData } from '../data/seedData';
import type { AdmissionInquiry, SiteData } from '../data/types';
import { loadInquiries, loadSiteData, saveInquiry, saveSiteData, updateInquiryStatus } from '../lib/dataStore';

type SiteDataContextValue = {
  data: SiteData;
  ready: boolean;
  updateData: (next: SiteData) => Promise<void>;
  addInquiry: (inquiry: AdmissionInquiry) => Promise<void>;
  inquiries: AdmissionInquiry[];
  refreshInquiries: () => Promise<void>;
  changeInquiryStatus: (id: string, status: AdmissionInquiry['status']) => Promise<void>;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(structuredClone(seedData));
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([loadSiteData(), loadInquiries().catch(() => [])]).then(([loaded, loadedInquiries]) => {
      if (!active) return;
      setData(loaded);
      setInquiries(loadedInquiries);
      setReady(true);
    }).catch((error) => {
      console.error(error);
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  const updateData = useCallback(async (next: SiteData) => {
    await saveSiteData(next);
    setData(next);
  }, []);

  const addInquiry = useCallback(async (inquiry: AdmissionInquiry) => {
    await saveInquiry(inquiry);
    setInquiries((prev) => [inquiry, ...prev]);
    setData((prev) => ({ ...prev, inquiries: [inquiry, ...prev.inquiries] }));
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majin-schools-site-data-v1');
        if (saved) localStorage.setItem('majin-schools-site-data-v1', JSON.stringify({ ...JSON.parse(saved), inquiries: [inquiry, ...(JSON.parse(saved).inquiries || [])] }));
      } catch { /* local demo inquiry persistence is handled by dataStore */ }
    }
  }, []);

  const refreshInquiries = useCallback(async () => setInquiries(await loadInquiries()), []);
  const changeInquiryStatus = useCallback(async (id: string, status: AdmissionInquiry['status']) => {
    await updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  }, []);

  const value = useMemo(() => ({ data, ready, updateData, addInquiry, inquiries, refreshInquiries, changeInquiryStatus }), [data, ready, updateData, addInquiry, inquiries, refreshInquiries, changeInquiryStatus]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used within SiteDataProvider');
  return context;
}
