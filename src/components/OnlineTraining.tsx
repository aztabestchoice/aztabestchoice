import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  FileQuestion, 
  HelpCircle, 
  Activity, 
  Sparkles, 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCcw, 
  Flag,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface OnlineTrainingProps {
  currentUser: any;
}

interface Question {
  id: number;
  category: 'Verbal' | 'Numerik' | 'Spasial' | 'Kepribadian';
  text: string;
  options: string[];
  correct: number; // Index of correct option (0-3)
  explanation: string;
}

const LECTURE_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Strategi Jitu Menghadapi Psikotes Kecerdasan TNI-POLRI',
    duration: '18:45',
    instructor: 'Psikolog Azta, S.Psi., M.Psi.',
    desc: 'Ulasan taktis mengenai struktur tes kecerdasan verbal, logika aritmatika, jaring-jaring spasial, beserta batas ambang kelolosan (Ambang Batas Nilai 61).',
    videoPlaceholder: 'Video Kuliah Utama #1'
  },
  {
    id: 'vid-2',
    title: 'Kecermatan & Ketahanan Stres (Menguasai Tes Paul/Kraepelin)',
    duration: '22:10',
    instructor: 'Aiptu Budi Susanto, S.Psi. (Mitra Praktisi)',
    desc: 'Teknik menjaga ritme kecepatan, ketelitian, kestabilan emosi, dan menghindari penurunan grafik performa (*Fatigue Curve*) saat tes koran 45 menit.',
    videoPlaceholder: 'Video Kuliah Utama #2'
  },
  {
    id: 'vid-3',
    title: 'Penilaian Sikap Kerja & Kepribadian (EPPS & Tes Menggambar)',
    duration: '15:30',
    instructor: 'Ibu Ratih, M.Psi., Psikolog',
    desc: 'Pembedaan karakter kepemimpinan, kepatuhan, kehati-hatian, serta panduan praktis tes menggambar orang (DAP), pohon (Baum), dan rumah-pohon-orang (HTP).',
    videoPlaceholder: 'Video Kuliah Utama #3'
  }
];

const EXAMPLE_ITEMS = [
  {
    id: 'ex-1',
    category: 'Analogi Verbal (Kecerdasan)',
    question: 'TENTARA : PATRIOTIK = POLISI : ....',
    options: ['A. Senjata', 'B. Pengayom', 'C. Seragam', 'D. Hukum'],
    correctAnswer: 'B. Pengayom',
    explanation: 'Hubungan analogi di atas adalah sifat utama/tugas mulia institusi tersebut. Tentara dituntut memiliki sifat patriotik tinggi dalam mempertahankan negara. Sementara Polisi bertugas utama sebagai pengayom, pelindung, dan pelayan masyarakat.'
  },
  {
    id: 'ex-2',
    category: 'Deret Angka (Kecerdasan)',
    question: 'Lengkapi seri deret angka ini: 2, 4, 8, 14, 22, ....',
    options: ['A. 30', 'B. 32', 'C. 34', 'D. 36'],
    correctAnswer: 'B. 32',
    explanation: 'Pola pertambahan antar angka adalah kelipatan bilangan genap secara berurutan:\n- 2 ke 4 (+2)\n- 4 ke 8 (+4)\n- 8 ke 14 (+6)\n- 14 ke 22 (+8)\n- 22 ke berikutnya (+10) -> 22 + 10 = 32.'
  },
  {
    id: 'ex-3',
    category: 'Sikap Kerja (Kepribadian)',
    question: 'Saat dihadapkan dengan tumpukan berkas laporan warga yang rumit sedangkan jam dinas Anda hampir berakhir, Anda akan:',
    options: [
      'A. Meninggalkannya untuk dikerjakan besok pagi agar tidak telat pulang.',
      'B. Menyortirnya dan menyelesaikan yang paling penting dahulu, lalu sisanya dibawa pulang atau diselesaikan esok hari.',
      'C. Meminta rekan kerja lain yang masih belum mau pulang untuk menyelesaikannya.',
      'D. Berusaha menyelesaikannya semaksimal mungkin hingga tuntas walaupun harus lembur tanpa upah tambahan.'
    ],
    correctAnswer: 'D. Berusaha menyelesaikannya semaksimal mungkin hingga tuntas walaupun harus lembur tanpa upah tambahan.',
    explanation: 'Dalam tes sikap kerja TNI-POLRI, komitmen pelayanan prima (service excellence), ketekunan, rasa tanggung jawab tinggi, dan loyalitas tugas di atas kepentingan pribadi memegang nilai bobot tertinggi (Skala Nilai 4 atau 5).'
  }
];

