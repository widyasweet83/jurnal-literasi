# SIPUS-LIT SMABA (Sistem Perpustakaan & Jurnal Literasi Siswa)
**SMA Negeri 1 Batu (SMABA)**  
*Motto: Berkarakter, Berprestasi, dan Berbudaya Literasi*  
*Alamat: Jl. Ngaglik No. 1, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65311*

---

## 🌟 Tentang Aplikasi
**SIPUS-LIT SMABA** adalah aplikasi terpadu yang dirancang khusus untuk mendukung **Gerakan Literasi Sekolah (GLS) Cendekia** dan Sirkulasi Perpustakaan Digital di **SMA Negeri 1 Batu**. Aplikasi ini memfasilitasi pembiasaan membaca harian siswa, pencatatan reflektif jurnal literasi, verifikasi & penilaian berkala oleh guru pembina / wali kelas, peminjaman buku perpustakaan sekolah (OPAC), serta gamifikasi peringkat literasi (Leaderboard).

Aplikasi ini dapat langsung dijalankan di semua peramban modern (Google Chrome, Microsoft Edge, Firefox, Safari) di laptop, PC laboratorium, tablet, maupun smartphone tanpa memerlukan instalasi server atau dependensi rumit.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder `d:\APLIKASI PERPUSTAKAAN\`.
2. Klik ganda file **`Buka_Aplikasi.bat`** atau klik ganda langsung pada file **`index.html`**.
3. Aplikasi akan langsung terbuka di browser Anda dengan data awal demo yang siap dicoba.

---

## 👥 Pengguna Demo & Peran (Multi-Role)
Anda dapat langsung beralih peran akun hanya dengan mengklik tombol pengalih peran (*Role Switcher*) di bilah atas aplikasi:

| Peran | Nama Akun | Keterangan / Akses |
|---|---|---|
| **Siswa 1** | **Ahmad Fauzan Pratama** (XI-1) | Duta Literasi SMABA (480 Poin). Mengisi jurnal bacaan, meminjam buku fisik, cetak lembar portofolio resmi. |
| **Siswa 2** | **Siti Nur Aini** (XI-2) | Kutu Buku Aktif (320 Poin). Membaca novel sastra klasik dan sejarah. |
| **Siswa 3** | **Bima Raditya Putra** (X-1) | Siswa kelas X dengan jurnal yang memerlukan revisi untuk diuji perbaikannya. |
| **Guru** | **Ibu Widya Ningsih, S.Kom, Gr** | Guru Pembina GLS & Literasi Digital. Memeriksa jurnal, memberi skor (0-100), masukan apresiatif/revisi, dan ekspor rekap ke CSV. |
| **Pustakawan/Admin** | **Ibu Sulis Setiasih** | Kepala Pustakawan & Admin. Mengelola master data buku, 36 rombel kelas siswa, sirkulasi peminjaman, serta cadangan data (JSON). |

---

## 🎯 Fitur-Fitur Utama

### 1. Jurnal Literasi Siswa (GLS)
- **Formulir Pengisian Reflektif**: Judul buku, penulis, kategori (Fiksi, Non-Fiksi, Sains, Sejarah), tanggal baca, jumlah halaman, ringkasan pemahaman, hikmah/nilai karakter (*character building*), kutipan favorit, dan rating bintang.
- **Pilihan Koleksi Otomatis**: Siswa dapat memilih buku dari katalog resmi perpustakaan sekolah atau memasukkan judul buku mandiri.
- **Status Validasi Real-time**:
  - ⏳ *Menunggu Persetujuan Guru/Admin (Pending)*
  - ✓ *Disetujui (Approved)* lengkap dengan nilai skor (misal 95/100) dan catatan apresiasi guru pembimbing.
  - ⚠️ *Perlu Revisi (Revision)* dengan petunjuk perbaikan dari guru.

### 2. Lembar Portofolio Jurnal Literasi Resmi (Format Cetak PDF)
- Dilengkapi **Kop Surat Resmi SMA Negeri 1 Batu** (Pemerintah Provinsi Jawa Timur, Dinas Pendidikan).
- Data identitas siswa, NISN, rombel/kelas, wali kelas, serta tabel rekapitulasi jurnal yang divalidasi.
- Kolom tanda tangan resmi: **Orang Tua/Wali Murid**, **Guru Pembina Literasi (Ibu Widya Ningsih, S.Kom, Gr)**, dan **Kepala SMAN 1 Batu (Drs. Rr. Dwi Retno S., M.Pd)**.

### 3. Papan Peringkat Literasi (Leaderboard) & Gamifikasi
- **Podium Juara 1, 2, dan 3** dengan piala mahkota dan visualisasi pilar.
- **Jenjang Lencana Literasi**:
  - 🌱 *Pembaca Pemula* (≥ 50 Poin)
  - 📖 *Kutu Buku Aktif* (≥ 200 Poin)
  - ✍️ *Master Resensi* (≥ 350 Poin)
  - 🏆 *Duta Literasi SMABA* (≥ 450 Poin)

### 4. Katalog Perpustakaan Sekolah (OPAC) & Sirkulasi
- Pencarian cerdas judul buku, penulis, nomor panggil DDC, dan lokasi rak fisik.
- Filter berdasarkan genre/kategori.
- Fitur peminjaman buku mandiri (durasi otomatis 14 hari) dengan pemantauan stok eksemplar fisik.
- Tombol integrasi langsung: *"Tulis Jurnal untuk Buku Ini"*.

### 5. Agenda Kegiatan Perpustakaan (Internal & Eksternal)
- **Kegiatan Internal SMAN 1 Batu**: Bedah buku bersama duta literasi, Pekan Literasi & Festival Puisi SMABA, Lomba Pojok Baca Kreatif Antar 36 Rombel Kelas, dan Workshop Penulisan Karya Tulis Ilmiah (KTI) Remaja.
- **Kegiatan Eksternal & Kolaborasi**: Kunjungan Literasi ke Dispusip Kota Batu, Festival Literasi Pelajar Tingkat Jawa Timur, Program Donasi & Baksos Buku "SMABA Berbagi", dan Webinar Literasi Daring bersama Perpusnas RI.
- **Fitur Interaktif Siswa**: Pendaftaran langsung peserta kegiatan secara mandiri, kuota peserta otomatis, dan perolehan bonus poin literasi (+30 hingga +50 poin).
- **Manajemen Guru & Pustakawan**: Tambah agenda kegiatan baru, filter status (Akan Datang, Berlangsung, Selesai), edit rincian, hapus agenda, dan ekspor jadwal kegiatan ke CSV.

### 6. Direktori Data Siswa 36 Rombel Kelas
- **Cakupan Lengkap**: 12 Kelas X (X-1 s.d. X-12), 12 Kelas XI (XI-1 s.d. XI-12), dan 12 Kelas XII (XII-1 s.d. XII-12).
- **Akses Pengisian Langsung**: Siswa dapat langsung mengisi jurnal literasi bacaan tanpa perlu ijin awal, dengan tahap validasi/persetujuan oleh guru/pustakawan.
- **Filter Fleksibel**: Pemilahan data berdasarkan tingkat kelas, rombel individual, pencarian NISN/nama siswa, dan ekspor roster siswa ke CSV.

### 7. Portal Validasi Guru & Wali Kelas
- Ringkasan statistik verifikasi (Pending, Disetujui, Perlu Revisi).
- Filter antrean berdasarkan rombel/kelas siswa dari 36 rombel dan status.
- Modal penilaian interaktif dengan skor numerik dan *quick-feedback chips* (analitis, kontekstual karakter, revisi panjang ulasan).
- Fitur *"Setujui Semua Pending"* secara terpadu.
- Ekspor rekapitulasi nilai literasi ke file spreadsheet CSV.

### 8. Panel Pustakawan & Manajemen Data
- Tambah, ubah, dan hapus koleksi buku perpustakaan.
- Tabel pemantauan sirkulasi peminjaman siswa dan tanggal jatuh tempo.
- **Cadangkan Data (Backup)**: Unduh seluruh basis data ke file `.json`.
- **Pulihkan Data (Restore)**: Unggah file `.json` untuk mengembalikan data kapan saja.
- **Reset Data**: Kembalikan ke pengaturan awal demo SMAN 1 Batu.

---

## 💻 Struktur Berkas
```text
d:\APLIKASI PERPUSTAKAAN\
│
├── index.html              # Antarmuka web utama aplikasi
├── Buka_Aplikasi.bat       # Peluncur satu-klik di Windows
├── Jalankan_Server.bat     # Peluncur server lokal http://localhost:8080/
├── server.ps1              # Web server ringan PowerShell HttpListener
├── README.md               # Dokumentasi panduan penggunaan
│
├── assets/
│   ├── logo-sman1batu.png  # Logo resmi SMA Negeri 1 Batu (transparan)
│   └── sman1batu-logo.svg  # Logo vektor resmi SMAN 1 Batu
│
├── css/
│   └── style.css           # Sistem desain modern, kartu kegiatan, glassmorphism & responsive
│
└── js/
    ├── data.js             # Data master 36 kelas, profil sekolah, pengguna 3 role, agenda kegiatan & katalog buku
    ├── storage.js          # Pengontrol LocalStorage, kalkulasi poin, registrasi kegiatan, migrasi & ekspor
    ├── students.js         # Modul direktori 36 kelas siswa & roster
    ├── activities.js       # Modul agenda kegiatan perpustakaan internal & eksternal
    ├── journal.js          # Modul formulir jurnal literasi siswa & verifikasi
    ├── library.js          # Modul katalog perpustakaan OPAC & peminjaman
    ├── teacher.js          # Modul portal pemeriksaan & penilaian guru
    ├── admin.js            # Modul master buku perpustakaan & administrasi
    ├── print.js            # Modul pembuat lembar cetak portofolio resmi SMABA
    └── app.js              # Orkestrator utama, navigasi tab, role switcher, dan notifikasi
```

---
*Dikembangkan dengan penuh dedikasi untuk memajukan budaya literasi di SMA Negeri 1 Batu.*

