export const initialStaffList = [
  { id: 1, nip: "SPPG-2026-001", nama: "Rahayu Keysa", unit: "Unit Pemorsian" },
  { id: 2, nip: "SPPG-2026-002", nama: "Budi Santoso", unit: "Unit Distribusi" },
  { id: 3, nip: "SPPG-2026-003", nama: "Siti Aminah", unit: "Unit Pemorsian" },
  { id: 4, nip: "SPPG-2026-004", nama: "Ahmad Maulana", unit: "Unit Dapur" },
  { id: 5, nip: "SPPG-2026-005", nama: "Fitri Handayani", unit: "Unit Kebersihan" },
];

export const initialAttendanceLogs = [
  {
    id: 1,
    nama: "tina (Pocokan)",
    nip: "POC-3414",
    unit: "Unit Pemorsian",
    jamMasuk: "06:00:00 WIB",
    jamPulang: "14:00:00 WIB",
    deviasiGps: "12 m",
    kategori: "Pocokan",
    statusKategori: "POCOKAN (Rp 120.000)",
    statusBadgeColor: "purple",
    keterangan: "Pengganti Rahayu Keysa"
  },
  {
    id: 2,
    nama: "Rahayu Keysa",
    nip: "SPPG-2026-001",
    unit: "Unit Pemorsian",
    jamMasuk: "-",
    jamPulang: "Belum Pulang",
    deviasiGps: "-",
    kategori: "Pengecualian",
    statusKategori: "SAKIT",
    statusBadgeColor: "rose",
    keterangan: "Sakit resmi tercatat di portal admin"
  },
  {
    id: 3,
    nama: "Rahayu Keysa",
    nip: "SPPG-2026-001",
    unit: "Unit Pemorsian",
    jamMasuk: "05:54:12 WIB",
    jamPulang: "14:05:30 WIB",
    deviasiGps: "12.4 m",
    kategori: "Tetap",
    statusKategori: "Tepat Waktu",
    statusBadgeColor: "emerald",
    keterangan: ""
  },
  {
    id: 4,
    nama: "Budi Santoso",
    nip: "SPPG-2026-002",
    unit: "Unit Distribusi",
    jamMasuk: "07:46:10 WIB",
    jamPulang: "Belum Pulang",
    deviasiGps: "18.2 m",
    kategori: "Tetap",
    statusKategori: "Terlambat",
    statusBadgeColor: "amber",
    keterangan: ""
  },
  {
    id: 5,
    nama: "Siti Aminah",
    nip: "SPPG-2026-003",
    unit: "Unit Pemorsian",
    jamMasuk: "05:50:15 WIB",
    jamPulang: "14:00:10 WIB",
    deviasiGps: "9.5 m",
    kategori: "Tetap",
    statusKategori: "Tepat Waktu",
    statusBadgeColor: "emerald",
    keterangan: ""
  }
];
