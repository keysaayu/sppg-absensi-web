import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  UserCheck,
  Users,
  Clock,
  MapPin,
  Printer,
  LogOut,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building2,
  AlertCircle,
  Calendar,
  UserPlus,
  Pencil,
  Menu,
  X,
  Plus,
  Info,
  UtensilsCrossed,
  Flame,
  Truck,
  Sparkles,
  HeartPulse,
  Wrench,
  Layers,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import TitikLokasi from '../components/TitikLokasi';
import PelaporanRekap from '../components/PelaporanRekap';

export const initialUnitList = [
  {
    id: 1,
    nama: "Unit Pemorsian",
    kategori: "Operasional Tim",
    jamMasuk: "06:30 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 2,
    icon: "UtensilsCrossed",
    color: "blue"
  },
  {
    id: 2,
    nama: "Unit Pengolahan (Dapur)",
    kategori: "Operasional Tim",
    jamMasuk: "05:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 3,
    icon: "Flame",
    color: "amber"
  },
  {
    id: 3,
    nama: "Unit Distribusi",
    kategori: "Operasional Tim",
    jamMasuk: "08:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 2,
    icon: "Truck",
    color: "emerald"
  },
  {
    id: 4,
    nama: "Unit Kebersihan & Cuci",
    kategori: "Operasional Tim",
    jamMasuk: "07:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 2,
    icon: "Sparkles",
    color: "teal"
  },
  {
    id: 5,
    nama: "Unit Persiapan Bahan",
    kategori: "Operasional Tim",
    jamMasuk: "04:30 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "Layers",
    color: "blue"
  },
  {
    id: 6,
    nama: "Unit Packing & Label",
    kategori: "Operasional Tim",
    jamMasuk: "07:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "Package",
    color: "amber"
  },
  {
    id: 7,
    nama: "Unit Logistik & Gudang",
    kategori: "Operasional Tim",
    jamMasuk: "07:30 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "Building2",
    color: "indigo"
  },
  {
    id: 8,
    nama: "Ahli Gizi & Mutu",
    kategori: "Fungsional / Mandiri",
    jamMasuk: "07:30 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "HeartPulse",
    color: "purple"
  },
  {
    id: 9,
    nama: "Asisten Lapangan (Aslap)",
    kategori: "Fungsional / Mandiri",
    jamMasuk: "07:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "Wrench",
    color: "purple"
  },
  {
    id: 10,
    nama: "Administrasi & Keuangan",
    kategori: "Fungsional / Mandiri",
    jamMasuk: "08:00 WIB",
    jamPulang: "Fleksibel (Selesai Tugas)",
    jumlahStaf: 1,
    icon: "Users",
    color: "purple"
  }
];

