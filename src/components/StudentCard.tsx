import React, { useState, useRef } from 'react';
import { User, SiteSettings, Student, ProgramRegistration } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { IdCard, Upload, Printer, Check, Sparkles, Smile } from 'lucide-react';
import CircularLogo from './CircularLogo';

interface StudentCardProps {
  currentUser: User;
  siteSettings: SiteSettings;
}

export default function StudentCard({ currentUser, siteSettings }: StudentCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(
    currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=400'
  );
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse students and registrations from local storage dynamically
  const savedStudents: Student[] = JSON.parse(localStorage.getItem('azta_students') || '[]');
  const matchedStudent = savedStudents.find(
    s => s.email?.toLowerCase() === currentUser.email?.toLowerCase() || s.id === currentUser.id
  );

  const savedRegs: ProgramRegistration[] = JSON.parse(localStorage.getItem('azta_registrations') || '[]');
  const matchedReg = savedRegs.find(
    r => (r.studentId === currentUser.id || r.studentName === currentUser.name) && r.status === 'approved'
  ) || savedRegs.find(
    r => r.studentId === currentUser.id || r.studentName === currentUser.name
  );

  // Dynamic Academic Focus based on registered program or profile target career
  const academicFocus = matchedStudent?.programJoined 
    || matchedReg?.programName 
    || currentUser.targetCareer 
    || 'Pelatihan Psikotes TNI-POLRI';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const compressed = await compressImage(reader.result as string, 200, 260, 0.7);
          setPhotoUrl(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPrint = () => {
    const printContent = document.getElementById('printable-student-id-card');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak kartu.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Kartu Siswa - ${currentUser.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white p-8 flex justify-center items-center h-screen">
          <div class="border-2 border-amber-400 rounded-3xl p-6 w-[500px] h-[310px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white relative shadow-2xl flex flex-col justify-between">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const studentNoDigits = currentUser.id.replace(/[^0-9]/g, '');
  const fallbackSeq = studentNoDigits ? String(studentNoDigits).slice(-3).padStart(3, '0') : '001';
  const currentYear = new Date().getFullYear();
  const defaultAutoNo = `AST-${currentYear}-${fallbackSeq}`;

  const studentNumber = matchedStudent?.studentNumber 
    || defaultAutoNo;

  const handleCopyId = () => {
    navigator.clipboard.writeText(studentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="student-card-screen">
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-left" id="card-card-management">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-150 pb-4 mb-6 gap-4">
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-905 flex items-center space-x-2">
              <IdCard className="w-5 h-5 text-emerald-800" />
              <span>Kartu Anggota Resmi Siswa</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Kartu digital berstandar resmi sebagai identitas akses layanan simulasi & bimbingan offline.</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ganti Foto Formal</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={triggerPrint}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* Outer Grid card view */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-gray-200 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 text-[100px] text-emerald-900/5 select-none font-bold tracking-tighter -mt-10 -ml-6 pointer-events-none font-sans">
            AZTA
          </div>

          {/* Actual Card Body suitable for printing */}
          <div
            id="printable-student-id-card"
            className="w-full max-w-[480px] h-[300px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white rounded-3xl p-5 border-2 border-amber-400 relative shadow-xl flex flex-col justify-between overflow-hidden"
          >
            {/* Background design accents */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/15 blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5 relative z-10">
              <div className="flex items-center space-x-2 text-left">
                {siteSettings?.logoUrl ? (
                  <img 
                    referrerPolicy="no-referrer"
                    src={siteSettings.logoUrl} 
                    alt={siteSettings?.brandName || 'Logo'} 
                    className="w-8 h-8 rounded-full object-cover border border-amber-300 shrink-0"
                  />
                ) : (
                  <CircularLogo className="w-8 h-8 shrink-0" />
                )}
                <div className="leading-none">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-305">
                    {siteSettings.brandName || 'AZTA BEST CHOICE'}
                  </span>
                  <p className="text-[7px] text-emerald-300 tracking-wide font-mono mt-0.5">
                    {siteSettings.subTitle || 'Counseling & Psychology'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-400 text-emerald-950 text-[7px] font-black uppercase tracking-wider rounded font-mono">
                KARTU SISWA BIMBEL
              </span>
            </div>

            {/* Card Internal Body information */}
            <div className="flex gap-4 items-center my-auto relative z-10">
              {/* Photo Box */}
              <div className="w-24 h-32 rounded-xl overflow-hidden border border-amber-300/60 bg-emerald-990 flex-shrink-0 shadow-inner relative group">
                <img
                  src={photoUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text metadata list */}
              <div className="text-left space-y-1.5 flex-1 min-w-0">
                <div>
                  <span className="text-[7px] text-emerald-300/80 font-mono block tracking-wider uppercase">NAMA SISWA</span>
                  <p className="text-sm font-extrabold text-white tracking-wide truncate">{currentUser.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[7px] text-emerald-300/80 font-mono block tracking-wider uppercase">ID REGISTRASI</span>
                    <button 
                      onClick={handleCopyId}
                      className="text-xs font-bold text-amber-305 flex items-center space-x-1 hover:text-amber-400 transition-colors font-mono"
                      title="Salin ID"
                    >
                      <span>{studentNumber}</span>
                    </button>
                  </div>
                  <div>
                    <span className="text-[7px] text-emerald-300/80 font-mono block tracking-wider uppercase">FOKUS AKADEMIK</span>
                    <p className="text-[10px] font-bold text-emerald-100 truncate" title={academicFocus}>{academicFocus}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[7px] text-emerald-300/80 font-mono block tracking-wider uppercase">SEKOLAH / ASAL</span>
                  <p className="text-[9px] font-bold text-slate-100 truncate">{currentUser.schoolOrInstitution || 'Umum / Alumni'}</p>
                </div>
              </div>
            </div>

            {/* Card Footer Info */}
            <div className="flex justify-between items-center border-t border-white/10 pt-2 relative z-10">
              <div className="text-left">
                <p className="text-[7px] text-emerald-400 leading-none">STATUS KEASGOTAAN</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-white font-mono uppercase tracking-wider">AKTIF PROGRAM</span>
                </div>
              </div>

              {/* Mock Barcode Graphic */}
              <div className="flex flex-col items-end">
                <div className="h-6 w-32 bg-white p-0.5 rounded flex items-center justify-between overflow-hidden">
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[2px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[3px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[2px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[2px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[3px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[2px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[2px] h-full bg-black" />
                  <div className="w-[3px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                  <div className="w-[4px] h-full bg-black" />
                  <div className="w-[1px] h-full bg-black" />
                </div>
                <span className="text-[6px] font-mono text-emerald-300 mt-0.5">AZTA SECURITY AUTHENTICATION</span>
              </div>
            </div>
          </div>

          {/* Action indicator */}
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500 font-semibold bg-white px-4 py-1.5 rounded-full border border-gray-150">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ID Number: <strong>{studentNumber}</strong></span>
            {copied ? (
              <span className="text-emerald-600 flex items-center space-x-0.5 ml-2 font-mono text-[10px]">
                <Check className="w-3 h-3" />
                <span>Salin sukses!</span>
              </span>
            ) : (
              <button 
                onClick={handleCopyId}
                className="text-emerald-700 hover:underline hover:text-emerald-900 ml-2 font-mono text-[10px]"
              >
                [Salin ID]
              </button>
            )}
          </div>
        </div>

        {/* Helpful offline reminder tip block */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start space-x-3 text-left">
          <Smile className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Perhatian Anggota Offline</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
              Tunjukkan Kartu Tanda Siswa ini (baik digital di HP atau cetakan kertas fisik) kepada resepsionis di **Kantor Sekretariat Azta, Jl. Kawis Taman Kec. Taman, Kota Madiun** saat menghadiri simulasi fisik CAT TNI-POLRI atau melakukan sesi bimbingan psikotes privat tatap muka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
