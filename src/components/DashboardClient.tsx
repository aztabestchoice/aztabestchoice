/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, ProgramRegistration, PaymentTransaction, PsychologicalResult, CounselingSession, BookingSlot, Psychologist, SiteSettings } from '../types';
import { MOCK_PSYCHOLOGISTS, MOCK_SLOTS } from '../mockData';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Fingerprint, 
  TrendingUp,  
  User as UserIcon, 
  ShieldCheck, 
  BookOpen, 
  DollarSign, 
  ChevronRight, 
  PlusCircle, 
  ArrowRight,
  Upload,
  UserCheck,
  MapPin,
  Heart,
  IdCard,
  Tv,
  Brain
} from 'lucide-react';
import StudentCard from './StudentCard';
import OnlineTraining from './OnlineTraining';
import AiCounselor from './AiCounselor';

interface DashboardClientProps {
  currentUser: User;
  registrations: ProgramRegistration[];
  setRegistrations: React.Dispatch<React.SetStateAction<ProgramRegistration[]>>;
  payments: PaymentTransaction[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  results: PsychologicalResult[];
  sessions: CounselingSession[];
  setSessions: React.Dispatch<React.SetStateAction<CounselingSession[]>>;
  siteSettings: SiteSettings;
}

type ClientSubTab = 'overview' | 'results' | 'counseling' | 'payments' | 'new-reg' | 'student-card' | 'e-learning' | 'tanya-ai';

export default function DashboardClient({
  currentUser,
  registrations,
  setRegistrations,
  payments,
  setPayments,
  results,
  sessions,
  setSessions,
  siteSettings
}: DashboardClientProps) {
  const cleanPhone = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned || '628113000888';
  };
  const [activeSubTab, setActiveSubTab] = useState<ClientSubTab>('overview');

  // Filter client's own data
  const myRegistrations = registrations.filter(r => r.studentId === currentUser.id);
  const myPayments = payments.filter(p => p.studentName === currentUser.name);
  const myResults = results.filter(res => res.studentId === currentUser.id);
  const mySessions = sessions.filter(s => s.studentId === currentUser.id);

  // New Program Registration Wizard Form state
  const [newRegStep, setNewRegStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<'cat_tni_polri' | 'cat_bumn_pns' | 'test_iq' | 'test_aptitude' | 'counseling_mental'>('cat_tni_polri');
  const [selectedMethod, setSelectedMethod] = useState<'offline' | 'online'>('offline');
  const [tempRegId, setTempRegId] = useState('');

  // Sesi Booking states
  const [selectedPsy, setSelectedPsy] = useState<Psychologist>(MOCK_PSYCHOLOGISTS[0]);
  const [selectedSlot, setSelectedSlot] = useState(MOCK_SLOTS[0]);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(false);

  // Upload receipt state
  const [selectedPayForReceipt, setSelectedPayForReceipt] = useState<PaymentTransaction | null>(null);
  const [fakeReceiptName, setFakeReceiptName] = useState('');
  const [uploadReceiptSuccess, setUploadReceiptSuccess] = useState(false);

  // Form Registration submit helper
  const handleCreateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    let pName = '';
    let price = 0;
    if (selectedProgram === 'cat_tni_polri') { pName = 'Bimbel Psikotes Terpadu TNI-POLRI (Akurasi Presisi)'; price = 4500000; }
    else if (selectedProgram === 'cat_bumn_pns') { pName = 'Bimbel Intensif CAT & SKB BUMN / Swasta'; price = 2500000; }
    else if (selectedProgram === 'test_iq') { pName = 'Tes Inteligensi Umum & IQ Individu'; price = 350000; }
    else if (selectedProgram === 'test_aptitude') { pName = 'Asesmen Bakat Minat Studi Utama'; price = 300000; }
    else if (selectedProgram === 'counseling_mental') { pName = 'Sesi Konseling Privat 1-on-1 dengan Psikolog'; price = 450000; }

    const newRegId = 'reg-' + Math.floor(100 + Math.random() * 900);
    const newReg: ProgramRegistration = {
      id: newRegId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      programType: selectedProgram,
      programName: pName,
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'unpaid',
      totalPrice: price,
      amountPaid: 0,
      method: selectedMethod,
      scheduleDate: selectedMethod === 'offline' ? `Ditentukan offline (${siteSettings?.address || 'Jl. Kawis Madiun'})` : 'Fleksibel Kelas Zoom'
    };

    setRegistrations(prev => [newReg, ...prev]);
    setTempRegId(newRegId);
    setNewRegStep(2); // advance to invoice step
  };

