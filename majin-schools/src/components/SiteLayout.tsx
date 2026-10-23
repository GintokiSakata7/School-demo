import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X, Instagram, Facebook, Youtube, ArrowUp, Phone, MapPin, Mail, Home } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brand } from './Brand';
import { useSiteData } from '../context/SiteDataContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Our story', to: '/about' },
  { label: 'Learning', to: '/academics', sub: [{ label: 'Academic approach', to: '/academics' }, { label: 'Student life', to: '/student-life' }, { label: 'Faculty', to: '/faculty' }] },
  { label: 'Top Students', to: '/toppers' },
  { label: 'Our people', to: '/faculty' },
  { label: 'Discover', to: '/campus', sub: [{ label: 'Campus & facilities', to: '/campus' }, { label: 'Merit List & Toppers', to: '/toppers' }, { label: 'Achievements', to: '/achievements' }, { label: 'News & events', to: '/news' }] },
];

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useSiteData();

  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    handle(); window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Keyboard shortcut for Home (Alt+H or Home key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isInput) return;
      if ((e.altKey && (e.key === 'h' || e.key === 'H')) || (e.key === 'Home' && !e.ctrlKey && !e.shiftKey)) {
        e.preventDefault();
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return <div className="site-shell">
    <div className="topline"><span>Learning for a world in motion · 100% CBSE Pass Rate</span><span className="topline-right"><Link to="/toppers" style={{ color: 'inherit', textDecoration: 'none', marginRight: '14px' }}>Board Merit List ↗</Link>Admissions open for {data.settings.academicYear} <ArrowUpRight size={12} /></span></div>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map((item) => item.sub ? <div className="nav-dropdown" key={item.label}>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={item.to}>{item.label}<ChevronDown size={13} /></NavLink>
          <div className="dropdown-panel">{item.sub.map((sub) => <Link key={sub.to} to={sub.to}>{sub.label}<ArrowUpRight size={14} /></Link>)}</div>
        </div> : <NavLink key={item.label} end={item.to === '/'} accessKey={item.to === '/' ? 'h' : undefined} title={item.to === '/' ? 'Home (Shortcut: Alt+H)' : undefined} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={item.to}>{item.label}</NavLink>)}
      </nav>
      <div className="header-actions"><Link className="header-cta" to="/admissions">Admissions <ArrowUpRight size={15} /></Link><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    {menuOpen && <div className="mobile-menu"><div className="mobile-menu-inner"><p className="eyebrow"><i />Explore Majin</p>{[
      { label: 'Home', to: '/' },
      { label: 'Top Students & Merit List', to: '/toppers' },
      { label: 'Our story', to: '/about' },
      { label: 'Learning & Academics', to: '/academics' },
      { label: 'Our people', to: '/faculty' },
      { label: 'Student life', to: '/student-life' },
      { label: 'Campus & facilities', to: '/campus' },
      { label: 'Achievements', to: '/achievements' },
      { label: 'News & events', to: '/news' },
      { label: 'Contact', to: '/contact' }
    ].map((item, index) => <Link key={`${item.to}-${index}`} to={item.to}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={18} /></Link>)}<Link className="mobile-menu-cta" to="/admissions">Begin your admissions journey <ArrowUpRight size={17} /></Link></div></div>}
    <main><Outlet /></main>
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block"><Brand light /><p>A place where curious minds find their voice, discover their strengths, and shape what comes next.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={17} /></a><a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook size={17} /></a><a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer"><Youtube size={17} /></a></div></div>
        <div className="footer-col"><span className="footer-label">Explore</span><Link to="/">Home</Link><Link to="/toppers">Top Students</Link><Link to="/about">Our story</Link><Link to="/academics">Academics</Link><Link to="/faculty">Our people</Link><Link to="/student-life">Student life</Link></div>
        <div className="footer-col"><span className="footer-label">Discover</span><Link to="/toppers">Merit List & Toppers</Link><Link to="/achievements">Achievements</Link><Link to="/campus">Campus & facilities</Link><Link to="/news">News & events</Link><Link to="/admissions">Admissions</Link></div>
        <div className="footer-col footer-contact"><span className="footer-label">Say hello</span><a href={`tel:${data.settings.phone.replace(/\s/g, '')}`}><Phone size={15} />{data.settings.phone}</a><a href={`mailto:${data.settings.email}`}><Mail size={15} />{data.settings.email}</a><span><MapPin size={15} />{data.settings.address}</span><Link className="footer-contact-cta" to="/contact">Plan a visit <ArrowUpRight size={15} /></Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {data.settings.schoolName}. All rights reserved.</span><span className="demo-note">A concept website · Demo content to be verified</span><div><Link to="/">Home</Link><Link to="/toppers">Merit List</Link><Link to="/contact">Contact</Link><Link to="/admin">School admin ↗</Link><a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Back to top"><ArrowUp size={15} /></a></div></div>
    </footer>
    <a className="mobile-admissions-pill" href="/admissions" onClick={(e) => { e.preventDefault(); window.location.href = '/admissions'; }}>Enquire now <ArrowUpRight size={16} /></a>
  </div>;
}

