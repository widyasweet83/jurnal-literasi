// ========================================================
// MENU DATA SISWA 36 KELAS: MODULE LOGIC
// 12 Kelas X, 12 Kelas XI, 12 Kelas XII SMAN 1 Batu (1.274 Siswa)
// ========================================================

const StudentsModule = {
  currentGradeFilter: "all",  // all, X, XI, XII
  selectedClassId: "all",     // all, or specific class e.g. "X-1", "XI-1"
  searchQuery: "",
  currentGenderFilter: "all", // all, L, P
  currentPage: 1,
  pageSize: 25,               // 25, 50, 100, or "all"

  init() {
    this.bindEvents();
    this.updateSidebarBadge();
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
        this.currentPage = 1;
        this.renderClassSelector();
        this.renderClassStatsHeader();
        this.renderStudentsTable();
      });
    });

    // Student search input
    const searchInput = document.getElementById("searchStudentInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.currentPage = 1;
        this.renderStudentsTable();
      });
    }

    // Gender filter dropdown
    const genderSelect = document.getElementById("filterStudentGender");
    if (genderSelect) {
      genderSelect.addEventListener("change", (e) => {
        this.currentGenderFilter = e.target.value;
        this.currentPage = 1;
        this.renderStudentsTable();
      });
    }

    // Form Tambah Siswa Submit
    const formAddStudent = document.getElementById("formAddStudent");
    if (formAddStudent) {
      formAddStudent.addEventListener("submit", (e) => this.handleAddStudentSubmit(e));
    }

    // Form Edit Siswa Submit
    const formEditStudent = document.getElementById("formEditStudent");
    if (formEditStudent) {
      formEditStudent.addEventListener("submit", (e) => this.handleEditStudentSubmit(e));
    }

    // Form Import CSV Submit
    const formImportCsv = document.getElementById("formImportCsv");
    if (formImportCsv) {
      formImportCsv.addEventListener("submit", (e) => this.handleImportCsv(e));
    }
  },

  render() {
    this.renderClassSelector();
    this.renderClassStatsHeader();
    this.renderStudentsTable();
    this.updateSidebarBadge();
  },

  updateSidebarBadge() {
    const badge = document.getElementById("studentsNavBadge");
    if (badge) {
      const all = window.storage.getStudents();
      badge.textContent = all.length.toLocaleString("id-ID");
    }
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
    this.currentPage = 1;
    this.renderClassSelector();
    this.renderClassStatsHeader();
    this.renderStudentsTable();
  },

  renderClassStatsHeader() {
    const statsContainer = document.getElementById("classHeaderStats");
    if (!statsContainer) return;

    if (this.selectedClassId === "all") {
      const allStudents = window.storage.getStudents({ grade: this.currentGradeFilter });
      const maleCount = allStudents.filter(s => s.gender === "L").length;
      const femaleCount = allStudents.filter(s => s.gender === "P").length;
      const allJournals = window.storage.getJournals({ grade: this.currentGradeFilter });
      const approvedCount = allJournals.filter(j => j.status === "approved").length;
      const pendingCount = allJournals.filter(j => j.status === "pending").length;
      const totalPoints = allStudents.reduce((sum, s) => sum + (s.points || 0), 0);
      const avgPoints = allStudents.length > 0 ? Math.round(totalPoints / allStudents.length) : 0;

      statsContainer.innerHTML = `
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-blue">🏫</div>
          <div class="stat-info">
            <div class="stat-value">${this.currentGradeFilter === 'all' ? '36 Rombel' : '12 Rombel'}</div>
            <div class="stat-label">Total Kelas (${this.currentGradeFilter === 'all' ? '12 X, 12 XI, 12 XII' : 'Tingkat ' + this.currentGradeFilter})</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-green">👥</div>
          <div class="stat-info">
            <div class="stat-value">${allStudents.length.toLocaleString('id-ID')} Siswa</div>
            <div class="stat-label">👨‍🎓 L: ${maleCount} • 👩‍🎓 P: ${femaleCount}</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-gold">📖</div>
          <div class="stat-info">
            <div class="stat-value">${allJournals.length} Jurnal</div>
            <div class="stat-label">${approvedCount} Disetujui • ${pendingCount} Menunggu</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-purple">⭐</div>
          <div class="stat-info">
            <div class="stat-value">${avgPoints} Pts</div>
            <div class="stat-label">Rata-rata Poin Literasi / Siswa</div>
          </div>
        </div>
      `;
    } else {
      const cls = window.storage.getClassById(this.selectedClassId);
      const stats = window.storage.getClassStats(this.selectedClassId);
      const students = window.storage.getStudents({ class: this.selectedClassId });
      const maleCount = students.filter(s => s.gender === "L").length;
      const femaleCount = students.filter(s => s.gender === "P").length;

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
            <div class="stat-value">${stats.totalStudents} Siswa</div>
            <div class="stat-label">👨‍🎓 L: ${maleCount} • 👩‍🎓 P: ${femaleCount}</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-gold">📝</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalJournals} Jurnal</div>
            <div class="stat-label">${stats.approvedJournals} Disetujui • ${stats.pendingJournals} Menunggu</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div class="stat-icon-box stat-icon-purple">🏆</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalPoints} Pts</div>
            <div class="stat-label">Rerata: ${stats.avgPoints} Pts / Siswa</div>
          </div>
        </div>
      `;
    }
  },

  renderStudentsTable() {
    const tableBody = document.getElementById("studentsTableBody");
    const countBadge = document.getElementById("studentListCountBadge");
    if (!tableBody) return;

    const allFiltered = window.storage.getStudents({
      grade: this.currentGradeFilter,
      class: this.selectedClassId,
      gender: this.currentGenderFilter,
      search: this.searchQuery
    });

    const totalCount = allFiltered.length;
    if (countBadge) {
      countBadge.textContent = `${totalCount.toLocaleString('id-ID')} Siswa`;
    }

    if (totalCount === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">👥</div>
            <strong>Tidak ada data siswa ditemukan</strong>
            <p style="font-size: 0.84rem; margin-top: 4px;">Coba gunakan kata kunci pencarian lain, ubah filter kelas/gender, atau klik tombol "Tambah Siswa Baru".</p>
          </td>
        </tr>
      `;
      this.renderPagination(0);
      return;
    }

    // Pagination logic
    const pageSizeNum = this.pageSize === "all" ? totalCount : parseInt(this.pageSize, 10);
    const totalPages = Math.ceil(totalCount / pageSizeNum);
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const startIndex = (this.currentPage - 1) * pageSizeNum;
    const paginatedStudents = (this.pageSize === "all") 
      ? allFiltered 
      : allFiltered.slice(startIndex, startIndex + pageSizeNum);

    const currentUser = window.storage.getCurrentUser();

    tableBody.innerHTML = paginatedStudents.map((s, idx) => {
      const stats = window.storage.getStudentStats(s.id);
      const isCurrent = currentUser && currentUser.id === s.id;
      const globalNo = startIndex + idx + 1;

      return `
        <tr style="${isCurrent ? 'background: #eff6ff;' : ''}">
          <td style="font-weight: 700; color: #64748b; width: 44px; text-align: center;">${globalNo}</td>
          <td style="width: 120px;">
            <code style="font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${s.nisn || '-'}</code>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.35rem;">${s.avatar || (s.gender === 'P' ? '👩‍🎓' : '👨‍🎓')}</span>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <strong style="color: var(--primary-900); font-size: 0.94rem;">${s.name}</strong>
                  ${isCurrent ? '<span class="badge-status badge-approved" style="font-size: 0.68rem; padding: 1px 6px;">Akun Aktif</span>' : ''}
                </div>
                <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; gap: 6px; margin-top: 2px;">
                  <span style="color: ${s.gender === 'P' ? '#db2777' : '#0284c7'}; font-weight: 600;">
                    ${s.gender === 'P' ? '♀ Perempuan' : '♂ Laki-laki'}
                  </span>
                  • <span>Wali: ${s.waliKelas || '-'}</span>
                </div>
              </div>
            </div>
          </td>
          <td style="width: 90px;">
            <span class="badge-class-tag">${s.kelas}</span>
          </td>
          <td>
            <span class="badge-status ${this.getLevelBadgeClass(s.level)}" style="font-size: 0.74rem;">
              ${s.level || 'Pembaca Pemula'}
            </span>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">
              ${stats.totalJournals} Buku 
              <span style="font-size: 0.75rem; color: var(--emerald-600);">(${stats.approvedJournals} ✓)</span>
            </div>
            ${stats.pendingJournals > 0 ? `<span style="font-size: 0.72rem; color: var(--gold-600);">⏳ ${stats.pendingJournals} Menunggu</span>` : ''}
          </td>
          <td style="font-weight: 800; color: var(--primary-700); font-size: 0.95rem;">
            ${s.points || 0} Pts
          </td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <!-- Tombol Langsung Isi Jurnal untuk Siswa ini tanpa perlu ijin -->
              <button class="btn btn-primary btn-sm" 
                      onclick="StudentsModule.quickOpenJournalForStudent('${s.id}')" 
                      title="Isi Jurnal Literasi untuk ${s.name}">
                ✍️ Jurnal
              </button>

              <!-- Masuk sebagai Siswa Ini (Role Switching Instant) -->
              <button class="btn btn-secondary btn-sm" 
                      onclick="StudentsModule.loginAsStudent('${s.id}')" 
                      title="Masuk & Gunakan Aplikasi Sebagai Siswa Ini">
                👤 Masuk
              </button>
              
              <!-- Cetak Portofolio Resmi -->
              <button class="btn btn-outline btn-sm" 
                      onclick="PrintModule.openPrintPreview('${s.id}')" 
                      title="Cetak Lembar Portofolio Resmi Siswa">
                🖨️ Cetak
              </button>

              <!-- Edit Siswa -->
              <button class="btn btn-sm" style="background: #f1f5f9; color: #334155; padding: 4px 8px;"
                      onclick="StudentsModule.openEditStudentModal('${s.id}')" 
                      title="Edit Data Siswa">
                ✏️
              </button>

              <!-- Hapus Siswa -->
              <button class="btn btn-sm" style="background: #fee2e2; color: #dc2626; padding: 4px 8px;"
                      onclick="StudentsModule.deleteStudent('${s.id}')" 
                      title="Hapus Siswa">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    this.renderPagination(totalCount);
  },

  getLevelBadgeClass(level) {
    if (!level) return "badge-pending";
    if (level.includes("Duta")) return "badge-approved";
    if (level.includes("Master")) return "badge-approved";
    if (level.includes("Kutu")) return "badge-pending";
    return "badge-pending";
  },

  renderPagination(totalCount) {
    let container = document.getElementById("studentsPaginationContainer");
    if (!container) {
      const tableCard = document.querySelector("#tab-students .leaderboard-card");
      if (tableCard) {
        container = document.createElement("div");
        container.id = "studentsPaginationContainer";
        tableCard.appendChild(container);
      } else {
        return;
      }
    }

    if (totalCount === 0) {
      container.innerHTML = "";
      return;
    }

    const pageSizeNum = this.pageSize === "all" ? totalCount : parseInt(this.pageSize, 10);
    const totalPages = Math.ceil(totalCount / pageSizeNum);
    const startRecord = (this.currentPage - 1) * pageSizeNum + 1;
    const endRecord = Math.min(this.currentPage * pageSizeNum, totalCount);

    let pageButtonsHtml = "";
    if (totalPages > 1) {
      // Prev button
      pageButtonsHtml += `
        <button class="page-nav-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                onclick="StudentsModule.setPage(${this.currentPage - 1})" 
                ${this.currentPage === 1 ? 'disabled' : ''}>
          ‹ Sebelumnya
        </button>
      `;

      // Smart page window (e.g. 1, 2, ..., current-1, current, current+1, ..., totalPages)
      const maxButtons = 7;
      let startPage = Math.max(1, this.currentPage - 3);
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        pageButtonsHtml += `<button class="page-num-btn" onclick="StudentsModule.setPage(1)">1</button>`;
        if (startPage > 2) pageButtonsHtml += `<span class="page-dots">...</span>`;
      }

      for (let p = startPage; p <= endPage; p++) {
        pageButtonsHtml += `
          <button class="page-num-btn ${p === this.currentPage ? 'active' : ''}" 
                  onclick="StudentsModule.setPage(${p})">${p}</button>
        `;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageButtonsHtml += `<span class="page-dots">...</span>`;
        pageButtonsHtml += `<button class="page-num-btn" onclick="StudentsModule.setPage(${totalPages})">${totalPages}</button>`;
      }

      // Next button
      pageButtonsHtml += `
        <button class="page-nav-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                onclick="StudentsModule.setPage(${this.currentPage + 1})" 
                ${this.currentPage === totalPages ? 'disabled' : ''}>
          Berikutnya ›
        </button>
      `;
    }

    container.innerHTML = `
      <div class="students-pagination-bar">
        <div class="pagination-info">
          Menampilkan <strong>${startRecord.toLocaleString('id-ID')} - ${endRecord.toLocaleString('id-ID')}</strong> dari <strong>${totalCount.toLocaleString('id-ID')}</strong> Siswa
          ${this.selectedClassId !== 'all' ? ` (Kelas ${this.selectedClassId})` : ''}
        </div>

        <div class="pagination-actions">
          <div class="page-size-selector">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Per Halaman:</span>
            <select class="form-control" style="width: auto; padding: 4px 8px; font-size: 0.82rem;" onchange="StudentsModule.setPageSize(this.value)">
              <option value="25" ${this.pageSize == 25 ? 'selected' : ''}>25</option>
              <option value="50" ${this.pageSize == 50 ? 'selected' : ''}>50</option>
              <option value="100" ${this.pageSize == 100 ? 'selected' : ''}>100</option>
              <option value="all" ${this.pageSize === 'all' ? 'selected' : ''}>Semua</option>
            </select>
          </div>

          <div class="pagination-nav-group">
            ${pageButtonsHtml}
          </div>
        </div>
      </div>
    `;
  },

  setPage(pageNum) {
    this.currentPage = pageNum;
    this.renderStudentsTable();
    // Smooth scroll back to table header
    const tableEl = document.querySelector("#tab-students .leaderboard-card");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  setPageSize(size) {
    this.pageSize = size;
    this.currentPage = 1;
    this.renderStudentsTable();
  },

  loginAsStudent(studentId) {
    const student = window.storage.getStudentById(studentId);
    if (!student) return;

    window.storage.setCurrentUser(studentId);
    window.app.showToast(`Beralih ke akun siswa: ${student.name} (${student.kelas})!`);
    window.app.renderAll();
    window.app.switchTab("journals");
  },

  quickOpenJournalForStudent(studentId) {
    const student = window.storage.getStudentById(studentId);
    if (!student) return;

    window.JournalModule.openCreateModal();
    
    const studentSelect = document.getElementById("journalTargetStudentSelect");
    if (studentSelect) {
      studentSelect.value = student.id;
    }

    const noteEl = document.getElementById("journalDirectFillNotice");
    if (noteEl) {
      noteEl.innerHTML = `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 12px;">
          ℹ️ Mengisi jurnal literasi untuk <strong>${student.name} (${student.kelas})</strong>. Pengisian langsung dibuka tanpa perlu izin awal. Setelah dikirim, jurnal akan masuk ke antrean verifikasi Guru/Admin.
        </div>
      `;
    }
  },

  // Modal: Pilih Siswa untuk Role Switcher
  openSwitchStudentModal() {
    this.renderStudentPickerList("");
    window.app.openModal("modalSwitchStudent");
    const searchInput = document.getElementById("searchSwitchStudentInput");
    if (searchInput) {
      searchInput.value = "";
      setTimeout(() => searchInput.focus(), 200);
    }
  },

  renderStudentPickerList(query = "") {
    const listContainer = document.getElementById("switchStudentListContainer");
    if (!listContainer) return;

    const students = window.storage.getStudents({ search: query });
    const previewList = students.slice(0, 50); // limit to top 50 matches for instant response

    if (previewList.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          🔍 Tidak ada siswa yang cocok dengan "${query}".
        </div>
      `;
      return;
    }

    listContainer.innerHTML = previewList.map(s => `
      <div class="student-picker-item" onclick="StudentsModule.selectAndLoginStudent('${s.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">${s.avatar || (s.gender === 'P' ? '👩‍🎓' : '👨‍🎓')}</span>
          <div>
            <div style="font-weight: 700; color: var(--primary-900); font-size: 0.92rem;">${s.name}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              NISN: <code>${s.nisn}</code> • Kelas: <strong>${s.kelas}</strong> • ${s.points || 0} Pts
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm">Pilih & Masuk</button>
      </div>
    `).join("");

    const counter = document.getElementById("switchStudentCountNote");
    if (counter) {
      counter.textContent = `Menampilkan ${previewList.length} dari total ${students.length} siswa ditemukan`;
    }
  },

  selectAndLoginStudent(studentId) {
    window.app.closeModal("modalSwitchStudent");
    this.loginAsStudent(studentId);
  },

  openAddStudentModal() {
    const form = document.getElementById("formAddStudent");
    if (!form) return;
    form.reset();

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

  openEditStudentModal(studentId) {
    const student = window.storage.getStudentById(studentId);
    if (!student) return;

    document.getElementById("editStudentId").value = student.id;
    document.getElementById("editStudentName").value = student.name;
    document.getElementById("editStudentNisn").value = student.nisn || "";
    document.getElementById("editStudentGender").value = student.gender || "L";
    document.getElementById("editStudentPoints").value = student.points || 0;

    const selectClass = document.getElementById("editStudentClassSelect");
    if (selectClass) {
      const classes = window.storage.getClasses();
      let html = "";
      ["X", "XI", "XII"].forEach(grd => {
        html += `<optgroup label="Tingkat Kelas ${grd} (12 Rombel)">`;
        classes.filter(c => c.grade === grd).forEach(c => {
          html += `<option value="${c.id}" ${c.id === student.kelas ? 'selected' : ''}>${c.name} (${c.waliKelas})</option>`;
        });
        html += `</optgroup>`;
      });
      selectClass.innerHTML = html;
    }

    window.app.openModal("modalEditStudent");
  },

  handleEditStudentSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById("editStudentId").value;
    const name = document.getElementById("editStudentName").value.trim();
    const nisn = document.getElementById("editStudentNisn").value.trim();
    const kelas = document.getElementById("editStudentClassSelect").value;
    const gender = document.getElementById("editStudentGender").value;
    const points = parseInt(document.getElementById("editStudentPoints").value, 10) || 0;

    if (!name || !kelas) {
      window.app.showToast("Nama siswa dan kelas wajib diisi!", "error");
      return;
    }

    let level = "Pembaca Pemula";
    if (points >= 450) level = "Duta Literasi SMABA";
    else if (points >= 350) level = "Master Resensi";
    else if (points >= 200) level = "Kutu Buku Aktif";

    window.storage.updateStudent(studentId, {
      name,
      nisn,
      kelas,
      gender,
      avatar: gender === "P" ? "👩‍🎓" : "👨‍🎓",
      points,
      level
    });

    window.app.showToast(`Data siswa ${name} berhasil diperbarui!`);
    window.app.closeModal("modalEditStudent");
    this.render();
    window.app.renderAll();
  },

  deleteStudent(studentId) {
    const student = window.storage.getStudentById(studentId);
    if (!student) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data siswa:\n"${student.name} (${student.kelas})"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
      window.storage.deleteStudent(studentId);
      window.app.showToast(`Data siswa ${student.name} telah dihapus.`);
      this.render();
      window.app.renderAll();
    }
  },

  openImportCsvModal() {
    window.app.openModal("modalImportStudents");
  },

  handleImportCsv(e) {
    e.preventDefault();
    const fileInput = document.getElementById("csvFileInput");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      window.app.showToast("Silakan pilih berkas CSV terlebih dahulu!", "error");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          window.app.showToast("Berkas CSV kosong atau tidak memiliki data!", "error");
          return;
        }

        const newStudents = [];
        let count = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line || line.startsWith("TOTAL") || !line.match(/^\d+,/)) continue;

          // Simple CSV splitter handling quoted values
          const parts = line.split(",").map(p => p.trim().replace(/^"|"$/g, ""));
          if (parts.length >= 4) {
            count++;
            const no = parseInt(parts[0], 10) || count;
            const nisn = parts[1] || "";
            const name = parts[2] || "";
            const kelas = parts[3] || "X-1";
            const gender = (parts[4] || "L").toUpperCase();
            const grade = kelas.split("-")[0] || "X";

            newStudents.push({
              id: `siswa-${no}`,
              role: "siswa",
              no,
              nisn,
              name,
              kelas,
              grade,
              gender,
              avatar: gender === "P" ? "👩‍🎓" : "👨‍🎓",
              level: "Pembaca Pemula",
              points: 0,
              targetMonthlyBooks: 3,
              targetDailyMinutes: 25,
              waliKelas: `Wali Kelas ${kelas} SMAN 1 Batu`,
              bio: `Siswa aktif pembiasaan literasi kelas ${kelas} SMAN 1 Batu.`
            });
          }
        }

        if (newStudents.length === 0) {
          window.app.showToast("Format CSV tidak sesuai. Pastikan ada kolom No, NISN, Nama, Kelas, JK.", "error");
          return;
        }

        window.storage.bulkImportStudents(newStudents);
        window.app.showToast(`Berhasil mengimpor ${newStudents.length} siswa ke aplikasi!`);
        window.app.closeModal("modalImportStudents");
        this.render();
        window.app.renderAll();
      } catch (err) {
        console.error("Gagal membaca CSV:", err);
        window.app.showToast("Terjadi kesalahan saat mengolah berkas CSV.", "error");
      }
    };
    reader.readAsText(file);
  },

  restoreOfficialRoster() {
    if (confirm("Kembalikan data siswa ke Master Resmi 1.274 Siswa SMAN 1 Batu?\nData jurnal bacaan dan buku perpustakaan tetap aman.")) {
      const success = window.storage.resetStudentsToOfficial();
      if (success) {
        window.app.showToast("Data siswa berhasil dikembalikan ke Master Resmi 1.274 Siswa!");
        this.render();
        window.app.renderAll();
      } else {
        window.app.showToast("Gagal memulihkan master siswa.", "error");
      }
    }
  },

  clearDemoData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data demo untuk data siswa?\n\n• Poin seluruh 1.274 siswa direset menjadi 0\n• Predikat seluruh siswa menjadi 'Pembaca Pemula'\n• Riwayat jurnal literasi demo & sirkulasi pinjaman demo dikosongkan.")) {
      window.storage.clearStudentDemoData();
      window.app.showToast("Semua data demo siswa berhasil dibersihkan! Seluruh siswa berstatus 0 poin.");
      this.render();
      window.app.renderAll();
    }
  },

  exportStudentsCsv() {
    const students = window.storage.getStudents({
      grade: this.currentGradeFilter,
      class: this.selectedClassId,
      gender: this.currentGenderFilter,
      search: this.searchQuery
    });

    if (students.length === 0) {
      window.app.showToast("Tidak ada data siswa untuk diekspor.", "error");
      return;
    }

    // UTF-8 BOM so Microsoft Excel renders Indonesian characters correctly
    let csv = "\uFEFFNo,NISN,Nama Siswa,Kelas,Tingkat,Jenis Kelamin,Total Jurnal,Jurnal Disetujui,Poin Literasi,Lencana,Wali Kelas\n";
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
    const filterTag = this.selectedClassId !== "all" ? `_${this.selectedClassId}` : (this.currentGradeFilter !== "all" ? `_Kelas_${this.currentGradeFilter}` : "_36_Kelas");
    a.download = `Data_Siswa_SMAN1Batu${filterTag}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast(`Berhasil mengekspor ${students.length} data siswa ke CSV!`);
  }
};

window.StudentsModule = StudentsModule;
