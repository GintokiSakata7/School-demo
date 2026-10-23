import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Award, Bell, BookOpen, Check, ChevronDown, CircleHelp, ClipboardList, Compass, GraduationCap, Image, LayoutDashboard, LogOut, Menu, MessageSquare, Plus, Save, Search, Settings, ShieldCheck, Trash2, Users, X, CalendarDays, Pencil, ExternalLink, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { useSiteData } from '../context/SiteDataContext';
import { adminUsesSupabase } from '../lib/dataStore';
import { supabase } from '../lib/supabase';
import type { Achievement, FacultyMember, GalleryItem, MeritStudent, SchoolEvent, SiteData, SiteSettings } from '../data/types';

type TabKey = 'overview' | 'faculty' | 'achievements' | 'toppers' | 'events' | 'gallery' | 'inquiries' | 'settings';
type FieldConfig = { key: string; label: string; type?: 'text' | 'textarea' | 'date' | 'url'; required?: boolean; placeholder?: string };
type ContentKey = 'faculty' | 'achievements' | 'events' | 'gallery' | 'meritStudents';

const tabItems: { id: TabKey; label: string; icon: typeof LayoutDashboard; group: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'WORKSPACE' },
  { id: 'toppers', label: 'Top students & merit', icon: Award, group: 'CONTENT' },
  { id: 'faculty', label: 'Faculty directory', icon: Users, group: 'CONTENT' },
  { id: 'achievements', label: 'Achievements', icon: GraduationCap, group: 'CONTENT' },
  { id: 'events', label: 'News & events', icon: CalendarDays, group: 'CONTENT' },
  { id: 'gallery', label: 'Campus gallery', icon: Image, group: 'CONTENT' },
  { id: 'inquiries', label: 'Admissions enquiries', icon: MessageSquare, group: 'ADMISSIONS' },
  { id: 'settings', label: 'School settings', icon: Settings, group: 'SYSTEM' },
];

