/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'home' | 'layanan' | 'tentang' | 'alumni' | 'blog' | 'kontak' | 'portal' | 'pendaftaran';

export type ServiceTab = 'all' | 'seleksi' | 'asesmen' | 'konseling';

export interface Alumni {
  id: string;
  fullName: string;
  graduationYear: string;
  achievement: string; // e.g., "Lolos Bintara POLRI 2025", "Lolos AKMIL 2024"
  photoUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'admin';
  avatar?: string;
  schoolOrInstitution?: string;
  targetCareer?: string;
}

export interface ProgramRegistration {
  id: string;
  studentId: string;
  studentName: string;
  programType: 'cat_tni_polri' | 'cat_bumn_pns' | 'cat_college' | 'test_iq' | 'test_aptitude' | 'test_cognitive' | 'counseling_potensi' | 'counseling_mental';
  programName: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  registrationDate: string;
  paymentStatus: 'unpaid' | 'dp_paid' | 'fully_paid' | 'pending_verification';
  totalPrice: number;
  amountPaid: number;
  scheduleDate?: string;
  method: 'offline' | 'online';
}

export interface PaymentTransaction {
  id: string;
  registrationId: string;
  studentName: string;
  programName: string;
  amount: number;
  paymentType: 'dp' | 'full' | 'pelunasan';
  paymentMethod: 'bank_transfer' | 'qris';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  receiptUrl?: string; // Simulated uploaded attachment
  bankSenderName?: string;
}

export interface PsychologicalResult {
  id: string;
  studentId: string;
  studentName: string;
  testDate: string;
  iqScore: number;
  iqCategory: string; // e.g. "Superior", "Directly Above Average"
  academicScores: {
    verbal: number;
    numerical: number;
    spatial: number;
    logicalReasoning: number;
  };
  personalityTraits: {
    leadership: number;
    stability: number;
    adaptability: number;
    discipline: number;
    cooperativeness: number;
  };
  recommendations: string[];
  pdfSimulatedUrl?: string;
}

export interface BookingSlot {
  id: string;
  psychologistId: string;
  psychologistName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 - 10:30"
  isBooked: boolean;
}

export interface Psychologist {
  id: string;
  name: string;
  specialization: string;
  sip: string; // Surat Izin Praktik Psikologi (e.g. 1234-56-78)
  avatar: string;
  bio: string;
}

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  psychologistId: string;
  psychologistName: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  sessionNotes?: string;
  recommendations?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Tips Psikotes' | 'Kesehatan Mental' | 'Informasi Seleksi';
  categoryColor: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  tags: string[];
}

export interface Student {
  id: string;
  studentNumber: string; // Otomatis sistem
  photoUrl?: string; // Berkas foto siswa
  fullName: string;
  email: string;
  phone: string;
  password: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  lastEducation: string;
  programJoined: string; // Dinamis dari daftar program
  registrationDate: string;
}

export interface SiteSettings {
  logoUrl: string; // Base64 or standard asset URL, empty string for mock SVG
  brandName: string;
  brandSuffix: string;
  subTitle: string;
  address: string;
  phone: string;
  email: string;
  operationalHours: string;
  
  // Home page Hero config
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  
  // Stats counters
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  
  // Custom quick links and feature lists
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  // Dynamic Programs list managed by Admin
  programs?: string[];
  backgroundImageUrl?: string; // Changeable website background picture
}