export default function AdminDashboard({
  staffList,
  logs,
  onRecordAttendance,
  onDeleteAttendance,
  onAddStaff,
  onEditStaff,
  onDeleteStaff
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sppg_admin_authenticated') === 'true';
  });

  const [activeMenu, setActiveMenu] = useState('monitoring');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('Semua');

  // Menutup sidebar otomatis saat ukuran layar membesar ke desktop (>= 1024px / lg)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menutup sidebar saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // State untuk Master Pegawai
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormNama, setStaffFormNama] = useState('');
  const [staffFormNip, setStaffFormNip] = useState('');
  const [staffFormUnit, setStaffFormUnit] = useState('Unit Pemorsian');
  const [masterSearchQuery, setMasterSearchQuery] = useState('');
  const [masterUnitFilter, setMasterUnitFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State untuk Unit & Jam Kerja
  const [unitList, setUnitList] = useState(() => {
    const saved = localStorage.getItem('sppg_unit_list_v3');
    return saved ? JSON.parse(saved) : initialUnitList;
  });

  useEffect(() => {
    localStorage.setItem('sppg_unit_list_v3', JSON.stringify(unitList));
  }, [unitList]);

  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [unitCategoryFilter, setUnitCategoryFilter] = useState('Semua');
  const [unitCurrentPage, setUnitCurrentPage] = useState(1);
  const unitItemsPerPage = 10;

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitFormNama, setUnitFormNama] = useState('');
  const [unitFormKategori, setUnitFormKategori] = useState('Operasional Tim');
  const [unitFormJamMasuk, setUnitFormJamMasuk] = useState('06:30 WIB');
  const [unitFormStaf, setUnitFormStaf] = useState(1);

  // Form Pengecualian / Sakit / Pocokan
  const [tipeInput, setTipeInput] = useState('pocokan'); // 'pocokan' | 'sakit'
  const [pocokanNama, setPocokanNama] = useState('');
  const [replacedStaffId, setReplacedStaffId] = useState('');
  const [pocokanUnit, setPocokanUnit] = useState('Unit Pemorsian');
  const [upahHarian, setUpahHarian] = useState('120000');

  const [sakitStaffId, setSakitStaffId] = useState('');
  const [sakitAlasan, setSakitAlasan] = useState('Sakit resmi tercatat di portal admin');

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Perhitungan KPI Card
  const totalPegawaiTetap = staffList.length;
  const hadirTepatWaktu = logs.filter(l => l.statusKategori === 'Tepat Waktu').length;
  const terlambat = logs.filter(l => l.statusKategori === 'Terlambat').length;
  const totalPocokan = logs.filter(l => l.kategori === 'Pocokan').length;
  const totalIzinSakit = logs.filter(l => l.kategori === 'Pengecualian').length;
  const totalPocokanPengecualian = totalPocokan + totalIzinSakit;

  // Filter Tabel Log
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.nip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnitFilter === 'Semua' || log.unit.toLowerCase().includes(selectedUnitFilter.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  const handleExportCSV = () => {
    const header = ["Pegawai", "NIP", "Unit Penempatan", "Jam Masuk", "Jam Pulang", "Deviasi GPS", "Status & Kategori", "Keterangan"];
    const rows = filteredLogs.map(l => [
      `"${l.nama}"`,
      `"${l.nip}"`,
      `"${l.unit}"`,
      `"${l.jamMasuk}"`,
      `"${l.jamPulang}"`,
      `"${l.deviasiGps}"`,
      `"${l.statusKategori}"`,
      `"${l.keterangan || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Presensi_SPPG_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimpanPengecualian = (e) => {
    e.preventDefault();
    if (tipeInput === 'pocokan') {
      const replaced = staffList.find(s => s.id === Number(replacedStaffId));
      if (!pocokanNama || !replaced) return;

      const newLog = {
        id: Date.now(),
        nama: `${pocokanNama} (Pocokan)`,
        nip: `POC-${Math.floor(1000 + Math.random() * 9000)}`,
        unit: pocokanUnit,
        jamMasuk: "06:00:00 WIB",
        jamPulang: "14:00:00 WIB",
        deviasiGps: "12 m",
        kategori: "Pocokan",
        statusKategori: `POCOKAN (Rp ${Number(upahHarian).toLocaleString('id-ID')})`,
        statusBadgeColor: "purple",
        keterangan: `Pengganti ${replaced.nama}`
      };
      onRecordAttendance(newLog);
      setFeedbackMsg(`Staf pocokan ${pocokanNama} berhasil dicatat.`);
      setPocokanNama('');
      setReplacedStaffId('');
    } else {
      const staff = staffList.find(s => s.id === Number(sakitStaffId));
      if (!staff) return;

      const newLog = {
        id: Date.now(),
        nama: staff.nama,
        nip: staff.nip,
        unit: staff.unit,
        jamMasuk: "-",
        jamPulang: "Belum Pulang",
        deviasiGps: "-",
        kategori: "Pengecualian",
        statusKategori: "SAKIT",
        statusBadgeColor: "rose",
        keterangan: sakitAlasan
      };
      onRecordAttendance(newLog);
      setFeedbackMsg(`Status Sakit untuk ${staff.nama} berhasil dicatat.`);
      setSakitStaffId('');
    }
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Filter & Handlers untuk Master Pegawai
  const filteredMasterStaff = staffList.filter((s) => {
    const matchesSearch = s.nama.toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
                          s.nip.toLowerCase().includes(masterSearchQuery.toLowerCase());
    const matchesUnit = masterUnitFilter === 'Semua' || s.unit.toLowerCase() === masterUnitFilter.toLowerCase();
    return matchesSearch && matchesUnit;
  });

  const totalPages = Math.ceil(filteredMasterStaff.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredMasterStaff.length);
  const displayedStaff = filteredMasterStaff.slice(startIndex, endIndex);

  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setStaffFormNama('');
    const nextNum = staffList.length + 1;
    setStaffFormNip(`SPPG-2026-${String(nextNum).padStart(3, '0')}`);
    setStaffFormUnit('Unit Pemorsian');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setStaffFormNama(staff.nama);
    setStaffFormNip(staff.nip);
    setStaffFormUnit(staff.unit);
    setIsModalOpen(true);
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffFormNama.trim() || !staffFormNip.trim()) return;

    if (editingStaff) {
      if (onEditStaff) {
        onEditStaff({
          id: editingStaff.id,
          nama: staffFormNama.trim(),
          nip: staffFormNip.trim(),
          unit: staffFormUnit
        });
      }
      setFeedbackMsg(`Data pegawai "${staffFormNama.trim()}" berhasil diperbarui.`);
    } else {
      if (onAddStaff) {
        onAddStaff({
          id: Date.now(),
          nama: staffFormNama.trim(),
          nip: staffFormNip.trim(),
          unit: staffFormUnit
        });
      }
      setFeedbackMsg(`Pegawai baru "${staffFormNama.trim()}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteStaffClick = (staff) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pegawai "${staff.nama}" (${staff.nip})?\nPegawai ini tidak akan muncul lagi di formulir presensi.`)) {
      if (onDeleteStaff) {
        onDeleteStaff(staff.id);
      }
      setFeedbackMsg(`Pegawai "${staff.nama}" berhasil dihapus.`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  // Filter & Handlers untuk Unit & Jam Kerja
  const filteredUnits = unitList.filter((u) => {
    const matchesSearch = u.nama.toLowerCase().includes(unitSearchQuery.toLowerCase());
    const matchesCategory = unitCategoryFilter === 'Semua' || u.kategori === unitCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const unitTotalPages = Math.ceil(filteredUnits.length / unitItemsPerPage) || 1;
  const unitStartIndex = (unitCurrentPage - 1) * unitItemsPerPage;
  const unitEndIndex = Math.min(unitStartIndex + unitItemsPerPage, filteredUnits.length);
  const displayedUnits = filteredUnits.slice(unitStartIndex, unitEndIndex);

  const totalUnitsCount = unitList.length;
  const timCount = unitList.filter(u => u.kategori === 'Operasional Tim').length;
  const mandiriCount = unitList.filter(u => u.kategori === 'Fungsional / Mandiri').length;
  const totalStafCount = unitList.reduce((acc, u) => acc + (Number(u.jumlahStaf) || 1), 0);

  const handleOpenAddUnitModal = () => {
    setEditingUnit(null);
    setUnitFormNama('');
    setUnitFormKategori('Operasional Tim');
    setUnitFormJamMasuk('06:30 WIB');
    setUnitFormStaf(1);
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnitModal = (unit) => {
    setEditingUnit(unit);
    setUnitFormNama(unit.nama);
    setUnitFormKategori(unit.kategori);
    setUnitFormJamMasuk(unit.jamMasuk);
    setUnitFormStaf(unit.jumlahStaf || 1);
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    if (!unitFormNama.trim()) return;

    if (editingUnit) {
      setUnitList(prev => prev.map(u => u.id === editingUnit.id ? {
        ...u,
        nama: unitFormNama.trim(),
        kategori: unitFormKategori,
        jamMasuk: unitFormJamMasuk.trim(),
        jamPulang: "Fleksibel (Selesai Tugas)",
        jumlahStaf: Number(unitFormStaf) || 1
      } : u));
      setFeedbackMsg(`Aturan unit "${unitFormNama.trim()}" berhasil diperbarui.`);
    } else {
      const newUnit = {
        id: Date.now(),
        nama: unitFormNama.trim(),
        kategori: unitFormKategori,
        jamMasuk: unitFormJamMasuk.trim(),
        jamPulang: "Fleksibel (Selesai Tugas)",
        jumlahStaf: Number(unitFormStaf) || 1,
        icon: unitFormKategori === 'Operasional Tim' ? 'Building2' : 'Users',
        color: unitFormKategori === 'Operasional Tim' ? 'blue' : 'purple'
      };
      setUnitList(prev => [...prev, newUnit]);
      setFeedbackMsg(`Unit kerja baru "${unitFormNama.trim()}" berhasil ditambahkan.`);
    }

    setIsUnitModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteUnitClick = (unit) => {
    if (confirm(`Apakah Anda yakin ingin menghapus unit kerja "${unit.nama}"?`)) {
      setUnitList(prev => prev.filter(u => u.id !== unit.id));
      setFeedbackMsg(`Unit kerja "${unit.nama}" berhasil dihapus.`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const renderUnitIconSmall = (iconName, color) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      teal: 'bg-teal-50 text-teal-600 border-teal-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    };
    const chosenClass = colorClasses[color] || 'bg-blue-50 text-blue-600 border-blue-100';

    let IconComp = Building2;
    if (iconName === 'UtensilsCrossed') IconComp = UtensilsCrossed;
    else if (iconName === 'Flame') IconComp = Flame;
    else if (iconName === 'Truck') IconComp = Truck;
    else if (iconName === 'Sparkles') IconComp = Sparkles;
    else if (iconName === 'HeartPulse') IconComp = HeartPulse;
    else if (iconName === 'Wrench') IconComp = Wrench;
    else if (iconName === 'Layers') IconComp = Layers;
    else if (iconName === 'Package') IconComp = Package;
    else if (iconName === 'Users') IconComp = Users;

    return (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${chosenClass}`}>
        <IconComp className="w-4 h-4" />
      </div>
    );
  };

  const menuItems = [
    { id: 'monitoring', label: 'Monitoring Presensi', icon: BarChart3 },
    { id: 'pengecualian', label: 'Pengecualian & Pocokan', icon: UserCheck },
    { id: 'master', label: 'Master Pegawai', icon: Users },
    { id: 'unit_jam', label: 'Unit & Jam Kerja', icon: Clock },
    { id: 'titik_lokasi', label: 'Titik Lokasi Kantor', icon: MapPin },
    { id: 'laporan', label: 'Pelaporan & Rekap', icon: Printer },
  ];

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi admin?")) {
      setIsAuthenticated(false);
      localStorage.removeItem('sppg_admin_authenticated');
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          localStorage.setItem('sppg_admin_authenticated', 'true');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen h-screen bg-[#F7F7F3] flex text-[#252849] font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white">

      {/* =========================================
          BACKDROP OVERLAY (Mobile / Tablet di bawah lg)
         ========================================= */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#252849]/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 print:hidden"
          aria-label="Tutup sidebar"
        />
      )}

      {/* =========================================
          SIDEBAR KIRI (Navigasi Kiri)
         ========================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 print:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        <div>
          {/* Header Identitas Admin (Badan Gizi Nasional Theme) */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#252849] text-[#D9A943] border border-[#D9A943]/30 flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-sm shadow-[#252849]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e6a1a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653] animate-pulse"></span> Sesi Login Aktif
                </span>
                <h2 className="text-xs font-bold text-[#252849] leading-snug truncate" title="Administrator SPPG Ciomas Pagelaran 2">
                  Administrator SPPG
                </h2>
                <p className="text-[11px] text-slate-400 truncate">Ciomas Pagelaran 2 • BGN</p>
              </div>
            </div>

            {/* Tombol Tutup Silang (Hanya tampil di bawah breakpoint lg) */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-[#252849] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Tutup Menu"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Menu Navigasi */}
          <nav className="p-3 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Navigasi
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                    ? 'bg-[#252849]/8 text-[#252849] font-bold border-l-4 border-[#252849] shadow-2xs'
                    : 'text-slate-600 hover:bg-[#F7F7F3] hover:text-[#252849]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#252849]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar (Keluar & Tombol Cek Halaman HP) */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-[#F7F7F3]/70">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#252849] bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
          >
            <span>Buka Layar HP Staf</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Keluar Sesi</span>
          </button>
        </div>

      </aside>

      {/* =========================================
          KONTAINER KONTEN UTAMA (Kanan)
         ========================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:w-full">

        {/* Topbar / Header Atas */}
        <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shrink-0 print:hidden">
          {/* Sisi Kiri: Hamburger Menu Button (Mobile/Tablet) & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Buka Menu"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs overflow-hidden">
              <span className="text-slate-400 font-medium whitespace-nowrap">
                {['master', 'unit_jam'].includes(activeMenu) 
                  ? 'Master Data' 
                  : activeMenu === 'titik_lokasi'
                  ? 'Pengaturan'
                  : activeMenu === 'laporan'
                  ? 'Laporan'
                  : 'Monitoring'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#252849] font-bold truncate">
                {activeMenu === 'master' 
                  ? 'Master Pegawai' 
                  : activeMenu === 'unit_jam'
                  ? 'Unit & Jam Kerja'
                  : activeMenu === 'titik_lokasi'
                  ? 'Titik Lokasi Kantor'
                  : activeMenu === 'laporan'
                  ? 'Pelaporan & Rekap'
                  : (menuItems.find(m => m.id === activeMenu)?.label || 'Monitoring Presensi')}
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Tanggal Hari Ini & Profil Admin Ringkas */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium border-r border-slate-200 pr-4">
              <Calendar className="w-3.5 h-3.5 text-[#D9A943]" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#252849] text-[#D9A943] border border-[#D9A943]/30 font-bold text-xs flex items-center justify-center shadow-xs">
                AD
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-bold text-[#252849] block">Admin SPPG</span>
                <span className="text-[10px] text-[#4e6a1a] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653]"></span>
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Area Konten Halaman (Main) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:m-0 print:overflow-visible">

          {/* Banner Feedback */}
          {feedbackMsg && (
            <div className="mb-6 p-4 bg-[#A2C653]/15 border border-[#A2C653]/35 text-[#2e4210] rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#4e6a1a] shrink-0" />
              {feedbackMsg}
            </div>
          )}

          {/* KONTEN MENU 1: MONITORING */}
          {activeMenu === 'monitoring' && (
            <>
              {/* Topbar Info & Title */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl font-extrabold text-[#252849] tracking-tight">
                    Dashboard Monitoring Presensi
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Satuan Pelayanan Pemenuhan Gizi (SPPG) Ciomas Pagelaran 2
                  </p>
                </div>
              </div>

            {/* 4 KPI CARDS HORIZONTAL (Badan Gizi Nasional Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

              {/* Card 1: Total Pegawai Tetap */}
              <div className="bg-white rounded-2xl p-5 border border-[#252849]/10 shadow-xs hover:shadow-card transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pegawai Tetap</p>
                  <div className="w-8 h-8 rounded-lg bg-[#252849]/10 text-[#252849] border border-[#252849]/15 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-3xl font-extrabold text-[#252849] tracking-tight">{totalPegawaiTetap}</span>
                  <span className="text-xs font-semibold text-slate-500">Pegawai</span>
                </div>
                <p className="text-[11px] text-[#252849] font-semibold mt-1">Aktif terdaftar SPPG</p>
              </div>

              {/* Card 2: Hadir Tepat Waktu */}
              <div className="bg-white rounded-2xl p-5 border border-[#A2C653]/30 shadow-xs hover:shadow-card transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tepat Waktu</p>
                  <div className="w-8 h-8 rounded-lg bg-[#A2C653]/15 text-[#4e6a1a] border border-[#A2C653]/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-extrabold text-[#4e6a1a] tracking-tight">{hadirTepatWaktu}</span>
                </div>
                <p className="text-[11px] text-[#4e6a1a] font-semibold mt-1">Sesuai shift operasional</p>
              </div>

              {/* Card 3: Terlambat */}
              <div className="bg-white rounded-2xl p-5 border border-[#D9A943]/30 shadow-xs hover:shadow-card transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Terlambat</p>
                  <div className="w-8 h-8 rounded-lg bg-[#D9A943]/15 text-[#9a6f19] border border-[#D9A943]/30 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-extrabold text-[#9a6f19] tracking-tight">{terlambat}</span>
                </div>
                <p className="text-[11px] text-[#9a6f19] font-semibold mt-1">Di atas batas jam masuk</p>
              </div>

              {/* Card 4: Pocokan / Pengecualian */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-card transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pocokan / Izin</p>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#252849] border border-slate-200 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-3xl font-extrabold text-[#252849] tracking-tight">{totalPocokanPengecualian}</span>
                  <span className="text-xs font-semibold text-slate-600">Orang</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold mt-1">
                  Pocokan: {totalPocokan} • Izin/Sakit: {totalIzinSakit}
                </p>
              </div>

            </div>

            {/* TABEL LOG RIWAYAT PRESENSI HARI INI */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">

              {/* Header Tabel & Filter Bar */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#252849] tracking-tight">Log Riwayat Presensi Hari Ini</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time sinkronisasi presensi mandiri & pengecualian koordinator</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari NIP / Nama..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-[#F7F7F3] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] w-44 lg:w-56 transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Filter Unit Kerja */}
                  <div className="relative">
                    <select
                      value={selectedUnitFilter}
                      onChange={(e) => setSelectedUnitFilter(e.target.value)}
                      className="appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl px-3 pr-8 py-1.5 text-xs font-semibold text-[#252849] focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] cursor-pointer"
                    >
                      <option value="Semua">Semua Unit Kerja</option>
                      <option value="Pemorsian">Unit Pemorsian</option>
                      <option value="Distribusi">Unit Distribusi</option>
                      <option value="Dapur">Unit Dapur</option>
                      <option value="Kebersihan">Unit Kebersihan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Tombol Export CSV */}
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#252849] bg-[#252849]/5 hover:bg-[#252849]/10 border border-[#252849]/20 rounded-xl transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D9A943]" /> CSV
                  </button>
                </div>
              </div>

              {/* Tabel Konten */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F3] border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-[#252849]/70">
                      <th className="py-3.5 px-5">Pegawai</th>
                      <th className="py-3.5 px-5">Unit Penempatan</th>
                      <th className="py-3.5 px-5">Jam Masuk</th>
                      <th className="py-3.5 px-5">Jam Pulang</th>
                      <th className="py-3.5 px-5">Deviasi GPS</th>
                      <th className="py-3.5 px-5">Status & Kategori</th>
                      <th className="py-3.5 px-5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((item) => {
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">

                          {/* Kolom Pegawai & NIP */}
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#252849] text-xs">{item.nama}</div>
                            <div className="text-[11px] text-[#252849]/60 font-sans font-medium mt-0.5">{item.nip}</div>
                            {item.keterangan && (
                              <div className="text-[10px] text-slate-400 italic mt-0.5">{item.keterangan}</div>
                            )}
                          </td>

                          {/* Kolom Unit Penempatan */}
                          <td className="py-3.5 px-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-[#252849] border border-slate-200/60">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {item.unit}
                            </span>
                          </td>

                          {/* Kolom Jam Masuk */}
                          <td className="py-3.5 px-5">
                            <span className={`font-sans text-xs font-bold ${item.jamMasuk.includes('06:') || item.jamMasuk.includes('05:')
                              ? 'text-[#252849]'
                              : (item.jamMasuk === '-' ? 'text-slate-400' : 'text-[#252849]')
                              }`}>
                              {item.jamMasuk}
                            </span>
                          </td>

                          {/* Kolom Jam Pulang */}
                          <td className="py-3.5 px-5">
                            <span className={`font-sans text-xs ${item.jamPulang.includes('Belum') ? 'text-slate-400 italic' : 'text-slate-700 font-semibold'
                              }`}>
                              {item.jamPulang}
                            </span>
                          </td>

                          {/* Kolom Deviasi GPS */}
                          <td className="py-3.5 px-5 font-sans text-xs text-slate-600 font-medium">
                            {item.deviasiGps}
                          </td>

                          {/* Kolom Status & Kategori Badge */}
                          <td className="py-3.5 px-5">
                            {item.statusBadgeColor === 'purple' && (
                              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#252849]/10 text-[#252849] border border-[#252849]/20 shadow-2xs">
                                {item.statusKategori}
                              </span>
                            )}
                            {item.statusBadgeColor === 'rose' && (
                              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-rose-50 text-rose-700 border border-rose-200/70 shadow-2xs">
                                {item.statusKategori}
                              </span>
                            )}
                            {item.statusBadgeColor === 'emerald' && (
                              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#A2C653]/20 text-[#252849] border border-[#A2C653]/40 shadow-2xs">
                                {item.statusKategori}
                              </span>
                            )}
                            {item.statusBadgeColor === 'amber' && (
                              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#D9A943]/20 text-[#735109] border border-[#D9A943]/40 shadow-2xs">
                                {item.statusKategori}
                              </span>
                            )}
                          </td>

                          {/* Kolom Aksi (Hapus Data) */}
                          <td className="py-3.5 px-5 text-center">
                            <button
                              onClick={() => {
                                if (confirm(`Hapus presensi untuk ${item.nama}?`)) {
                                  onDeleteAttendance(item.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}

                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                          Tidak ditemukan data log presensi yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

        {/* KONTEN MENU 2: FORM PENGECUALIAN & POCOKAN */}
        {activeMenu === 'pengecualian' && (
          <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-[#252849] mb-1">Kelola Pengecualian & Staf Pocokan</h3>
            <p className="text-xs text-slate-500 mb-6">
              Catat staf yang sakit/izin atau masukkan data orang luar yang menggantikan staf (pocokan harian).
            </p>

            {/* Toggle Tipe Input */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F7F7F3] border border-slate-200/60 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setTipeInput('pocokan')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${tipeInput === 'pocokan' ? 'bg-[#252849] text-white shadow-xs' : 'text-slate-600 hover:text-[#252849]'
                  }`}
              >
                + Input Pocokan (Pengganti Luar)
              </button>
              <button
                type="button"
                onClick={() => setTipeInput('sakit')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${tipeInput === 'sakit' ? 'bg-[#D9A943] text-[#252849] shadow-xs' : 'text-slate-600 hover:text-[#252849]'
                  }`}
              >
                Input Sakit / Izin Resmi
              </button>
            </div>

            <form onSubmit={handleSimpanPengecualian} className="space-y-4">
              {tipeInput === 'pocokan' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#252849] mb-1">Nama Staf Pocokan (Luar)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Tina"
                      value={pocokanNama}
                      onChange={(e) => setPocokanNama(e.target.value)}
                      className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all font-sans font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252849] mb-1">Menggantikan Siapa?</label>
                    <div className="relative">
                      <select
                        value={replacedStaffId}
                        onChange={(e) => setReplacedStaffId(e.target.value)}
                        className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 pr-10 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all cursor-pointer font-sans font-medium text-[#252849]"
                        required
                      >
                        <option value="">-- Pilih Staf Tetap yang Digantikan --</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>{s.nama} ({s.nip})</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#252849] mb-1">Unit Penempatan</label>
                      <div className="relative">
                        <select
                          value={pocokanUnit}
                          onChange={(e) => setPocokanUnit(e.target.value)}
                          className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 pr-10 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all cursor-pointer font-sans font-medium text-[#252849]"
                        >
                          <option value="Unit Pemorsian">Unit Pemorsian</option>
                          <option value="Unit Distribusi">Unit Distribusi</option>
                          <option value="Unit Dapur">Unit Dapur</option>
                          <option value="Unit Kebersihan">Unit Kebersihan</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#252849] mb-1">Nominal Upah Pocokan (Rp)</label>
                      <input
                        type="number"
                        value={upahHarian}
                        onChange={(e) => setUpahHarian(e.target.value)}
                        className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all font-sans font-semibold text-[#252849]"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#252849] mb-1">Pilih Staf Berhalangan</label>
                    <div className="relative">
                      <select
                        value={sakitStaffId}
                        onChange={(e) => setSakitStaffId(e.target.value)}
                        className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 pr-10 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all cursor-pointer font-sans font-medium text-[#252849]"
                        required
                      >
                        <option value="">-- Pilih Staf --</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>{s.nama} ({s.nip})</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#252849] mb-1">Keterangan / Alasan</label>
                    <input
                      type="text"
                      value={sakitAlasan}
                      onChange={(e) => setSakitAlasan(e.target.value)}
                      className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] focus:outline-none transition-all font-sans font-medium text-[#252849]"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#252849] hover:bg-[#1c1e38] text-white font-bold rounded-xl text-xs transition-all shadow-md mt-2 cursor-pointer"
              >
                Simpan & Sinkronisasi ke Log Hari Ini
              </button>
            </form>
          </div>
        )}

        {/* KONTEN MENU 3: MASTER DATA PEGAWAI */}
        {activeMenu === 'master' && (
          <div className="space-y-6">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Total Pegawai Terdaftar */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Pegawai Terdaftar
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                      {staffList.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Pegawai</span>
                  </div>
                  <p className="text-[11px] text-[#252849]/70 font-medium mt-0.5">
                    Aktif dalam sistem presensi
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#252849]/10 border border-[#252849]/20 text-[#252849] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Pegawai Hadir / Shift Aktif Hari Ini */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Pegawai Hadir / Shift Aktif
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                      {logs.filter(l => l.kategori === 'Tetap' && l.jamMasuk !== '-').length || 4}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Pegawai</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    Hari ini (Shift aktif)
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#A2C653]/20 border border-[#A2C653]/40 text-[#252849] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Total Unit Penempatan */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Unit Penempatan
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                      {new Set(staffList.map(s => s.unit)).size}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Unit</span>
                  </div>
                  <p className="text-[11px] text-[#735109] font-medium mt-0.5">
                    Pemorsian, Distribusi, Dapur, Kebersihan
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#D9A943]/20 border border-[#D9A943]/40 text-[#735109] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Container Tabel Putih Solid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              
              {/* Toolbar Kontrol Tabel */}
              <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#252849] tracking-tight">
                    Master Data Pegawai
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manajemen data staf tetap, unit penempatan kerja, dan status aktif kepegawaian.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Bar Modern */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari Nama / NIP..."
                      value={masterSearchQuery}
                      onChange={(e) => {
                        setMasterSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-3 py-2 text-xs bg-[#F7F7F3] hover:bg-white border border-slate-200 rounded-lg text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all w-48 sm:w-56 font-sans font-medium"
                    />
                  </div>

                  {/* Filter Dropdown Unit */}
                  <div className="relative">
                    <select
                      value={masterUnitFilter}
                      onChange={(e) => {
                        setMasterUnitFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-[#F7F7F3] hover:bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#252849] focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all cursor-pointer"
                    >
                      <option value="Semua">Semua Unit</option>
                      <option value="Unit Pemorsian">Unit Pemorsian</option>
                      <option value="Unit Distribusi">Unit Distribusi</option>
                      <option value="Unit Dapur">Unit Dapur</option>
                      <option value="Unit Kebersihan">Unit Kebersihan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Tombol Utama: + Tambah Pegawai */}
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#D9A943]" />
                    <span>Tambah Pegawai</span>
                  </button>
                </div>
              </div>

              {/* Tabel Data Pegawai (Padat & Efisien py-3.5) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F3] border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-[#252849]/70">
                      <th className="py-3 px-5 w-12 text-center">No</th>
                      <th className="py-3 px-5">Pegawai</th>
                      <th className="py-3 px-5">NIP / ID</th>
                      <th className="py-3 px-5">Unit Penempatan</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedStaff.map((staff, index) => (
                      <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* 1. No */}
                        <td className="py-3.5 px-5 text-center text-slate-400 font-medium">
                          {startIndex + index + 1}
                        </td>

                        {/* 2. Pegawai (Avatar Inisial + Nama Lengkap font-semibold text-slate-800) */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#252849]/10 text-[#252849] font-bold text-xs flex items-center justify-center shrink-0 border border-[#252849]/20">
                              {getInitials(staff.nama)}
                            </div>
                            <span className="font-semibold text-[#252849] text-xs">
                              {staff.nama}
                            </span>
                          </div>
                        </td>

                        {/* 3. NIP / ID (font-medium text-slate-600, non-monospace) */}
                        <td className="py-3.5 px-5 font-medium text-[#252849]/70 text-xs font-sans">
                          {staff.nip}
                        </td>

                        {/* 4. Unit Penempatan (Teks rapi dengan ikon kantor/gedung kecil) */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{staff.unit}</span>
                          </div>
                        </td>

                        {/* 5. Status (Pill badge hijau lembut) */}
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#A2C653]/15 text-[#2e4210] border border-[#A2C653]/35">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653]"></span>
                            Aktif Terdaftar
                          </span>
                        </td>

                        {/* 6. Aksi (Edit & Hapus Icon Button) */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(staff)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#252849] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit data pegawai"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStaffClick(staff)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus pegawai"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredMasterStaff.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                          Tidak ada data pegawai yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Tabel: Pagination */}
              <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F7F3]/60">
                <span className="text-xs text-slate-500 font-medium">
                  Menampilkan {filteredMasterStaff.length === 0 ? 0 : startIndex + 1}-{endIndex} dari {filteredMasterStaff.length} data pegawai
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#252849] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#252849] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* KONTEN MENU 4: UNIT & JAM KERJA */}
        {activeMenu === 'unit_jam' && (
          <div className="space-y-6">

            {/* 1. Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#252849] tracking-tight">
                  Master Data Unit & Jam Kerja
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Daftar unit operasional tim dan peran kerja mandiri beserta jadwal jam presensi pegawai SPPG.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddUnitModal}
                className="bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] text-white font-medium text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#D9A943]" />
                <span>Tambah Unit Kerja</span>
              </button>
            </div>

            {/* 2. Quick Stats Cards (3 Kartu Metrik di Atas Tabel) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Total Unit Kerja */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Unit Kerja
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                      {totalUnitsCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Unit Terdaftar</span>
                  </div>
                  <p className="text-[11px] text-[#252849]/70 font-medium mt-0.5">
                    {timCount} Tim &bull; {mandiriCount} Mandiri
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#252849]/10 border border-[#252849]/20 text-[#252849] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Total Staf Terdaftar */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Staf Terdaftar
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                      {totalStafCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Pegawai</span>
                  </div>
                  <p className="text-[11px] text-[#735109] font-medium mt-0.5">
                    Terpetakan ke unit & divisi kerja
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#D9A943]/20 border border-[#D9A943]/40 text-[#735109] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Model Jam Pulang */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Model Jam Pulang
                  </p>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[#A2C653]/15 text-[#2e4210] border border-[#A2C653]/35">
                      Fleksibel / Selesai Tugas
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Checkout mandiri tanpa batasan kaku
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#A2C653]/20 border border-[#A2C653]/40 text-[#252849] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* 3. Container Tabel Data Unit Kerja */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              
              {/* Toolbar Kontrol Tabel */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search Bar di kiri: cari Nama Unit */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={unitSearchQuery}
                    onChange={(e) => {
                      setUnitSearchQuery(e.target.value);
                      setUnitCurrentPage(1);
                    }}
                    placeholder="Cari Nama Unit Kerja..."
                    className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                  />
                  {unitSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setUnitSearchQuery('');
                        setUnitCurrentPage(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Kategori (Pill Buttons / Tabs Filter) */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F3] rounded-xl border border-slate-200/60 shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setUnitCategoryFilter('Semua');
                      setUnitCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      unitCategoryFilter === 'Semua'
                        ? 'bg-[#252849] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-[#252849] hover:bg-slate-200/50'
                    }`}
                  >
                    Semua Unit ({totalUnitsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitCategoryFilter('Operasional Tim');
                      setUnitCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      unitCategoryFilter === 'Operasional Tim'
                        ? 'bg-[#252849] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-[#252849] hover:bg-slate-200/50'
                    }`}
                  >
                    Operasional Tim ({timCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitCategoryFilter('Fungsional / Mandiri');
                      setUnitCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      unitCategoryFilter === 'Fungsional / Mandiri'
                        ? 'bg-[#D9A943] text-[#252849] shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-[#252849] hover:bg-slate-200/50'
                    }`}
                  >
                    Fungsional / Mandiri ({mandiriCount})
                  </button>
                </div>

              </div>

              {/* Tabel */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-[#F7F7F3] text-[11px] font-bold text-[#252849]/70 uppercase tracking-wider">
                      <th className="py-3 px-4 text-center w-12">No</th>
                      <th className="py-3 px-4">Nama Unit</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Jam Masuk</th>
                      <th className="py-3 px-4">Jam Pulang</th>
                      <th className="py-3 px-4 text-center">Total Staf</th>
                      <th className="py-3 px-4 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {displayedUnits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-600 text-xs">Tidak ada unit kerja ditemukan</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Coba sesuaikan kata kunci pencarian atau filter kategori Anda.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      displayedUnits.map((unit, index) => {
                        const rowNumber = unitStartIndex + index + 1;
                        const isTim = unit.kategori === 'Operasional Tim';

                        return (
                          <tr
                            key={unit.id}
                            className="hover:bg-slate-50/75 transition-colors group"
                          >
                            {/* 1. NO */}
                            <td className="py-3.5 px-4 text-center text-slate-400 font-medium text-xs">
                              {rowNumber}
                            </td>

                            {/* 2. NAMA UNIT (Ikon + Nama) */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {renderUnitIconSmall(unit.icon, unit.color)}
                                <span className="font-semibold text-[#252849] text-xs">
                                  {unit.nama}
                                </span>
                              </div>
                            </td>

                            {/* 3. KATEGORI */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                  isTim
                                    ? 'bg-[#252849]/10 text-[#252849] border-[#252849]/20'
                                    : 'bg-[#D9A943]/15 text-[#735109] border-[#D9A943]/35'
                                }`}
                              >
                                {unit.kategori}
                              </span>
                            </td>

                            {/* 4. JAM MASUK (Teks jelas + ikon Clock, TANPA badge toleransi) */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-semibold text-[#252849]">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{unit.jamMasuk}</span>
                              </div>
                            </td>

                            {/* 5. JAM PULANG */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#A2C653]/15 text-[#2e4210] border border-[#A2C653]/35">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#A2C653]"></span>
                                Fleksibel (Selesai Tugas)
                              </span>
                            </td>

                            {/* 6. TOTAL STAF */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-[#252849] border border-slate-200/80">
                                {unit.jumlahStaf || 1} Staf
                              </span>
                            </td>

                            {/* 7. AKSI */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUnitModal(unit)}
                                  className="p-1.5 text-slate-400 hover:text-[#252849] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Edit unit kerja"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUnitClick(unit)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus unit kerja"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Tabel: Pagination */}
              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                <span className="text-xs text-slate-500">
                  Menampilkan{' '}
                  <span className="font-semibold text-[#252849]">
                    {filteredUnits.length === 0 ? 0 : unitStartIndex + 1}-{unitEndIndex}
                  </span>{' '}
                  dari{' '}
                  <span className="font-semibold text-[#252849]">{filteredUnits.length}</span>{' '}
                  unit kerja
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUnitCurrentPage(p => Math.max(1, p - 1))}
                    disabled={unitCurrentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#252849] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-[#252849] px-2">
                    {unitCurrentPage} / {unitTotalPages || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUnitCurrentPage(p => Math.min(unitTotalPages, p + 1))}
                    disabled={unitCurrentPage === unitTotalPages || unitTotalPages === 0}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#252849] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

            {/* 4. Info Banner / Catatan Kebijakan di Bawah Tabel */}
            <div className="bg-[#D9A943]/10 border border-[#D9A943]/30 rounded-2xl p-4 text-xs sm:text-sm text-[#604207] flex items-start gap-3 shadow-2xs">
              <Info className="w-5 h-5 text-[#D9A943] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#604207] text-xs sm:text-sm mb-0.5">
                  Catatan Kebijakan Jam Kerja SPPG:
                </p>
                <p className="text-[#604207]/90 leading-relaxed text-xs">
                  Catatan Sistem: Seluruh unit kerja SPPG menggunakan kebijakan jam pulang fleksibel (open-ended). Presensi pulang dapat dicatatkan kapan saja setelah tugas operasional harian selesai tanpa pemotongan sanksi jam pulang kaku.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* KONTEN MENU 5: TITIK LOKASI KANTOR & GEOFENCE */}
        {activeMenu === 'titik_lokasi' && (
          <TitikLokasi />
        )}

        {/* KONTEN MENU 6: PELAPORAN & REKAP */}
        {activeMenu === 'laporan' && (
          <PelaporanRekap logs={logs} />
        )}

        </main>

      </div>

      {/* =========================================
          MODAL TAMBAH / EDIT PEGAWAI
         ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[60] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 relative">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editingStaff ? 'bg-[#D9A943]/20 text-[#735109]' : 'bg-[#252849]/10 text-[#252849]'
                  }`}>
                  {editingStaff ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#252849]">
                    {editingStaff ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingStaff ? `Perbarui data untuk ${editingStaff.nama}` : 'Daftarkan pegawai tetap baru ke sistem SPPG'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252849] mb-1.5">
                  Nama Lengkap Pegawai
                </label>
                <input
                  type="text"
                  value={staffFormNama}
                  onChange={(e) => setStaffFormNama(e.target.value)}
                  placeholder="Contoh: Dedi Kurniawan"
                  className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252849] mb-1.5">
                  Nomor Induk Pegawai (NIP)
                </label>
                <input
                  type="text"
                  value={staffFormNip}
                  onChange={(e) => setStaffFormNip(e.target.value)}
                  placeholder="Contoh: SPPG-2026-006"
                  className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252849] mb-1.5">
                  Unit Penempatan Kerja
                </label>
                <div className="relative">
                  <select
                    value={staffFormUnit}
                    onChange={(e) => setStaffFormUnit(e.target.value)}
                    className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-xs text-[#252849] font-medium focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all cursor-pointer font-sans"
                  >
                    <option value="Unit Pemorsian">Unit Pemorsian</option>
                    <option value="Unit Distribusi">Unit Distribusi</option>
                    <option value="Unit Dapur">Unit Dapur</option>
                    <option value="Unit Kebersihan">Unit Kebersihan</option>
                    <option value="Unit Mutu & Gizi / Ahli Gizi">Unit Mutu & Gizi / Ahli Gizi</option>
                    <option value="Unit Teknis & Aslap">Unit Teknis & Aslap</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] shadow-md shadow-[#252849]/20 transition-all cursor-pointer"
                >
                  {editingStaff ? 'Simpan Perubahan' : 'Tambah Pegawai'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================
          MODAL TAMBAH / EDIT UNIT KERJA
         ========================================= */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[60] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 relative">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  editingUnit ? 'bg-[#D9A943]/20 text-[#735109]' : 'bg-[#252849]/10 text-[#252849]'
                }`}>
                  {editingUnit ? <Pencil className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#252849]">
                    {editingUnit ? 'Edit Aturan Unit Kerja' : 'Tambah Unit Kerja Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingUnit ? `Pengaturan jam dan jadwal ${editingUnit.nama}` : 'Daftarkan divisi operasional atau peran fungsional baru'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUnitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252849] mb-1.5">
                  Nama Unit Kerja
                </label>
                <input
                  type="text"
                  value={unitFormNama}
                  onChange={(e) => setUnitFormNama(e.target.value)}
                  placeholder="Contoh: Unit Pengemasan"
                  className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252849] mb-1.5">
                  Kategori Unit
                </label>
                <div className="relative">
                  <select
                    value={unitFormKategori}
                    onChange={(e) => setUnitFormKategori(e.target.value)}
                    className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 pr-8 py-2.5 text-xs text-[#252849] font-medium focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all cursor-pointer font-sans"
                  >
                    <option value="Operasional Tim">Operasional Tim</option>
                    <option value="Fungsional / Mandiri">Fungsional / Mandiri</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252849] mb-1.5">
                    Jam Masuk Wajib
                  </label>
                  <input
                    type="text"
                    value={unitFormJamMasuk}
                    onChange={(e) => setUnitFormJamMasuk(e.target.value)}
                    placeholder="Contoh: 07:00 WIB"
                    className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252849] mb-1.5">
                    Total Staf Terdaftar
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={unitFormStaf}
                    onChange={(e) => setUnitFormStaf(e.target.value)}
                    placeholder="Contoh: 2"
                    className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#252849] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all font-medium font-sans"
                    required
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#252849] hover:bg-[#1c1e38] active:bg-[#15172b] shadow-md shadow-[#252849]/20 transition-all cursor-pointer"
                >
                  {editingUnit ? 'Simpan Aturan Unit' : 'Tambah Unit Kerja'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
