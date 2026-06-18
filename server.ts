import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined. Please add it to your Settings > Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.post('/api/tanya-ai', async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      console.warn('Gemini client failed to load:', err.message);
      // Fallback response when key is missing, so users can test with beautiful mock responses
      res.status(200).json({
        text: `**[MOCK REKONSELMEN AI]**\n\nHalo dari AI Konselor Azta!\n\nSepertinya kunci **GEMINI_API_KEY** belum dikonfigurasi pada menu **Settings > Secrets**. \n\nNamun, sebagai panduan sementara untuk seleksi TNI-POLRI:\n1. **Tes Psikotes** berfokus pada stabilitas emosi, ketahanan stres, dan kecerdasan logis.\n2. **Saran Belajar**: Berlatihlah secara rutin untuk tes Pauli/Kraepelin (tes koran) untuk melatih konsistensi dan kecepatan kerja Anda.\n3. **Kesehatan Mental**: Kelola kecemasan menjelang ujian dengan teknik pernapasan kotak (*box breathing*).\n\n*Silakan masukkan kunci GEMINI_API_KEY Anda di panel kontrol rahasia agar AI dapat memberikan jawaban kustom dinamis secara real-time!*`,
        isMock: true
      });
      return;
    }

    // Adapt structured chat history if provided
    const formattedContents = [];
    
    // Add system instruction as role / instructions
    const systemInstruction = 
      "Anda adalah AI Konselor, Pembimbing, dan Praktisi Psikologi khusus di Bimbel Azta Best Choice Counseling & Psychology (Madiun, Indonesia). " +
      "Tugas Anda adalah memandu siswa yang sedang mempersiapkan diri untuk Seleksi TNI (Taruna, Bintara, Tamtama), Seleksi POLRI (AKPOL, Bintara, SIPSS), BUMN, atau PTN. " +
      "Berikan jawaban yang sangat suportif, informatif, mendalam, dan taktis dalam bahasa Indonesia yang ramah namun tetap formal dan berwibawa. " +
      "Fokus pada tips psikotes (verbal, numerik, kecermatan, kepribadian seperti EPPS, Pauli, Kraepelin, DAP, HTP, Wartegg), penjadwalan fisik, kesiapan mental, resolusi kecemasan, dan simulasi akademik. " +
      "Selalu selipkan motivasi bernada patriotik, disiplin, dan profesionalitas.";

    // Generate response using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    res.json({
      text: response.text,
      isMock: false
    });
  } catch (error: any) {
    console.error('Error contacting Gemini:', error);
    res.status(500).json({ 
      error: 'Terjadi masalah saat berkomunikasi dengan AI.', 
      details: error.message 
    });
  }
});

// Notifications Simulation Memory Database
let notificationSettings = {
  enableAutomatedEmail: true,
  enableAutomatedSms: true,
  emailSenderName: 'Azta Best Choice Madiun',
  emailApiKey: 'SG.AztaSecretApiKeyPlaceholder34928347',
  smsSenderId: 'AZTA_INFO',
  smsApiKey: 'TXT-AZTA-KEY-9231804712497',
  notifyOnBookingTimesBeforeHours: 24,
  notifyOnDeadlineDaysBefore: 3
};

