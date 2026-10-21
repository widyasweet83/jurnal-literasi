// ========================================================
// DATA MASTER & MOCKUP: SIPUS-LIT SMAN 1 BATU
// Gerakan Literasi Sekolah & Perpustakaan Digital SMABA
// 36 Rombel Kelas: 12 Kelas X, 12 Kelas XI, 12 Kelas XII
// ========================================================

// Daftar Lengkap 36 Kelas SMAN 1 Batu
const CLASSES_36 = [];

// 12 Kelas X
for (let i = 1; i <= 12; i++) {
  CLASSES_36.push({
    id: `X-${i}`,
    grade: "X",
    code: `X-${i}`,
    name: `Kelas X-${i}`,
    waliKelas: `Wali Kelas X-${i} SMAN 1 Batu`,
    totalStudents: 36
  });
}

// 12 Kelas XI
for (let i = 1; i <= 12; i++) {
  CLASSES_36.push({
    id: `XI-${i}`,
    grade: "XI",
    code: `XI-${i}`,
    name: `Kelas XI-${i}`,
    waliKelas: i === 1 ? "Drs. Wahyu Hidayat, M.Si" : (i === 2 ? "Ibu Widya Ningsih, S.Kom, Gr" : `Wali Kelas XI-${i} SMAN 1 Batu`),
    totalStudents: 36
  });
}

// 12 Kelas XII
for (let i = 1; i <= 12; i++) {
  CLASSES_36.push({
    id: `XII-${i}`,
    grade: "XII",
    code: `XII-${i}`,
    name: `Kelas XII-${i}`,
    waliKelas: `Wali Kelas XII-${i} SMAN 1 Batu`,
    totalStudents: 36
  });
}

// Inisialisasi Data Siswa Awal tersebar di berbagai kelas (36 kelas)
const SAMPLE_STUDENTS = [
  // Kelas XI
  {
    id: "siswa-1",
    role: "siswa",
    name: "Ahmad Fauzan Pratama",
    nisn: "0078129841",
    kelas: "XI-1",
    grade: "XI",
    gender: "L",
    avatar: "👨‍🎓",
    level: "Duta Literasi SMABA",
    points: 480,
    targetMonthlyBooks: 4,
    targetDailyMinutes: 30,
    waliKelas: "Drs. Wahyu Hidayat, M.Si",
    bio: "Gemar membaca novel sejarah, sains populer, dan filsafat ringan."
  },
  {
    id: "siswa-2",
    role: "siswa",
    name: "Siti Nur Aini",
    nisn: "0078234120",
    kelas: "XI-2",
    grade: "XI",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Kutu Buku Aktif",
    points: 320,
    targetMonthlyBooks: 3,
    targetDailyMinutes: 25,
    waliKelas: "Ibu Widya Ningsih, S.Kom, Gr",
    bio: "Menyukai sastra klasik Indonesia dan karya fiksi inspiratif."
  },
  {
    id: "siswa-4",
    role: "siswa",
    name: "Dinda Ayu Larasati",
    nisn: "0078345612",
    kelas: "XI-3",
    grade: "XI",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Kutu Buku Aktif",
    points: 290,
    waliKelas: "Wali Kelas XI-3 SMAN 1 Batu"
  },
  {
    id: "siswa-5",
    role: "siswa",
    name: "Faris Alamsyah",
    nisn: "0078456723",
    kelas: "XI-4",
    grade: "XI",
    gender: "L",
    avatar: "👨‍🎓",
    level: "Pembaca Pemula",
    points: 175,
    waliKelas: "Wali Kelas XI-4 SMAN 1 Batu"
  },

  // Kelas X
  {
    id: "siswa-3",
    role: "siswa",
    name: "Bima Raditya Putra",
    nisn: "0089123490",
    kelas: "X-1",
    grade: "X",
    gender: "L",
    avatar: "🧑‍🎓",
    level: "Pembaca Pemula",
    points: 140,
    targetMonthlyBooks: 2,
    targetDailyMinutes: 20,
    waliKelas: "Wali Kelas X-1 SMAN 1 Batu",
    bio: "Baru memulai kebiasaan membaca buku non-fiksi biografi."
  },
  {
    id: "siswa-6",
    role: "siswa",
    name: "Nabila Zahra Kirana",
    nisn: "0089234501",
    kelas: "X-2",
    grade: "X",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Kutu Buku Aktif",
    points: 245,
    waliKelas: "Wali Kelas X-2 SMAN 1 Batu"
  },
  {
    id: "siswa-7",
    role: "siswa",
    name: "Rizky Aditya Pratama",
    nisn: "0089345612",
    kelas: "X-5",
    grade: "X",
    gender: "L",
    avatar: "🧑‍🎓",
    level: "Pembaca Pemula",
    points: 110,
    waliKelas: "Wali Kelas X-5 SMAN 1 Batu"
  },
  {
    id: "siswa-8",
    role: "siswa",
    name: "Chelsea Olivia Putri",
    nisn: "0089456723",
    kelas: "X-10",
    grade: "X",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Pembaca Pemula",
    points: 95,
    waliKelas: "Wali Kelas X-10 SMAN 1 Batu"
  },

  // Kelas XII
  {
    id: "siswa-9",
    role: "siswa",
    name: "Muhammad Raihan Akbar",
    nisn: "0067123890",
    kelas: "XII-1",
    grade: "XII",
    gender: "L",
    avatar: "👨‍🎓",
    level: "Duta Literasi SMABA",
    points: 520,
    waliKelas: "Wali Kelas XII-1 SMAN 1 Batu"
  },
  {
    id: "siswa-10",
    role: "siswa",
    name: "Gita Safitri",
    nisn: "0067234901",
    kelas: "XII-3",
    grade: "XII",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Master Resensi",
    points: 390,
    waliKelas: "Wali Kelas XII-3 SMAN 1 Batu"
  },
  {
    id: "siswa-11",
    role: "siswa",
    name: "Kevin Jonathan",
    nisn: "0067345012",
    kelas: "XII-7",
    grade: "XII",
    gender: "L",
    avatar: "👨‍🎓",
    level: "Kutu Buku Aktif",
    points: 260,
    waliKelas: "Wali Kelas XII-7 SMAN 1 Batu"
  },
  {
    id: "siswa-12",
    role: "siswa",
    name: "Anindya Maheswari",
    nisn: "0067456123",
    kelas: "XII-12",
    grade: "XII",
    gender: "P",
    avatar: "👩‍🎓",
    level: "Master Resensi",
    points: 410,
    waliKelas: "Wali Kelas XII-12 SMAN 1 Batu"
  }
];

