/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ProgramRegistration, PaymentTransaction, PsychologicalResult, CounselingSession, SiteSettings, Student, Alumni } from '../types';
import { MOCK_USERS, INITIAL_ALUMNI } from '../mockData';
import { compressImage } from '../utils/imageCompressor';
import { 
  ShieldAlert, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award, 
  UserCheck, 
  BookOpen, 
  Activity, 
  AlertTriangle,
  Edit,
  Save,
  MessageCircle,
  FileCheck,
  Calendar,
  Settings,
  Plus,
  Trash2,
  GraduationCap,
  Bell
} from 'lucide-react';
import AdminNotifications from './AdminNotifications';

interface DashboardAdminProps {
  currentUser: User;
  registrations: ProgramRegistration[];
  setRegistrations: React.Dispatch<React.SetStateAction<ProgramRegistration[]>>;
  payments: PaymentTransaction[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  results: PsychologicalResult[];
  setResults: React.Dispatch<React.SetStateAction<PsychologicalResult[]>>;
  sessions: CounselingSession[];
  setSessions: React.Dispatch<React.SetStateAction<CounselingSession[]>>;
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  alumni: Alumni[];
  onUpdateAlumni: (newAlumni: Alumni[]) => void;
}

type AdminSubTab = 'stats' | 'registrations' | 'payments' | 'results' | 'counseling' | 'students' | 'alumni' | 'settings' | 'notifications';

export default function DashboardAdmin({
  currentUser,
  registrations,
  setRegistrations,
  payments,
  setPayments,
  results,
  setResults,
  sessions,
  setSessions,
  siteSettings,
  onUpdateSettings,
  students,
  onUpdateStudents,
  alumni,
  onUpdateAlumni
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<AdminSubTab>('stats');
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });

