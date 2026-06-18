/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, ProgramRegistration, PaymentTransaction, PsychologicalResult, Psychologist, CounselingSession, BlogArticle, SiteSettings, Student, Alumni, NotificationLog, NotificationSetting } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'student-dimas',
    name: 'Dimas Anggara',
    email: 'dimas@gmail.com',
    phone: '0812-3456-7890',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    schoolOrInstitution: 'SMA Negeri 1 Madiun',
    targetCareer: 'Akademi Kepolisian (AKPOL)'
  },
  {
    id: 'student-lia',
    name: 'Lia Rahmawati',
    email: 'lia@gmail.com',
    phone: '0857-1122-3344',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    schoolOrInstitution: 'Universitas PGRI Madiun',
    targetCareer: 'Officer Development Program (ODP) Bank Mandiri'
  },
  {
    id: 'admin-azta',
    name: 'Admin Azta Best Choice',
    email: 'admin@gmail.com',
    phone: '0811-3000-888',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  }
];

export const MOCK_PSYCHOLOGISTS: Psychologist[] = [
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

export const INITIAL_REGISTRATIONS: ProgramRegistration[] = [
  {
    id: 'reg-001',
    studentId: 'student-dimas',
    studentName: 'Dimas Anggara',
    programType: 'cat_tni_polri',
    programName: 'Bimbel Psikotes Terpadu TNI-POLRI (Akurasi Presisi)',
    status: 'approved',
    registrationDate: '2026-06-10',
    paymentStatus: 'fully_paid',
    totalPrice: 4500000,
    amountPaid: 4500000,
    method: 'offline',
    scheduleDate: 'Senin s/d Jumat, 15:30 - 18:00'
  },
  {
    id: 'reg-002',
    studentId: 'student-dimas',
    studentName: 'Dimas Anggara',
    programType: 'test_iq',
    programName: 'Tes IQ & Inteligensi Umum (Sertifikat Resmi)',
    status: 'completed',
    registrationDate: '2026-06-12',
    paymentStatus: 'fully_paid',
    totalPrice: 350000,
    amountPaid: 350000,
    method: 'offline',
    scheduleDate: '2026-06-15'
  },
  {
    id: 'reg-003',
    studentId: 'student-lia',
    studentName: 'Lia Rahmawati',
    programType: 'cat_bumn_pns',
    programName: 'Persiapan Wawancara & SKB Instansi Swasta/BUMN',
    status: 'approved',
    registrationDate: '2026-06-14',
    paymentStatus: 'dp_paid',
    totalPrice: 2500000,
    amountPaid: 1000000,
    method: 'online',
    scheduleDate: 'Sabtu & Minggu, 09:00 - 12:00'
  },
  {
    id: 'reg-004',
    studentId: 'student-lia',
    studentName: 'Lia Rahmawati',
    programType: 'counseling_potensi',
    programName: 'Sesi Konsultasi Potensi Diri (1-on-1 dengan Psikolog)',
    status: 'pending',
    registrationDate: '2026-06-16',
    paymentStatus: 'pending_verification',
    totalPrice: 450000,
    amountPaid: 450000,
    method: 'offline',
    scheduleDate: '2026-06-19'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-101',
    registrationId: 'reg-001',
    studentName: 'Dimas Anggara',
    programName: 'Bimbel Psikotes Terpadu TNI-POLRI (Akurasi Presisi)',
    amount: 4500000,
    paymentType: 'full',
    paymentMethod: 'bank_transfer',
    status: 'approved',
    date: '2026-06-10',
    bankSenderName: 'BCA A/N Dimas Anggara'
  },
  {
    id: 'pay-102',
    registrationId: 'reg-002',
    studentName: 'Dimas Anggara',
    programName: 'Tes IQ & Inteligensi Umum (Sertifikat Resmi)',
    amount: 350000,
    paymentType: 'full',
    paymentMethod: 'qris',
    status: 'approved',
    date: '2026-06-12'
  },
  {
    id: 'pay-103',
    registrationId: 'reg-003',
    studentName: 'Lia Rahmawati',
    programName: 'Persiapan Wawancara & SKB Instansi Swasta/BUMN',
    amount: 1000000,
    paymentType: 'dp',
    paymentMethod: 'bank_transfer',
    status: 'approved',
    date: '2026-06-14',
    bankSenderName: 'Alex Rahmawati (Ayah Lia)'
  },
  {
    id: 'pay-104',
    registrationId: 'reg-004',
    studentName: 'Lia Rahmawati',
    programName: 'Sesi Konsultasi Potensi Diri (1-on-1 dengan Psikolog)',
    amount: 450000,
    paymentType: 'full',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    date: '2026-06-16',
    bankSenderName: 'Mandiri A/N Lia Rahmawati',
    receiptUrl: 'dummy_receipt.png'
  }
];

export const INITIAL_RESULTS: PsychologicalResult[] = [
  {
    id: 'res-501',
    studentId: 'student-dimas',
    studentName: 'Dimas Anggara',
    testDate: '2026-06-15',
    iqScore: 124,
    iqCategory: 'Superior (Cerdas Tinggi)',
    academicScores: {
      verbal: 82,
      numerical: 85,
      spatial: 88,
      logicalReasoning: 90
    },
    personalityTraits: {
      leadership: 85,
      stability: 81,
      adaptability: 78,
      discipline: 92,
      cooperativeness: 84
    },
    recommendations: [
      'Memiliki kemampuan penalaran logis dan analitis yang sangat kuat untuk bidang taktis.',
      'Perlu terus memperkuat stabilitas emosional di bawah tekanan tinggi (time-pressure) saat pengerjaan tes koran.',
      'Sangat direkomendasikan untuk bimbingan fisik penunjang guna memaksimalkan hasil jasmani.'
    ]
  }
];

export const INITIAL_SESSIONS: CounselingSession[] = [
  {
    id: 'sess-701',
    studentId: 'student-dimas',
    studentName: 'Dimas Anggara',
    psychologistId: 'psy-danur',
    psychologistName: 'Danur Wijaya, M.Psi., Psikolog',
    date: '2026-06-15',
    time: '13:00 - 14:30',
    status: 'completed',
    sessionNotes: 'Sesi evaluasi kesiapan psikologi kepolisian. Dimas menunjukkan persistensi tinggi, namun masih ada kecenderungan perfeksionis yang memakan waktu pengerjaan soal spasial.',
    recommendations: 'Gunakan teknik eliminasi cepat untuk gambar yang membingungkan. Jaga pola tidur untuk konsentrasi prima.'
  },
  {
    id: 'sess-702',
    studentId: 'student-lia',
    studentName: 'Lia Rahmawati',
    psychologistId: 'psy-retno',
    psychologistName: 'Dra. Retno Wulandari, M.Psi., Psikolog',
    date: '2026-06-19',
    time: '10:00 - 11:30',
    status: 'booked'
  }
];

export const MOCK_SLOTS = [
  { id: 's1', psyId: 'psy-danur', psyName: 'Danur Wijaya, M.Psi.', day: 'Senin', time: '09:00 - 10:30' },
  { id: 's2', psyId: 'psy-danur', psyName: 'Danur Wijaya, M.Psi.', day: 'Senin', time: '13:00 - 14:30' },
  { id: 's3', psyId: 'psy-danur', psyName: 'Danur Wijaya, M.Psi.', day: 'Rabu', time: '15:30 - 17:00' },
  { id: 's4', psyId: 'psy-retno', psyName: 'Dra. Retno Wulandari', day: 'Selasa', time: '10:00 - 11:30' },
  { id: 's5', psyId: 'psy-retno', psyName: 'Dra. Retno Wulandari', day: 'Kamis', time: '13:00 - 14:30' },
  { id: 's6', psyId: 'psy-retno', psyName: 'Dra. Retno Wulandari', day: 'Jumat', time: '15:30 - 17:00' }
];

export const ALUMNI_TESTIMONIALS = [
  {
    id: 1,
    name: 'Ipda Rizky Pratama',
    info: 'Alumni Akpol 2023 - Sekarang Dinas di Polda Jatim',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    quote: 'Azta melatih ketajaman psikotes saya dari nol. Analisis skor dari tim psikolog Azta sangat presisi mengenai kelemahan jasmani dan kognitif saya, sehingga saya bisa memperbaikinya dan lolos dengan ranking tinggi.',
    pilar: 'TNI-POLRI Prep'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza, S.T.',
    info: 'Staff Rekrutmen - PT Pertamina (Persero)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    quote: 'Terima kasih program Assessment Center dan Kelas Wawancara Kerja BUMN di Azta! Saya tidak lagi grogi menghadapi panelis dan tahu cara menuangkan portofolio teknik saya dengan metode STAR secara meyakinkan.',
    pilar: 'BUMN & PNS Prep'
  },
  {
    id: 3,
    name: 'Bagus Wicaksono',
    info: 'Orang Tua dari Kevin (Siswa SMA - Sukses Tes Bakat PTN Kedinasan)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'Sangat puas dengan hasil Tes IQ serta Bakat Minat Azta. Konseling lanjutannya benar-benar membuka mata anak saya tentang mana jurusan kuliah yang sejalan dengan jiwanya. Kevin kini mantap di PKN STAN!',
    pilar: 'Asesmen Bakat Minat'
  }
];

export const MOCK_BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Kunci Sukses Menghadapi Tes Koran (Kraepelin / Pauli) TNI-POLRI',
    excerpt: 'Tes koran sering menjadi hambatan besar karena memicu kelelahan ekstrem. Temukan strategi ritme, grafik stabil, dan akurasi yang diinstruksikan oleh psikolog Azta.',
    category: 'Tips Psikotes',
    categoryColor: 'bg-emerald-100 text-emerald-800',
    date: '2026-06-15',
    readTime: '5 Menit Baca',
    author: 'Danur Wijaya, M.Psi.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500',
    tags: ['TNI-POLRI', 'Kraepelin', 'Pauli', 'Psikotes'],
    content: `Tes Kraepelin dan Pauli, yang secara luas dikenal dengan sebutan "Tes Koran", adalah salah satu instrumen utama dalam rangkaian psikotes masuk instansi pertahanan keamanan negara, khususnya TNI-POLRI. Lembaran raksasa yang dipenuhi angka ini sering memicu kecemasan hebat di kalangan calon prajurit.

### Mengapa Tes Koran Begitu Krusial?
Lembaga TNI-POLRI mendambakan perwira dan tamtama yang tangguh mental, konsisten, dan memiliki daya tahan stres yang tinggi. Tes Koran dirancang secara spesifik untuk mengukur:
1. **Daya Tahan Kerja (Endurance):** Sejauh mana Anda mampu mempertahankan konsentrasi sepanjang waktu pengerjaan yang melelahkan.
2. **Kestabilan Ritme Emosi:** Tercermin dari tinggi rendahnya grafik penjumlahan antar kolom. Grafik yang terlalu fluktuatif (naik turun secara tajam) mencerminkan ketidakstabilan emosional.
3. **Kecepatan Kerja (Speed):** Kuantitas kerja Anda selama rentang interval.
4. **Ketelitian (Accuracy):** Minimnya jumlah salah atau terlewat saat melakukan aritmatika penjumlahan sederhana.

### Tips Utama Meraih Grafik "Garis Sempurna":
* **Hindari Tancap Gas di Awal:** Salah satu kesalahan fatal peserta adalah memeras semua daya di 5 kolom pertama. Hal ini menjamin stamina Anda merosot tajam di pertengahan. Atur ritme yang moderat namun stabil sejak awal.
* **Fokus Pada Suara Interupsi:** Tim pemeriksa akan berkala meneriakkan "Pindah" (untuk Pauli) atau berpindah secara berkala di Kraepelin. Respons cepat tanpa membiarkan keterkejutan menginterupsi akurasi Anda adalah kuncinya.
* **Latihan Fisik Bersepeda / Aerobik:** Daya konsentrasi kognitif terkait erat dengan suplai oksigen ke otak. Di Azta, bimbingan psikotes kami satukan dengan anjuran regulasi fisik untuk daya tahan kardiovaskular maksimal.

Di Azta Best Choice, kami menyelenggarakan simulasi tes koran menggunakan perangkat evaluasi terkomputerisasi modern yang memetakan grafik kestabilan Anda secara akurat untuk meminimalkan pola fluktuasi rawan gugur.`
  },
  {
    id: 'blog-2',
    title: 'Mengenal Burnout Akademik: Tips Kesehatan Mental untuk Pejuang Kampus & Taruna',
    excerpt: 'Belajar 12 jam sehari menjelang ujian seleksi bisa berisiko menurunkan potensi otak. Pelajari tanda-tanda kelelahan kognitif dan cara memperbaikinya.',
    category: 'Kesehatan Mental',
    categoryColor: 'bg-indigo-100 text-indigo-800',
    date: '2026-06-11',
    readTime: '4 Menit Baca',
    author: 'Dra. Retno Wulandari, M.Psi.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=500',
    tags: ['Mindfulness', 'Kesehatan Mental', 'Siswa', 'Coping Stress'],
    content: `Persaingan masuk sekolah kedinasan maupun perguruan tinggi negeri reguler menuntut dedikasi belajar yang tiada henti. Namun, batas tipis antara kerja keras (hard work) dan pemaksaan berujung cedera mental (burnout) kerap terabaikan.

### Tanda-Tanda Anda Mengalami Academic Burnout:
1. **Kelelahan Fisik dan Emosional Ekstrem:** Bangun tidur tetap merasa capai, sakit kepala kronis, atau mudah tersinggung tanpa sebab jelas.
2. **Keterasingan Depersonalisasi:** Merasa sinis terhadap materi pelajaran, menganggap les/bimbingan belajar sebagai beban tanpa makna.
3. **Kehilangan Efikasi Akademik:** Merasa bodoh meski sudah meluangkan waktu berjam-jam, memicu keputusasaan mutlak.

### Cara Mengatasi dengan Pendekatan Psikologis:
* **Terapkan Aturan 50-10 (Metode Pomodoro Kustom):** Berikan otak istirahat visual mutlak selama 10 menit setiap 50 menit membaca. Matikan layar gawai, lakukan peregangan fisik ringan atau bernapas dalam.
* **Latihan Mindful Breathing Terpandu:** Sebelum menyentuh kertas ujian, lakukan penarikan napas 4 detik, tahan 4 detik, dan hembuskan 8 detik. Latihan sederhana ini memadamkan sinyal darurat amygdala, mematangkan fungsi PFC (Prefrontal Cortex) untuk daya ingat jitu.
* **Konsultasikan Profil Bakat:** Kadang stres berat bermanifestasi karena bidang pilihan Anda tidak sesuai dengan bakat kognitif dasar Anda. Mengambil asesmen minat bakat terpadu dapat meluruskan jalur karier yang membahagiakan.`
  },
  {
    id: 'blog-3',
    title: 'Persyaratan & Tahapan Penting Seleksi Administrasi & SKD BUMN/PNS 2026',
    excerpt: 'Update menyeluruh mengenai bobot nilai Seleksi Kompetensi Dasar dan Assessment Center untuk rekrutmen pegawai BUMN tahun ini.',
    category: 'Informasi Seleksi',
    categoryColor: 'bg-amber-100 text-amber-800',
    date: '2026-06-08',
    readTime: '6 Menit Baca',
    author: 'Admin Azta',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500',
    tags: ['BUMN', 'SKB', 'Wawancara', 'PNS'],
    content: `Rekrutmen Bersama BUMN dan CPNS senantiasa menjadi medan pertempuran karier paling prestisius di Indonesia. Ribuan pelamar dengan IPK sempurna tersaring gugur hanya karena kurang memahami kriteria spesifik penilaian SKD (Seleksi Kompetensi Dasar) dan TKB (Tes Kemampuan Bidang).

### 3 Pilar Tes SKD yang Wajib Dikuasai:
1. **TWK (Tes Wawasan Kebangsaan):** Mengukur jiwa bela negara, nasionalisme, dan pemahaman pilar kenegaraan. Ini bukan sekadar menghafal tanggal, namun menganalisis studi kasus pengamalan Pancasila.
2. **TIU (Tes Inteligensia Umum):** Kemampuan verbal analitis, silogisme, kemampuan numerik deret/aljabar, serta figural spasial. Poin figural kerap jadi pembeda kelulusan.
3. **TKP (Tes Karakteristik Pribadi):** Poin unik tanpa jawaban salah! Semua memiliki bobot nilai (1-5). Menguji jejaring kerja, pelayanan publik, sosial budaya, profesionalisme, serta teknologi informasi.

### Mengapa Assessment Center Penting?
BUMN-BUMN besar menerapkan metode Assessment Center untuk mengevaluasi manajerial psikotes, LGD (*Leaderless Group Discussion*), dan wawancara panelis yang mendalam. Kunci sukses LGD bukanlah menjadi peserta teraktif yang cerewet dan memotong pembicaraan, melainkan menjadi fasilitator solusi kelompok yang cerdas, inklusif, dan tenang.`
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: '', // empty to use beautiful built-in SVG logo by default
  brandName: 'Azta',
  brandSuffix: 'Best Choice',
  subTitle: 'Counseling & Psychology',
  address: 'Jl. Kawis, Taman, Kec. Taman, Kota Madiun, Jawa Timur 63131',
  phone: '0811-3000-888',
  email: 'aztabestchoice@gmail.com',
  operationalHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  
  // Home page Hero config
  heroTitle: 'Wujudkan Impian Masa Depan Anda',
  heroSubtitle: 'Lembaga bimbingan psikotes dan konseling terpercaya di Madiun. Kami melatih kesiapan mental TNI-POLRI, Kedinasan, BUMN, serta menyediakan tes IQ & Minat Bakat resmi terakreditasi Psikolog.',
  heroCtaPrimary: 'Daftar Sekarang',
  heroCtaSecondary: 'Konsultasi Gratis',
  
  // Stats counters
  stat1Value: '94.8%',
  stat1Label: 'Lulus Seleksi',
  stat2Value: '1,500+',
  stat2Label: 'Alumni Taruna',
  stat3Value: 'Psikolog',
  stat3Label: 'HIMPSI Resmi',
  
  // Custom quick links and feature lists
  feature1Title: 'Bimbel CAT & Psikotes Terpadu',
  feature1Desc: 'Latihan intensif berbasis komputer interaktif (CAT) terkomputerisasi yang disesuaikan dengan kurikulum ujian terbaru TNI, POLRI, Kedinasan, dan BUMN.',
  feature2Title: 'Tes IQ & Asesmen Kognitif',
  feature2Desc: 'Pengukuran kecerdasan umum, minat bakat, kestabilan emosi, dan tipe kepribadian bersertifikat resmi serta ditandatangani oleh Psikolog HIMPSI.',
  feature3Title: 'Konseling & Terapi Mental',
  feature3Desc: 'Layanan 1-on-1 bersama Psikolog klinis berwenang untuk meredakan kecemasan akademik, melatih coping stress, dan optimalisasi potensi psikologis.',

  // Dynamic Programs list managed by Admin
  programs: [
    'Pelatihan Psikotes TNI-POLRI',
    'Persiapan Instansi Pemerintah/BUMN/Swasta',
    'Persiapan Perguruan Tinggi'
  ],
  backgroundImageUrl: '/bg_azta_1781689948341.jpg',
  services: [
    {
      id: 'srv-1',
      title: 'TEST IQ',
      instruments: ['CFIT (Cultur Fair Intelligence Test) Skala 3']
    },
    {
      id: 'srv-2',
      title: 'TEST BAKAT',
      instruments: [
        'Tes Kemampuan Mekanik',
        'Tes Berfikir Abstrak',
        'Tes Relasi Ruang',
        'Tes Kemampuan',
        'KKK'
      ]
    },
    {
      id: 'srv-3',
      title: 'TES MINAT',
      instruments: ['Tes Minat Jabatan Lee-Thorpe']
    }
  ],
  benefits: [
    'Memberikan Gambaran / informasi mengenai potensi sebagai acuan penentuan jurusan pada Pendidikan',
    'Membantu Siswa menghubungkan hasil evaluasi dengan pilihan Pendidikan dan karier yang sesuai dengan bakat, minat dan kepribadian',
    'Membuat Keputusan yang penting bagi masa depan siswa dengan lebih tepat dan terarah.',
    'Memprediksi Tingkat keberhasilan siswa'
  ],
  showServicesOnHome: true,
  showBenefitsOnHome: true
};

