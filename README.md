# SPPG Presensi React + Vite (Versi 2)

Pembaruan tampilan Admin Dashboard sesuai mockup:
- **Sidebar Kiri Vertikal:** Menu *Monitoring*, *Pengecualian & Pocokan*, *Master Pegawai*, *Unit & Jam*, *Titik Lokasi*, *Pelaporan & Cetak*, serta tombol *Keluar* dipindahkan rapi ke bilah samping kiri ke bawah.
- **4 KPI Card:** Menampilkan metrik *Total Pegawai Tetap*, *Hadir Tepat Waktu*, *Terlambat*, dan *Pocokan / Pengecualian*.
- **Tabel Log Riwayat:** Lengkap dengan filter unit, pencarian NIP/Nama, tombol Export CSV, dan badge warna status (Pocokan Rp 120.000, Sakit, Tepat Waktu, Terlambat).
- **Halaman Presensi HP (`/`):** 1 kartu bersih tanpa tombol navbar pengalih.

## Cara Menjalankan:
1. Extract file `.zip` ini.
2. Buka terminal pada folder proyek:
   ```bash
   npm install
   npm run dev
   ```
3. Akses via browser:
   - **Halaman Staf (HP):** `http://localhost:5173/`
   - **Halaman Admin Dashboard:** `http://localhost:5173/admin`
