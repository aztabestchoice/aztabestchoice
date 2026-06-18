/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, ServiceTab, User, SiteSettings } from '../types';
import { Menu, X, ChevronDown, UserCheck, ShieldAlert, LogOut, GraduationCap, Heart, HelpCircle, FileText } from 'lucide-react';
import CircularLogo from './CircularLogo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setServiceSubTab: (subTab: ServiceTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  siteSettings?: SiteSettings;
}

export default function Header({
  activeTab,
  setActiveTab,
  setServiceSubTab,
  currentUser,
  onLogout,
  onOpenAuth,
  siteSettings
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const handleServiceClick = (subTab: ServiceTab) => {
    setActiveTab('layanan');
    setServiceSubTab(subTab);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full" id="header-container">
      <header className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs rounded-2xl overflow-hidden transition-all" id="header-inner">
        <div className="px-6 h-16 flex justify-between items-center w-full" id="header-desktop-row">
        {/* Logo Brand Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          id="brand-logo-trigger"
        >
          {siteSettings?.logoUrl ? (
            <img 
              referrerPolicy="no-referrer"
              src={siteSettings.logoUrl} 
              alt={siteSettings?.brandName || 'Logo'} 
              className="w-10 h-10 rounded-full object-cover border border-amber-300 transition-transform group-hover:scale-105"
            />
          ) : (
            <CircularLogo className="w-10 h-10 group-hover:scale-105" />
          )}
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-display font-bold text-base tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors">
                {siteSettings?.brandName || 'Azta'}
              </span>
              <span className="font-sans font-light text-slate-500 text-xs underline decoration-emerald-400">
                {siteSettings?.brandSuffix || 'Best Choice'}
              </span>
            </div>
            <p className="font-sans text-[9px] text-gray-400 font-medium leading-none mt-0.5">
              {siteSettings?.subTitle || 'Psychology & Counseling'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6 items-center" id="desktop-nav">
          <button
            onClick={() => { setActiveTab('home'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'home' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-home"
          >
            Beranda
          </button>

          {/* Dropdown Menu for Layanan */}
          <div className="relative">
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => { setActiveTab('layanan'); setServiceSubTab('all'); }}
              className={`flex items-center space-x-1 font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'layanan' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
              id="nav-services-dropdown"
            >
              <span>Layanan</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown content */}
            {dropdownOpen && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl bg-white border border-slate-250 shadow-md py-2 px-1 z-50 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
                id="dropdown-menu-box"
              >
                <button
                  onClick={() => handleServiceClick('all')}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Semua Pilar Layanan
                </button>
                <hr className="my-1 border-slate-100" />
                
                <button
                  onClick={() => handleServiceClick('seleksi')}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900 leading-tight">Persiapan Seleksi</p>
                    <p className="text-[10px] text-zinc-500">TNI, POLRI, Kedinasan & BUMN</p>
                  </div>
                </button>

                <button
                  onClick={() => handleServiceClick('asesmen')}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900 leading-tight">Asesmen Psikologi</p>
                    <p className="text-[10px] text-zinc-500">Tes IQ, Bakat Minat & Kognitif</p>
                  </div>
                </button>

                <button
                  onClick={() => handleServiceClick('konseling')}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-900 rounded-lg transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900 leading-tight">Layanan Konseling</p>
                    <p className="text-[10px] text-zinc-500">Klinis, Stress Management & Bakat</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { setActiveTab('pendaftaran'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'pendaftaran' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-pendaftaran"
          >
            Pendaftaran
          </button>

          <button
            onClick={() => { setActiveTab('tentang'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'tentang' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-about"
          >
            Tentang
          </button>

          <button
            onClick={() => { setActiveTab('alumni'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'alumni' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-alumni"
          >
            Alumni
          </button>

          <button
            onClick={() => { setActiveTab('blog'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'blog' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-blog"
          >
            Artikel
          </button>

          <button
            onClick={() => { setActiveTab('kontak'); }}
            className={`font-sans font-semibold text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'kontak' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
            id="nav-contact"
          >
            Kontak
          </button>
        </nav>

        {/* User Portal / Action Area */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setActiveTab('portal')}
                id="header-user-badge"
              >
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full border border-emerald-500 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <span className="flex items-center text-[9px] text-emerald-700 font-semibold uppercase tracking-wider">
                    {currentUser.role === 'admin' ? (
                      <>
                        <ShieldAlert className="w-2.5 h-2.5 mr-0.5 text-amber-500" /> Executive Admin
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-2.5 h-2.5 mr-0.5 text-emerald-500" /> Portal Siswa
                      </>
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Keluar Akun"
                id="btn-logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="font-sans font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-emerald-850 transition-all shadow-xs"
              id="btn-login"
            >
              PORTAL AKSES
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden" id="mobile-menu-trigger">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white" id="mobile-drawer">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Beranda
            </button>
            
            {/* Expanded Services for mobile */}
            <div className="space-y-1">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 block">Layanan Kami</span>
              <button
                onClick={() => handleServiceClick('seleksi')}
                className="flex w-full items-center justify-between px-6 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg"
              >
                <span>A. Persiapan Seleksi (TNI/POLRI/BUMN)</span>
                <GraduationCap className="w-4 h-4 text-amber-500" />
              </button>
              <button
                onClick={() => handleServiceClick('asesmen')}
                className="flex w-full items-center justify-between px-6 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg"
              >
                <span>B. Asesmen Psikologi (Tes IQ & Bakat)</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </button>
              <button
                onClick={() => handleServiceClick('konseling')}
                className="flex w-full items-center justify-between px-6 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg"
              >
                <span>C. Layanan Konseling (Sesi Psikolog)</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </button>
            </div>

            <button
              onClick={() => { setActiveTab('pendaftaran'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'pendaftaran' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Pendaftaran Baru
            </button>

            <button
              onClick={() => { setActiveTab('tentang'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'tentang' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Tentang Kami
            </button>

            <button
              onClick={() => { setActiveTab('alumni'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'alumni' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Alumni Siswa
            </button>

            <button
              onClick={() => { setActiveTab('blog'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'blog' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Edukasi / Artikel
            </button>

            <button
              onClick={() => { setActiveTab('kontak'); setMobileMenuOpen(false); }}
              className={`flex w-full px-3 py-2.5 text-base font-semibold rounded-lg ${
                activeTab === 'kontak' ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700' : 'text-gray-600'
              }`}
            >
              Hubungi Kami
            </button>

            <div className="pt-2 border-t border-gray-100">
              {currentUser ? (
                <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
                  >
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'} 
                      alt={currentUser.name} 
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{currentUser.role === 'admin' ? 'Executive Admin' : 'Portal Siswa'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="px-3 py-1.5 text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-all"
                >
                  Portal Klien / Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  </div>
  );
}