// Tambahan siswa representatif untuk kelas lainnya agar 36 kelas memiliki data awal
const INDONESIAN_NAMES = [
  "Aditya Pratama", "Bayu Saputra", "Cahya Permana", "Dimas Anggara", "Eko Wahyudi",
  "Fahmi Nugraha", "Gilang Ramadhan", "Hendra Wijaya", "Irfan Hakim", "Joko Susilo",
  "Kuncoro Jati", "Luki Hermawan", "Maulana Malik", "Nanda Pratama", "Oki Setiawan",
  "Pandu Wicaksono", "Qori Alamsyah", "Rian Hidayat", "Surya Saputra", "Teguh Prasetyo",
  "Annisa Rahma", "Bunga Citra", "Citra Dewi", "Dewi Sartika", "Erna Wulandari",
  "Fitri Handayani", "Gita Gutawa", "Hani Melati", "Indah Permata", "Jasmine Putri",
  "Kartika Sari", "Lestari Anggraini", "Maya Kusuma", "Nadya Utami", "Putri Maharani"
];

// Pastikan setiap kelas memiliki minimal 1-2 siswa terdaftar
CLASSES_36.forEach((cls, idx) => {
  const existing = SAMPLE_STUDENTS.find(s => s.kelas === cls.id);
  if (!existing) {
    const isMale = idx % 2 === 0;
    const name = INDONESIAN_NAMES[idx % INDONESIAN_NAMES.length];
    const nisnPrefix = cls.grade === "X" ? "0089" : (cls.grade === "XI" ? "0078" : "0067");
    const numStr = String(idx + 10).padStart(3, "0");
    const nisn = `${nisnPrefix}${numStr}${Math.floor(100 + Math.random() * 900)}`;
    const pts = Math.floor(60 + Math.random() * 250);

    let level = "Pembaca Pemula";
    if (pts >= 450) level = "Duta Literasi SMABA";
    else if (pts >= 350) level = "Master Resensi";
    else if (pts >= 200) level = "Kutu Buku Aktif";

    SAMPLE_STUDENTS.push({
      id: `siswa-${cls.id.toLowerCase()}`,
      role: "siswa",
      name: `${name} (${cls.id})`,
      nisn: nisn,
      kelas: cls.id,
      grade: cls.grade,
      gender: isMale ? "L" : "P",
      avatar: isMale ? "👨‍🎓" : "👩‍🎓",
      level: level,
      points: pts,
      targetMonthlyBooks: 3,
      targetDailyMinutes: 20,
      waliKelas: cls.waliKelas,
      bio: `Siswa aktif pembiasaan literasi ${cls.name} SMAN 1 Batu.`
    });
  }
});

