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
