/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MOCK_PSYCHOLOGISTS } from '../mockData';
import { ShieldCheck, Award, Flag, Users, CheckSquare, Target, BookOpen, Star } from 'lucide-react';
import { SiteSettings } from '../types';

interface TentangKamiProps {
  siteSettings?: SiteSettings;
}

export default function TentangKami({ siteSettings }: TentangKamiProps) {
  
  const defaultCoreValues = [
    {
      id: 'val-1',
      title: 'Integritas Ilmiah',
      desc: 'Setiap asesmen dan tes psikometri didasarkan pada instrumen baku, sahih, tepercaya, dan bebas dari manipulasi pihak lain.',
    },
    {
      id: 'val-2',
      title: 'Akurasi Presisi',
      desc: 'Materi bimbingan disesuaikan dengan kurikulum seleksi kepolisian/TNI & PNS terkini untuk meminimalkan deviasi hasil ujian.',
    },
    {
      id: 'val-3',
      title: 'Kerahasiaan Mutlak',
      desc: 'Seluruh rekam konseling dan lembar psikogram adalah rahasia pribadi pasien, dilindungi penuh oleh UU Kode Etik Psikolog.',
    },
    {
      id: 'val-4',
      title: 'Empati Pengasuhan',
      desc: 'Kami menyadari bahwa pilar psikologi bukan sekadar angka di kertas, tetapi mendampingi pertumbuhan jiwa siswa dengan tulus.',
    }
  ];

  const defaultMentors = [
    {
      name: 'AKP (Purn) Soedjatmiko',
      role: 'Mentor Kepala Fisik & Mental Seleksi',
      special: 'Eks Instruktur Jasmani Brimob',
      bio: 'Mengawal pendampingan kesiapan fisik, stamina taruna, postur standar TNI-POLRI, serta pelatihan penanggulangan ketakutan taktis.',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Rian Hermawan, S.Kom., M.T.',
      role: 'Lead Mentor CAT & Pemrograman Logika',
      special: 'Spesialis Penalaran Figural CAT',
      bio: 'Melatih kemampuan berpikir numerik, kecepatan pengerjaan pola spasial 3D, serta strategi menghemat waktu saat ujian CAT.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const coreValues = siteSettings?.tentangKamiValues && siteSettings.tentangKamiValues.length > 0 
    ? siteSettings.tentangKamiValues 
    : defaultCoreValues;

  const mentors = siteSettings?.tentangKamiMentors && siteSettings.tentangKamiMentors.length > 0 
    ? siteSettings.tentangKamiMentors 
    : defaultMentors;

  const getIconForValue = (idx: number) => {
    if (idx % 4 === 0) return <ShieldCheck className="w-5 h-5 text-emerald-800" />;
    if (idx % 4 === 1) return <Target className="w-5 h-5 text-emerald-800" />;
    if (idx % 4 === 2) return <Award className="w-5 h-5 text-emerald-800" />;
    return <BookOpen className="w-5 h-5 text-emerald-800" />;
  };

  return (
    <div className="bg-slate-50 py-12 px-4 font-sans" id="about-us-view">
      <div className="max-w-7xl mx-auto">
        
        {/* About Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
            Mengenal Lebih Dekat
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-emerald-950 tracking-tight leading-tight">
            Azta Best Choice Counseling & Psychology
          </h1>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Berdiri di Madiun dengan komitmen kokoh mengintegrasikan layanan psikotes taktis instansi dan bimbingan klinis terarah guna mewujudkan kematangan potensi sejati para siswa Jawa Timur.
          </p>
        </div>

        {/* Vision, Mission, and Profile Section */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs mb-16" id="about-profile-grid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left" id="about-history-content">
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">Profil & Sejarah Singkat</span>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {siteSettings?.aboutPageProfileTitle || 'Mewujudkan Cita-Cita Abdi Negara di Jl. Kawis Madiun'}
              </h2>
              
              {siteSettings?.aboutPageProfileParas && siteSettings.aboutPageProfileParas.length > 0 ? (
                siteSettings.aboutPageProfileParas.map((p, idx) => (
                  <p key={idx} className="text-xs text-gray-600 leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Azta Best Choice lahir bermula dari kolaborasi praktisi psikologi industri, klinis, dan mantan instruktur pertahanan negara. Mengamati tingginya angka keguguran peserta seleksi kepolisian dan militer dari Jawa Timur di tahap psikotes (mencapai lebih dari 62%), kami bertekad menciptakan pusat bimbingan dengan akurasi presisi tinggi.
                  </p>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Kini, berlokasi di Jl. Kawis, Kecamatan Taman, Kota Madiun, Azta Best Choice telah berkembang menjadi bimbingan pilihan utama yang menyinergikan peningkatan inteligensi, ketahanan stres, pemetaan minat bakat anak sejak dini, beserta pendampingan keluhan stres klinis.
                  </p>
                </>
              )}

              {/* Mission list */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5 border-b border-gray-100 pb-2">
                  <Flag className="w-5 h-5 text-emerald-700" />
                  <span>Misi Lembaga Kami</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-1.5 text-xs text-gray-600">
                    <span className="text-emerald-700 font-bold shrink-0">1.</span>
                    <span>Menyelenggarakan simulasi psikotes CAT dengan instrumen penilai psikogram presisi yang selaras dengan tes penerimaan kepolisian & militer resmi.</span>
                  </li>
                  <li className="flex items-start space-x-1.5 text-xs text-gray-600">
                    <span className="text-emerald-700 font-bold shrink-0">2.</span>
                    <span>Melakukan asesmen IQ dan pemetaan potensi minat bakat secara komprehensif guna membantu siswa memilih penjurusan sekolah dan arah karier terbaik.</span>
                  </li>
                  <li className="flex items-start space-x-1.5 text-xs text-gray-600">
                    <span className="text-emerald-700 font-bold shrink-0">3.</span>
                    <span>Menyediakan layanan konsultasi kejiwaan 1-on-1 berizin yang suportif, humanis, dan menjamin hak kerahasiaan kllien 100%.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Interactive Box */}
            <div className="lg:col-span-5 text-emerald-100 bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden" id="about-licensing-card">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-800/35 -mr-8 -mt-8 pointer-events-none" />
              
              <h3 className="font-sans font-extrabold text-base text-amber-300 flex items-center space-x-2 border-b border-emerald-800 pb-3">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <span>Aspek Legalitas & Mitra</span>
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-800">
                  <p className="text-xs font-bold text-white leading-none">Anggota Resmi HIMPSI</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Diawasi penuh oleh Himpunan Psikologi Indonesia (HIMPSI) Wilayah Jawa Timur.</p>
                </div>
                
                <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-800">
                  <p className="text-xs font-bold text-white leading-none">Izin Lembaga Dinas Pendidikan</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Terdaftar resmi sebagai penyelenggara pelatihan kognitif & bimbingan psikotes kemasyarakatan.</p>
                </div>

                <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-800">
                  <p className="text-xs font-bold text-white leading-none">Sistem Evaluasi Terstandarisasi</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Metodologi tes psikologi menggunakan norma baku psikometri nasional yang valid dan andal.</p>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-emerald-400 font-mono">
                "We Measure Potential, We Guide Selection"
              </div>
            </div>

          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16" id="about-values">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900">Nilai-Nilai Pembentuk Karakter Azta Best Choice</h2>
            <div className="h-0.5 w-16 bg-amber-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {coreValues.map((val, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-105 p-6 rounded-2xl flex flex-col items-start hover:border-emerald-700/30 hover:shadow-2xs transition-all"
                id={`val-box-${index}`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 shrink-0">
                  {getIconForValue(index)}
                </div>
                <h4 className="text-sm font-bold text-slate-950 mb-2">{val.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed text-left">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SECTION (Psychologists Utama) */}
        <div className="mb-16" id="about-team-psychologists">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block mb-1">Psikolog Utama Kami</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Pemberi Izin & Pengawas Jalannya Asesmen</h2>
            <p className="text-xs text-gray-500 mt-1">Para ahli psikometri klinis dan industri yang terafiliasi dengan dewan resmi HIMPSI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {MOCK_PSYCHOLOGISTS.map((psy) => (
              <div 
                key={psy.id} 
                className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:shadow-xs transition-shadow"
                id={`psy-id-card-${psy.id}`}
              >
                <img 
                  src={psy.avatar} 
                  alt={psy.name} 
                  className="w-24 h-24 rounded-xl object-cover border border-gray-150 shrink-0 mx-auto sm:mx-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-2 text-left">
                  <h4 className="font-sans font-extrabold text-emerald-990 leading-snug">{psy.name}</h4>
                  
                  <div className="inline-block px-2 py-0.5 bg-amber-100 rounded text-[9px] font-bold text-amber-800">
                    SIP: {psy.sip}
                  </div>
                  
                  <p className="text-xs font-semibold text-emerald-700">{psy.specialization}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{psy.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MENTORS (Pelatih) */}
        <div className="mb-8" id="about-team-mentors">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Mentor Pelatih Kompetensi</span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-sans">Lead Instructor & Mentor Fisik/Kognitif</h2>
            <p className="text-xs text-gray-500 mt-1">Pelatih praktisi yang turun mengawal latihan harian CAT dan jasmani calon taruna</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mentors.map((mentor, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-xs transition-shadow"
                id={`mentor-card-${index}`}
              >
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  className="w-20 h-20 rounded-full object-cover border border-gray-150 shrink-0 mx-auto sm:mx-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <h4 className="font-sans font-bold text-slate-900 text-sm">{mentor.name}</h4>
                    <span className="text-[9px] font-bold py-0.5 px-2 bg-emerald-50 text-emerald-800 rounded">
                      {mentor.special}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-600 mt-0.5">{mentor.role}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{mentor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
