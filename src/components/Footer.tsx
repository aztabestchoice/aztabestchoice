/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, ServiceTab, SiteSettings } from '../types';
import { Mail, Phone, MapPin, Clock, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import CircularLogo from './CircularLogo';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  setServiceSubTab: (subTab: ServiceTab) => void;
  siteSettings?: SiteSettings;
}

export default function Footer({ setActiveTab, setServiceSubTab, siteSettings }: FooterProps) {
  const handleQuickService = (subTab: ServiceTab) => {
    setActiveTab('layanan');
    setServiceSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned || '628113000888';
  };

  const targetPhone = siteSettings?.phone || '0811-3000-888';
  const displayBrand = siteSettings?.brandName || 'AZTA';
  const displaySuffix = siteSettings?.brandSuffix || 'BEST CHOICE';

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans" id="footer-section">
      {/* Decorative colored grid border */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4" id="footer-brand-col">
            <div className="flex items-center space-x-2">
              {siteSettings?.logoUrl ? (
                <img 
                  referrerPolicy="no-referrer"
                  src={siteSettings.logoUrl} 
                  alt={displayBrand} 
                  className="w-10 h-10 rounded-full object-cover border border-amber-300"
                />
              ) : (
                <CircularLogo className="w-10 h-10" />
              )}
              <div>
                <span className="font-sans font-extrabold text-lg text-white tracking-tight">
                  {displayBrand} <span className="text-amber-400">{displaySuffix}</span>
                </span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {siteSettings?.subTitle || 'Counseling & Psychology'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lembaga tepercaya di Kota Madiun yang berdedikasi tinggi dalam mendampingi kesiapan psikotes masuk instansi (TNI, POLRI, Kedinasan, BUMN/Swasta) serta mengoptimalkan potensi akademis dan kesehatan psikologis melalui layanan asesmen dan konseling berizin resmi.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-300 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Psikolog Utama Berizin Resmi HIMPSI</span>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-4" id="footer-links-col">
            <h3 className="font-sans font-bold text-sm tracking-widest text-white uppercase border-b border-slate-800 pb-2">
              Pilar Layanan
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => handleQuickService('seleksi')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Bimbel & Pelatihan Psikotes TNI-POLRI</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickService('seleksi')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Persiapan Instansi Pemerintah/BUMN</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickService('asesmen')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Tes IQ, Minat Bakat & Kognitif</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickService('konseling')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Pendampingan Mental & Klinis</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickService('konseling')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Konsultasi Potensi Diri Mandiri</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4" id="footer-navigation-col">
            <h3 className="font-sans font-bold text-sm tracking-widest text-white uppercase border-b border-slate-800 pb-2">
              Situs Web
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleQuickTab('home')} className="hover:text-emerald-400 transition-colors">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickTab('tentang')} className="hover:text-emerald-400 transition-colors">
                  Profil Lembaga & Tim Kami
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickTab('blog')} className="hover:text-emerald-400 transition-colors">
                  Artikel Edukasi & Tips
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickTab('kontak')} className="hover:text-emerald-400 transition-colors">
                  Hubungi Kontak Azta
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickTab('portal')} className="hover:text-amber-400 font-semibold transition-colors">
                  Akses Registrasi & Portal Klien
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-4" id="footer-contact-col">
            <h3 className="font-sans font-bold text-sm tracking-widest text-white uppercase border-b border-slate-800 pb-2">
              Kontak & Alamat
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">
                  {siteSettings?.address || 'Jl. Kawis, Taman, Kec. Taman, Kota Madiun, Jawa Timur 63131'}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${cleanPhone(targetPhone)}?text=Halo%2520${encodeURIComponent(displayBrand)}%2520${encodeURIComponent(displaySuffix)}%252C%2520saya%2520tertarik%2520mendaftar%2520bimbingan...`}
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white hover:underline transition-colors animate-pulse text-emerald-350 font-semibold"
                >
                  {targetPhone} (Hotline WA)
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`mailto:${siteSettings?.email || 'aztabestchoice@gmail.com'}`} 
                  className="hover:text-white hover:underline transition-colors"
                >
                  {siteSettings?.email || 'aztabestchoice@gmail.com'}
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-400 leading-none">
                  <p className="font-semibold text-slate-300">Jam Operasional:</p>
                  <p className="mt-1">{siteSettings?.operationalHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}</p>
                  <p className="text-[10px] text-rose-450 mt-1">*Hari Minggu Libur nasional</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footnote */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {displayBrand} {displaySuffix} {siteSettings?.subTitle || 'Counseling & Psychology'}. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">
            Dikelola Profesional • Kecamatan Taman, Kota Madiun
          </p>
        </div>
      </div>
    </footer>
  );
}