  // Simulate Payment Transfer
  const handleSimulatePayment = (paymentType: 'dp' | 'full') => {
    const parentReg = registrations.find(r => r.id === tempRegId);
    if (!parentReg) return;

    let amountToPay = parentReg.totalPrice;
    if (paymentType === 'dp') {
      amountToPay = parentReg.totalPrice * 0.3; // 30% DP
    }

    const newPayId = 'pay-' + Math.floor(100 + Math.random() * 900);
    const newPay: PaymentTransaction = {
      id: newPayId,
      registrationId: parentReg.id,
      studentName: currentUser.name,
      programName: parentReg.programName,
      amount: amountToPay,
      paymentType: paymentType,
      paymentMethod: 'bank_transfer',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      bankSenderName: `${currentUser.name} A/N Bank Mandiri`,
      receiptUrl: 'dimas_transfer_receipt.jpg' // fake uploaded receipt
    };

    setPayments(prev => [newPay, ...prev]);

    // Update registration status to pending_verification
    setRegistrations(prev => prev.map(r => {
      if (r.id === parentReg.id) {
        return {
          ...r,
          paymentStatus: 'pending_verification',
          amountPaid: amountToPay
        };
      }
      return r;
    }));

    setNewRegStep(3); // Go to finish wizard
  };

