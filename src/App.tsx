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
  fetchAllData,
  saveSiteSettings,
  saveStudents,
  saveAlumni,
  saveRegistrations,
  savePayments,
  saveResults,
  saveSessions
} from './database';
import { DEFAULT_SITE_SETTINGS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [serviceSubTab, setServiceSubTab] = useState<ServiceTab>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Core application states loaded from database
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [students, setStudents] = useState<Student[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [registrations, setRegistrations] = useState<ProgramRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [results, setResults] = useState<PsychologicalResult[]>([]);
  const [sessions, setSessions] = useState<CounselingSession[]>([]);

  // Individual persistence updater functions
  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    saveSiteSettings(newSettings);
  };

  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  const handleUpdateAlumni = (newAlumni: Alumni[]) => {
    setAlumni(newAlumni);
    saveAlumni(newAlumni);
  };

  const handleUpdateRegistrations = (newRegs: ProgramRegistration[]) => {
    setRegistrations(newRegs);
    saveRegistrations(newRegs);
  };

  const handleUpdatePayments = (newPayments: PaymentTransaction[]) => {
    setPayments(newPayments);
    savePayments(newPayments);
  };

  const handleUpdateResults = (newResults: PsychologicalResult[]) => {
    setResults(newResults);
    saveResults(newResults);
  };

  const handleUpdateSessions = (newSessions: CounselingSession[]) => {
    setSessions(newSessions);
    saveSessions(newSessions);
  };

  // On initial mount, hydrate all data states precisely from persistent store database
  useEffect(() => {
    fetchAllData().then(data => {
      setSiteSettings(data.siteSettings);
      setStudents(data.students);
      setAlumni(data.alumni);
      setRegistrations(data.registrations);
      setPayments(data.payments);
      setResults(data.results);
      setSessions(data.sessions);
    }).catch(err => {
      console.error("Gagal memuat basis data utama:", err);
    });

    window.scrollTo(0, 0);

    // Automatically optimize existing alumni base64 photos to free up raw storage bytes
    async function optimizeAlumniStorage() {
      let changed = false;
      const currentAlumni = JSON.parse(localStorage.getItem('azta_alumni') || '[]');
      if (!currentAlumni || currentAlumni.length === 0) return;

      const optimizedAlumni = await Promise.all(
        (currentAlumni as Alumni[]).map(async (item) => {
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
        saveAlumni(optimizedAlumni);
        console.log("Penyimpanan alumni sukses dioptimalkan (Free Space recovered)!");
      }
    }

    setTimeout(optimizeAlumniStorage, 1500);
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
                setRegistrations={handleUpdateRegistrations}
                payments={payments}
                setPayments={handleUpdatePayments}
                results={results}
                setResults={handleUpdateResults}
                sessions={sessions}
                setSessions={handleUpdateSessions}
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
                setRegistrations={handleUpdateRegistrations}
                payments={payments}
                setPayments={handleUpdatePayments}
                results={results}
                sessions={sessions}
                setSessions={handleUpdateSessions}
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