export const INITIAL_ALUMNI: Alumni[] = [
  {
    id: 'alum-1',
    fullName: 'Enggar Satria Pratama',
    graduationYear: '2026',
    achievement: 'Lolos Taruna Akademi Kepolisian (AKPOL)',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'alum-2',
    fullName: 'Muhammad Fauzan Al Madany',
    graduationYear: '2026',
    achievement: 'Lolos Masinis DAOP 8 Surabaya PT. Kereta Api Indonesia (Persero)',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'alum-3',
    fullName: 'Fahreezi Akbar',
    graduationYear: '2024',
    achievement: 'Lulus Akademi Kepolisian (AKPOL) Rangking 3 Jawa Timur',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'alum-4',
    fullName: 'Ananda Putri Setyawan',
    graduationYear: '2025',
    achievement: 'Lolos Bintara PTU POLRI Polda Jatim',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-001',
    studentNumber: 'AST-2026-001',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    fullName: 'Dimas Anggara',
    email: 'dimas@gmail.com',
    phone: '081234567890',
    password: 'password123',
    birthPlace: 'Madiun',
    birthDate: '2004-03-15',
    gender: 'Laki-laki',
    address: 'Jl. Diponegoro No. 12, Oro-oro Ombo, Kartoharjo, Madiun',
    lastEducation: 'SMA',
    programJoined: 'Pelatihan Psikotes TNI-POLRI',
    registrationDate: '2026-06-10'
  },
  {
    id: 'stud-002',
    studentNumber: 'AST-2026-002',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    fullName: 'Lia Rahmawati',
    email: 'lia@gmail.com',
    phone: '089876543210',
    password: 'password123',
    birthPlace: 'Surabaya',
    birthDate: '2002-08-22',
    gender: 'Perempuan',
    address: 'Perumahan Taman Asri Blok C-5, Kelurahan Klegen, Madiun',
    lastEducation: 'S1',
    programJoined: 'Persiapan Instansi Pemerintah/BUMN/Swasta',
    registrationDate: '2026-06-14'
  }
];

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSetting = {
  enableAutomatedEmail: true,
  enableAutomatedSms: true,
  emailSenderName: 'Azta Best Choice Madiun',
  emailApiKey: 'SG.AztaSecretApiKeyPlaceholder34928347',
  smsSenderId: 'AZTA_INFO',
  smsApiKey: 'TXT-AZTA-KEY-9231804712497',
  notifyOnBookingTimesBeforeHours: 24,
  notifyOnDeadlineDaysBefore: 3
};

