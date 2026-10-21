// ========================================================
// STORAGE & STATE CONTROLLER: SMAN 1 BATU
// Mengelola LocalStorage, Sinkronisasi Data 36 Kelas & Siswa
// ========================================================

const STORAGE_KEY = "SMABA_LITERA_DATA_V1";
const CURRENT_USER_KEY = "SMABA_CURRENT_USER_ID";

class AppStorage {
  constructor() {
    this.data = this.loadData();
    this.currentUserId = localStorage.getItem(CURRENT_USER_KEY) || "siswa-1";
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let hasChanges = false;

        // Migrasi otomatis jika kelas 36 belum ada di storage lama
        if (!parsed.classes || parsed.classes.length < 36) {
          parsed.classes = JSON.parse(JSON.stringify(CLASSES_36));
          const existingIds = new Set(parsed.users.map(u => u.id));
          SAMPLE_STUDENTS.forEach(s => {
            if (!existingIds.has(s.id)) {
              parsed.users.push(s);
            }
          });
          hasChanges = true;
        }

        // Migrasi otomatis jika activities belum ada di storage lama
        if (!parsed.activities || parsed.activities.length === 0) {
          parsed.activities = JSON.parse(JSON.stringify(INITIAL_DATA.activities));
          hasChanges = true;
        }

        // Perbarui akun guru menjadi Ibu Widya Ningsih, S.Kom, Gr
        const guru = parsed.users.find(u => u.id === "guru-1");
        if (guru && guru.name !== "Ibu Widya Ningsih, S.Kom, Gr") {
          guru.name = "Ibu Widya Ningsih, S.Kom, Gr";
          guru.avatar = "👩‍🏫";
          guru.jabatan = "Guru Pembina GLS & Literasi Digital SMAN 1 Batu";
          hasChanges = true;
        }

        // Perbarui akun pustakawan pelaksana Ibu Sulis Setiasih
        const admin = parsed.users.find(u => u.id === "admin-1");
        if (admin) {
          admin.name = "Ibu Sulis Setiasih";
          admin.avatar = "👩‍💼";
          admin.jabatan = "Pustakawan Pelaksana & Admin Perpustakaan SMABA";
          hasChanges = true;
        }

        // Tambahkan akun Kepala Perpustakaan Ibu Rini Wahyuningsih, S.Pd jika belum ada
        let adminHead = parsed.users.find(u => u.id === "admin-2");
        if (!adminHead) {
          parsed.users.push({
            id: "admin-2",
            role: "admin",
            name: "Ibu Rini Wahyuningsih, S.Pd",
            nip: "197805122005012008",
            jabatan: "Kepala Perpustakaan SMAN 1 Batu",
            avatar: "🏛️"
          });
          hasChanges = true;
        } else if (adminHead.name !== "Ibu Rini Wahyuningsih, S.Pd") {
          adminHead.name = "Ibu Rini Wahyuningsih, S.Pd";
          adminHead.jabatan = "Kepala Perpustakaan SMAN 1 Batu";
          hasChanges = true;
        }

        // Perbarui Kepala Sekolah & Kepala Perpustakaan pada profil sekolah
        if (parsed.school) {
          if (parsed.school.headmaster !== "Bapak Anto Dwi Cahyono, S.Pd, M.M") {
            parsed.school.headmaster = "Bapak Anto Dwi Cahyono, S.Pd, M.M";
            hasChanges = true;
          }
          if (parsed.school.libraryHead !== "Ibu Rini Wahyuningsih, S.Pd") {
            parsed.school.libraryHead = "Ibu Rini Wahyuningsih, S.Pd";
            hasChanges = true;
          }
        }

        // Migrasi data galeri media jika belum ada
        if (!parsed.galleryMedia || parsed.galleryMedia.length === 0) {
          parsed.galleryMedia = JSON.parse(JSON.stringify(INITIAL_DATA.galleryMedia || []));
          hasChanges = true;
        }

        // Perbarui nama pemeriksa di riwayat jurnal bawaan
        if (parsed.journals) {
          parsed.journals.forEach(j => {
            if (j.teacherName && (j.teacherName.includes("Sri Rahayu") || j.teacherName.includes("Bambang"))) {
              j.teacherName = "Ibu Widya Ningsih, S.Kom, Gr";
              hasChanges = true;
            }
          });
        }

        if (hasChanges) {
          this.saveData(parsed);
        }

        return parsed;
      }
    } catch (e) {
      console.warn("Gagal memuat dari storage, menginisialisasi data baru:", e);
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData(fresh);
    return fresh;
  }

  saveData(data = this.data, syncToCloud = true) {
    this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Gagal menyimpan data ke LocalStorage:", e);
    }

    // Sinkronisasi otomatis ke Firebase jika online
    if (syncToCloud && window.firebaseService && typeof window.firebaseService.isReady === "function" && window.firebaseService.isReady()) {
      window.firebaseService.saveData(this.data);
    }
  }

  onRemoteDataReceived(remoteData) {
    if (!remoteData || typeof remoteData !== "object") return;
    if (!remoteData.users || !remoteData.journals) return;

    this.data = remoteData;
    // Simpan ke cache lokal tanpa looping push balik ke Firebase
    this.saveData(this.data, false);

    // Render ulang seluruh tampilan jika aplikasi sudah siap
    if (window.app && typeof window.app.renderAll === "function") {
      window.app.renderAll();
    }
  }

  resetData() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData();
    return this.data;
  }

  getCurrentUser() {
    const user = this.data.users.find(u => u.id === this.currentUserId);
    return user || this.data.users[0];
  }

  setCurrentUser(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      this.currentUserId = userId;
      localStorage.setItem(CURRENT_USER_KEY, userId);
      return user;
    }
    return null;
  }

  getUsers() {
    return this.data.users;
  }

  // --- KELAS (36 KELAS) ---
  getClasses(grade = "all") {
    let list = this.data.classes || CLASSES_36;
    if (grade && grade !== "all") {
      list = list.filter(c => c.grade === grade);
    }
    return list;
  }

  getClassById(classId) {
    const classes = this.data.classes || CLASSES_36;
    return classes.find(c => c.id === classId);
  }

  // --- DATA SISWA (36 KELAS) ---
  getStudents(filter = {}) {
    let list = this.data.users.filter(u => u.role === "siswa");

    if (filter.grade && filter.grade !== "all") {
      list = list.filter(s => s.grade === filter.grade || (s.kelas && s.kelas.startsWith(filter.grade + "-")));
    }
    if (filter.class && filter.class !== "all") {
      list = list.filter(s => s.kelas === filter.class);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.nisn && s.nisn.toLowerCase().includes(q)) ||
        (s.kelas && s.kelas.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => {
      // Urutkan berdasarkan kelas, lalu nama
      if (a.kelas !== b.kelas) return a.kelas.localeCompare(b.kelas, undefined, { numeric: true });
      return a.name.localeCompare(b.name);
    });
  }

  getStudentById(studentId) {
    return this.data.users.find(u => u.id === studentId && u.role === "siswa");
  }

  addStudent(student) {
    const newId = "siswa-usr-" + Date.now();
    const grade = student.kelas ? student.kelas.split("-")[0] : "X";
    const newStudent = {
      id: newId,
      role: "siswa",
      name: student.name.trim(),
      nisn: student.nisn ? student.nisn.trim() : `00${Date.now().toString().slice(-8)}`,
      kelas: student.kelas || "X-1",
      grade: grade,
      gender: student.gender || "L",
      avatar: student.gender === "P" ? "👩‍🎓" : "👨‍🎓",
      level: "Pembaca Pemula",
      points: 0,
      targetMonthlyBooks: 3,
      targetDailyMinutes: 20,
      waliKelas: student.waliKelas || `Wali Kelas ${student.kelas} SMAN 1 Batu`,
      bio: "Siswa SMA Negeri 1 Batu.",
      ...student
    };

    this.data.users.push(newStudent);
    this.saveData();
    return newStudent;
  }

  updateStudent(studentId, patch) {
    const student = this.getStudentById(studentId);
    if (student) {
      Object.assign(student, patch);
      if (patch.kelas) {
        student.grade = patch.kelas.split("-")[0];
      }
      this.saveData();
      return student;
    }
    return null;
  }

  deleteStudent(studentId) {
    this.data.users = this.data.users.filter(u => u.id !== studentId);
    this.saveData();
    return true;
  }

  getClassStats(classId) {
    const students = this.getStudents({ class: classId });
    const studentIds = new Set(students.map(s => s.id));
    const journals = this.data.journals.filter(j => studentIds.has(j.studentId) || j.studentClass === classId);
    const approved = journals.filter(j => j.status === "approved");
    const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);

    return {
      totalStudents: students.length,
      totalJournals: journals.length,
      approvedJournals: approved.length,
      pendingJournals: journals.filter(j => j.status === "pending").length,
      revisionJournals: journals.filter(j => j.status === "revision").length,
      totalPoints,
      avgPoints: students.length > 0 ? Math.round(totalPoints / students.length) : 0
    };
  }

  // --- JURNAL LITERASI CRUD ---
  getJournals(filter = {}) {
    let list = [...this.data.journals];
    if (filter.studentId) {
      list = list.filter(j => j.studentId === filter.studentId);
    }
    if (filter.status && filter.status !== "all") {
      list = list.filter(j => j.status === filter.status);
    }
    if (filter.grade && filter.grade !== "all") {
      list = list.filter(j => j.studentClass && j.studentClass.startsWith(filter.grade + "-"));
    }
    if (filter.class && filter.class !== "all") {
      list = list.filter(j => j.studentClass === filter.class);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(j => 
        j.bookTitle.toLowerCase().includes(q) ||
        j.bookAuthor.toLowerCase().includes(q) ||
        j.studentName.toLowerCase().includes(q) ||
        (j.studentClass && j.studentClass.toLowerCase().includes(q)) ||
        j.summary.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.dateRead || 0) - new Date(a.dateRead || 0));
  }

  getJournalById(id) {
    return this.data.journals.find(j => j.id === id);
  }

  // Siswa mengisi tanpa perlu ijin, namun status awal SELALU pending persetujuan guru/admin
  addJournal(journal) {
    const newId = "jrn-" + Date.now();
    const currentUser = this.getCurrentUser();
    
    // Tentukan identitas siswa (bisa dari form atau dari akun aktif)
    const studentId = journal.studentId || currentUser.id;
    const student = this.data.users.find(u => u.id === studentId) || currentUser;

    const entry = {
      id: newId,
      studentId: student.id,
      studentName: journal.studentName || student.name,
      studentClass: journal.studentClass || student.kelas || "X-1",
      studentNisn: journal.studentNisn || student.nisn || "-",
      status: "pending", // Memerlukan persetujuan guru / admin
      teacherScore: null,
      teacherFeedback: null,
      teacherName: null,
      verifiedAt: null,
      createdAt: new Date().toISOString(),
      ...journal
    };

    this.data.journals.unshift(entry);
    this.saveData();
    return entry;
  }

  updateJournal(id, updatedFields) {
    const index = this.data.journals.findIndex(j => j.id === id);
    if (index !== -1) {
      this.data.journals[index] = {
        ...this.data.journals[index],
        ...updatedFields,
        status: updatedFields.status || "pending" // jika diedit siswa, perlu persetujuan ulang
      };
      this.saveData();
      return this.data.journals[index];
    }
    return null;
  }

  deleteJournal(id) {
    this.data.journals = this.data.journals.filter(j => j.id !== id);
    this.saveData();
    return true;
  }

  // Validasi & Persetujuan Jurnal oleh Guru atau Admin
  verifyJournal(id, { score, feedback, status, approverName, approverRole }) {
    const journal = this.getJournalById(id);
    if (!journal) return null;

    journal.status = status; // approved / revision
    journal.teacherScore = score !== undefined ? Number(score) : journal.teacherScore;
    journal.teacherFeedback = feedback || "";
    journal.teacherName = approverName || "Guru / Admin Perpustakaan";
    journal.approverRole = approverRole || "guru";
    journal.verifiedAt = new Date().toLocaleString("id-ID");

    // Bonus poin saat jurnal disetujui (Approved)
    if (status === "approved") {
      const student = this.data.users.find(u => u.id === journal.studentId);
      if (student) {
        student.points = (student.points || 0) + 30; // bonus 30 poin validasi
        this.updateUserBadge(student);
      }
    }

    this.saveData();
    return journal;
  }

  updateUserBadge(user) {
    const points = user.points || 0;
    if (points >= 450) {
      user.level = "Duta Literasi SMABA";
    } else if (points >= 350) {
      user.level = "Master Resensi";
    } else if (points >= 200) {
      user.level = "Kutu Buku Aktif";
    } else {
      user.level = "Pembaca Pemula";
    }
  }

  // --- BUKU & PERPUSTAKAAN CRUD ---
  getBooks(query = "", category = "all") {
    let list = [...this.data.books];
    if (category && category !== "all") {
      list = list.filter(b => b.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.callNumber.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.synopsis.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getBookById(id) {
    return this.data.books.find(b => b.id === id);
  }

  addBook(book) {
    const newId = "buku-" + (this.data.books.length + 1);
    const newBook = {
      id: newId,
      stockTotal: Number(book.stockTotal) || 1,
      stockAvailable: Number(book.stockTotal) || 1,
      callNumber: book.callNumber || "800 SMABA",
      shelf: book.shelf || "Rak Umum",
      color: "#0284c7",
      coverIcon: "📚",
      ...book
    };
    this.data.books.push(newBook);
    this.saveData();
    return newBook;
  }

  updateBook(id, patch) {
    const book = this.getBookById(id);
    if (book) {
      Object.assign(book, patch);
      this.saveData();
      return book;
    }
    return null;
  }

  deleteBook(id) {
    this.data.books = this.data.books.filter(b => b.id !== id);
    this.saveData();
    return true;
  }

  // --- PEMINJAMAN / SIRKULASI ---
  borrowBook(studentId, bookId) {
    const book = this.getBookById(bookId);
    const student = this.data.users.find(u => u.id === studentId);
    if (!book || !student) throw new Error("Data buku atau siswa tidak ditemukan");
    if (book.stockAvailable <= 0) throw new Error("Stok buku fisik sedang habis");

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14); // Masa pinjam 14 hari

    book.stockAvailable -= 1;

    const newBorrow = {
      id: "brw-" + Date.now(),
      studentId: student.id,
      studentName: student.name,
      bookId: book.id,
      bookTitle: book.title,
      borrowDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      returnDate: null,
      status: "dipinjam"
    };

    this.data.borrows.unshift(newBorrow);
    this.saveData();
    return newBorrow;
  }

  returnBook(borrowId) {
    const item = this.data.borrows.find(b => b.id === borrowId);
    if (!item) throw new Error("Peminjaman tidak ditemukan");

    item.status = "kembali";
    item.returnDate = new Date().toISOString().split("T")[0];

    const book = this.getBookById(item.bookId);
    if (book && book.stockAvailable < book.stockTotal) {
      book.stockAvailable += 1;
    }

    this.saveData();
    return item;
  }

  getStudentBorrows(studentId) {
    return this.data.borrows.filter(b => b.studentId === studentId);
  }

  getAllBorrows() {
    return this.data.borrows;
  }

  // --- STATISTIK & LEADERBOARD ---
  getStudentStats(studentId) {
    const journals = this.data.journals.filter(j => j.studentId === studentId);
    const approvedJournals = journals.filter(j => j.status === "approved");
    const totalPagesRead = journals.reduce((sum, j) => sum + (Number(j.pagesRead) || 0), 0);
    const borrows = this.getStudentBorrows(studentId);
    const activeBorrows = borrows.filter(b => b.status === "dipinjam");

    const scoredJournals = journals.filter(j => j.teacherScore != null);
    const avgScore = scoredJournals.length > 0 
      ? Math.round(scoredJournals.reduce((s, j) => s + j.teacherScore, 0) / scoredJournals.length) 
      : 0;

    return {
      totalJournals: journals.length,
      approvedJournals: approvedJournals.length,
      pendingJournals: journals.filter(j => j.status === "pending").length,
      revisionJournals: journals.filter(j => j.status === "revision").length,
      totalPagesRead,
      activeBorrowsCount: activeBorrows.length,
      avgScore
    };
  }

  getTeacherStats() {
    const journals = this.data.journals;
    return {
      totalToVerify: journals.filter(j => j.status === "pending").length,
      totalApproved: journals.filter(j => j.status === "approved").length,
      totalRevision: journals.filter(j => j.status === "revision").length,
      totalStudentsActive: new Set(journals.map(j => j.studentId)).size
    };
  }

  getLibraryStats() {
    const totalBooks = this.data.books.reduce((s, b) => s + (b.stockTotal || 0), 0);
    const availableBooks = this.data.books.reduce((s, b) => s + (b.stockAvailable || 0), 0);
    const borrowedBooks = totalBooks - availableBooks;
    const totalJournals = this.data.journals.length;
    const totalStudents = this.data.users.filter(u => u.role === "siswa").length;

    return {
      totalTitles: this.data.books.length,
      totalBooks,
      borrowedBooks,
      availableBooks,
      totalJournals,
      totalStudents,
      totalClasses: 36
    };
  }

  getLeaderboard() {
    const students = this.data.users.filter(u => u.role === "siswa");
    return students.map(s => {
      const stats = this.getStudentStats(s.id);
      return {
        ...s,
        stats
      };
    }).sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  // --- KEGIATAN PERPUSTAKAAN (INTERNAL & EKSTERNAL) ---
  getActivities(filter = {}) {
    let list = this.data.activities || INITIAL_DATA.activities || [];
    if (filter.type && filter.type !== "all") {
      list = list.filter(a => a.type === filter.type);
    }
    if (filter.status && filter.status !== "all") {
      list = list.filter(a => a.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.coordinator && a.coordinator.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  getActivityById(id) {
    const list = this.data.activities || INITIAL_DATA.activities || [];
    return list.find(a => a.id === id);
  }

  addActivity(activity) {
    if (!this.data.activities) this.data.activities = [...(INITIAL_DATA.activities || [])];
    const newId = "act-" + Date.now();
    const newAct = {
      id: newId,
      registeredStudents: [],
      bannerColor: activity.type === "internal" ? "#1e3a8a" : "#0284c7",
      icon: activity.type === "internal" ? "🏛️" : "🌍",
      status: "upcoming",
      quota: Number(activity.quota) || 50,
      pointsReward: Number(activity.pointsReward) || 30,
      ...activity
    };
    this.data.activities.unshift(newAct);
    this.saveData();
    return newAct;
  }

  updateActivity(id, patch) {
    const act = this.getActivityById(id);
    if (act) {
      Object.assign(act, patch);
      this.saveData();
      return act;
    }
    return null;
  }

  deleteActivity(id) {
    if (!this.data.activities) return false;
    this.data.activities = this.data.activities.filter(a => a.id !== id);
    this.saveData();
    return true;
  }

  registerStudentToActivity(activityId, studentId) {
    const act = this.getActivityById(activityId);
    const student = this.data.users.find(u => u.id === studentId);
    if (!act || !student) throw new Error("Data kegiatan atau siswa tidak ditemukan");

    if (!act.registeredStudents) act.registeredStudents = [];
    if (act.registeredStudents.includes(studentId)) {
      throw new Error(`Siswa ${student.name} sudah terdaftar pada kegiatan ini.`);
    }

    if (act.quota && act.registeredStudents.length >= act.quota) {
      throw new Error("Mohon maaf, kuota peserta untuk kegiatan ini sudah penuh.");
    }

    act.registeredStudents.push(studentId);

    // Berikan reward poin literasi atas partisipasi kegiatan perpustakaan
    if (act.pointsReward) {
      student.points = (student.points || 0) + Number(act.pointsReward);
      this.updateUserBadge(student);
    }

    this.saveData();
    return { act, student };
  }

  // ========================================================
  // GALERI DOKUMENTASI FOTO & VIDEO (GOOGLE DRIVE SYNC)
  // ========================================================
  getGalleryMedia({ type = "all", category = "all", search = "" } = {}) {
    let list = this.data.galleryMedia || [];

    if (type && type !== "all") {
      list = list.filter(m => m.type === type);
    }

    if (category && category !== "all") {
      list = list.filter(m => m.category === category);
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(m => 
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.uploader && m.uploader.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getMediaById(id) {
    return (this.data.galleryMedia || []).find(m => m.id === id);
  }

  addMedia(mediaData) {
    if (!this.data.galleryMedia) {
      this.data.galleryMedia = [];
    }

    const newItem = {
      id: `media-${Date.now()}`,
      title: mediaData.title,
      type: mediaData.type || "photo",
      category: mediaData.category || "Kegiatan Internal SMAN 1 Batu",
      date: mediaData.date || new Date().toISOString().split("T")[0],
      uploader: mediaData.uploader || "Siswa SMABA",
      uploaderRole: mediaData.uploaderRole || "siswa",
      thumbnail: mediaData.thumbnail || (mediaData.type === "photo" ? "assets/kegiatan_internal.jpg" : "assets/kegiatan_eksternal.jpg"),
      mediaUrl: mediaData.mediaUrl || mediaData.thumbnail,
      driveLink: mediaData.driveLink || "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id",
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: mediaData.description || "",
      duration: mediaData.duration || ""
    };

    this.data.galleryMedia.unshift(newItem);
    this.saveData();
    return newItem;
  }

  deleteMedia(id) {
    if (!this.data.galleryMedia) return false;
    const initialLen = this.data.galleryMedia.length;
    this.data.galleryMedia = this.data.galleryMedia.filter(m => m.id !== id);
    if (this.data.galleryMedia.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  exportDataJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importDataJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.books || !parsed.journals || !parsed.users) {
        throw new Error("Format berkas backup tidak valid.");
      }
      this.data = parsed;
      this.saveData();
      return true;
    } catch (e) {
      throw new Error("Gagal mengimpor data: " + e.message);
    }
  }
}

// Instance global
window.storage = new AppStorage();
