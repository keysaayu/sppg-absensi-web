import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Crosshair,
  Building2,
  Layers,
  Info,
  Compass,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function TitikLokasi() {
  // Koordinat default: SPPG Ciomas Pagelaran 2
  const DEFAULT_CONFIG = {
    namaLokasi: 'SPPG Ciomas Pagelaran 2 (Gedung Utama)',
    alamat: 'Jl. Raya Pagelaran No. 42, RT 02 / RW 07, Kel. Pagelaran, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610',
    lat: -6.598123,
    lng: 106.756890,
    radius: 50,
    isGeofenceActive: true
  };

  // State konfigurasi dengan LocalStorage fallback
  const [namaLokasi, setNamaLokasi] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try { return JSON.parse(saved).namaLokasi || DEFAULT_CONFIG.namaLokasi; } catch (e) {}
    }
    return DEFAULT_CONFIG.namaLokasi;
  });

  const [alamat, setAlamat] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try { return JSON.parse(saved).alamat || DEFAULT_CONFIG.alamat; } catch (e) {}
    }
    return DEFAULT_CONFIG.alamat;
  });

  const [lat, setLat] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try { return Number(JSON.parse(saved).lat) || DEFAULT_CONFIG.lat; } catch (e) {}
    }
    return DEFAULT_CONFIG.lat;
  });

  const [lng, setLng] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try { return Number(JSON.parse(saved).lng) || DEFAULT_CONFIG.lng; } catch (e) {}
    }
    return DEFAULT_CONFIG.lng;
  });

  const [radius, setRadius] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try { return Number(JSON.parse(saved).radius) || DEFAULT_CONFIG.radius; } catch (e) {}
    }
    return DEFAULT_CONFIG.radius;
  });

  const [isGeofenceActive, setIsGeofenceActive] = useState(() => {
    const saved = localStorage.getItem('sppg_titik_lokasi_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isGeofenceActive !== undefined ? parsed.isGeofenceActive : DEFAULT_CONFIG.isGeofenceActive;
      } catch (e) {}
    }
    return DEFAULT_CONFIG.isGeofenceActive;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [geoError, setGeoError] = useState('');

  // Refs untuk objek Leaflet Map
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Buat Map Instance
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    // Pasang tile OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Zoom control di pojok kanan atas
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Custom Icon Marker Pin Bergaya BGN Modern
    const customPin = L.divIcon({
      className: 'sppg-custom-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; cursor: grab;">
          <!-- Gelombang Radar Animasi -->
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(162, 198, 83, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <!-- Pin Box -->
          <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #252849; border: 2.5px solid #D9A943; border-radius: 9999px; box-shadow: 0 4px 12px rgba(37,40,73,0.35);">
            <svg style="width: 18px; height: 18px; color: #D9A943;" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <!-- Pin Pointer Tip -->
          <div style="position: absolute; bottom: 1px; width: 6px; height: 6px; background: #252849; transform: rotate(45deg); z-index: 9;"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 42],
      popupAnchor: [0, -42]
    });

    // Pasang Marker Pin
    const marker = L.marker([lat, lng], {
      icon: customPin,
      draggable: true,
      title: 'Titik Pusat SPPG (Geser pin untuk memindahkan)'
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 2px;">
        <strong style="color: #252849; font-size: 13px;">SPPG Ciomas Pagelaran 2</strong><br/>
        <span style="color: #64748b; font-size: 11px;">Pusat Validasi Geofence Presensi</span>
      </div>
    `);

    // Pasang Geofence Circle
    const circle = L.circle([lat, lng], {
      radius: radius,
      color: isGeofenceActive ? '#4e6a1a' : '#94a3b8',
      fillColor: isGeofenceActive ? '#A2C653' : '#94a3b8',
      fillOpacity: isGeofenceActive ? 0.22 : 0.08,
      weight: 2,
      dashArray: isGeofenceActive ? '4, 6' : '3, 3'
    }).addTo(map);

    // Event saat pin digeser (dragend)
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setLat(Number(pos.lat.toFixed(6)));
      setLng(Number(pos.lng.toFixed(6)));
    });

    // Event saat area peta diklik langsung
    map.on('click', (e) => {
      const pos = e.latlng;
      setLat(Number(pos.lat.toFixed(6)));
      setLng(Number(pos.lng.toFixed(6)));
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    // Timeout untuk render size yang optimal
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, []);

  // Update dinamis saat koordinat, radius, atau status toggle berubah
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

    const newLatLng = [lat, lng];

    markerRef.current.setLatLng(newLatLng);
    circleRef.current.setLatLng(newLatLng);
    circleRef.current.setRadius(radius);

    if (isGeofenceActive) {
      circleRef.current.setStyle({
        color: '#4e6a1a',
        fillColor: '#A2C653',
        fillOpacity: 0.22,
        dashArray: '4, 6',
        weight: 2
      });
    } else {
      circleRef.current.setStyle({
        color: '#94a3b8',
        fillColor: '#94a3b8',
        fillOpacity: 0.08,
        dashArray: '3, 3',
        weight: 1.5
      });
    }

    mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.4 });
  }, [lat, lng, radius, isGeofenceActive]);

  // Handler: Ambil lokasi GPS perangkat saat ini
  const handleDetectDeviceLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Perangkat Anda tidak mendukung fitur Geolocation.');
      return;
    }

    setIsDetecting(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = Number(pos.coords.latitude.toFixed(6));
        const detectedLng = Number(pos.coords.longitude.toFixed(6));
        setLat(detectedLat);
        setLng(detectedLng);
        setIsDetecting(false);
        setSuccessMsg('Koordinat berhasil disinkronkan dari GPS perangkat Anda!');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([detectedLat, detectedLng], 18, { duration: 1.2 });
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      },
      (err) => {
        setIsDetecting(false);
        let msg = 'Gagal mendeteksi lokasi perangkat.';
        if (err.code === 1) msg = 'Akses lokasi ditolak. Silakan izinkan browser mengakses GPS.';
        if (err.code === 2) msg = 'Sinyal GPS perangkat tidak dapat ditemukan.';
        if (err.code === 3) msg = 'Waktu permintaan lokasi GPS habis (timeout).';
        setGeoError(msg);
        setTimeout(() => setGeoError(''), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handler: Simpan konfigurasi ke localStorage
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const config = {
      namaLokasi,
      alamat,
      lat,
      lng,
      radius,
      isGeofenceActive,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('sppg_titik_lokasi_config', JSON.stringify(config));
    setSuccessMsg('Pengaturan titik lokasi kantor & batas geofence berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handler: Kembalikan ke titik bawaan SPPG Ciomas
  const handleResetDefault = () => {
    if (confirm('Kembalikan titik koordinat dan radius ke default SPPG Ciomas Pagelaran 2?')) {
      setNamaLokasi(DEFAULT_CONFIG.namaLokasi);
      setAlamat(DEFAULT_CONFIG.alamat);
      setLat(DEFAULT_CONFIG.lat);
      setLng(DEFAULT_CONFIG.lng);
      setRadius(DEFAULT_CONFIG.radius);
      setIsGeofenceActive(DEFAULT_CONFIG.isGeofenceActive);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([DEFAULT_CONFIG.lat, DEFAULT_CONFIG.lng], 17);
      }
      setSuccessMsg('Pengaturan lokasi berhasil dikembalikan ke default.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Helper untuk keterangan badge slider radius
  const getRadiusDescription = (r) => {
    if (r <= 35) {
      return {
        badge: 'Sangat Ketat',
        desc: 'Hanya di dalam ruangan dapur / meja kerja',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80'
      };
    }
    if (r <= 80) {
      return {
        badge: 'Rekomendasi Utama',
        desc: 'Rekomendasi area indoor/dapur & lobi utama',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
      };
    }
    if (r <= 160) {
      return {
        badge: 'Area Sedang',
        desc: 'Mencakup area parkir & gerbang operasional',
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200/80'
      };
    }
    return {
      badge: 'Area Luas',
      desc: 'Mencakup jalan dan perumahan sekitar SPPG',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80'
    };
  };

  const radiusInfo = getRadiusDescription(radius);

  return (
    <div className="space-y-6">

      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Pengaturan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#252849] font-bold">Titik Lokasi Kantor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#252849] tracking-tight">
            Titik Lokasi Kantor & Batas Geofence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tentukan koordinat pusat SPPG Ciomas Pagelaran 2 dan radius validasi presensi mandiri pegawai.
          </p>
        </div>

        {/* Tombol Reset ke Default */}
        <button
          type="button"
          onClick={handleResetDefault}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-[#252849] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
          title="Kembalikan koordinat bawaan"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Banner Pesan Sukses / Error */}
      {successMsg && (
        <div className="p-4 bg-[#A2C653]/15 border border-[#A2C653]/40 text-[#2e4210] rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#4e6a1a] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {geoError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Layout Split Screen: 2 Kolom Berdampingan di Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ========================================================
            KOLOM KIRI: FORM PENGATURAN TITIK (lg:col-span-5)
           ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">

          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#252849]/10 text-[#252849] flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#252849]">Form Koordinat & Radius</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A943] bg-[#D9A943]/10 px-2 py-0.5 rounded-md border border-[#D9A943]/30">
              Presisi GPS
            </span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">

            {/* Field 1: Nama Titik Lokasi */}
            <div>
              <label className="block text-xs font-bold text-[#252849] mb-1.5">
                Nama Titik Lokasi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={namaLokasi}
                  onChange={(e) => setNamaLokasi(e.target.value)}
                  placeholder="Contoh: SPPG Ciomas Pagelaran 2 (Gedung Utama)"
                  className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#252849] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all"
                  required
                />
              </div>
            </div>

            {/* Field 2: Alamat Kantor */}
            <div>
              <label className="block text-xs font-bold text-[#252849] mb-1.5">
                Alamat Kantor Lengkap
              </label>
              <textarea
                rows={3}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat lengkap operasional SPPG Ciomas Pagelaran..."
                className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl p-3 text-xs text-[#252849] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all resize-none leading-relaxed"
                required
              />
            </div>

            {/* Field 3: Titik Koordinat GPS (Latitude & Longitude) */}
            <div>
              <label className="block text-xs font-bold text-[#252849] mb-1.5">
                Titik Koordinat GPS Pusat
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Latitude (Lintang)
                  </span>
                  <input
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(Number(parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#252849] font-semibold focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Longitude (Bujur)
                  </span>
                  <input
                    type="number"
                    step="0.000001"
                    value={lng}
                    onChange={(e) => setLng(Number(parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#F7F7F3] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#252849] font-semibold focus:outline-none focus:ring-2 focus:ring-[#252849]/20 focus:border-[#252849] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tombol: Gunakan Lokasi Perangkat Saya Saat Ini */}
              <button
                type="button"
                onClick={handleDetectDeviceLocation}
                disabled={isDetecting}
                className={`mt-2.5 w-full py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                  isDetecting
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait'
                    : 'bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 border-blue-200 active:scale-[0.99]'
                }`}
              >
                <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Mendeteksi sinyal GPS...' : 'Gunakan Lokasi Perangkat Saya Saat Ini'}</span>
              </button>
            </div>

            {/* Field 4: Batas Radius Presensi (Geofence Slider) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-bold text-[#252849]">
                    Batas Radius Presensi (Geofence)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Jarak maksimal HP staf dari titik pusat
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#252849] tracking-tight">
                    {radius} <span className="text-xs font-semibold text-slate-500">Meter</span>
                  </span>
                </div>
              </div>

              {/* Range Slider Modern */}
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#252849]"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>10 M</span>
                <span>150 M</span>
                <span>300 M</span>
              </div>

              {/* Badge Keterangan Radius */}
              <div className="mt-2.5 p-2.5 bg-[#F7F7F3] rounded-xl border border-slate-200/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${radiusInfo.badgeColor}`}>
                    {radiusInfo.badge}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {radiusInfo.desc}
                  </span>
                </div>
              </div>
            </div>

            {/* Field 5: Validasi Geofence (Toggle Switch) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#252849]">
                  Validasi Geofence Aktif
                </p>
                <p className="text-[11px] text-slate-500">
                  {isGeofenceActive 
                    ? 'Kunci presensi jika staf berada di luar radius.' 
                    : 'Bypass geofence aktif (presensi dari mana saja).'}
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsGeofenceActive(!isGeofenceActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isGeofenceActive ? 'bg-[#252849]' : 'bg-slate-300'
                }`}
                aria-label="Toggle validasi geofence"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isGeofenceActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Tombol Simpan Pengaturan Lokasi */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Save className="w-4 h-4 text-[#D9A943]" />
                <span>Simpan Pengaturan Lokasi</span>
              </button>
            </div>

          </form>

        </div>

        {/* ========================================================
            KOLOM KANAN: PETA INTERAKTIF & VISUAL GEOFENCE (lg:col-span-7)
           ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col space-y-3.5">

          {/* Header Peta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#252849]">
                  Peta Satelit & Area Geofence
                </span>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  OpenStreetMap
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Koordinat Terpilih: <strong className="text-slate-800">{lat}, {lng}</strong>
              </p>
            </div>

            {/* Status Badge di Pojok */}
            <div className="shrink-0">
              {isGeofenceActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#A2C653]/20 text-[#2e4210] border border-[#A2C653]/40 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A2C653] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A2C653]"></span>
                  </span>
                  Sistem Geofence Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Geofence Nonaktif
                </span>
              )}
            </div>
          </div>

          {/* Container Peta (Leaflet OpenStreetMap) */}
          <div className="h-[480px] rounded-xl overflow-hidden relative border border-slate-200 shadow-inner group">
            
            {/* Div Target Peta Leaflet */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-full z-0 cursor-crosshair"
              style={{ minHeight: '480px' }}
            />

            {/* Floating Quick Action Overlay di Peta */}
            <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([lat, lng], 17);
                  }
                }}
                className="bg-white/95 hover:bg-white text-[#252849] p-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
                title="Pusatkan kembali ke Pin SPPG"
              >
                <Compass className="w-3.5 h-3.5 text-[#D9A943]" />
                <span className="hidden sm:inline">Pusatkan Peta</span>
              </button>
            </div>

            {/* Floating Info Pill di Bagian Bawah Peta */}
            <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none flex justify-center">
              <div className="bg-[#252849]/90 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-[#D9A943]/30 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A943]" />
                <span>Klik di peta atau geser pin untuk memperbarui koordinat secara interaktif</span>
              </div>
            </div>

          </div>

          {/* Footer Info Peta: Kotak Callout ShieldCheck */}
          <div className="bg-[#F7F7F3] border border-slate-200/90 rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#252849]/10 text-[#252849] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#4e6a1a]" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#252849] mb-0.5">
                Proteksi Kehadiran Terverifikasi:
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Staf hanya dapat mencatat presensi jika posisi GPS HP berada di dalam lingkaran radius <strong>{radius} meter</strong> ini. Di luar area lingkaran, tombol presensi pada layar staf akan otomatis terkunci.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