const CORE_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Verbal',
    text: 'INDIVIDU : KELOMPOK = BINTANG : ....',
    options: ['A. Satelit', 'B. Galaksi', 'C. Angkasa', 'D. Rasi Bintang'],
    correct: 3,
    explanation: 'Hubungan analoginya adalah satuan tunggal dengan kumpulan kesatuan terstruktur. Individu berkumpul membentuk kelompok, bintangi berkumpul membentuk Rasi Bintang.'
  },
  {
    id: 2,
    category: 'Numerik',
    text: 'Jika 3x + 5 = 20, berapakah nilai dari 2x + 1?',
    options: ['A. 11', 'B. 10', 'C. 9', 'D. 8'],
    correct: 0,
    explanation: 'Langkah pengerjaan:\n3x = 20 - 5 => 3x = 15 => x = 5.\nSubstitusikan nilai x ke persamaan kedua: 2x + 1 = 2(5) + 1 = 11.'
  },
  {
    id: 3,
    category: 'Spasial',
    text: 'Pilihlah objek yang tidak termasuk dalam kelompoknya (tidak homogen) secara dimensional:',
    options: ['A. Kubus', 'B. Limas', 'C. Lingkaran', 'D. Tabung'],
    correct: 2,
    explanation: 'Kubus, Limas, dan Tabung merupakan bangun dimensi tiga (memiliki volume/ruang). Sementara Lingkaran adalah bangun dimensi dua yang datar.'
  },
  {
    id: 4,
    category: 'Kepribadian',
    text: 'Dalam melaksanakan perintah atasan yang ternyata bertentangan dengan kebijakan prosedur operasi standar (SOP) pimpinan atas, tindakan terbaik:',
    options: [
      'A. Melaporkan kesalahan atasan tersebut ke divisi provos segera.',
      'B. Melaksanakan peritah tanpa ragu karena prinsip kepatuhan mutlak kaku.',
      'C. Mengingatkan atasan secara santun dan profesional mengenai kesesuaian SOP, serta meminta arahan tertulis tertandatangani.',
      'D. Mogok bertugas dan menolak semua bentuk disposisi pekerjaan.'
    ],
    correct: 2,
    explanation: 'Dalam etika hubungan kerja TNI-POLRI modern, kepatuhan koordinatif dikombinasikan dengan kecerdasan organisasional (menghindari kerugian instansi dengan melaporkan secara santun) adalah atribut ideal.'
  }
];

// 10 Simulation Questions representing standard CAT Entrance Exam
const SIMULATION_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Verbal',
    text: 'SINONIM kata: "ABSOLUT" adalah...',
    options: ['A. Nisbi', 'B. Mutlak', 'C. Sebagian', 'D. Fleksibel'],
    correct: 1,
    explanation: 'Absolut berarti seutuhnya, mutlak, tidak terbatas oleh syarat apa pun.'
  },
  {
    id: 2,
    category: 'Verbal',
    text: 'ANTONIM kata: "KHAS" adalah...',
    options: ['A. Umum', 'B. Khusus', 'C. Spesifik', 'D. Unik'],
    correct: 0,
    explanation: 'Khas menunjukkan karakteristik khusus/spesifik pada hal tertentu, yang lawan katanya adalah Umum.'
  },
  {
    id: 3,
    category: 'Numerik',
    text: 'Lengkapi deret angka ini: 5, 7, 11, 19, 35, ....',
    options: ['A. 51', 'B. 67', 'C. 70', 'D. 75'],
    correct: 1,
    explanation: 'Pola pertambahan: +2, +4, +8, +16. Pertambahan berikutnya adalah +32. Jadi 35 + 32 = 67.'
  },
  {
    id: 4,
    category: 'Numerik',
    text: 'Seorang taruna berlari mengelilingi lapangan dengan kecepatan 12 km/jam selama 45 menit. Berapakah panjang lintasan yang ditempuhnya?',
    options: ['A. 8 km', 'B. 9 km', 'C. 10 km', 'D. 11 km'],
    correct: 1,
    explanation: 'Waktu: 45 menit = 45/60 = 0.75 jam. Jarak = Kecepatan x Waktu = 12 km/jam * 0.75 jam = 9 km.'
  },
  {
    id: 5,
    category: 'Spasial',
    text: 'Jika sebuah kubus transparan diputar 90 derajat ke kanan, lalu dibalik ke atas, manakah sisa jaring yang melambangkan arah sumbu awal?',
    options: ['A. Sumbu X berbalik vertikal', 'B. Sumbu Y konstan mendatar', 'C. Symmetrical rotative', 'D. Semua arah sumbu berputar 180 derajat'],
    correct: 0,
    explanation: 'Rotasi 90 derajat searah jarum jam memindahkan sumbu lateral, lalu inversi vertikal membuat sumbu awal X berbalik mengarah vertikal.'
  },
  {
    id: 6,
    category: 'Spasial',
    text: 'Manakah bangun ruang yang terbentuk jika jaring 2 dimensi berpola T-Folding dilipat melingkar?',
    options: ['A. Tabung silinder', 'B. Kubus simetrik', 'C. Balok asimetrik', 'D. Piramida segitiga'],
    correct: 1,
    explanation: 'Pola salib lipat T (T-Folding) adalah struktur pola jaring-jaring standar pembuat Kubus.'
  },
  {
    id: 7,
    category: 'Kepribadian',
    text: 'Saat melihat rekan sejawat seangkatan dituduh melakukan pelanggaran disiplin yang padahal Anda ketahui ia tidak melakukannya, sikap Anda:',
    options: [
      'A. Diam saja agar tidak terlibat pusaran masalah internal.',
      'B. Memberikan kesaksian jujur dan objektif kepada perwira penyelidik demi tegaknya keadilan korps.',
      'C. Mengajak rekan-rekan lain untuk berdemonstrasi menentang keputusan pimpinan.',
      'D. Menghibur rekan tersebut secara tertutup namun enggan bersuara di depan atasan.'
    ],
    correct: 1,
    explanation: 'Prinsip kejujuran prima, integritas, dan perlindungan kawan yang benar demi kehormatan institusi mutlak diperlukan dalam TNI-POLRI.'
  },
  {
    id: 8,
    category: 'Kepribadian',
    text: 'Bagi saya, loyalitas atau kepatuhan terhadap perintah sah atasan adalah...',
    options: [
      'A. Kewajiban mutlak selama perintah itu tidak melanggar aturan moral dan hukum negara.',
      'B. Sesuatu yang fleksibel tergantung situasi emosi saya.',
      'C. Beban tugas yang berat dan menyebalkan.',
      'D. Alat untuk mencari muka agar cepat mendapatkan promosi kenaikan pangkat.'
    ],
    correct: 0,
    explanation: 'Loyalitas praka/anggota dipandu oleh etika kepatuhan sah berlandaskan Sapta Marga/Tribrata, menjauhkan dari tindakan indisipliner.'
  },
  {
    id: 9,
    category: 'Kepribadian',
    text: 'Tingkat konsistensi saya dalam menyelesaikan tugas fisik berat meskipun cuaca buruk adalah...',
    options: [
      'A. Sangat fluktuatif tergantung kenyamanan cuaca.',
      'B. Tetap fokus berdisiplin tinggi dan pantang menyerah sampai target selesai.',
      'C. Berusaha menyerahkan tugas ke rekan yang lebih kuat.',
      'D. Menunggu cuaca membaik baru melanjutkan walau terlambat.'
    ],
    correct: 1,
    explanation: 'Keteguhan hati, ketangguhan fisik (grit), dan disiplin pantang menyerah mencerminkan mental baja prajurit taruna.'
  },
  {
    id: 10,
    category: 'Verbal',
    text: 'PILIH HUBUNGAN YANG SETARA: "GURU : SEKOLAH" setara dengan...',
    options: ['A. Dokter : Rumah Sakit', 'B. Petani : Traktor', 'C. Pengacara : Hukum', 'D. Nahkoda : Kompas'],
    correct: 0,
    explanation: 'Asosiasi guru bekerja di sekolah mewakili asoasi profesi dengan lokasi dinas resmi yang setara dengan dokter berdinas di Rumah Sakit.'
  }
];

