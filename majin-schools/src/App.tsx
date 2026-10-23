import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteDataProvider } from './context/SiteDataContext';
import { SiteLayout } from './components/SiteLayout';
import { HomePage, AboutPage, AcademicsPage, FacultyPage, AchievementsPage, StudentLifePage, CampusPage, NewsPage, AdmissionsPage, ContactPage, ToppersPage } from './pages/PublicPages';
import { AdminPage } from './pages/AdminPage';

function NotFound() {
  return <section className="not-found"><span className="eyebrow"><i />WRONG TURN</span><h1>This page went<br /><em>exploring.</em></h1><p>We couldn't find the page you were looking for.</p><a className="button button-navy" href="/">Back to the homepage</a></section>;
}

export default function App() {
  return <BrowserRouter><SiteDataProvider><Routes>
    <Route path="/admin" element={<AdminPage />} />
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="toppers" element={<ToppersPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="academics" element={<AcademicsPage />} />
      <Route path="faculty" element={<FacultyPage />} />
      <Route path="achievements" element={<AchievementsPage />} />
      <Route path="student-life" element={<StudentLifePage />} />
      <Route path="campus" element={<CampusPage />} />
      <Route path="news" element={<NewsPage />} />
      <Route path="admissions" element={<AdmissionsPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes></SiteDataProvider></BrowserRouter>;
}
