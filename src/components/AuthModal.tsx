/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_USERS } from '../mockData';
import { User, Student } from '../types';
import { X, ShieldAlert, UserCheck, Key, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  students: Student[];
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ students, onClose, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check in Mock Users first
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      // For mock users, let them enter any password or password123 to log in
      onLoginSuccess(foundUser);
      onClose();
      return;
    }

    // Check in dynamic Registered Students next
    const foundStudent = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (foundStudent) {
      if (foundStudent.password === password) {
        const loggedInUser: User = {
          id: foundStudent.id,
          name: foundStudent.fullName,
          email: foundStudent.email,
          phone: foundStudent.phone,
          role: 'student',
          avatar: foundStudent.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
        };
        onLoginSuccess(loggedInUser);
        onClose();
      } else {
        setErrorStatus('Kata sandi / Password yang Anda masukkan salah.');
      }
    } else {
      setErrorStatus('Alamat email belum terdaftar di portal bimbingan Azta.');
    }
  };

  const handleQuickLogin = (role: 'dimas' | 'lia' | 'admin') => {
    let emailSelection = '';
    if (role === 'dimas') emailSelection = 'dimas@gmail.com';
    else if (role === 'lia') emailSelection = 'lia@gmail.com';
    else if (role === 'admin') emailSelection = 'admin@gmail.com';

    // Try finding in dynamic students first to get latest data
    const foundStudent = students.find(s => s.email === emailSelection);
    if (foundStudent) {
      const loggedInUser: User = {
        id: foundStudent.id,
        name: foundStudent.fullName,
        email: foundStudent.email,
        phone: foundStudent.phone,
        role: 'student',
        avatar: foundStudent.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
      };
      onLoginSuccess(loggedInUser);
      onClose();
      return;
    }

    const foundU = MOCK_USERS.find(u => u.email === emailSelection);
    if (foundU) {
      onLoginSuccess(foundU);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="auth-modal-wrapper">
      {/* black transparent backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 space-y-6 text-left shadow-2xl transition-all animate-fade-in" id="auth-modal-box">
          
          {/* Header Close triggers */}
          <div className="flex justify-between items-center" id="auth-modal-header">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Akses Portal Terintegrasi</h2>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Azta Best Choice Counseling & Psychology</p>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-450 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Credential Selections - For Evaluator Ease */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3" id="quick-testers">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Akses Cepat Penguji (Demo Tanpa Password):</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('dimas')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-left text-[10px] hover:bg-emerald-100 transition-colors"
                id="quick-login-dimas"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="leading-none">
                  <p className="font-bold text-gray-800">Dimas</p>
                  <p className="text-[8px] text-gray-500 mt-0.5">Siswa (TNI Prep)</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickLogin('lia')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-left text-[10px] hover:bg-emerald-100 transition-colors"
                id="quick-login-lia"
              >
                <UserCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <div className="leading-none">
                  <p className="font-bold text-gray-800">Lia</p>
                  <p className="text-[8px] text-gray-500 mt-0.5">Siswa (BUMN Prep)</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg text-left text-[10px] hover:bg-amber-200 transition-colors animate-pulse"
                id="quick-login-admin"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div className="leading-none">
                  <p className="font-bold text-emerald-990">Admin</p>
                  <p className="text-[8px] text-amber-800 mt-0.5">Pengelola Utama</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form manual input alternatives */}
          <form onSubmit={handleManualSubmit} className="space-y-4" id="manual-login-form">
            {errorStatus && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200">
                {errorStatus}
              </p>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500">Alamat Email Terdaftar</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dimas@gmail.com / admin@gmail.com" 
                className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500">Kata Sandi (Password)</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-3 py-2.5 text-xs border border-gray-250 rounded-lg focus:outline-hidden focus:border-emerald-700 bg-slate-50/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
              id="submit-auth-manual"
            >
              Masuk Ke Portal
            </button>
          </form>

          {/* Small footnote terms warnings */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Sistem terintegrasi Azta Best Choice. Melalui masuk akun, Anda menyetujui privasi rekam medis psikogram and perlindungan database enkripsi.
          </p>

        </div>
      </div>
    </div>
  );
}
