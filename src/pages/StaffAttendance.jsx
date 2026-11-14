import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  AlertCircle, 
  Calendar, 
  User, 
  Building2, 
  LogIn, 
  LogOut, 
  Sparkles, 
  ShieldCheck,
  Search,
  X
} from 'lucide-react';

export default function StaffAttendance({ staffList, onRecordAttendance }) {
  // Fitur Ingat Saya di Perangkat Ini (LocalStorage)
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('sppg_remember_staff') === 'true';
  });

  const [selectedStaffId, setSelectedStaffId] = useState(() => {
    const isRemembered = localStorage.getItem('sppg_remember_staff') === 'true';
    if (isRemembered) {
      const savedId = localStorage.getItem('sppg_saved_staff_id');
      return savedId ? Number(savedId) : '';
    }
    return '';
  });

  const [attendanceType, setAttendanceType] = useState('Masuk');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [submittedStatus, setSubmittedStatus] = useState(null);

  // State untuk Searchable Modal Picker
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('Semua');

  const isInGeofence = true;

  // Real-time clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simpan / Hapus pilihan staf ke localStorage sesuai status rememberMe
  useEffect(() => {
    if (rememberMe && selectedStaffId) {
      localStorage.setItem('sppg_remember_staff', 'true');
      localStorage.setItem('sppg_saved_staff_id', String(selectedStaffId));
    } else if (!rememberMe) {
      localStorage.removeItem('sppg_remember_staff');
      localStorage.removeItem('sppg_saved_staff_id');
    }
  }, [rememberMe, selectedStaffId]);

  // Listener tombol keyboard Esc untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPickerOpen) {
        setIsPickerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPickerOpen]);

  // Staf yang sedang aktif terpilih
  const selectedStaff = useMemo(() => {
    return staffList.find((s) => s.id === Number(selectedStaffId)) || null;
  }, [staffList, selectedStaffId]);

  const unitFilterCategories = [
    'Semua', 
    'Pemorsian', 
    'Pengolahan', 
    'Distribusi', 
    'Kebersihan', 
    'Lainnya'
  ];

  // Filter daftar pegawai real-time berdasarkan teks nama dan unit kerja
  const filteredStaffList = useMemo(() => {
    return staffList.filter((staff) => {
      // 1. Pencarian teks nama (case-insensitive)
      const matchesSearch = staff.nama
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      // 2. Filter Kategori Unit Kerja
      if (selectedUnitFilter === 'Semua') return true;

      const unitLower = (staff.unit || '').toLowerCase();
      if (selectedUnitFilter === 'Pemorsian') {
        return unitLower.includes('pemorsian');
      }
      if (selectedUnitFilter === 'Pengolahan') {
        return unitLower.includes('pengolahan') || unitLower.includes('dapur') || unitLower.includes('masak');
      }
      if (selectedUnitFilter === 'Distribusi') {
        return unitLower.includes('distribusi') || unitLower.includes('logistik') || unitLower.includes('gudang');
      }
      if (selectedUnitFilter === 'Kebersihan') {
        return unitLower.includes('kebersihan') || unitLower.includes('cuci') || unitLower.includes('sanitasi');
      }
      if (selectedUnitFilter === 'Lainnya') {
        const isStandard = 
          unitLower.includes('pemorsian') ||
          unitLower.includes('pengolahan') ||
          unitLower.includes('dapur') ||
          unitLower.includes('masak') ||
          unitLower.includes('distribusi') ||
          unitLower.includes('logistik') ||
          unitLower.includes('gudang') ||
          unitLower.includes('kebersihan') ||
          unitLower.includes('cuci') ||
          unitLower.includes('sanitasi');
        return !isStandard;
      }
      return true;
    });
  }, [staffList, searchQuery, selectedUnitFilter]);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    }).replace(/\./g, ':');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleSelectStaff = (staff) => {
    setSelectedStaffId(staff.id);
    setIsPickerOpen(false);
    setSearchQuery('');
    if (submittedStatus) setSubmittedStatus(null);

    if (rememberMe) {
      localStorage.setItem('sppg_remember_staff', 'true');
      localStorage.setItem('sppg_saved_staff_id', String(staff.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaff || !isInGeofence) return;

    const timeStr = `${formatTime(currentTime)} WIB`;
    const isLate = attendanceType === 'Masuk' && currentTime.getHours() >= 7;

    const newRecord = {
      id: Date.now(),
      nama: selectedStaff.nama,
      nip: '', // NIP / ID PEGAWAI DIHAPUS MURNI MENGGUNAKAN NAMA & UNIT
      unit: selectedStaff.unit,
      jamMasuk: attendanceType === 'Masuk' ? timeStr : '-',
      jamPulang: attendanceType === 'Pulang' ? timeStr : 'Belum Pulang',
      deviasiGps: '11.8 m',
      kategori: 'Tetap',
      statusKategori: isLate ? 'Terlambat' : 'Tepat Waktu',
      statusBadgeColor: isLate ? 'amber' : 'emerald',
      keterangan: ''
    };

    onRecordAttendance(newRecord);
    setSubmittedStatus({
      nama: selectedStaff.nama,
      tipe: attendanceType,
      waktu: timeStr,
    });

    // Jika pegawai memilih untuk tidak diingat di perangkat, kosongkan field
    if (!rememberMe) {
      setSelectedStaffId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      
      {/* Ambient soft glow background BGN theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-80 bg-gradient-to-b from-[#252849]/5 via-[#D9A943]/5 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">

        {/* 1. Header Minimalis SPPG (Badan Gizi Nasional) */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#252849]/10 text-[#252849] rounded-full text-[11px] font-semibold mb-2.5 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A2C653] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A2C653]"></span>
            </span>
            <span className="tracking-wide">Presensi Digital Mandiri</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#D9A943] font-bold">BGN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#252849]">
            SPPG CIOMAS PAGELARAN 2
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Badan Gizi Nasional • Satuan Pelayanan Pemenuhan Gizi
          </p>
        </div>

        {/* 2. Satu Kartu Putih Terpadu (Single Card Mobile) */}
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_-5px_rgba(37,40,73,0.08),0_2px_8px_-1px_rgba(37,40,73,0.03)] border border-[#252849]/10 p-5 sm:p-6 transition-all">
          
          {/* Bagian Atas Kartu: Header Info (Jam Digital, Tanggal, & Badge Status GPS) */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                WAKTU PRESENSI
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-black text-[#252849] tracking-tight leading-none flex items-baseline gap-1.5">
                {formatTime(currentTime)}
                <span className="text-xs font-bold text-[#D9A943] font-sans tracking-normal">WIB</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D9A943] shrink-0" />
                <span>{formatDate(currentTime)}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              {isInGeofence ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A2C653]/15 text-[#4e6a1a] border border-[#A2C653]/40 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A2C653] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A2C653]"></span>
                  </span>
                  Radius Valid • Area SPPG
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-full text-[11px] sm:text-xs font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Di Luar Radius SPPG
                </span>
              )}
            </div>
          </div>

          {/* Divider: Garis Batas Tipis Halus */}
          <div className="border-b border-slate-100 my-5"></div>

          {/* Notifikasi Pop-up Sukses */}
          {submittedStatus && (
            <div className="mb-4 bg-gradient-to-r from-[#252849] to-[#343864] text-white p-3.5 rounded-xl shadow-md border-l-4 border-[#D9A943] flex items-start gap-3 animate-in fade-in duration-200">
              <div className="p-1.5 bg-white/10 rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#A2C653]" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-sm text-white">Presensi Berhasil Dicatat!</p>
                <p className="opacity-95 font-medium mt-0.5">{submittedStatus.nama}</p>
                <p className="text-white/80 text-[11px] mt-0.5 flex items-center gap-1">
                  <span>Presensi {submittedStatus.tipe}</span>
                  <span className="text-[#D9A943] font-semibold">({submittedStatus.waktu})</span>
                </p>
              </div>
            </div>
          )}

          {/* 3. Formulir Presensi */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input: Nama Pegawai (Searchable Modal Picker Trigger) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252849]">
                  NAMA PEGAWAI
                </label>
                {selectedStaff && (
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="text-[11px] font-bold text-[#252849] hover:text-[#D9A943] transition-colors cursor-pointer"
                  >
                    Ganti Nama
                  </button>
                )}
              </div>

              {selectedStaff ? (
                /* Tampilan ketika nama sudah dipilih */
                <div 
                  onClick={() => setIsPickerOpen(true)}
                  className="w-full bg-[#F7F7F3]/80 hover:bg-white border border-slate-200 hover:border-[#252849]/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#252849]/10 text-[#252849] font-bold text-xs flex items-center justify-center shrink-0 border border-[#252849]/15">
                      {getInitials(selectedStaff.nama)}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="font-semibold text-sm text-[#252849] truncate">
                        {selectedStaff.nama}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {selectedStaff.unit}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 group-hover:text-[#252849] transition-colors shrink-0">
                    Ubah
                  </span>
                </div>
              ) : (
                /* Tampilan input trigger ketika belum memilih nama */
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="w-full bg-[#F7F7F3]/80 hover:bg-white border border-slate-200 hover:border-[#252849]/40 rounded-xl pl-10 pr-4 py-3 text-sm text-left font-medium text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:bg-white transition-all cursor-pointer shadow-xs flex items-center justify-between relative group"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-hover:text-[#252849] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="truncate">Sentuh untuk cari nama Anda...</span>
                  <Search className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#252849] transition-colors" />
                </button>
              )}

              {/* Checkbox Ingat Saya di Perangkat Ini */}
              <div className="mt-2.5 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#252849] border-slate-300 focus:ring-[#252849] cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Ingat saya di perangkat ini
                  </span>
                </label>
                {rememberMe && selectedStaff && (
                  <span className="text-[10px] text-[#4e6a1a] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653]"></span>
                    Tersimpan
                  </span>
                )}
              </div>
            </div>

            {/* Input: Unit Kerja (Visual Feedback Terkunci) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252849]">
                  UNIT KERJA
                </label>
                {selectedStaff && (
                  <span className="text-[10px] font-bold text-[#b88a2e] flex items-center gap-1 bg-[#D9A943]/10 px-2 py-0.5 rounded-md border border-[#D9A943]/30">
                    <Sparkles className="w-3 h-3 text-[#D9A943]" /> Terdeteksi Otomatis
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Building2 className={`w-4 h-4 transition-colors ${selectedStaff ? 'text-[#252849]' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  readOnly
                  value={selectedStaff ? selectedStaff.unit : 'Otomatis terisi setelah memilih nama'}
                  className={`w-full rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm border transition-all shadow-xs ${
                    selectedStaff 
                      ? 'bg-[#A2C653]/15 border-[#A2C653]/40 text-[#252849] font-bold' 
                      : 'bg-[#F7F7F3] border-slate-200 text-slate-400 italic'
                  }`}
                />
              </div>
            </div>

            {/* Toggle: Tipe Presensi (Masuk vs Pulang) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#252849] mb-1.5">
                TIPE PRESENSI
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F7F7F3] border border-slate-200/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAttendanceType('Masuk')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    attendanceType === 'Masuk'
                      ? 'bg-[#252849] text-white shadow-sm ring-1 ring-[#252849]'
                      : 'text-slate-600 hover:text-[#252849] hover:bg-white/80 active:scale-[0.98]'
                  }`}
                >
                  <LogIn className={`w-4 h-4 shrink-0 ${attendanceType === 'Masuk' ? 'text-[#A2C653]' : 'text-slate-400'}`} />
                  <span>Presensi Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceType('Pulang')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    attendanceType === 'Pulang'
                      ? 'bg-[#D9A943] text-white shadow-sm ring-1 ring-[#D9A943]'
                      : 'text-slate-600 hover:text-[#252849] hover:bg-white/80 active:scale-[0.98]'
                  }`}
                >
                  <LogOut className={`w-4 h-4 shrink-0 ${attendanceType === 'Pulang' ? 'text-white' : 'text-slate-400'}`} />
                  <span>Presensi Pulang</span>
                </button>
              </div>
            </div>

            {/* Tombol: Catat Presensi */}
            <button
              type="submit"
              disabled={!selectedStaff || !isInGeofence}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                selectedStaff && isInGeofence
                  ? 'bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] text-white shadow-md shadow-[#252849]/20 active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${selectedStaff && isInGeofence ? 'text-[#D9A943]' : 'text-slate-400'}`} />
              <span>Catat Presensi Sekarang</span>
            </button>
          </form>

          {!isInGeofence && (
            <p className="mt-3 text-center text-xs text-rose-500 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Di luar radius kantor SPPG. Presensi dikunci.
            </p>
          )}
        </div>

        {/* Footer Minimalis & Profesional */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9A943]" />
            Sistem Presensi Geofence Terverifikasi
          </p>
          <p className="text-[10px] text-slate-400">
            Badan Gizi Nasional • SPPG Ciomas Pagelaran 2
          </p>
        </div>

      </div>

      {/* =========================================================
          SEARCHABLE MODAL / BOTTOM SHEET PICKER NAMA PEGAWAI
         ========================================================= */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setIsPickerOpen(false)}
            className="fixed inset-0 bg-[#252849]/60 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-label="Tutup pencarian"
          />

          {/* Modal / Bottom Sheet Container */}
          <div className="relative w-full sm:max-w-md max-h-[85vh] sm:max-h-[82vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            
            {/* Grab Handle bar (khusus tampilan mobile) */}
            <div className="pt-3 pb-1 sm:hidden flex justify-center">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#252849]">
                  Cari & Pilih Nama Pegawai
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sentuh nama Anda untuk melanjutkan presensi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-[#252849] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar Input */}
            <div className="p-4 border-b border-slate-100 bg-[#F7F7F3]/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama Anda..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tab Filter Cepat Unit Kerja */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 overflow-x-auto bg-[#F7F7F3]/70 scrollbar-none">
              {unitFilterCategories.map((category) => {
                const isActive = selectedUnitFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedUnitFilter(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#252849] text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:text-[#252849] hover:bg-slate-50 border border-slate-200/70'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Daftar Pegawai (Bersih tanpa NIP) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
              {filteredStaffList.length > 0 ? (
                <div className="space-y-1">
                  {filteredStaffList.map((staff) => {
                    const isSelected = selectedStaffId === staff.id;
                    return (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => handleSelectStaff(staff)}
                        className={`w-full p-3 rounded-xl flex items-center justify-between gap-3 transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#252849]/5 border border-[#252849]/20'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar Inisial Lingkaran Warna Soft */}
                          <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-[#252849] text-[#D9A943] border-[#D9A943]/40'
                              : 'bg-[#252849]/10 text-[#252849] border-[#252849]/15'
                          }`}>
                            {getInitials(staff.nama)}
                          </div>
                          
                          {/* Nama Lengkap & Badge Unit */}
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-800 truncate">
                              {staff.nama}
                            </p>
                            <div className="mt-0.5">
                              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/70">
                                {staff.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Indikator Terpilih */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-[#252849] text-white flex items-center justify-center shadow-xs">
                              <CheckCircle2 className="w-4 h-4 text-[#A2C653]" />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* State Kosong jika tidak ditemukan */
                <div className="py-12 text-center text-slate-400">
                  <User className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-700 text-xs">Nama tidak ditemukan</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    {searchQuery 
                      ? `Tidak ada pegawai dengan nama "${searchQuery}" pada filter "${selectedUnitFilter}".`
                      : `Belum ada pegawai pada kategori unit "${selectedUnitFilter}".`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedUnitFilter('Semua');
                    }}
                    className="mt-3 text-xs font-bold text-[#252849] hover:text-[#D9A943] underline cursor-pointer"
                  >
                    Reset Filter & Pencarian
                  </button>
                </div>
              )}
            </div>

            {/* Footer Modal Ringkas */}
            <div className="p-3 bg-[#F7F7F3] border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 font-medium">
                Menampilkan {filteredStaffList.length} dari {staffList.length} staf terdaftar
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