export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'notif-log-1',
    recipientName: 'Dimas Anggara',
    recipientContact: 'dimas@gmail.com',
    type: 'counseling_reminder',
    channel: 'email',
    title: '⏰ Pengingat Sesi Konseling Psikologis Anda',
    message: 'Halo Dimas Anggara, ini adalah pengingat sesi konseling psikologi TNI-POLRI Anda yang terjadwal besok pukul 09:00 WIB bersama Tim Psikolog Azta.',
    status: 'sent',
    timestamp: '2026-06-16T14:30:00Z'
  },
  {
    id: 'notif-log-2',
    recipientName: 'Lia Rahmawati',
    recipientContact: '089876543210',
    type: 'registration_deadline',
    channel: 'sms',
    title: 'Pemberitahuan Pendaftaran',
    message: 'Halo Lia Rahmawati, batas akhir pelunasan pendaftaran program Bimbel CAT BUMN tinggal 3 hari lagi. Segera penuhi berkas pendaftaran Anda. Terimakasih.',
    status: 'sent',
    timestamp: '2026-06-15T09:00:00Z'
  },
  {
    id: 'notif-log-3',
    recipientName: 'Seluruh Siswa Terdaftar',
    recipientContact: 'Mailing List (Siswa & Alumni)',
    type: 'article_update',
    channel: 'email',
    title: '📚 Tips Psikotes Baru: Menguasai Tes EPPS & Wartegg',
    message: 'Halo Siswa Azta, artikel blog instruksional baru mengenai tips melatih kepribadian EPPS dan menggambar Wartegg telah diterbitkan! Baca selengkapnya di portal.',
    status: 'sent',
    timestamp: '2026-06-14T10:15:00Z'
  }
];


