// ========================================================
// MENU DATA SISWA 36 KELAS: MODULE LOGIC
// 12 Kelas X, 12 Kelas XI, 12 Kelas XII SMAN 1 Batu
// ========================================================

const StudentsModule = {
  currentGradeFilter: "all", // all, X, XI, XII
  selectedClassId: "all",    // all, or specific class e.g. "X-1", "XI-1"
  searchQuery: "",

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Grade filter buttons (Semua, X, XI, XII)
    const gradeButtons = document.querySelectorAll(".grade-filter-btn");
    gradeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        gradeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentGradeFilter = btn.dataset.grade;
        this.selectedClassId = "all";
        this.renderClassSelector();
        this.renderStudentsTable();
      });
    });

    // Student search input
    const searchInput = document.getElementById("searchStudentInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderStudentsTable();
      });
    }

    // Form Tambah Siswa Submit
    const formAddStudent = document.getElementById("formAddStudent");
    if (formAddStudent) {
      formAddStudent.addEventListener("submit", (e) => this.handleAddStudentSubmit(e));
    }
  },

  render() {
    this.renderClassSelector();
    this.renderClassStatsHeader();
    this.renderStudentsTable();
  },

  renderClassSelector() {
    const container = document.getElementById("classPillsContainer");
    if (!container) return;

    const classes = window.storage.getClasses(this.currentGradeFilter);

    let html = `
      <button class="class-pill-btn ${this.selectedClassId === 'all' ? 'active' : ''}" 
              onclick="StudentsModule.selectClass('all')">
        <span class="pill-title">Semua Kelas</span>
        <span class="pill-count">${classes.length} Kelas</span>
      </button>
    `;

    classes.forEach(cls => {
      const stats = window.storage.getClassStats(cls.id);
      const isSelected = this.selectedClassId === cls.id;

      html += `
        <button class="class-pill-btn ${isSelected ? 'active' : ''}" 
                onclick="StudentsModule.selectClass('${cls.id}')"
                title="${cls.name} • Wali: ${cls.waliKelas}">
          <span class="pill-title">${cls.id}</span>
          <span class="pill-badge">${stats.totalStudents} Siswa • ${stats.totalJournals} Jurnal</span>
        </button>
      `;
    });

    container.innerHTML = html;
  },

  selectClass(classId) {
    this.selectedClassId = classId;
    this.renderClassSelector();
    this.renderClassStatsHeader();
    this.renderStudentsTable();
  },

  renderClassStatsHeader() {
    const statsContainer = document.getElementById("classHeaderStats");
    if (!statsContainer) return;

    if (this.selectedClassId === "all") {
      const allStudents = window.storage.getStudents({ grade: this.currentGradeFilter });
      const allJournals = window.storage.getJournals({ grade: this.currentGradeFilter });
      const approvedCount = allJournals.filter(j => j.status === "approved").length;
      const pendingCount = allJournals.filter(j => j.status === "pending").length;

      statsContainer.innerHTML = `
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-blue">🏫</div>
          <div class="stat-info">
            <div class="stat-value">${this.currentGradeFilter === 'all' ? '36' : '12'}</div>
            <div class="stat-label">Total Rombel Kelas (${this.currentGradeFilter === 'all' ? 'X, XI, XII' : 'Tingkat ' + this.currentGradeFilter})</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-green">👥</div>
          <div class="stat-info">
            <div class="stat-value">${allStudents.length}</div>
            <div class="stat-label">Total Siswa Terdaftar</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-gold">📖</div>
          <div class="stat-info">
            <div class="stat-value">${allJournals.length}</div>
            <div class="stat-label">Total Jurnal Literasi (${approvedCount} Disetujui, ${pendingCount} Menunggu)</div>
          </div>
        </div>
      `;
    } else {
      const cls = window.storage.getClassById(this.selectedClassId);
      const stats = window.storage.getClassStats(this.selectedClassId);

      statsContainer.innerHTML = `
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-blue">🏫</div>
          <div class="stat-info">
            <div class="stat-value">${cls ? cls.name : this.selectedClassId}</div>
            <div class="stat-label">Wali: ${cls ? cls.waliKelas : '-'}</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-green">👥</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalStudents}</div>
            <div class="stat-label">Siswa di Kelas Ini</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-gold">📝</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalJournals}</div>
            <div class="stat-label">${stats.approvedJournals} Disetujui • ${stats.pendingJournals} Menunggu Persetujuan</div>
          </div>
        </div>
      `;
    }
  },

  renderStudentsTable() {
    const tableBody = document.getElementById("studentsTableBody");
    const countBadge = document.getElementById("studentListCountBadge");
    if (!tableBody) return;

    const students = window.storage.getStudents({
      grade: this.currentGradeFilter,
      class: this.selectedClassId,
      search: this.searchQuery
    });

    if (countBadge) {
      countBadge.textContent = `${students.length} Siswa`;
    }

    if (students.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 6px;">👥</div>
            <strong>Tidak ada data siswa ditemukan</strong>
            <p style="font-size: 0.82rem; margin-top: 4px;">Coba gunakan kata kunci pencarian lain atau klik tombol "Tambah Siswa".</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = students.map((s, idx) => {
      const stats = window.storage.getStudentStats(s.id);

      return `
        <tr>
          <td style="font-weight: 700; color: #64748b; width: 40px;">${idx + 1}</td>
          <td style="width: 120px;"><code>${s.nisn || '-'}</code></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">${s.avatar || (s.gender === 'P' ? '👩‍🎓' : '👨‍🎓')}</span>
              <div>
                <strong style="color: var(--primary-900); font-size: 0.92rem;">${s.name}</strong>
                <div style="font-size: 0.74rem; color: var(--text-muted);">${s.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</div>
              </div>
            </div>
          </td>
          <td style="width: 90px;">
            <span class="badge-class-tag">${s.kelas}</span>
          </td>
          <td>
            <span class="badge-status badge-approved" style="font-size: 0.74rem;">
              ${s.level || 'Pembaca Pemula'}
            </span>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">
              ${stats.totalJournals} Buku 
              <span style="font-size: 0.75rem; color: var(--emerald-600);">(${stats.approvedJournals} ✓)</span>
            </div>
            ${stats.pendingJournals > 0 ? `<span style="font-size: 0.72rem; color: var(--gold-600);">⏳ ${stats.pendingJournals} Menunggu Persetujuan</span>` : ''}
          </td>
          <td style="font-weight: 800; color: var(--primary-700); font-size: 0.95rem;">
            ${s.points || 0} Pts
          </td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              <!-- Tombol Langsung Isi Jurnal untuk Siswa ini tanpa perlu ijin -->
              <button class="btn btn-primary btn-sm" 
                      onclick="StudentsModule.quickOpenJournalForStudent('${s.id}')" 
                      title="Isi Jurnal Literasi untuk ${s.name} (Tanpa Izin Awal)">
                ✍️ Isi Jurnal
              </button>
              
              <!-- Cetak Portofolio Resmi -->
              <button class="btn btn-secondary btn-sm" 
                      onclick="PrintModule.openPrintPreview('${s.id}')" 
                      title="Cetak Lembar Portofolio Resmi Siswa">
                🖨️ Cetak
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  // Siswa langsung bisa mengisi jurnal literasi tanpa perlu ijin
  quickOpenJournalForStudent(studentId) {
    const student = window.storage.getStudentById(studentId);
    if (!student) return;

    // Prefill form jurnal dengan identitas siswa yang dipilih
    window.JournalModule.openCreateModal();
    
    // Set identitas siswa pada form
    const studentSelect = document.getElementById("journalTargetStudentSelect");
    if (studentSelect) {
      studentSelect.value = student.id;
    }

    const noteEl = document.getElementById("journalDirectFillNotice");
    if (noteEl) {
      noteEl.innerHTML = `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 12px;">
          ℹ️ Mengisi jurnal literasi untuk <strong>${student.name} (${student.kelas})</strong>. Pengisian langsung dibuka tanpa perlu izin awal. Setelah dikirim, jurnal akan masuk ke antrean persetujuan Guru/Admin.
        </div>
      `;
    }
  },

  openAddStudentModal() {
    const form = document.getElementById("formAddStudent");
    if (!form) return;
    form.reset();

    // Populate 36 class options in dropdown
    const selectClass = document.getElementById("addStudentClassSelect");
    if (selectClass) {
      const classes = window.storage.getClasses();
      let html = `<option value="">-- Pilih Salah Satu dari 36 Kelas --</option>`;
      
      ["X", "XI", "XII"].forEach(grd => {
        html += `<optgroup label="Tingkat Kelas ${grd} (12 Rombel)">`;
        classes.filter(c => c.grade === grd).forEach(c => {
          html += `<option value="${c.id}">${c.name} (${c.waliKelas})</option>`;
        });
        html += `</optgroup>`;
      });

      selectClass.innerHTML = html;
      if (this.selectedClassId !== "all") {
        selectClass.value = this.selectedClassId;
      }
    }

    window.app.openModal("modalAddStudent");
  },

  handleAddStudentSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("addStudentName").value.trim();
    const nisn = document.getElementById("addStudentNisn").value.trim();
    const kelas = document.getElementById("addStudentClassSelect").value;
    const gender = document.getElementById("addStudentGender").value;

    if (!name || !kelas) {
      window.app.showToast("Nama siswa dan kelas wajib diisi!", "error");
      return;
    }

    const newStudent = window.storage.addStudent({
      name,
      nisn,
      kelas,
      gender
    });

    window.app.showToast(`Siswa ${newStudent.name} berhasil ditambahkan ke ${newStudent.kelas}!`);
    window.app.closeModal("modalAddStudent");
    this.render();
    window.app.renderAll();
  },

  exportStudentsCsv() {
    const students = window.storage.getStudents({
      grade: this.currentGradeFilter,
      class: this.selectedClassId,
      search: this.searchQuery
    });

    if (students.length === 0) {
      window.app.showToast("Tidak ada data siswa untuk diekspor.", "error");
      return;
    }

    let csv = "No,NISN,Nama Siswa,Kelas,Tingkat,Jenis Kelamin,Total Jurnal,Jurnal Disetujui,Poin Literasi,Lencana,Wali Kelas\n";
    students.forEach((s, i) => {
      const stats = window.storage.getStudentStats(s.id);
      const clean = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
      csv += [
        i + 1,
        clean(s.nisn),
        clean(s.name),
        clean(s.kelas),
        clean(s.grade),
        s.gender || "L",
        stats.totalJournals,
        stats.approvedJournals,
        s.points || 0,
        clean(s.level),
        clean(s.waliKelas)
      ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Data_Siswa_Literasi_36_Kelas_SMAN1Batu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast("Data siswa berhasil diekspor ke format CSV!");
  }
};

window.StudentsModule = StudentsModule;
