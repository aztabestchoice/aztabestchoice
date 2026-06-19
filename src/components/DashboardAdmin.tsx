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
  Bell,
  RefreshCw,
  Download,
  Upload,
  Copy
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
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncWorkspaceData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/workspace-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteSettings, students, alumni })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessAlert('✅ Sinkronisasi Berhasil! Seluruh data kustomisasi, alumni, dan siswa Anda telah dipanggang secara permanen ke file project (persistentData.json). Silakan publish ulang ke GitHub/Vercel dan saksikan di perangkat lain!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccessAlert(''), 10000);
      } else {
        alert('Gagal menyinkronkan data.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghubungi dev server sync. Jika Anda sudah deploy di Vercel secara statis, fitur sinkronisasi ini hanya dapat digunakan sementara di mode Dev lokal Anda.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Export/Import states
  const [copySuccess, setCopySuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const handleCopyBackupJSON = () => {
    const compactData = {
      siteSettings: siteSettings,
      students: students,
      alumni: alumni
    };
    navigator.clipboard.writeText(JSON.stringify(compactData, null, 2))
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 4000);
      })
      .catch(err => {
        console.error('Gagal menyalin teks:', err);
        alert('Gagal menyalin otomatis. Silakan salin teks dari kotak secara manual!');
      });
  };

  const handleDownloadBackupFile = () => {
    const compactData = {
      siteSettings: siteSettings,
      students: students,
      alumni: alumni
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(compactData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `azta_backup_data_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSuccess('');
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (!parsed) throw new Error("File kosong atau tidak valid.");
          
          let count = 0;
          if (parsed.siteSettings) {
            onUpdateSettings(parsed.siteSettings);
            count++;
          }
          if (parsed.students && Array.isArray(parsed.students)) {
            onUpdateStudents(parsed.students);
            count++;
          }
          if (parsed.alumni && Array.isArray(parsed.alumni)) {
            onUpdateAlumni(parsed.alumni);
            count++;
          }

          if (count > 0) {
            setImportSuccess(`🎉 Berhasil mengimpor data! ${parsed.alumni?.length || 0} Alumni dan ${parsed.students?.length || 0} Siswa kini aktif di perangkat ini.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setImportSuccess(''), 6050);
          } else {
            setImportError("Format berkas tidak sesuai. Harus mengandung kunci 'siteSettings', 'students', atau 'alumni'.");
          }
        } catch (err: any) {
          console.error(err);
          setImportError("Gagal membaca berkas JSON: " + err.message);
        }
      };
    }
  };
  
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

  // Partners (Mitra) management within Settings
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('');
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [editingPartnerName, setEditingPartnerName] = useState('');
  const [editingPartnerType, setEditingPartnerType] = useState('');

  // Profil Akurasi States & Management
  const [newProfilAkurasiItemTitle, setNewProfilAkurasiItemTitle] = useState('');
  const [newProfilAkurasiItemStatus, setNewProfilAkurasiItemStatus] = useState('');
  const [editingProfilAkurasiItemId, setEditingProfilAkurasiItemId] = useState<string | null>(null);
  const [editingProfilAkurasiItemTitle, setEditingProfilAkurasiItemTitle] = useState('');
  const [editingProfilAkurasiItemStatus, setEditingProfilAkurasiItemStatus] = useState('');

  const handleAddProfilAkurasiItem = () => {
    if (!newProfilAkurasiItemTitle.trim()) return;
    const currentItems = settingsForm.profilAkurasiItems || [
      { id: 'pa-1', title: 'Lab Komputer Simulasi CAT', status: 'Tersedia' },
      { id: 'pa-2', title: 'Ruang Counseling Kedap Nyaman', status: 'Tersedia' },
      { id: 'pa-3', title: 'Rapor Psikogram Kepribadian', status: 'Eksklusif' }
    ];
    setSettingsForm(prev => ({
      ...prev,
      profilAkurasiItems: [
        ...currentItems,
        {
          id: 'pa-' + Date.now(),
          title: newProfilAkurasiItemTitle.trim(),
          status: newProfilAkurasiItemStatus.trim() || 'Tersedia'
        }
      ]
    }));
    setNewProfilAkurasiItemTitle('');
    setNewProfilAkurasiItemStatus('');
  };

  const handleDeleteProfilAkurasiItem = (id: string) => {
    const currentItems = settingsForm.profilAkurasiItems || [];
    setSettingsForm(prev => ({
      ...prev,
      profilAkurasiItems: currentItems.filter(item => item.id !== id)
    }));
  };

  const handleStartEditProfilAkurasiItem = (id: string, title: string, status: string) => {
    setEditingProfilAkurasiItemId(id);
    setEditingProfilAkurasiItemTitle(title);
    setEditingProfilAkurasiItemStatus(status);
  };

  const handleSaveProfilAkurasiItem = (id: string) => {
    if (!editingProfilAkurasiItemTitle.trim()) return;
    const currentItems = [...(settingsForm.profilAkurasiItems || [])];
    const updated = currentItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: editingProfilAkurasiItemTitle.trim(),
          status: editingProfilAkurasiItemStatus.trim() || 'Tersedia'
        };
      }
      return item;
    });
    setSettingsForm(prev => ({
      ...prev,
      profilAkurasiItems: updated
    }));
    setEditingProfilAkurasiItemId(null);
  };

  // State Variables for Interactive Registration Programs
  const [newIntProgTag, setNewIntProgTag] = useState('');
  const [newIntProgTitle, setNewIntProgTitle] = useState('');
  const [newIntProgDesc, setNewIntProgDesc] = useState('');
  const [newIntProgPrice, setNewIntProgPrice] = useState<number>(0);
  const [newIntProgCategory, setNewIntProgCategory] = useState('seleksi');

  const [editingIntProgId, setEditingIntProgId] = useState<string | null>(null);
  const [editingIntProgTag, setEditingIntProgTag] = useState('');
  const [editingIntProgTitle, setEditingIntProgTitle] = useState('');
  const [editingIntProgDesc, setEditingIntProgDesc] = useState('');
  const [editingIntProgPrice, setEditingIntProgPrice] = useState<number>(0);
  const [editingIntProgCategory, setEditingIntProgCategory] = useState('seleksi');

  // State Variables for Interactive Psychologists
  const [newPsyName, setNewPsyName] = useState('');
  const [newPsySpecialization, setNewPsySpecialization] = useState('');
  const [newPsySip, setNewPsySip] = useState('');
  const [newPsyBio, setNewPsyBio] = useState('');
  const [newPsyAvatar, setNewPsyAvatar] = useState('');

  const [editingPsyId, setEditingPsyId] = useState<string | null>(null);
  const [editingPsyName, setEditingPsyName] = useState('');
  const [editingPsySpecialization, setEditingPsySpecialization] = useState('');
  const [editingPsySip, setEditingPsySip] = useState('');
  const [editingPsyBio, setEditingPsyBio] = useState('');
  const [editingPsyAvatar, setEditingPsyAvatar] = useState('');

  // Handlers for Interactive registration programs
  const handleAddIntProg = () => {
    if (!newIntProgTitle.trim()) return;
    const currentProgs = settingsForm.interactivePrograms || [
      {
        id: 'cat_tni_polri',
        category: 'seleksi',
        tag: 'PERSIPAN SELEKSI',
        title: 'Bimbel Psikotes Terpadu TNI-POLRI / IPDN',
        desc: 'Sistem Akurasi Presisi, Try out CAT terkomputerisasi, rekap grafik kepribadian.',
        price: 4500000
      },
      {
        id: 'cat_bumn_pns',
        category: 'seleksi',
        tag: 'PERSIPAN SELEKSI',
        title: 'Persiapan Instansi Pemerintah/BUMN/Swasta',
        desc: 'Pelatihan presentasi, STAR wawancara kerja, LGD, SKB CAT.',
        price: 2500000
      },
      {
        id: 'test_iq',
        category: 'asesmen',
        tag: 'ASESMEN PSIKOLOGI',
        title: 'Tes IQ / Inteligensi Umum (Sertifikat Resmi)',
        desc: 'IST / WAIS terstandar HIMPSI, laporan psikogram detail.',
        price: 350000
      },
      {
        id: 'counseling_mental',
        category: 'konseling',
        tag: 'LAYANAN KONSELING',
        title: 'Sesi Konseling Privat 1-on-1 Sesi Psikolog',
        desc: 'Pemulihan burnout stres, pengarahan potensi, coping stres.',
        price: 450000
      }
    ];

    setSettingsForm(prev => ({
      ...prev,
      interactivePrograms: [
        ...currentProgs,
        {
          id: 'ip-' + Date.now(),
          category: newIntProgCategory,
          tag: newIntProgTag.trim() || 'PERSIPAN SELEKSI',
          title: newIntProgTitle.trim(),
          desc: newIntProgDesc.trim() || 'Deskripsi program bimbingan terintegrasi.',
          price: newIntProgPrice || 0
        }
      ]
    }));

    setNewIntProgTag('');
    setNewIntProgTitle('');
    setNewIntProgDesc('');
    setNewIntProgPrice(0);
    setNewIntProgCategory('seleksi');
  };

  const handleDeleteIntProg = (id: string) => {
    const currentProgs = settingsForm.interactivePrograms || [];
    setSettingsForm(prev => ({
      ...prev,
      interactivePrograms: currentProgs.filter(item => item.id !== id)
    }));
  };

  const handleStartEditIntProg = (id: string, tag: string, title: string, desc: string, price: number, category: string) => {
    setEditingIntProgId(id);
    setEditingIntProgTag(tag);
    setEditingIntProgTitle(title);
    setEditingIntProgDesc(desc);
    setEditingIntProgPrice(price);
    setEditingIntProgCategory(category);
  };

  const handleSaveIntProg = (id: string) => {
    if (!editingIntProgTitle.trim()) return;
    const currentProgs = settingsForm.interactivePrograms || [];
    const updated = currentProgs.map(item => {
      if (item.id === id) {
        return {
          ...item,
          tag: editingIntProgTag.trim() || 'PERSIPAN SELEKSI',
          title: editingIntProgTitle.trim(),
          desc: editingIntProgDesc.trim(),
          price: editingIntProgPrice || 0,
          category: editingIntProgCategory
        };
      }
      return item;
    });

    setSettingsForm(prev => ({
      ...prev,
      interactivePrograms: updated
    }));
    setEditingIntProgId(null);
  };

  // Handlers for Interactive Psychologists
  const handleAddPsy = () => {
    if (!newPsyName.trim()) return;
    const currentPsys = settingsForm.interactivePsychologists || [
      {
        id: 'psy-danur',
        name: 'Danur Wijaya, M.Psi., Psikolog',
        specialization: 'Psikologi Klinis Dewasa & Industri',
        sip: '19.24.11-Psikolog-0831',
        bio: 'Berpengalaman selama 12 tahun bidang asesmen TNI-POLRI, seleksi rekrutmen perusahaan swasta/BUMN, serta pendampingan kesehatan mental pasca-trauma.',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
      },
      {
        id: 'psy-retno',
        name: 'Dra. Retno Wulandari, M.Psi., Psikolog',
        specialization: 'Psikologi Perkembangan Anak & Konseling Bakat Minat',
        sip: '19.24.11-Psikolog-1049',
        bio: 'Spesialis dalam pemetaan minat bakat anak dan remaja, konsultasi penjurusan PTN, dan pendampingan akademis/kesiapan belajar.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
      }
    ];

    setSettingsForm(prev => ({
      ...prev,
      interactivePsychologists: [
        ...currentPsys,
        {
          id: 'psy-' + Date.now(),
          name: newPsyName.trim(),
          specialization: newPsySpecialization.trim() || 'Psikolog Partner',
          sip: newPsySip.trim() || 'Berlisensi HIMPSI',
          bio: newPsyBio.trim() || 'Mitra psikolog terbaik untuk bimbingan konseling.',
          avatar: newPsyAvatar.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
        }
      ]
    }));

    setNewPsyName('');
    setNewPsySpecialization('');
    setNewPsySip('');
    setNewPsyBio('');
    setNewPsyAvatar('');
  };

  const handleDeletePsy = (id: string) => {
    const currentPsys = settingsForm.interactivePsychologists || [];
    setSettingsForm(prev => ({
      ...prev,
      interactivePsychologists: currentPsys.filter(item => item.id !== id)
    }));
  };

  const handleStartEditPsy = (id: string, name: string, specialization: string, sip: string, bio: string, avatar: string) => {
    setEditingPsyId(id);
    setEditingPsyName(name);
    setEditingPsySpecialization(specialization);
    setEditingPsySip(sip);
    setEditingPsyBio(bio);
    setEditingPsyAvatar(avatar);
  };

  const handleSavePsy = (id: string) => {
    if (!editingPsyName.trim()) return;
    const currentPsys = settingsForm.interactivePsychologists || [];
    const updated = currentPsys.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: editingPsyName.trim(),
          specialization: editingPsySpecialization.trim(),
          sip: editingPsySip.trim(),
          bio: editingPsyBio.trim(),
          avatar: editingPsyAvatar.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
        };
      }
      return item;
    });

    setSettingsForm(prev => ({
      ...prev,
      interactivePsychologists: updated
    }));
    setEditingPsyId(null);
  };

  // 1. Sekilas Tentang Azta Paragraphs State
  const [newAboutAztaPara, setNewAboutAztaPara] = useState('');
  const [editingAboutAztaParaIdx, setEditingAboutAztaParaIdx] = useState<number | null>(null);
  const [editingAboutAztaParaText, setEditingAboutAztaParaText] = useState('');

  const handleAddAboutAztaPara = () => {
    if (!newAboutAztaPara.trim()) return;
    const currentParas = settingsForm.aboutAztaParas || [
      'Azta Best Choice Counseling & Psychology Madiun hadir sebagai wujud nyata dedikasi layanan profesional yang mengintegrasikan kesiapan mental, kognitif, fisik, dan kejiwaan bagi segenap calon bintara TNI-POLRI, instansi kedinasan, calon pegawai BUMN, serta pendampingan klinis psikologis anak dan dewasa di wilayah Jawa Timur.',
      'Didirikan di Jl. Kawis, Kecamatan Taman, Madiun, lembaga kami memadukan bimbingan akademik tervalidasi menggunakan Computer Assisted Test (CAT) mandiri di laboratorium komputer rahasia kami, latihan jasmani taktis luar ruangan, dan bimbingan konseling profesional tatap muka bersama psikolog utama berlisensi SIPP / HIMPSI.'
    ];
    setSettingsForm(prev => ({
      ...prev,
      aboutAztaParas: [...currentParas, newAboutAztaPara.trim()]
    }));
    setNewAboutAztaPara('');
  };

  const handleDeleteAboutAztaPara = (idx: number) => {
    const currentParas = settingsForm.aboutAztaParas || [];
    setSettingsForm(prev => ({
      ...prev,
      aboutAztaParas: currentParas.filter((_, i) => i !== idx)
    }));
  };

  const handleStartEditAboutAztaPara = (idx: number, text: string) => {
    setEditingAboutAztaParaIdx(idx);
    setEditingAboutAztaParaText(text);
  };

  const handleSaveAboutAztaPara = (idx: number) => {
    if (!editingAboutAztaParaText.trim()) return;
    const currentParas = [...(settingsForm.aboutAztaParas || [])];
    currentParas[idx] = editingAboutAztaParaText.trim();
    setSettingsForm(prev => ({
      ...prev,
      aboutAztaParas: currentParas
    }));
    setEditingAboutAztaParaIdx(null);
  };

  // 2. Keunggulan Lembaga List State
  const [newKeunggulanItemTitle, setNewKeunggulanItemTitle] = useState('');
  const [newKeunggulanItemDesc, setNewKeunggulanItemDesc] = useState('');
  const [editingKeunggulanId, setEditingKeunggulanId] = useState<string | null>(null);
  const [editingKeunggulanTitle, setEditingKeunggulanTitle] = useState('');
  const [editingKeunggulanDesc, setEditingKeunggulanDesc] = useState('');

  const handleAddKeunggulan = () => {
    if (!newKeunggulanItemTitle.trim()) return;
    const currentList = settingsForm.keunggulanList || [
      { id: 'k-1', title: 'Psikolog Berlisensi Resmi SIPP', desc: 'Tes langsung diawasi dan laporan psikogram resmi ditandatangani oleh Psikolog Utama anggota HIMPSI Wilayah Jawa Timur.' },
      { id: 'k-2', title: 'Laboratorium CAT Mandiri & Rahasia', desc: 'Latihan simulasi psikotes terkomputerisasi yang mirip dengan aslinya untuk mengurangi kecemasan ujian.' },
      { id: 'k-3', title: 'Pendekatan Klinis 1-on-1', desc: 'Setiap siswa mendapatkan porsi bimbingan privasi 100% untuk mengatasi stres kognitif dan porsi kegagalan ujian sebelumnya.' }
    ];
    setSettingsForm(prev => ({
      ...prev,
      keunggulanList: [
        ...currentList,
        {
          id: 'k-' + Date.now(),
          title: newKeunggulanItemTitle.trim(),
          desc: newKeunggulanItemDesc.trim()
        }
      ]
    }));
    setNewKeunggulanItemTitle('');
    setNewKeunggulanItemDesc('');
  };

  const handleDeleteKeunggulan = (id: string) => {
    const currentList = settingsForm.keunggulanList || [];
    setSettingsForm(prev => ({
      ...prev,
      keunggulanList: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditKeunggulan = (id: string, t: string, d: string) => {
    setEditingKeunggulanId(id);
    setEditingKeunggulanTitle(t);
    setEditingKeunggulanDesc(d);
  };

  const handleSaveKeunggulan = (id: string) => {
    if (!editingKeunggulanTitle.trim()) return;
    const currentList = (settingsForm.keunggulanList || []).map(item => {
      if (item.id === id) {
        return { ...item, title: editingKeunggulanTitle.trim(), desc: editingKeunggulanDesc.trim() };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, keunggulanList: currentList }));
    setEditingKeunggulanId(null);
  };

  // 3. Portopolio Layanan (Pillars) State
  const [newPillarTitle, setNewPillarTitle] = useState('');
  const [newPillarCategory, setNewPillarCategory] = useState('seleksi');
  const [newPillarDesc, setNewPillarDesc] = useState('');
  const [newPillarBulletsText, setNewPillarBulletsText] = useState('');
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [editingPillarTitle, setEditingPillarTitle] = useState('');
  const [editingPillarCategory, setEditingPillarCategory] = useState('');
  const [editingPillarDesc, setEditingPillarDesc] = useState('');
  const [editingPillarBulletsText, setEditingPillarBulletsText] = useState('');

  const handleAddPillar = () => {
    if (!newPillarTitle.trim()) return;
    const currentList = settingsForm.portfolioPillars || [
      { id: 'pil-1', category: 'seleksi', title: 'Pilar A: Seleksi & Akurasi CAT', desc: 'Bimbingan intensif tumpuan persiapan ujian bintara kepolisian, akademi militer, kedinasan IPDN, STIS, STAN, dan CPNS/BUMN.', bullets: ['Simulasi Software CAT Mandiri', 'Latihan Postur Jasmani & Pembinaan Stamina', 'Ratusan Paket Evaluasi Soal Terkini', 'Mental Ideologi & Pengetahuna Umum'] },
      { id: 'pil-2', category: 'asesmen', title: 'Pilar B: Asesmen Psikometri', desc: 'Pengukuran orisinil kognitif IQ umum, penjurusan bakat minat anak, serta rekrutmen pegawai bersertifikasi resmi.', bullets: ['Tes IQ (CFIT, IST, WAIS)', 'Pemetaan Karir Holland RIASEC', 'Sertifikat Psikogram Resmi', 'Evaluasi Validitas Alat Ukur'] },
      { id: 'pil-3', category: 'konseling', title: 'Pilar C: Konseling & Klinis', desc: 'Pendampingan langsung kesehatan mental, stress coping management, pasca-kegagalan seleksi, serta tumbuh kembang.', bullets: ['Terapi Burnout Belajar', 'Konseling Rahasia Tatap Muka', 'Deteksi Potensi Luka Jiwa', 'Coping Management Ujian'] }
    ];
    const bulletsArr = newPillarBulletsText.split(',').map(b => b.trim()).filter(Boolean);
    setSettingsForm(prev => ({
      ...prev,
      portfolioPillars: [
        ...currentList,
        {
          id: 'pil-' + Date.now(),
          category: newPillarCategory,
          title: newPillarTitle.trim(),
          desc: newPillarDesc.trim(),
          bullets: bulletsArr
        }
      ]
    }));
    setNewPillarTitle('');
    setNewPillarDesc('');
    setNewPillarBulletsText('');
  };

  const handleDeletePillar = (id: string) => {
    const currentList = settingsForm.portfolioPillars || [];
    setSettingsForm(prev => ({
      ...prev,
      portfolioPillars: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditPillar = (id: string, t: string, cat: string, d: string, bulls: string[]) => {
    setEditingPillarId(id);
    setEditingPillarTitle(t);
    setEditingPillarCategory(cat);
    setEditingPillarDesc(d);
    setEditingPillarBulletsText(bulls.join(', '));
  };

  const handleSavePillar = (id: string) => {
    if (!editingPillarTitle.trim()) return;
    const bulletsArr = editingPillarBulletsText.split(',').map(b => b.trim()).filter(Boolean);
    const currentList = (settingsForm.portfolioPillars || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: editingPillarTitle.trim(),
          category: editingPillarCategory,
          desc: editingPillarDesc.trim(),
          bullets: bulletsArr
        };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, portfolioPillars: currentList }));
    setEditingPillarId(null);
  };

  // 4. Layanan Sub-programs State
  const [newSubProgTitle, setNewSubProgTitle] = useState('');
  const [newSubProgDesc, setNewSubProgDesc] = useState('');
  const [newSubProgCategory, setNewSubProgCategory] = useState<'seleksi' | 'asesmen' | 'konseling'>('seleksi');
  const [newSubProgLabel1, setNewSubProgLabel1] = useState('Materi Utama');
  const [newSubProgVal1, setNewSubProgVal1] = useState('');
  const [newSubProgLabel2, setNewSubProgLabel2] = useState('Detail Sesi');
  const [newSubProgVal2, setNewSubProgVal2] = useState('');

  const [editingSubProgId, setEditingSubProgId] = useState<string | null>(null);
  const [editingSubProgTitle, setEditingSubProgTitle] = useState('');
  const [editingSubProgDesc, setEditingSubProgDesc] = useState('');
  const [editingSubProgCategory, setEditingSubProgCategory] = useState<'seleksi' | 'asesmen' | 'konseling'>('seleksi');
  const [editingSubProgLabel1, setEditingSubProgLabel1] = useState('');
  const [editingSubProgVal1, setEditingSubProgVal1] = useState('');
  const [editingSubProgLabel2, setEditingSubProgLabel2] = useState('');
  const [editingSubProgVal2, setEditingSubProgVal2] = useState('');

  const handleAddSubProg = () => {
    if (!newSubProgTitle.trim()) return;
    const currentList = settingsForm.servicesSubPrograms || [];
    setSettingsForm(prev => ({
      ...prev,
      servicesSubPrograms: [
        ...currentList,
        {
          id: 'subp-' + Date.now(),
          title: newSubProgTitle.trim(),
          desc: newSubProgDesc.trim(),
          category: newSubProgCategory,
          materiLabel1: newSubProgLabel1,
          materiVal1: newSubProgVal1.trim(),
          materiLabel2: newSubProgLabel2,
          materiVal2: newSubProgVal2.trim()
        }
      ]
    }));
    setNewSubProgTitle('');
    setNewSubProgDesc('');
    setNewSubProgVal1('');
    setNewSubProgVal2('');
  };

  const handleDeleteSubProg = (id: string) => {
    const currentList = settingsForm.servicesSubPrograms || [];
    setSettingsForm(prev => ({
      ...prev,
      servicesSubPrograms: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditSubProg = (item: any) => {
    setEditingSubProgId(item.id);
    setEditingSubProgTitle(item.title);
    setEditingSubProgDesc(item.desc);
    setEditingSubProgCategory(item.category);
    setEditingSubProgLabel1(item.materiLabel1 || 'Materi Utama');
    setEditingSubProgVal1(item.materiVal1 || '');
    setEditingSubProgLabel2(item.materiLabel2 || 'Detail Sesi');
    setEditingSubProgVal2(item.materiVal2 || '');
  };

  const handleSaveSubProg = (id: string) => {
    if (!editingSubProgTitle.trim()) return;
    const currentList = (settingsForm.servicesSubPrograms || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: editingSubProgTitle.trim(),
          desc: editingSubProgDesc.trim(),
          category: editingSubProgCategory,
          materiLabel1: editingSubProgLabel1,
          materiVal1: editingSubProgVal1.trim(),
          materiLabel2: editingSubProgLabel2,
          materiVal2: editingSubProgVal2.trim()
        };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, servicesSubPrograms: currentList }));
    setEditingSubProgId(null);
  };

  // 5. Tentang Kami (Values) State
  const [newKamiValueTitle, setNewKamiValueTitle] = useState('');
  const [newKamiValueDesc, setNewKamiValueDesc] = useState('');
  const [editingKamiValueId, setEditingKamiValueId] = useState<string | null>(null);
  const [editingKamiValueTitle, setEditingKamiValueTitle] = useState('');
  const [editingKamiValueDesc, setEditingKamiValueDesc] = useState('');

  const handleAddKamiValue = () => {
    if (!newKamiValueTitle.trim()) return;
    const currentList = settingsForm.tentangKamiValues || [];
    setSettingsForm(prev => ({
      ...prev,
      tentangKamiValues: [
        ...currentList,
        {
          id: 'v-' + Date.now(),
          title: newKamiValueTitle.trim(),
          desc: newKamiValueDesc.trim()
        }
      ]
    }));
    setNewKamiValueTitle('');
    setNewKamiValueDesc('');
  };

  const handleDeleteKamiValue = (id: string) => {
    const currentList = settingsForm.tentangKamiValues || [];
    setSettingsForm(prev => ({
      ...prev,
      tentangKamiValues: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditKamiValue = (id: string, t: string, d: string) => {
    setEditingKamiValueId(id);
    setEditingKamiValueTitle(t);
    setEditingKamiValueDesc(d);
  };

  const handleSaveKamiValue = (id: string) => {
    if (!editingKamiValueTitle.trim()) return;
    const currentList = (settingsForm.tentangKamiValues || []).map(item => {
      if (item.id === id) {
        return { ...item, title: editingKamiValueTitle.trim(), desc: editingKamiValueDesc.trim() };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, tentangKamiValues: currentList }));
    setEditingKamiValueId(null);
  };

  // 6. Tentang Kami (Mentors) State
  const [newKamiMentorName, setNewKamiMentorName] = useState('');
  const [newKamiMentorRole, setNewKamiMentorRole] = useState('');
  const [newKamiMentorSpecial, setNewKamiMentorSpecial] = useState('');
  const [newKamiMentorBio, setNewKamiMentorBio] = useState('');
  const [newKamiMentorAvatar, setNewKamiMentorAvatar] = useState('');

  const [editingKamiMentorId, setEditingKamiMentorId] = useState<string | null>(null);
  const [editingKamiMentorName, setEditingKamiMentorName] = useState('');
  const [editingKamiMentorRole, setEditingKamiMentorRole] = useState('');
  const [editingKamiMentorSpecial, setEditingKamiMentorSpecial] = useState('');
  const [editingKamiMentorBio, setEditingKamiMentorBio] = useState('');
  const [editingKamiMentorAvatar, setEditingKamiMentorAvatar] = useState('');

  const handleAddKamiMentor = () => {
    if (!newKamiMentorName.trim()) return;
    const currentList = settingsForm.tentangKamiMentors || [];
    setSettingsForm(prev => ({
      ...prev,
      tentangKamiMentors: [
        ...currentList,
        {
          id: 'm-' + Date.now(),
          name: newKamiMentorName.trim(),
          role: newKamiMentorRole.trim(),
          special: newKamiMentorSpecial.trim(),
          bio: newKamiMentorBio.trim(),
          avatar: newKamiMentorAvatar.trim() || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
        }
      ]
    }));
    setNewKamiMentorName('');
    setNewKamiMentorRole('');
    setNewKamiMentorSpecial('');
    setNewKamiMentorBio('');
    setNewKamiMentorAvatar('');
  };

  const handleDeleteKamiMentor = (id: string) => {
    const currentList = settingsForm.tentangKamiMentors || [];
    setSettingsForm(prev => ({
      ...prev,
      tentangKamiMentors: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditKamiMentor = (m: any) => {
    setEditingKamiMentorId(m.id);
    setEditingKamiMentorName(m.name);
    setEditingKamiMentorRole(m.role);
    setEditingKamiMentorSpecial(m.special);
    setEditingKamiMentorBio(m.bio);
    setEditingKamiMentorAvatar(m.avatar);
  };

  const handleSaveKamiMentor = (id: string) => {
    if (!editingKamiMentorName.trim()) return;
    const currentList = (settingsForm.tentangKamiMentors || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: editingKamiMentorName.trim(),
          role: editingKamiMentorRole.trim(),
          special: editingKamiMentorSpecial.trim(),
          bio: editingKamiMentorBio.trim(),
          avatar: editingKamiMentorAvatar.trim()
        };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, tentangKamiMentors: currentList }));
    setEditingKamiMentorId(null);
  };

  // 7. Artikel (Blog) State
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState<'Tips Psikotes' | 'Kesehatan Mental' | 'Informasi Seleksi'>('Tips Psikotes');
  const [newBlogAuthor, setNewBlogAuthor] = useState('Admin Azta');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogTagsText, setNewBlogTagsText] = useState('');

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingBlogTitle, setEditingBlogTitle] = useState('');
  const [editingBlogExcerpt, setEditingBlogExcerpt] = useState('');
  const [editingBlogContent, setEditingBlogContent] = useState('');
  const [editingBlogCategory, setEditingBlogCategory] = useState<'Tips Psikotes' | 'Kesehatan Mental' | 'Informasi Seleksi'>('Tips Psikotes');
  const [editingBlogAuthor, setEditingBlogAuthor] = useState('');
  const [editingBlogImage, setEditingBlogImage] = useState('');
  const [editingBlogTagsText, setEditingBlogTagsText] = useState('');

  const handleAddBlog = () => {
    if (!newBlogTitle.trim()) return;
    const currentList = settingsForm.blogs || [];
    const colorMap = {
      'Tips Psikotes': 'bg-emerald-100 text-emerald-800 border-emerald-250',
      'Kesehatan Mental': 'bg-rose-100 text-rose-800 border-rose-250',
      'Informasi Seleksi': 'bg-amber-100 text-amber-800 border-amber-250'
    };
    const tagArr = newBlogTagsText.split(',').map(t => t.trim()).filter(Boolean);
    setSettingsForm(prev => ({
      ...prev,
      blogs: [
        ...currentList,
        {
          id: 'b-' + Date.now(),
          title: newBlogTitle.trim(),
          excerpt: newBlogExcerpt.trim(),
          content: newBlogContent.trim(),
          category: newBlogCategory,
          categoryColor: colorMap[newBlogCategory] || 'bg-slate-100 text-slate-800',
          author: newBlogAuthor.trim() || 'Admin Azta',
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          readTime: `${Math.max(2, Math.ceil(newBlogContent.length / 500))} Menit Baca`,
          image: newBlogImage.trim() || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
          tags: tagArr
        }
      ]
    }));
    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setNewBlogImage('');
    setNewBlogTagsText('');
  };

  const handleDeleteBlog = (id: string) => {
    const currentList = settingsForm.blogs || [];
    setSettingsForm(prev => ({
      ...prev,
      blogs: currentList.filter(item => item.id !== id)
    }));
  };

  const handleStartEditBlog = (b: any) => {
    setEditingBlogId(b.id);
    setEditingBlogTitle(b.title);
    setEditingBlogExcerpt(b.excerpt);
    setEditingBlogContent(b.content);
    setEditingBlogCategory(b.category);
    setEditingBlogAuthor(b.author);
    setEditingBlogImage(b.image);
    setEditingBlogTagsText((b.tags || []).join(', '));
  };

  const handleSaveBlog = (id: string) => {
    if (!editingBlogTitle.trim()) return;
    const colorMap = {
      'Tips Psikotes': 'bg-emerald-100 text-emerald-800 border-emerald-250',
      'Kesehatan Mental': 'bg-rose-100 text-rose-800 border-rose-250',
      'Informasi Seleksi': 'bg-amber-100 text-amber-800 border-amber-250'
    };
    const tagArr = editingBlogTagsText.split(',').map(t => t.trim()).filter(Boolean);
    const currentList = (settingsForm.blogs || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: editingBlogTitle.trim(),
          excerpt: editingBlogExcerpt.trim(),
          content: editingBlogContent.trim(),
          category: editingBlogCategory,
          categoryColor: colorMap[editingBlogCategory] || 'bg-slate-100 text-slate-800',
          author: editingBlogAuthor.trim() || 'Admin Azta',
          image: editingBlogImage.trim(),
          tags: tagArr,
          readTime: `${Math.max(2, Math.ceil(editingBlogContent.length / 500))} Menit Baca`
        };
      }
      return item;
    });
    setSettingsForm(prev => ({ ...prev, blogs: currentList }));
    setEditingBlogId(null);
  };

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

  const handleAddPartner = () => {
    if (!newPartnerName.trim() || !newPartnerType.trim()) return;
    const currentPartners = settingsForm.partners || [
      { id: 'partner-1', name: 'Polda Jawa Timur', type: 'Instansi Seleksi' },
      { id: 'partner-2', name: 'Kodam Brawijaya', type: 'Instansi Seleksi' },
      { id: 'partner-3', name: 'PT Kereta Api Indonesia', type: 'BUMN' },
      { id: 'partner-4', name: 'Bank Mandiri', type: 'Perbankan BUMN' },
      { id: 'partner-5', name: 'Kemenkumham RI', type: 'Kedinasan / PNS' },
      { id: 'partner-6', name: 'HIMPSI Jatim', type: 'Asosiasi Resmi' }
    ];
    const newPartner = {
      id: 'partner-' + Date.now(),
      name: newPartnerName.trim(),
      type: newPartnerType.trim()
    };
    setSettingsForm(prev => ({
      ...prev,
      partners: [...currentPartners, newPartner]
    }));
    setNewPartnerName('');
    setNewPartnerType('');
  };

  const handleDeletePartner = (id: string) => {
    const currentPartners = settingsForm.partners || [
      { id: 'partner-1', name: 'Polda Jawa Timur', type: 'Instansi Seleksi' },
      { id: 'partner-2', name: 'Kodam Brawijaya', type: 'Instansi Seleksi' },
      { id: 'partner-3', name: 'PT Kereta Api Indonesia', type: 'BUMN' },
      { id: 'partner-4', name: 'Bank Mandiri', type: 'Perbankan BUMN' },
      { id: 'partner-5', name: 'Kemenkumham RI', type: 'Kedinasan / PNS' },
      { id: 'partner-6', name: 'HIMPSI Jatim', type: 'Asosiasi Resmi' }
    ];
    const updated = currentPartners.filter(p => p.id !== id);
    setSettingsForm(prev => ({ ...prev, partners: updated }));
  };

  const handleStartEditPartner = (id: string, name: string, type: string) => {
    setEditingPartnerId(id);
    setEditingPartnerName(name);
    setEditingPartnerType(type);
  };

  const handleSaveEditPartner = (id: string) => {
    if (!editingPartnerName.trim() || !editingPartnerType.trim()) return;
    const currentPartners = settingsForm.partners || [
      { id: 'partner-1', name: 'Polda Jawa Timur', type: 'Instansi Seleksi' },
      { id: 'partner-2', name: 'Kodam Brawijaya', type: 'Instansi Seleksi' },
      { id: 'partner-3', name: 'PT Kereta Api Indonesia', type: 'BUMN' },
      { id: 'partner-4', name: 'Bank Mandiri', type: 'Perbankan BUMN' },
      { id: 'partner-5', name: 'Kemenkumham RI', type: 'Kedinasan / PNS' },
      { id: 'partner-6', name: 'HIMPSI Jatim', type: 'Asosiasi Resmi' }
    ];
    const updated = currentPartners.map(p => p.id === id ? { ...p, name: editingPartnerName.trim(), type: editingPartnerType.trim() } : p);
    setSettingsForm(prev => ({ ...prev, partners: updated }));
    setEditingPartnerId(null);
    setEditingPartnerName('');
    setEditingPartnerType('');
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

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex items-center space-x-3 shadow-md" id="admin-meta">
              <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold font-mono text-slate-100">ROLE: ADMINISTRATOR</p>
                <p className="text-[10px] text-emerald-400 mt-0.5 leading-none font-mono">Status Enkripsi: Aktif</p>
              </div>
            </div>

            <button
              onClick={handleSyncWorkspaceData}
              disabled={isSyncing}
              className={`p-4 border rounded-2xl flex items-center space-x-3 shadow-md transition-all text-xs font-bold font-mono uppercase text-left shrink-0 ${
                isSyncing 
                  ? 'bg-amber-950/80 border-amber-800 text-amber-400 animate-pulse cursor-not-allowed'
                  : 'bg-indigo-950 border-indigo-800 hover:bg-indigo-900 text-indigo-300 hover:border-indigo-600 active:scale-95 cursor-pointer'
              }`}
              title="Panggang kustomisasi beranda & alumni Anda saat ini ke dalam source code agar menjadi default bagi semua pengunjung!"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <div className="font-sans">
                <p className="text-[10px] font-bold font-mono uppercase leading-tight">{isSyncing ? 'Menyimpan...' : 'SIMPAN KE PROJECT SOURCE'}</p>
                <p className="text-[8px] text-indigo-400 font-mono lowercase tracking-normal">Bake data to code for all devices</p>
              </div>
            </button>
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

              {/* Legalitas & Perizinan Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">Legalitas Lembaga (NIB & No Tester)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Nomor Induk Berusaha (NIB):</label>
                    <input 
                      type="text"
                      value={settingsForm.nib || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, nib: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-255 rounded-lg"
                      placeholder="e.g. 2712230283639"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">No. Tester / Izin Praktek:</label>
                    <input 
                      type="text"
                      value={settingsForm.noTester || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, noTester: e.target.value }))}
                      className="w-full p-2.5 text-xs border border-gray-255 rounded-lg"
                      placeholder="e.g. 0507/lz.Pr/PP-IIBKIN/VI/2017"
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

              {/* Partner Settings */}
              <div className="space-y-4 pt-6 border-t" id="settings-partners-block">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">11. Kelola Mitra Kerja Sama & Klien Instansi</h4>
                <p className="text-[11px] text-gray-500">
                  Tentukan apakah logo dan daftar "Mitra Kerja Sama & Klien Instansi Terkait" ditampilkan pada halaman beranda utama atau disembunyikan, serta kelola nama dan kategorinya.
                </p>

                <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-150 text-left">
                  <input
                    type="checkbox"
                    id="toggle_show_partners_on_home"
                    checked={settingsForm.showPartnersOnHome !== false}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, showPartnersOnHome: e.target.checked }))}
                    className="w-4 h-4 text-emerald-800 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="toggle_show_partners_on_home" className="text-xs font-semibold text-emerald-950 cursor-pointer select-none">
                    Tampilkan "Mitra Kerja Sama & Klien Instansi Terkait" di Beranda
                  </label>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border animate-fadeIn" id="partners-inner-editor">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daftar Mitra Saat Ini</span>
                  {/* Read List of Partners */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {(settingsForm.partners || [
                      { id: 'partner-1', name: 'Polda Jawa Timur', type: 'Instansi Seleksi' },
                      { id: 'partner-2', name: 'Kodam Brawijaya', type: 'Instansi Seleksi' },
                      { id: 'partner-3', name: 'PT Kereta Api Indonesia', type: 'BUMN' },
                      { id: 'partner-4', name: 'Bank Mandiri', type: 'Perbankan BUMN' },
                      { id: 'partner-5', name: 'Kemenkumham RI', type: 'Kedinasan / PNS' },
                      { id: 'partner-6', name: 'HIMPSI Jatim', type: 'Asosiasi Resmi' }
                    ]).map((partner, index) => (
                      <div key={partner.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs gap-2">
                        {editingPartnerId === partner.id ? (
                          <div className="flex-grow flex flex-col sm:flex-row items-center gap-2 w-full">
                            <input
                              type="text"
                              value={editingPartnerName}
                              onChange={(e) => setEditingPartnerName(e.target.value)}
                              placeholder="Nama Mitra/Instansi"
                              className="w-full sm:w-1/2 p-1.5 text-xs border rounded-lg focus:border-emerald-800"
                            />
                            <input
                              type="text"
                              value={editingPartnerType}
                              onChange={(e) => setEditingPartnerType(e.target.value)}
                              placeholder="Jenis (e.g. BUMN, Kedinasan)"
                              className="w-full sm:w-1/2 p-1.5 text-xs border rounded-lg focus:border-emerald-800"
                            />
                            <div className="flex items-center space-x-1 whitespace-nowrap self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleSaveEditPartner(partner.id)}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPartnerId(null)}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-850 block">{partner.name}</span>
                              <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-wide leading-none">{partner.type}</span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleStartEditPartner(partner.id, partner.name, partner.type)}
                                className="px-2 py-1 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors text-[10px] font-semibold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePartner(partner.id)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-605 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Partner Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t">
                    <input
                      type="text"
                      placeholder="Nama Mitra Baru (e.g. Polres Madiun)"
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      className="w-full sm:w-1/2 p-2.5 text-xs border bg-white rounded-xl focus:border-emerald-850"
                    />
                    <input
                      type="text"
                      placeholder="Kategori (e.g. Kepolisian)"
                      value={newPartnerType}
                      onChange={(e) => setNewPartnerType(e.target.value)}
                      className="w-full sm:w-1/2 p-2.5 text-xs border bg-white rounded-xl focus:border-emerald-850"
                    />
                    <button
                      type="button"
                      onClick={handleAddPartner}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 uppercase cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CONTENT MANAGEMENT SECTION FOR 7 FITUR UTAMA */}
              <div className="space-y-6 pt-6 border-t" id="settings-dynamic-content-section">
                <div className="bg-emerald-50/50 border border-emerald-150 p-4 rounded-2xl">
                  <h3 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider">🛠️ Editor Konten Dinamis (7 Fitur Website)</h3>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Tambahkan, ubah, dan hapus konten pada 7 fitur utama Azta secara instan. Pastikan untuk menekan tombol <strong>"Simpan Semua Perubahan"</strong> di bagian bawah halaman setelah Anda selesai mengedit!
                  </p>
                </div>

                {/* Fitur: Profil Akurasi */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-profil-akurasi">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">🎯 Fitur: Profil Akurasi (Homepage)</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Kelola informasi fasilitas & status bimbingan presisi (Ilustrasi samping seksi Keunggulan).</p>
                    </div>
                    <div className="flex items-center">
                      <label className="text-[11px] font-bold text-gray-700 flex items-center space-x-2 cursor-pointer bg-white p-2 px-3.5 border rounded-xl shadow-sm hover:border-emerald-800 transition-all">
                        <input
                          type="checkbox"
                          checked={settingsForm.showProfilAkurasiOnHome !== false}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, showProfilAkurasiOnHome: e.target.checked }))}
                          className="accent-emerald-800 w-3.5 h-3.5 rounded"
                        />
                        <span>Tampilkan di Beranda</span>
                      </label>
                    </div>
                  </div>

                  {/* Header/Footer Meta Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-550 block">Ubah Label Atas (Caps):</label>
                      <input 
                        type="text"
                        value={settingsForm.profilAkurasiLabel || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, profilAkurasiLabel: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                        placeholder="PROFIL AKURASI"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-550 block">Judul Profil:</label>
                      <input 
                        type="text"
                        value={settingsForm.profilAkurasiTitle || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, profilAkurasiTitle: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                        placeholder="Fasilitas Bimbingan Azta"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-gray-550 block">Deskripsi Profil:</label>
                      <textarea 
                        value={settingsForm.profilAkurasiDesc || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, profilAkurasiDesc: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                        rows={2}
                        placeholder="Suasana bimbingan nyaman dan representatif di pusat kota Madiun, menjamin fokus terbaik selama pengerjaan."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-550 block">Lokasi Footer:</label>
                      <input 
                        type="text"
                        value={settingsForm.profilAkurasiLocation || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, profilAkurasiLocation: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                        placeholder="Madiun, Jawa Timur"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-550 block">Keterangan Akreditasi/Badge:</label>
                      <input 
                        type="text"
                        value={settingsForm.profilAkurasiBadge || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, profilAkurasiBadge: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                        placeholder="⭐ Terakreditasi"
                      />
                    </div>
                  </div>

                  {/* Profil Akurasi Items Manager */}
                  <div className="space-y-2 border-t pt-3">
                    <span className="text-xs font-bold text-slate-800 block text-left">📋 Daftar Fasilitas/Layanan Presisi (Edit, Tambah, Hapus)</span>
                    
                    <div className="space-y-2">
                      {(settingsForm.profilAkurasiItems || [
                        { id: 'pa-1', title: 'Lab Komputer Simulasi CAT', status: 'Tersedia' },
                        { id: 'pa-2', title: 'Ruang Konseling Kedap Nyaman', status: 'Tersedia' },
                        { id: 'pa-3', title: 'Rapor Psikogram Kepribadian', status: 'Eksklusif' }
                      ]).map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left flex items-center justify-between">
                          {editingProfilAkurasiItemId === item.id ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full pr-1">
                              <input
                                  type="text"
                                  value={editingProfilAkurasiItemTitle}
                                  onChange={(e) => setEditingProfilAkurasiItemTitle(e.target.value)}
                                  className="p-2 text-xs border rounded-lg bg-neutral-50 flex-1"
                                  placeholder="Nama Fasilitas"
                                />
                              <input
                                  type="text"
                                  value={editingProfilAkurasiItemStatus}
                                  onChange={(e) => setEditingProfilAkurasiItemStatus(e.target.value)}
                                  className="p-2 text-xs border rounded-lg bg-neutral-50 sm:w-1/3"
                                  placeholder="Status (e.g. Tersedia)"
                                />
                              <div className="flex items-center space-x-1 justify-end shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSaveProfilAkurasiItem(item.id)}
                                  className="px-2.5 py-1.5 bg-emerald-800 text-white hover:bg-emerald-950 font-bold text-[10px] rounded cursor-pointer flex items-center space-x-1"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Simpan</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingProfilAkurasiItemId(null)}
                                  className="px-2.5 py-1.5 bg-gray-150 text-gray-700 font-bold text-[10px] rounded cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900 pr-16">{item.title}</h5>
                                <div className="flex items-center space-x-1.5 pt-0.5">
                                  <span className="text-[10px] font-mono text-gray-400">Status:</span>
                                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[9px] rounded uppercase tracking-wider">{item.status}</span>
                                </div>
                              </div>
                              <div className="flex space-x-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditProfilAkurasiItem(item.id, item.title, item.status)}
                                  className="p-1 px-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                                  title="Edit Item"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProfilAkurasiItem(item.id)}
                                  className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                                  title="Hapus Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Item form */}
                    <div className="bg-white p-3.5 rounded-xl border border-dashed border-gray-300 space-y-3.5 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">➕ Tambah Fasilitas Akurasi Baru:</span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Nama Fasilitas Baru (e.g. Ruang Istirahat Berupaya)"
                          value={newProfilAkurasiItemTitle}
                          onChange={(e) => setNewProfilAkurasiItemTitle(e.target.value)}
                          className="w-full sm:w-2/3 p-2.5 text-xs border bg-slate-50 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Keterangan/Status (e.g. Tersedia)"
                          value={newProfilAkurasiItemStatus}
                          onChange={(e) => setNewProfilAkurasiItemStatus(e.target.value)}
                          className="w-full sm:w-1/3 p-2.5 text-xs border bg-slate-50 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddProfilAkurasiItem}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg uppercase cursor-pointer flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Fasilitas</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitur: Form Pendaftaran Online Interaktif */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-form-pendaftaran-online">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 text-left">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">📋 Fitur: Form Pendaftaran Online Interaktif</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Kelola opsi pilar bimbingan yang terintegrasi langsung dengan wizard pendaftaran baru.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-[11px] font-bold text-gray-700 flex items-center space-x-2 cursor-pointer bg-white p-2 px-3.5 border rounded-xl shadow-sm hover:border-emerald-800 transition-all">
                        <input
                          type="checkbox"
                          checked={settingsForm.showFormPendaftaranOnline !== false}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, showFormPendaftaranOnline: e.target.checked }))}
                          className="accent-emerald-800 w-3.5 h-3.5 rounded"
                        />
                        <span>Aktifkan Fitur</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800 block text-left">📋 Daftar Program Pendaftaran (Tambah, Ubah, Hapus)</span>
                    
                    <div className="space-y-2">
                      {(settingsForm.interactivePrograms || [
                        { id: 'cat_tni_polri', category: 'seleksi', tag: 'PERSIPAN SELEKSI', title: 'Bimbel Psikotes Terpadu TNI-POLRI / IPDN', desc: 'Sistem Akurasi Presisi, Try out CAT terkomputerisasi, rekap grafik kepribadian.', price: 4500000 },
                        { id: 'cat_bumn_pns', category: 'seleksi', tag: 'PERSIPAN SELEKSI', title: 'Persiapan Instansi Pemerintah/BUMN/Swasta', desc: 'Pelatihan presentasi, STAR wawancara kerja, LGD, SKB CAT.', price: 2500000 },
                        { id: 'test_iq', category: 'asesmen', tag: 'ASESMEN PSIKOLOGI', title: 'Tes IQ / Inteligensi Umum (Sertifikat Resmi)', desc: 'IST / WAIS terstandar HIMPSI, laporan psikogram detail.', price: 350000 },
                        { id: 'counseling_mental', category: 'konseling', tag: 'LAYANAN KONSELING', title: 'Sesi Counseling Privat 1-on-1 Sesi Psikolog', desc: 'Pemulihan burnout stres, pengarahan potensi, coping stres.', price: 450000 }
                      ]).map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left">
                          {editingIntProgId === item.id ? (
                            <div className="space-y-3 w-full pr-1">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Judul Program:</label>
                                  <input
                                    type="text"
                                    value={editingIntProgTitle}
                                    onChange={(e) => setEditingIntProgTitle(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="Nama Program"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Tag Atas:</label>
                                  <input
                                    type="text"
                                    value={editingIntProgTag}
                                    onChange={(e) => setEditingIntProgTag(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="e.g. PERSIPAN SELEKSI"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Biaya (Rp):</label>
                                  <input
                                    type="number"
                                    value={editingIntProgPrice}
                                    onChange={(e) => setEditingIntProgPrice(Number(e.target.value))}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="Biaya dalam rupiah"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Deskripsi Singkat:</label>
                                  <input
                                    type="text"
                                    value={editingIntProgDesc}
                                    onChange={(e) => setEditingIntProgDesc(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="Penjelasan ringkas program"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Kategori Sub Tab:</label>
                                  <select
                                    value={editingIntProgCategory}
                                    onChange={(e) => setEditingIntProgCategory(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                  >
                                    <option value="seleksi">Persiapan Seleksi (Bimbel TNI/POLRI/Korp)</option>
                                    <option value="asesmen">Asesmen Psikologi (Tes IQ/Sertifikasi)</option>
                                    <option value="konseling">Layanan Konseling (Sesi Privat)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSaveIntProg(item.id)}
                                  className="px-3 py-1.5 bg-emerald-800 text-white hover:bg-emerald-950 font-bold text-[10px] rounded cursor-pointer flex items-center space-x-1"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Simpan</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingIntProgId(null)}
                                  className="px-3 py-1.5 bg-gray-150 text-gray-750 font-bold text-[10px] rounded cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1.5">
                                <div className="flex items-center space-x-2 flex-wrap gap-1">
                                  <span className="px-1.5 py-0.5 bg-amber-450 text-amber-950 bg-amber-200 font-bold text-[8px] uppercase tracking-wider rounded">{item.tag}</span>
                                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-[8px] uppercase tracking-wider rounded">{item.category}</span>
                                  <h5 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h5>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-relaxed max-w-2xl">{item.desc}</p>
                                <p className="text-xs font-bold text-emerald-900 font-mono">Biaya: Rp{item.price.toLocaleString('id-ID')}</p>
                              </div>
                              <div className="flex space-x-1 shrink-0 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditIntProg(item.id, item.tag, item.title, item.desc, item.price, item.category)}
                                  className="p-1 px-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                                  title="Edit Program"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteIntProg(item.id)}
                                  className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Hapus Program"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Interactive Program Form */}
                    <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300 space-y-4 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-550 uppercase tracking-widest block">➕ Tambah Program Pendaftaran Baru:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Nama Program:</label>
                          <input
                            type="text"
                            placeholder="e.g. Pembekalan Jasmani AKPOL"
                            value={newIntProgTitle}
                            onChange={(e) => setNewIntProgTitle(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Tag Label:</label>
                          <input
                            type="text"
                            placeholder="e.g. PERSIPAN JASMANI"
                            value={newIntProgTag}
                            onChange={(e) => setNewIntProgTag(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Biaya (Rp):</label>
                          <input
                            type="number"
                            placeholder="e.g. 1500000"
                            value={newIntProgPrice || ''}
                            onChange={(e) => setNewIntProgPrice(Number(e.target.value))}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Deskripsi Singkat:</label>
                          <input
                            type="text"
                            placeholder="Ringkasan porsi bimbingan"
                            value={newIntProgDesc}
                            onChange={(e) => setNewIntProgDesc(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Kategori Sub Tab:</label>
                          <select
                            value={newIntProgCategory}
                            onChange={(e) => setNewIntProgCategory(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          >
                            <option value="seleksi">Persiapan Seleksi</option>
                            <option value="asesmen">Asesmen Psikologi</option>
                            <option value="konseling">Layanan Konseling</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleAddIntProg}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg uppercase cursor-pointer flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Program</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitur: Reservasi Sesi Konseling Interaktif */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-reservasi-counseling">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 text-left">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">💖 Fitur: Reservasi Sesi Konseling Interaktif</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Kelola daftar psikolog utama pendamping yang dapat dipesan langsung oleh siswa.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-[11px] font-bold text-gray-700 flex items-center space-x-2 cursor-pointer bg-white p-2 px-3.5 border rounded-xl shadow-sm hover:border-emerald-800 transition-all">
                        <input
                          type="checkbox"
                          checked={settingsForm.showReservasiKonseling !== false}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, showReservasiKonseling: e.target.checked }))}
                          className="accent-emerald-800 w-3.5 h-3.5 rounded"
                        />
                        <span>Aktifkan Fitur</span>
                      </label>
                      <label className="text-[11px] font-bold text-gray-700 flex items-center space-x-2 cursor-pointer bg-white p-2 px-3.5 border rounded-xl shadow-sm hover:border-emerald-800 transition-all">
                        <input
                          type="checkbox"
                          checked={settingsForm.showReservasiLayoutOnHome !== false}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, showReservasiLayoutOnHome: e.target.checked }))}
                          className="accent-emerald-800 w-3.5 h-3.5 rounded"
                        />
                        <span>Tampilkan di Beranda</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800 block text-left">📋 Daftar Psikolog Pendamping (Tambah, Ubah, Hapus)</span>
                    
                    <div className="space-y-2">
                      {(settingsForm.interactivePsychologists || [
                        { id: 'psy-danur', name: 'Danur Wijaya, M.Psi., Psikolog', specialization: 'Psikologi Klinis Dewasa & Industri', sip: '19.24.11-Psikolog-0831', bio: 'Berpengalaman selama 12 tahun bidang asesmen TNI-POLRI, seleksi rekrutmen perusahaan swasta/BUMN, serta pendampingan kesehatan mental pasca-trauma.', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200' },
                        { id: 'psy-retno', name: 'Dra. Retno Wulandari, M.Psi., Psikolog', specialization: 'Psikologi Perkembangan Anak & Konseling Bakat Minat', sip: '19.24.11-Psikolog-1049', bio: 'Spesialis dalam pemetaan minat bakat anak dan remaja, konsultasi penjurusan PTN, dan pendampingan akademis/kesiapan belajar.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' }
                      ]).map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left">
                          {editingPsyId === item.id ? (
                            <div className="space-y-3 w-full pr-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Nama Lengkap Psikolog & Gelar:</label>
                                  <input
                                    type="text"
                                    value={editingPsyName}
                                    onChange={(e) => setEditingPsyName(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="e.g. Danur Wijaya, M.Psi., Psikolog"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Spesialisasi / Keahlian:</label>
                                  <input
                                    type="text"
                                    value={editingPsySpecialization}
                                    onChange={(e) => setEditingPsySpecialization(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="e.g. Psikologi Klinis Dewasa"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500">Surat Izin Praktik (SIP):</label>
                                  <input
                                    type="text"
                                    value={editingPsySip}
                                    onChange={(e) => setEditingPsySip(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                    placeholder="e.g. 19.24.11-Psikolog-0831"
                                  />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <label className="text-[10px] font-bold text-gray-500">URL Foto:</label>
                                  <input
                                    type="text"
                                    value={editingPsyAvatar}
                                    onChange={(e) => setEditingPsyAvatar(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg bg-neutral-50 font-mono text-[10px] shadow-xs outline-none"
                                    placeholder="https://images.unsplash.com/..."
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500">Bio Singkat & Pengalaman:</label>
                                <textarea
                                  value={editingPsyBio}
                                  onChange={(e) => setEditingPsyBio(e.target.value)}
                                  className="w-full p-2 text-xs border rounded-lg bg-neutral-50 shadow-xs outline-none"
                                  rows={2}
                                />
                              </div>
                              <div className="flex items-center space-x-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSavePsy(item.id)}
                                  className="px-3 py-1.5 bg-emerald-800 text-white hover:bg-emerald-950 font-bold text-[10px] rounded cursor-pointer flex items-center space-x-1"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Simpan</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPsyId(null)}
                                  className="px-3 py-1.5 bg-gray-150 text-gray-755 font-bold text-[10px] rounded cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start space-x-3">
                                <img
                                  src={item.avatar}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-cover border bg-slate-100 mt-0.5 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-1">
                                  <h5 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h5>
                                  <div className="flex items-center space-x-2 text-[10px] font-bold text-rose-600">
                                    <span>{item.specialization}</span>
                                    <span>•</span>
                                    <span className="text-gray-400 font-normal">SIP: {item.sip}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-xl">{item.bio}</p>
                                </div>
                              </div>
                              <div className="flex space-x-1 shrink-0 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditPsy(item.id, item.name, item.specialization, item.sip, item.bio, item.avatar)}
                                  className="p-1 px-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                                  title="Edit Psikolog"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePsy(item.id)}
                                  className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Hapus Psikolog"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Interactive Psychologist Form */}
                    <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300 space-y-4 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-550 uppercase tracking-widest block">➕ Tambah Psikolog Pendamping Baru:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Nama Lengkap Psikolog & Gelar:</label>
                          <input
                            type="text"
                            placeholder="e.g. Amanda Putri, M.Psi., Psikolog"
                            value={newPsyName}
                            onChange={(e) => setNewPsyName(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Spesialisasi / Keahlian:</label>
                          <input
                            type="text"
                            placeholder="e.g. Konseling Anak & Tumbuh Kembang"
                            value={newPsySpecialization}
                            onChange={(e) => setNewPsySpecialization(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-550">Surat Izin Praktik (SIP):</label>
                          <input
                            type="text"
                            placeholder="e.g. 19.24.11-Psikolog-2580"
                            value={newPsySip}
                            onChange={(e) => setNewPsySip(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-bold text-gray-550">URL Link Foto:</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newPsyAvatar}
                            onChange={(e) => setNewPsyAvatar(e.target.value)}
                            className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg font-mono text-[10px] shadow-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-550">Bio Singkat & Rekam Jejak Pengalaman:</label>
                        <textarea
                          placeholder="Tuliskan ringkasan pengalaman dan kredibilitas di sini..."
                          value={newPsyBio}
                          onChange={(e) => setNewPsyBio(e.target.value)}
                          className="w-full p-2.5 text-xs border bg-slate-50 rounded-lg shadow-sm outline-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleAddPsy}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg uppercase cursor-pointer flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Psikolog</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Fitur: Sekilas Tentang Azta */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-sekilas-azta">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Fitur: Sekilas Tentang Azta (Beranda)</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #1</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-550 block">Judul Utama Sekilas Azta:</label>
                      <input 
                        type="text"
                        value={settingsForm.aboutAztaTitle || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, aboutAztaTitle: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg"
                        placeholder="Sekilas Tentang Lembaga Konseling Azta"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-550 block">Daftar Paragraf Penjelas (Tambah & Hapus):</label>
                      
                      <div className="space-y-2">
                        {(settingsForm.aboutAztaParas || [
                          'Azta Best Choice Counseling & Psychology Madiun hadir sebagai wujud nyata dedikasi layanan profesional yang mengintegrasikan kesiapan mental, kognitif, fisik, dan kejiwaan bagi segenap calon bintara TNI-POLRI, instansi kedinasan, calon pegawai BUMN, serta pendampingan klinis psikologis anak dan dewasa di wilayah Jawa Timur.',
                          'Didirikan di Jl. Kawis, Kecamatan Taman, Madiun, lembaga kami memadukan bimbingan akademik tervalidasi menggunakan Computer Assisted Test (CAT) mandiri di laboratorium komputer rahasia kami, latihan jasmani taktis luar ruangan, dan bimbingan konseling profesional tatap muka bersama psikolog utama berlisensi SIPP / HIMPSI.'
                        ]).map((para, index) => (
                          <div key={index} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left">
                            {editingAboutAztaParaIdx === index ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingAboutAztaParaText}
                                  onChange={(e) => setEditingAboutAztaParaText(e.target.value)}
                                  className="w-full p-2 text-xs border rounded-lg"
                                  rows={3}
                                />
                                <div className="flex justify-end space-x-1.5">
                                  <button
                                    onClick={() => handleSaveAboutAztaPara(index)}
                                    className="px-2 py-1 bg-emerald-800 text-white text-[10px] font-bold rounded cursor-pointer"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingAboutAztaParaIdx(null)}
                                    className="px-2 py-1 bg-gray-150 text-gray-700 text-[10px] font-bold rounded cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-gray-700 leading-relaxed pr-12">{para}</p>
                                <div className="absolute right-2 top-2 flex space-x-1">
                                  <button
                                    onClick={() => handleStartEditAboutAztaPara(index, para)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Paragraf"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAboutAztaPara(index)}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    title="Hapus Paragraf"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Paragraph Input Row */}
                      <div className="flex gap-2 pt-1">
                        <textarea
                          placeholder="Masukkan paragraf baru untuk Sekilas Tentang Azta..."
                          value={newAboutAztaPara}
                          onChange={(e) => setNewAboutAztaPara(e.target.value)}
                          className="w-full p-2.5 text-xs border bg-white rounded-lg"
                          rows={2}
                        />
                        <button
                          onClick={handleAddAboutAztaPara}
                          className="px-4 bg-slate-800 hover:bg-slate-905 text-white font-bold text-xs rounded-lg uppercase cursor-pointer shrink-0 self-end py-3"
                        >
                          Tambah Para
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Fitur: Visi Utama Azta */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-visi-azta">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Fitur: Visi Utama Azta (Beranda)</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #2</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-550 block">Slogan Sub-Visi (Subtitle):</label>
                      <input 
                        type="text"
                        value={settingsForm.visionSubtitle || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, visionSubtitle: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg"
                        placeholder="Integrasi Taktis & Karakter Unggul"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-550 block">Pernyataan Visi Utama:</label>
                      <textarea 
                        value={settingsForm.visionText || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, visionText: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg font-sans"
                        rows={3}
                        placeholder="Menjadi lembaga bimbingan psikotes, pembinaan kesiapan mental taruna, dan layanan konseling klinis..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-550 block">Catatan Kaki Visi (Footnote):</label>
                      <input 
                        type="text"
                        value={settingsForm.visionFootnote || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, visionFootnote: e.target.value }))}
                        className="w-full p-2.5 text-xs border bg-white rounded-lg"
                        placeholder="Sinergi Akademis, Jasmani, & Psikologis tervalidasi Psikolog profesional."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Fitur: PortoPolio Yananan (Pilar) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-portopolio">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">3. Fitur: Portofolio Layanan (Pilar Utama Beranda)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ubah item pilar (A, B, C) yang tampil pada Beranda.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #3</span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(settingsForm.portfolioPillars || [
                        { id: 'pil-1', category: 'seleksi', title: 'Pilar A: Seleksi & Akurasi CAT', desc: 'Bimbingan intensif persiapan ujian bintara kepolisian, akademi militer, kedinasan IPDN, STIS, STAN, dan CPNS/BUMN.', bullets: ['Simulasi Software CAT Mandiri', 'Latihan Postur Jasmani', 'Paket Evaluasi Soal Terkini'] },
                        { id: 'pil-2', category: 'asesmen', title: 'Pilar B: Asesmen Psikometri', desc: 'Pengukuran orisinil kognitif IQ umum, penjurusan bakat minat anak, serta rekrutmen pegawai.', bullets: ['Tes IQ (CFIT, IST, WAIS)', 'Pemetaan Karir RIASEC', 'Sertifikat Psikogram Resmi'] },
                        { id: 'pil-3', category: 'konseling', title: 'Pilar C: Konseling & Klinis', desc: 'Pendampingan langsung kesehatan mental, stress coping management, pasca-kegagalan seleksi.', bullets: ['Terapi Burnout Belajar', 'Konseling Rahasia', 'Coping Management Ujian'] }
                      ]).map((pillar) => (
                        <div key={pillar.id} className="bg-white p-4 rounded-xl border border-gray-200 relative flex flex-col justify-between text-left">
                          {editingPillarId === pillar.id ? (
                            <div className="space-y-2 text-left">
                              <input 
                                type="text"
                                value={editingPillarTitle}
                                onChange={(e) => setEditingPillarTitle(e.target.value)}
                                className="w-full p-2 text-[11px] border rounded"
                                placeholder="Judul Pilar"
                              />
                              <select
                                value={editingPillarCategory}
                                onChange={(e) => setEditingPillarCategory(e.target.value)}
                                className="w-full p-1.5 text-[11px] border rounded bg-white"
                              >
                                <option value="seleksi">Seleksi (Pilar A)</option>
                                <option value="asesmen">Asesmen (Pilar B)</option>
                                <option value="konseling">Konseling (Pilar C)</option>
                              </select>
                              <textarea
                                value={editingPillarDesc}
                                onChange={(e) => setEditingPillarDesc(e.target.value)}
                                className="w-full p-2 text-[11px] border rounded"
                                rows={2}
                                placeholder="Deskripsi Singkat"
                              />
                              <input 
                                type="text"
                                value={editingPillarBulletsText}
                                onChange={(e) => setEditingPillarBulletsText(e.target.value)}
                                className="w-full p-2 text-[11px] border rounded"
                                placeholder="Poin-Poin Bullets (pisahkan dengan koma)"
                              />
                              <div className="flex justify-end space-x-1 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSavePillar(pillar.id)}
                                  className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[10px] font-bold"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPillarId(null)}
                                  className="px-2.5 py-1 bg-gray-150 text-gray-700 rounded text-[10px] font-bold"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-1 flex-grow">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase leading-none">{pillar.category}</span>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditPillar(pillar.id, pillar.title, pillar.category, pillar.desc, pillar.bullets)}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePillar(pillar.id)}
                                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <h5 className="font-bold text-xs text-slate-900 mt-1">{pillar.title}</h5>
                                <p className="text-[10px] text-gray-500 leading-snug line-clamp-3">{pillar.desc}</p>
                                <div className="pt-1.5 flex flex-wrap gap-1">
                                  {pillar.bullets.slice(0, 3).map((b, i) => (
                                    <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{b}</span>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Form tambah pilar */}
                    <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 space-y-3 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-650 uppercase">Form Tambah Pilar Baru:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Nama Pilar (e.g. Pilar D: Pembinaan Fisik)"
                          value={newPillarTitle}
                          onChange={(e) => setNewPillarTitle(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                        <select
                          value={newPillarCategory}
                          onChange={(e) => setNewPillarCategory(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        >
                          <option value="seleksi">Seleksi</option>
                          <option value="asesmen">Asesmen</option>
                          <option value="konseling">Konseling</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Contoh Poin (Bullet 1, Bullet 2)"
                          value={newPillarBulletsText}
                          onChange={(e) => setNewPillarBulletsText(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                      </div>
                      <textarea
                        placeholder="Deskripsi pilar yang menggambarkan fokus layanannya..."
                        value={newPillarDesc}
                        onChange={(e) => setNewPillarDesc(e.target.value)}
                        className="w-full p-2 text-xs border rounded-lg bg-slate-50"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={handleAddPillar}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                      >
                        Tambah Pilar
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Fitur: Keunggulan Lembaga */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-keunggulan">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">4. Fitur: Keunggulan Lembaga (Beranda)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ubah daftar poin kelebihan instansi.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #4</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="space-y-1.55">
                        <label className="text-[11px] font-bold text-gray-500">Judul Keunggulan:</label>
                        <input 
                          type="text"
                          value={settingsForm.keunggulanTitle || ''}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, keunggulanTitle: e.target.value }))}
                          className="w-full p-2.5 text-xs border bg-white rounded-lg"
                          placeholder="Keunggulan Bimbingan Azta"
                        />
                      </div>
                      <div className="space-y-1.55">
                        <label className="text-[11px] font-bold text-gray-500">Deskripsi Pengantar:</label>
                        <input 
                          type="text"
                          value={settingsForm.keunggulanDesc || ''}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, keunggulanDesc: e.target.value }))}
                          className="w-full p-2.5 text-xs border bg-white rounded-lg"
                          placeholder="Mengapa ratusan calon taruna dan instansi memilih kami?"
                        />
                      </div>
                    </div>

                    {/* Keunggulan List */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-550 block text-left">Poin Keunggulan (Tambah / Hapus):</label>
                      <div className="space-y-2">
                        {(settingsForm.keunggulanList || [
                          { id: 'k-1', title: 'Psikolog Berlisensi SIPP', desc: 'Tes langsung diawasi dan laporan ditandatangani Psikolog HIMPSI.' },
                          { id: 'k-2', title: 'Laboratorium CAT Mandiri', desc: 'Latihan simulasi mirip aslinya untuk mengurangi cemas.' }
                        ]).map((keunggulan) => (
                          <div key={keunggulan.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left">
                            {editingKeunggulanId === keunggulan.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingKeunggulanTitle}
                                  onChange={(e) => setEditingKeunggulanTitle(e.target.value)}
                                  className="w-full p-2 text-xs border rounded"
                                  placeholder="Judul Keunggulan"
                                />
                                <textarea
                                  value={editingKeunggulanDesc}
                                  onChange={(e) => setEditingKeunggulanDesc(e.target.value)}
                                  className="w-full p-2 text-xs border rounded"
                                  rows={2}
                                  placeholder="Deskripsi Poin"
                                />
                                <div className="flex justify-end space-x-1.5">
                                  <button
                                    onClick={() => handleSaveKeunggulan(keunggulan.id)}
                                    className="px-2.5 py-1 bg-emerald-800 text-white text-[10px] font-bold rounded cursor-pointer"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingKeunggulanId(null)}
                                    className="px-2.5 py-1 bg-gray-150 text-gray-750 text-[10px] font-bold rounded cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h5 className="text-xs font-bold text-slate-900 pr-12">{keunggulan.title}</h5>
                                <p className="text-[11px] text-gray-500 leading-snug pr-12 mt-0.5">{keunggulan.desc}</p>
                                <div className="absolute right-2 top-2.5 flex space-x-1">
                                  <button
                                    onClick={() => handleStartEditKeunggulan(keunggulan.id, keunggulan.title, keunggulan.desc)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteKeunggulan(keunggulan.id)}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Keunggulan Form */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 text-left">
                        <input
                          type="text"
                          placeholder="Nama Keunggulan Baru"
                          value={newKeunggulanItemTitle}
                          onChange={(e) => setNewKeunggulanItemTitle(e.target.value)}
                          className="p-2.5 text-xs border bg-white rounded-lg flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Penjelasan kebaikan/keunggulan..."
                          value={newKeunggulanItemDesc}
                          onChange={(e) => setNewKeunggulanItemDesc(e.target.value)}
                          className="p-2.5 text-xs border bg-white rounded-lg flex-1 sm:flex-[2]"
                        />
                        <button
                          onClick={handleAddKeunggulan}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg uppercase cursor-pointer"
                        >
                          Tambah Poin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Fitur: Layanan Detail (Sub-programs) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-sub-program-layanan">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">5. Fitur: Sub-Program Layanan Detail (Katalog Lengkap)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Tambah & kelola item bimbingan yang terpeta ke Menu Layanan (Pilar A, B, C).</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #5</span>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="subprogs-admin-list">
                      {(settingsForm.servicesSubPrograms || []).map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-150 relative text-left flex flex-col justify-between">
                          {editingSubProgId === item.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingSubProgTitle}
                                onChange={(e) => setEditingSubProgTitle(e.target.value)}
                                className="w-full p-2 text-xs border rounded"
                                placeholder="Judul Sub-program"
                              />
                              <select
                                value={editingSubProgCategory}
                                onChange={(e) => setEditingSubProgCategory(e.target.value as any)}
                                className="w-full p-2 text-xs border rounded bg-white"
                              >
                                <option value="seleksi">Seleksi (Pilar A)</option>
                                <option value="asesmen">Asesmen (Pilar B)</option>
                                <option value="konseling">Konseling (Pilar C)</option>
                              </select>
                              <textarea
                                value={editingSubProgDesc}
                                onChange={(e) => setEditingSubProgDesc(e.target.value)}
                                className="w-full p-2 text-xs border rounded"
                                rows={2}
                                placeholder="Detail penjelasan program"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={editingSubProgLabel1}
                                  onChange={(e) => setEditingSubProgLabel1(e.target.value)}
                                  className="p-1.5 text-[10px] border rounded"
                                  placeholder="Label Detail 1"
                                />
                                <input
                                  type="text"
                                  value={editingSubProgVal1}
                                  onChange={(e) => setEditingSubProgVal1(e.target.value)}
                                  className="p-1.5 text-[10px] border rounded"
                                  placeholder="Nilai Detail 1"
                                />
                                <input
                                  type="text"
                                  value={editingSubProgLabel2}
                                  onChange={(e) => setEditingSubProgLabel2(e.target.value)}
                                  className="p-1.5 text-[10px] border rounded"
                                  placeholder="Label Detail 2"
                                />
                                <input
                                  type="text"
                                  value={editingSubProgVal2}
                                  onChange={(e) => setEditingSubProgVal2(e.target.value)}
                                  className="p-1.5 text-[10px] border rounded"
                                  placeholder="Nilai Detail 2"
                                />
                              </div>
                              <div className="flex justify-end space-x-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveSubProg(item.id)}
                                  className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[10px] font-bold"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSubProgId(null)}
                                  className="px-2.5 py-1 bg-gray-150 text-gray-700 rounded text-[10px] font-bold"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] bg-slate-100 text-purple-700 font-bold px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditSubProg(item)}
                                      className="p-1 text-blue-600 hover:bg-slate-50 rounded"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubProg(item.id)}
                                      className="p-1 text-rose-600 hover:bg-slate-50 rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <h5 className="font-extrabold text-xs text-slate-900 mt-1">{item.title}</h5>
                                <p className="text-[10px] text-gray-500 leading-snug line-clamp-2 mt-0.5">{item.desc}</p>
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-gray-100 grid grid-cols-2 gap-1 text-[9px] text-slate-650 font-mono">
                                <div><strong>{item.materiLabel1 || 'Materi'}:</strong> {item.materiVal1 || '-'}</div>
                                <div><strong>{item.materiLabel2 || 'Detail'}:</strong> {item.materiVal2 || '-'}</div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {(settingsForm.servicesSubPrograms || []).length === 0 && (
                        <div className="col-span-2 text-center py-4 text-xs text-gray-400 bg-white rounded-xl">belum ada sub-program katalog. Silakan tambah menggunakan form di bawah.</div>
                      )}
                    </div>

                    {/* Add Subprog Block */}
                    <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 space-y-3 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-650 uppercase">Form Tambah Sub-Program Layanan:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Judul Sub-program bimbingan"
                          value={newSubProgTitle}
                          onChange={(e) => setNewSubProgTitle(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                        <select
                          value={newSubProgCategory}
                          onChange={(e) => setNewSubProgCategory(e.target.value as any)}
                          className="p-2 text-xs border rounded-lg bg-slate-50 text-slate-800"
                        >
                          <option value="seleksi">Seleksi & Akurasi CAT (Pilar A)</option>
                          <option value="asesmen">Asesmen Psikometri (Pilar B)</option>
                          <option value="konseling">Konseling & Klinis (Pilar C)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Penjelasan ringkas..."
                          value={newSubProgDesc}
                          onChange={(e) => setNewSubProgDesc(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Materi Utama"
                          value={newSubProgLabel1}
                          onChange={(e) => setNewSubProgLabel1(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                        <input
                          type="text"
                          placeholder="e.g. Kecerdasan, Kepribadian"
                          value={newSubProgVal1}
                          onChange={(e) => setNewSubProgVal1(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                        <input
                          type="text"
                          placeholder="Detail Sesi"
                          value={newSubProgLabel2}
                          onChange={(e) => setNewSubProgLabel2(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                        <input
                          type="text"
                          placeholder="e.g. 5 Sesi Simulasi CAT"
                          value={newSubProgVal2}
                          onChange={(e) => setNewSubProgVal2(e.target.value)}
                          className="p-2 text-xs border rounded-lg bg-slate-50"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSubProg}
                        className="px-4 py-2.5 bg-slate-850 hover:bg-slate-900 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                      >
                        Tambah Sub Program Layanan
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Fitur: Tentang Kami (Values, Profile & Tim Mentor) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-tentang-kami-kolektif">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">6. Fitur: Tentang Kami & Tim Mentor (Halaman Tentang)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Kelola Karakter Nilai Intisari & Profil Tim Instruktur / Psikolog Azta.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #6</span>
                  </div>

                  <div className="space-y-4 text-left">
                    {/* Nilai Instansi values list */}
                    <div className="space-y-2">
                      <span className="text-[10pt] font-extrabold text-slate-800 block">A. Nilai-Nilai Intisari Lembaga:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="admin-values-list">
                        {(settingsForm.tentangKamiValues || []).map((val) => (
                          <div key={val.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left">
                            {editingKamiValueId === val.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingKamiValueTitle}
                                  onChange={(e) => setEditingKamiValueTitle(e.target.value)}
                                  className="w-full p-2 text-xs border rounded"
                                />
                                <textarea
                                  value={editingKamiValueDesc}
                                  onChange={(e) => setEditingKamiValueDesc(e.target.value)}
                                  className="w-full p-2 text-xs border rounded"
                                  rows={2}
                                />
                                <div className="flex justify-end space-x-1.5">
                                  <button onClick={() => handleSaveKamiValue(val.id)} className="px-2 py-1 bg-emerald-800 text-white text-[10px] font-bold rounded">Simpan</button>
                                  <button onClick={() => setEditingKamiValueId(null)} className="px-2 py-1 bg-gray-150 text-gray-700 text-[10px] font-bold rounded">Batal</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h5 className="text-xs font-bold text-slate-900 pr-12">{val.title}</h5>
                                <p className="text-[10px] text-gray-500 mt-1">{val.desc}</p>
                                <div className="absolute right-2 top-2 flex space-x-1">
                                  <button onClick={() => handleStartEditKamiValue(val.id, val.title, val.desc)} className="p-1 text-blue-600 hover:bg-slate-50 rounded"><Edit className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleDeleteKamiValue(val.id)} className="p-1 text-rose-600 hover:bg-slate-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Kami Value */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-1 text-left">
                        <input
                          type="text"
                          placeholder="Nama Karakter/Nilai"
                          value={newKamiValueTitle}
                          onChange={(e) => setNewKamiValueTitle(e.target.value)}
                          className="p-2.5 text-xs border bg-white rounded-lg flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Deskripsi singkat makna nilai..."
                          value={newKamiValueDesc}
                          onChange={(e) => setNewKamiValueDesc(e.target.value)}
                          className="p-2.5 text-xs border bg-white rounded-lg flex-1 sm:flex-[2]"
                        />
                        <button onClick={handleAddKamiValue} className="px-4 py-2 bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs rounded-lg uppercase cursor-pointer">Tambah</button>
                      </div>
                    </div>

                    {/* Mentors / Tim list */}
                    <div className="space-y-2 pt-2 border-t text-left">
                      <span className="text-[10pt] font-extrabold text-slate-800 block">B. Struktur Tim Ahli / Psikolog / Instruktur:</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="admin-mentors-list">
                        {(settingsForm.tentangKamiMentors || []).map((m) => (
                          <div key={m.id} className="bg-white p-3 rounded-xl border border-gray-150 relative text-left flex items-start space-x-3">
                            <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border" />
                            {editingKamiMentorId === m.id ? (
                              <div className="space-y-1.5 flex-1 text-left">
                                <input type="text" value={editingKamiMentorName} onChange={(e) => setEditingKamiMentorName(e.target.value)} className="w-full p-1 text-[10px] border rounded" placeholder="Nama Lengkap & SIPP/Gelar" />
                                <input type="text" value={editingKamiMentorRole} onChange={(e) => setEditingKamiMentorRole(e.target.value)} className="w-full p-1 text-[10px] border rounded" placeholder="Jabatan" />
                                <input type="text" value={editingKamiMentorSpecial} onChange={(e) => setEditingKamiMentorSpecial(e.target.value)} className="w-full p-1 text-[10px] border rounded" placeholder="Spesialisasi" />
                                <textarea value={editingKamiMentorBio} onChange={(e) => setEditingKamiMentorBio(e.target.value)} className="w-full p-1 text-[10px] border rounded" rows={2} placeholder="Riwayat Karir Singkat" />
                                <input type="text" value={editingKamiMentorAvatar} onChange={(e) => setEditingKamiMentorAvatar(e.target.value)} className="w-full p-1 text-[10px] border rounded font-mono" placeholder="URL Foto Avatar" />
                                <div className="flex justify-end space-x-1">
                                  <button onClick={() => handleSaveKamiMentor(m.id)} className="px-2 py-1 bg-emerald-800 text-white text-[9px] font-bold rounded">Simpan</button>
                                  <button onClick={() => setEditingKamiMentorId(null)} className="px-2 py-1 bg-gray-150 text-gray-700 text-[9px] font-bold rounded">Batal</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-slate-900 truncate pr-10">{m.name}</h5>
                                  <div className="absolute right-2 top-2.5 flex space-x-1">
                                    <button onClick={() => handleStartEditKamiMentor(m)} className="p-1 text-blue-600 hover:bg-slate-50 rounded"><Edit className="w-3 h-3" /></button>
                                    <button onClick={() => handleDeleteKamiMentor(m.id)} className="p-1 text-rose-600 hover:bg-slate-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                </div>
                                <p className="text-[10px] text-emerald-800 font-bold leading-none">{m.role}</p>
                                <p className="text-[9px] text-amber-600 uppercase tracking-wide font-semibold mt-0.5">{m.special}</p>
                                <p className="text-[10px] text-gray-500 leading-snug font-sans mt-1 line-clamp-2">{m.bio}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Tim Mentor Block */}
                      <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 space-y-3 mt-2 text-left">
                        <span className="text-[10px] font-extrabold text-slate-650 uppercase">Form Tambah Tim Pengajar / Psikolog:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Nama Lengkap + Gelar Akademik"
                            value={newKamiMentorName}
                            onChange={(e) => setNewKamiMentorName(e.target.value)}
                            className="p-2 text-xs border rounded bg-slate-50"
                          />
                          <input
                            type="text"
                            placeholder="Peran (e.g. Psikolog Utama SIPP)"
                            value={newKamiMentorRole}
                            onChange={(e) => setNewKamiMentorRole(e.target.value)}
                            className="p-2 text-xs border rounded bg-slate-50"
                          />
                          <input
                            type="text"
                            placeholder="Spesialisasi (e.g. CAT TNI-POLRI)"
                            value={newKamiMentorSpecial}
                            onChange={(e) => setNewKamiMentorSpecial(e.target.value)}
                            className="p-2 text-xs border rounded bg-slate-50"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Tulis Riwayat Singkat / Bio Karir..."
                            value={newKamiMentorBio}
                            onChange={(e) => setNewKamiMentorBio(e.target.value)}
                            className="p-2 text-xs border rounded bg-slate-50"
                          />
                          <input
                            type="text"
                            placeholder="URL Gambar Berkas Foto (Biarkan kosong untuk default)"
                            value={newKamiMentorAvatar}
                            onChange={(e) => setNewKamiMentorAvatar(e.target.value)}
                            className="p-2 text-xs border rounded bg-slate-50 font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddKamiMentor}
                          className="px-4 py-2 bg-slate-850 hover:bg-slate-905 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                        >
                          Tambah Pengajar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Fitur-fitur pada menu "Artikel" */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4" id="editor-blog-kolektif">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">7. Fitur: Artikel & Berita Edukasi Psikotes (Blog)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Tambah, ubah, dan hapus artikel berita tips bimbingan psikotes dan kesehatan mental.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Fitur #7</span>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-1 gap-2.5" id="admin-articles-list">
                      {(settingsForm.blogs || []).map((b) => (
                        <div key={b.id} className="bg-white p-3 rounded-xl border border-gray-150 text-left flex gap-3 relative">
                          <img src={b.image} alt={b.title} className="w-16 h-16 rounded-lg object-cover hidden sm:block border shrink-0" />
                          {editingBlogId === b.id ? (
                            <div className="space-y-2 flex-1 text-left">
                              <input type="text" value={editingBlogTitle} onChange={(e) => setEditingBlogTitle(e.target.value)} className="w-full p-2 text-xs border rounded" placeholder="Judul Artikel" />
                              <select
                                value={editingBlogCategory}
                                onChange={(e) => setEditingBlogCategory(e.target.value as any)}
                                className="w-full p-2 text-xs border rounded bg-white text-slate-800"
                              >
                                <option value="Tips Psikotes">Tips Psikotes (Kategori Seleksi)</option>
                                <option value="Kesehatan Mental">Kesehatan Mental</option>
                                <option value="Informasi Seleksi">Informasi Seleksi</option>
                              </select>
                              <input type="text" value={editingBlogExcerpt} onChange={(e) => setEditingBlogExcerpt(e.target.value)} className="w-full p-2 text-xs border rounded" placeholder="Kutipan singkat penarik pembaca (Excerpt)" />
                              <textarea value={editingBlogContent} onChange={(e) => setEditingBlogContent(e.target.value)} className="w-full p-2 text-xs border rounded" rows={3} placeholder="Gunakan sintaks bebas / format teks artikel lengkap" />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input type="text" value={editingBlogAuthor} onChange={(e) => setEditingBlogAuthor(e.target.value)} className="p-2 text-xs border rounded" placeholder="Penulis (Author)" />
                                <input type="text" value={editingBlogImage} onChange={(e) => setEditingBlogImage(e.target.value)} className="p-2 text-xs border rounded font-mono" placeholder="Nilai URL cover gambar" />
                              </div>
                              <input type="text" value={editingBlogTagsText} onChange={(e) => setEditingBlogTagsText(e.target.value)} className="w-full p-2 text-xs border rounded" placeholder="Daftar Tag Kata Kunci (e.g. BUMN, CAT - pisahkan dengan koma)" />
                              <div className="flex justify-end space-x-1.5">
                                <button type="button" onClick={() => handleSaveBlog(b.id)} className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-bold">Simpan Artikel</button>
                                <button type="button" onClick={() => setEditingBlogId(null)} className="px-3 py-1.5 bg-gray-150 text-gray-700 rounded text-xs font-bold">Batal</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0 pr-16 text-left">
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full uppercase font-mono">{b.category}</span>
                                <span className="text-[9px] text-gray-400 font-mono">{b.date} • {b.author}</span>
                              </div>
                              <h5 className="font-extrabold text-xs text-slate-900 mt-1 truncate">{b.title}</h5>
                              <p className="text-[10px] text-gray-500 leading-snug line-clamp-1 mt-0.5">{b.excerpt}</p>
                              <div className="flex gap-1.5 flex-wrap pt-1.5">
                                {(b.tags || []).map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-emerald-50 text-emerald-800 rounded px-1">{t}</span>
                                ))}
                              </div>
                              <div className="absolute right-2 top-2 flex space-x-1">
                                <button type="button" onClick={() => handleStartEditBlog(b)} className="p-1 text-blue-600 hover:bg-slate-105 rounded" title="Edit Artikel"><Edit className="w-3.5 h-3.5" /></button>
                                <button type="button" onClick={() => handleDeleteBlog(b.id)} className="p-1 text-rose-600 hover:bg-slate-105 rounded" title="Hapus Artikel"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Form tambah Artikel Blog */}
                    <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 space-y-3 mt-2 text-left">
                      <span className="text-[10px] font-extrabold text-slate-650 uppercase">Form Tulis & Luncurkan Artikel Baru:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Judul Artikel Baru"
                          value={newBlogTitle}
                          onChange={(e) => setNewBlogTitle(e.target.value)}
                          className="p-2 text-xs border rounded bg-slate-50"
                        />
                        <select
                          value={newBlogCategory}
                          onChange={(e) => setNewBlogCategory(e.target.value as any)}
                          className="p-2 text-xs border rounded bg-slate-50 text-slate-800"
                        >
                          <option value="Tips Psikotes">Tips Psikotes</option>
                          <option value="Kesehatan Mental">Kesehatan Mental</option>
                          <option value="Informasi Seleksi">Informasi Seleksi</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Penulis (e.g. Tim Psikolog Azta)"
                          value={newBlogAuthor}
                          onChange={(e) => setNewBlogAuthor(e.target.value)}
                          className="p-2 text-xs border rounded bg-slate-50"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Ringkasan singkat memikat (Kutipan Excerpt)..."
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="w-full p-2 text-xs border rounded bg-slate-50"
                      />
                      <textarea
                        placeholder="Tulis seluruh isi materi artikel bimbingan atau berita seleksi di sini secara detail..."
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        className="w-full p-2.5 text-xs border rounded bg-slate-50 font-sans"
                        rows={3}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="URL Cover Gambar Cover Artikel (Opsional)"
                          value={newBlogImage}
                          onChange={(e) => setNewBlogImage(e.target.value)}
                          className="p-2 text-xs border rounded bg-slate-50 font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Daftar Tag Kata Kunci BUMN, CAT (pisahkan dengan koma)"
                          value={newBlogTagsText}
                          onChange={(e) => setNewBlogTagsText(e.target.value)}
                          className="p-2 text-xs border rounded bg-slate-50"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBlog}
                        className="px-4 py-2.5 bg-slate-850 hover:bg-slate-905 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                      >
                        Terbitkan Artikel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Portability (Backup / Export / Import) block */}
              <div className="space-y-4 pt-6 border-t" id="settings-backup-block">
                <div className="flex items-center space-x-2">
                  <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[10px] font-bold rounded-lg uppercase">Portability</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-sans">12. Pencadangan, Ekspor, & Impor Data Lintas Perangkat</h4>
                </div>
                <p className="text-[11px] text-gray-500">
                  Karena database aplikasi saat ini berjalan secara lokal (Local Browser Storage), data kustomisasi/24 alumni Anda tersimpan di komputer/hp yang sedang Anda gunakan saat ini. Jika Anda membuka link Vercel di Hp atau perangkat lain, data akan kembali ke default. Gunakan alat di bawah ini untuk mentransfer data Anda dengan mudah atau mengirimkannya ke asisten AI untuk ditanam permanen ke dalam file GitHub/Vercel berikutnya!
                </p>

                {importSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-850 rounded-xl text-xs font-semibold animate-bounce shadow-xs text-left">
                    {importSuccess}
                  </div>
                )}

                {importError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium text-left">
                    ⚠️ {importError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="backup-actions-grid">
                  {/* Left Column: Local JSON Copy for AI */}
                  <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-2xl flex flex-col justify-between space-y-3.5 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block">Metode 1: Ekspor & Kirim ke AI (Rekomendasi Utama)</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Salin seluruh database alumni & pengaturan saat ini menjadi teks sandi JSON sekali klik, lalu kirimkan teks ini ke chat asisten AI. Kami akan memperbaikinya langsung ke file source code project agar menjadi bawaan default bagi semua pengunjung di semua perangkat!
                      </p>
                    </div>

                    <div className="pt-1.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCopyBackupJSON}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                          copySuccess
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-indigo-900 hover:bg-indigo-950 text-white'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copySuccess ? 'BERHASIL DISALIN! ✓' : 'SALIN DATA JSON UNTUK CHAT AI'}</span>
                      </button>
                    </div>
                    {copySuccess && (
                      <p className="text-[10px] text-emerald-700 font-medium animate-pulse">
                        💡 Teks disalin! Silakan paste (Ctrl+V atau tempel) ke kolom chat dan katakan: "Ini adalah data 24 alumni saya: [paste di sini]".
                      </p>
                    )}
                  </div>

                  {/* Right Column: JSON Backup File Export/Import */}
                  <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col justify-between space-y-3.5 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block">Metode 2: Download & Upload Berkas Berbagi Mandiri</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Unduh data Anda berupa berkas file <code className="bg-slate-100 p-0.5 px-1 rounded font-mono text-[10px]">.json</code>. Anda bisa menyimpan berkas ini sebagai cadangan rahasia, atau membagikannya ke admin lain untuk diunggah langsung di Vercel perangkat mana pun!
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                      {/* Download */}
                      <button
                        type="button"
                        onClick={handleDownloadBackupFile}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh File Cadangan</span>
                      </button>

                      {/* Upload */}
                      <div className="relative flex-grow">
                        <label className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah & Impor File</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportBackupFile}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
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

                      {/* Nomor Siswa (Otomatis) */}
                      <div className="space-y-1 sm:col-span-2 bg-slate-50 p-3 rounded-xl border">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">1. Nomor Registrasi Siswa (Sistem Otomatis):</label>
                        <p className="text-xs font-bold font-mono text-emerald-950 mt-1">
                          {editingStudentId ? (
                            <span>{students.find(s => s.id === editingStudentId)?.studentNumber || 'AST-XXXX'}</span>
                          ) : (
                            <span className="flex items-center space-x-2">
                              <span>AST-{new Date().getFullYear()}-{String(students.length + 1).padStart(3, '0')}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-sans px-1.5 py-0.5 rounded ml-1 font-normal">Sistem Otomatis</span>
                            </span>
                          )}
                        </p>
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

                      {/* Photo Upload and Preview */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block">Pas Foto Portrait Siswa:</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200">
                          <div className="w-16 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-350 shadow-xs">
                            {studPhotoUrl ? (
                              <img src={studPhotoUrl} alt="Preview Siswa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-semibold text-center leading-none p-1 bg-slate-100">Tanpa Foto</div>
                            )}
                          </div>
                          <div className="flex-grow space-y-2 text-left w-full">
                            <div className="flex flex-wrap gap-2">
                              <label className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer text-center">
                                Unggah File Foto
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = async () => {
                                        const compressed = await compressImage(reader.result as string, 200, 260, 0.7);
                                        setStudPhotoUrl(compressed);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} 
                                  className="hidden" 
                                />
                              </label>
                              {studPhotoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setStudPhotoUrl('')}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
                                >
                                  Hapus Foto
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={studPhotoUrl}
                              onChange={(e) => setStudPhotoUrl(e.target.value)}
                              placeholder="Atau tempel Tautan URL Foto di sini..."
                              className="w-full p-2 text-[10px] border border-gray-200 rounded-lg focus:border-emerald-800 bg-white"
                            />
                            <p className="text-[9px] text-slate-400">Rekomendasi: Unggah berkas portrait .jpg/.png untuk dicetak langsung pada sertifikat/rapor.</p>
                          </div>
                        </div>
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
