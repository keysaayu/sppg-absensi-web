import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Users,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  Filter,
  ChevronDown,
  ChevronRight,
  Building2,
  Search
} from 'lucide-react';

// Dataset Rekapitulasi Presensi Resmi SPPG Ciomas Pagelaran 2 (Bulan November 2026)
const initialReportData = [
  {
    id: 'REP-001',
    tanggal: '11 Nov 2026',
    nama: 'Rahayu Keysa',
    isPocokan: false,
    unit: 'Pemorsian',
    jamMasuk: '06:15 WIB',
    jamPulang: '14:20 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-002',
    tanggal: '11 Nov 2026',
    nama: 'Ahmad Maulana',
    isPocokan: false,
    unit: 'Pengolahan',
    jamMasuk: '05:50 WIB',
    jamPulang: '14:10 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-003',
    tanggal: '11 Nov 2026',
    nama: 'Budi Santoso',
    isPocokan: false,
    unit: 'Distribusi',
    jamMasuk: '07:15 WIB',
    jamPulang: '15:10 WIB',
    status: 'Terlambat'
  },
  {
    id: 'REP-004',
    tanggal: '11 Nov 2026',
    nama: 'Tina',
    isPocokan: true,
    unit: 'Pemorsian',
    jamMasuk: '06:05 WIB',
    jamPulang: '14:00 WIB',
    status: 'Pocokan Hadir'
  },
  {
    id: 'REP-005',
    tanggal: '11 Nov 2026',
    nama: 'Fitri Handayani',
    isPocokan: false,
    unit: 'Kebersihan',
    jamMasuk: '06:25 WIB',
    jamPulang: '14:15 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-006',
    tanggal: '10 Nov 2026',
    nama: 'Siti Aminah',
    isPocokan: false,
    unit: 'Pemorsian',
    jamMasuk: '06:20 WIB',
    jamPulang: '14:30 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-007',
    tanggal: '10 Nov 2026',
    nama: 'Hendra Gunawan',
    isPocokan: false,
    unit: 'Distribusi',
    jamMasuk: '06:40 WIB',
    jamPulang: '14:45 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-008',
    tanggal: '10 Nov 2026',
    nama: 'Dewi Lestari',
    isPocokan: false,
    unit: 'Mandiri / Gizi',
    jamMasuk: '07:25 WIB',
    jamPulang: '15:30 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-009',
    tanggal: '10 Nov 2026',
    nama: 'Rian Hidayat',
    isPocokan: false,
    unit: 'Mandiri / Gizi',
    jamMasuk: '07:35 WIB',
    jamPulang: '15:15 WIB',
    status: 'Terlambat'
  },
  {
    id: 'REP-010',
    tanggal: '09 Nov 2026',
    nama: 'Rahayu Keysa',
    isPocokan: false,
    unit: 'Pemorsian',
    jamMasuk: '06:10 WIB',
    jamPulang: '14:15 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-011',
    tanggal: '09 Nov 2026',
    nama: 'Ahmad Maulana',
    isPocokan: false,
    unit: 'Pengolahan',
    jamMasuk: '05:45 WIB',
    jamPulang: '14:05 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-012',
    tanggal: '09 Nov 2026',
    nama: 'Slamet',
    isPocokan: true,
    unit: 'Kebersihan',
    jamMasuk: '06:30 WIB',
    jamPulang: '14:20 WIB',
    status: 'Pocokan Hadir'
  },
  {
    id: 'REP-013',
    tanggal: '08 Nov 2026',
    nama: 'Budi Santoso',
    isPocokan: false,
    unit: 'Distribusi',
    jamMasuk: '06:45 WIB',
    jamPulang: '14:40 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-014',
    tanggal: '08 Nov 2026',
    nama: 'Fitri Handayani',
    isPocokan: false,
    unit: 'Kebersihan',
    jamMasuk: '07:10 WIB',
    jamPulang: '14:50 WIB',
    status: 'Terlambat'
  },
  {
    id: 'REP-015',
    tanggal: '07 Nov 2026',
    nama: 'Nurul Fadilah',
    isPocokan: false,
    unit: 'Mandiri / Keuangan',
    jamMasuk: '07:55 WIB',
    jamPulang: '16:00 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-016',
    tanggal: '07 Nov 2026',
    nama: 'Siti Aminah',
    isPocokan: false,
    unit: 'Pemorsian',
    jamMasuk: '06:12 WIB',
    jamPulang: '14:25 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-017',
    tanggal: '06 Nov 2026',
    nama: 'Ahmad Maulana',
    isPocokan: false,
    unit: 'Pengolahan',
    jamMasuk: '05:52 WIB',
    jamPulang: '14:12 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-018',
    tanggal: '06 Nov 2026',
    nama: 'Tina',
    isPocokan: true,
    unit: 'Pemorsian',
    jamMasuk: '06:18 WIB',
    jamPulang: '14:10 WIB',
    status: 'Pocokan Hadir'
  },
  {
    id: 'REP-019',
    tanggal: '05 Nov 2026',
    nama: 'Rahayu Keysa',
    isPocokan: false,
    unit: 'Pemorsian',
    jamMasuk: '06:14 WIB',
    jamPulang: '14:18 WIB',
    status: 'Tepat Waktu'
  },
  {
    id: 'REP-020',
    tanggal: '05 Nov 2026',
    nama: 'Budi Santoso',
    isPocokan: false,
    unit: 'Distribusi',
    jamMasuk: '07:20 WIB',
    jamPulang: '15:15 WIB',
    status: 'Terlambat'
  }
];

