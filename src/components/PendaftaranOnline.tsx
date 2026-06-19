/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SiteSettings, Student } from '../types';
import { User, Calendar, MapPin, GraduationCap, Laptop, Upload, Image as ImageIcon, CheckCircle, ArrowRight, Mail, Phone, Lock } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface PendaftaranOnlineProps {
  siteSettings: SiteSettings;
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  setActiveTab: (tab: any) => void;
}

export default function PendaftaranOnline({
  siteSettings,
  students,
  onUpdateStudents,
  setActiveTab
}: PendaftaranOnlineProps) {
  // Generate next automatic student number on load
  const [nextStudentNo, setNextStudentNo] = useState('');

  useEffect(() => {
    const year = new Date().getFullYear();
    const count = students.length;
    const nextSeq = String(count + 1).padStart(3, '0');
    setNextStudentNo(`AST-${year}-${nextSeq}`);
  }, [students]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [address, setAddress] = useState('');
  const [lastEducation, setLastEducation] = useState('SMA / Sederajat');
  const [programJoined, setProgramJoined] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // File Upload Handling
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Default programs to fallback to if siteSettings.programs is empty
  const defaultPrograms = [
    'Pelatihan Psikotes TNI-POLRI',
    'Persiapan Instansi Pemerintah/BUMN/Swasta',
    'Persiapan Perguruan Tinggi'
  ];
  const availablePrograms = siteSettings.interactivePrograms && siteSettings.interactivePrograms.length > 0
    ? siteSettings.interactivePrograms.map(item => item.title)
    : (siteSettings.programs && siteSettings.programs.length > 0 
       ? siteSettings.programs 
       : defaultPrograms);

  // Initialize selected program once available
  useEffect(() => {
    if (availablePrograms.length > 0 && !programJoined) {
      setProgramJoined(availablePrograms[0]);
    }
  }, [availablePrograms, programJoined]);

  // Success State
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Berkas harus berupa gambar (.png, .jpg, .jpeg)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran gambar tidak boleh melebihi 2MB');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const compressed = await compressImage(reader.result, 200, 260, 0.7);
        setPhotoBase64(compressed);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return alert('Nama Lengkap wajib diisi!');
    if (!email.trim()) return alert('Email (untuk login) wajib diisi!');
    if (!phone.trim()) return alert('No WhatsApp/HP wajib diisi!');
    if (!password.trim()) return alert('Password (untuk login) wajib diisi!');
    if (!birthPlace.trim()) return alert('Tempat Lahir wajib diisi!');
    if (!birthDate) return alert('Tanggal Lahir wajib diisi!');
    if (!address.trim()) return alert('Alamat Tinggal wajib diisi!');
    if (!programJoined) return alert('Pilihlah salah satu bimbingan bimbingan/program!');

    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      studentNumber: nextStudentNo,
      photoUrl: photoBase64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120', // fallback face placeholder
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password,
      birthPlace: birthPlace.trim(),
      birthDate,
      gender,
      address: address.trim(),
      lastEducation,
      programJoined,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    // Save and Persist
    const updated = [...students, newStudent];
    onUpdateStudents(updated);
    setRegisteredStudent(newStudent);

    // Track scroll back to header
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setBirthPlace('');
    setBirthDate('');
    setGender('Laki-laki');
    setAddress('');
    setLastEducation('SMA / Sederajat');
    setPhotoBase64(null);
    setRegisteredStudent(null);
  };

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-8" id="pendaftaran-container">
      
      {/* Visual Header */}
      <div className="text-center space-y-3" id="pendaftaran-header">
        <span className="px-3 py-1 bg-blue-100 text-blue-900 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
          Portal Admisi Online
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Formulir Penerimaan Siswa Baru
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Silakan lengkapi formulir pendaftaran di bawah ini secara resmi untuk bergabung ke salah satu program bimbingan di <strong className="text-blue-900">{siteSettings.brandName || 'Azta'}</strong>.
        </p>
      </div>

      {!registeredStudent ? (
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-left grid grid-cols-1 md:grid-cols-3 gap-8"
          id="form-pendaftaran-siswa"
        >
          {/* LEFT PANEL: PHOTO UPLOAD */}
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                1. Pas Foto Siswa
              </label>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Pilih foto portrait terbaik Anda untuk disematkan pada ID-Card siswa otomatis (maksimal file 2MB).
              </p>
            </div>

            {/* Drag & Drop Canvas */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${
                isDragOver ? 'border-blue-500 bg-blue-50/60 scale-98' : 'border-slate-250 bg-slate-50/50 hover:bg-slate-50'
              }`}
              id="upload-photo-zone"
            >
              {photoBase64 ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="w-28 h-36 rounded-lg overflow-hidden border border-slate-300 shadow-md bg-white">
                    <img src={photoBase64} alt="Pas Foto Siswa" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoBase64(null)}
                    className="text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-full border shadow-xs text-slate-400">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Seret & Letakkan Gambar
                    </p>
                    <p className="text-[9px] text-gray-400">Atau pilih berkas manual</p>
                  </div>
                  <label className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-[10px] font-bold tracking-wider hover:bg-blue-950 uppercase transition-colors cursor-pointer inline-block mt-2">
                    Cari File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                ⚠️ {uploadError}
              </p>
            )}

            {/* Quick Helper */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-amber-800 tracking-wider">Info Nomor Siswa</span>
              <p className="text-[11px] leading-relaxed text-amber-950">
                Nomor unik siswa Anda disiapkan secara instan oleh sistem: <strong className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200 text-slate-800">{nextStudentNo}</strong>
              </p>
            </div>
          </div>

          {/* MAIN FIELD INPUTS */}
          <div className="md:col-span-2 space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900">
                2. Data Identitas Lengkap
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* FullName input */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-blue-800" />
                  <span>Nama Lengkap Siswa:</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dimas Anggara"
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              {/* Email & No WhatsApp / HP */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-blue-800" />
                  <span>Email (Akun Login):</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dimas@gmail.com"
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-blue-800" />
                  <span>No. WhatsApp/HP:</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 081234567890"
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              {/* Password */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-blue-800" />
                  <span>Password Login Portal:</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat sandi aman Anda..."
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              {/* Birth Place */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-800" />
                  <span>Tempat Lahir:</span>
                </label>
                <input
                  type="text"
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="e.g. Madiun"
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-800" />
                  <span>Tanggal Lahir:</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30"
                />
              </div>

              {/* Gender radio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenis Kelamin:</label>
                <div className="flex items-center space-x-4 pt-1">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Laki-laki" 
                      checked={gender === 'Laki-laki'} 
                      onChange={() => setGender('Laki-laki')} 
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span>Laki-Laki</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Perempuan" 
                      checked={gender === 'Perempuan'} 
                      onChange={() => setGender('Perempuan')} 
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Last Education Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                  <span>Pendidikan Terakhir:</span>
                </label>
                <select
                  value={lastEducation}
                  onChange={(e) => setLastEducation(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 bg-slate-50/30"
                >
                  <option value="SMP / Sederajat">SMP / Sederajat</option>
                  <option value="SMA / Sederajat">SMA / Sederajat</option>
                  <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                  <option value="Sarjana (S1)">Sarjana (S1)</option>
                  <option value="Pascasarjana (S2/S3)">Pascasarjana (S2/S3)</option>
                </select>
              </div>

              {/* Address Area */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Alamat Tempat Tinggal:</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Jl. Kawis No. 20, Kelurahan Taman, Kec. Taman, Kota Madiun"
                  className="w-full p-2.5 text-xs border border-gray-250 rounded-xl focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50/30 resize-none"
                />
              </div>

              {/* Dynamic Program dropdown */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Laptop className="w-3.5 h-3.5 text-blue-800" />
                  <span>Program yang Diikuti:</span>
                </label>
                <select
                  value={programJoined}
                  onChange={(e) => setProgramJoined(e.target.value)}
                  className="w-full p-3 text-xs border border-blue-200 bg-blue-50/35 rounded-xl font-bold text-blue-950 focus:border-blue-900"
                >
                  {availablePrograms.map((prog, idx) => (
                    <option key={idx} value={prog}>{prog}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400">
                  Pilihan bimbingan ini terdaftar langsung ke kurikulum Azta khusus tes intelijensi & fisik.
                </p>
              </div>

            </div>

            {/* Action Bar */}
            <div className="border-t pt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md shadow-blue-950/10"
              >
                <span>Daftarkan Diri Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </motion.form>
      ) : (
        /* SUCCESS SCREEN & STUDENT CARD COMPONENT */
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-8 animate-fade-in"
          id="registration-success-pane"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-4xl">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Pendaftaran Anda Berhasil!</h2>
            <p className="text-xs text-gray-500 max-w-md">
              Data Anda telah tersimpan secara resmi di database lembaga. Berikut adalah Kartu Anggota Taruna (ID Card) digital Anda:
            </p>
          </div>

          {/* VIRTUAL STUDENT ID-CARD */}
          <div className="max-w-md mx-auto bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-950 text-white rounded-[2rem] p-6 shadow-xl border border-slate-700 text-left relative overflow-hidden" id="student-id-card">
            
            {/* Background design accents */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-[-20px] bottom-[-20px] w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  AZ
                </div>
                <div>
                  <h3 className="font-extrabold text-[12px] uppercase tracking-wider leading-none text-amber-300">
                    {siteSettings.brandName || 'AZTA'}
                  </h3>
                  <span className="text-[8px] text-white/50 tracking-widest uppercase">
                    STUDENT CERTIFICATION CARD
                  </span>
                </div>
              </div>
              <span className="font-mono text-[9px] bg-white/10 text-white/80 px-2 py-0.5 rounded border border-white/15">
                {registeredStudent.gender === 'Laki-laki' ? 'MALE' : 'FEMALE'}
              </span>
            </div>

            {/* Card Main Body */}
            <div className="grid grid-cols-3 gap-4">
              {/* Profile image column */}
              <div className="col-span-1 flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-white/20 rounded-xl overflow-hidden border border-white/20 shadow-md">
                  <img 
                    src={registeredStudent.photoUrl} 
                    alt="Siswa" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="text-[8px] text-amber-300/8 font-mono tracking-widest mt-2 block">
                  AZTA-VERIFIED
                </span>
              </div>

              {/* Data column */}
              <div className="col-span-2 space-y-2 text-left flex flex-col justify-center">
                <div>
                  <p className="text-[8px] text-white/55 uppercase font-bold tracking-wider">Nomor Anggota Siswa</p>
                  <p className="font-mono text-xs font-bold text-amber-300 tracking-wide">
                    {registeredStudent.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] text-white/55 uppercase font-bold tracking-wider">Nama Lengkap</p>
                  <p className="text-xs font-black tracking-wide text-white truncate max-w-[200px]">
                    {registeredStudent.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] text-white/55 uppercase font-bold tracking-wider">Program Pendidikan</p>
                  <p className="text-[10px] font-semibold text-emerald-300 truncate max-w-[200px]" title={registeredStudent.programJoined}>
                    {registeredStudent.programJoined}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-white/5">
                  <div>
                    <p className="text-[7px] text-white/40 uppercase">Pendidikan</p>
                    <p className="text-[9px] font-bold text-white/80">{registeredStudent.lastEducation}</p>
                  </div>
                  <div>
                    <p className="text-[7px] text-white/40 uppercase">TTL</p>
                    <p className="text-[8px] font-bold text-white/85 truncate">{registeredStudent.birthPlace}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="flex justify-between items-center text-[7px] text-white/40 border-t border-white/10 pt-2.5 mt-3">
              <span>MADIUN, INDONESIA</span>
              <span>DAFTAR: {registeredStudent.registrationDate}</span>
            </div>
          </div>

          {/* Account Portal Details */}
          <div className="max-w-md mx-auto bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl text-left space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 block animate-ping"></span>
              <span>Informasi Login Portal Siswa</span>
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Gunakan kredensial berikut untuk masuk ke Portal Hasil Seleksi & Asesmen Anda secara digital:
            </p>
            <div className="divide-y divide-emerald-100/50 pt-1 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Email Login:</span>
                <strong className="text-slate-800 font-mono tracking-wide">{registeredStudent.email}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 py-1">
                <span className="text-gray-500">No. WhatsApp/HP:</span>
                <strong className="text-slate-800 font-mono tracking-wide">{registeredStudent.phone}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 py-1">
                <span className="text-gray-500">Kata Sandi / Password:</span>
                <span className="bg-emerald-100/60 text-emerald-950 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                  {registeredStudent.password}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 items-center justify-center pt-4">
            <button
              onClick={handleResetForm}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Ulangi / Daftar Baru
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors border"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className="px-5 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors border border-emerald-200"
            >
              Buka Portal Siswa
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
