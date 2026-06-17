/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface KontakOnlineProps {
  siteSettings?: SiteSettings;
}

export default function KontakOnline({ siteSettings }: KontakOnlineProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bimbel Psikotes TNI-POLRI',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Auto reset submission alert after 4 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Bimbel Psikotes TNI-POLRI',
        message: ''
      });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Bagaimana cara mendaftar program bimbingan di Azta Best Choice?',
      a: 'Pendaftaran sangat mudah! Anda bisa mendaftar secara online melalui tombol "Portal Klien / Admin" di pojok kanan atas untuk membuat akun, memilih pilar bimbel, mengupload buiti pembayaran DP, dan memesan sesi. Atau silakan langsung datang ke kantor operasional kami di Jl. Kawis Kecamatan Taman, Madiun.'
    },
    {
      q: 'Berapa kisaran biaya bimbingan psikotes dan apakah bisa membayar DP?',
      a: 'Biaya pilar bimbingan dimulai dari Rp350.000 untuk Tes IQ terpisah hingga Rp4.500.000 untuk paket Bimbel TNI-POLRI intensif terpadu. Kami sangat mempermudah administrasi siswa dengan mengoperasikan sistem Pembayaran DP (Down Payment) di muka, dilanjutkan cicilan pelunasan bertahap selama program bimbel berlangsung.'
    },
    {
      q: 'Apakah bimbingan psikotes Azta diadakan secara online atau offline?',
      a: 'Kami menyelenggarakan program bimbingan dalam dua metode: Offline (Tatap Muka di Laboratorium CAT Jl. Kawis Madiun, sangat disarankan untuk pengerjaan tes koran dan gambar) serta Online (Tatap muka virtual interaktif beserta simulasi perangkat CAT digital mandiri untuk siswa luar kota Madiun).'
    },
    {
      q: 'Kapan dan di mana saya bisa mengunduh sertifikat & rapor hasil tes IQ saya?',
      a: 'Setelah sesi Asesmen selesai, tim psikolog akan memproses psikogram dalam kurun waktu 1-3 hari kerja. Sertifikat digital beserta saran rekomendasi karier dapat Anda unduh langsung secara privat di "Portal Siswa Anda" setelah disetujui pihak Admin.'
    },
    {
      q: 'Apakah psikolog di Azta memiliki izin praktik resmi?',
      a: 'Ya, semua Psikolog Praktisi Utama yang bertugas di Azta memegang gelar resmi M.Psi. (Magister Psikologi Profesi) serta Surat Izin Praktik Psikologi (SIP) sah yang diterbitkan resmi oleh Himpunan Psikologi Indonesia (HIMPSI) pusat.'
    }
  ];

  return (
    <div className="bg-slate-50 py-12 px-4 font-sans animate-fade-in" id="contact-us-view-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
            Hubungi Pusat Layanan
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-emerald-950 tracking-tight leading-tight">
            Kontak, Alamat & Alur Layanan
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Punya pertanyaan mengenai program atau uji seleksi khusus? Hubungi asisten admin kami atau kunjungi kantor bimbingan Azta di Kecamatan Taman, Kota Madiun.
          </p>
        </div>

        {/* Contacts grid details & Map form layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20" id="contact-details-form-row">
          
          {/* Col Left: Official Contacts & details */}
          <div className="lg:col-span-5 space-y-8" id="contact-detail-panels">
            
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-xs">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-gray-100 pb-3">Informasi Kontak</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-xs text-gray-650">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Alamat Fisik Kantor:</p>
                    <p className="mt-1 leading-relaxed">{siteSettings?.address || 'Jl. Kawis, Kelurahan Taman, Kecamatan Taman, Kota Madiun, Jawa Timur 63131'}</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3 text-xs text-gray-650">
                  <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Hotline Chat WhatsApp:</p>
                    <a 
                      href={`https://wa.me/${(siteSettings?.phone || '08113000888').replace(/\D/g, '').startsWith('0') ? '62' + (siteSettings?.phone || '08113000888').replace(/\D/g, '').substring(1) : (siteSettings?.phone || '08113000888').replace(/\D/g, '')}?text=Halo%2520${encodeURIComponent(siteSettings?.brandName || 'Azta')}%2520${encodeURIComponent(siteSettings?.brandSuffix || 'Best Choice')}%252C%2520saya%2520tertarik...`} 
                      className="text-emerald-800 hover:underline font-bold block mt-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {siteSettings?.phone || '0811-3000-888'} (Fast Response)
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3 text-xs text-gray-650">
                  <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Email Resmi Korespondensi:</p>
                    <a href={`mailto:${siteSettings?.email || 'aztabestchoice@gmail.com'}`} className="text-emerald-800 hover:underline font-bold block mt-1">
                      {siteSettings?.email || 'aztabestchoice@gmail.com'}
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3 text-xs text-gray-650">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Jam Layanan Operasional:</p>
                    <p className="mt-1 leading-relaxed">{siteSettings?.operationalHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}. <br/><span className="text-rose-600 font-semibold">*Minggu dan Libur Nasional Tutup</span></p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Map Panel Embed representation detail */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs h-64 relative" id="contact-map-card">
              <div className="absolute inset-0 bg-slate-100 flex flex-col justify-center items-center p-6 text-center">
                <p className="font-bold text-xs text-emerald-950">{siteSettings?.brandName || 'Azta'} {siteSettings?.brandSuffix || 'Best Choice'}</p>
                <p className="text-[10px] text-gray-500 mt-1 max-w-xs">{siteSettings?.address || 'Jl. Kawis, Taman, Kec. Taman, Kota Madiun'}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings?.address || 'Jl. Kawis, Taman, Kec. Taman, Kota Madiun')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mt-4 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-[10px] rounded-lg transition-colors inline-block"
                >
                  Buka Peta Jalan Google Maps
                </a>
              </div>
            </div>

          </div>

          {/* Col Right: Interactive Message Form */}
          <div className="lg:col-span-7" id="contact-form-card">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 text-left shadow-xs relative">
              
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-gray-100 pb-3 mb-6">Kirim Pertanyaan Online</h3>
              
              {formSubmitted ? (
                <div className="bg-emerald-50 text-emerald-900 border border-emerald-250 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 animate-fade-in" id="contact-success-box">
                  <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-sm">Pesan Berhasil Terkirim!</h4>
                    <p className="text-xs text-gray-500 mt-1">Asisten Admin Azta akan membalas pesan Anda sesegera mungkin via email atau nomor WhatsApp yang Anda cantumkan.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4" id="contact-question-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Dimas Anggara" 
                        className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nomor WhatsApp</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 0812-3456-7890" 
                        className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Alamat Email</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. dimas@gmail.com" 
                      className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Pilar Program yang Diminati</label>
                    <select 
                      name="service" 
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50"
                    >
                      <option value="Bimbel Psikotes TNI-POLRI">A. Bimbel Psikotes TNI-POLRI</option>
                      <option value="Persiapan Seleksi BUMN">A. Persiapan Seleksi BUMN / PNS</option>
                      <option value="Tes IQ Kecerdasan">B. Tes IQ & Inteligensi Umum</option>
                      <option value="Tes Bakat Minat Studi">B. Tes Bakat & Minat Jurusan</option>
                      <option value="Pendampingan Counseling">C. Sesi Konseling Psikolog</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Isi Pesan / Pertanyaan</label>
                    <textarea 
                      required 
                      rows={4} 
                      name="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tuliskan detail pertanyaan Anda mengenai program bimbingan..."
                      className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Ke Admin</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* FAQ ACCORDION LISTS */}
        <div className="max-w-4xl mx-auto" id="contact-faqs-row">
          <div className="text-center mb-10">
            <h2 className="font-sans font-extrabold text-2xl text-emerald-950 leading-tight">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div className="h-0.5 w-12 bg-amber-400 mx-auto mt-2" />
          </div>

          <div className="space-y-3" id="faq-accordions-group">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-gray-105 rounded-2xl overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-slate-900 hover:text-emerald-800 font-bold text-xs sm:text-sm text-left focus:outline-hidden"
                  >
                    <span className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
