import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Copy, 
  CheckCircle, 
  Lock, 
  Smartphone, 
  QrCode, 
  Loader2, 
  Download, 
  ChevronRight, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';

interface AztaPayGatewayProps {
  amount: number;
  title: string;
  transactionId: string;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentMethod: string, payType?: string) => void;
  onClose: () => void;
  payType?: 'full' | 'dp' | 'pelunasan';
}

type PaymentMethod = 'qris' | 'va_bca' | 'va_mandiri' | 'va_bni' | 'va_bri' | 'gopay' | 'ovo' | 'dana' | 'card';

export default function AztaPayGateway({
  amount,
  title,
  transactionId,
  customerName,
  customerPhone,
  onSuccess,
  onClose,
  payType = 'full'
}: AztaPayGatewayProps) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<'select' | 'pay' | 'processing' | 'success'>('select');
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(299); // 5 minutes standard for live simulations
  const [phoneNumber, setPhoneNumber] = useState(customerPhone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName || '');
  const [isCardBack, setIsCardBack] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);

  // Sound/Vibration effects simulation
  const playInteractionSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignored if browser security blocks immediate audio
    }
  };

  useEffect(() => {
    if (step === 'pay' && method === 'qris') {
      const interval = setInterval(() => {
        setTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, method]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    playInteractionSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    playInteractionSound();
    setMethod(m);
    setStep('pay');
  };

  const startPaymentProcessing = () => {
    playInteractionSound();
    setStep('processing');
    setCurrentLogIdx(0);
    const logs = [
      'Menghubungkan ke API Bank Indonesia / GPN...',
      'Membuat token enkripsi aman SSL 256-bit...',
      'Memverifikasi saldo & otorisasi gerbang...',
      'Sinkronisasi ledger pendaftaran Azta Best Choice...',
      'Pembayaran Berhasil! Mengeluarkan kuitansi PDF...'
    ];
    setProcessLogs(logs);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < logs.length) {
        setCurrentLogIdx(idx);
      } else {
        clearInterval(interval);
        setStep('success');
      }
    }, 1200);
  };

  const trigger3DSecureOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      alert('Nomor kartu harus berisi 16 digit.');
      return;
    }
    if (cardExpiry.length < 5) {
      alert('Isi tanggal kedaluwarsa dengan benar (MM/YY).');
      return;
    }
    if (cardCVV.length < 3) {
      alert('Isi CVV kartu 3 digit belakang.');
      return;
    }
    playInteractionSound();
    setOtpSent(true);
  };

  const verifyOTPAndPay = () => {
    if (otpCode === '123456' || otpCode === '888888' || otpCode.length >= 4) {
      startPaymentProcessing();
    } else {
      setOtpError('Kode OTP salah. Silakan coba: 123456');
    }
  };

  const getVANumber = () => {
    const map: Record<string, string> = {
      va_bca: '82410',
      va_mandiri: '90038',
      va_bni: '82740',
      va_bri: '10290'
    };
    const prefix = map[method || 'va_bca'] || '82410';
    // Use customer's phone or fallback to secure numbering
    const rawNum = phoneNumber.replace(/[^0-9]/g, '');
    const cleanNum = rawNum.length > 5 ? rawNum.slice(-9) : '857321045';
    return `${prefix}${cleanNum}`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4 z-100 animate-fade-in" id="azta-pay-gateway-overlay">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_50px_rgba(4,47,46,0.25)] border border-emerald-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* UPPER CAP: Secure Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-300 animate-pulse" />
            <div>
              <h2 className="font-display font-extrabold text-xs uppercase tracking-wider text-emerald-100 leading-none">Azta Secure Checkout</h2>
              <p className="text-[9px] text-emerald-250 font-mono mt-1">ID: {transactionId}</p>
            </div>
          </div>
          
          <span className="px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-[9px] font-mono uppercase font-black text-amber-300">
            SSL SECURE
          </span>
        </div>

        {/* PRICE SUMMARY OVERVIEW PANEL */}
        <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block font-mono">PEMBAYARAN UNTUK:</span>
            <p className="text-xs font-black text-slate-800 line-clamp-1 mt-0.5">{title}</p>
            <p className="text-[10px] text-slate-500 font-bold font-mono mt-0.5 uppercase">PELANGGAN: {customerName} ({payType === 'dp' ? 'DP 30%' : payType === 'pelunasan' ? 'Pelunasan' : 'Penuh'})</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block font-mono">TOTAL TAGIHAN:</span>
            <p className="text-sm font-extrabold text-emerald-900 font-mono mt-0.5">Rp{amount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* CONTAINER SCROLL: Steps contents */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700">
          
          {/* STEP 1: CHOOSE BANK/METHOD */}
          {step === 'select' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-600">Pilih Metode Pembayaran Elektronik Dibawah ini:</p>
                <p className="text-[10px] text-gray-400 mt-1">Kerjasama resmi dengan Bank Indonesia & Gerbang Pembayaran Nasional</p>
              </div>

              {/* 1. QRIS */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block font-mono">A. Kode Pintar QRIS (Instant & Otomatis)</span>
                <button
                  onClick={() => handleMethodSelect('qris')}
                  className="w-full p-4 border border-emerald-150 hover:border-emerald-500 rounded-2xl bg-emerald-50/20 flex items-center justify-between text-left group transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                      <QrCode className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">Gopay / ShopeePay / OVO / DANA</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Scan kode QR langsung dari HP Anda. Terbaca lunas 0.5 detik.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 2. BANK TRANSFER VIRTUAL ACCOUNTS */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-teal-800 uppercase tracking-widest block font-mono">B. Virtual Account Transfer (Konfirmasi Otomatis)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMethodSelect('va_bca')}
                    className="p-3 border border-gray-200 hover:border-emerald-500 rounded-xl bg-white hover:bg-emerald-50/20 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-extrabold text-sky-850">BCA <span className="text-[9px] font-medium text-slate-500 block">Virtual Account</span></span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect('va_mandiri')}
                    className="p-3 border border-gray-200 hover:border-emerald-500 rounded-xl bg-white hover:bg-emerald-50/20 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-extrabold text-amber-750">MANDIRI <span className="text-[9px] font-medium text-slate-500 block">Mandiri EasyPay</span></span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect('va_bni')}
                    className="p-3 border border-gray-200 hover:border-emerald-500 rounded-xl bg-white hover:bg-emerald-50/20 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-extrabold text-orange-750">BNI <span className="text-[9px] font-medium text-slate-500 block">Virtual Account</span></span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect('va_bri')}
                    className="p-3 border border-gray-200 hover:border-emerald-500 rounded-xl bg-white hover:bg-emerald-50/20 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-extrabold text-blue-750">BRI <span className="text-[9px] font-medium text-slate-500 block">BRIVA Terbuka</span></span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 3. E-WALLET DIRECT PAY */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-rose-800 uppercase tracking-widest block font-mono">C. Direct E-Wallet Push (Pindai Nomor Handphone)</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleMethodSelect('gopay')}
                    className="p-2.5 border border-gray-200 hover:border-emerald-500 rounded-xl text-center bg-white hover:bg-emerald-50/10 cursor-pointer"
                  >
                    <p className="text-xs font-black text-emerald-800">GoPay</p>
                    <span className="text-[8px] text-gray-400 font-mono">Otomatis</span>
                  </button>
                  <button
                    onClick={() => handleMethodSelect('ovo')}
                    className="p-2.5 border border-gray-200 hover:border-emerald-500 rounded-xl text-center bg-white hover:bg-emerald-50/10 cursor-pointer"
                  >
                    <p className="text-xs font-black text-purple-800">OVO</p>
                    <span className="text-[8px] text-gray-400 font-mono">E-Money</span>
                  </button>
                  <button
                    onClick={() => handleMethodSelect('dana')}
                    className="p-2.5 border border-gray-200 hover:border-emerald-500 rounded-xl text-center bg-white hover:bg-emerald-50/10 cursor-pointer"
                  >
                    <p className="text-xs font-black text-sky-600">DANA</p>
                    <span className="text-[8px] text-gray-400 font-mono">Dompet RI</span>
                  </button>
                </div>
              </div>

              {/* 4. CREDIT CARD */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-emerald-850 uppercase tracking-widest block font-mono">D. Kartu Kredit / Debit Internasional (Visa / Mastercard)</span>
                <button
                  onClick={() => handleMethodSelect('card')}
                  className="w-full p-4 border border-emerald-150 hover:border-emerald-500 rounded-2xl bg-slate-50/40 flex items-center justify-between text-left group transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                      <CreditCard className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">Kartu Credit / Debit Visa, Mastercard, JCB</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Mendukung perlindungan 3D Secure OTP & Fraud Prevention Shield</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE BILL DISPLAY / INPUT */}
          {step === 'pay' && method && (
            <div className="space-y-6">
              <button 
                onClick={() => { playInteractionSound(); setStep('select'); setMethod(null); }}
                className="flex items-center text-[10px] font-bold text-emerald-900 group"
              >
                <ArrowLeft className="w-3 h-3 mr-1 font-extrabold text-emerald-500 group-hover:-translate-x-0.5 transition-transform" />
                KEMBALI KE PILIHAN METODE
              </button>

              {/* 2A: IF QRIS ACTIVE */}
              {method === 'qris' && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-300 flex items-center justify-center space-x-1.5 text-[10px] text-amber-950 max-w-xs mx-auto">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 animate-pulse" />
                    <span>Lakukan pembayaran sebelum waktu habis: <strong>{formatTimer(timer)}</strong></span>
                  </div>

                  {/* QRIS Graphic box */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl inline-block shadow-sm">
                    <p className="text-[10px] font-mono tracking-widest text-gray-400 font-extrabold">QRIS REK_NUSA_820</p>
                    <div className="mt-2 w-48 h-48 bg-slate-50 border-8 border-slate-900 relative flex items-center justify-center mx-auto rounded-xl">
                      {/* Generative QR style pattern mockup */}
                      <div className="absolute top-1 left-1 w-8 h-8 border-4 border-slate-900 bg-white" />
                      <div className="absolute top-1 right-1 w-8 h-8 border-4 border-slate-900 bg-white" />
                      <div className="absolute bottom-1 left-1 w-8 h-8 border-4 border-slate-900 bg-white" />
                      
                      {/* QR Dots Simulation representation */}
                      <div className="grid grid-cols-6 gap-2 opacity-55 p-3">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-xs ${i % 3 === 0 || i % 4 === 1 ? 'bg-slate-950' : 'bg-transparent'}`} />
                        ))}
                      </div>

                      {/* Micro Azta Center Tag */}
                      <div className="absolute w-8 h-8 rounded-md bg-emerald-900 border border-white text-white flex items-center justify-center text-[8px] font-bold leading-none select-none">
                        AZTA
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-2">Diterbitkan oleh: <strong>Madiun Psychology Center (PDR)</strong></p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    <p>1. Buka aplikasi M-Banking Anda (BCA Mobile, Livin Mandiri) atau E-Wallet pilihan.</p>
                    <p>2. Sentuh tombol menu <strong>SCAN / QRIS</strong>, lalu arahkan kamera ke layar ini.</p>
                    <p>3. Masukkan PIN transaksi keamanan dompet digital Anda dan simpan.</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={startPaymentProcessing}
                      className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center space-x-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-300 animate-bounce" />
                      <span>Simulasi Pindai Berhasil</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2B: IF BANK VIRTUAL ACCOUNTS */}
              {method.startsWith('va_') && (
                <div className="space-y-4 text-left animate-fade-in">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-800 font-extrabold block">BANK TUJUAN:</span>
                      <p className="text-xs font-extrabold text-slate-800">
                        {method === 'va_bca' ? 'Satu-Transfer (BCA Virtual Account)' : ''}
                        {method === 'va_mandiri' ? 'Mandiri EasyPay (Layanan GPN)' : ''}
                        {method === 'va_bni' ? 'BNI Virtual Account Terpadu' : ''}
                        {method === 'va_bri' ? 'BRIVA Terbuka (BRI)' : ''}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white text-[10px] font-extrabold uppercase tracking-widest text-emerald-900 border-2 border-emerald-200">
                      {method.split('_')[1]}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 relative space-y-1.5 font-mono text-center">
                    <span className="text-[9px] font-mono font-black text-gray-400 block tracking-widest">NOMOR VIRTUAL ACCOUNT:</span>
                    <p className="text-lg font-extrabold text-slate-900 tracking-wider">
                      {getVANumber()}
                    </p>
                    <button
                      onClick={() => handleCopy(getVANumber())}
                      className="text-[10px] bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-900 hover:bg-emerald-50 py-1 px-3 rounded-md font-sans text-slate-650 font-bold inline-flex items-center space-x-1 cursor-pointer absolute top-2 right-2 transition-colors"
                    >
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{copied ? 'Disalin!' : 'Salin VA'}</span>
                    </button>
                  </div>

                  <div className="border border-gray-150 p-4 rounded-xl text-xs space-y-2 leading-relaxed bg-white">
                    <h5 className="font-bold text-slate-900 uppercase text-[9px] font-mono text-emerald-900">Petunjuk Transfer M-Banking / ATM:</h5>
                    <p>1. Masuk ke aplikasi M-Banking Anda atau datang ke mesin ATM terdekat.</p>
                    <p>2. Pilih menu <strong>Transfer</strong> &rarr; <strong>Virtual Account</strong> (atau menu transfer antar-rekening).</p>
                    <p>3. Tempelkan/input nomor VA di atas: <strong>{getVANumber()}</strong>.</p>
                    <p>4. Informasi tagihan atas nama <strong>Azta {customerName}</strong> senilai <strong>Rp{amount.toLocaleString('id-ID')}</strong> akan muncul otomatis.</p>
                    <p>5. Selesaikan instruksi bayar dan simpan bukti.</p>
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      onClick={startPaymentProcessing}
                      className="px-6 py-3 bg-emerald-980 hover:bg-slate-900 text-emerald-100 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md w-full"
                    >
                      Simulasikan Pengiriman Sukses M-Banking
                    </button>
                    <span className="block text-[8px] text-zinc-400 mt-1.5 font-mono text-center">Sistem Gateway mendeteksi setoran VA secara instan tanpa perlu unggah struk manual</span>
                  </div>
                </div>
              )}

              {/* 2C: IF E-WALLETS DIRECT */}
              {(method === 'gopay' || method === 'ovo' || method === 'dana') && (
                <div className="space-y-5 text-left animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nomor Handphone yang Terdaftar:</label>
                    <div className="flex space-x-2">
                      <span className="bg-slate-100 px-3 py-2 text-xs border border-gray-200 rounded-lg flex items-center font-bold font-mono">+62</span>
                      <input 
                        type="tel" 
                        value={phoneNumber.replace(/^\+62|^0/, '')}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="812-3456-7890" 
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                    <span className="block text-[8.5px] text-slate-400">Sistem akan mengirimkan push notification konfirmasi bayar langsung ke aplikasi {method.toUpperCase()} di HP milik Anda.</span>
                  </div>

                  <div className="border border-gray-150 p-4 rounded-xl text-xs space-y-2 bg-slate-50/50">
                    <h5 className="font-extrabold text-slate-900 uppercase text-[9px] font-mono">Alur Direct E-Wallet:</h5>
                    <p>1. Tekan tombol Kirim Permintaan Bayar (Charge Request) di bawah.</p>
                    <p>2. Aplikasi {method.toUpperCase()} di ponsel Anda akan segera bergetar.</p>
                    <p>3. Konfirmasi nama pembayaran: <strong>Lembaga Azta Madiun</strong> dan selesaikan dalam 1 menit.</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={startPaymentProcessing}
                      className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Kirim Permintaan Pembayaran ke {method.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}

              {/* 2D: IF CREDIT CARD */}
              {method === 'card' && (
                <div className="space-y-5 text-left animate-fade-in">
                  
                  {/* Beautiful CC graphic with card state rotation */}
                  <div className="relative w-full h-44 bg-gradient-to-tr from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-2xl p-5 shadow-lg border border-white/10 overflow-hidden transform transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
                    
                    {!isCardBack ? (
                      // Card Front View
                      <div className="h-full flex flex-col justify-between animate-fade-in justify-start">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold tracking-widest text-emerald-250 italic">SECURE MASTER-VISA PASS</span>
                          <span className="font-extrabold text-base leading-none text-white font-mono uppercase">AZTAPAY</span>
                        </div>

                        {/* Gold Chip Simulation */}
                        <div className="w-8 h-6 bg-gradient-to-tr from-yellow-400 via-amber-200 to-amber-400 rounded-sm" />

                        <div>
                          <p className="font-mono text-base tracking-widest text-[13px] font-extrabold whitespace-nowrap overflow-hidden">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </p>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <span className="text-[8px] text-emerald-300 font-mono block">CARD HOLDER</span>
                              <p className="text-[10px] font-bold tracking-wide uppercase truncate max-w-[180px] leading-tight">
                                {cardHolder || 'PEMEGANG KARTU'}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] text-emerald-300 font-mono block">EXPIRED</span>
                              <p className="text-[10px] font-bold font-mono tracking-wider leading-tight">
                                {cardExpiry || 'MM/YY'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Card Back View
                      <div className="h-full flex flex-col justify-between animate-fade-in text-left">
                        <div className="h-10 bg-slate-950 -mx-5 mt-1" />
                        <div className="mt-2 text-right">
                          <span className="text-[8px] text-emerald-300 block mr-2 font-mono">CVV CODE</span>
                          <span className="w-14 bg-white text-slate-900 font-mono px-2 py-1 text-xs rounded-sm inline-block italic font-bold">
                            {cardCVV || '•••'}
                          </span>
                        </div>
                        <p className="text-[7.5px] text-emerald-300/60 leading-tight">This payment utilizes modern secure tokenization protocols. Unauthorized use of this credential is strictly reported.</p>
                      </div>
                    )}
                  </div>

                  {!otpSent ? (
                    // Regular fields interface
                    <form onSubmit={trigger3DSecureOTP} className="space-y-4 font-sans">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Detail Nama Pemegang Kartu:</label>
                        <input 
                          type="text" 
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="ASRI AMELIA"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 uppercase"
                          onFocus={() => setIsCardBack(false)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">16 Digit Nomor Kartu Kredit / Debit:</label>
                        <input 
                          type="text" 
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            // Automatically space credit card numbers
                            const v = e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCardNumber(v);
                          }}
                          placeholder="4123 4567 8901 2345"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono font-bold"
                          onFocus={() => setIsCardBack(false)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Masa Berlaku:</label>
                          <input 
                            type="text" 
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/[^0-9]/g, '');
                              if (v.length > 2) {
                                v = `${v.slice(0, 2)}/${v.slice(2)}`;
                              }
                              setCardExpiry(v);
                            }}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-center font-mono font-bold"
                            onFocus={() => setIsCardBack(false)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">CVV (3 Belakang Kartu):</label>
                          <input 
                            type="password" 
                            required
                            maxLength={3}
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="***"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-center font-mono font-bold"
                            onFocus={() => setIsCardBack(true)}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Lakukan Autentikasi 3D Secure
                        </button>
                      </div>
                    </form>
                  ) : (
                    // 3D Secure Simulated Dialog Box
                    <div className="bg-slate-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-4 animate-scale-up">
                      <div className="flex items-center justify-center space-x-1">
                        <ShieldCheck className="w-5 h-5 text-emerald-700 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-slate-800">Sistem Otorisasi 3D Secure</span>
                      </div>

                      <p className="text-xs text-gray-600">
                        Kode verifikasi OTP bank penerbit kartu telah dikirim ke nomor seluler di ujung sistem. Silakan masukkan kode input di bawah untuk menyetujui pendebetan dana.
                      </p>

                      <div className="space-y-2">
                        <input 
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => { setOtpCode(e.target.value); setOtpError(''); }}
                          placeholder="Masukkan 6 Digit OTP" 
                          className="px-4 py-2.5 text-center text-sm font-bold font-mono border-2 border-emerald-500 bg-white rounded-xl focus:outline-hidden tracking-widest w-48 mx-auto"
                        />
                        {otpError && <p className="text-[10.5px] text-rose-600 font-semibold">{otpError}</p>}
                        <span className="block text-[9px] text-slate-450">Petunjuk simulasi: Masukkan <strong>123456</strong> atau kode acak apa saja</span>
                      </div>

                      <div className="pt-2 flex space-x-2">
                        <button
                          onClick={() => { playInteractionSound(); setOtpSent(false); setOtpCode(''); }}
                          className="flex-1 py-1.5 border border-gray-300 hover:bg-slate-100 rounded-lg text-slate-650 text-[10px] font-bold"
                        >
                          Koreksi Kartu
                        </button>
                        <button
                          onClick={verifyOTPAndPay}
                          className="flex-1 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-[10px] uppercase tracking-wider font-extrabold"
                        >
                          Verifikasi Pembayaran
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PROCESSING STATE LOGS */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-6 animate-fade-in flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-emerald-850 animate-spin" />
              <div className="space-y-2">
                <p className="font-extrabold text-slate-900 text-sm">Sedang Memproses Transaksi Aman Anda...</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 font-mono text-[9px] text-slate-500 max-w-xs mx-auto text-left leading-relaxed">
                  <span className="text-emerald-700 font-extrabold block uppercase tracking-wider text-[8px] mb-1">STATUS AKTUATOR GATEWAY:</span>
                  {processLogs.slice(0, currentLogIdx + 1).map((log, i) => (
                    <p key={i} className="animate-fade-in">
                      <span className="text-emerald-500 font-extrabold mr-1">&radic;</span> {log}
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">Jangan tutup browser atau menyegarkan halaman ini.</p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS / CAPTURED SCREEN */}
          {step === 'success' && (
            <div className="p-4 text-center space-y-5 animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full border-4 border-emerald-500 flex items-center justify-center animate-bounce shadow-inner">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                  TRANSAKSI DISETUJUI 899-2
                </span>
                <h3 className="font-display font-black text-slate-950 text-base mt-2.5">Pembayaran Sukses Terverifikasi!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Dana sejumlah <strong>Rp{amount.toLocaleString('id-ID')}</strong> telah sukses disalurkan ke kas operasional <strong>Lembaga Azta Best Choice</strong>. Status Anda telah aktif otomatis.
                </p>
              </div>

              {/* Secure receipt summary */}
              <div className="w-full bg-emerald-50/30 p-4 rounded-3xl border border-dashed border-emerald-300 font-mono text-[10px] text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">ALIRAN METODE:</span>
                  <span className="font-extrabold text-slate-800 uppercase">ONLINE_GATEWAY ({method})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">TANGGAL:</span>
                  <span className="font-extrabold text-slate-800">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">NO REF INDONESIA:</span>
                  <span className="font-extrabold text-slate-800">AZTA-TRX-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <hr className="border-emerald-200/50 border-dashed" />
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-900 font-bold">STATUS JARINGAN:</span>
                  <span className="text-emerald-700">LUNAS / COMPLETED</span>
                </div>
              </div>

              <div className="flex space-x-2 w-full pt-4">
                <button
                  onClick={() => {
                    playInteractionSound();
                    const el = document.createElement('a');
                    el.href = '#';
                    alert('Kuitansi Elektronik resmi PDF sedang diunduh secara instan ke dalam penyimpanan perangkat Anda.');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-705 transition-colors inline-flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Kuitansi PDF</span>
                </button>

                <button
                  onClick={() => {
                    playInteractionSound();
                    onSuccess(method || 'shopee', payType);
                  }}
                  className="flex-1 py-1 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-[11px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SECURITY FOOTER CAPS */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            DIKONTROL OLEH OTORITAS JASA KEUANGAN (OJK) & BANK INDONESIA (BI)
          </span>
        </div>

      </div>
    </div>
  );
}
