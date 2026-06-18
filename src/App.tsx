/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import LayananDetail from './components/LayananDetail';
import TentangKami from './components/TentangKami';
import BlogPage from './components/BlogPage';
import KontakOnline from './components/KontakOnline';
import AuthModal from './components/AuthModal';
import DashboardClient from './components/DashboardClient';
import DashboardAdmin from './components/DashboardAdmin';
import PendaftaranOnline from './components/PendaftaranOnline';
import AlumniPage from './components/AlumniPage';
import { compressImage } from './utils/imageCompressor';

import { 
  ActiveTab, 
  ServiceTab, 
  User, 
  ProgramRegistration, 
  PaymentTransaction, 
  PsychologicalResult, 
  CounselingSession,
  SiteSettings,
  Student,
  Alumni
} from './types';

import { 
  INITIAL_REGISTRATIONS, 
  INITIAL_PAYMENTS, 
  INITIAL_RESULTS, 
  INITIAL_SESSIONS,
  DEFAULT_SITE_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_ALUMNI
} from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [serviceSubTab, setServiceSubTab] = useState<ServiceTab>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Persistent Website Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('azta_site_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.backgroundImageUrl === '/src/assets/images/bg_azta_1781689948341.jpg') {
          parsed.backgroundImageUrl = '/bg_azta_1781689948341.jpg';
        }
        if (!parsed.services) {
          parsed.services = DEFAULT_SITE_SETTINGS.services;
        }
        if (!parsed.benefits) {
          parsed.benefits = DEFAULT_SITE_SETTINGS.benefits;
        }
        if (parsed.showServicesOnHome === undefined) {
          parsed.showServicesOnHome = true;
        }
        if (parsed.showBenefitsOnHome === undefined) {
          parsed.showBenefitsOnHome = true;
        }
        localStorage.setItem('azta_site_settings', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        // use default
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem('azta_site_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error("Gagal menyimpan kustomisasi tampilan:", e);
      alert("Penyimpanan browser penuh. Mohon kompres beberapa gambar latar belakang/logo Anda.");
    }
  };


  // Core application database tables (Simulated)
  const [registrations, setRegistrations] = useState<ProgramRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [results, setResults] = useState<PsychologicalResult[]>([]);
  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('azta_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return INITIAL_STUDENTS;
  });

  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('azta_students', JSON.stringify(newStudents));
    } catch (e) {
      console.error("Gagal menyimpan data siswa:", e);
      alert("Penyimpanan browser penuh. Sebagian data siswa mungkin tidak tersimpan permanen.");
    }
  };

  const [alumni, setAlumni] = useState<Alumni[]>(() => {
    const saved = localStorage.getItem('azta_alumni');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return INITIAL_ALUMNI;
  });

  const handleUpdateAlumni = (newAlumni: Alumni[]) => {
    setAlumni(newAlumni);
    try {
      localStorage.setItem('azta_alumni', JSON.stringify(newAlumni));
    } catch (e) {
      console.error("Gagal menyimpan data alumni:", e);
      alert("⚠️ Gagal menyimpan permanen ke browser Anda karena penyimpanan lokal penuh (Local Storage Quota Exceeded). Mohon kompres foto/gambar alumni yang Anda ulas!");
    }
  };

  // Seed mock data table once on startup
  useEffect(() => {
    setRegistrations(INITIAL_REGISTRATIONS);
    setPayments(INITIAL_PAYMENTS);
    setResults(INITIAL_RESULTS);
    setSessions(INITIAL_SESSIONS);

    // Fetch latest persistent data from dev server workspace if available
    fetch('/api/workspace-data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.siteSettings) {
            setSiteSettings(data.siteSettings);
            localStorage.setItem('azta_site_settings', JSON.stringify(data.siteSettings));
          }
          if (data.students) {
            setStudents(data.students);
            localStorage.setItem('azta_students', JSON.stringify(data.students));
          }
          if (data.alumni) {
            setAlumni(data.alumni);
            localStorage.setItem('azta_alumni', JSON.stringify(data.alumni));
          }
        }
      })
      .catch(err => console.log('Notice: Dev-sync server not reachable, using static bundle fallbacks.'));

    // Clean initial scroll
    window.scrollTo(0, 0);

    // Automatically optimize existing alumni base64 photos to free up raw storage bytes
    async function optimizeAlumniStorage() {
      let changed = false;
      const optimizedAlumni = await Promise.all(
        alumni.map(async (item) => {
          if (item.photoUrl && item.photoUrl.startsWith('data:image/') && item.photoUrl.length > 80000) {
            try {
              const compressed = await compressImage(item.photoUrl, 200, 260, 0.7);
              if (compressed.length < item.photoUrl.length) {
                changed = true;
                return { ...item, photoUrl: compressed };
              }
            } catch (err) {
              console.warn("Gagal mengompresi alumni lama:", err);
            }
          }
          return item;
        })
      );

      if (changed) {
        setAlumni(optimizedAlumni);
        try {
          localStorage.setItem('azta_alumni', JSON.stringify(optimizedAlumni));
          console.log("Penyimpanan alumni sukses dioptimalkan (Free Space recovered)!");
        } catch (e) {
          console.error("Gagal menyimpan optimasi alumni ke localStorage", e);
        }
      }
    }

    if (alumni && alumni.length > 0) {
      setTimeout(optimizeAlumniStorage, 800);
    }
  }, []);

  // Set page scroll to topmost offset instantly during navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, serviceSubTab]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // If successfully logged in, redirect them directly to their relative portal area
    setActiveTab('portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-viewport">
      
      {/* Soft & Elegant Changeable Background Image if configured */}
      {siteSettings.backgroundImageUrl && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${siteSettings.backgroundImageUrl})`, zIndex: -1 }}
        />
      )}
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        setServiceSubTab={setServiceSubTab}
        siteSettings={siteSettings}
      />

      {/* Main Routing Screen Canvas */}
      <main className="flex-grow">
        
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <Homepage 
            setActiveTab={setActiveTab} 
            setServiceSubTab={setServiceSubTab} 
            onOpenAuth={() => setShowAuthModal(true)}
            siteSettings={siteSettings}
          />
        )}

        {/* DETAILED SERVICES VIEW */}
        {activeTab === 'layanan' && (
          <LayananDetail
            serviceSubTab={serviceSubTab}
            setServiceSubTab={setServiceSubTab}
            setActiveTab={setActiveTab}
            siteSettings={siteSettings}
          />
        )}

        {/* ABOUT US VISUAL HISTORIES */}
        {activeTab === 'tentang' && (
          <TentangKami />
        )}

        {/* ALUMNI SUCCESS GALLERY */}
        {activeTab === 'alumni' && (
          <AlumniPage alumniList={alumni} />
        )}

        {/* ARTICLES & EDUCATIONAL BLOGS */}
        {activeTab === 'blog' && (
          <BlogPage />
        )}

        {/* CONTACT US & FAQs ACCORDION */}
        {activeTab === 'kontak' && (
          <KontakOnline siteSettings={siteSettings} />
        )}

        {/* PENDAFTARAN ONLINE VIEW */}
        {activeTab === 'pendaftaran' && (
          <PendaftaranOnline 
            siteSettings={siteSettings} 
            students={students} 
            onUpdateStudents={handleUpdateStudents}
            setActiveTab={setActiveTab}
          />
        )}

        {/* CLIENT / ADMIN INTEGRATED PORAL */}
        {activeTab === 'portal' && (
          <div>
            {!currentUser ? (
              <div className="py-24 px-4 text-center max-w-md mx-auto space-y-6" id="unauthorized-gateway">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-850 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  🔒
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Akses Portal Terenkripsi</h2>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Silakan masuk menggunakan nama akun siswa atau otoritas admin melalui tombol di bawah untuk melihat rekap psikotes ataupun data kasir pembayaran.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
                >
                  Masuk Ke Akun Saya
                </button>
              </div>
            ) : currentUser.role === 'admin' ? (
              <DashboardAdmin
                currentUser={currentUser}
                registrations={registrations}
                setRegistrations={setRegistrations}
                payments={payments}
                setPayments={setPayments}
                results={results}
                setResults={setResults}
                sessions={sessions}
                setSessions={setSessions}
                siteSettings={siteSettings}
                onUpdateSettings={handleUpdateSettings}
                students={students}
                onUpdateStudents={handleUpdateStudents}
                alumni={alumni}
                onUpdateAlumni={handleUpdateAlumni}
              />
            ) : (
              <DashboardClient
                currentUser={currentUser}
                registrations={registrations}
                setRegistrations={setRegistrations}
                payments={payments}
                setPayments={setPayments}
                results={results}
                sessions={sessions}
                setSessions={setSessions}
                siteSettings={siteSettings}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer Details Address & Whatsapp Links */}
      <Footer 
        setActiveTab={setActiveTab} 
        setServiceSubTab={setServiceSubTab} 
        siteSettings={siteSettings}
      />


      {/* Auth Login Dialog Portal */}
      {showAuthModal && (
        <AuthModal
          students={students}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
