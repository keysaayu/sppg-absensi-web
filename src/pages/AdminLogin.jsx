import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Daftar kredensial yang valid
  const validCredentials = [
    { user: 'admin', pass: 'admin123' },
    { user: 'admin.sppg', pass: 'admin2026' },
    { user: 'koordinator', pass: 'sppg2026' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      const isValid = validCredentials.some(
        cred => cred.user.toLowerCase() === trimmedUser && cred.pass === trimmedPass
      );

      if (isValid) {
        if (rememberMe) {
          localStorage.setItem('sppg_admin_remember', 'true');
        } else {
          localStorage.removeItem('sppg_admin_remember');
        }
        onLoginSuccess();
      } else {
        setErrorMessage('Username atau kata sandi tidak sesuai. Silakan periksa kembali.');
        setIsLoading(false);
      }
    }, 400);
  };

  const fillDemoAccount = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      
      {/* Ambient soft glow background BGN theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-[#252849]/5 via-[#D9A943]/5 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">

        {/* Card Utama Login Admin */}
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_-5px_rgba(37,40,73,0.08),0_2px_8px_-1px_rgba(37,40,73,0.03)] border border-[#252849]/10 p-6 sm:p-8 transition-all">
          
          {/* Header Identitas Portal */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#252849] text-[#D9A943] border border-[#D9A943]/30 flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#252849]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#252849]/5 text-[#252849] border border-[#252849]/15 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653]"></span>
              Akses Terbatas Petugas SPPG
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#252849] tracking-tight">
              Portal Admin SPPG
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Badan Gizi Nasional • Ciomas Pagelaran 2
            </p>
          </div>

          {/* Alert Error jika login gagal */}
          {errorMessage && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input: Username */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252849] mb-1.5">
                Username Admin
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#252849] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-[#F7F7F3]/70 hover:bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:bg-white transition-all shadow-xs"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Input: Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252849] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#252849] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-[#F7F7F3]/70 hover:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:bg-white transition-all shadow-xs font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[#252849] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Opsi Ingat Saya */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#252849] border-slate-300 focus:ring-[#252849]"
                />
                <span className="text-xs text-slate-600 font-medium">Ingat sesi di perangkat ini</span>
              </label>
            </div>

            {/* Tombol Submit Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-wait'
                  : 'bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] text-white shadow-md shadow-[#252849]/20 active:scale-[0.98] cursor-pointer'
              }`}
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Monitoring'}</span>
              <ArrowRight className="w-4 h-4 text-[#D9A943]" />
            </button>
          </form>

          {/* Kotak Info Akun Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-[#F7F7F3] border border-slate-200/80 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-[#D9A943] shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600">
                  <p className="font-bold text-[#252849]">Kredensial Akses Admin:</p>
                  <p className="mt-0.5 text-slate-500 font-mono">
                    User: <strong className="text-slate-800">admin</strong> • Sandi: <strong className="text-slate-800">admin123</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="shrink-0 text-[11px] font-bold text-[#252849] hover:text-[#D9A943] hover:underline cursor-pointer"
              >
                Gunakan
              </button>
            </div>
          </div>

        </div>

        {/* Tautan Kembali ke Presensi Staf */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#252849] transition-colors"
          >
            <span>← Kembali ke Layar Presensi Staf (Mobile)</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