  // Upload custom receipt helper
  const triggerManualReceiptUpload = (payId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === payId) {
        return {
          ...p,
          status: 'pending',
          receiptUrl: 'uploaded_kuitansi_siswa.png'
        };
      }
      return p;
    }));
    
    // Update reg payment status
    const payment = payments.find(p => p.id === payId);
    if (payment) {
      setRegistrations(prev => prev.map(r => {
        if (r.id === payment.registrationId) {
          return { ...r, paymentStatus: 'pending_verification' };
        }
        return r;
      }));
    }

    setUploadReceiptSuccess(true);
    setTimeout(() => {
      setUploadReceiptSuccess(false);
      setSelectedPayForReceipt(null);
    }, 3000);
  };

  // Booking Counseling click
  const handleCounselBooking = () => {
    const newSessionId = 'sess-' + Math.floor(500 + Math.random() * 500);
    const newSession: CounselingSession = {
      id: newSessionId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      psychologistId: selectedPsy.id,
      psychologistName: selectedPsy.name,
      date: new Date().getFullYear() + '-06-25', // mock future date
      time: selectedSlot.time,
      status: 'booked'
    };

    setSessions(prev => [newSession, ...prev]);
    setBookingSuccessAlert(true);
    setTimeout(() => {
      setBookingSuccessAlert(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 font-sans text-left" id="client-dashboard-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Welcome */}
        <div className="bg-emerald-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg relative overflow-hidden mb-8" id="client-welcome-card">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-800/40 pointer-events-none" />
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-bold uppercase rounded font-mono">
              Siswa Terdaftar Azta
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang, {currentUser.name}!</h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Portal privat keamanan tinggi. Di sini Anda bisa meninjau hasil tes IQ, grafik akademik, menjadwal sesi konseling dengan psikolog, serta mengurus registrasi bimbel.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 bg-emerald-950 p-4 border border-emerald-800/80 rounded-2xl flex items-center space-x-3.5 shadow-sm" id="client-badge-col">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-12 h-12 rounded-full border border-emerald-500 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold">{currentUser.schoolOrInstitution}</p>
              <p className="text-[10px] text-amber-300 mt-1 leading-none font-semibold">🎯 Target Taruna: {currentUser.targetCareer}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SubTab Links Left Sidebar Column */}
          <div className="lg:col-span-3 space-y-2" id="client-tab-list">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'overview'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Ringkasan Akun</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('results')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'results'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-results"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Rapor & Hasil IQ</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('counseling')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'counseling'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-counseling"
            >
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Booking & Konseling</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('payments')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'payments'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-payments"
            >
              <span className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>Riwayat Pembayaran</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('student-card')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'student-card'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-card"
            >
              <span className="flex items-center space-x-2">
                <IdCard className="w-4 h-4 text-emerald-600" />
                <span>Kartu Tanda Siswa</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('e-learning')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'e-learning'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-elearning"
            >
              <span className="flex items-center space-x-2">
                <Tv className="w-4 h-4 text-amber-600" />
                <span>Pelatihan TNI-POLRI</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('tanya-ai')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'tanya-ai'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
              }`}
              id="student-tab-tanya-ai"
            >
              <span className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600 select-none" />
                <span>Ruang Tanya AI</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setActiveSubTab('new-reg'); setNewRegStep(1); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                activeSubTab === 'new-reg'
                  ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs'
                  : 'bg-emerald-50 border-emerald-100 text-emerald-850 hover:bg-emerald-100'
              }`}
              id="student-tab-new-registration"
            >
              <span className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Daftar Program Baru</span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Screen Layout Right Column */}
          <div className="lg:col-span-9" id="client-screen-panel">
            
            {/* SCREEN 1: OVERVIEW */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6 animate-fade-in" id="screen-client-overview">
                
                {/* Active Courses Listings */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                  <h3 className="font-sans font-extrabold text-base text-slate-900 mb-4 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-emerald-800" />
                    <span>Lacak Bimbingan / Tes Aktif Anda</span>
                  </h3>

                  {myRegistrations.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">Anda belum mendaftar di program bimbingan mana pun.</div>
                  ) : (
                    <div className="space-y-3">
                      {myRegistrations.map((reg) => (
                        <div 
                          key={reg.id} 
                          className="p-5 bg-slate-50 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-300 transition-colors"
                        >
                          <div>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-bold font-mono">
                              ID: {reg.id}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 mt-1">{reg.programName}</h4>
                            <div className="flex flex-wrap gap-4 text-[10px] text-gray-500 mt-2 font-mono">
                              <span>📅 Daftar: {reg.registrationDate}</span>
                              <span>🏢 Metode: {reg.method}</span>
                              <span className="text-emerald-900">🕒 {reg.scheduleDate}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-2 shrink-0">
                            {/* Verification/Registration status badge */}
                            <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold text-center leading-none ${
                              reg.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              reg.status === 'completed' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                              'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              Status: {reg.status === 'approved' ? 'Aktif / Berjalan' : reg.status === 'completed' ? 'Selesai' : 'Pending Review'}
                            </span>

                            {/* Payment Status badge */}
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold text-center leading-none ${
                              reg.paymentStatus === 'fully_paid' ? 'bg-emerald-100 text-emerald-950 font-mono' :
                              reg.paymentStatus === 'dp_paid' ? 'bg-amber-100 text-amber-950 font-mono' :
                              'bg-rose-100 text-rose-950 font-mono'
                            }`}>
                              Pembayaran: {
                                reg.paymentStatus === 'fully_paid' ? 'Lunas' :
                                reg.paymentStatus === 'dp_paid' ? 'DP Masuk' :
                                reg.paymentStatus === 'pending_verification' ? 'Pending Verifikasi' : 'Belum Ada Transaksi'
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sesi Konseling Mendatang Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* counseling box Summary */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 flex items-center space-x-1.5 border-b border-gray-100 pb-2">
                      <Clock className="w-4 h-4 text-rose-600" />
                      <span>Sesi Konseling Anda</span>
                    </h4>

                    {mySessions.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 pl-0">Belum ada pemesanan sesi konseling.</p>
                    ) : (
                      <div className="space-y-3 py-2">
                        {mySessions.slice(0, 2).map((s) => (
                          <div key={s.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-slate-900">{s.psychologistName}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5 font-mono">📅 {s.date} | 🕒 {s.time}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              s.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {s.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* quick credential support box */}
                  <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xs text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Hotline Darurat</span>
                      <h4 className="font-sans font-bold text-sm text-slate-100 mt-1">Butuh Pendampingan Segera?</h4>
                      <p className="text-[11px] text-emerald-250 mt-1 leading-relaxed">Admin {siteSettings?.brandName || 'Azta'} siap bertukar informasi di WA mengenai jadwal simulasi fisik dan perubahan metode seleksi.</p>
                    </div>
                    
                    <a 
                      href={`https://wa.me/${cleanPhone(siteSettings?.phone || '0811-3000-888')}?text=Halo%20${encodeURIComponent(siteSettings?.brandName || 'Azta')}%20saya%20siswa...`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 text-center py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold font-mono transition-colors"
                    >
                      Hubungi WA ({siteSettings?.phone || '0811-3000-888'})
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 2: RESULTS (IQ & DIAGRAM DIAGRAMS) */}
            {activeSubTab === 'results' && (
              <div className="space-y-6 animate-fade-in" id="screen-client-results">
                {myResults.length === 0 ? (
                  <div className="bg-white border rounded-3xl p-12 text-center text-gray-400">
                    <p className="font-bold">Psikogram Belum Tersedia</p>
                    <p className="text-xs mt-1">Admin sedang menilai hasil tes IQ atau simulasi akademik Anda. Silakan hubungi Psikolog Azta.</p>
                  </div>
                ) : (
                  myResults.map((r) => (
                    <div key={r.id} className="space-y-6">
                      
                      {/* IQ Summary Banner */}
                      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-amber-300 uppercase font-mono font-bold">Hasil Psikogram Asesmen</span>
                          <h3 className="text-2xl font-bold mt-1">Pemetaan Kecerdasan (IQ)</h3>
                          <p className="text-[11px] text-emerald-200 mt-1">Tanggal Pengujian: {r.testDate} | Sertifikasi: {MOCK_PSYCHOLOGISTS[0].sip}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 bg-slate-800 border border-slate-700 p-4 rounded-2xl text-center shadow-md">
                          <p className="text-amber-400 font-mono text-3xl sm:text-4xl font-extrabold leading-none">{r.iqScore}</p>
                          <p className="text-[11px] text-white font-bold tracking-tight mt-1.5 uppercase leading-none">{r.iqCategory}</p>
                        </div>
                      </div>

                      {/* Math/Verbal Academic Score Indicator Gauge */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Kognitif Akademik */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-55 flex items-center justify-between">
                            <span>Sektor Kognitif Akademik</span>
                            <span className="text-[10px] text-emerald-700">Skor Standar</span>
                          </h4>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Kemampuan Verbal (Bahasa)</span>
                                <span className="font-mono font-bold text-slate-800">{r.academicScores.verbal} / 100</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-800 rounded-full" style={{ width: `${r.academicScores.verbal}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Kemampuan Numerik (Berhitung)</span>
                                <span className="font-mono font-bold text-slate-800">{r.academicScores.numerical} / 100</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-800 rounded-full" style={{ width: `${r.academicScores.numerical}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Kemampuan Spasial (Figural 3D)</span>
                                <span className="font-mono font-bold text-slate-800">{r.academicScores.spatial} / 100</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-800 rounded-full" style={{ width: `${r.academicScores.spatial}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Logika Analitis / Silogisme</span>
                                <span className="font-mono font-bold text-slate-800">{r.academicScores.logicalReasoning} / 100</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-800 rounded-full" style={{ width: `${r.academicScores.logicalReasoning}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Kepribadian Mental Profile traits */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-55 flex items-center justify-between">
                            <span>Sektor Aspek Kepribadian</span>
                            <span className="text-[10px] text-amber-600">Skor Standard</span>
                          </h4>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs text-gray-650 mb-1">
                                <span>Kepemimpinan (Leadership)</span>
                                <span className="font-bold font-mono text-emerald-850">{r.personalityTraits.leadership}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.personalityTraits.leadership * 10}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-650 mb-1">
                                <span>Stabilitas Emosi (Stability)</span>
                                <span className="font-bold font-mono text-emerald-850">{r.personalityTraits.stability}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.personalityTraits.stability * 10}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-650 mb-1">
                                <span>Daya Adaptasi (Adaptability)</span>
                                <span className="font-bold font-mono text-emerald-850">{r.personalityTraits.adaptability}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.personalityTraits.adaptability * 10}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-gray-650 mb-1">
                                <span>Kedisiplinan Mandiri (Discipline)</span>
                                <span className="font-bold font-mono text-emerald-850">{r.personalityTraits.discipline}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.personalityTraits.discipline * 10}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Recommendations from Psychologist Board */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>Rekomendasi Utama Psikolog Utama</span>
                        </h4>

                        <ul className="space-y-3">
                          {r.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2.5 text-xs text-gray-600">
                              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                {index + 1}
                              </span>
                              <span className="leading-relaxed">{rec}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                          <button
                            onClick={() => alert(`Sertifikat fisik resmi sedang disiapkan oleh Sekretariat ${siteSettings?.brandName || 'Azta'}, ${siteSettings?.address || 'Jl. Kawis Madiun'}. Anda bisa mengambil berkas berstempel resmi di kantor ${siteSettings?.brandName || 'Azta'}.`)}
                            className="px-4 py-2 bg-emerald-990 hover:bg-slate-900 border border-emerald-900 text-emerald-100 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors font-mono"
                          >
                            Download Sertifikat PDF Resmi (Simulasi)
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* SCREEN 3: COUNSELING RESERVATION CALENDAR */}
            {activeSubTab === 'counseling' && (
              <div className="space-y-6 animate-fade-in" id="screen-client-counseling">
                
                {/* Book Session alert box */}
                {bookingSuccessAlert && (
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-250 p-4 rounded-xl flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Sukses! Jadwal Sesi Konseling berhasil terpesan. Sesi Anda muncul sebagai terdaftar di Admin.</span>
                  </div>
                )}

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                  <h3 className="font-sans font-extrabold text-base text-slate-900 mb-6 border-b border-gray-100 pb-3">
                    Reservasi Sesi Konseling Interaktif
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* step 1: Select Psychologist */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">1. Pilih Psikolog Pendamping:</p>
                      
                      <div className="space-y-2">
                        {MOCK_PSYCHOLOGISTS.map((psy) => (
                          <div
                            key={psy.id}
                            onClick={() => setSelectedPsy(psy)}
                            className={`p-4 border rounded-xl flex items-center space-x-3.5 cursor-pointer transition-colors ${
                              selectedPsy.id === psy.id
                                ? 'border-emerald-700 bg-emerald-50/60'
                                : 'border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            <img 
                              src={psy.avatar} 
                              alt={psy.name} 
                              className="w-12 h-12 rounded-lg object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left leading-tight">
                              <p className="text-xs font-bold text-slate-900">{psy.name}</p>
                              <p className="text-[10px] text-gray-500 font-semibold mt-1">SIP: {psy.sip}</p>
                              <p className="text-[10px] text-emerald-700 mt-1">{psy.specialization}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* step 2: Select Calendar Slots */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">2. Pilih Jadwal Sesi (Kalender):</p>
                      
                      <div className="grid grid-cols-2 gap-2" id="slot-selectors">
                        {MOCK_SLOTS.map((slot) => {
                          const isSelected = selectedSlot.id === slot.id;
                          return (
                            <div
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-slate-900 border-slate-900 text-white'
                                  : 'bg-white border-gray-105 hover:border-gray-300'
                              }`}
                            >
                              <p className="text-[9px] uppercase tracking-widest font-bold font-mono text-amber-500 leading-none">{slot.day}</p>
                              <p className="text-xs font-extrabold mt-1.5 leading-none">{slot.time}</p>
                              <p className="text-[9px] text-gray-400 mt-1 lines-clamp-1">{slot.psyName}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Core Sesi Notes */}
                      <div className="pt-2">
                        <label className="text-xs font-bold text-gray-400 block mb-1">Catatan Keluhan Singkat (Opsional):</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Ingin mengulas tes koran yang berulang fluktuatif..." 
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-700"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                      onClick={handleCounselBooking}
                      className="px-6 py-3 bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors inline-flex items-center space-x-1"
                    >
                      <Calendar className="w-4 h-4 text-rose-300" />
                      <span>Konfirmasi Jadwal Sesi Konseling</span>
                    </button>
                    <p className="text-[9px] text-gray-400 mt-2 font-mono">*Sesi konseling diselenggarakan di kantor operasional {siteSettings?.brandName || 'Azta'}, {siteSettings?.address || 'Jl. Kawis Taman Madiun'}.</p>
                  </div>
                </div>

                {/* Sesi Hostories logs list */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-4 flex items-center space-x-1.5">
                    <CheckCircle className="w-5 h-5 text-emerald-800" />
                    <span>Laporan Riwayat Konseling Anda</span>
                  </h4>

                  {mySessions.length === 0 ? (
                    <p className="p-4 text-center text-gray-400 text-xs">Belum ada sesi selesai yang diterbitkan.</p>
                  ) : (
                    <div className="space-y-4">
                      {mySessions.map((s, idx) => (
                        <div key={idx} className="p-4 border border-gray-150 rounded-2xl bg-slate-50/50 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-emerald-900 leading-none">{s.psychologistName}</span>
                            <span className="font-semibold text-gray-500">{s.date} ({s.time})</span>
                          </div>
                          
                          <div className="text-[11px] text-gray-650 leading-relaxed border-t border-dashed border-gray-200 pt-2 space-y-2">
                            {s.sessionNotes ? (
                              <>
                                <p><strong>Catatan Sesi Psikolog:</strong> {s.sessionNotes}</p>
                                <p className="text-emerald-850 font-medium"><strong>Saran Aksi Mandiri:</strong> {s.recommendations}</p>
                              </>
                            ) : (
                              <p className="text-amber-700 font-semibold italic">Jadwal Sesi Mendatang. Silakan datang 10 menit sebelum waktu pelayanan di {siteSettings?.address || 'Jl. Kawis Madiun'}.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SCREEN 4: PAYMENTS SELECTIONS & DP UPLOAD */}
            {activeSubTab === 'payments' && (
              <div className="space-y-6 animate-fade-in" id="screen-client-payments">
                
                {uploadReceiptSuccess && (
                  <div className="bg-emerald-50 text-emerald-950 border border-emerald-300 p-4 rounded-xl text-xs font-semibold">
                    Kuitansi Transfer berhasil terunggah! Status pembayaran sedang diverifikasi Admin dalam tempo 15 menit.
                  </div>
                )}

                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
                  <h3 className="font-sans font-extrabold text-base text-slate-900 mb-4 flex items-center space-x-1.5">
                    <DollarSign className="w-5 h-5 text-emerald-800" />
                    <span>Riwayat & Kuitansi Pembayaran</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                          <th className="p-3">Program Bimbel</th>
                          <th className="p-3">Jumlah</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Tanggal</th>
                          <th className="p-3 text-right">Unggah Kuitansi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {myPayments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-400">Belum ada riwayat transaksi terdata.</td>
                          </tr>
                        ) : (
                          myPayments.map((p) => (
                            <tr key={p.id}>
                              <td className="p-3">
                                <p className="font-bold text-slate-900 leading-tight">{p.programName}</p>
                                <span className="text-[9px] font-mono font-semibold uppercase text-amber-600 block mt-0.5">{p.paymentType} payment VIA {p.paymentMethod}</span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-800">
                                Rp{p.amount.toLocaleString('id-ID')}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                  p.status === 'rejected' ? 'bg-rose-100 text-rose-805' :
                                  'bg-amber-100 text-amber-805'
                                }`}>
                                  {p.status === 'approved' ? 'Terverifikasi (Lunas)' : p.status === 'rejected' ? 'Gagal / Ditolak' : 'Menunggu Admin'}
                                </span>
                              </td>
                              <td className="p-3 text-gray-500 font-mono text-[10px]">{p.date}</td>
                              <td className="p-3 text-right">
                                {p.status === 'pending' ? (
                                  <button
                                    onClick={() => setSelectedPayForReceipt(p)}
                                    className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-500 text-emerald-950 text-[10px] font-bold transition-colors"
                                  >
                                    Upload Slip Transfer
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-[10px]">Tersimpan Aman</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Simulated Payment uploading Drawer if click */}
                {selectedPayForReceipt && (
                  <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-md text-left animate-fade-in">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-950 mb-4 border-b pb-2">
                      Unggah Slip Bukti Transfer Rekening:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <div className="text-xs space-y-1.5 text-gray-600">
                        <p><strong>Program:</strong> {selectedPayForReceipt.programName}</p>
                        <p><strong>Total Transfer:</strong> Rp{selectedPayForReceipt.amount.toLocaleString('id-ID')}</p>
                        <hr className="my-2 border-gray-100" />
                        <p className="font-bold text-slate-900">Rekening Resmi Azta Best Choice:</p>
                        <p className="font-mono text-emerald-990 font-extrabold bg-slate-50 p-2 rounded tracking-wider">
                          Bank BCA: 177-300-8888 <br />
                          A/N Azta Best Choice Counseling
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pilih Berkas slip pembayaran (Simulasi):</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-emerald-700 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto animate-pulse" />
                          <p className="text-xs font-semibold text-slate-700 mt-2">kuitansi_transfer_azta.png</p>
                          <span className="text-[9px] text-gray-400 block mt-1">Sistem menyimulasikan deteksi slip transfer secara otomatis</span>
                        </div>

                        <button
                          onClick={() => triggerManualReceiptUpload(selectedPayForReceipt.id)}
                          className="w-full py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold uppercase rounded-lg transition-colors"
                        >
                          Kirim Bukti Pembayaran ke Admin
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SCREEN 5: NEW REGISTRATION WIZARD */}
            {activeSubTab === 'new-reg' && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 text-left shadow-xs animate-fade-in" id="screen-client-wizard">
                
                {/* Steps Headers Indicators */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Form Pendaftaran Online Interaktif</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Bimbel Psikotes, Asesmen IQ, dan Konseling Sesi</p>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-xs font-bold text-emerald-900">
                    <span className={`px-2 py-1 rounded ${newRegStep >= 1 ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100'}`}>1</span>
                    <span className="text-gray-300">→</span>
                    <span className={`px-2 py-1 rounded ${newRegStep >= 2 ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100'}`}>2</span>
                    <span className="text-gray-300">→</span>
                    <span className={`px-2 py-1 rounded ${newRegStep >= 3 ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100'}`}>3</span>
                  </div>
                </div>

                {/* STEP 1: Program selector & forms */}
                {newRegStep === 1 && (
                  <form onSubmit={handleCreateRegistration} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">A. Pilih Pilar Program yang Diikuti:</label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="program-wizard-selectors">
                        <div 
                          onClick={() => setSelectedProgram('cat_tni_polri')}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            selectedProgram === 'cat_tni_polri' ? 'border-emerald-700 bg-emerald-50/60' : 'border-gray-200 hover:border-emerald-250'
                          }`}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-emerald-950 font-bold text-[8px] uppercase">PERSIPAN SELEKSI</span>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-1.5 leading-tight">Bimbel Psikotes Terpadu TNI-POLRI / IPDN</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Sistem Akurasi Presisi, Try out CAT terkomputerisasi, rekap grafik kepribadian.</p>
                          <p className="text-xs font-bold text-emerald-900 font-mono mt-3">Biaya: Rp4.500.000</p>
                        </div>

                        <div 
                          onClick={() => setSelectedProgram('cat_bumn_pns')}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            selectedProgram === 'cat_bumn_pns' ? 'border-emerald-700 bg-emerald-50/60' : 'border-gray-200 hover:border-emerald-250'
                          }`}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-emerald-950 font-bold text-[8px] uppercase">PERSIPAN SELEKSI</span>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-1.5 leading-tight">Persiapan Instansi Pemerintah/BUMN/Swasta</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Pelatihan presentasi, STAR wawancara kerja, LGD, SKB CAT.</p>
                          <p className="text-xs font-bold text-emerald-900 font-mono mt-3">Biaya: Rp2.500.000</p>
                        </div>

                        <div 
                          onClick={() => setSelectedProgram('test_iq')}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            selectedProgram === 'test_iq' ? 'border-emerald-700 bg-emerald-50/60' : 'border-gray-200 hover:border-emerald-250'
                          }`}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[8px] uppercase">ASESMEN PSIKOLOGI</span>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-1.5 leading-tight">Tes IQ / Inteligensi Umum (Sertifikat Resmi)</h4>
                          <p className="text-[10px] text-slate-500 mt-1">IST / WAIS terstandar HIMPSI, laporan psikogram detail.</p>
                          <p className="text-xs font-bold text-emerald-900 font-mono mt-3">Biaya: Rp350.000</p>
                        </div>

                        <div 
                          onClick={() => setSelectedProgram('counseling_mental')}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            selectedProgram === 'counseling_mental' ? 'border-emerald-700 bg-emerald-50/60' : 'border-gray-200 hover:border-emerald-250'
                          }`}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[8px] uppercase">LAYANAN KONSELING</span>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-1.5 leading-tight">Sesi Konseling Privat 1-on-1 Sesi Psikolog</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Pemulihan burnout stres, pengarahan potensi, coping stres.</p>
                          <p className="text-xs font-bold text-emerald-900 font-mono mt-3">Biaya: Rp450.000</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">B. Pilih Metode Pembelajaran:</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input 
                            type="radio" 
                            name="method" 
                            checked={selectedMethod === 'offline'} 
                            onChange={() => setSelectedMethod('offline')} 
                            className="text-emerald-850"
                          />
                          <span>Offline Mandiri di {siteSettings?.address || 'Jl. Kawis Madiun'} (Sangat Direkomendasikan)</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input 
                            type="radio" 
                            name="method" 
                            checked={selectedMethod === 'online'} 
                            onChange={() => setSelectedMethod('online')} 
                            className="text-emerald-850"
                          />
                          <span>Online Live Virtual</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
                    >
                      Daftar Program & Buat Invoice tagihan
                    </button>
                  </form>
                )}

                {/* STEP 2: INVOICE GENERATOR & PAYMENT SIMULATOR */}
                {newRegStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-900 text-xs text-left">
                      <h4 className="font-extrabold text-sm mb-2">Invoice Tagihan Pendaftaran Berhasil Terbit!</h4>
                      <p>Silakan pilih metode penyelesaian pembayaran di bawah ini. Anda bisa membayar penuh atau DP (Uang Muka) sebesar 30% untuk mengamankan slot bimbingan harian Azta.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-150 space-y-3 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nomor Registrasi:</span>
                        <span className="font-bold text-slate-800">{tempRegId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Program Pilihan:</span>
                        <span className="font-bold text-slate-800 text-right">
                          {selectedProgram === 'cat_tni_polri' && 'Bimbel Psikotes Terpadu TNI-POLRI (Akurasi Presisi)'}
                          {selectedProgram === 'cat_bumn_pns' && 'Bimbel Intensif CAT & SKB BUMN / Swasta'}
                          {selectedProgram === 'test_iq' && 'Tes Inteligensi Umum & IQ Individu'}
                          {selectedProgram === 'counseling_mental' && 'Sesi Konseling Privat 1-on-1 dengan Psikolog'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Metode:</span>
                        <span className="font-bold text-slate-800 uppercase">{selectedMethod} (Madiun)</span>
                      </div>
                      <hr className="border-gray-200 my-1" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-900 font-bold">TOTAL BIAYA UTAMA:</span>
                        <span className="font-bold text-emerald-900">
                          Rp{
                            selectedProgram === 'cat_tni_polri' ? '4.500.000' :
                            selectedProgram === 'cat_bumn_pns' ? '2.500.000' :
                            selectedProgram === 'test_iq' ? '350.000' : '450.000'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-[11px] text-amber-950 leading-relaxed font-sans">
                      <strong>Pembayaran Transfer Rekening Azta Best Choice:</strong> <br />
                      Transfer ATM/M-Banking Anda ke nomor rekening <strong>BCA: 177-300-8888 A/N Azta Best Choice Counseling</strong>. Setelah transfer, klik tombol simulasi bayar di bawah untuk mengirim bukti pendaftaran ke Admin agar dikonfirmasi aktif.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProgram === 'cat_tni_polri' || selectedProgram === 'cat_bumn_pns' ? (
                        <button
                          onClick={() => handleSimulatePayment('dp')}
                          className="py-3 bg-white border-2 border-emerald-900 hover:bg-emerald-50 text-emerald-905 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center"
                        >
                          Simulasi Bayar Uang Muka (DP 30%)
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleSimulatePayment('full')}
                        className="py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center flex-grow"
                      >
                        Simulasi Bayar Pelunasan Penuh
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: FINISH & THANKS */}
                {newRegStep === 3 && (
                  <div className="text-center py-8 space-y-4 animate-fade-in">
                    <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                    
                    <div>
                      <h4 className="font-sans font-extrabold text-base text-slate-900">Pendaftaran Anda Berhasil Diteruskan!</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                        Slip bukti transfer Anda telah masuk ke portal Admin. Status program Anda akan aktif (Approved) setelah diverifikasi oleh Admin {siteSettings?.brandName || 'Azta Best Choice'} di {siteSettings?.address || 'Jl. Kawis Madiun'}.
                      </p>
                    </div>

                    <button
                      onClick={() => { setActiveSubTab('overview'); }}
                      className="px-6 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-lg transition-colors inline-block"
                    >
                      Kembali Ke Ringkasan Akun
                    </button>
                  </div>
                )}

              </div>
            )}

            {activeSubTab === 'student-card' && (
              <StudentCard currentUser={currentUser} siteSettings={siteSettings} />
            )}

            {activeSubTab === 'e-learning' && (
              <OnlineTraining currentUser={currentUser} />
            )}

            {activeSubTab === 'tanya-ai' && (
              <AiCounselor currentUser={currentUser} />
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