const INITIAL_DATA = {
  school: {
    name: "SMA Negeri 1 Batu",
    abbreviation: "SMAN 1 BATU (SMABA)",
    npsn: "20536827",
    address: "Jl. Ngaglik No. 1, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65311",
    website: "sman1batu.sch.id",
    motto: "Berkarakter, Berprestasi, dan Berbudaya Literasi",
    latinMotto: "Studium et Virtus (Belajar dan Kebajikan)",
    headmaster: "Bapak Anto Dwi Cahyono, S.Pd, M.M",
    libraryHead: "Ibu Rini Wahyuningsih, S.Pd",
    programName: "Gerakan Literasi Sekolah (GLS) SMABA Cendekia",
    totalClasses: 36
  },

  classes: CLASSES_36,

  users: [
    ...SAMPLE_STUDENTS,
    {
      id: "guru-1",
      role: "guru",
      name: "Ibu Widya Ningsih, S.Kom, Gr",
      nip: "198506142010012015",
      jabatan: "Guru Pembina GLS & Literasi Digital SMAN 1 Batu",
      kelasBinaan: CLASSES_36.map(c => c.id), // Membina seluruh 36 kelas
      avatar: "👩‍🏫"
    },
    {
      id: "admin-1",
      role: "admin",
      name: "Ibu Sulis Setiasih",
      nip: "198204122008012009",
      jabatan: "Pustakawan Pelaksana & Admin Perpustakaan SMABA",
      avatar: "👩‍💼"
    },
    {
      id: "admin-2",
      role: "admin",
      name: "Ibu Rini Wahyuningsih, S.Pd",
      nip: "197805122005012008",
      jabatan: "Kepala Perpustakaan SMAN 1 Batu",
      avatar: "🏛️"
    }
  ],

  badges: [
    { id: "b1", title: "Pembaca Pemula", minPoints: 50, icon: "🌱", desc: "Menyelesaikan 1 jurnal literasi pertama" },
    { id: "b2", title: "Kutu Buku Aktif", minPoints: 200, icon: "📖", desc: "Membaca lebih dari 5 judul buku" },
    { id: "b3", title: "Master Resensi", minPoints: 350, icon: "✍️", desc: "Menulis ulasan kritis dan reflektif berbobot" },
    { id: "b4", title: "Duta Literasi SMABA", minPoints: 450, icon: "🏆", desc: "Peringkat tertinggi pembiasaan literasi sekolah" }
  ],

  books: [
    {
      id: "buku-1",
      isbn: "978-979-3062-79-2",
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      publisher: "Bentang Pustaka",
      year: 2005,
      pages: 529,
      category: "Fiksi / Sastra",
      callNumber: "813 HIR l",
      shelf: "Rak Fiksi A-02",
      stockTotal: 8,
      stockAvailable: 5,
      color: "#f59e0b",
      coverIcon: "🌈",
      synopsis: "Kisah perjuangan sepuluh anak di Belitung Timur yang berjuang meraih pendidikan di tengah keterbatasan fasilitas sekolah SD Muhammadiyah. Penuh nilai ketabahan, persahabatan, dan harapan.",
      recommendedFor: "Semua Tingkat (X, XI, XII)"
    },
    {
      id: "buku-2",
      isbn: "978-602-03-8591-4",
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      publisher: "Lentera Dipantara",
      year: 1980,
      pages: 535,
      category: "Fiksi Sejarah",
      callNumber: "813 TOE b",
      shelf: "Rak Sastra B-01",
      stockTotal: 6,
      stockAvailable: 3,
      color: "#b91c1c",
      coverIcon: "🏛️",
      synopsis: "Roman tetralogi Buru pertama yang mengisahkan Minke, pemuda pribumi yang tercerahkan di zaman kolonial Belanda, serta kekagumannya pada sosok Nyai Ontosoroh yang tegar dan cerdas.",
      recommendedFor: "Kelas XI & XII"
    },
    {
      id: "buku-3",
      isbn: "978-602-06-3317-6",
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      publisher: "Kompas Gramedia",
      year: 2019,
      pages: 346,
      category: "Pengembangan Diri / Filsafat",
      callNumber: "158.1 MAN f",
      shelf: "Rak Non-Fiksi C-04",
      stockTotal: 10,
      stockAvailable: 6,
      color: "#0284c7",
      coverIcon: "🏛️",
      synopsis: "Penerapan filsafat Stoisisme kuno Yunani-Romawi dalam kehidupan sehari-hari kaum muda untuk mengatasi emosi negatif, cemas, dan overthinking demi ketenangan jiwa.",
      recommendedFor: "Semua Tingkat"
    },
    {
      id: "buku-4",
      isbn: "978-602-06-3844-7",
      title: "Laut Bercerita",
      author: "Leila S. Chudori",
      publisher: "Kepustakaan Populer Gramedia",
      year: 2017,
      pages: 379,
      category: "Fiksi Sejarah / Drama",
      callNumber: "813 CHU l",
      shelf: "Rak Sastra B-03",
      stockTotal: 5,
      stockAvailable: 2,
      color: "#0891b2",
      coverIcon: "🌊",
      synopsis: "Kisah tentang aktivis mahasiswa tahun 1998 yang diculik dan dihilangkan, serta ketegaran keluarga yang ditinggalkan dalam mencari kebenaran dan keadilan.",
      recommendedFor: "Kelas XI & XII"
    },
    {
      id: "buku-5",
      isbn: "978-602-03-3158-4",
      title: "Negeri 5 Menara",
      author: "Ahmad Fuadi",
      publisher: "Gramedia Pustaka Utama",
      year: 2009,
      pages: 423,
      category: "Fiksi Inspiratif",
      callNumber: "813 FUA n",
      shelf: "Rak Fiksi A-05",
      stockTotal: 7,
      stockAvailable: 4,
      color: "#16a34a",
      coverIcon: "🕌",
      synopsis: "Enam santri dari penjuru Nusantara di Pesantren Madani yang berpegang teguh pada mantra sakti 'Man Jadda Wajada' (siapa yang bersungguh-sungguh akan berhasil).",
      recommendedFor: "Semua Tingkat"
    },
    {
      id: "buku-6",
      isbn: "978-602-06-3318-3",
      title: "Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa",
      author: "James Clear (Terj.)",
      publisher: "Gramedia Pustaka Utama",
      year: 2020,
      pages: 356,
      category: "Pengembangan Diri",
      callNumber: "158.1 CLE a",
      shelf: "Rak Non-Fiksi C-02",
      stockTotal: 8,
      stockAvailable: 5,
      color: "#ea580c",
      coverIcon: "⚡",
      synopsis: "Panduan praktis membentuk kebiasaan baik dan menghilangkan kebiasaan buruk dengan memanfaatkan sistem 1% kemajuan setiap hari.",
      recommendedFor: "Semua Tingkat"
    },
    {
      id: "buku-7",
      isbn: "978-602-291-766-3",
      title: "Sains di Balik Keajaiban Alam",
      author: "Dr. Bambang Purnomo",
      publisher: "Erlangga Edukasi",
      year: 2022,
      pages: 280,
      category: "Sains & Teknologi",
      callNumber: "500 PUR s",
      shelf: "Rak Sains D-01",
      stockTotal: 6,
      stockAvailable: 6,
      color: "#9333ea",
      coverIcon: "🔬",
      synopsis: "Eksplorasi fenomena fisika, biologi, dan kimia di alam Nusantara, termasuk kekayaan geologi dan agrikultur Jawa Timur.",
      recommendedFor: "Sains MIPA"
    },
    {
      id: "buku-8",
      isbn: "978-602-06-4412-1",
      title: "Sejarah Perjuangan Kota Batu & Malang Raya",
      author: "Tim Musyawarah Guru Sejarah",
      publisher: "Pustaka Edukasi Batu",
      year: 2021,
      pages: 215,
      category: "Sejarah Lokal",
      callNumber: "959.8 TIM s",
      shelf: "Rak Sejarah E-01",
      stockTotal: 4,
      stockAvailable: 3,
      color: "#4f46e5",
      coverIcon: "🏔️",
      synopsis: "Kumpulan catatan sejarah perjuangan kemerdekaan rakyat Kota Batu, peran pahlawan lokal, serta cagar budaya sejarah di lereng Gunung Panderman dan Arjuno.",
      recommendedFor: "Muatan Lokal & Sejarah"
    }
  ],

  journals: [
    {
      id: "jrn-1",
      studentId: "siswa-1",
      studentName: "Ahmad Fauzan Pratama",
      studentClass: "XI-1",
      studentNisn: "0078129841",
      bookId: "buku-3",
      bookTitle: "Filosofi Teras",
      bookAuthor: "Henry Manampiring",
      bookCategory: "Pengembangan Diri / Filsafat",
      dateRead: "2026-10-17",
      pagesRead: 65,
      totalBookPages: 346,
      status: "approved", // approved, pending, revision
      rating: 5,
      summary: "Bab 4-6 mengupas konsep 'Dikotomi Kendali'. Stoisisme mengajarkan bahwa dalam hidup ada hal-hal yang berada di bawah kendali kita (pikiran, tindakan, respon, usaha) dan hal-hal di luar kendali kita (opini orang lain, hasil akhir, kondisi cuaca). Penulis menyajikannya dengan analogi kekinian yang sangat pas bagi pelajar SMA yang sering cemas menghadapi ujian dan pergaulan.",
      moralValue: "Belajar untuk tidak membuang energi memikirkan hal yang tak bisa dikendalikan. Fokus 100% pada persiapan belajar dan etika pribadi daripada mencemaskan ekspektasi orang lain.",
      favoriteQuote: "Bukan hal-hal di luar diri kita yang membuat kita resah, melainkan penilaian kita sendiri terhadap hal-hal tersebut.",
      teacherScore: 95,
      teacherFeedback: "Ulasan yang sangat analitis dan mendalam, Fauzan! Penerapan dikotomi kendali untuk menghadapi ujian sangat relevan. Terus pertahankan budaya berpikir kritis ini.",
      teacherName: "Ibu Widya Ningsih, S.Kom, Gr",
      verifiedAt: "2026-10-18 09:30"
    },
    {
      id: "jrn-2",
      studentId: "siswa-1",
      studentName: "Ahmad Fauzan Pratama",
      studentClass: "XI-1",
      studentNisn: "0078129841",
      bookId: "buku-1",
      bookTitle: "Laskar Pelangi",
      bookAuthor: "Andrea Hirata",
      bookCategory: "Fiksi / Sastra",
      dateRead: "2026-10-18",
      pagesRead: 110,
      totalBookPages: 529,
      status: "pending", // Memerlukan persetujuan guru / admin
      rating: 5,
      summary: "Membaca bagian perjuangan Lintang yang mengayuh sepeda sejauh puluhan kilometer dan melewati rawa buaya demi tidak terlambat masuk sekolah. Bab ini melukiskan ketulusan cinta seorang anak cerdas pada ilmu pengetahuan yang tidak luntur oleh kemiskinan.",
      moralValue: "Keterbatasan fasilitas bukan alasan untuk berputus asa. Semangat pantang menyerah Lintang menampar kita yang sering mengeluh padahal bersekolah di lingkungan serba lengkap di SMABA.",
      favoriteQuote: "Bermimpilah, karena Tuhan akan memeluk mimpi-mimpimu.",
      teacherScore: null,
      teacherFeedback: null,
      teacherName: null,
      verifiedAt: null
    },
    {
      id: "jrn-3",
      studentId: "siswa-2",
      studentName: "Siti Nur Aini",
      studentClass: "XI-2",
      studentNisn: "0078234120",
      bookId: "buku-4",
      bookTitle: "Laut Bercerita",
      bookAuthor: "Leila S. Chudori",
      bookCategory: "Fiksi Sejarah / Drama",
      dateRead: "2026-10-16",
      pagesRead: 85,
      totalBookPages: 379,
      status: "approved",
      rating: 5,
      summary: "Sudut pandang Biru Laut menceritakan idealisme pemuda aktivis kampus yang memperjuangkan hak petani Blangguan. Narasi Leila sangat puitis namun menyentuh sisi kemanusiaan yang getir.",
      moralValue: "Keberanian menyuarakan kebenaran dan empati mendalam terhadap kaum tertindas adalah esensi kemanusiaan sejati.",
      favoriteQuote: "Matilah dengan terhormat, atau hiduplah dengan memegang teguh martabatmu.",
      teacherScore: 92,
      teacherFeedback: "Analisis karakter dan latar sejarah yang apik Siti. Pilihan diksi ulasanmu sangat rapi.",
      teacherName: "Ibu Widya Ningsih, S.Kom, Gr",
      verifiedAt: "2026-10-17 14:15"
    },
    {
      id: "jrn-4",
      studentId: "siswa-3",
      studentName: "Bima Raditya Putra",
      studentClass: "X-1",
      studentNisn: "0089123490",
      bookId: "buku-6",
      bookTitle: "Atomic Habits",
      bookAuthor: "James Clear (Terj.)",
      bookCategory: "Pengembangan Diri",
      dateRead: "2026-10-18",
      pagesRead: 40,
      totalBookPages: 356,
      status: "revision",
      rating: 4,
      summary: "Buku ini membahas cara bangun pagi dan membuat jadwal harian baru.",
      moralValue: "Bisa bangun pagi tepat waktu.",
      favoriteQuote: "Disiplin itu penting.",
      teacherScore: 68,
      teacherFeedback: "Halo Bima, ringkasanmu masih terlalu singkat. Tolong uraikan hukum 4 langkah perubahan perilaku (Cue, Craving, Response, Reward) yang ada di bab tersebut agar ulasanmu lebih berbobot ya!",
      teacherName: "Ibu Widya Ningsih, S.Kom, Gr",
      verifiedAt: "2026-10-18 16:20"
    },
    {
      id: "jrn-5",
      studentId: "siswa-9",
      studentName: "Muhammad Raihan Akbar",
      studentClass: "XII-1",
      studentNisn: "0067123890",
      bookId: "buku-2",
      bookTitle: "Bumi Manusia",
      bookAuthor: "Pramoedya Ananta Toer",
      bookCategory: "Fiksi Sejarah",
      dateRead: "2026-10-18",
      pagesRead: 90,
      totalBookPages: 535,
      status: "pending",
      rating: 5,
      summary: "Karakter Nyai Ontosoroh sangat memukau. Walaupun berstatus gundik yang dipandang sebelah mata dalam strata kolonial, kecerdasan dan martabatnya mengalahkan para pejabat Belanda.",
      moralValue: "Harga diri seseorang tidak ditentukan oleh status sosial kelahirannya, melainkan oleh integritas, ketekunan, dan ilmu pengetahuannya.",
      favoriteQuote: "Berbahagialah dia yang makan dari keringatnya sendiri, bersuka karena usahanya sendiri.",
      teacherScore: null,
      teacherFeedback: null,
      teacherName: null,
      verifiedAt: null
    }
  ],

  borrows: [
    {
      id: "brw-1",
      studentId: "siswa-1",
      studentName: "Ahmad Fauzan Pratama",
      bookId: "buku-3",
      bookTitle: "Filosofi Teras",
      borrowDate: "2026-10-12",
      dueDate: "2026-10-26",
      returnDate: null,
      status: "dipinjam"
    },
    {
      id: "brw-2",
      studentId: "siswa-2",
      studentName: "Siti Nur Aini",
      bookId: "buku-4",
      bookTitle: "Laut Bercerita",
      borrowDate: "2026-10-10",
      dueDate: "2026-10-24",
      returnDate: null,
      status: "dipinjam"
    },
    {
      id: "brw-3",
      studentId: "siswa-1",
      studentName: "Ahmad Fauzan Pratama",
      bookId: "buku-5",
      bookTitle: "Negeri 5 Menara",
      borrowDate: "2026-09-20",
      dueDate: "2026-10-04",
      returnDate: "2026-10-03",
      status: "kembali"
    }
  ],

  activities: [
    // --- KEGIATAN INTERNAL PERPUSTAKAAN ---
    {
      id: "act-1",
      title: "Bedah Buku & Diskusi Sastra: Mengupas Novel Laut Bercerita",
      type: "internal", // internal vs external
      category: "Diskusi & Bedah Buku",
      status: "upcoming", // upcoming, ongoing, completed
      date: "2026-10-28",
      time: "09.00 - 12.00 WIB",
      location: "Aula Perpustakaan SMAN 1 Batu",
      coordinator: "Ibu Widya Ningsih, S.Kom, Gr",
      targetAudience: "Siswa Perwakilan 36 Kelas & Komunitas Literasi",
      quota: 80,
      registeredStudents: ["siswa-1", "siswa-2"],
      pointsReward: 35,
      bannerColor: "#1e3a8a",
      icon: "📖",
      description: "Diskusi sastra dan refleksi nilai-nilai kemanusiaan dari novel 'Laut Bercerita' karya Leila S. Chudori. Dipandu oleh Duta Literasi SMABA dengan narasumber sastrawan Jawa Timur.",
      objectives: "Membangun kemampuan berpikir analitis, pemahaman latar sejarah 1998, dan keterampilan mengemukakan pendapat kritis bagi siswa."
    },
    {
      id: "act-2",
      title: "Pekan Literasi Siswa & Pameran Karya Resensi 36 Kelas",
      type: "internal",
      category: "Festival & Pameran",
      status: "upcoming",
      date: "2026-11-10",
      time: "08.00 - 15.00 WIB",
      location: "Selasar Utama & Area Terbuka Perpustakaan SMABA",
      coordinator: "Ibu Sulis Setiasih (Pustakawan)",
      targetAudience: "Seluruh Siswa (12 Kelas X, 12 Kelas XI, 12 Kelas XII)",
      quota: 1200,
      registeredStudents: ["siswa-1", "siswa-2", "siswa-3", "siswa-9"],
      pointsReward: 50,
      bannerColor: "#059669",
      icon: "🎪",
      description: "Pameran portofolio resensi terbaik hasil karya siswa dari 36 rombel kelas, bursa tukar buku bacaan, gelar wicara kepenulisan kreatif, serta penghargaan Pembaca Teraktif.",
      objectives: "Mengapresiasi karya literasi siswa dan menumbuhkan budaya gemar membaca yang menyenangkan di lingkungan sekolah."
    },
    {
      id: "act-3",
      title: "Lomba Penataan & Kreativitas Pojok Baca 36 Rombel Kelas",
      type: "internal",
      category: "Lomba & Pembiasaan",
      status: "ongoing",
      date: "2026-10-01 s.d. 2026-10-31",
      time: "Selama Jam Istirahat & Pembiasaan",
      location: "Ruang Kelas X-1 s.d. XII-12 SMAN 1 Batu",
      coordinator: "Ibu Sulis Setiasih & Tim Penilai GLS",
      targetAudience: "36 Rombel Kelas (X-1 s.d. X-12, XI-1 s.d. XI-12, XII-1 s.d. XII-12)",
      quota: 36,
      registeredStudents: ["siswa-1", "siswa-2", "siswa-3", "siswa-4", "siswa-5"],
      pointsReward: 30,
      bannerColor: "#d97706",
      icon: "🏆",
      description: "Kompetisi kreasi pojok baca di masing-masing dari 36 kelas. Penilaian meliputi kelengkapan koleksi buku fisik, kerapian administrasi jurnal kelas, kenyamanan dekorasi, dan keaktifan membaca siswa.",
      objectives: "Mendekatkan akses buku bacaan langsung ke dalam ruang kelas setiap hari."
    },
    {
      id: "act-4",
      title: "Workshop Penulisan Karya Tulis Ilmiah & Ulasan Kritis Siswa",
      type: "internal",
      category: "Pelatihan & Workshop",
      status: "completed",
      date: "2026-10-14",
      time: "13.00 - 15.30 WIB",
      location: "Ruang Multimedia & Lab Komputer SMABA",
      coordinator: "Ibu Widya Ningsih, S.Kom, Gr",
      targetAudience: "Anggota KIR & Tim Jurnalistik Sekolah",
      quota: 50,
      registeredStudents: ["siswa-1", "siswa-10"],
      pointsReward: 40,
      bannerColor: "#7c3aed",
      icon: "✍️",
      description: "Pelatihan teknik merangkum bahan pustaka, sitasi ilmiah bebas plagiasi, serta penyusunan artikel ulasan buku berbobot akademis.",
      objectives: "Meningkatkan literasi informasi dan kecakapan akademik siswa menghadapi kurikulum merdeka."
    },

    // --- KEGIATAN EKSTERNAL PERPUSTAKAAN ---
    {
      id: "act-5",
      title: "Kunjungan Edukasi & Preservasi Arsip ke Dispusip Kota Batu",
      type: "external",
      category: "Kunjungan Luar Sekolah",
      status: "upcoming",
      date: "2026-11-05",
      time: "08.30 - 13.00 WIB",
      location: "Dinas Perpustakaan & Kearsipan (Dispusip) Kota Batu, Jl. Kartini No. 2",
      coordinator: "Ibu Sulis Setiasih (Pustakawan)",
      targetAudience: "Perwakilan Pengurus Perpustakaan & Duta Baca 36 Kelas (72 Siswa)",
      quota: 75,
      registeredStudents: ["siswa-1", "siswa-2", "siswa-9"],
      pointsReward: 45,
      bannerColor: "#0284c7",
      icon: "🏛️",
      description: "Kunjungan langsung ke perpustakaan daerah Kota Batu untuk mempelajari sistem otomasi perpustakaan daerah, preservasi naskah kuno Kota Batu, dan layanan digital iBatu.",
      objectives: "Memperluas wawasan kepustakawanan dan kolaborasi antar-lembaga perpustakaan di Kota Batu."
    },
    {
      id: "act-6",
      title: "Delegasi Festival Literasi Pelajar SMA/SMK Se-Jawa Timur 2026",
      type: "external",
      category: "Kompetisi Wilayah",
      status: "upcoming",
      date: "2026-11-20 s.d. 2026-11-22",
      time: "08.00 - 17.00 WIB",
      location: "Balai Pemuda & Gedung Perpustakaan Daerah Jatim, Surabaya",
      coordinator: "Ibu Widya Ningsih, S.Kom, Gr",
      targetAudience: "Kontingen Terpilih Duta Literasi SMABA",
      quota: 12,
      registeredStudents: ["siswa-1", "siswa-12"],
      pointsReward: 75,
      bannerColor: "#e11d48",
      icon: "🌟",
      description: "Pengiriman delegasi siswa SMAN 1 Batu dalam kompetisi resensi buku fiksi-ilmiah, orasi literasi kebangsaan, dan cipta karya sastra tingkat Provinsi Jawa Timur.",
      objectives: "Menorehkan prestasi literasi sekolah di tingkat provinsi dan mengasah sportivitas pelajar."
    },
    {
      id: "act-7",
      title: "Gerakan 'SMABA Berbagi': Donasi 500 Buku untuk SD/MI Binaan",
      type: "external",
      category: "Pengabdian & Baksos",
      status: "completed",
      date: "2026-09-30",
      time: "08.00 - 12.00 WIB",
      location: "SD Binaan Lereng Gunung Panderman & Dusun Songgoriti",
      coordinator: "Ibu Sulis Setiasih & OSIS Literasi",
      targetAudience: "Seluruh Warga SMAN 1 Batu (Siswa 36 Kelas & Guru)",
      quota: 500,
      registeredStudents: ["siswa-1", "siswa-2", "siswa-3", "siswa-4"],
      pointsReward: 50,
      bannerColor: "#0d9488",
      icon: "🎁",
      description: "Penyaluran 500 buku bacaan anak, ensiklopedia, dan buku cerita bergambar layak baca hasil donasi sukarela siswa SMABA untuk pojok baca sekolah dasar di wilayah terpencil Kota Batu.",
      objectives: "Membangun kepedulian sosial dan pemerataan akses literasi untuk anak-anak di Kota Batu."
    },
    {
      id: "act-8",
      title: "Webinar Nasional: Memaksimalkan Literasi Digital & iPusnas Bersama Perpusnas RI",
      type: "external",
      category: "Webinar Nasional",
      status: "upcoming",
      date: "2026-11-18",
      time: "13.30 - 16.00 WIB",
      location: "Zoom Virtual & Live Streaming Perpustakaan SMAN 1 Batu",
      coordinator: "Ibu Widya Ningsih, S.Kom, Gr",
      targetAudience: "Seluruh Siswa 36 Kelas, Guru, dan Pegiat Literasi",
      quota: 500,
      registeredStudents: ["siswa-1"],
      pointsReward: 35,
      bannerColor: "#4f46e5",
      icon: "💻",
      description: "Seminar daring nasional pemanfaatan super-library digital Perpustakaan Nasional Republik Indonesia (Perpusnas RI), teknik pencarian jurnal internasional, dan etika kecerdasan buatan dalam riset pelajar.",
      objectives: "Mengembangkan literasi digital beretika dan kemampuan riset mandiri pelajar era modern."
    }
  ],

  // ========================================================
  // GALERI DOKUMENTASI FOTO & VIDEO PERPUSTAKAAN SMABA
  // Tersimpan & Tertaut ke Google Drive: perpustakaan@sman1batu.sch.id
  // ========================================================
  galleryMedia: [
    {
      id: "media-1",
      title: "Dokumentasi Pembiasaan Membaca Pagi Siswa di Perpustakaan SMABA",
      type: "photo",
      category: "Kegiatan Internal SMAN 1 Batu",
      date: "2026-10-15",
      uploader: "Ibu Widya Ningsih, S.Kom, Gr",
      uploaderRole: "guru",
      thumbnail: "assets/kegiatan_internal.jpg",
      mediaUrl: "assets/kegiatan_internal.jpg",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Suasana antusiasme dan ketenangan para siswa-siswi SMAN 1 Batu saat mengikuti pembiasaan literasi 15 menit sebelum pembelajaran di ruang baca utama perpustakaan.",
      duration: ""
    },
    {
      id: "media-2",
      title: "Kunjungan Edukasi & Preservasi Naskah Kuno ke Dispusip Kota Batu",
      type: "photo",
      category: "Kegiatan Eksternal & Dispusip",
      date: "2026-10-10",
      uploader: "Ibu Rini Wahyuningsih, S.Pd",
      uploaderRole: "admin",
      thumbnail: "assets/kegiatan_eksternal.jpg",
      mediaUrl: "assets/kegiatan_eksternal.jpg",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Perwakilan Duta Literasi SMABA bersama Kepala Perpustakaan Ibu Rini Wahyuningsih, S.Pd saat studi referensi kearsipan dan naskah bersejarah di Dispusip Kota Batu.",
      duration: ""
    },
    {
      id: "media-3",
      title: "Video Dokumenter: Semarak Pekan Literasi & Bedah Puisi SMABA 2026",
      type: "video",
      category: "Kegiatan Internal SMAN 1 Batu",
      date: "2026-10-08",
      uploader: "Ahmad Fauzan Pratama (XI-1)",
      uploaderRole: "siswa",
      thumbnail: "assets/kegiatan_internal.jpg",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Rekaman video dokumenter perayaan Pekan Literasi Sekolah, unjuk cipta karya puisi dan bedah buku karya siswa di Aula Graha Cendekia SMAN 1 Batu.",
      duration: "03:42"
    },
    {
      id: "media-4",
      title: "Potret Kreativitas Pojok Baca Kelas XI-1: 'Griya Literasi Cendekia'",
      type: "photo",
      category: "Pojok Baca 36 Kelas",
      date: "2026-10-05",
      uploader: "Ahmad Fauzan Pratama (XI-1)",
      uploaderRole: "siswa",
      thumbnail: "assets/kegiatan_internal.jpg",
      mediaUrl: "assets/kegiatan_internal.jpg",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Penataan pojok baca kreatif di ruang kelas XI-1 yang dilengkapi 85 eksemplar buku bacaan, bantal duduk santai, dan pohon literasi capaian membaca siswa.",
      duration: ""
    },
    {
      id: "media-5",
      title: "Video Liputan: Penyaluran Donasi 500 Buku 'SMABA Berbagi' ke SD Binaan",
      type: "video",
      category: "Kegiatan Eksternal & Dispusip",
      date: "2026-10-01",
      uploader: "Ibu Sulis Setiasih",
      uploaderRole: "admin",
      thumbnail: "assets/kegiatan_eksternal.jpg",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Liputan aksi sosial penyerahan donasi buku bacaan dan ensiklopedia dari seluruh warga 36 kelas SMABA untuk sekolah dasar di wilayah Songgoriti, Kota Batu.",
      duration: "05:18"
    },
    {
      id: "media-6",
      title: "Fasilitas Komputer Penelusuran Katalog OPAC & E-Library SMABA",
      type: "photo",
      category: "Fasilitas Perpustakaan",
      date: "2026-09-25",
      uploader: "Ibu Rini Wahyuningsih, S.Pd",
      uploaderRole: "admin",
      thumbnail: "assets/kegiatan_internal.jpg",
      mediaUrl: "assets/kegiatan_internal.jpg",
      driveLink: "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: "Fasilitas terminal penelusuran katalog digital (OPAC) mandiri bagi para siswa untuk mencari lokasi buku di rak secara cepat dan presisi.",
      duration: ""
    }
  ]
};