const contentConfig: Record<ContentKey, { singular: string; fields: FieldConfig[] }> = {
  meritStudents: { singular: 'merit student / topper', fields: [
    { key: 'name', label: 'Student name', required: true, placeholder: 'e.g. Rohan Kulkarni' },
    { key: 'rankOrScore', label: 'Score / Rank / GPA', required: true, placeholder: 'e.g. 99.6% · AIR 4 or 10 GPA' },
    { key: 'examOrCategory', label: 'Exam / Stream', required: true, placeholder: 'e.g. Grade XII Science (MPC)' },
    { key: 'year', label: 'Academic year', required: true, placeholder: '2026' },
    { key: 'sectionOrStream', label: 'Section / Stream', required: true, placeholder: 'e.g. Section A (MPC) or Section Lotus' },
    { key: 'badge', label: 'Honor badge / Title', placeholder: 'e.g. CBSE NATIONAL TOPPER or STATE 1ST' },
    { key: 'image', label: 'Student photo URL', type: 'url', required: true, placeholder: 'https://…' },
    { key: 'highlights', label: 'Subject centums & highlights', type: 'textarea', required: true, placeholder: 'e.g. 100 Math · 100 Physics | JEE Advanced Qualifier' },
  ] },
  faculty: { singular: 'faculty member', fields: [
    { key: 'name', label: 'Full name', required: true, placeholder: 'e.g. Dr. Ananya Rao' }, { key: 'role', label: 'Role / designation', required: true, placeholder: 'e.g. Principal' }, { key: 'subject', label: 'Subject / focus', required: true, placeholder: 'e.g. School Leadership' }, { key: 'experience', label: 'Experience', placeholder: 'e.g. 12 years in education' }, { key: 'image', label: 'Portrait image URL', type: 'url', required: true, placeholder: 'https://…' }, { key: 'bio', label: 'Short biography', type: 'textarea', required: true, placeholder: 'A short, warm introduction…' },
  ] },
  achievements: { singular: 'achievement', fields: [
    { key: 'name', label: 'Student / team name', required: true }, { key: 'accolade', label: 'Achievement title', required: true, placeholder: 'e.g. Academic Distinction' }, { key: 'category', label: 'Category', required: true, placeholder: 'Academics, Sports, Innovation…' }, { key: 'year', label: 'Year', required: true, placeholder: '2026' }, { key: 'image', label: 'Image URL', type: 'url', required: true, placeholder: 'https://…' }, { key: 'story', label: 'Story / description', type: 'textarea', required: true, placeholder: 'Describe the achievement…' },
  ] },
  events: { singular: 'event', fields: [
    { key: 'title', label: 'Event title', required: true }, { key: 'category', label: 'Category', required: true, placeholder: 'Learning, Sports, Arts…' }, { key: 'date', label: 'Date', type: 'date', required: true }, { key: 'image', label: 'Cover image URL', type: 'url', required: true, placeholder: 'https://…' }, { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What is this event about?' },
  ] },
  gallery: { singular: 'gallery item', fields: [
    { key: 'title', label: 'Image title', required: true }, { key: 'category', label: 'Category', required: true, placeholder: 'Campus, Sports, Arts…' }, { key: 'image', label: 'Image URL', type: 'url', required: true, placeholder: 'https://…' },
  ] },
};

const starterSettings: SiteSettings = { schoolName: 'Majin Schools', tagline: 'Curiosity becomes capability.', phone: '+91 90000 12345', email: 'hello@majinschools.demo', address: 'Learning Avenue, Hyderabad, Telangana, India', academicYear: '2026–27', heroTitle: 'A little curiosity can change the world.', heroDescription: 'An inspiring place to think boldly, grow confidently, and discover what is possible.' };

function makeId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

export function AdminPage() {
  const { data, ready, updateData, inquiries, refreshInquiries, changeInquiryStatus } = useSiteData();
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState<ContentKey | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(starterSettings);

  useEffect(() => {
    setSettingsDraft(data.settings);
  }, [data.settings]);

  useEffect(() => {
    if (adminUsesSupabase() && supabase) {
      supabase.auth.getSession().then(({ data: sessionData }) => setAuthenticated(Boolean(sessionData.session)));
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)));
      return () => listener.subscription.unsubscribe();
    }
  }, []);

  useEffect(() => { if (authenticated) refreshInquiries().catch(() => undefined); }, [authenticated, refreshInquiries]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault(); setLoginError(''); setLoginBusy(true);
    try {
      if (adminUsesSupabase() && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthenticated(true);
      } else if (email.trim().toLowerCase() === 'admin@majinschools.demo' && password === 'Majin@2026') {
        sessionStorage.setItem('majin-admin-demo-session', '1');
        setAuthenticated(true);
      } else {
        throw new Error('Those demo credentials do not match. Please check and try again.');
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally { setLoginBusy(false); }
  }

  async function handleLogout() {
    if (adminUsesSupabase() && supabase) await supabase.auth.signOut();
    sessionStorage.removeItem('majin-admin-demo-session');
    setAuthenticated(false); setActiveTab('overview');
  }

  useEffect(() => {
    if (!adminUsesSupabase() && sessionStorage.getItem('majin-admin-demo-session') === '1') setAuthenticated(true);
  }, []);

  function openNew(type: ContentKey) { setModalType(type); setEditingId(null); }
  function openEdit(type: ContentKey, id: string) { setModalType(type); setEditingId(id); }

  async function saveRecord(type: ContentKey, values: Record<string, string>) {
    const id = editingId || makeId(type.slice(0, -1));
    const next = structuredClone(data) as SiteData;
    if (type === 'faculty') {
      const item: FacultyMember = { id, name: values.name, role: values.role, subject: values.subject, experience: values.experience, bio: values.bio, image: values.image };
      next.faculty = editingId ? next.faculty.map((x) => x.id === id ? item : x) : [item, ...next.faculty];
    } else if (type === 'achievements') {
      const item: Achievement = { id, name: values.name, accolade: values.accolade, category: values.category, year: values.year, image: values.image, story: values.story };
      next.achievements = editingId ? next.achievements.map((x) => x.id === id ? item : x) : [item, ...next.achievements];
    } else if (type === 'events') {
      const item: SchoolEvent = { id, title: values.title, category: values.category, date: values.date, description: values.description, image: values.image };
      next.events = editingId ? next.events.map((x) => x.id === id ? item : x) : [item, ...next.events];
    } else if (type === 'gallery') {
      const item: GalleryItem = { id, title: values.title, category: values.category, image: values.image };
      next.gallery = editingId ? next.gallery.map((x) => x.id === id ? item : x) : [item, ...next.gallery];
    } else if (type === 'meritStudents') {
      const item: MeritStudent = { id, name: values.name, rankOrScore: values.rankOrScore, examOrCategory: values.examOrCategory, year: values.year, sectionOrStream: values.sectionOrStream, badge: values.badge, image: values.image, highlights: values.highlights };
      next.meritStudents = editingId ? (next.meritStudents || []).map((x) => x.id === id ? item : x) : [item, ...(next.meritStudents || [])];
    }
    setSaving(true);
    try { await updateData(next); setModalType(null); notify(`${contentConfig[type].singular} ${editingId ? 'updated' : 'added'}.`); }
    catch { notify('Save failed. Check your connection or database permissions.'); }
    finally { setSaving(false); }
  }

  async function deleteRecord(type: ContentKey, id: string) {
    if (!window.confirm(`Delete this ${contentConfig[type].singular}? This cannot be undone.`)) return;
    const next = structuredClone(data) as SiteData;
    if (type === 'faculty') next.faculty = next.faculty.filter((x) => x.id !== id);
    if (type === 'achievements') next.achievements = next.achievements.filter((x) => x.id !== id);
    if (type === 'events') next.events = next.events.filter((x) => x.id !== id);
    if (type === 'gallery') next.gallery = next.gallery.filter((x) => x.id !== id);
    if (type === 'meritStudents') next.meritStudents = (next.meritStudents || []).filter((x) => x.id !== id);
    try { await updateData(next); notify(`${contentConfig[type].singular} deleted.`); }
    catch { notify('Could not delete the item. Check permissions.'); }
  }

  async function saveSettings(e: FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await updateData({ ...data, settings: settingsDraft }); notify('School settings saved.'); }
    catch { notify('Could not save settings. Check your connection or permissions.'); }
    finally { setSaving(false); }
  }

  const currentTab = tabItems.find((tab) => tab.id === activeTab)!;
  const filteredFaculty = useMemo(() => data.faculty.filter((x) => `${x.name} ${x.subject} ${x.role}`.toLowerCase().includes(query.toLowerCase())), [data.faculty, query]);
  const filteredAchievements = useMemo(() => data.achievements.filter((x) => `${x.name} ${x.category} ${x.accolade}`.toLowerCase().includes(query.toLowerCase())), [data.achievements, query]);
  const filteredEvents = useMemo(() => data.events.filter((x) => `${x.title} ${x.category}`.toLowerCase().includes(query.toLowerCase())), [data.events, query]);
  const filteredGallery = useMemo(() => data.gallery.filter((x) => `${x.title} ${x.category}`.toLowerCase().includes(query.toLowerCase())), [data.gallery, query]);
  const filteredMeritStudents = useMemo(() => (data.meritStudents || []).filter((x) => `${x.name} ${x.rankOrScore} ${x.examOrCategory} ${x.year} ${x.sectionOrStream} ${x.badge || ''}`.toLowerCase().includes(query.toLowerCase())), [data.meritStudents, query]);

  if (!authenticated) return <div className="admin-login-page"><div className="admin-login-aside"><Link to="/" className="admin-back-link"><ArrowLeft size={16} /> Back to website</Link><Brand light /><div className="admin-login-message"><span className="eyebrow eyebrow-light"><i />MAJIN SCHOOLS · ADMIN</span><h1>Good things<br />grow <em>from here.</em></h1><p>Your place to keep the school story fresh, accurate, and inspiring.</p></div><div className="admin-login-aside-bottom"><ShieldCheck size={17} /><span>Content management workspace<br /><small>Secure your school's story.</small></span></div></div><div className="admin-login-main"><div className="admin-login-card"><span className="admin-welcome-mark"><ShieldCheck size={22} /></span><span className="eyebrow"><i />ADMINISTRATOR ACCESS</span><h2>Welcome back.</h2><p>Sign in to manage your school's website content.</p><form onSubmit={handleLogin} className="admin-login-form"><label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.edu" autoComplete="username" /></label><label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /></label>{loginError && <div className="admin-login-error">{loginError}</div>}<button className="button button-navy" type="submit" disabled={loginBusy}>{loginBusy ? <LoaderCircle className="spin" size={17} /> : null}{loginBusy ? 'Signing in…' : 'Sign in to dashboard'} <ArrowUpRight size={17} /></button></form>{!adminUsesSupabase() && <div className="demo-credentials"><span><CircleHelp size={15} />Demo access</span><code>admin@majinschools.demo</code><code>Majin@2026</code><button onClick={() => { setEmail('admin@majinschools.demo'); setPassword('Majin@2026'); }}>Use demo credentials <ArrowUpRight size={13} /></button></div>}<p className="admin-login-footer">Demo-mode content is saved in this browser. Configure Supabase for shared production content and authentication.</p></div><span className="admin-login-copyright">© {new Date().getFullYear()} Majin Schools · Admin portal</span></div></div>;

  return <div className="admin-app">
    <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="admin-sidebar-brand"><Brand /><button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div>
      <div className="admin-workspace-switch"><span className="workspace-avatar">M</span><span><strong>{data.settings.schoolName}</strong><small>Website workspace</small></span><ChevronDown size={15} /></div>
      <nav className="admin-side-nav">{['WORKSPACE', 'CONTENT', 'ADMISSIONS', 'SYSTEM'].map((group) => <div className="admin-nav-group" key={group}><span className="admin-nav-label">{group}</span>{tabItems.filter((tab) => tab.group === group).map((tab) => <button key={tab.id} className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => { setActiveTab(tab.id); setQuery(''); setSidebarOpen(false); }}><tab.icon size={17} strokeWidth={1.8} /><span>{tab.label}</span>{tab.id === 'inquiries' && inquiries.length > 0 && <i>{inquiries.length}</i>}</button>)}</div>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-sidebar-help"><span><CircleHelp size={18} /></span><div><strong>Need a hand?</strong><small>You're in demo mode.</small></div><ArrowUpRight size={14} /></div><button className="admin-sidebar-logout" onClick={handleLogout}><LogOut size={16} /> Sign out</button></div>
    </aside>
    {sidebarOpen && <button className="admin-mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
    <div className="admin-content-shell">
      <header className="admin-topbar"><div className="admin-topbar-left"><button className="admin-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button><span className="admin-breadcrumb">Workspace <i>/</i> <strong>{currentTab.label}</strong></span></div><div className="admin-topbar-actions"><span className="admin-status-pill"><i />All changes local</span><Link to="/" target="_blank" className="admin-view-site">View website <ExternalLink size={14} /></Link><button className="admin-avatar" onClick={() => notify('Signed in as demo administrator.')} aria-label="Account details">AD</button></div></header>
      <main className="admin-main-content">
        {!ready && <div className="admin-loading"><LoaderCircle size={23} className="spin" /> Loading school workspace…</div>}
        {ready && activeTab === 'overview' && <Overview data={data} inquiries={inquiries} onNavigate={setActiveTab} />}
        {ready && activeTab === 'toppers' && <ContentManager type="meritStudents" title="Top students & merit list" intro="Manage academic toppers, board exam achievers, and honor roll across all batches and sections." items={filteredMeritStudents} allCount={(data.meritStudents || []).length} query={query} setQuery={setQuery} onAdd={() => openNew('meritStudents')} onEdit={(id) => openEdit('meritStudents', id)} onDelete={(id) => deleteRecord('meritStudents', id)} />}
        {ready && activeTab === 'faculty' && <ContentManager type="faculty" title="Faculty directory" intro="Introduce the people who make learning matter." items={filteredFaculty} allCount={data.faculty.length} query={query} setQuery={setQuery} onAdd={() => openNew('faculty')} onEdit={(id) => openEdit('faculty', id)} onDelete={(id) => deleteRecord('faculty', id)} />}
        {ready && activeTab === 'achievements' && <ContentManager type="achievements" title="Achievements" intro="Celebrate the effort behind every milestone." items={filteredAchievements} allCount={data.achievements.length} query={query} setQuery={setQuery} onAdd={() => openNew('achievements')} onEdit={(id) => openEdit('achievements', id)} onDelete={(id) => deleteRecord('achievements', id)} />}
        {ready && activeTab === 'events' && <ContentManager type="events" title="News & events" intro="Keep families connected to what's happening at school." items={filteredEvents} allCount={data.events.length} query={query} setQuery={setQuery} onAdd={() => openNew('events')} onEdit={(id) => openEdit('events', id)} onDelete={(id) => deleteRecord('events', id)} />}
        {ready && activeTab === 'gallery' && <GalleryManager items={filteredGallery} allCount={data.gallery.length} query={query} setQuery={setQuery} onAdd={() => openNew('gallery')} onEdit={(id) => openEdit('gallery', id)} onDelete={(id) => deleteRecord('gallery', id)} />}
        {ready && activeTab === 'inquiries' && <InquiriesPanel inquiries={inquiries} onStatus={async (id, status) => { try { await changeInquiryStatus(id, status); notify('Enquiry status updated.'); } catch { notify('Unable to update status.'); } }} />}
        {ready && activeTab === 'settings' && <SettingsPanel settings={settingsDraft} setSettings={setSettingsDraft} onSave={saveSettings} saving={saving} />}
      </main>
      <footer className="admin-content-footer"><span>Majin Schools CMS <i>·</i> Concept workspace</span><span><span className="admin-footer-dot" /> {adminUsesSupabase() ? 'Supabase connection configured' : 'Browser demo storage'} </span></footer>
    </div>
    <AnimatePresence>{modalType && <ContentModal type={modalType} editing={editingId ? (data[modalType] as unknown as Array<Record<string, string>>).find((x) => x.id === editingId) || null : null} onClose={() => setModalType(null)} onSave={saveRecord} saving={saving} />}</AnimatePresence>
    <AnimatePresence>{toast && <motion.div className="admin-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><Check size={16} />{toast}</motion.div>}</AnimatePresence>
  </div>;
}

function Overview({ data, inquiries, onNavigate }: { data: SiteData; inquiries: ReturnType<typeof useSiteData>['inquiries']; onNavigate: (tab: TabKey) => void }) {
  const recentInquiries = inquiries.slice(0, 4);
  return <div className="admin-overview"><div className="admin-page-heading"><div><span className="eyebrow"><i />YOUR SCHOOL AT A GLANCE</span><h1>Good morning,<br /><em>let's make it matter.</em></h1><p>Here's what's happening across your school website.</p></div><Link to="/" target="_blank" className="button button-outline-dark">Preview website <ArrowUpRight size={16} /></Link></div><div className="admin-metric-grid">{[{ label: 'Top students', value: (data.meritStudents || []).length, icon: Award, note: 'Board toppers & merit', tab: 'toppers' as TabKey }, { label: 'Faculty profiles', value: data.faculty.length, icon: Users, note: 'People behind the progress', tab: 'faculty' as TabKey }, { label: 'Achievements', value: data.achievements.length, icon: GraduationCap, note: 'Stories worth celebrating', tab: 'achievements' as TabKey }, { label: 'Upcoming events', value: data.events.filter((e) => new Date(`${e.date}T23:59:00`) >= new Date()).length, icon: CalendarDays, note: 'Keep your community close', tab: 'events' as TabKey }, { label: 'New enquiries', value: inquiries.filter((i) => i.status === 'New').length, icon: MessageSquare, note: `${inquiries.length} total received`, tab: 'inquiries' as TabKey }].map((m) => <button className="admin-metric-card" key={m.label} onClick={() => onNavigate(m.tab)}><span className="metric-icon"><m.icon size={19} /></span><span className="metric-label">{m.label}</span><strong>{String(m.value).padStart(2, '0')}</strong><span className="metric-note">{m.note}</span><ArrowUpRight size={16} className="metric-link-icon" /></button>)}</div><div className="admin-overview-grid"><section className="admin-panel admin-recent-panel"><div className="admin-panel-heading"><div><span className="panel-kicker">ADMISSIONS</span><h3>Recent enquiries</h3></div><button onClick={() => onNavigate('inquiries')}>View all <ArrowUpRight size={14} /></button></div>{recentInquiries.length ? <div className="recent-inquiry-list">{recentInquiries.map((inq) => <div className="recent-inquiry" key={inq.id}><span className="inquiry-avatar">{inq.parentName.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}</span><span className="recent-inquiry-details"><strong>{inq.parentName}</strong><small>{inq.applyingFor} · {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</small></span><span className={`status-chip status-${inq.status.toLowerCase().replace(/\s/g, '-')}`}>{inq.status}</span></div>)}</div> : <div className="admin-empty-state"><span><MessageSquare size={23} /></span><h4>Your next great conversation starts here.</h4><p>New admission enquiries will appear in this space.</p><button onClick={() => onNavigate('inquiries')}>Open enquiry inbox <ArrowUpRight size={14} /></button></div>}</section><section className="admin-panel admin-quick-panel"><div className="admin-panel-heading"><div><span className="panel-kicker">QUICK ACTIONS</span><h3>Make an update</h3></div><span className="quick-panel-icon"><ArrowDownRight size={17} /></span></div><div className="quick-actions-list">{[{ label: 'Add a merit student', hint: 'Publish a board topper', tab: 'toppers' as TabKey, icon: Award }, { label: 'Add a faculty profile', hint: 'Introduce an educator', tab: 'faculty' as TabKey, icon: Users }, { label: 'Share an achievement', hint: 'Celebrate a milestone', tab: 'achievements' as TabKey, icon: GraduationCap }, { label: 'Publish an event', hint: 'Let families know', tab: 'events' as TabKey, icon: CalendarDays }, { label: 'Refresh the gallery', hint: 'Add a campus moment', tab: 'gallery' as TabKey, icon: Image }].map((a) => <button key={a.label} onClick={() => onNavigate(a.tab)}><span><a.icon size={17} /></span><div><strong>{a.label}</strong><small>{a.hint}</small></div><ArrowUpRight size={15} /></button>)}</div></section></div><section className="admin-welcome-banner"><div className="welcome-banner-symbol"><BookOpen size={24} /></div><div><span>THE MAJIN EXPERIENCE</span><h3>Every update is a chance to tell a better story.</h3><p>Keep the details accurate. Keep the people at the centre. Keep the possibility visible.</p></div><Link to="/" target="_blank" aria-label="Open public website"><ArrowUpRight size={21} /></Link></section><div className="admin-demo-alert"><span><Bell size={17} /></span><p><strong>You're working with demo content.</strong> Replace illustrative names, results, contact details, and imagery with verified school information before publishing.</p></div></div>;
}

function ContentManager({ type, title, intro, items, allCount, query, setQuery, onAdd, onEdit, onDelete }: { type: ContentKey; title: string; intro: string; items: Array<FacultyMember | Achievement | SchoolEvent | MeritStudent>; allCount: number; query: string; setQuery: (query: string) => void; onAdd: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
  const config = contentConfig[type];
  const getTitle = (item: FacultyMember | Achievement | SchoolEvent | MeritStudent) => 'name' in item ? item.name : item.title;
  const getSubtitle = (item: FacultyMember | Achievement | SchoolEvent | MeritStudent) => 'rankOrScore' in item ? `${item.rankOrScore} · ${item.examOrCategory}` : 'subject' in item ? item.subject : 'accolade' in item ? item.accolade : item.category;
  const getDate = (item: FacultyMember | Achievement | SchoolEvent | MeritStudent) => 'year' in item ? `Batch ${item.year}` : 'date' in item ? item.date : item.experience;
  const getImage = (item: FacultyMember | Achievement | SchoolEvent | MeritStudent) => item.image;
  return <div className="admin-manage-page"><div className="admin-manage-heading"><div><span className="eyebrow"><i />CONTENT MANAGEMENT</span><h1>{title}</h1><p>{intro}</p></div><button className="button button-navy" onClick={onAdd}><Plus size={17} /> Add {config.singular} <ArrowUpRight size={15} /></button></div><div className="admin-table-panel"><div className="admin-list-toolbar"><div className="admin-list-count"><strong>{String(allCount).padStart(2, '0')}</strong><span>published entries</span></div><label className="admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${type}…`} /></label><span className="admin-filter-tag"><i /> All entries</span></div>{items.length ? <div className="admin-content-list"><div className="admin-content-list-head"><span>CONTENT</span><span>DETAILS</span><span>DATE / STATUS</span><span>ACTIONS</span></div>{items.map((item) => <div className="admin-content-row" key={item.id}><div className="admin-list-title"><img src={getImage(item)} alt="" /><span><strong>{getTitle(item)}</strong><small>{item.id}</small></span></div><span className="admin-list-secondary">{getSubtitle(item)}</span><span className="admin-list-date">{getDate(item)}</span><div className="admin-row-actions"><button onClick={() => onEdit(item.id)} aria-label={`Edit ${getTitle(item)}`}><Pencil size={15} /></button><button onClick={() => onDelete(item.id)} aria-label={`Delete ${getTitle(item)}`}><Trash2 size={15} /></button></div></div>)}</div> : <div className="admin-no-results"><Search size={24} /><h3>No matching entries</h3><p>Try another search term or add a new entry.</p><button className="button button-outline-dark" onClick={onAdd}><Plus size={16} /> Add {config.singular}</button></div>}</div><p className="admin-footnote"><ShieldCheck size={15} /> Changes are reflected on the public website as soon as they're saved.</p></div>;
}

function GalleryManager({ items, allCount, query, setQuery, onAdd, onEdit, onDelete }: { items: GalleryItem[]; allCount: number; query: string; setQuery: (query: string) => void; onAdd: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
  return <div className="admin-manage-page"><div className="admin-manage-heading"><div><span className="eyebrow"><i />CONTENT MANAGEMENT</span><h1>Campus gallery</h1><p>Collect the little moments that tell the bigger school story.</p></div><button className="button button-navy" onClick={onAdd}><Plus size={17} /> Add gallery item <ArrowUpRight size={15} /></button></div><div className="admin-list-toolbar admin-gallery-toolbar"><div className="admin-list-count"><strong>{String(allCount).padStart(2, '0')}</strong><span>gallery entries</span></div><label className="admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search gallery…" /></label><span className="admin-filter-tag"><i /> All categories</span></div><div className="admin-gallery-grid">{items.map((item) => <div className="admin-gallery-card" key={item.id}><div className="admin-gallery-image"><img src={item.image} alt={item.title} /><span>{item.category}</span><div className="admin-gallery-actions"><button onClick={() => onEdit(item.id)} aria-label={`Edit ${item.title}`}><Pencil size={15} /></button><button onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div></div><div className="admin-gallery-card-copy"><strong>{item.title}</strong><small>{item.id}</small></div></div>)}</div>{!items.length && <div className="admin-no-results"><Image size={24} /><h3>No images found</h3><p>Add a gallery item to begin.</p></div>}<p className="admin-footnote"><ShieldCheck size={15} /> Use image URLs from an approved image library or your school's media storage.</p></div>;
}

function InquiriesPanel({ inquiries, onStatus }: { inquiries: ReturnType<typeof useSiteData>['inquiries']; onStatus: (id: string, status: 'New' | 'Contacted' | 'Visit scheduled' | 'Closed') => void }) {
  return <div className="admin-manage-page"><div className="admin-manage-heading"><div><span className="eyebrow"><i />ADMISSIONS WORKSPACE</span><h1>Admissions enquiries</h1><p>Every enquiry is the beginning of a possible school story.</p></div><span className="admin-inquiry-summary"><strong>{inquiries.filter((i) => i.status === 'New').length}</strong> need a response</span></div><div className="admin-table-panel"><div className="admin-list-toolbar"><div className="admin-list-count"><strong>{String(inquiries.length).padStart(2, '0')}</strong><span>total enquiries</span></div><span className="admin-filter-tag"><i /> Live inbox</span></div>{inquiries.length ? <div className="admin-content-list"><div className="admin-inquiry-table-head"><span>PARENT / STUDENT</span><span>CONTACT</span><span>INTERESTED IN</span><span>STATUS</span></div>{inquiries.map((inq) => <div className="admin-inquiry-row" key={inq.id}><div className="admin-inquiry-person"><span className="inquiry-avatar">{inq.parentName.slice(0, 1).toUpperCase()}</span><div><strong>{inq.parentName}</strong><small>{inq.studentName || 'Student name not provided'} · {new Date(inq.createdAt).toLocaleDateString('en-IN')}</small>{inq.message && <p>{inq.message}</p>}</div></div><div className="admin-inquiry-contact"><a href={`mailto:${inq.email}`}>{inq.email}</a><a href={`tel:${inq.phone}`}>{inq.phone}</a></div><span className="admin-list-secondary">{inq.applyingFor}<small>Current: {inq.currentGrade || 'Not specified'}</small></span><select className={`inquiry-status-select status-${inq.status.toLowerCase().replace(/\s/g, '-')}`} value={inq.status} onChange={(e) => onStatus(inq.id, e.target.value as 'New' | 'Contacted' | 'Visit scheduled' | 'Closed')} aria-label={`Status for ${inq.parentName}`}><option>New</option><option>Contacted</option><option>Visit scheduled</option><option>Closed</option></select></div>)}</div> : <div className="admin-no-results"><MessageSquare size={25} /><h3>No enquiries yet</h3><p>When a parent completes the enquiry form, the details will show up here.</p><Link to="/admissions" target="_blank" className="button button-outline-dark">Preview enquiry form <ArrowUpRight size={15} /></Link></div>}</div><p className="admin-footnote"><ShieldCheck size={15} /> Treat contact information as confidential. In browser-demo mode, data is stored only in this browser.</p></div>;
}

function SettingsPanel({ settings, setSettings, onSave, saving }: { settings: SiteSettings; setSettings: (settings: SiteSettings) => void; onSave: (e: FormEvent) => void; saving: boolean }) {
  const update = (key: keyof SiteSettings, value: string) => setSettings({ ...settings, [key]: value });
  return <div className="admin-manage-page admin-settings-page"><div className="admin-manage-heading"><div><span className="eyebrow"><i />SITE CONFIGURATION</span><h1>School settings</h1><p>Keep the school's identity, contact details, and homepage message up to date.</p></div></div><form className="admin-settings-form" onSubmit={onSave}><div className="admin-settings-intro"><span><Settings size={20} /></span><div><h3>School identity</h3><p>These details are used in the website header, footer, and enquiry pathways.</p></div></div><div className="settings-form-grid"><label>School name<input value={settings.schoolName} onChange={(e) => update('schoolName', e.target.value)} required /></label><label>Tagline<input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} required /></label><label>Contact phone<input value={settings.phone} onChange={(e) => update('phone', e.target.value)} required /></label><label>Contact email<input type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} required /></label><label>Academic year<input value={settings.academicYear} onChange={(e) => update('academicYear', e.target.value)} required /></label><label>School address<input value={settings.address} onChange={(e) => update('address', e.target.value)} required /></label><label className="settings-full">Homepage headline<textarea value={settings.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} rows={2} required /></label><label className="settings-full">Homepage description<textarea value={settings.heroDescription} onChange={(e) => update('heroDescription', e.target.value)} rows={3} required /></label></div><div className="settings-form-bottom"><p><ShieldCheck size={15} /> Save changes to update the public school website.</p><button className="button button-navy" type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save settings'} <ArrowUpRight size={15} /></button></div></form><div className="admin-demo-alert"><span><CircleHelp size={17} /></span><p><strong>Before launch:</strong> Replace demo contact details, verify all school claims, and publish an accurate privacy notice and applicable school disclosures.</p></div></div>;
}

function ContentModal({ type, editing, onClose, onSave, saving }: { type: ContentKey; editing: Record<string, string> | null; onClose: () => void; onSave: (type: ContentKey, values: Record<string, string>) => void; saving: boolean }) {
  const config = contentConfig[type];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(config.fields.map((f) => [f.key, editing?.[f.key] || ''])));
  const [error, setError] = useState('');
  function submit(e: FormEvent) { e.preventDefault(); if (config.fields.some((f) => f.required && !values[f.key]?.trim())) { setError('Please complete all required fields.'); return; } onSave(type, values); }
  return <motion.div className="admin-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="admin-content-modal" initial={{ y: 20, opacity: 0, scale: .985 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 14, opacity: 0, scale: .985 }} transition={{ duration: .25 }} onClick={(e) => e.stopPropagation()}><div className="admin-modal-header"><div><span className="eyebrow"><i />{editing ? 'EDIT CONTENT' : 'NEW CONTENT'}</span><h2>{editing ? 'Make an update.' : `Add ${config.singular}.`}</h2><p>Details here will appear on the public school website.</p></div><button onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div><form onSubmit={submit} className="admin-content-form"><div className="admin-modal-fields">{config.fields.map((field) => <label key={field.key} className={field.type === 'textarea' ? 'admin-field-full' : ''}>{field.label}{field.required && <i> *</i>}{field.type === 'textarea' ? <textarea rows={4} value={values[field.key] || ''} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} placeholder={field.placeholder || ''} required={field.required} /> : <input type={field.type || 'text'} value={values[field.key] || ''} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} placeholder={field.placeholder || ''} required={field.required} />}</label>)}</div>{error && <p className="admin-form-error">{error}</p>}<div className="admin-modal-actions"><button className="button button-outline-dark" type="button" onClick={onClose}>Cancel</button><button className="button button-navy" type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add to website'} <ArrowUpRight size={16} /></button></div></form></motion.div></motion.div>;
}
