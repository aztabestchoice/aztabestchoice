/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, ServiceTab, SiteSettings } from '../types';
import { 
  GraduationCap, 
  FileText, 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Calendar, 
  Award, 
  Layers, 
  ShieldCheck, 
  UserPlus
} from 'lucide-react';

interface LayananDetailProps {
  serviceSubTab: ServiceTab;
  setServiceSubTab: (subTab: ServiceTab) => void;
  setActiveTab: (tab: ActiveTab) => void;
  siteSettings?: SiteSettings;
}

export default function LayananDetail({ serviceSubTab, setServiceSubTab, setActiveTab, siteSettings }: LayananDetailProps) {
  
  const handleRegisterRedirect = () => {
    setActiveTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 py-12 px-4 font-sans" id="layanan-detail-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Description */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
            Katalog Layanan Komprehensif
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-emerald-950 tracking-tight">
            Pilar Program & Keahlian Azta
          </h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            Azta Best Choice mengintegrasikan keandalan sains psikologi murni dengan metode pelatihan aplikatif untuk mensolusikan kebutuhan akademis, karier instansi, dan penyelarasan kestabilan kognitif-mental Anda.
          </p>
        </div>

        {/* Categories Tab Selector with icons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200 pb-4" id="layanan-tab-selectors">
          <button
            onClick={() => setServiceSubTab('all')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center space-x-2 ${
              serviceSubTab === 'all'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-55'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semua Layanan</span>
          </button>

          <button
            onClick={() => setServiceSubTab('seleksi')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center space-x-2 ${
              serviceSubTab === 'seleksi'
                ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/10'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-55'
            }`}
            id="selector-subtab-seleksi"
          >
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>A. Persiapan Seleksi</span>
          </button>

          <button
            onClick={() => setServiceSubTab('asesmen')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center space-x-2 ${
              serviceSubTab === 'asesmen'
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/10'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-55'
            }`}
            id="selector-subtab-asesmen"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>B. Asesmen Psikologi</span>
          </button>

          <button
            onClick={() => setServiceSubTab('konseling')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center space-x-2 ${
              serviceSubTab === 'konseling'
                ? 'bg-rose-900 text-white shadow-md shadow-rose-950/10'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-55'
            }`}
            id="selector-subtab-konseling"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>C. Layanan Konseling</span>
          </button>
        </div>

        {/* SERVICE CONTENT MODULE */}
        <div className="space-y-16" id="layanan-content-box">
          
          {/* PILAR A: PERSIAPAN SELEKSI */}
          {(serviceSubTab === 'all' || serviceSubTab === 'seleksi') && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs" id="pilar-module-seleksi">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Visual Title Left */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="inline-flex space-x-1 items-center px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-bold">
                    <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>PILAR LAYANAN A</span>
                  </div>
                  
                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-950">
                    Sistem Persiapan Seleksi Instansi
                  </h2>
                  
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Fokus utama kami adalah melatih kesiapan taktis kognitif (IQ-akademik), simulasi pengerjaan cepat di bawah tekanan, konsentrasi psikofisik, serta ketebalan emosi siswa untuk mengeliminasi faktor keguguran tes psikometri.
                  </p>
                  
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4">
                    <p className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Fasilitas Bimbingan:</span>
                    </p>
                    <ul className="text-[11px] text-gray-650 space-y-1.5 mt-2.5">
                      <li>• Lab Computer Assisted Test (CAT) mandiri</li>
                      <li>• Rapor rekap skor & evaluasi individual</li>
                      <li>• Modul latihan tebal beserta try-out rutin</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleRegisterRedirect}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Bimbel Seleksi</span>
                  </button>
                </div>

                {/* Sub-Programs Right */}
                <div className="lg:w-2/3 space-y-8">
                  
                  {/* Sub-Program 1 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>1. Pelatihan Psikotes TNI-POLRI (Akurasi Presisi)</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Program unggulan terspesialisasi untuk calon Akpol, Akmil, Bintara, dan Tamtama. Penyelenggaraan kelas materi regulasi kognitif dan pembiasaan pengerjaan presisi.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Materi Fokus:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">Tes Pauli & Kraepelin (Koran), Tes Wartegg, Gambar Manusia (DAP), Gambar Pohon (BAUM), Tes Spasial Figural, Tes Kepribadian MMPI.</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Simulasi Fisik / Mental:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">Pelatihan konsentrasi visual, manajemen kepanikan, pembiasaan instruksi cepat dan sistem tata tertib penilaian polisi.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Program 2 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>2. Persiapan Instansi Pemerintah / BUMN / Swasta</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Kesiapan Seleksi Kompetensi Bidang (SKB) rekrutmen CPNS, Assessment Center manajerial bagi ODP Perbankan atau staff BUMN, beserta simulasi LGD (Leaderless Group Discussion).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Metode Pelatihan:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">Bimbingen intensif presentasi portofolio, negosiasi, studi kasus organisasi korporat, dan penilaian integritas moral kerja.</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Kelas Wawancara Kerja:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">Ulasan bahasa tubuh, cara menjawab metode STAR (Situation, Task, Action, Result), & simulasi wawancara dengan assessor senior berizin.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Program 3 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>3. Persiapan Masuk Perguruan Tinggi Kedinasan / Reguler</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Kesiapan mental & kognitif menghadapi seleksi ujian masuk perguruan tinggi kedinasan terkemuka seperti IPDN, PKN STAN, STIS, Politeknik Imigrasi (Poltekim), serta PTN jalur mandiri reguler.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Fokus Modul:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">Penalaran matematika, struktur kognitif dasar kedinasan, tes kepribadian asasi, serta uji integritas kesetiaan bela negara.</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Estimasi Sesi:</p>
                        <p className="text-[11px] text-gray-500 mt-1.5">24 Sesi Materi Utama terstruktur + 6 Sesi Try Out CAT terintegrasi pendampingan psikogram.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* PILAR B: ASESMEN PSIKOLOGI */}
          {(serviceSubTab === 'all' || serviceSubTab === 'asesmen') && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs" id="pilar-module-asesmen">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Visual Title Left */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="inline-flex space-x-1 items-center px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-bold">
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>PILAR LAYANAN B</span>
                  </div>
                  
                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-950">
                    Asesmen Psikometri & Tes Bakat
                  </h2>
                  
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Pengukuran sistematis aspek psikologis, tingkat IQ umum, pemetaan minat karier sekolah, serta tingkat kompetensi kognitif spesifik menggunakan materi tes psikometri tervalidasi.
                  </p>
                  
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4">
                    <p className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Sertifikat Berlisensi:</span>
                    </p>
                    <p className="text-[11px] text-gray-650 mt-1.5 leading-relaxed">
                      Laporan hasil asesmen (Psikogram) diterbitkan resmi secara rahasia dan sah, melampirkan tanda tangan Psikolog Utama berizin praktis.
                    </p>
                  </div>

                  <button
                    onClick={handleRegisterRedirect}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Tes Asesmen</span>
                  </button>
                </div>

                {/* Sub-Programs Right */}
                <div className="lg:w-2/3 space-y-8">
                  
                  {/* Sub-Program 1 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-700" />
                      <span>1. Tes IQ / Inteligensi (Anak, Remaja & Dewasa)</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Pengukuran tingkat kecerdasan kognitif umum (General Intelligence) menggunakan alat ukur tervalidasi (e.g. IST, WAIS, WISC) untuk menakar kesiapan studi atau rekrutmen kerja.
                    </p>
                    <div className="mt-4 text-xs text-gray-500 bg-white p-3.5 rounded-xl border border-gray-105">
                      <strong>Hasil Tes:</strong> Kategori IQ (Superior, Tinggi, Rata-rata), skor kecerdasan verbal, penalaran berhitung, visual abstrak, serta daya ingat.
                    </div>
                  </div>

                  {/* Sub-Program 2 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-700" />
                      <span>2. Tes Bakat & Minat Terpadu (Karier & Sekolah)</span>
                    </h3>
                    <p className="text-xs text-gray-605 mt-2 leading-relaxed">
                      Didesain untuk mengarahkan siswa sekolah menentukan penjurusan SMA/SMK, program kuliah PTN yang tepat, serta kecocokan kepribadian pilar profesi karier agar menghidari salah jurusan kuliah.
                    </p>
                    <div className="mt-4 text-xs text-gray-500 bg-white p-3.5 rounded-xl border border-gray-105">
                      <strong>Aspek Pemetaan:</strong> Minat Holland RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional), bakat mekanik, klerikal, sains, analitis.
                    </div>
                  </div>

                  {/* Sub-Program 3 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-700" />
                      <span>3. Tes Akademik Khusus & Profil Kognitif</span>
                    </h3>
                    <p className="text-xs text-gray-605 mt-2 leading-relaxed">
                      Pengukuran spesifik tingkat daya tangkap, kecepatan berhitung numerik linier, serta penalaran logis bagi calon pegawai instansi atau taruna akademi.
                    </p>
                  </div>

                  {/* Dynamic Services from Admin Settings */}
                  {siteSettings?.services && siteSettings.services.length > 0 && (
                    <div className="pt-6 border-t border-dashed border-gray-200 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-850 text-left">
                        Layanan Tambahan & Alat Tes Khusus (Aktif):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {siteSettings.services.map((srv, sIdx) => (
                          <div key={srv.id || sIdx} className="border border-gray-150 rounded-2xl p-5 hover:border-emerald-300 transition-all bg-white shadow-xs text-left space-y-2">
                            <h4 className="text-xs font-black text-slate-800 flex items-center space-x-1.5 uppercase tracking-wide">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 animate-pulse-slow" />
                              <span>{srv.title}</span>
                            </h4>
                            <div className="space-y-1">
                              <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">Spesifikasi Alat Ukur / Tes:</p>
                              <div className="flex flex-wrap gap-1.5 pt-1">
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

                </div>
              </div>
            </div>
          )}

          {/* PILAR C: LAYANAN KONSELING */}
          {(serviceSubTab === 'all' || serviceSubTab === 'konseling') && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs" id="pilar-module-konseling">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Visual Title Left */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="inline-flex space-x-1 items-center px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-[11px] font-bold">
                    <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>PILAR LAYANAN C</span>
                  </div>
                  
                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-950">
                    Layanan Konseling & Pendampingan Psikologis
                  </h2>
                  
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sesi terapi klinis, stress coping management, dan konsultasi interaktif 1-on-1 dengan psikolog profesional guna menyelaraskan kondisi jiwa di tengah persaingan tinggi.
                  </p>

                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 mt-4 text-xs text-rose-950">
                    <p className="font-bold">Privasi 100% Terjaga:</p>
                    <p className="text-gray-650 mt-1">Azta Best Choice berpegang teguh pada Kode Etik Psikologi Indonesia. Seluruh pembicaraan dalam ruang konseling dilindungi undang-undang.</p>
                  </div>

                  <button
                    onClick={handleRegisterRedirect}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-rose-300" />
                    <span>Booking Jadwal Konseling</span>
                  </button>
                </div>

                {/* Sub-Programs Right */}
                <div className="lg:w-2/3 space-y-8">
                  
                  {/* Sub-Program 1 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-rose-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>1. Pendampingan & Coping Stress Sesi Klinis</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Konseling mendalam untuk mengatasi burnout belajar, kecemasan pengerjaan tes, depresi akademis, kecemasan interpersonal keluarga, PTSD (Trauma), serta gangguan emosional lainnya.
                    </p>
                    <div className="mt-4 bg-white p-3.5 rounded-xl border border-gray-100 text-xs text-gray-500 leading-relaxed">
                      <strong>Siapa yang memerlukan:</strong> Calon peserta seleksi TNI-POLRI yang berkali-kali gugur dan mengalami luka mental kecemasan, siswa sekolah berstres tinggi, atau individu dengan burnout kerja.
                    </div>
                  </div>

                  {/* Sub-Program 2 */}
                  <div className="border border-gray-100 rounded-2xl p-6 hover:border-rose-300 transition-colors bg-slate-50/50">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>2. Konsultasi Mengoptimalkan Potensi Diri (Post-Assessment)</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Sesi tatap muka khusus untuk membahas hasil Tes IQ / Bakat Minat Anda secara mendalam. Psikolog membantu menterjemahkan rekomendasi psikogram menjadi aksi nyata karier Anda.
                    </p>
                    <div className="mt-4 bg-white p-3.5 rounded-xl border border-gray-100 text-xs text-gray-500 leading-relaxed">
                      <strong>Tujuan Utama:</strong> Memahamkan siswa akan potensi orisinil dirinya, menetapkan target pilar kuliah, serta membuat program bimbingan fisik-kognitif selaras.
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* MANFAAT & TUJUAN SECTION */}
        {siteSettings?.benefits && siteSettings.benefits.length > 0 && (
          <div className="mt-16 bg-white border border-gray-150 rounded-3xl p-8 sm:p-10 shadow-xs text-left" id="manfaat-tujuan-section">
            <div className="max-w-3xl">
              <span className="text-xs text-emerald-850 font-bold uppercase tracking-widest block mb-1">
                Kenapa Memilih Asesmen & Bimbingan Azta?
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-emerald-950 tracking-tight">
                Manfaat & Tujuan Program Asesmen
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Asesmen, bimbingan psikotes, serta konseling terencana bersama tim profesional kami dirancang matang untuk menghadirkan kontribusi nyata bagi masa depan akademis dan kestabilan mental anak didik:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {siteSettings.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all shadow-xs">
                  <div className="p-1 px-1.5 bg-emerald-100 text-emerald-950 font-black rounded-lg text-xs shrink-0 font-mono">
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
    </div>
  );
}