export default function PelaporanRekap({ logs = [] }) {
  // State Filter
  const [selectedPeriod, setSelectedPeriod] = useState('bulan_ini');
  const [customStartDate, setCustomStartDate] = useState('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState('2026-11-11');
  const [selectedUnit, setSelectedUnit] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Gabungkan initial data dengan live attendance logs yang dicatat
  const allRecords = useMemo(() => {
    const liveConverted = logs.map((l, index) => {
      const isLate = l.statusKategori === 'Terlambat';
      const isPocokan = l.kategori === 'Pocokan' || (l.nama && l.nama.toLowerCase().includes('pocokan'));
      let statusFormatted = 'Tepat Waktu';
      if (isPocokan) statusFormatted = 'Pocokan Hadir';
      else if (isLate) statusFormatted = 'Terlambat';

      // Ringkaskan nama unit kerja
      let unitClean = l.unit.replace(/^Unit\s+/i, '');
      if (unitClean.includes('Dapur')) unitClean = 'Pengolahan';

      return {
        id: `LIVE-${l.id || index}`,
        tanggal: '11 Nov 2026',
        nama: l.nama.replace(/\(Pocokan\)/gi, '').trim(),
        isPocokan: isPocokan,
        unit: unitClean,
        jamMasuk: l.jamMasuk.length > 8 ? l.jamMasuk.substring(0, 5) + ' WIB' : l.jamMasuk,
        jamPulang: l.jamPulang.length > 8 ? l.jamPulang.substring(0, 5) + ' WIB' : l.jamPulang,
        status: statusFormatted
      };
    });

    return [...liveConverted, ...initialReportData];
  }, [logs]);

  // Format Jam Masuk - Pulang dalam satu kolom ringkas
  const formatMasukPulang = (masuk, pulang) => {
    const cleanMasuk = masuk ? masuk.replace(/\s*WIB/i, '').trim() : '-';
    const cleanPulang = pulang ? pulang.replace(/\s*WIB/i, '').trim() : '-';

    if (cleanPulang.toLowerCase().includes('belum') || cleanPulang === '-') {
      return `${cleanMasuk} - Belum Pulang`;
    }
    return `${cleanMasuk} - ${cleanPulang} WIB`;
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return allRecords.filter((item) => {
      // 1. Filter Pencarian Nama
      if (searchQuery.trim() && !item.nama.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }

      // 2. Filter Unit Kerja
      if (selectedUnit !== 'Semua') {
        if (selectedUnit === 'Unit Pemorsian' && !item.unit.includes('Pemorsian')) return false;
        if (selectedUnit === 'Unit Pengolahan' && !item.unit.includes('Pengolahan') && !item.unit.includes('Dapur')) return false;
        if (selectedUnit === 'Unit Distribusi' && !item.unit.includes('Distribusi') && !item.unit.includes('Logistik')) return false;
        if (selectedUnit === 'Unit Kebersihan' && !item.unit.includes('Kebersihan')) return false;
        if (selectedUnit === 'Staf Mandiri/Gizi' && !item.unit.includes('Mandiri') && !item.unit.includes('Gizi') && !item.unit.includes('Keuangan')) return false;
      }

      // 3. Filter Status
      if (selectedStatus !== 'Semua') {
        if (selectedStatus === 'Tepat Waktu' && item.status !== 'Tepat Waktu') return false;
        if (selectedStatus === 'Terlambat' && item.status !== 'Terlambat') return false;
        if (selectedStatus === 'Pocokan / Izin' && item.status !== 'Pocokan Hadir') return false;
      }

      return true;
    });
  }, [allRecords, searchQuery, selectedUnit, selectedStatus]);

  // Ringkasan Metrik Akumulatif (Khusus Tampilan Layar)
  const metrics = useMemo(() => {
    const total = 124;
    const tepatWaktu = 112;
    const terlambat = 12;
    const pocokan = 4;
    const persentaseTepat = Math.round((tepatWaktu / total) * 100);

    return { total, tepatWaktu, persentaseTepat, terlambat, pocokan };
  }, []);

  // Pagination Data untuk Tampilan Layar
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Label periode yang aktif
  const periodeLabel = useMemo(() => {
    if (selectedPeriod === 'bulan_ini') return '1 November 2026 - 11 November 2026';
    if (selectedPeriod === 'bulan_lalu') return '1 Oktober 2026 - 31 Oktober 2026';
    if (selectedPeriod === 'minggu_ini') return '5 November 2026 - 11 November 2026';
    return `${customStartDate} s.d. ${customEndDate}`;
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Handler: Cetak Dokumen Resmi
  const handlePrint = () => {
    window.print();
  };

  // Handler: Ekspor CSV / Excel 5 Kolom Inti
  const handleExportCSV = () => {
    const headers = ['NO', 'NAMA PEGAWAI', 'TANGGAL', 'UNIT', 'MASUK - PULANG'];
    const rows = filteredData.map((item, idx) => [
      idx + 1,
      item.isPocokan ? `"${item.nama} (Pocokan)"` : `"${item.nama}"`,
      `"${item.tanggal}"`,
      `"${item.unit.replace(/^Unit\s+/i, '')}"`,
      `"${formatMasukPulang(item.jamMasuk, item.jamPulang)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_5Kolom_SPPG_Ciomas_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">

      {/* ========================================================
          KOP SURAT RESMI CETAK (Hanya Muncul Saat Print / PDF)
         ======================================================== */}
      <div className="hidden print:block mb-5 border-b-2 border-black pb-3 text-center">
        <div className="flex items-center justify-between pb-1">
          {/* Logo / Singkatan Lembaga */}
          <div className="w-14 h-14 border border-black rounded-lg flex items-center justify-center font-black text-xs tracking-widest text-black">
            BGN
          </div>

          <div className="flex-1 px-4 text-center">
            <h1 className="text-sm font-extrabold tracking-wider uppercase text-black leading-tight">
              BADAN GIZI NASIONAL REPUBLIK INDONESIA
            </h1>
            <h2 className="text-xs font-bold tracking-tight text-black mt-0.5">
              SATUAN PELAYANAN PEMENUHAN GIZI (SPPG) CIOMAS PAGELARAN 2
            </h2>
            <p className="text-[10px] text-gray-700 mt-0.5">
              Jl. Raya Pagelaran No. 42, RT 02 / RW 07, Kel. Pagelaran, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610
            </p>
          </div>

          <div className="w-14 h-14 border border-black rounded-lg flex items-center justify-center font-black text-xs tracking-widest text-black">
            SPPG
          </div>
        </div>

        <div className="border-t border-black mt-1.5 pt-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            LAPORAN REKAPITULASI PRESENSI PEGAWAI
          </h3>
          <p className="text-[11px] text-gray-800 font-semibold mt-0.5">
            Periode: {periodeLabel}
          </p>
        </div>
      </div>

      {/* ========================================================
          1. HEADER HALAMAN & BREADCRUMB (Layar Saja)
         ======================================================== */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Laporan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#252849] font-bold">Pelaporan & Rekap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#252849] tracking-tight">
            Rekapitulasi & Pelaporan Presensi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, tinjau ringkasan log kehadiran pegawai, dan cetak dokumen resmi operasional SPPG Ciomas Pagelaran 2.
          </p>
        </div>
      </div>

      {/* ========================================================
          2. FILTER TOOLBAR & TOMBOL CETAK (Layar Saja - print:hidden)
         ======================================================== */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Sisi Kiri: Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter 1: Pemilih Rentang Tanggal */}
            <div className="relative min-w-[200px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Periode Laporan
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-[#252849] focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] cursor-pointer"
                >
                  <option value="bulan_ini">Bulan Ini (November 2026)</option>
                  <option value="minggu_ini">Minggu Ini (5 - 11 Nov 2026)</option>
                  <option value="bulan_lalu">Bulan Lalu (Oktober 2026)</option>
                  <option value="custom">Kustom Tanggal...</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter 2: Filter Unit Kerja */}
            <div className="relative min-w-[170px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Unit Kerja
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedUnit}
                  onChange={(e) => {
                    setSelectedUnit(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-[#252849] focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] cursor-pointer"
                >
                  <option value="Semua">Semua Unit Kerja</option>
                  <option value="Unit Pemorsian">Unit Pemorsian</option>
                  <option value="Unit Pengolahan">Unit Pengolahan</option>
                  <option value="Unit Distribusi">Unit Distribusi</option>
                  <option value="Unit Kebersihan">Unit Kebersihan</option>
                  <option value="Staf Mandiri/Gizi">Staf Mandiri / Gizi</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter 3: Filter Status */}
            <div className="relative min-w-[150px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Status Kehadiran
              </label>
              <div className="relative">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-[#F7F7F3] border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-[#252849] focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tepat Waktu">Tepat Waktu</option>
                  <option value="Terlambat">Terlambat</option>
                  <option value="Pocokan / Izin">Pocokan / Izin</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter 4: Pencarian Cepat Nama */}
            <div className="relative min-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Cari Pegawai
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ketik nama staf..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849]"
                />
              </div>
            </div>

          </div>

          {/* Sisi Kanan: Grup Tombol Aksi Cetak & Ekspor */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto pt-2 lg:pt-0">
            {/* Tombol Ekspor Excel / CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Unduh format spreadsheet CSV 5 kolom"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Excel / CSV</span>
            </button>

            {/* Tombol Utama Cetak Laporan / PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#D9A943]" />
              <span>Cetak Laporan / PDF</span>
            </button>
          </div>

        </div>

        {/* Custom Date Input jika user memilih custom */}
        {selectedPeriod === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-600">Rentang Tanggal:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-[#F7F7F3] border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#252849] font-medium"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-[#F7F7F3] border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#252849] font-medium"
            />
          </div>
        )}

      </div>

      {/* ========================================================
          3. RINGKASAN METRIK AKUMULATIF (Layar Saja - print:hidden)
         ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        
        {/* Kartu 1: Total Kehadiran */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Kehadiran
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                {metrics.total}
              </span>
              <span className="text-xs font-semibold text-slate-500">Presensi</span>
            </div>
            <p className="text-[11px] text-[#252849]/70 font-medium mt-0.5">
              Akumulatif periode terpilih
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#252849]/10 text-[#252849] border border-[#252849]/20 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Kartu 2: Kehadiran Tepat Waktu */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Kehadiran Tepat Waktu
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4e6a1a] tracking-tight">
                {metrics.tepatWaktu}
              </span>
              <span className="text-xs font-bold text-[#4e6a1a]">
                ({metrics.persentaseTepat}%)
              </span>
            </div>
            <p className="text-[11px] text-[#4e6a1a] font-medium mt-0.5">
              Sesuai jam operasional
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A2C653]/20 text-[#4e6a1a] border border-[#A2C653]/35 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Kartu 3: Keterlambatan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Keterlambatan
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#b88a2e] tracking-tight">
                {metrics.terlambat}
              </span>
              <span className="text-xs font-semibold text-[#b88a2e]">Kasus</span>
            </div>
            <p className="text-[11px] text-[#b88a2e] font-medium mt-0.5">
              Di atas toleransi masuk
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D9A943]/20 text-[#b88a2e] border border-[#D9A943]/35 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Kartu 4: Kehadiran Pocokan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Kehadiran Pocokan
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#252849] tracking-tight">
                {metrics.pocokan}
              </span>
              <span className="text-xs font-semibold text-slate-500">Kasus</span>
            </div>
            <p className="text-[11px] text-[#252849]/70 font-medium mt-0.5">
              Pengganti luar harian
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ========================================================
          4. TABEL REKAP 5 KOLOM INTI (RINGKAS & SIAP CETAK A4)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden print:border print:border-slate-300 print:rounded-none print:shadow-none">
        
        {/* Header Tabel di Layar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-sm font-bold text-[#252849]">
              Daftar Rekapitulasi Presensi (5 Kolom Inti)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredData.length} data presensi pada {periodeLabel}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Format Ringkas A4
          </span>
        </div>

        {/* Tabel Konten: 5 Kolom Saja */}
        <div className="w-full overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs print:w-full print:border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 print:bg-slate-100 print:text-black print:border-b print:border-slate-400">
                <th className="py-2.5 px-3 text-center w-12 border border-slate-200 print:border-slate-300">
                  NO
                </th>
                <th className="py-2.5 px-4 border border-slate-200 print:border-slate-300">
                  NAMA PEGAWAI
                </th>
                <th className="py-2.5 px-4 border border-slate-200 print:border-slate-300 whitespace-nowrap w-28">
                  TANGGAL
                </th>
                <th className="py-2.5 px-4 border border-slate-200 print:border-slate-300 w-36">
                  UNIT
                </th>
                <th className="py-2.5 px-4 border border-slate-200 print:border-slate-300 whitespace-nowrap w-48">
                  MASUK - PULANG
                </th>
              </tr>
            </thead>

            {/* TBODY 1: TAMPILAN LAYAR (DENGAN PAGINATION) */}
            <tbody className="divide-y divide-slate-100 text-slate-700 print:hidden">
              {displayedData.map((item, index) => {
                const rowNo = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={`screen-${item.id}`} className="hover:bg-slate-50/60 transition-colors">
                    {/* 1. NO */}
                    <td className="py-2.5 px-3 text-center text-slate-400 font-medium border border-slate-200">
                      {rowNo}
                    </td>

                    {/* 2. NAMA PEGAWAI */}
                    <td className="py-2.5 px-4 font-semibold text-[#252849] border border-slate-200">
                      <div>{item.nama}</div>
                      {item.isPocokan && (
                        <div className="text-[10px] text-purple-700 font-medium">
                          (Pocokan)
                        </div>
                      )}
                    </td>

                    {/* 3. TANGGAL */}
                    <td className="py-2.5 px-4 font-medium text-slate-700 whitespace-nowrap border border-slate-200">
                      {item.tanggal}
                    </td>

                    {/* 4. UNIT */}
                    <td className="py-2.5 px-4 font-medium text-slate-700 border border-slate-200">
                      {item.unit.replace(/^Unit\s+/i, '')}
                    </td>

                    {/* 5. MASUK - PULANG */}
                    <td className="py-2.5 px-4 font-semibold text-[#252849] whitespace-nowrap border border-slate-200">
                      {formatMasukPulang(item.jamMasuk, item.jamPulang)}
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium border border-slate-200">
                    Tidak ditemukan data presensi yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>

            {/* TBODY 2: TAMPILAN CETAK / PRINT (MENAMPILKAN SELURUH DATA FILTERED) */}
            <tbody className="hidden print:table-row-group divide-y divide-slate-300 text-black">
              {filteredData.map((item, index) => {
                const rowNo = index + 1;
                return (
                  <tr key={`print-${item.id}`} className="print:border-b print:border-slate-300">
                    {/* 1. NO */}
                    <td className="py-1.5 px-2.5 text-center text-black font-medium border border-slate-300">
                      {rowNo}
                    </td>

                    {/* 2. NAMA PEGAWAI */}
                    <td className="py-1.5 px-3 text-black font-semibold border border-slate-300">
                      <div>{item.nama}</div>
                      {item.isPocokan && (
                        <div className="text-[10px] text-gray-600 font-normal">
                          (Pocokan)
                        </div>
                      )}
                    </td>

                    {/* 3. TANGGAL */}
                    <td className="py-1.5 px-3 text-black whitespace-nowrap border border-slate-300">
                      {item.tanggal}
                    </td>

                    {/* 4. UNIT */}
                    <td className="py-1.5 px-3 text-black border border-slate-300">
                      {item.unit.replace(/^Unit\s+/i, '')}
                    </td>

                    {/* 5. MASUK - PULANG */}
                    <td className="py-1.5 px-3 text-black font-medium whitespace-nowrap border border-slate-300">
                      {formatMasukPulang(item.jamMasuk, item.jamPulang)}
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-black border border-slate-300">
                    Tidak ada data presensi untuk periode ini.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Footer Tabel: Pagination (Layar Saja - print:hidden) */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white print:hidden">
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan{' '}
            <span className="font-semibold text-slate-800">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-800">{filteredData.length}</span> data presensi
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. FOOTER TANDA TANGAN SEDERHANA (Hanya Muncul Saat Print / PDF)
         ======================================================== */}
      <div className="hidden print:flex justify-end mt-10 pt-4 break-inside-avoid">
        <div className="text-center w-72">
          <p className="text-xs text-black">Bogor, {todayFormatted}</p>
          <p className="text-xs font-semibold text-black mt-1">
            Penanggung Jawab SPPG Ciomas Pagelaran 2
          </p>
          <div className="h-20"></div>
          <p className="text-xs text-black font-medium tracking-widest">
            ( ........................................ )
          </p>
        </div>
      </div>

    </div>
  );
}
