import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Settings, 
  History, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Mail, 
  Smartphone, 
  Users, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Trash2,
  Calendar,
  Layers,
  Check,
  Search
} from 'lucide-react';
import { Student, ProgramRegistration, CounselingSession, NotificationLog, NotificationSetting } from '../types';
import { MOCK_BLOGS } from '../mockData';

interface AdminNotificationsProps {
  students: Student[];
  registrations: ProgramRegistration[];
  sessions: CounselingSession[];
}

export default function AdminNotifications({
  students,
  registrations,
  sessions
}: AdminNotificationsProps) {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [settings, setSettings] = useState<NotificationSetting>({
    enableAutomatedEmail: true,
    enableAutomatedSms: true,
    emailSenderName: 'Azta Best Choice Madiun',
    emailApiKey: '',
    smsSenderId: 'AZTA_INFO',
    smsApiKey: '',
    notifyOnBookingTimesBeforeHours: 24,
    notifyOnDeadlineDaysBefore: 3
  });

  const [activeTab, setActiveTab] = useState<'control' | 'history' | 'templates'>('control');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Manual Trigger Form
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [manualChannel, setManualChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [manualTitle, setManualTitle] = useState('Pemberitahuan Kelulusan Simulasi Psikotes Azta Madiun');
  const [manualMessage, setManualMessage] = useState('Selamat! Hasil evaluasi perkembangan belajar Anda menunjukkan grafik meningkat tajam. Lanjutkan konsistensi menjelang hari-H.');

  // Templates State (visual customizers)
  const [templates, setTemplates] = useState({
    counseling: {
      title: '⏰ Pengingat Sesi Konseling Psikologis',
      body: 'Halo {Nama_Siswa}, ini adalah pengingat sesi konseling psikologi TNI-POLRI Anda yang terjadwal besok pukul {Jam} WIB bersama Tim Psikolog Azta.'
    },
    deadline: {
      title: '⚠️ Pengingat Batas Administrasi Bimbel CAT',
      body: 'Halo {Nama_Siswa}, batas pendaftarannya untuk program {Nama_Program} mendekati tenggat. Mohon selesaikan administrasi pendaftaran segera. Terimakasih.'
    },
    blog: {
      title: '📚 Info Seleksi Terbaru: {Judul_Artikel}',
      body: 'Halo rekan calon Taruna, informasi seleksi dan tips psikotes terbaru telah terpasang di portal belajar Azta: "{Judul_Artikel}". Silakan login untuk membahas bersama mentor.'
    }
  });

  // Filter & Search Logs
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Load backend states
  useEffect(() => {
    fetchLogs();
    fetchSettings();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/notifications/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Gagal memuat log notifikasi.", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/notifications/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan notifikasi.", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccessMsg('Pengaturan notifikasi otomatis berhasil diperbarui & disimpan di server!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Gagal memperbarui database pengaturan.');
      }
    } catch (err: any) {
      setErrorMsg('Kesalahan teknis internal server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger simulated automatic scanner in the backend
  const handleTriggerAutoScan = async () => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/notifications/trigger-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrations: registrations,
          sessions: sessions,
          articles: MOCK_BLOGS
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchLogs();
        if (data.triggeredCount > 0) {
          setSuccessMsg(`🚀 Deteksi sukses! Sistem cerdas otomatis mendeteksi ${data.triggeredCount} aktivitas mendekati deadline, dan berhasil menyiarkan SMS/Email langsung.`);
        } else {
          setSuccessMsg('🔍 Pemeriksaan Selesai: Seluruh siswa terdaftar telah dikirimkan notifikasi pendaftaran/sesi terbaru sebelumnya (Tidak ada duplikasi pesan).');
        }
      } else {
        setErrorMsg('Gagal memproses pemicu otomatis.');
      }
    } catch (err) {
      setErrorMsg('Koneksi terganggu saat memindai.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus seluruh rekaman riwayat notifikasi ini?')) return;
    try {
      const res = await fetch('/api/notifications/clear-logs', { method: 'POST' });
      if (res.ok) {
        setLogs([]);
        setSuccessMsg('Riwayat log berhasil dibersihkan.');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send a manual custom notification to a specific user
  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedStudentId) {
      setErrorMsg('Mohon pilih siswa penerima terlebih dahulu.');
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      setErrorMsg('Siswa tidak ditemukan.');
      return;
    }

    const contact = manualChannel === 'email' ? student.email : student.phone;

    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: student.fullName,
          recipientContact: contact,
          type: 'manual',
          channel: manualChannel,
          title: manualTitle,
          message: manualMessage
        })
      });

      if (res.ok) {
        setSuccessMsg(`Notifikasi manual sukses terkirim ke ${student.fullName} via ${manualChannel.toUpperCase()}!`);
        setManualMessage('');
        await fetchLogs();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Gagal menyiarkan pesan manual.');
      }
    } catch (error) {
      setErrorMsg('Gagal menghubungi API server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated metrics
  const totalSent = logs.length;
  const emailCount = logs.filter(l => l.channel === 'email').length;
  const smsCount = logs.filter(l => l.channel === 'sms' || l.channel === 'whatsapp').length;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && log.type === filterType;
  });

  return (
    <div id="notifications-system-container" className="space-y-6">
      
      {/* Visual Title Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-amber-400 opacity-5 rounded-full blur-xl" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-emerald-100 shadow-xl">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-800 text-emerald-200 font-mono font-bold text-[9px] uppercase tracking-wider rounded-md">Server-Side Integration</span>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider rounded-md">Automated</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Sistem Notifikasi otomatis Azta</h2>
              <p className="text-xs text-slate-300">Hubungkan siswa Anda ke jadwal, status pendaftaran, dan rilis artikel secara cerdas via Email & SMS</p>
            </div>
          </div>

          <button
            onClick={handleTriggerAutoScan}
            disabled={isLoading}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center space-x-2 shrink-0 cursor-pointer disabled:bg-slate-700 disabled:text-slate-450"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
            )}
            <span>Pindai & Kirim Otomatis</span>
          </button>
        </div>
      </div>

      {/* Alert Messages banner */}
      {(successMsg || errorMsg) && (
        <div className="animate-pulse duration-500">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-2 text-xs sm:text-sm font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 text-rose-950 rounded-2xl flex items-center space-x-2 text-xs sm:text-sm font-bold">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Micro Metrics Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Notifikasi Disiarkan</p>
            <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">{totalSent} <span className="text-xs text-gray-500 font-normal">Pesan</span></h4>
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Metrik Email Terkirim</p>
            <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">{emailCount} <span className="text-xs text-gray-500 font-normal">Siswa</span></h4>
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Broadcast SMS / WA</p>
            <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">{smsCount} <span className="text-xs text-gray-500 font-normal">Transmisi</span></h4>
          </div>
        </div>

      </div>

      {/* Navigation Sub Tab controls */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('control')}
          className={`px-4 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'control' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan & Konsol Manual</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'templates' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kustomisasi Templat</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'history' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Log Pengiriman ({logs.length})</span>
        </button>
      </div>

      {/* Tab Contents: CONTROL / SETTINGS */}
      {activeTab === 'control' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Section (Left side) */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs lg:col-span-7 whitespace-normal">
            <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center gap-1.5">
              <span>Konfigurasi Gerbang API Notifikasi</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              Aktifkan gerbang otomatisasi email dan SMS, atau atur parameter waktu tunggu sebelum pesan otomatis diletakkan ke antrian rilis.
            </p>

            <form onSubmit={handleSaveSettings} className="mt-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Gerbang Email</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Kirim via SMTP/SendGrid</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableAutomatedEmail}
                    onChange={(e) => setSettings({ ...settings, enableAutomatedEmail: e.target.checked })}
                    className="w-4 h-4 accent-emerald-850 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-amber-700" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Gerbang SMS/WA</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Kirim via SmsGateway/Twilio</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableAutomatedSms}
                    onChange={(e) => setSettings({ ...settings, enableAutomatedSms: e.target.checked })}
                    className="w-4 h-4 accent-emerald-850 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-805 block mb-1.5">Nama Pengirim Email Resmi:</label>
                  <input
                    type="text"
                    value={settings.emailSenderName}
                    onChange={(e) => setSettings({ ...settings, emailSenderName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-805 block mb-1.5">SendGrid / SMTP API Key:</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••••••••••"
                      value={settings.emailApiKey}
                      onChange={(e) => setSettings({ ...settings, emailApiKey: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-805 block mb-1.5">SMS Gateway Sender ID:</label>
                    <input
                      type="text"
                      value={settings.smsSenderId}
                      onChange={(e) => setSettings({ ...settings, smsSenderId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-805 block mb-1.5">Pengingat Konseling (Waktu):</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.notifyOnBookingTimesBeforeHours}
                        onChange={(e) => setSettings({ ...settings, notifyOnBookingTimesBeforeHours: parseInt(e.target.value) || 24 })}
                        className="w-20 px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-center text-xs sm:text-sm font-bold focus:outline-hidden"
                      />
                      <span className="text-xs text-gray-500 font-bold">Jam Sebelum Sesi</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-805 block mb-1.5">Tenggat Administrasi:</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.notifyOnDeadlineDaysBefore}
                        onChange={(e) => setSettings({ ...settings, notifyOnDeadlineDaysBefore: parseInt(e.target.value) || 3 })}
                        className="w-20 px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-center text-xs sm:text-sm font-bold focus:outline-hidden"
                      />
                      <span className="text-xs text-gray-500 font-bold">Hari Sebelum Deadline</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white text-xs uppercase tracking-wider font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Kredensial Gerbang</span>
                </button>
              </div>

            </form>
          </div>

          {/* Manual Dispatch Console (Right side) */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <Send className="w-4.5 h-4.5 text-slate-800" />
                <span>Konsol Manual Siaran Pesan</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Kirimkan pesan langsung (kustom) ke salah satu siswa terdaftar Azta Counseling secara instan.
              </p>

              <form onSubmit={handleSendManual} className="mt-5 space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Pilih Siswa Penerima:</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden"
                  >
                    <option value="">-- Pilih Siswa Aktif --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.phone})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Saluran Pengiriman:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['email', 'sms', 'whatsapp'] as const).map((chan) => (
                      <button
                        key={chan}
                        type="button"
                        onClick={() => setManualChannel(chan)}
                        className={`py-1.5 border rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all tracking-wider ${
                          manualChannel === chan 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-slate-50'
                        }`}
                      >
                        {chan}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-805 block mb-1">Judul / Subjek Notifikasi:</label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Masukkan subjek pemberitahuan..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-805 block mb-1">Isi Pesan:</label>
                  <textarea
                    rows={3}
                    value={manualMessage}
                    onChange={(e) => setManualMessage(e.target.value)}
                    placeholder="Ketik isi pesan pengingat di sini..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-gray-400"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Siarkan Notifikasi Sekarang</span>
                </button>

              </form>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 bg-amber-500/10 p-3 rounded-2xl flex items-start space-x-2 text-[10px] text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Simulator WhatsApp Terintegrasi:</span>
                Tekan tombol kirim dan pantau di bawah! Pesan Anda akan langsung dicatatkan ke antarmuka log dengan status terverifikasi real-time.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab Contents: CUSTOM TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-900">Kustomisasi Template Pesan Otomasi</h3>
            <p className="text-[11px] text-gray-400 mt-1 uppercase font-mono tracking-wider">Automated Notification Content Builders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Template A: counseling */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[9px] uppercase tracking-wider">Konseling Psikologi</span>
                  <Calendar className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-xs font-black text-slate-950 mt-1 uppercase">Sesi Konseling Reminders</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Dikirimkan otomatis sebelum jadwal yang di-booking dimulai.</p>
                
                <div className="mt-3.5 space-y-2 text-left">
                  <input
                    type="text"
                    value={templates.counseling.title}
                    onChange={(e) => setTemplates({
                      ...templates,
                      counseling: { ...templates.counseling, title: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-black"
                  />
                  <textarea
                    rows={4}
                    value={templates.counseling.body}
                    onChange={(e) => setTemplates({
                      ...templates,
                      counseling: { ...templates.counseling, body: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold leading-relaxed"
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-500 font-mono">
                Variabel: <code className="text-slate-800 font-bold">{"{Nama_Siswa}"}</code>, <code className="text-slate-800 font-bold">{"{Jam}"}</code>
              </div>
            </div>

            {/* Template B: deadline */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[9px] uppercase tracking-wider">Limit Pendaftaran</span>
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                </div>
                <h4 className="text-xs font-black text-slate-950 mt-1 uppercase">Tenggat Administrasi</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Pengingat berkas/program pendaftaran yang belum tuntas.</p>

                <div className="mt-3.5 space-y-2 text-left">
                  <input
                    type="text"
                    value={templates.deadline.title}
                    onChange={(e) => setTemplates({
                      ...templates,
                      deadline: { ...templates.deadline, title: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-black"
                  />
                  <textarea
                    rows={4}
                    value={templates.deadline.body}
                    onChange={(e) => setTemplates({
                      ...templates,
                      deadline: { ...templates.deadline, body: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold leading-relaxed"
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-500 font-mono">
                Variabel: <code className="text-slate-800 font-bold">{"{Nama_Siswa}"}</code>, <code className="text-slate-800 font-bold">{"{Nama_Program}"}</code>
              </div>
            </div>

            {/* Template C: blog */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-full font-bold text-[9px] uppercase tracking-wider">Rilis Info / Blog</span>
                  <BookOpen className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="text-xs font-black text-slate-950 mt-1 uppercase">Informasi & Tips Terbaru</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Siaran otomatis ke seluruh database ketika artikel edukatif dirilis.</p>

                <div className="mt-3.5 space-y-2 text-left">
                  <input
                    type="text"
                    value={templates.blog.title}
                    onChange={(e) => setTemplates({
                      ...templates,
                      blog: { ...templates.blog, title: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-black"
                  />
                  <textarea
                    rows={4}
                    value={templates.blog.body}
                    onChange={(e) => setTemplates({
                      ...templates,
                      blog: { ...templates.blog, body: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold leading-relaxed"
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-500 font-mono">
                Variabel: <code className="text-slate-800 font-bold">{"{Judul_Artikel}"}</code>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => {
                setSuccessMsg('Templat penyiaran notifikasi sukses disimpan secara lokal!');
                setTimeout(() => setSuccessMsg(''), 3000);
              }}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Simpan Perubahan Templat
            </button>
          </div>

        </div>
      )}

      {/* Tab Contents: SEND LOGS */}
      {activeTab === 'history' && (
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-sans font-extrabold text-base text-slate-900">Histori Siaran Notifikasi (Server Log)</h3>
              <p className="text-[11px] text-gray-400">Arsip pengiriman pesan otomatis secara berurutan.</p>
            </div>

            <button
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 rounded-xl text-xs font-extrabold transition-colors flex items-center space-x-1 border border-rose-200 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Seluruh Riwayat Log</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari penerima, subjek, isi pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-gray-400 block font-mono select-none">FILTER:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
              >
                <option value="all">Semua Tipe</option>
                <option value="counseling_reminder">Konseling</option>
                <option value="registration_deadline">Pendaftaran</option>
                <option value="article_update">Kanal Artikel</option>
                <option value="manual">Kustom Manual</option>
              </select>
            </div>
          </div>

          <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-2xl">
            {filteredLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Bell className="w-8 h-8 text-gray-300 stroke-1" />
                <p className="text-xs font-bold text-slate-700">Tidak ada log notifikasi yang sesuai pencarian</p>
                <p className="text-[10px] text-gray-400">Picu pindaian otomatis atau kirimkan siaran kustom manual di atas!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-150">
                {filteredLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  });
                  return (
                    <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4 text-left">
                      <div className="flex items-start space-x-3 text-left">
                        {/* Status Channel Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          log.channel === 'email' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}>
                          {log.channel === 'email' ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-900">{log.recipientName}</span>
                            <span className="text-[10px] text-slate-500 font-medium">({log.recipientContact})</span>
                            <span className="text-gray-300 select-none">•</span>
                            <span className="text-[9px] text-gray-450 font-bold">{dateStr} WIB</span>
                          </div>

                          <h4 className="font-black text-xs text-emerald-950 mt-1">{log.title}</h4>
                          <p className="text-[10px] text-slate-700 leading-relaxed mt-1">{log.message}</p>
                          
                          {/* Type tags */}
                          <div className="flex items-center space-x-1.5 mt-2">
                            <span className={`px-2 py-0.2 rounded-md font-mono font-bold text-[8px] uppercase tracking-wider ${
                              log.type === 'counseling_reminder' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              log.type === 'registration_deadline' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              log.type === 'article_update' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              'bg-slate-50 text-slate-700 border border-slate-100'
                            }`}>
                              {log.type === 'counseling_reminder' ? 'Konseling' :
                               log.type === 'registration_deadline' ? 'Deadline' :
                               log.type === 'article_update' ? 'Artikel' :
                               'Pesan Manual'}
                            </span>
                            
                            <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-mono font-bold text-[8px] uppercase tracking-wider flex items-center gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-600 animate-ping" />
                              <span>Delivered</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