let notificationLogs: any[] = [
  {
    id: 'notif-log-1',
    recipientName: 'Dimas Anggara',
    recipientContact: 'dimas@gmail.com',
    type: 'counseling_reminder',
    channel: 'email',
    title: '⏰ Pengingat Sesi Konseling Psikologis Anda',
    message: 'Halo Dimas Anggara, ini adalah pengingat sesi konseling psikologi TNI-POLRI Anda yang terjadwal besok pukul 09:00 WIB bersama Tim Segenap Psikolog Azta.',
    status: 'sent',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
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
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
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
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

// Notifications endpoints
app.get('/api/notifications/settings', (req, res) => {
  res.json(notificationSettings);
});

app.post('/api/notifications/settings', (req, res) => {
  notificationSettings = { ...notificationSettings, ...req.body };
  res.json({ success: true, settings: notificationSettings });
});

app.get('/api/notifications/logs', (req, res) => {
  res.json(notificationLogs);
});

app.post('/api/notifications/clear-logs', (req, res) => {
  notificationLogs = [];
  res.json({ success: true });
});

app.post('/api/notifications/send', (req, res) => {
  const { recipientName, recipientContact, type, channel, title, message } = req.body;
  if (!recipientName || !recipientContact || !title || !message) {
    res.status(400).json({ error: 'Parameter nama penerima, kontak, judul, dan isi pesan wajib diisi!' });
    return;
  }
  const newLog = {
    id: `notif-log-${Date.now()}`,
    recipientName,
    recipientContact,
    type: type || 'manual',
    channel: channel || 'email',
    title,
    message,
    status: 'sent',
    timestamp: new Date().toISOString()
  };
  notificationLogs.unshift(newLog);
  res.json({ success: true, log: newLog });
});

app.post('/api/notifications/trigger-auto', (req, res) => {
  const { registrations, sessions, articles } = req.body;
  const triggered: any[] = [];
  
  // 1. Scan counseling sessions (with Status = booked)
  if (Array.isArray(sessions)) {
    sessions.forEach(session => {
      if (session.status === 'booked' || session.status === 'scheduled') {
        const alreadyExists = notificationLogs.some(log => 
          log.recipientName === session.studentName && 
          log.type === 'counseling_reminder' &&
          log.message.includes(session.date)
        );
        
        if (!alreadyExists) {
          const channel = notificationSettings.enableAutomatedEmail ? 'email' : 'sms';
          const contact = channel === 'email' ? `${session.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com` : '081234567xxx';
          
          const log = {
            id: `notif-log-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            recipientName: session.studentName,
            recipientContact: contact,
            type: 'counseling_reminder',
            channel: channel,
            title: `⏰ Pengingat Sesi Konseling Psikologis: ${session.date}`,
            message: `Halo ${session.studentName}, ini adalah pesan otomatis dari Azta Best Choice. Sesi konseling psikologi Anda dijadwalkan pada ${session.date} pukul ${session.time} bersama Dr. ${session.psychologistName}. Mohon hadir tepat waktu.`,
            status: 'sent',
            timestamp: new Date().toISOString()
          };
          notificationLogs.unshift(log);
          triggered.push(log);
        }
      }
    });
  }

  // 2. Scan registrations coming up
  if (Array.isArray(registrations)) {
    registrations.forEach(reg => {
      if (reg.status === 'pending' || reg.paymentStatus === 'unpaid' || reg.paymentStatus === 'pending_verification') {
        const alreadyExists = notificationLogs.some(log => 
          log.recipientName === reg.studentName && 
          log.type === 'registration_deadline' &&
          log.message.includes(reg.programName)
        );
        
        if (!alreadyExists) {
          const channel = notificationSettings.enableAutomatedSms ? 'sms' : 'email';
          const contact = channel === 'sms' ? '081234567xxx' : `${reg.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
          
          const log = {
            id: `notif-log-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            recipientName: reg.studentName,
            recipientContact: contact,
            type: 'registration_deadline',
            channel: channel,
            title: `⚠️ Pengingat Pembayaran & Registrasi: ${reg.programName}`,
            message: `Halo ${reg.studentName}, kelengkapan administrasi Anda untuk bimbingan ${reg.programName} mendekati tenggat waktu seleksi. Mohon segera laksanakan verifikasi pembayaran (Status: ${reg.paymentStatus}).`,
            status: 'sent',
            timestamp: new Date().toISOString()
          };
          notificationLogs.unshift(log);
          triggered.push(log);
        }
      }
    });
  }

  // 3. Scan newest articles
  if (Array.isArray(articles) && articles.length > 0) {
    const newestArticle = articles[0];
    const alreadyExists = notificationLogs.some(log => 
      log.type === 'article_update' &&
      log.title.includes(newestArticle.title)
    );

    if (!alreadyExists) {
      const log = {
        id: `notif-log-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientName: 'Mailing List Azta',
        recipientContact: 'semua-siswa@azta-madiun.web.id',
        type: 'article_update',
        channel: 'email',
        title: `📚 Info Seleksi Terbit: ${newestArticle.title}`,
        message: `Kabar gembira! Artikel bimbingan / informasi seleksi terbaru telah terbit: "${newestArticle.title}". Kategori: ${newestArticle.category}. Silakan login ke portal siswa Anda untuk membaca ulasan lengkapnya.`,
        status: 'sent',
        timestamp: new Date().toISOString()
      };
      notificationLogs.unshift(log);
      triggered.push(log);
    }
  }

  res.json({ success: true, triggeredCount: triggered.length, triggered });
});

// Setup Vite/Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