  // Synchronize when siteSettings prop shifts
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({ ...siteSettings });
    }
  }, [siteSettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 200, 200, 0.75);
        setSettingsForm(prev => ({ ...prev, logoUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setSettingsForm(prev => ({ ...prev, logoUrl: '' }));
  };

  const handleSaveSettings = () => {
    onUpdateSettings(settingsForm);
    setSuccessAlert('Pengaturan beranda, logo, alamat, No. Telp, program bimbingan & jam operasional berhasil diperbarui!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessAlert(''), 4000);
  };

  // Programs management within Settings form state
  const [newProgramName, setNewProgramName] = useState('');
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(null);
  const [editingProgramText, setEditingProgramText] = useState('');

  // Services management within Settings
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceInstruments, setNewServiceInstruments] = useState('');
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingServiceTitle, setEditingServiceTitle] = useState('');
  const [editingServiceInstruments, setEditingServiceInstruments] = useState('');

  // Benefits management within Settings
  const [newBenefitText, setNewBenefitText] = useState('');
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [editingBenefitText, setEditingBenefitText] = useState('');

  const handleAddService = () => {
    if (!newServiceTitle.trim()) return;
    const currentServices = settingsForm.services || [];
    const instrumentsArray = newServiceInstruments
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    
    const newSrv = {
      id: 'srv-' + Date.now(),
      title: newServiceTitle.trim(),
      instruments: instrumentsArray
    };
    
    setSettingsForm(prev => ({
      ...prev,
      services: [...currentServices, newSrv]
    }));
    setNewServiceTitle('');
    setNewServiceInstruments('');
  };

  const handleDeleteService = (index: number) => {
    const currentServices = settingsForm.services || [];
    const updated = currentServices.filter((_, i) => i !== index);
    setSettingsForm(prev => ({ ...prev, services: updated }));
  };

  const handleStartEditService = (index: number, srv: any) => {
    setEditingServiceIndex(index);
    setEditingServiceTitle(srv.title);
    setEditingServiceInstruments(srv.instruments.join(', '));
  };

  const handleSaveEditService = (index: number) => {
    if (!editingServiceTitle.trim()) return;
    const currentServices = settingsForm.services || [];
    const instrumentsArray = editingServiceInstruments
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    const updated = [...currentServices];
    updated[index] = {
      ...updated[index],
      title: editingServiceTitle.trim(),
      instruments: instrumentsArray
    };

    setSettingsForm(prev => ({ ...prev, services: updated }));
    setEditingServiceIndex(null);
    setEditingServiceTitle('');
    setEditingServiceInstruments('');
  };

  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    const currentBenefits = settingsForm.benefits || [];
    setSettingsForm(prev => ({
      ...prev,
      benefits: [...currentBenefits, newBenefitText.trim()]
    }));
    setNewBenefitText('');
  };

  const handleDeleteBenefit = (index: number) => {
    const currentBenefits = settingsForm.benefits || [];
    const updated = currentBenefits.filter((_, i) => i !== index);
    setSettingsForm(prev => ({ ...prev, benefits: updated }));
  };

  const handleStartEditBenefit = (index: number, val: string) => {
    setEditingBenefitIndex(index);
    setEditingBenefitText(val);
  };

  const handleSaveEditBenefit = (index: number) => {
    if (!editingBenefitText.trim()) return;
    const currentBenefits = settingsForm.benefits || [];
    const updated = [...currentBenefits];
    updated[index] = editingBenefitText.trim();
    setSettingsForm(prev => ({ ...prev, benefits: updated }));
    setEditingBenefitIndex(null);
    setEditingBenefitText('');
  };

  // Alumni management state variables
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [alumniFullName, setAlumniFullName] = useState('');
  const [alumniGradYear, setAlumniGradYear] = useState('');
  const [alumniAchievement, setAlumniAchievement] = useState('');
  const [alumniPhotoUrl, setAlumniPhotoUrl] = useState('');

  const handleStartAddAlumni = () => {
    setEditingAlumni(null);
    setAlumniFullName('');
    setAlumniGradYear(new Date().getFullYear().toString());
    setAlumniAchievement('');
    setAlumniPhotoUrl('');
    setShowAlumniModal(true);
  };

  const handleStartEditAlumni = (al: Alumni) => {
    setEditingAlumni(al);
    setAlumniFullName(al.fullName);
    setAlumniGradYear(al.graduationYear);
    setAlumniAchievement(al.achievement);
    setAlumniPhotoUrl(al.photoUrl);
    setShowAlumniModal(true);
  };

  const handleDeleteAlumni = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus alumni "${name}"?`)) {
      onUpdateAlumni(alumni.filter(a => a.id !== id));
      setSuccessAlert('Data alumni berhasil dihapus!');
      setTimeout(() => setSuccessAlert(''), 3000);
    }
  };

  const handleResetAlumniToDefault = () => {
    if (window.confirm("Apakah Anda yakin ingin menyinkronkan/memulihkan daftar alumni ke pengaturan default terbaru dari sistem? Langkah ini akan memperbarui tampilan pilar alumni Anda dengan data yang valid, termasuk Enggar Satria Pratama & Muhammad Fauzan Al Madany.")) {
      onUpdateAlumni(INITIAL_ALUMNI);
      setSuccessAlert('Data alumni berhasil disinkronkan ke default sistem terbaru!');
      setTimeout(() => setSuccessAlert(''), 3000);
    }
  };

  const handleSaveAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniFullName.trim() || !alumniGradYear.trim() || !alumniAchievement.trim()) {
      alert('Semua bidang (kecuali foto opsional) wajib diisi.');
      return;
    }

    const defaultPhotos = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    ];
    const finalPhoto = alumniPhotoUrl.trim() || defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];

    if (editingAlumni) {
      const updated = alumni.map(a => {
        if (a.id === editingAlumni.id) {
          return {
            ...a,
            fullName: alumniFullName.trim(),
            graduationYear: alumniGradYear.trim(),
            achievement: alumniAchievement.trim(),
            photoUrl: finalPhoto
          };
        }
        return a;
      });
      onUpdateAlumni(updated);
      setSuccessAlert('Data alumni berhasil diperbarui!');
    } else {
      const newAl: Alumni = {
        id: 'ALUM_' + Date.now(),
        fullName: alumniFullName.trim(),
        graduationYear: alumniGradYear.trim(),
        achievement: alumniAchievement.trim(),
        photoUrl: finalPhoto
      };
      onUpdateAlumni([newAl, ...alumni]);
      setSuccessAlert('Alumni baru berhasil ditambahkan!');
    }

    setShowAlumniModal(false);
    setTimeout(() => setSuccessAlert(''), 3500);
  };

  const handleAddProgram = () => {
    if (!newProgramName.trim()) return;
    const currentProgs = settingsForm.programs || [];
    if (currentProgs.includes(newProgramName.trim())) {
      alert('Program sudah terdaftar!');
      return;
    }
    const updated = [...currentProgs, newProgramName.trim()];
    setSettingsForm(prev => ({ ...prev, programs: updated }));
    setNewProgramName('');
  };

  const handleDeleteProgram = (index: number) => {
    const currentProgs = settingsForm.programs || [];
    const updated = currentProgs.filter((_, i) => i !== index);
    setSettingsForm(prev => ({ ...prev, programs: updated }));
  };

  const handleStartEditProgram = (index: number, val: string) => {
    setEditingProgramIndex(index);
    setEditingProgramText(val);
  };

  const handleSaveEditProgram = (index: number) => {
    if (!editingProgramText.trim()) return;
    const currentProgs = settingsForm.programs || [];
    const updated = [...currentProgs];
    updated[index] = editingProgramText.trim();
    setSettingsForm(prev => ({ ...prev, programs: updated }));
    setEditingProgramIndex(null);
    setEditingProgramText('');
  };

  // Student registration management states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  const [studFullName, setStudFullName] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studPhone, setStudPhone] = useState('');
  const [studPassword, setStudPassword] = useState('');
  const [studBirthPlace, setStudBirthPlace] = useState('');
  const [studBirthDate, setStudBirthDate] = useState('');
  const [studGender, setStudGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [studAddress, setStudAddress] = useState('');
  const [studLastEducation, setStudLastEducation] = useState('SMA / Sederajat');
  const [studProgramJoined, setStudProgramJoined] = useState('');
  const [studPhotoUrl, setStudPhotoUrl] = useState('');

  const [studentSearch, setStudentSearch] = useState('');
  const [studentProgramFilter, setStudentProgramFilter] = useState('All');

  // Set default selection once programs load
  useEffect(() => {
    const progList = siteSettings.programs || [];
    if (progList.length > 0 && !studProgramJoined) {
      setStudProgramJoined(progList[0]);
    }
  }, [siteSettings, studProgramJoined]);

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studFullName.trim()) return alert('Nama Lengkap wajib diisi!');
    if (!studEmail.trim()) return alert('Email wajib diisi!');
    if (!studPhone.trim()) return alert('No WhatsApp/HP wajib diisi!');
    if (!studPassword.trim()) return alert('Password wajib diisi!');

    // Generate unique automatic student code
    const year = new Date().getFullYear();
    const count = students.length;
    const nextSeq = String(count + 1).padStart(3, '0');
    const autoNumber = `AST-${year}-${nextSeq}`;

    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      studentNumber: autoNumber,
      fullName: studFullName.trim(),
      email: studEmail.trim(),
      phone: studPhone.trim(),
      password: studPassword,
      birthPlace: studBirthPlace.trim(),
      birthDate: studBirthDate || '2004-01-01',
      gender: studGender,
      address: studAddress.trim(),
      lastEducation: studLastEducation,
      programJoined: studProgramJoined || (siteSettings.programs?.[0] || 'Pelatihan Psikotes TNI-POLRI'),
      photoUrl: studPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      registrationDate: new Date().toISOString().split('T')[0]
    };

    onUpdateStudents([...students, newStudent]);
    setShowAddStudentModal(false);
    resetStudentForm();
  };

  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studFullName.trim() || !editingStudentId) return;
    if (!studEmail.trim()) return alert('Email wajib diisi!');
    if (!studPhone.trim()) return alert('No WhatsApp/HP wajib diisi!');
    if (!studPassword.trim()) return alert('Password wajib diisi!');

    const updated = students.map(s => {
      if (s.id === editingStudentId) {
        return {
          ...s,
          fullName: studFullName.trim(),
          email: studEmail.trim(),
          phone: studPhone.trim(),
          password: studPassword,
          birthPlace: studBirthPlace.trim(),
          birthDate: studBirthDate,
          gender: studGender,
          address: studAddress.trim(),
          lastEducation: studLastEducation,
          programJoined: studProgramJoined,
          photoUrl: studPhotoUrl
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setEditingStudentId(null);
    resetStudentForm();
  };

  const handleStartEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudFullName(student.fullName);
    setStudEmail(student.email || '');
    setStudPhone(student.phone || '');
    setStudPassword(student.password || '');
    setStudBirthPlace(student.birthPlace);
    setStudBirthDate(student.birthDate);
    setStudGender(student.gender);
    setStudAddress(student.address);
    setStudLastEducation(student.lastEducation);
    setStudProgramJoined(student.programJoined);
    setStudPhotoUrl(student.photoUrl || '');
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus siswa "${name}" dari database resmi?`)) {
      onUpdateStudents(students.filter(s => s.id !== id));
    }
  };

  const resetStudentForm = () => {
    setStudFullName('');
    setStudEmail('');
    setStudPhone('');
    setStudPassword('');
    setStudBirthPlace('');
    setStudBirthDate('');
    setStudGender('Laki-laki');
    setStudAddress('');
    setStudLastEducation('SMA / Sederajat');
    setStudProgramJoined(siteSettings.programs?.[0] || 'Pelatihan Psikotes TNI-POLRI');
    setStudPhotoUrl('');
  };
  
  // States of result editing
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editIq, setEditIq] = useState<number>(115);
  const [editIqCat, setEditIqCat] = useState<string>('Diatas Rata-Rata');
  const [editVerbal, setEditVerbal] = useState<number>(80);
  const [editNum, setEditNum] = useState<number>(85);
  const [editSpat, setEditSpat] = useState<number>(75);
  const [editLogic, setEditLogic] = useState<number>(80);
  const [editRec1, setEditRec1] = useState<string>('');
  const [editRec2, setEditRec2] = useState<string>('');

  // States of counseling notes editing
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editSessionNotes, setEditSessionNotes] = useState<string>('');
  const [editSessionRec, setEditSessionRec] = useState<string>('');

  // Sesi alerts
  const [successAlert, setSuccessAlert] = useState('');

  // 1. Calculate Executive Metrics
  const totalStudentsCount = MOCK_USERS.filter(u => u.role === 'student').length;
  const totalRegistrationsCount = registrations.length;
  
  // Revenue calculation from approved payments
  const totalRevenue = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;

  // 2. Action: Approve pending payment
  const handleApprovePayment = (paymentId: string) => {
    // 1. Update Payment status to approved (Lunas)
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return { ...p, status: 'approved' };
      }
      return p;
    }));

    // Find target payment to get related registrationId
    const targetPayment = payments.find(p => p.id === paymentId);
    if (targetPayment) {
      // 2. Update registration status of student to approved (active) and paymentStatus to fully_paid or dp_paid
      setRegistrations(prev => prev.map(reg => {
        if (reg.id === targetPayment.registrationId) {
          const finalPayStatus = targetPayment.paymentType === 'full' ? 'fully_paid' : 'dp_paid';
          return {
            ...reg,
            status: 'approved',
            paymentStatus: finalPayStatus,
            amountPaid: targetPayment.amount
          };
        }
        return reg;
      }));
    }

    setSuccessAlert('Pembayaran Siswa berhasil dikonfirmasi Lunas! Program Belajar Terkait kini Berstatus Aktif (Approved).');
    setTimeout(() => setSuccessAlert(''), 400);
  };

  // 3. Action: Save edited test results
  const handleStartEditResult = (res: PsychologicalResult) => {
    setEditingResultId(res.id);
    setEditIq(res.iqScore);
    setEditIqCat(res.iqCategory);
    setEditVerbal(res.academicScores.verbal);
    setEditNum(res.academicScores.numerical);
    setEditSpat(res.academicScores.spatial);
    setEditLogic(res.academicScores.logicalReasoning);
    setEditRec1(res.recommendations[0] || '');
    setEditRec2(res.recommendations[1] || '');
  };

  const handleSaveResult = (resultId: string) => {
    setResults(prev => prev.map(res => {
      if (res.id === resultId) {
        return {
          ...res,
          iqScore: editIq,
          iqCategory: editIqCat,
          academicScores: {
            verbal: editVerbal,
            numerical: editNum,
            spatial: editSpat,
            logicalReasoning: editLogic
          },
          recommendations: [editRec1, editRec2].filter(Boolean)
        };
      }
      return res;
    }));

    setEditingResultId(null);
    setSuccessAlert('Hasil Tes & Psikogram Siswa berhasil tersimpan dan langsung sinkron ke halaman Siswa terkait!');
    setTimeout(() => setSuccessAlert(''), 4000);
  };

  // 4. Action: Save counseling reports remarks
  const handleStartEditSession = (s: CounselingSession) => {
    setEditingSessionId(s.id);
    setEditSessionNotes(s.sessionNotes || '');
    setEditSessionRec(s.recommendations || '');
  };

  const handleSaveSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'completed',
          sessionNotes: editSessionNotes,
          recommendations: editSessionRec
        };
      }
      return s;
    }));

    setEditingSessionId(null);
    setSuccessAlert('Catatan Hasil Terapi Sesi Konseling Psikolog berhasil didaftarkan!');
    setTimeout(() => setSuccessAlert(''), 400);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 font-sans text-left" id="admin-dashboard-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Top welcome banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg relative overflow-hidden mb-8" id="admin-welcome-card">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-slate-800/50 pointer-events-none" />
          
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-bold uppercase rounded font-mono">
              Portal Direksi Pusat Azta
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Halo, Admin Azta Madiun!</h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Kontrol terpusat untuk memproses pembayaran siswa, menerbitkan laporan nilai psikotes taruna, mengelola jadwal psikolog, dan memantau perkembangan bimbingan.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 bg-slate-950 p-4 border border-slate-800 rounded-2xl flex items-center space-x-3 shadow-md" id="admin-meta">
            <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold font-mono">ROLE: ADMINISTRATOR</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 leading-none">Status Enkripsi: Aktif</p>
            </div>
          </div>
        </div>

        {/* Global Notification Success */}
        {successAlert && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fade-in" id="admin-success-alert">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successAlert}</span>
          </div>
        )}

        {/* Admin Navigation Menu Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-3" id="admin-subtab-selector">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'stats' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 hover:bg-slate-100 border-gray-155'
            }`}
          >
            Executive Stats
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border flex items-center space-x-1 ${
              activeTab === 'payments' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-payments"
          >
            <span>Verifikasi Bayar ({pendingPaymentsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'registrations' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-registrations"
          >
            Daftar Program ({totalRegistrationsCount})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'results' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-test-results"
          >
            Laporan Psikogram (Tes IQ)
          </button>
          <button
            onClick={() => setActiveTab('counseling')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'counseling' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-counseling"
          >
            Sesi Konseling ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border flex items-center space-x-1 ${
              activeTab === 'students' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-students"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kelola Siswa ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('alumni')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border flex items-center space-x-1 ${
              activeTab === 'alumni' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-alumni"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Kelola Alumni ({alumni.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border flex items-center space-x-1 ${
              activeTab === 'notifications' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-notifications"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Notifikasi Otomatis</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border flex items-center space-x-1 ${
              activeTab === 'settings' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-650 hover:bg-slate-100 border-gray-155'
            }`}
            id="admin-tab-settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Web</span>
          </button>
        </div>

        {/* SCREEN MODULES RENDERER */}
        <div className="space-y-6" id="admin-screen-box">
          
          {/* SCREEN 1: STATS & SUMMARY DASHBOARD */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fade-in" id="panel-admin-stats">
              
              {/* Counter Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                
                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center space-x-4 shadow-xs">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-slate-805" />
                  </div>
                  <div className="leading-tight text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Jumlah Siswa</span>
                    <p className="text-2xl font-extrabold text-slate-950 mt-1">{totalStudentsCount} Siswa</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center space-x-4 shadow-xs">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-emerald-805" />
                  </div>
                  <div className="leading-tight text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Total Pendapatan</span>
                    <p className="text-xl font-extrabold text-emerald-900 mt-1">Rp{totalRevenue.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center space-x-4 shadow-xs">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-amber-605" />
                  </div>
                  <div className="leading-tight text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Bimbel Terdata</span>
                    <p className="text-2xl font-extrabold text-slate-950 mt-1">{totalRegistrationsCount} Aplikasi</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center space-x-4 shadow-xs">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-rose-505" />
                  </div>
                  <div className="leading-tight text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Pendes Bayar</span>
                    <p className="text-2xl font-extrabold text-rose-700 mt-1">{pendingPaymentsCount} Pending</p>
                  </div>
                </div>

              </div>

              {/* Graphic charts: Program visual percentages (No external libraries crash safety guarantee) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Chart 1: program registrations bar */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center space-x-1.5 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-emerald-800" />
                      <span>Rasio Persentase Minat Program Bimbel</span>
                    </h4>
                    <span className="text-[9px] font-mono text-gray-400">Total: {totalRegistrationsCount}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-650 mb-1">
                        <span>A. Bimbel Psikotes TNI-POLRI / Taruna</span>
                        <span className="font-bold">65%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-800 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-650 mb-1">
                        <span>A. Bimbel CAT instansi PEMERINTAH / BUMN</span>
                        <span className="font-bold">20%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-650 mb-1">
                        <span>B. Sesi Asesmen / Tes IQ Individu</span>
                        <span className="font-bold">12%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '12%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-650 mb-1">
                        <span>C. Layanan Konseling Pasien Klinik</span>
                        <span className="font-bold">3%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '3%' }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-450 mt-6 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    📈 <strong>Statistik Insight:</strong> Pelatihan kognitif ketara taktis (TNI-POLRI) terus mendominasi bursa penerimaan dwi-semester Jawa Timur.
                  </p>
                </div>

                {/* Quick actions listing shortcuts */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                    Tautan Cepat Logistik
                  </h4>

                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border border-gray-200 hover:border-emerald-700 hover:bg-white text-left text-xs text-gray-700 font-bold block transition-all"
                    >
                      💳 Verifikasi data slip transfer siswa terkirim ({pendingPaymentsCount} menunggu konfirmasi)
                    </button>

                    <button
                      onClick={() => setActiveTab('results')}
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border border-gray-200 hover:border-emerald-700 hover:bg-white text-left text-xs text-gray-700 font-bold block transition-all"
                    >
                      📝 Masukkan & perbarui Rapor Psikometri IQ Siswa
                    </button>

                    <button
                      onClick={() => setActiveTab('counseling')}
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border border-gray-200 hover:border-emerald-700 hover:bg-white text-left text-xs text-gray-700 font-bold block transition-all"
                    >
                      💬 Tulis rekam konseling pasca-sesi psikolog ({sessions.length} sesi terdata)
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 2: VERIFICATION PENDING PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left animate-fade-in" id="panel-admin-payments">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b">
                Proses Verifikasi Kuitansi Transfer & Pembayaran DP
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 font-bold text-[10px] uppercase border-b border-gray-100 tracking-wider">
                      <th className="p-3">Siswa</th>
                      <th className="p-3">Program Bimbel</th>
                      <th className="p-3">Jumlah Transfer</th>
                      <th className="p-3">Tipe / Metode</th>
                      <th className="p-3">Slip Lampiran</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-105">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-950">{p.studentName}</td>
                        <td className="p-3 text-gray-600 font-medium">{p.programName}</td>
                        <td className="p-3 font-mono font-bold text-emerald-900">
                          Rp{p.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-slate-500 uppercase font-semibold font-mono text-[9px]">
                          {p.paymentType} payment | {p.paymentMethod}
                        </td>
                        <td className="p-3 text-emerald-800 font-semibold underline cursor-pointer" onClick={() => alert(`Sistem menautkan data slip transfer kuitansi: ${p.receiptUrl}`)}>
                          {p.receiptUrl}
                        </td>
                        <td className="p-4 text-right">
                          {p.status === 'pending' ? (
                            <button
                              onClick={() => handleApprovePayment(p.id)}
                              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors"
                            >
                              Konfirmasi Lunas
                            </button>
                          ) : (
                            <span className="text-emerald-800 font-bold text-[10px] uppercase flex items-center justify-end space-x-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 3: ALL REGISTRATIONS MANAGER */}
          {activeTab === 'registrations' && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-left animate-fade-in" id="panel-admin-registrations">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b">
                Log Kontrol Bimbingan & Pendaftaran Aktif
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 font-bold text-[10px] uppercase border-b tracking-wider">
                      <th className="p-3">ID Reg</th>
                      <th className="p-3">Siswa</th>
                      <th className="p-3">Program Bimbel</th>
                      <th className="p-3">Metode Kelas</th>
                      <th className="p-3">Tanggal Daftar</th>
                      <th className="p-3">Verifikasi Bayar</th>
                      <th className="p-3 text-right">Status Program</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-500">{r.id}</td>
                        <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                        <td className="p-3 font-medium text-gray-700">{r.programName}</td>
                        <td className="p-3 uppercase font-mono text-[9px] font-semibold text-emerald-800">{r.method}</td>
                        <td className="p-3 text-gray-500 font-mono text-[10px]">{r.registrationDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            r.paymentStatus === 'fully_paid' ? 'bg-emerald-100 text-emerald-800' :
                            r.paymentStatus === 'dp_paid' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {
                              r.paymentStatus === 'fully_paid' ? 'Buka Lunas' :
                              r.paymentStatus === 'dp_paid' ? 'DP 30% Masuk' :
                              r.paymentStatus === 'pending_verification' ? 'Menunggu Review' : 'Belum Ditransfer'
                            }
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold leading-none ${
                            r.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-amber-50 text-amber-801 border border-amber-250'
                          }`}>
                            {r.status === 'approved' ? 'Aktif Bimbel' : 'Review'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 4: UPDATE PSYCHOLOGICAL RESULTS (RAPOR & IQ) */}
          {activeTab === 'results' && (
            <div className="space-y-6 animate-fade-in" id="panel-admin-results">
              
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                <h3 className="font-sans font-extrabold text-sm uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b">
                  Sistem Penerbitan & Pembaruan Skor Psikogram (IQ & Kognitif)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 font-semibold text-[10px] uppercase border-b tracking-wider">
                        <th className="p-3">Siswa</th>
                        <th className="p-3">Skor IQ / Kategori</th>
                        <th className="p-3">Verbal / Numerik / Spasial / Logika</th>
                        <th className="p-3">Tanggal Tes</th>
                        <th className="p-3 text-right">Aksi Edit Psikogram</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map((res) => (
                        <tr key={res.id}>
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{res.studentName}</p>
                            <p className="text-[10px] text-gray-400">ID Evaluasi: {res.id}</p>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800 font-mono text-sm">{res.iqScore}</span>
                            <span className="text-[10px] text-gray-500 font-semibold block mt-1">{res.iqCategory}</span>
                          </td>
                          <td className="p-3 space-x-2 font-mono text-[10px] text-emerald-900">
                            <span>Vb: <strong className="text-slate-900">{res.academicScores.verbal}</strong></span>
                            <span>Nm: <strong className="text-slate-900">{res.academicScores.numerical}</strong></span>
                            <span>Sp: <strong className="text-slate-900">{res.academicScores.spatial}</strong></span>
                            <span>Lg: <strong className="text-slate-900">{res.academicScores.logicalReasoning}</strong></span>
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[10px]">{res.testDate}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleStartEditResult(res)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1 inline-flex"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Update Hasil</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Editing Form Section */}
              {editingResultId && (
                <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 text-left animate-fade-in space-y-6" id="result-editor-pnl">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-1.5">
                      <FileCheck className="w-5 h-5 text-emerald-800" />
                      <span>Form Pengisian Psikogram Real-Time</span>
                    </h4>
                    <button 
                      onClick={() => setEditingResultId(null)}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Batal Pengeditan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* IQ edit */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Skor IQ (Inteligensi)</label>
                      <input 
                        type="number" 
                        value={editIq}
                        onChange={(e) => setEditIq(Number(e.target.value))}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Kategori Inteligensi</label>
                      <select 
                        value={editIqCat}
                        onChange={(e) => setEditIqCat(e.target.value)}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      >
                        <option value="Sangat Superior">Sangat Superior (IQ {'>'} 130)</option>
                        <option value="Superior">Superior (IQ 120-129)</option>
                        <option value="Diatas Rata-Rata">Diatas Rata-Rata (IQ 110-119)</option>
                        <option value="Rata-Rata">Rata-Rata (IQ 90-109)</option>
                        <option value="Dibawah Rata-Rata">Dibawah Rata-Rata (IQ 80-89)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nilai Verbal (Skor 0-100)</label>
                      <input 
                        type="number" 
                        value={editVerbal}
                        onChange={(e) => setEditVerbal(Number(e.target.value))}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nilai Numerik (Skor 0-100)</label>
                      <input 
                        type="number" 
                        value={editNum}
                        onChange={(e) => setEditNum(Number(e.target.value))}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nilai Spasial (Figural 3D)</label>
                      <input 
                        type="number" 
                        value={editSpat}
                        onChange={(e) => setEditSpat(Number(e.target.value))}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nilai Logika Analitis / Silogisme</label>
                      <input 
                        type="number" 
                        value={editLogic}
                        onChange={(e) => setEditLogic(Number(e.target.value))}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg focus:border-emerald-700 bg-slate-50/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rekomendasi Terapi Psikolog:</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400">Saran 1 (Kemampuan Belajar):</label>
                      <input 
                        type="text" 
                        value={editRec1}
                        onChange={(e) => setEditRec1(e.target.value)}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400">Saran 2 (Mental / Kepribadian):</label>
                      <input 
                        type="text" 
                        value={editRec2}
                        onChange={(e) => setEditRec2(e.target.value)}
                        className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveResult(editingResultId)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terbitkan Psikogram</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* SCREEN 5: COUNSELING BOOKING LOGS LISTS */}
          {activeTab === 'counseling' && (
            <div className="space-y-6 animate-fade-in" id="panel-admin-counseling">
              
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-left">
                <h3 className="font-sans font-extrabold text-sm uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b">
                  Tinjau Booking & Kelola Rekam Medis Konseling
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-55 text-gray-400 font-bold text-[10px] uppercase border-b tracking-wider">
                        <th className="p-3">ID Sesi</th>
                        <th className="p-3">Siswa</th>
                        <th className="p-3">Psikolog Utama</th>
                        <th className="p-3">Tanggal / Waktu</th>
                        <th className="p-3">Hasil Evaluasi Sesi</th>
                        <th className="p-3 text-right">Aksi Tambah Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sessions.map((s) => (
                        <tr key={s.id}>
                          <td className="p-3 font-mono font-bold text-slate-400">{s.id}</td>
                          <td className="p-3 font-bold text-slate-900">{s.studentName}</td>
                          <td className="p-3 text-gray-650 font-medium">{s.psychologistName}</td>
                          <td className="p-3 font-mono text-[10px] text-gray-500">📅 {s.date} <br/>🕒 {s.time}</td>
                          <td className="p-3 leading-relaxed max-w-xs">
                            {s.sessionNotes ? (
                              <p className="line-clamp-2 text-[11px] text-gray-500"><strong>Masalah:</strong> {s.sessionNotes}</p>
                            ) : (
                              <span className="text-amber-700 font-bold text-[10px] uppercase flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Menunggu Sesi</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleStartEditSession(s)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-gray-300 transition-colors flex items-center space-x-1 inline-flex"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Analisis Sesi</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sesi counseling remarking editor */}
              {editingSessionId && (
                <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 text-left space-y-4 animate-fade-in" id="session-editor-pnl">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-950 mb-4 border-b pb-2">
                    Masukkan Catatan Hasil Sesi Terapi (Evaluasi Pasien)
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Catatan Analisis Perkembangan Pasien:</label>
                    <textarea 
                      rows={3}
                      value={editSessionNotes}
                      onChange={(e) => setEditSessionNotes(e.target.value)}
                      placeholder="e.g. Pasien mengalami kecemasan situasional di tes wartegg, setelah katarsis emosi skor stabilitas pulih..."
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Langkah / Terapi Mandiri Rekomendasi:</label>
                    <input 
                      type="text"
                      value={editSessionRec}
                      onChange={(e) => setEditSessionRec(e.target.value)}
                      placeholder="e.g. Melakukan pernapasan kotak di sela transisi tes Pauli dan Kraepelin"
                      className="w-full p-2.5 text-xs border border-gray-255 rounded-lg"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleSaveSession(editingSessionId)}
                      className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan & Upload</span>
                    </button>
                    <button
                      onClick={() => setEditingSessionId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SCREEN 7: WEBSITE GLOBAL CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-150 rounded-[2rem] p-6 sm:p-8 text-left space-y-8 animate-fade-in" id="panel-admin-settings">
              <div className="border-b pb-4">
                <h3 className="text-xl font-extrabold text-slate-900">Pengaturan Tampilan & Profil Lembaga</h3>
                <p className="text-xs text-gray-500 mt-1">Sesuaikan nama lembaga, logo, slogan, info alamat, No. Telp, jam layanan, dan banner beranda secara visual.</p>
              </div>

              {/* Logo Settings */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">1. Logo Lembaga</h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-dashed border-gray-250">
                  <div className="w-20 h-20 bg-emerald-900 rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner">
                    {settingsForm.logoUrl ? (
                      <img src={settingsForm.logoUrl} alt="Logo Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-amber-300 font-extrabold text-2xl">AZ</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800">Ubah Berkas Logo Instansi</p>
                    <p className="text-[10px] text-gray-400">Pilih gambar file logo (disarankan berformat .PNG transparan / berkas sirkular maks. 2MB)</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        Unggah Gambar Baru
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      {settingsForm.logoUrl && (
                        <button onClick={handleResetLogo} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-705 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Gunakan Logo Bawaan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">2. Identitas Brand & Slogan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Nama Utama Brand:</label>
                    <input 
                      type="text"
                      value={settingsForm.brandName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, brandName: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. Azta"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Akhiran Suffix:</label>
                    <input 
                      type="text"
                      value={settingsForm.brandSuffix}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, brandSuffix: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. Best Choice"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Sub-judul / Deskripsi Keahlian:</label>
                    <input 
                      type="text"
                      value={settingsForm.subTitle}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, subTitle: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. Counseling & Psychology"
                    />
                  </div>
                </div>
              </div>

              {/* Background Website Settings */}
              <div className="space-y-4 pt-4 border-t" id="settings-background-block">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">3. Gambar Latar Belakang Website (Smooth, Soft, Soft)</h4>
                <p className="text-[11px] text-gray-500">
                  Ubah gambar latar belakang utama situs untuk memberikan nuansa yang smooth, kekinian, dan soft. Anda bisa mengunggah berkas foto atau memasukkan URL gambar langsung (misalnya URL gambar bangunan bimbingan/counseling).
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 text-left space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-550 block">URL Gambar Latar Belakang (Main Background Photo URL):</label>
                    <input 
                      type="text"
                      value={settingsForm.backgroundImageUrl || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, backgroundImageUrl: e.target.value }))}
                      className="w-full p-2.5 text-xs text-slate-800 border border-gray-250 rounded-lg font-mono focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                      placeholder="Masukkan URL foto atau unggah berkas di bawah ini"
                    />
                  </div>
                  
                  {settingsForm.backgroundImageUrl && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Pratinjau Background:</label>
                      <div className="w-full h-24 rounded-xl overflow-hidden border border-gray-200 relative bg-slate-100">
                        <img 
                          referrerPolicy="no-referrer"
                          src={settingsForm.backgroundImageUrl} 
                          alt="Background Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded shadow-xs">Penerapan Soft Transparansi Aktif</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center">
                      Unggah Berkas Baru
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result as string, 800, 600, 0.7);
                              setSettingsForm(prev => ({ ...prev, backgroundImageUrl: compressed }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>
                    {settingsForm.backgroundImageUrl && (
                      <button 
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, backgroundImageUrl: '' }))} 
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-705 rounded-lg text-xs font-bold transition-colors"
                      >
                        Bersihkan Background
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Homepage settings */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">4. Hero Banner Utama Beranda</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Judul Banner Utama:</label>
                    <input 
                      type="text"
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. Wujudkan Impian Masa Depan Anda"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Sub-judul Penjelas Banner (Paragraf):</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-255 rounded-lg resize-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Teks Tombol CTA Utama:</label>
                    <input 
                      type="text"
                      value={settingsForm.heroCtaPrimary}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, heroCtaPrimary: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Teks Tombol CTA Kedua:</label>
                    <input 
                      type="text"
                      value={settingsForm.heroCtaSecondary}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, heroCtaSecondary: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Home Stats Count */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">5. Angka Statistik Keunggulan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stat 1 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-left space-y-2">
                    <label className="text-[10px] font-extrabold uppercase text-gray-400">Statistik Kiri</label>
                    <input 
                      type="text"
                      value={settingsForm.stat1Value}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat1Value: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-mono"
                      placeholder="94.8%"
                    />
                    <input 
                      type="text"
                      value={settingsForm.stat1Label}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat1Label: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md"
                      placeholder="Lulus Seleksi"
                    />
                  </div>
                  {/* Stat 2 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-left space-y-2">
                    <label className="text-[10px] font-extrabold uppercase text-gray-400">Statistik Tengah</label>
                    <input 
                      type="text"
                      value={settingsForm.stat2Value}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat2Value: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-mono"
                      placeholder="1,500+"
                    />
                    <input 
                      type="text"
                      value={settingsForm.stat2Label}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat2Label: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md"
                      placeholder="Alumni Taruna"
                    />
                  </div>
                  {/* Stat 3 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-left space-y-2">
                    <label className="text-[10px] font-extrabold uppercase text-gray-400">Statistik Kanan</label>
                    <input 
                      type="text"
                      value={settingsForm.stat3Value}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat3Value: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-mono"
                      placeholder="Psikolog"
                    />
                    <input 
                      type="text"
                      value={settingsForm.stat3Label}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, stat3Label: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md"
                      placeholder="HIMPSI Resmi"
                    />
                  </div>
                </div>
              </div>

              {/* Pillars (Tiga Pilar) Titles and description */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">6. Judul & Keterangan 3 Pilar Layanan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pilar 1 */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-left space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700">Pilar 1 (Kiri)</span>
                    <input 
                      type="text"
                      value={settingsForm.feature1Title}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature1Title: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-bold text-emerald-950"
                      placeholder="Persiapan Seleksi"
                    />
                    <textarea 
                      rows={3}
                      value={settingsForm.feature1Desc}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature1Desc: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md resize-none"
                      placeholder="Keterangan pilar 1..."
                    />
                  </div>
                  {/* Pilar 2 */}
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 text-left space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-sky-700">Pilar 2 (Tengah)</span>
                    <input 
                      type="text"
                      value={settingsForm.feature2Title}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature2Title: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-bold text-sky-950"
                      placeholder="Asesmen Psikologi"
                    />
                    <textarea 
                      rows={3}
                      value={settingsForm.feature2Desc}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature2Desc: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md resize-none"
                      placeholder="Keterangan pilar 2..."
                    />
                  </div>
                  {/* Pilar 3 */}
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-rose-700">Pilar 3 (Kanan)</span>
                    <input 
                      type="text"
                      value={settingsForm.feature3Title}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature3Title: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md font-bold text-rose-950"
                      placeholder="Layanan Konseling"
                    />
                    <textarea 
                      rows={3}
                      value={settingsForm.feature3Desc}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, feature3Desc: e.target.value }))}
                      className="w-full p-2 text-xs border bg-white rounded-md resize-none"
                      placeholder="Keterangan pilar 3..."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">7. Alamat, Kontak, & Operasional</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Alamat Fisik Kantor (Terintegrasi ke Google Maps):</label>
                    <input 
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg animate-pulse-slow"
                      placeholder="e.g. Jl. Kawis, Madiun"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">No. WhatsApp Hubungi Kami:</label>
                    <input 
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. 08113000888"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Email Korespondensi:</label>
                    <input 
                      type="text"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-250 rounded-lg"
                      placeholder="e.g. aztabestchoice@gmail.com"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Jam Operasional Pelayanan:</label>
                    <input 
                      type="text"
                      value={settingsForm.operationalHours}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, operationalHours: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-255 rounded-lg"
                      placeholder="e.g. Senin - Sabtu: 08.00 - 17.00 WIB"
                    />
                  </div>
                </div>
              </div>

              {/* Program Settings */}
              <div className="space-y-4 pt-6 border-t" id="settings-programs-block">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">8. Kelola Program Bimbingan (Kategori Pendaftaran)</h4>
                <p className="text-[11px] text-gray-500">
                  Tambah, ubah, atau hapus program pendidikan/latihan yang terintegrasi langsung dengan menu pendaftaran online siswa baru.
                </p>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border" id="programs-inner-editor">
                  {/* Read List of Programs */}
                  <div className="space-y-2">
                    {(settingsForm.programs || []).map((prog, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                        {editingProgramIndex === index ? (
                          <div className="flex-grow flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingProgramText}
                              onChange={(e) => setEditingProgramText(e.target.value)}
                              className="flex-grow p-1.5 text-xs border rounded-lg focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditProgram(index)}
                              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProgramIndex(null)}
                              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-800">{prog}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditProgram(index, prog)}
                                className="px-2 py-1 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors text-[10px] font-semibold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProgram(index)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {(settingsForm.programs || []).length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4 animate-pulse-slow">Belum ada program bimbingan kustom. Tambahkan di bawah ini.</p>
                    )}
                  </div>

                  {/* Add Program Row */}
                  <div className="flex items-center space-x-2 pt-3 border-t">
                    <input
                      type="text"
                      placeholder="e.g. Persiapan Akademi Militer (AKMIL) & Bintara"
                      value={newProgramName}
                      onChange={(e) => setNewProgramName(e.target.value)}
                      className="flex-grow p-2.5 text-xs border bg-white rounded-xl focus:border-emerald-850"
                    />
                    <button
                      type="button"
                      onClick={handleAddProgram}
                      className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1 uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Settings */}
              <div className="space-y-4 pt-6 border-t" id="settings-services-block">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">9. Kelola Layanan & Alat Tes</h4>
                <p className="text-[11px] text-gray-500">
                  Tambah, ubah, atau hapus Layanan Asesmen Psikologi & alat tes khusus (seperti TEST IQ, TEST BAKAT, & TES MINAT) yang akan ditampilkan secara otomatis pada halaman katalog layanan situs.
                </p>

                <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-150 text-left">
                  <input
                    type="checkbox"
                    id="toggle_show_services_on_home"
                    checked={!!settingsForm.showServicesOnHome}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, showServicesOnHome: e.target.checked }))}
                    className="w-4 h-4 text-emerald-800 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="toggle_show_services_on_home" className="text-xs font-semibold text-emerald-950 cursor-pointer select-none">
                    Tampilkan "Layanan Tambahan & Alat Tes Khusus (Aktif)" di Beranda (di bawah Tiga Pilar)
                  </label>
                </div>

                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border" id="services-inner-editor">
                  {/* Read List of Services */}
                  <div className="space-y-3">
                    {(settingsForm.services || []).map((srv, index) => (
                      <div key={srv.id || index} className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs space-y-2">
                        {editingServiceIndex === index ? (
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Layanan / Kategori:</label>
                              <input
                                type="text"
                                value={editingServiceTitle}
                                onChange={(e) => setEditingServiceTitle(e.target.value)}
                                className="w-full p-2 text-xs border rounded-lg focus:border-emerald-800"
                                placeholder="e.g. TEST IQ"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Alat / Instrumen Tes (Pisahkan dengan tanda koma):</label>
                              <textarea
                                value={editingServiceInstruments}
                                onChange={(e) => setEditingServiceInstruments(e.target.value)}
                                className="w-full p-2 text-xs border rounded-lg focus:border-emerald-800 h-16"
                                placeholder="e.g. CFIT Skala 3, WISC, IST"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleSaveEditService(index)}
                                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingServiceIndex(null)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="space-y-1.5 text-left">
                              <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase block">
                                #{index + 1}. {srv.title}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {srv.instruments.map((inst, iIdx) => (
                                  <span key={iIdx} className="px-2 py-0.5 bg-emerald-50 text-emerald-850 border border-emerald-150 rounded-md text-[10px] font-medium font-sans">
                                    • {inst}
                                  </span>
                                ))}
                                {srv.instruments.length === 0 && (
                                  <span className="text-[10px] text-gray-400 italic">Tidak ada rincian alat tes</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditService(index, srv)}
                                className="px-2 py-1 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-all text-[10px] font-semibold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(index)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {(settingsForm.services || []).length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">Belum ada kategori layanan kustom. Tambahkan di bawah.</p>
                    )}
                  </div>

                  {/* Add Service Row */}
                  <div className="bg-white p-3.5 rounded-xl border border-dashed border-gray-300 space-y-2.5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Tambah Layanan Baru</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-gray-400">NAMA LAYANAN:</label>
                        <input
                          type="text"
                          placeholder="e.g. TEST IQ"
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          className="w-full p-2 text-xs border bg-slate-50/50 rounded-lg focus:border-emerald-850"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-extrabold text-gray-400">ALAT TES (PISAHKAN DENGAN TANDA KOMA):</label>
                        <input
                          type="text"
                          placeholder="e.g. CFIT Skala 3, IST, PM"
                          value={newServiceInstruments}
                          onChange={(e) => setNewServiceInstruments(e.target.value)}
                          className="w-full p-2 text-xs border bg-slate-50/50 rounded-lg focus:border-emerald-850"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1 uppercase cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Layanan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits & Goals Settings */}
              <div className="space-y-4 pt-6 border-t" id="settings-benefits-block">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">10. Kelola Manfaat & Tujuan Asesmen</h4>
                <p className="text-[11px] text-gray-500">
                  Ubah atau tambahkan poin-poin manfaat penting yang relevan untuk memberikan gambaran pemetaan potensi siswa di halaman utama maupun halaman informasi.
                </p>

                <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-150 text-left">
                  <input
                    type="checkbox"
                    id="toggle_show_benefits_on_home"
                    checked={!!settingsForm.showBenefitsOnHome}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, showBenefitsOnHome: e.target.checked }))}
                    className="w-4 h-4 text-emerald-800 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="toggle_show_benefits_on_home" className="text-xs font-semibold text-emerald-950 cursor-pointer select-none">
                    Tampilkan "Manfaat & Tujuan Program Asesmen" di Beranda (di bawah Tiga Pilar)
                  </label>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border" id="benefits-inner-editor">
                  {/* Read List of Benefits */}
                  <div className="space-y-2">
                    {(settingsForm.benefits || []).map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                        {editingBenefitIndex === index ? (
                          <div className="flex-grow flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingBenefitText}
                              onChange={(e) => setEditingBenefitText(e.target.value)}
                              className="flex-grow p-1.5 text-xs border rounded-lg focus:border-emerald-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditBenefit(index)}
                              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingBenefitIndex(null)}
                              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs text-slate-700 text-left leading-relaxed flex-grow pr-4">• {benefit}</span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditBenefit(index, benefit)}
                                className="px-2 py-1 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors text-[10px] font-semibold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBenefit(index)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {(settingsForm.benefits || []).length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">Belum ada poin manfaat kustom. Tambahkan di bawah ini.</p>
                    )}
                  </div>

                  {/* Add Benefit Row */}
                  <div className="flex items-center space-x-2 pt-3 border-t">
                    <input
                      type="text"
                      placeholder="e.g. Memberikan Gambaran / informasi mengenai potensi siswa..."
                      value={newBenefitText}
                      onChange={(e) => setNewBenefitText(e.target.value)}
                      className="flex-grow p-2.5 text-xs border bg-white rounded-xl focus:border-emerald-850"
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1 uppercase cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Save button footer bar */}
              <div className="border-t pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md shadow-emerald-950/10"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Perubahan</span>
                </button>
              </div>

            </div>
          )}

          {/* KELOLA SISWA PORTAL TAB */}
          {activeTab === 'students' && (
            <div className="space-y-6" id="students-tab-panel">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-150">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900">Database & Registrasi Siswa</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kelola data resmi siswa baru, terbitkan nomor identitas otomatis (AST), edit informasi, dan hapus berkas pendaftaran.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { resetStudentForm(); setShowAddStudentModal(true); }}
                  className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Siswa Baru</span>
                </button>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-3xl border border-gray-150">
                <div className="text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cari Nama / No Siswa:</label>
                  <input
                    type="text"
                    placeholder="e.g. Dimas Anggara..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-slate-800"
                  />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Filter Program:</label>
                  <select
                    value={studentProgramFilter}
                    onChange={(e) => setStudentProgramFilter(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-slate-800"
                  >
                    <option value="All">Semua Program</option>
                    {(siteSettings.programs || []).map((prog, idx) => (
                      <option key={idx} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end justify-between">
                  <div className="w-full">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Terdata:</label>
                    <div className="p-2.5 text-xs font-black text-emerald-900 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                      {students.length} Siswa Terdaftar
                    </div>
                  </div>
                </div>
              </div>

              {/* ADD STUDENT MODAL / FORM IN-LINE ON TOP */}
              {(showAddStudentModal || editingStudentId) && (
                <div className="bg-slate-900/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                  <div className="bg-white border text-left rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-5">
                    <button
                      type="button"
                      onClick={() => { setShowAddStudentModal(false); setEditingStudentId(null); }}
                      className="absolute right-4 top-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700 cursor-pointer text-xs font-bold"
                    >
                      ✕
                    </button>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {editingStudentId ? 'Edit Berkas Siswa Resmi' : 'Registrasi & Rekap Siswa Baru'}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {editingStudentId ? 'Ubah informasi berkas dan komitmen program siswa terpilih.' : 'Masukan data siswa baru untuk diterbitkan nomor anggota AST otomatis oleh sistem.'}
                      </p>
                    </div>

                    <form onSubmit={editingStudentId ? handleEditStudentSubmit : handleAddStudentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Nama Lengkap Siswa:</label>
                        <input
                          type="text"
                          required
                          value={studFullName}
                          onChange={(e) => setStudFullName(e.target.value)}
                          placeholder="e.g. Dimas Anggara"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                      </div>

                      {/* Email, Phone and Password for Login */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">Email (Akun Login Portal):</label>
                        <input
                          type="email"
                          required
                          value={studEmail}
                          onChange={(e) => setStudEmail(e.target.value)}
                          placeholder="e.g. dimas@gmail.com"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">No WhatsApp / HP:</label>
                        <input
                          type="tel"
                          required
                          value={studPhone}
                          onChange={(e) => setStudPhone(e.target.value)}
                          placeholder="e.g. 081234567890"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Password (Bebas/Minimal 6 digit):</label>
                        <input
                          type="text"
                          required
                          value={studPassword}
                          onChange={(e) => setStudPassword(e.target.value)}
                          placeholder="e.g. madiun2026"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800 font-mono"
                        />
                      </div>

                      {/* Photo Url input */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Tautan Foto Portrait Siswa (URL):</label>
                        <input
                          type="text"
                          value={studPhotoUrl}
                          onChange={(e) => setStudPhotoUrl(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/photo-X"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                        <p className="text-[10px] text-gray-400">Tinggalkan kosong untuk menggunakan gambar penampung Unsplash default.</p>
                      </div>

                      {/* Birth Place */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">Tempat Lahir Siswa:</label>
                        <input
                          type="text"
                          required
                          value={studBirthPlace}
                          onChange={(e) => setStudBirthPlace(e.target.value)}
                          placeholder="e.g. Madiun"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                      </div>

                      {/* Birth Date */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">Tanggal Lahir:</label>
                        <input
                          type="date"
                          required
                          value={studBirthDate}
                          onChange={(e) => setStudBirthDate(e.target.value)}
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-emerald-800"
                        />
                      </div>

                      {/* Gender Selector dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">Jenis Kelamin:</label>
                        <select
                          value={studGender}
                          onChange={(e) => setStudGender(e.target.value as any)}
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:border-emerald-800"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      {/* Last Education Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">Pendidikan Terakhir:</label>
                        <select
                          value={studLastEducation}
                          onChange={(e) => setStudLastEducation(e.target.value)}
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:border-emerald-800"
                        >
                          <option value="SMP / Sederajat">SMP / Sederajat</option>
                          <option value="SMA / Sederajat">SMA / Sederajat</option>
                          <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                          <option value="Sarjana (S1)">Sarjana (S1)</option>
                          <option value="Pascasarjana (S2/S3)">Pascasarjana (S2/S3)</option>
                        </select>
                      </div>

                      {/* Address area */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Alamat Rumah Lengkap:</label>
                        <textarea
                          required
                          rows={2}
                          value={studAddress}
                          onChange={(e) => setStudAddress(e.target.value)}
                          placeholder="e.g. Jl. Kawis No. 20 Madiun"
                          className="w-full p-2.5 text-xs border border-gray-200 rounded-xl resize-none focus:border-emerald-800"
                        />
                      </div>

                      {/* Program Selection dropdown */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Program Bimbingan yang Diikuti:</label>
                        <select
                          value={studProgramJoined}
                          onChange={(e) => setStudProgramJoined(e.target.value)}
                          className="w-full p-2.5 text-xs border border-emerald-200 bg-emerald-50/50 rounded-xl font-bold text-emerald-950 focus:border-emerald-800"
                        >
                          {(siteSettings.programs && siteSettings.programs.length > 0 ? siteSettings.programs : [
                            'Pelatihan Psikotes TNI-POLRI',
                            'Persiapan Instansi Pemerintah/BUMN/Swasta',
                            'Persiapan Perguruan Tinggi'
                          ]).map((prog, idx) => (
                            <option key={idx} value={prog}>{prog}</option>
                          ))}
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="sm:col-span-2 border-t pt-4 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => { setShowAddStudentModal(false); setEditingStudentId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Tutup
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          {editingStudentId ? 'Simpan Edit' : 'Simpan Siswa'}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

              {/* STUDENTS DIRECTORY GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="students-grid">
                {students
                  .filter(s => {
                    const matchSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                        s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase());
                    const matchProg = studentProgramFilter === 'All' || s.programJoined === studentProgramFilter;
                    return matchSearch && matchProg;
                  })
                  .map((student) => (
                    <div key={student.id} className="bg-white border hover:border-emerald-800 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all" id={`student-card-${student.id}`}>
                      <div className="flex gap-4">
                        {/* Avatar photo column */}
                        <div className="w-20 h-28 bg-slate-50 border rounded-xl overflow-hidden shrink-0 shadow-xs">
                          <img src={student.photoUrl} alt="Siswa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-1.5 flex-grow text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                              {student.studentNumber}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">Daftar: {student.registrationDate}</span>
                          </div>
                          
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                              {student.fullName}
                            </h4>
                            <p className="text-[10px] font-semibold text-emerald-850 mt-0.5">
                              {student.programJoined}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 border-t border-gray-100 text-[10px] text-gray-500">
                            <div>
                              <strong className="text-gray-400 block text-[8px] uppercase">Gender / Pendidikan</strong>
                              {student.gender} • {student.lastEducation}
                            </div>
                            <div>
                              <strong className="text-gray-400 block text-[8px] uppercase">Tempat Lahir / TTL</strong>
                              {student.birthPlace} ({student.birthDate ? student.birthDate.split('-').reverse().join('-') : '-'})
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 text-[10px] space-y-1">
                            <div className="flex justify-between text-slate-600">
                              <span className="text-gray-400 text-[8px] uppercase font-bold">Email Login:</span>
                              <span className="font-mono font-medium text-[9.5px]">{student.email || '-'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span className="text-gray-400 text-[8px] uppercase font-bold">No WhatsApp/HP:</span>
                              <span className="font-mono font-medium text-[9.5px]">{student.phone || '-'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span className="text-gray-400 text-[8px] uppercase font-bold">Password Login:</span>
                              <span className="bg-emerald-50 text-emerald-900 border border-emerald-100 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold">{student.password || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Lower Address and actions row */}
                      <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-[10px] text-gray-500">
                        <p className="text-left line-clamp-1 max-w-[200px] text-[10px]" title={student.address}>
                          📍 {student.address}
                        </p>
                        
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditStudent(student)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(student.id, student.fullName)}
                            className="p-1 px-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {students.filter(s => {
                  const matchSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                      s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase());
                  const matchProg = studentProgramFilter === 'All' || s.programJoined === studentProgramFilter;
                  return matchSearch && matchProg;
                }).length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 space-y-2">
                    <p className="text-sm font-bold text-slate-800">Tidak ada Siswa / Berkas Ditemukan</p>
                    <p className="text-xs text-gray-400 leading-relaxed">Silakan sesuaikan filter pencarian atau tambahkan siswa baru di atas.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: MANAJEMEN ALUMNI */}
          {activeTab === 'alumni' && (
            <div className="space-y-6 animate-fade-in" id="alumni-tab-panel">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-150">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900">Kelola Alumni / Lulusan Siswa</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kelola dokumentasi pilar alumni taruna berprestasi, tambahkan foto, tahun kelulusan, dan prestasi kedinasan terkait.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetAlumniToDefault}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs border border-gray-200"
                    title="Kembalikan / Sinkronkan data alumni ke pengaturan bawaan sistem terbaru (Enggar Satria, Muhammad Fauzan, dll.)"
                  >
                    Sinkronisasi Default
                  </button>
                  <button
                    type="button"
                    onClick={handleStartAddAlumni}
                    className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Alumni Baru</span>
                  </button>
                </div>
              </div>

              {/* ALUMNI INPUT DIALOG/SECTION (Dinamis jika showAlumniModal === true) */}
              {showAlumniModal && (
                <div className="bg-emerald-50/50 border border-emerald-200 p-6 rounded-3xl animate-fade-in text-left" id="alumni-form-box">
                  <div className="max-w-2xl text-left space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-950 uppercase">{editingAlumni ? 'Ubah Profil Alumni' : 'Tambah Profil Alumni Baru'}</h4>
                      <p className="text-[11px] text-gray-500">Silakan masukkan nama lengkap beserta tahun angkatan lulus dan prestasi rekrutmen TNI/POLRI/BUMN yang dicapai.</p>
                    </div>

                    <form onSubmit={handleSaveAlumni} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-805">Nama Lengkap Alumni:</label>
                        <input
                          type="text"
                          required
                          value={alumniFullName}
                          onChange={(e) => setAlumniFullName(e.target.value)}
                          placeholder="e.g. Wahyu Wijaya"
                          className="w-full bg-white p-2.5 text-xs text-slate-800 border border-gray-250 rounded-xl focus:border-emerald-805"
                        />
                      </div>

                      {/* Graduation Year & Achievement */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-805">Tahun Kelulusan:</label>
                        <input
                          type="text"
                          required
                          value={alumniGradYear}
                          onChange={(e) => setAlumniGradYear(e.target.value)}
                          placeholder="e.g. 2025"
                          className="w-full bg-white p-2.5 text-xs text-slate-800 border border-gray-255 rounded-xl focus:border-emerald-805 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-805">Prestasi / Penerimaan Dinas:</label>
                        <input
                          type="text"
                          required
                          value={alumniAchievement}
                          onChange={(e) => setAlumniAchievement(e.target.value)}
                          placeholder="e.g. Lolos Bintara POLRI"
                          className="w-full bg-white p-2.5 text-xs text-slate-800 border border-gray-255 rounded-xl focus:border-emerald-805"
                        />
                      </div>

                      {/* Photo Url */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-850">Tautan Gambar Portrait Alumni (URL atau Unggah File):</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={alumniPhotoUrl}
                            onChange={(e) => setAlumniPhotoUrl(e.target.value)}
                            placeholder="e.g. https://images.unsplash.com/photo-..."
                            className="w-full bg-white p-2.5 text-xs text-slate-800 border border-gray-255 rounded-xl focus:border-emerald-805 font-mono"
                          />
                          <div className="flex items-center space-x-2">
                            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-905 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer">
                              Unggah Berkas Foto Alumni
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      const compressed = await compressImage(reader.result as string, 200, 260, 0.7);
                                      setAlumniPhotoUrl(compressed);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }} 
                                className="hidden" 
                              />
                            </label>
                            {alumniPhotoUrl && (
                              <span className="text-[10px] text-emerald-850 font-bold bg-emerald-100 px-2 py-1 rounded inline-block">Foto Berhasil Disinkronkan!</span>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-450">Tips: Gunakan berkas foto portrait agar penampilan luar biasa modern.</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="sm:col-span-2 border-t pt-4 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAlumniModal(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Tutup
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          {editingAlumni ? 'Simpan Edit Alumni' : 'Simpan Alumni Baru'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ALUMNI CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6" id="alumni-management-grid">
                {alumni.map((al) => (
                  <div key={al.id} className="bg-white border rounded-3xl p-4 flex flex-col justify-between hover:border-emerald-800 shadow-xs hover:shadow-sm transition-all" id={`admin-alumni-card-${al.id}`}>
                    <div className="space-y-3">
                      {/* Photo Container */}
                      <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 border relative group shadow-inner">
                        <img 
                          referrerPolicy="no-referrer"
                          src={al.photoUrl} 
                          alt={al.fullName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono animate-fade-in">
                          Angkatan {al.graduationYear}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-left space-y-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                          {al.fullName}
                        </h4>
                        <p className="text-[10px] font-semibold text-emerald-850 leading-relaxed">
                          {al.achievement}
                        </p>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEditAlumni(al)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAlumni(al.id, al.fullName)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus Alumni"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {alumni.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm font-bold text-slate-800">Belum Ada Dokumentasi Alumni</p>
                    <p className="text-xs text-gray-400 mt-1">Silakan daftarkan alumni berprestasi baru di atas untuk ditampilkan secara dinamis di header website.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: SISTEM NOTIFIKASI OTOMATIS */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in" id="notifications-tab-panel">
              <AdminNotifications 
                students={students} 
                registrations={registrations} 
                sessions={sessions} 
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