export default function OnlineTraining({ currentUser }: OnlineTrainingProps) {
  // Activity state progress tracking
  const [completedActivities, setCompletedActivities] = useState<string[]>(() => {
    const saved = localStorage.getItem(`azta_progress_${currentUser?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : ['vid-1']; // starts with first video unlocked/done as mockup progress
  });

  const saveProgress = (newProg: string[]) => {
    setCompletedActivities(newProg);
    localStorage.setItem(`azta_progress_${currentUser?.id || 'guest'}`, JSON.stringify(newProg));
  };

  const [activeTab, setActiveTab] = useState<'video' | 'soal' | 'kuis' | 'simulasi'>('video');

  // Video state
  const [playingVideo, setPlayingVideo] = useState<typeof LECTURE_VIDEOS[0] | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const intervalRef = useRef<any>(null);

  // Example solution open state
  const [openExampleId, setOpenExampleId] = useState<string | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Simulator State
  const [simActive, setSimActive] = useState(false);
  const [activeSimQuestion, setActiveSimQuestion] = useState(0);
  const [simAnswers, setSimAnswers] = useState<{ [key: number]: number }>({});
  const [simFlagged, setSimFlagged] = useState<{ [key: number]: boolean }>({});
  const [simTimer, setSimTimer] = useState(900); // 15 mins
  const [simSubmitted, setSimSubmitted] = useState(false);
  const [simResults, setSimResults] = useState<{
    score: number;
    iqCategory: string;
    traits: {
      stability: number;
      academic: number;
      leadership: number;
    };
    recommendation: string;
  } | null>(null);

  // Track timer of simulator
  useEffect(() => {
    let timerId: any;
    if (simActive && !simSubmitted && simTimer > 0) {
      timerId = setInterval(() => {
        setSimTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleFinishSimulator();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [simActive, simSubmitted, simTimer]);

  // Video Playing simulator
  useEffect(() => {
    if (videoIsPlaying) {
      intervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setVideoIsPlaying(false);
            clearInterval(intervalRef.current);
            // Auto-complete video trigger progress
            if (playingVideo && !completedActivities.includes(playingVideo.id)) {
              saveProgress([...completedActivities, playingVideo.id]);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoIsPlaying, playingVideo]);

  // Calculations
  const totalItemsCount = LECTURE_VIDEOS.length + 1 + 1 + 1; // 3 videos + 1 quiz + 1 simulation + examples (grouped as 1 activity total)
  const currentCompletedCount = completedActivities.length;
  const overallProgressPercentage = Math.min(100, Math.floor((currentCompletedCount / totalItemsCount) * 100));

  const selectVideo = (vid: typeof LECTURE_VIDEOS[0]) => {
    setPlayingVideo(vid);
    setVideoProgress(0);
    setVideoIsPlaying(true);
  };

  const handleToggleCompleteVideo = (vidId: string) => {
    let newProg = [];
    if (completedActivities.includes(vidId)) {
      newProg = completedActivities.filter(id => id !== vidId);
    } else {
      newProg = [...completedActivities, vidId];
    }
    saveProgress(newProg);
  };

  // Submit Quick quiz
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    CORE_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[q.id] === q.correct) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (!completedActivities.includes('quiz-general')) {
      saveProgress([...completedActivities, 'quiz-general']);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Simulator Start / Submit
  const handleStartSimulator = () => {
    setSimActive(true);
    setSimSubmitted(false);
    setSimAnswers({});
    setSimFlagged({});
    setSimTimer(900);
    setActiveSimQuestion(0);
    setSimResults(null);
  };

  const handleFinishSimulator = () => {
    let totalScore = 0;
    let verbalCount = 0, numerikCount = 0, spasialCount = 0, kepribadianCount = 0;
    let verbalCorrect = 0, numerikCorrect = 0, spasialCorrect = 0, kepribadianCorrect = 0;

    SIMULATION_QUESTIONS.forEach((q) => {
      const isCorrect = simAnswers[q.id] === q.correct;
      if (q.category === 'Verbal') verbalCount++;
      if (q.category === 'Numerik') numerikCount++;
      if (q.category === 'Spasial') spasialCount++;
      if (q.category === 'Kepribadian') kepribadianCount++;

      if (isCorrect) {
        totalScore += 10;
        if (q.category === 'Verbal') verbalCorrect++;
        if (q.category === 'Numerik') numerikCorrect++;
        if (q.category === 'Spasial') spasialCorrect++;
        if (q.category === 'Kepribadian') kepribadianCorrect++;
      }
    });

    // Diagnostik generator
    let iqCat = 'Sedang / Cukup';
    if (totalScore >= 80) iqCat = 'Superior Tinggi (Sangat Potensial)';
    else if (totalScore >= 60) iqCat = 'Diatas Rata-rata (Potensial)';

    const recText = totalScore >= 70 
      ? 'Selamat! Skor Anda konsisten berada di atas Ambang Batas Taruna (BMS > 61). Pertahankan konsistensi latihan kecermatan angka Pauli Anda agar stabil menghadapi tes asli.'
      : 'E-Learning merekomendasikan Anda mengulang pendalaman materi bab Numerik Praktis dan spasial dimensional. Lakukan analisis kekeliruan jawaban dan pelajari kembali video kuliah utama #1.';

    setSimResults({
      score: totalScore,
      iqCategory: iqCat,
      traits: {
        stability: Math.min(100, 35 + kepribadianCorrect * 20),
        academic: Math.min(100, 20 + (verbalCorrect + numerikCorrect) * 15),
        leadership: Math.min(100, 40 + spasialCorrect * 15)
      },
      recommendation: recText
    });

    setSimSubmitted(true);

    if (!completedActivities.includes('sim-exam')) {
      saveProgress([...completedActivities, 'sim-exam']);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-left" id="online-training-root">
      
      {/* Bento Progress Map Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs" id="progress-course-bento">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Portal E-Learning Interaktif TNI-POLRI</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Dapatkan simulasi CAT modern & bimbingan video penunjang dari mana saja secara online.</p>
          </div>
          
          <div className="bg-slate-50 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center space-x-3 w-full md:w-auto" id="bento-metric-progress">
            <div className="text-center shrink-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-mono">PROGRES BELAJAR</span>
              <span className="text-xl font-black text-emerald-800 leading-none">{overallProgressPercentage}%</span>
            </div>
            <div className="w-full md:w-36 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 font-mono shrink-0">{currentCompletedCount}/{totalItemsCount} Modul</span>
          </div>
        </div>

        {/* Dynamic Horizontal Navigator Tab for E-learning Subcategories */}
        <div className="grid grid-cols-4 gap-2 mt-6 border-t border-gray-100 pt-4" id="elearning-subtab-navigator">
          <button
            onClick={() => { setActiveTab('video'); if (simActive && !simSubmitted) setSimActive(false); }}
            className={`py-3 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
              activeTab === 'video' 
                ? 'bg-slate-905 border-slate-900 text-white shadow-xs' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-55'
            }`}
          >
            <Tv className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Penjelasan Video</span>
            <span className="sm:hidden">Video</span>
          </button>

          <button
            onClick={() => { setActiveTab('soal'); if (simActive && !simSubmitted) setSimActive(false); }}
            className={`py-3 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
              activeTab === 'soal' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-55'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Pembahasan Soal</span>
            <span className="sm:hidden">Soal</span>
          </button>

          <button
            onClick={() => { setActiveTab('kuis'); if (simActive && !simSubmitted) setSimActive(false); }}
            className={`py-3 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
              activeTab === 'kuis' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-55'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Kuis Pemahaman</span>
            <span className="sm:hidden">Kuis</span>
          </button>

          <button
            onClick={() => { setActiveTab('simulasi'); }}
            className={`py-3 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
              activeTab === 'simulasi' 
                ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-850 hover:bg-emerald-100'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Simulasi CAT Ujian</span>
            <span className="sm:hidden">CAT Ujian</span>
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: PENEJELASAN VIDEO */}
      {activeTab === 'video' && (
        <div className="space-y-6 animate-fade-in" id="content-elearning-videos">
          
          {/* Interactive Player view */}
          {playingVideo && (
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 text-white text-left shadow-2xl relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-4 right-4 text-[10px] bg-red-650/80 px-2 py-0.5 rounded font-mono font-black animate-pulse">
                • SEDANG DIPUTAR (KULIAH ONLINE)
              </div>

              {/* Simulated visual player container */}
              <div className="w-full aspect-video bg-gradient-to-tr from-emerald-990 via-slate-900 to-emerald-950 rounded-2xl flex flex-col justify-between p-6 border border-white/10 relative overflow-hidden group">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Activity className="w-3.5 h-3.5 animate-bounce" />
                  <span className="text-[10px] font-black font-mono tracking-wider">SIPSS / AKPOL CADET TRAINING NETWORK</span>
                </div>

                <div className="mx-auto flex flex-col items-center text-center max-w-sm space-y-3">
                  <div 
                    onClick={() => setVideoIsPlaying(!videoIsPlaying)}
                    className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 flex items-center justify-center shadow-lg transform active:scale-95 transition-all cursor-pointer"
                  >
                    {videoIsPlaying ? (
                      <div className="flex space-x-1.5 justify-center items-center">
                        <div className="w-1.5 h-6 bg-emerald-950 rounded" />
                        <div className="w-1.5 h-6 bg-emerald-950 rounded" />
                      </div>
                    ) : (
                      <Play className="w-7 h-7 fill-emerald-950 stroke-none ml-1" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white">{playingVideo.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Dosen Pengampu: {playingVideo.instructor}</p>
                  </div>
                </div>

                {/* Subtitle / Streaming text bar */}
                <div className="w-full bg-slate-900/90 border border-white/5 p-2 rounded-xl text-center">
                  <p className="text-[10px] text-amber-300 italic">
                    {videoProgress < 20 && "Langkah pertama merancang peta belajar kognitif..."}
                    {videoProgress >= 20 && videoProgress < 50 && "Kecepatan tes Kraepelin dipengaruhi oleh asupan oksigen otak..."}
                    {videoProgress >= 50 && videoProgress < 80 && "Skala kepatuhan harus sejalan dengan norma profesionalisme kepolisian..."}
                    {videoProgress >= 80 && videoProgress < 100 && "Tandai jawaban krusial dengan memetakan core values..."}
                    {videoProgress >= 100 && "Silakan tandai selesai untuk melacak kemajuan kurikulum!"}
                  </p>
                  
                  {/* Timeline progress line */}
                  <div className="w-full bg-gray-800 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-1 transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lecture Description text below video player */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm sm:text-base text-white">{playingVideo.title}</h3>
                <p className="text-[11px] text-emerald-200 leading-relaxed max-w-2xl">{playingVideo.desc}</p>
                
                <div className="flex flex-wrap gap-4 pt-3 text-[10px] text-gray-450 font-mono">
                  <span>⏱️ Durasi: {playingVideo.duration} Menit</span>
                  <span>🎓 Pengajar: {playingVideo.instructor}</span>
                  <button
                    onClick={() => handleToggleCompleteVideo(playingVideo.id)}
                    className={`ml-auto px-3.5 py-1 text-[10px] uppercase font-black tracking-wider rounded-lg border transition-all ${
                      completedActivities.includes(playingVideo.id)
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-350'
                        : 'bg-amber-400 hover:bg-amber-500 text-emerald-950 border-amber-400'
                    }`}
                  >
                    {completedActivities.includes(playingVideo.id) ? '✓ Selesai Dipelajari' : 'Tandai Selesai'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Videos catalog list cards layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="video-catalog-list">
            {LECTURE_VIDEOS.map((vid, idx) => {
              const isCompleted = completedActivities.includes(vid.id);
              const isCurrentlyPlaying = playingVideo?.id === vid.id;
              return (
                <div 
                  key={vid.id}
                  className={`bg-white border rounded-2xl p-5 text-left flex flex-col justify-between transition-all ${
                    isCurrentlyPlaying 
                      ? 'border-emerald-700 ring-2 ring-emerald-100' 
                      : 'border-gray-150 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">MATERI KULIAH 0{idx+1}</span>
                      {isCompleted && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-bold font-mono uppercase flex items-center space-x-0.5">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>SUDAH</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-850 line-clamp-2">{vid.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{vid.desc}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>⏱️ {vid.duration} m</span>
                    <button
                      onClick={() => selectVideo(vid)}
                      className="px-3 py-1 bg-slate-900 text-white rounded-lg hover:bg-emerald-800 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      {isCurrentlyPlaying ? 'Putar Ulang' : 'Buka & Tonton'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: CONTOH SOAL & PEMBAHASAN */}
      {activeTab === 'soal' && (
        <div className="space-y-4 animate-fade-in" id="content-elearning-examples">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
            <h3 className="font-sans font-extrabold text-base text-slate-950 mb-1">
              Bank Contoh Soal & Rumus Pembahasan Psikotes TNI-POLRI
            </h3>
            <p className="text-xs text-gray-400 mb-6">Pahami alur logika pembuat soal psikotes untuk mempermudah pengerjaan dalam sesi CAT sesungguhnya.</p>

            <div className="space-y-4">
              {EXAMPLE_ITEMS.map((ex) => {
                const isOpen = openExampleId === ex.id;
                return (
                  <div 
                    key={ex.id}
                    className="border border-gray-150 rounded-2xl overflow-hidden text-left bg-slate-50/40"
                  >
                    {/* Header trigger bar */}
                    <div 
                      onClick={() => setOpenExampleId(isOpen ? null : ex.id)}
                      className="p-4 bg-white hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-100"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-mono text-[8px] font-black uppercase tracking-wider">{ex.category}</span>
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-900">{ex.question}</h4>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-800 underline block shrink-0 ml-4">
                        {isOpen ? 'Tutup Solusi' : 'Lihat Solusi'}
                      </span>
                    </div>

                    {/* Expandable answers body info */}
                    {isOpen && (
                      <div className="p-4 bg-emerald-50/20 text-xs text-slate-800 space-y-3 animate-slide-down">
                        <div>
                          <p className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono">PILIHAN JAWABAN:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                            {ex.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx} 
                                className={`p-2 rounded-lg border text-[11px] font-semibold ${
                                  opt === ex.correctAnswer 
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-extrabold' 
                                    : 'bg-white border-gray-150 text-gray-500'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-dashed border-gray-250">
                          <p className="font-black text-xs text-emerald-900 flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Jawaban Benar: <strong>{ex.correctAnswer}</strong></span>
                          </p>
                          <p className="text-[11px] text-gray-600 leading-relaxed mt-2 whitespace-pre-line bg-white p-3 rounded-xl border border-gray-150 font-sans">
                            {ex.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: KUIS SINGKAT PEMAHAMAN */}
      {activeTab === 'kuis' && (
        <div className="space-y-4 animate-fade-in" id="content-elearning-quiz">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
            
            {/* Header section or summary */}
            {!quizSubmitted ? (
              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                <div>
                  <h3 className="font-sans font-extrabold text-base text-slate-900">
                    Kuis Psikotes Cepat (Evaluasi Karakter)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Uji pemahaman Anda dari video materi kuliah untuk menguji kecepatan menjawab.</p>
                </div>

                <div className="space-y-5">
                  {CORE_QUIZ_QUESTIONS.map((q, qIdx) => (
                    <div key={q.id} className="p-5 border border-gray-150 rounded-2xl bg-slate-50/50">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded font-mono font-black text-[8px] uppercase tracking-wider">{q.category}</span>
                        <span className="text-[10px] text-gray-400 font-bold font-mono">SOAL NO. 0{qIdx+1}</span>
                      </div>
                      
                      <h4 className="font-sans font-extrabold text-xs sm:text-sm text-slate-950 mt-2 mb-3">{q.text}</h4>
                      
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label 
                            key={oIdx}
                            className={`flex items-center space-x-3 p-3 border rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              quizAnswers[q.id] === oIdx 
                                ? 'border-rose-900 bg-rose-50/40 text-rose-950 font-bold' 
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-gray-650'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-cat-${q.id}`}
                              checked={quizAnswers[q.id] === oIdx}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                              className="text-rose-900"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={Object.keys(quizAnswers).length < CORE_QUIZ_QUESTIONS.length}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white disabled:bg-gray-300 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                  >
                    Kirim Jawaban Kuis
                  </button>
                </div>
              </form>
            ) : (
              // Quiz scorecard screen
              <div className="py-6 text-center space-y-6 max-w-md mx-auto" id="quiz-scorecard-reports">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 border border-rose-200 shadow-inner">
                  <Award className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-black text-xl text-slate-900">Hasil Analisis Kuis Anda!</h3>
                  <p className="text-xs text-gray-400">Terima kasih telah berpartisipasi dalam modul diagnosis cepat.</p>
                </div>

                {/* Score badge metrics */}
                <div className="bg-slate-50 border border-gray-200 p-5 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 block font-mono">SKOR AKHIR</span>
                  <span className="text-4xl font-extrabold text-rose-800 block mt-1">{(quizScore / CORE_QUIZ_QUESTIONS.length) * 100}%</span>
                  <p className="mt-2 text-xs font-bold text-emerald-850">{quizScore} dari {CORE_QUIZ_QUESTIONS.length} Pertanyaan Terjawab Benar.</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-left">
                  <p className="text-xs font-bold text-slate-950">Ulasan Jawaban & Pembahasan Kuis:</p>
                  <div className="space-y-3">
                    {CORE_QUIZ_QUESTIONS.map((q, idx) => {
                      const userAns = quizAnswers[q.id];
                      const isCorrect = userAns === q.correct;
                      return (
                        <div key={q.id} className="p-3.5 border rounded-xl bg-slate-50 text-[11px] leading-relaxed">
                          <p className="font-bold flex items-center space-x-1.5 text-slate-900">
                            <span className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                              {isCorrect ? '✓' : '✗'} Soal {idx+1}: {isCorrect ? 'Benar' : 'Salah'}
                            </span>
                          </p>
                          <p className="text-gray-450 mt-1 font-medium italic">"{q.text}"</p>
                          <p className="text-gray-600 mt-1 font-mono uppercase text-[9px] text-emerald-900 font-extrabold mt-2">
                            Pilihan Benar: <strong>{q.options[q.correct]}</strong>
                          </p>
                          <p className="text-gray-500 mt-1 bg-white p-2.5 rounded border border-gray-150 leading-relaxed text-[10px]">
                            {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Pengerjaan Kuis</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SUB-SECTION 4: SIMULASI TES SEKOLAH / CAT SEKOLAH */}
      {activeTab === 'simulasi' && (
        <div className="space-y-4 animate-fade-in" id="content-elearning-simulation">
          
          {/* Dashboard menu before simulator starts */}
          {!simActive && !simSubmitted && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-800 border-2 border-emerald-250 shadow-inner">
                <Activity className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="font-sans font-extrabold text-lg text-slate-950">
                  Ujian Simulasi Akademik & Psikotes (CAT Mode)
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Menyajikan 10 bundel soal pilihan ganda dinamis. Sistem ini melacak waktu pengerjaan secara mundur layaknya ujian sesungguhnya di Mabes Polri atau Mabes TNI.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 text-left max-w-sm mx-auto border border-gray-200 space-y-3 text-xs" id="simulation-instructions-card">
                <p className="font-bold text-slate-900 border-b border-gray-100 pb-2 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Petunjuk Penting Simulasi:</span>
                </p>
                <ul className="space-y-2 text-gray-550 list-disc list-inside leading-loose text-[11px] font-medium">
                  <li>Alokasi Waktu: <strong>15 Menit</strong> (Hitung Mundur).</li>
                  <li>Total Soal: <strong>10 Poin Deskriptif</strong>.</li>
                  <li>Metode: Sistem CAT Berstandar Nasional.</li>
                  <li>Fitur: Penanda Ragu-Ragu (Flag for review).</li>
                  <li>Penilaian: Ambal Nilai Minimal Kelolosan (Nilai 61).</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartSimulator}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5 cursor-pointer animate-pulse"
                >
                  <span>Mulai Simulasi CAT Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Active computer-assisted dynamic test view layout */}
          {simActive && !simSubmitted && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="electronic-cat-desk">
              
              {/* Question Screen Main Box Left Side Column */}
              <div className="lg:col-span-9 bg-white border border-gray-150 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left min-h-[420px]">
                
                {/* Active index banner header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded-[4px] font-mono font-black text-[9px] uppercase tracking-wider">
                      {SIMULATION_QUESTIONS[activeSimQuestion].category}
                    </span>
                    <span className="text-xs text-gray-400 font-bold font-mono">PERTANYAAN {activeSimQuestion + 1} dari {SIMULATION_QUESTIONS.length}</span>
                  </div>

                  <label className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600 block cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!simFlagged[SIMULATION_QUESTIONS[activeSimQuestion].id]}
                      onChange={(e) => setSimFlagged(prev => ({ 
                        ...prev, 
                        [SIMULATION_QUESTIONS[activeSimQuestion].id]: e.target.checked 
                      }))}
                      className="text-amber-505"
                    />
                    <Flag className="w-3.5 h-3.5" />
                    <span>Tandai Ragu-Ragu</span>
                  </label>
                </div>

                {/* Question Texts */}
                <div className="my-auto space-y-4">
                  <h4 className="font-sans font-black text-xs sm:text-sm text-slate-950 leading-relaxed">
                    {SIMULATION_QUESTIONS[activeSimQuestion].text}
                  </h4>

                  <div className="space-y-2">
                    {SIMULATION_QUESTIONS[activeSimQuestion].options.map((opt, optIdx) => {
                      const qId = SIMULATION_QUESTIONS[activeSimQuestion].id;
                      const isSelected = simAnswers[qId] === optIdx;
                      return (
                        <label
                          key={optIdx}
                          className={`flex items-center space-x-3.5 p-3.5 border rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-emerald-700 bg-emerald-50/60 font-bold text-emerald-990 ring-2 ring-emerald-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-slate-50 bg-white text-gray-650'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`sim-q-input-${qId}`}
                            checked={isSelected}
                            onChange={() => setSimAnswers(prev => ({ ...prev, [qId]: optIdx }))}
                            className="text-emerald-800"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer buttons control navigation */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-6">
                  <button
                    disabled={activeSimQuestion === 0}
                    onClick={() => setActiveSimQuestion(prev => prev - 1)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg disabled:opacity-40 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={() => handleFinishSimulator()}
                    className="px-4 py-2 bg-rose-900 text-white font-bold text-xs hover:bg-rose-950 rounded-lg transition-all cursor-pointer shadow-xs font-mono uppercase tracking-wider"
                  >
                    Akhiri & Kumpulkan CAT
                  </button>

                  <button
                    disabled={activeSimQuestion === SIMULATION_QUESTIONS.length - 1}
                    onClick={() => setActiveSimQuestion(prev => prev + 1)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Lanjut</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sidebar Clock Timer & Navigate Indicators Center Right Column */}
              <div className="lg:col-span-3 space-y-4" id="cat-indicator-sidebar">
                
                {/* Timer Clock pane */}
                <div className="bg-slate-900 border border-slate-900 rounded-3xl p-5 text-white text-center shadow-xs">
                  <span className="text-[9px] font-black tracking-widest text-emerald-400 block font-mono">SISA WAKTU DETEKTIF</span>
                  <span className="text-3xl font-extrabold font-mono mt-1 block tracking-wider animate-pulse text-amber-400">
                    {formatTimer(simTimer)}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">Kecepatan adalah ketepatan aksi</p>
                </div>

                {/* grid coordinate mapping box */}
                <div className="bg-white border border-gray-150 rounded-3xl p-5 text-left shadow-xs">
                  <h4 className="font-bold text-xs text-slate-905 mb-3">Navigasi Soal (Grid)</h4>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {SIMULATION_QUESTIONS.map((q, idx) => {
                      const isAnswered = simAnswers[q.id] !== undefined;
                      const isFlagged = simFlagged[q.id];
                      const isActive = activeSimQuestion === idx;
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setActiveSimQuestion(idx)}
                          className={`w-10 h-10 rounded-xl font-bold font-mono text-xs flex items-center justify-center border transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-emerald-800 text-white border-emerald-800' 
                              : isFlagged 
                              ? 'bg-amber-400 text-emerald-990 border-amber-300' 
                              : isAnswered 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-250' 
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-[9px] font-bold text-gray-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-800 block" />
                      <span>Aktif</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-200 block" />
                      <span>Selesai</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded bg-amber-400 block" />
                      <span>Ragu</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION END SCORE Diagnostik metrics */}
          {simSubmitted && simResults && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-left space-y-6" id="sim-report-score">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                <div>
                  <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle className="w-5 h-5 text-emerald-800" />
                    <span>Laporan Hasil Diagnostik Komputerisasi CAT</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Status kebugaran akademis Anda untuk seleksi pra-praja TNI-POLRI.</p>
                </div>

                <button
                  onClick={handleStartSimulator}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ml-auto shrink-0"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Coba Ulang Simulasi</span>
                </button>
              </div>

              {/* Score charts summaries columns card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-scoringboard">
                
                {/* Score badge big metrics */}
                <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-5 text-white text-center flex flex-col justify-center relative overflow-hidden h-44 shadow-lg border border-amber-300">
                  <span className="text-[10px] tracking-widest text-emerald-300 font-extrabold font-mono uppercase block">SKOR SIMULASI CAT</span>
                  <span className="text-5xl font-black text-white mt-1 block font-sans tracking-wide">{simResults.score} <span className="text-sm font-bold text-gray-300">/ 100</span></span>
                  <span className="text-[10px] font-black text-amber-300 bg-emerald-990/60 px-3 py-1 rounded-full inline-block mx-auto mt-2.5 border border-amber-400/20 font-mono">
                    Ambang Batas Kelulusan: 61
                  </span>
                </div>

                {/* IQ Conversion block info */}
                <div className="bg-slate-50 border border-gray-200 p-5 rounded-3xl text-left flex flex-col justify-center h-44 min-w-0">
                  <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">IQ KATEGORI EQUIVALEN</span>
                  <p className="text-sm font-extrabold text-slate-950 mt-1 leading-snug">{simResults.iqCategory}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-2 font-medium">Berdasarkan rasio akurasi konseptual verbal analogi, deduksi pola, serta pemecahan deret angka kuantitatif berjenjang.</p>
                </div>

                {/* Trait breakdown panel */}
                <div className="bg-slate-50 border border-gray-200 p-5 rounded-3xl text-left space-y-3 flex flex-col justify-center h-44 min-w-0" id="trait-progressbars">
                  <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">PEMETAAN KARAKTER PSIKOLOGIS</span>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 block mb-0.5">
                        <span>Ketahanan Stres / Stabilitas</span>
                        <span>{simResults.traits.stability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full">
                        <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${simResults.traits.stability}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 block mb-0.5">
                        <span>Kepemimpinan / Penyesuaian</span>
                        <span>{simResults.traits.leadership}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${simResults.traits.leadership}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations detailed analysis card block */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide font-mono">SARAN BIMBINGAN SPESIAL (AI):</h4>
                <p className="text-[11px] text-emerald-850 leading-relaxed font-semibold italic">{simResults.recommendation}</p>
              </div>

              {/* Answers keys breakdown list */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-extrabold text-xs text-slate-905">Detail Kunci Jawaban & Pembahasan Detektif:</h4>
                <div className="space-y-3">
                  {SIMULATION_QUESTIONS.map((q, idx) => {
                    const studentAnsIdx = simAnswers[q.id];
                    const isCorrect = studentAnsIdx === q.correct;
                    return (
                      <div key={idx} className="p-4 border border-gray-200 rounded-2xl text-[11px] leading-relaxed bg-slate-50/40">
                        <div className="flex justify-between items-center">
                          <p className="font-extrabold text-slate-950">Soal {idx+1}: {q.category} Test</p>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-center font-mono ${
                            isCorrect ? 'bg-emerald-100 text-emerald-850' : 'bg-rose-100 text-rose-850'
                          }`}>
                            {isCorrect ? '✓ Benar' : '✗ Salah'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{q.text}</p>
                        
                        <div className="flex flex-wrap gap-x-4 mt-2 font-mono text-[9px] text-emerald-900 font-bold">
                          <span>Jawaban Anda: {studentAnsIdx !== undefined ? q.options[studentAnsIdx] : 'Belum Dijawab'}</span>
                          <span>|</span>
                          <span>Terbaik: {q.options[q.correct]}</span>
                        </div>

                        <p className="mt-2 text-[10px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-150 leading-relaxed font-sans font-medium whitespace-pre-line">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
