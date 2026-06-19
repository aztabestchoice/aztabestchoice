/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, ServiceTab, SiteSettings } from '../types';
import { ALUMNI_TESTIMONIALS } from '../mockData';
import { 
  GraduationCap, 
  FileText, 
  Heart, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  MessageCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface HomepageProps {
  setActiveTab: (tab: ActiveTab) => void;
  setServiceSubTab: (subTab: ServiceTab) => void;
  onOpenAuth: () => void;
  siteSettings?: SiteSettings;
}

export default function Homepage({ setActiveTab, setServiceSubTab, onOpenAuth, siteSettings }: HomepageProps) {
  
  const cleanPhone = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned || '628113000888';
  };

  const handleServiceNavigate = (subTab: ServiceTab) => {
    setActiveTab('layanan');
    setServiceSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterFlow = () => {
    setActiveTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const partners = siteSettings?.partners && siteSettings.partners.length > 0 ? siteSettings.partners : [
    { id: 'partner-1', name: 'Polda Jawa Timur', type: 'Instansi Seleksi' },
    { id: 'partner-2', name: 'Kodam Brawijaya', type: 'Instansi Seleksi' },
    { id: 'partner-3', name: 'PT Kereta Api Indonesia', type: 'BUMN' },
    { id: 'partner-4', name: 'Bank Mandiri', type: 'Perbankan BUMN' },
    { id: 'partner-5', name: 'Kemenkumham RI', type: 'Kedinasan / PNS' },
    { id: 'partner-6', name: 'HIMPSI Jatim', type: 'Asosiasi Resmi' }
  ];

  return (
    <div className="bg-slate-50 font-sans" id="homepage-root">
      
      {/* 1. BENTO MAIN GRID TOP-FOLD */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-12" id="hero-bento-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Item 1: Giant Hero Block (Col-span 8) */}
          <div className="lg:col-span-8 bg-emerald-900 rounded-[2rem] p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden bento-card-colored shadow-sm">
            {/* Abstract ambient backdrop light circles */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-800 rounded-full opacity-45 pointer-events-none" />
            <div className="absolute right-12 top-12 w-24 h-24 border-4 border-emerald-400 rounded-full opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-600/50 rounded-full px-3 py-1.5 text-xs text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span>Bimbingan Psikotes & Konseling Madiun</span>
              </div>
              
              <h1 className="font-display font-extrabold text-3xl sm:text-[2.5rem] leading-tight tracking-tight text-white">
                {siteSettings?.heroTitle || 'Wujudkan Impian Masa Depan Anda'}
              </h1>
              
              <p className="font-sans text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {siteSettings?.heroSubtitle || 'Lembaga bimbingan psikotes dan konseling terpercaya di Madiun. Kami melatih kesiapan mental TNI-POLRI, Kedinasan, BUMN, serta menyediakan tes IQ & Minat Bakat resmi terakreditasi Psikolog.'}
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <button
                  onClick={handleRegisterFlow}
                  className="font-sans font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  id="hero-cta-register"
                >
                  {siteSettings?.heroCtaPrimary || 'Daftar Sekarang'}
                </button>
                
                <button
                  onClick={() => handleServiceNavigate('konseling')}
                  className="font-sans font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full bg-emerald-800 border border-emerald-700/80 hover:bg-emerald-750 text-white transition-all cursor-pointer"
                  id="hero-cta-counsel"
                >
                  {siteSettings?.heroCtaSecondary || 'Konsultasi Gratis'}
                </button>
              </div>
            </div>

            {/* Micro details counter inline */}
            <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-emerald-800/70 max-w-md relative z-10">
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-amber-450 leading-none">
                  {siteSettings?.stat1Value || '94.8%'}
                </p>
                <p className="text-[9px] text-emerald-250 uppercase tracking-wider font-bold mt-1">
                  {siteSettings?.stat1Label || 'Lulus Seleksi'}
                </p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-amber-450 leading-none">
                  {siteSettings?.stat2Value || '1,500+'}
                </p>
                <p className="text-[9px] text-emerald-250 uppercase tracking-wider font-bold mt-1">
                  {siteSettings?.stat2Label || 'Alumni Taruna'}
                </p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-amber-450 leading-none">
                  {siteSettings?.stat3Value || 'Psikolog'}
                </p>
                <p className="text-[9px] text-emerald-250 uppercase tracking-wider font-bold mt-1">
                  {siteSettings?.stat3Label || 'HIMPSI Resmi'}
                </p>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Integrated Portal Quick Access (Col-span 4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-xs bento-card-white text-slate-900">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Portal Akses</span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Dashboard Sistem</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Kelola pendaftaran taruna bimbingan, verifikasi tagihan kasir, dan pantau hasil ujian psikotes kepribadian secara realtime.
              </p>
            </div>

            <div className="space-y-3 my-6">
              <button 
                onClick={handleRegisterFlow}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
              >
                <span className="font-semibold text-xs text-slate-700 group-hover:text-slate-950 transition-colors">Portal Siswa & Pendaftar</span>
                <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">&#8594;</span>
              </button>

              <button 
                onClick={onOpenAuth}
                className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100/60 transition-colors text-left group cursor-pointer"
              >
                <span className="font-semibold text-xs text-emerald-900 group-hover:text-emerald-950 transition-colors">Admin & Pengelola Bimbel</span>
                <span className="text-emerald-900 font-bold group-hover:translate-x-1 transition-transform">&#8594;</span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-[9px] text-slate-400 italic font-medium">
                Terintegrasi dengan Payment Gateway & Hasil Tes Realtime
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INSTANT STATS ROW */}
      <section className="bg-white border-y border-slate-200 py-8 shadow-xs" id="quick-stats-row">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-r border-gray-100 last:border-0">
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-900 block">HIMPSI Jatim</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Sertifikasi & Izin Praktik Dewan Psikologi</p>
          </div>
          <div className="p-4 border-r border-gray-100 last:border-0">
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-900 block">Akurasi Presisi</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Materi Simulasi Psikotes Sangat Akurat</p>
          </div>
          <div className="p-4 border-r border-gray-100 last:border-0">
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-900 block">100% Privat</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Kerahasiaan Hasil Asesmen Sangat Aman</p>
          </div>
          <div className="p-4 border-r border-gray-100 last:border-0">
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-900 block">Taman, Madiun</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Akses Bimbingan Offline Nyaman & Representatif</p>
          </div>
        </div>
      </section>

      {/* 3. TENTANG KAMI SEKILAS */}
      <section className="py-20 px-4 max-w-7xl mx-auto" id="about-us-summary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">Sekilas Tentang Azta</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-emerald-950 tracking-tight leading-tight">
              Pusat Pengembangan Potensi Unggul & Kesiapan Mental Taruna di Madiun
            </h2>
            <div className="h-1 w-20 bg-amber-400 rounded-full my-6" />
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Didirikan dengan visi melahirkan talenta-talenta luar biasa Jawa Timur yang tangguh, cerdas, dan siap mengabdi pada bangsa. <strong>Azta Best Choice</strong> memadukan ilmu psikologi kognitif modern dengan strategi pengerjaan taktis untuk membentuk profil unggul peserta didik.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Lembaga kami tidak hanya menekankan pada keahlian mekanis ("menghafal pola soal"), tetapi melatih daya konsentrasi, kekuatan fokus mental, serta pengendalian emosi yang menjadi pilar keguguran terbesar peserta bintara, tamtama, maupun taruna akademi.
            </p>

            <button
              onClick={() => setActiveTab('tentang')}
              className="inline-flex items-center space-x-2 text-sm text-emerald-800 hover:text-amber-600 font-bold transition-colors"
              id="about-learn-more"
            >
              <span>Pelajari Profil Azta Selengkapnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Vision Box */}
          <div className="bg-emerald-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden" id="vision-statement-card">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-800/40 -mr-10 -mt-10 pointer-events-none" />
            <h3 className="font-sans font-extrabold text-lg sm:text-xl text-amber-300 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Visi Utama Azta</span>
            </h3>
            <p className="font-sans italic text-base sm:text-lg text-emerald-100 leading-relaxed">
              "Menjadi pusat bimbingan psikotes, asesmen psikologi, dan layanan konseling terdepan di wilayah Madiun dan sekitarnya, yang berkomitmen tinggi mengantarkan calon-calon abdi negara, siswa, dan karyawan swasta meraih puncak karier terbaiknya didasari keselarasan mental serta potensi sejati diri."
            </p>
            <div className="mt-8 pt-6 border-t border-emerald-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Akurasi Presisi Berizin Resmi</p>
                <p className="text-[10px] text-emerald-300 mt-1">Azta Best Choice Counseling & Psychology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DETAIL LAYANAN (3 PILAR) */}
      <section className="py-20 bg-slate-100 px-4" id="three-pillars-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">Portofolio Layanan</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-emerald-950 tracking-tight">
              Tiga Pilar Layanan Utama Azta
            </h2>
            <p className="text-xs text-gray-500 mt-2">Pilih pilar program kami untuk mempelajari struktur kurikulum bimbingan instansi, asesmen mental, dan konseling privat</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilar 1: Persiapan Seleksi */}
            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 relative" id="pilar-card-seleksi">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-sans font-extrabold text-lg text-emerald-900 mb-2">{siteSettings?.feature1Title || 'Persiapan Seleksi'}</h3>
                <p className="text-xs text-emerald-700/80 leading-relaxed mb-6">{siteSettings?.feature1Desc || 'Pelatihan intensif Psikotes TNI-POLRI, BUMN, & Kedinasan dengan simulasi fisik dan mental akurat.'}</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bimbel Psikotes Terpadu TNI-POLRI</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Latihan Simulasi CAT Terkomputerisasi</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Persiapan Wawancara Kerja & SKB</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => handleServiceNavigate('seleksi')}
                className="w-full text-center py-2.5 rounded-xl bg-white border border-emerald-200/80 hover:bg-emerald-100/50 text-emerald-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Pelajari Program
              </button>
            </div>

            {/* Pilar 2: Asesmen Psikologi */}
            <div className="bg-sky-50 rounded-[2rem] p-8 border border-sky-100 flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 relative" id="pilar-card-asesmen">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6">
                  <FileText className="w-5 h-5 text-sky-700" />
                </div>
                <h3 className="font-sans font-extrabold text-lg text-sky-900 mb-2">{siteSettings?.feature2Title || 'Asesmen Psikologi'}</h3>
                <p className="text-xs text-sky-700/80 leading-relaxed mb-6 font-medium">{siteSettings?.feature2Desc || 'Tes IQ, Minat & Bakat untuk pemetaan karier dan penjurusan sekolah menggunakan instrumen standar nasional.'}</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-2 text-xs text-sky-700">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Tes IQ / Inteligensi Anak & Dewasa</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-sky-700">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Tes Penjurus Karier & Bakat Minat</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-sky-700">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Pengukuran Kognitif Akademik Taruna</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => handleServiceNavigate('asesmen')}
                className="w-full text-center py-2.5 rounded-xl bg-white border border-sky-200/80 hover:bg-sky-100/50 text-sky-850 font-bold text-xs transition-colors cursor-pointer"
              >
                Cek Jadwal Tes
              </button>
            </div>

            {/* Pilar 3: Layanan Konseling */}
            <div className="bg-rose-50 rounded-[2rem] p-8 border border-rose-100 flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 relative" id="pilar-card-konseling">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-sans font-extrabold text-lg text-rose-900 mb-2">{siteSettings?.feature3Title || 'Layanan Konseling'}</h3>
                <p className="text-xs text-rose-700/80 leading-relaxed mb-6">{siteSettings?.feature3Desc || 'Pendampingan psikologis klinis & pengembangan potensi diri bersama tim psikolog profesional berizin.'}</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-2 text-xs text-rose-700">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Konseling Gangguan Stres, Depresi & Panic</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-rose-700">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Sesi Konsultasi Eksklusif Potensi Diri</span>
                  </li>
                  <li className="flex items-center space-x-2 text-xs text-rose-700">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Post-Assessment Counseling Terarah</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => handleServiceNavigate('konseling')}
                className="w-full text-center py-2.5 rounded-xl bg-white border border-rose-200/80 hover:bg-rose-100/50 text-rose-850 font-bold text-xs transition-colors cursor-pointer"
              >
                Booking Sesi
              </button>
            </div>
          </div>

          {/* Layanan Tambahan (Aktif) */}
          {siteSettings?.showServicesOnHome && siteSettings?.services && siteSettings.services.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200/80 space-y-6">
              <div className="text-left max-w-3xl">
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
                  Pilar Tambahan Spesialis
                </span>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-emerald-950 tracking-tight">
                  Layanan Tambahan & Alat Tes Khusus (Aktif)
                </h3>
                <p className="text-xs text-gray-500 mt-1">Azta menyediakan asesmen psikometrika khusus dengan alat instrumen pendukung terstandarisasi psikolog legal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteSettings.services.map((srv, sIdx) => (
                  <div key={srv.id || sIdx} className="border border-gray-150 rounded-[1.5rem] p-6 hover:shadow-sm hover:border-emerald-200 transition-all bg-white text-left space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5 uppercase tracking-wide">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{srv.title}</span>
                    </h4>
                    <div className="space-y-1">
                      <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">Spesifikasi Alat Ukur / Tes:</p>
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {srv.instruments.map((inst, iIdx) => (
                          <span key={iIdx} className="px-2 py-0.5 bg-emerald-50 text-emerald-950 border border-emerald-100 rounded text-[10px] font-medium font-sans">
                            {inst}
                          </span>
                        ))}
                        {srv.instruments.length === 0 && (
                          <span className="text-[10px] text-gray-400 italic">Hanya materi inti</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manfaat & Tujuan Program Asesmen */}
          {siteSettings?.showBenefitsOnHome && siteSettings?.benefits && siteSettings.benefits.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200/80 text-left" id="home-manfaat-tujuan-section">
              <div className="max-w-3xl">
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
                  Kenapa Memilih Asesmen & Bimbingan Azta?
                </span>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-emerald-950 tracking-tight">
                  Manfaat & Tujuan Program Asesmen
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Asesmen terencana bersama tim profesional kami dirancang matang untuk menghadirkan kontribusi nyata bagi masa depan akademis dan kestabilan mental anak didik:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {siteSettings.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-5 bg-white rounded-2xl border border-gray-150 hover:border-emerald-200 transition-all shadow-xs">
                    <div className="p-1 px-2.5 bg-emerald-100 text-emerald-950 font-black rounded-lg text-xs shrink-0 font-mono">
                      0{idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. MENGAPA MEMILIH KAMI */}
      <section className="py-20 px-4 max-w-7xl mx-auto" id="why-choose-us-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block">Keunggulan Lembaga</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-emerald-950 tracking-tight leading-tight">
              Mengapa Azta Best Choice Menjadi Lembaga Terdepan?
            </h2>
            <div className="h-1 w-20 bg-amber-400 rounded-full" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Kami menetapkan standar bimbingan tinggi yang membedakan Azta dari bimbingan tes biasa. Melalui pengawasan langsung para psikolog senior, kami menjamin kualitas kurikulum bimbingan yang ilmiah, terstandarisasi, dan berkredibilitas tinggi.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tim Psikolog Utama Berizin Resmi</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Seluruh asesmen dan konseling diawasi oleh Psikolog yang memiliki SIP (Surat Izin Praktik) resmi dari HIMPSI (Himpunan Psikologi Indonesia).</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Materi Akurat Selaras (Akurasi Presisi)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Sistem simulasi dan psikotes kami diperbaharui berulang kali agar sesuai dengan pola soal asasi penerimaan TNI-POLRI maupun SKB BUMN terbaru.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pendekatan Personal Terstruktur</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Aspek kognitif, motorik kasar, stamina mental, dan emosi diuji dan dinilai secara individual. Siswa memiliki rapor nilai perkembangan berkala.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Illustration Collage of Azta Prep */}
          <div className="relative flex justify-center" id="collager-illustration">
            <div className="relative w-full max-w-md p-2 bg-white border border-gray-100 shadow-md rounded-2xl">
              <div className="bg-emerald-950 rounded-xl overflow-hidden text-white p-6 sm:p-8 space-y-6">
                <div className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">PROFIL AKURASI</div>
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-lg sm:text-xl">Fasilitas Bimbingan Azta</h3>
                  <p className="text-xs text-emerald-200 leading-relaxed">Suasana bimbingan nyaman dan representatif di pusat kota Madiun, menjamin fokus terbaik selama pengerjaan.</p>
                </div>

                <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-800 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300">Lab Komputer Simulasi CAT</span>
                    <span className="px-2 py-0.5 bg-emerald-800 rounded font-semibold text-[10px] text-amber-300">Tersedia</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300">Ruang Konseling Kedap Nyaman</span>
                    <span className="px-2 py-0.5 bg-emerald-800 rounded font-semibold text-[10px] text-amber-300">Tersedia</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300">Rapor Psikogram Kepribadian</span>
                    <span className="px-2 py-0.5 bg-emerald-800 rounded font-semibold text-[10px] text-amber-300">Eksklusif</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-2 text-slate-400">
                  <span>Madiun, Jawa Timur</span>
                  <span className="text-amber-400 font-bold">⭐ Terakreditasi</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONI/ALUMNI SUCCESS STORIES */}
      <section className="py-20 bg-emerald-950 text-white px-4" id="testimonials-alumni-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-widest block mb-1">Kisah Sukses Alumni</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              Bimbingan Profesional Yang Mengantarkan Mereka Ke Pintu Impian
            </h2>
            <div className="h-1 w-20 bg-amber-400 rounded-full mx-auto my-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ALUMNI_TESTIMONIALS.map((alumni) => (
              <div 
                key={alumni.id} 
                className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-400/30 transition-all group"
                id={`testimoni-card-${alumni.id}`}
              >
                <div className="space-y-4">
                  <span className="inline-block px-2 py-1 rounded bg-amber-400/10 text-amber-300 font-mono text-[10px] uppercase font-bold">
                    {alumni.pilar}
                  </span>
                  
                  <p className="font-sans italic text-xs leading-relaxed text-slate-300">
                    "{alumni.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-3.5 mt-6 pt-6 border-t border-white/5">
                  <img 
                    src={alumni.image} 
                    alt={alumni.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{alumni.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">{alumni.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MITRA / KLIEN INSTANSI */}
      {siteSettings?.showPartnersOnHome !== false && (
        <section className="py-16 bg-white border-y border-gray-100 px-4" id="partners-institutions-grid">
          <div className="max-w-7xl mx-auto text-center" id="partners-container">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-8">
              Mitra Kerja Sama & Klien Instansi Terkait
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-slate-50 border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all flex flex-col justify-center items-center h-24"
                  id={`partner-logo-${index}`}
                >
                  <span className="font-mono text-emerald-900 font-bold text-xs leading-tight text-center">
                    {partner.name}
                  </span>
                  <span className="text-[9px] font-semibold text-amber-600 block text-center uppercase tracking-wider mt-1 leading-none">
                    {partner.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. JADWAL & BOOKING PORTAL REFERRAL */}
      <section className="py-20 px-4 max-w-7xl mx-auto" id="booking-referral-cta">
        <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative shadow-xl" id="cta-referral-box">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 rounded-full bg-emerald-800 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-72 h-72 rounded-full bg-amber-500/10 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6 text-left">
            <span className="inline-flex px-2 py-0.5 rounded bg-amber-400 text-emerald-950 font-mono text-[10px] font-bold uppercase tracking-wider">
              Akses Integrasi Terpadu
            </span>
            
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl leading-tight">
              Ingin Mengetahui Jadwal Pelatihan & Reservasi Konseling?
            </h2>
            
            <p className="font-sans text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
              Kami merancang sistem pendaftaran online, portal laporan hasil akademik siswa privat, serta kalender reservasi konseling psikolog interaktif dalam satu portal tepadu. Silakan buat akun siswa atau login untuk memesan sesi secara instant.
            </p>             <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleRegisterFlow}
                className="font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 transition-colors flex items-center justify-center space-x-2 shadow-xs"
                id="cta-schedule-login"
              >
                <Calendar className="w-4 h-4" />
                <span>Buka Jadwal & Booking Sesi</span>
              </button>
              
              <a
                href={`https://wa.me/${cleanPhone(siteSettings?.phone || '0811-3000-888')}?text=Halo%20Azta%20Best%20Choice%20Madiun%2C%20saya%20ingin%20tanya-tanya%2520mengenai%2520bimbingan...`}
                target="_blank"
                rel="noreferrer"
                className="font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors flex items-center justify-center space-x-2"
                id="cta-whatsapp-general"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Konsultasi WA ({siteSettings?.phone || '0811-3000-888'})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. KONTAK & LOKASI SEKILAS */}
      <section className="bg-slate-100 py-16 px-4" id="address-overview-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 space-y-6" id="address-text-block">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block font-sans">Lokasi Unit Madiun</span>
            <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Kantor Operasional {siteSettings?.brandName || 'Azta Best Choice'}
            </h3>
            
            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Alamat:</strong> {siteSettings?.address || 'Jl. Kawis, Kelurahan Taman, Kecamatan Taman, Kota Madiun, Jawa Timur 63131'}
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p><strong>Jam Kerja Sesi:</strong></p>
                  <p>{siteSettings?.operationalHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p><strong>Hotline Bimbingan:</strong></p>
                  <p>WhatsApp: {siteSettings?.phone || '0811-3000-888'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('kontak')}
              className="px-5 py-2.5 bg-emerald-900 text-white hover:bg-emerald-950 font-semibold text-xs rounded-full transition-colors flex items-center space-x-1"
            >
              <span>Hubungi Kontak & Lihat Peta Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Frame container mockup representation */}
          <div className="lg:col-span-8 h-80 w-full rounded-2xl overflow-hidden border border-gray-200 bg-white relative shadow-md" id="google-map-mockup-wrapper">
            <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white p-3.5 flex items-center justify-between text-xs backdrop-blur-md z-10">
              <div>
                <p className="font-bold">{siteSettings?.brandName || 'Azta Best Choice'} {siteSettings?.brandSuffix || 'Psychology'}</p>
                <p className="text-[10px] text-slate-300">{siteSettings?.address || 'Jl. Kawis, Taman, Kota Madiun'}</p>
              </div>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings?.address || 'Jl. Kawis, Taman, Kec. Taman, Kota Madiun')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded text-[10px] transition-colors"
              >
                Buka di Maps
              </a>
            </div>
            
            {/* Visual high quality representation of Google Maps focused on JL. Kawis, Taman, Madiun */}
            <div className="w-full h-full bg-slate-100 flex flex-col justify-center items-center relative p-8">
              {/* Fake grid map elements */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Fake Styled Map Routes */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-yellow-200 -translate-y-2 border-y border-yellow-300" />
              <div className="absolute top-0 bottom-0 left-1/3 w-6 bg-slate-200 border-x border-slate-300" />
              <div className="absolute top-0 bottom-0 left-2/3 w-4 bg-slate-200 border-x border-slate-300" />
              
              {/* Map Pins */}
              <div className="absolute top-1/2 left-1/3 -translate-x-3 -translate-y-4 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-[10px] shadow-md border-2 border-white animate-bounce">
                  📍
                </div>
                <span className="p-1.5 bg-white border border-rose-300 rounded text-[9px] font-bold text-gray-800 shadow-xs mt-1">
                  Lokasi Azta Best Choice
                </span>
              </div>

              {/* Surrounding landmarks */}
              <div className="absolute top-8 left-1/2 text-slate-500 text-[10px] font-semibold">Taman, Kota Madiun</div>
              <div className="absolute bottom-12 right-12 text-slate-500 text-[10px] font-semibold">Stadion Wilis Madiun (Kawasan)</div>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
