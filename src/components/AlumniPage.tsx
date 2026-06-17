/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Alumni } from '../types';
import { GraduationCap, Award, Calendar, Search, Trophy } from 'lucide-react';

interface AlumniPageProps {
  alumniList: Alumni[];
}

export default function AlumniPage({ alumniList }: AlumniPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [yearFilter, setYearFilter] = React.useState('All');

  // Extract unique graduation years for filter dropdown
  const uniqueYears = Array.from(new Set(alumniList.map(a => a.graduationYear)))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a)); // Descending year

  const filteredAlumni = alumniList.filter(a => {
    const matchesSearch = a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.achievement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'All' || a.graduationYear === yearFilter;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 text-center" id="alumni-page-viewport">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-850 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
          <GraduationCap className="w-4 h-4" />
          <span>Hall of Fame & Alumni Resmi</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Siswa Sukses & Lulusan <span className="text-emerald-800 bg-emerald-50/75 px-3 py-1 rounded-2xl">Bimbel Azta</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
          Kami bangga mempersembahkan para patriot, taruna, bintara, dan profesional sukses yang telah melewati pembekalan psikotes kognitif dan pembinaan mental bersama Azta Best Choice.
        </p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-850 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">1,500+</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Lulusan Berhasil</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">94.8%</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tingkat Kelulusan Psikotes</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">12+ Tahun</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kemitraan Pendampingan</p>
        </div>
      </div>

      {/* Interactive Filter Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-150 max-w-5xl mx-auto shadow-xs">
        <div className="relative flex-grow max-w-md text-left">
          <span className="absolute inset-y-0 left-0 hover:text-slate-800 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama alumni atau prestasi kelolosan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition-all outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Kelulusan:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="p-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border-none rounded-2xl cursor-pointer transition-all"
          >
            <option value="All">Semua Angkatan</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>Angkatan {year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni Photo Collage Grid with entry transitions */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        id="alumni-gallery-grid"
      >
        {filteredAlumni.map((alum) => (
          <motion.div
            layout
            key={alum.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="bg-white border rounded-[2rem] overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-700/30 transition-all group duration-300 flex flex-col h-full text-left"
          >
            {/* Aspect Ratio Box containing Photo */}
            <div className="h-64 sm:h-72 w-full bg-slate-100 relative overflow-hidden shrink-0">
              <img
                src={alum.photoUrl}
                alt={alum.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-transparent opacity-60"></div>
              
              {/* Achievement Badge overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block bg-emerald-900 text-white font-mono text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-800">
                  Angkatan {alum.graduationYear}
                </span>
              </div>
            </div>

            {/* Details area */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {alum.fullName}
                </h3>
                <div className="flex items-start space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    {alum.achievement}
                  </p>
                </div>
              </div>

              {/* Congratulatory signature */}
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verifikasi Resmi</span>
                <span className="text-[10.5px] font-bold text-emerald-850">Lulus ✓</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAlumni.length === 0 && (
          <div className="col-span-full py-20 px-4 text-center bg-white border border-dashed rounded-3xl space-y-2">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Tidak ada Alumni Terdata</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Sesuaikan filter atau kata kunci Anda untuk menemukan alumni bimbingan kami.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
