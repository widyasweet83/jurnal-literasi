// ========================================================
// MENU DATA GURU SMAN 1 BATU: MODULE LOGIC
// 29 Guru PNS, 22 Guru PPPK, 7 Guru Non-ASN (GTT)
// Total 58 Guru & Tenaga Pendidik SMAN 1 Batu
// ========================================================

const TeachersModule = {
  currentStatusFilter: "all", // all, PNS, PPPK, GTT
  currentGenderFilter: "all", // all, L, P
  searchQuery: "",

  init() {
    this.bindEvents();
    this.updateSidebarBadge();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("searchTeacherInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderTeachersTable();
      });
    }

    // Status filter dropdown
    const statusSelect = document.getElementById("filterTeacherStatus");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderTeachersTable();
      });
    }

    // Gender filter dropdown
    const genderSelect = document.getElementById("filterTeacherGender");
    if (genderSelect) {
      genderSelect.addEventListener("change", (e) => {
        this.currentGenderFilter = e.target.value;
        this.renderTeachersTable();
      });
    }

    // Form Tambah Guru Submit
    const formAddTeacher = document.getElementById("formAddTeacher");
    if (formAddTeacher) {
      formAddTeacher.addEventListener("submit", (e) => this.handleAddTeacherSubmit(e));
    }

    // Form Edit Guru Submit
    const formEditTeacher = document.getElementById("formEditTeacher");
    if (formEditTeacher) {
      formEditTeacher.addEventListener("submit", (e) => this.handleEditTeacherSubmit(e));
    }
  },

  render() {
    this.renderSummaryStats();
    this.renderTeachersTable();
    this.updateSidebarBadge();
  },

  updateSidebarBadge() {
    const badge = document.getElementById("teachersNavBadge");
    if (badge && window.storage) {
      const all = window.storage.getTeachers();
      badge.textContent = all.length;
    }
  },

  renderSummaryStats() {
    const statsContainer = document.getElementById("teacherSummaryStats");
    if (!statsContainer || !window.storage) return;

    const allTeachers = window.storage.getTeachers();
    const pnsCount = allTeachers.filter(g => g.status === "PNS").length;
    const pppkCount = allTeachers.filter(g => g.status === "PPPK").length;
    const gttCount = allTeachers.filter(g => g.status === "GTT").length;
    const maleCount = allTeachers.filter(g => g.gender === "L").length;
    const femaleCount = allTeachers.filter(g => g.gender === "P").length;

    statsContainer.innerHTML = `
      <div class="stat-card" style="padding: 14px 18px;">
        <div class="stat-icon-box stat-icon-blue">👨‍🏫</div>
        <div class="stat-info">
          <div class="stat-value">${allTeachers.length} Guru</div>
          <div class="stat-label">👨‍🏫 L: ${maleCount} • 👩‍🏫 P: ${femaleCount}</div>
        </div>
      </div>
      <div class="stat-card" style="padding: 14px 18px;">
        <div class="stat-icon-box stat-icon-green">🏛️</div>
        <div class="stat-info">
          <div class="stat-value">${pnsCount} PNS</div>
          <div class="stat-label">Pegawai Negeri Sipil ASN</div>
        </div>
      </div>
      <div class="stat-card" style="padding: 14px 18px;">
        <div class="stat-icon-box stat-icon-purple">💼</div>
        <div class="stat-info">
          <div class="stat-value">${pppkCount} PPPK</div>
          <div class="stat-label">Pegawai Pemerintah dg Perjanjian Kerja</div>
        </div>
      </div>
      <div class="stat-card" style="padding: 14px 18px;">
        <div class="stat-icon-box stat-icon-gold">⭐</div>
        <div class="stat-info">
          <div class="stat-value">${gttCount} Non-ASN</div>
          <div class="stat-label">Guru Tetap / Tidak Tetap (GTT)</div>
        </div>
      </div>
    `;
  },

  renderTeachersTable() {
    const tableBody = document.getElementById("teachersTableBody");
    const countBadge = document.getElementById("teacherListCountBadge");
    if (!tableBody || !window.storage) return;

    const teachers = window.storage.getTeachers({
      status: this.currentStatusFilter,
      gender: this.currentGenderFilter,
      search: this.searchQuery
    });

    if (countBadge) {
      countBadge.textContent = `${teachers.length} Guru`;
    }

    if (teachers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">👨‍🏫</div>
            <strong>Tidak ada data guru ditemukan</strong>
            <p style="font-size: 0.84rem; margin-top: 4px;">Coba gunakan kata kunci pencarian lain atau ubah filter status / jenis kelamin.</p>
          </td>
        </tr>
      `;
      return;
    }

    const currentUser = window.storage.getCurrentUser();

    tableBody.innerHTML = teachers.map((g, idx) => {
      const isCurrent = currentUser && currentUser.id === g.id;

      // Status badge styling
      let statusBadgeClass = "badge-pns";
      let statusStyle = "background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;";
      if (g.status === "PPPK") {
        statusStyle = "background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;";
      } else if (g.status === "GTT") {
        statusStyle = "background: #fef3c7; color: #b45309; border: 1px solid #fde68a;";
      }

      return `
        <tr style="${isCurrent ? 'background: #eff6ff;' : ''}">
          <td style="font-weight: 700; color: #64748b; width: 44px; text-align: center;">${idx + 1}</td>
          <td style="width: 175px;">
            <code style="font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 3px 7px; border-radius: 4px; font-size: 0.82rem; letter-spacing: 0.3px;">
              ${g.nip && g.nip !== '-' ? g.nip : '<span style="color:#94a3b8; font-weight:normal;">Non-NIP / Belum Ada</span>'}
            </code>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">${g.avatar || (g.gender === 'P' ? '👩‍🏫' : '👨‍🏫')}</span>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <strong style="color: var(--primary-900); font-size: 0.95rem;">${g.name}</strong>
                  ${isCurrent ? '<span class="badge-status badge-approved" style="font-size: 0.68rem; padding: 1px 6px;">Akun Aktif</span>' : ''}
                </div>
                <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; gap: 6px; margin-top: 2px;">
                  <span style="color: ${g.gender === 'P' ? '#db2777' : '#0284c7'}; font-weight: 600;">
                    ${g.gender === 'P' ? '♀ Perempuan' : '♂ Laki-laki'}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td style="color: #475569; font-size: 0.85rem;">
            ${g.birthInfo && g.birthInfo !== '-' ? g.birthInfo : '<span style="color:#94a3b8;">-</span>'}
          </td>
          <td>
            <span style="font-size: 0.76rem; font-weight: 700; padding: 3px 9px; border-radius: 12px; display: inline-block; ${statusStyle}">
              ${g.status || 'PNS'}
            </span>
          </td>
          <td>
            <div style="font-size: 0.84rem; font-weight: 600; color: var(--primary-900);">
              ${g.jabatan || 'Guru Mata Pelajaran'}
            </div>
          </td>
          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 4px;">
              <button class="btn btn-sm btn-outline" style="padding: 4px 8px; font-size: 0.76rem;" onclick="TeachersModule.loginAsTeacher('${g.id}')" title="Masuk sebagai guru ini & buka portal validasi">
                👤 Masuk
              </button>
              <button class="btn btn-sm btn-secondary" style="padding: 4px 8px; font-size: 0.76rem;" onclick="TeachersModule.openEditTeacherModal('${g.id}')" title="Ubah data guru">
                ✏️
              </button>
              <button class="btn btn-sm btn-danger" style="padding: 4px 8px; font-size: 0.76rem;" onclick="TeachersModule.deleteTeacher('${g.id}')" title="Hapus guru">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  loginAsTeacher(teacherId) {
    const teacher = window.storage.getTeacherById(teacherId);
    if (!teacher) return;

    window.storage.setCurrentUser(teacherId);
    window.app.renderAll();
    window.app.switchTab("teacher");
    window.app.showToast(`Beralih ke akun ${teacher.name}! Anda kini berada di Portal Validasi Guru.`);
  },

  openAddTeacherModal() {
    const form = document.getElementById("formAddTeacher");
    if (form) form.reset();
    window.app.openModal("modalAddTeacher");
  },

  handleAddTeacherSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("addTeacherName").value.trim();
    const nip = document.getElementById("addTeacherNip").value.trim();
    const gender = document.getElementById("addTeacherGender").value;
    const status = document.getElementById("addTeacherStatus").value;
    const birthInfo = document.getElementById("addTeacherBirth").value.trim();
    const jabatan = document.getElementById("addTeacherJabatan").value.trim();

    if (!name) {
      window.app.showToast("Nama guru wajib diisi.", "error");
      return;
    }

    window.storage.addTeacher({
      name,
      nip,
      gender,
      status,
      birthInfo,
      jabatan
    });

    window.app.closeModal("modalAddTeacher");
    window.app.showToast(`Guru ${name} berhasil ditambahkan!`);
    this.render();
  },

  openEditTeacherModal(teacherId) {
    const teacher = window.storage.getTeacherById(teacherId);
    if (!teacher) return;

    document.getElementById("editTeacherId").value = teacher.id;
    document.getElementById("editTeacherName").value = teacher.name;
    document.getElementById("editTeacherNip").value = teacher.nip && teacher.nip !== '-' ? teacher.nip : "";
    document.getElementById("editTeacherGender").value = teacher.gender || "P";
    document.getElementById("editTeacherStatus").value = teacher.status || "PNS";
    document.getElementById("editTeacherBirth").value = teacher.birthInfo && teacher.birthInfo !== '-' ? teacher.birthInfo : "";
    document.getElementById("editTeacherJabatan").value = teacher.jabatan || "";

    window.app.openModal("modalEditTeacher");
  },

  handleEditTeacherSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("editTeacherId").value;
    const name = document.getElementById("editTeacherName").value.trim();
    const nip = document.getElementById("editTeacherNip").value.trim();
    const gender = document.getElementById("editTeacherGender").value;
    const status = document.getElementById("editTeacherStatus").value;
    const birthInfo = document.getElementById("editTeacherBirth").value.trim();
    const jabatan = document.getElementById("editTeacherJabatan").value.trim();

    if (!name) {
      window.app.showToast("Nama guru wajib diisi.", "error");
      return;
    }

    window.storage.updateTeacher(id, {
      name,
      nip: nip || "-",
      gender,
      status,
      birthInfo: birthInfo || "-",
      jabatan: jabatan || "Guru Mata Pelajaran & Pembina Literasi"
    });

    window.app.closeModal("modalEditTeacher");
    window.app.showToast(`Data guru ${name} berhasil diperbarui!`);
    this.render();
    window.app.renderAll();
  },

  deleteTeacher(teacherId) {
    const teacher = window.storage.getTeacherById(teacherId);
    if (!teacher) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data guru "${teacher.name}"?`)) {
      window.storage.deleteTeacher(teacherId);
      window.app.showToast(`Data guru ${teacher.name} berhasil dihapus.`);
      this.render();
      window.app.renderAll();
    }
  },

  restoreOfficialTeachers() {
    if (confirm("Kembalikan data guru ke Master Resmi 58 Guru SMAN 1 Batu?\nSeluruh data master guru awal akan dipulihkan.")) {
      const success = window.storage.resetTeachersToOfficial();
      if (success) {
        window.app.showToast("Data guru berhasil dikembalikan ke Master Resmi 58 Guru!");
        this.render();
        window.app.renderAll();
      } else {
        window.app.showToast("Gagal memulihkan master guru.", "error");
      }
    }
  },

  exportTeachersCsv() {
    const teachers = window.storage.getTeachers({
      status: this.currentStatusFilter,
      gender: this.currentGenderFilter,
      search: this.searchQuery
    });

    if (teachers.length === 0) {
      window.app.showToast("Tidak ada data guru untuk diekspor.", "error");
      return;
    }

    const headers = ["No", "Nama Guru", "Tempat & Tgl Lahir", "Jenis Kelamin", "NIP", "Status Kepegawaian", "Jabatan / Tugas"];
    const rows = teachers.map((g, idx) => [
      idx + 1,
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${(g.birthInfo || '').replace(/"/g, '""')}"`,
      g.gender || 'P',
      `"\t${(g.nip || '-').replace(/"/g, '""')}"`,
      g.status || 'PNS',
      `"${(g.jabatan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Guru_SMAN1_Batu_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.app.showToast(`Berhasil mengekspor ${teachers.length} data guru ke CSV!`);
  }
};

window.TeachersModule = TeachersModule;
