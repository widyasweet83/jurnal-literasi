// ========================================================
// KEGIATAN PERPUSTAKAAN: MODULE LOGIC
// Kegiatan Internal & Eksternal Perpustakaan SMAN 1 Batu
// ========================================================

const ActivitiesModule = {
  currentTypeFilter: "all",     // all, internal, external
  currentStatusFilter: "all",   // all, upcoming, ongoing, completed
  searchQuery: "",

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Type filter tabs (Semua, Internal, Eksternal)
    const typeButtons = document.querySelectorAll(".activity-type-btn");
    typeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        typeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentTypeFilter = btn.dataset.type;
        this.renderActivities();
      });
    });

    // Status filter select
    const statusSelect = document.getElementById("selectActivityStatus");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderActivities();
      });
    }

    // Search input
    const searchInput = document.getElementById("searchActivityInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderActivities();
      });
    }

    // Form Tambah Kegiatan Submit
    const formAddActivity = document.getElementById("formAddActivity");
    if (formAddActivity) {
      formAddActivity.addEventListener("submit", (e) => this.handleAddActivitySubmit(e));
    }
  },

  renderActivities() {
    const container = document.getElementById("activitiesGrid");
    if (!container) return;

    const activities = window.storage.getActivities({
      type: this.currentTypeFilter,
      status: this.currentStatusFilter,
      search: this.searchQuery
    });

    const currentUser = window.storage.getCurrentUser();
    const canManage = currentUser.role === "guru" || currentUser.role === "admin";

    // Update Counter Badges
    const countAll = window.storage.getActivities().length;
    const countInternal = window.storage.getActivities({ type: "internal" }).length;
    const countExternal = window.storage.getActivities({ type: "external" }).length;

    const badgeAll = document.getElementById("actCountAll");
    const badgeInternal = document.getElementById("actCountInternal");
    const badgeExternal = document.getElementById("actCountExternal");

    if (badgeAll) badgeAll.textContent = countAll;
    if (badgeInternal) badgeInternal.textContent = countInternal;
    if (badgeExternal) badgeExternal.textContent = countExternal;

    const btnNewActivity = document.getElementById("btnNewActivity");
    if (btnNewActivity) {
      btnNewActivity.style.display = canManage ? "inline-flex" : "none";
    }


    if (activities.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.8rem; margin-bottom: 8px;">📅</div>
          <h4 style="color: var(--primary-900); margin-bottom: 4px;">Tidak Ada Kegiatan Ditemukan</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Coba sesuaikan kata kunci pencarian atau tab filter jenis kegiatan.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activities.map(act => {
      const isInternal = act.type === "internal";
      const registeredCount = act.registeredStudents ? act.registeredStudents.length : 0;
      const isRegistered = act.registeredStudents && act.registeredStudents.includes(currentUser.id);
      const isFull = act.quota && registeredCount >= act.quota;

      let statusBadge = "";
      if (act.status === "upcoming") {
        statusBadge = `<span class="badge-status badge-pending">⏳ Akan Datang</span>`;
      } else if (act.status === "ongoing") {
        statusBadge = `<span class="badge-status badge-approved">🔥 Berlangsung</span>`;
      } else {
        statusBadge = `<span class="badge-status" style="background:#f1f5f9; color:#475569;">✓ Selesai</span>`;
      }

      return `
        <div class="activity-card">
          <!-- Top Banner Header -->
          <div class="activity-banner" style="background: linear-gradient(135deg, ${act.bannerColor || '#1e3a8a'}, #0f172a);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="activity-type-pill ${isInternal ? 'pill-internal' : 'pill-external'}">
                ${isInternal ? '🏛️ Internal Sekolah' : '🌍 Eksternal / Dinas'}
              </span>
              <span class="activity-point-pill">
                ⭐ +${act.pointsReward || 30} Poin
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 14px;">
              <div class="activity-icon-box">${act.icon || (isInternal ? '📖' : '🌍')}</div>
              <div>
                <span class="activity-category-tag">${act.category}</span>
                <h3 class="activity-title">${act.title}</h3>
              </div>
            </div>
          </div>

          <!-- Body Content -->
          <div class="activity-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>${statusBadge}</div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #475569;">
                👥 ${registeredCount} / ${act.quota} Peserta
              </div>
            </div>

            <div class="activity-meta-list">
              <div class="activity-meta-item">
                <span class="meta-icon">📅</span>
                <span><strong>Waktu:</strong> ${act.date} (${act.time})</span>
              </div>
              <div class="activity-meta-item">
                <span class="meta-icon">📍</span>
                <span><strong>Tempat:</strong> ${act.location}</span>
              </div>
              <div class="activity-meta-item">
                <span class="meta-icon">👤</span>
                <span><strong>Koordinator:</strong> ${act.coordinator}</span>
              </div>
              <div class="activity-meta-item">
                <span class="meta-icon">🎯</span>
                <span><strong>Sasaran:</strong> ${act.targetAudience}</span>
              </div>
            </div>

            <p class="activity-desc">${act.description}</p>
          </div>

          <!-- Footer Actions -->
          <div class="activity-footer">
            <button class="btn btn-secondary btn-sm" onclick="ActivitiesModule.openDetailModal('${act.id}')">
              Lihat Detail
            </button>
            <div style="display: flex; gap: 6px;">
              ${currentUser.role === 'siswa' && act.status !== 'completed' ? `
                <button class="btn btn-primary btn-sm" 
                        ${isRegistered || isFull ? 'disabled' : ''} 
                        onclick="ActivitiesModule.registerStudent('${act.id}')">
                  ${isRegistered ? '✓ Sudah Terdaftar' : (isFull ? 'Kuota Penuh' : 'Daftar Ikuti')}
                </button>
              ` : ""}
              ${canManage ? `
                <button class="btn btn-secondary btn-sm" onclick="ActivitiesModule.openEditModal('${act.id}')" title="Edit Kegiatan">
                  ✏️
                </button>
                <button class="btn btn-secondary btn-sm" style="color: var(--rose-600);" onclick="ActivitiesModule.deleteActivity('${act.id}')" title="Hapus">
                  🗑️
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  openDetailModal(activityId) {
    const act = window.storage.getActivityById(activityId);
    if (!act) return;

    const modal = document.getElementById("modalActivityDetail");
    const content = document.getElementById("activityDetailContent");
    if (!modal || !content) return;

    const currentUser = window.storage.getCurrentUser();
    const isInternal = act.type === "internal";
    const isRegistered = act.registeredStudents && act.registeredStudents.includes(currentUser.id);
    const registeredCount = act.registeredStudents ? act.registeredStudents.length : 0;
    const isFull = act.quota && registeredCount >= act.quota;

    // Build registered student list
    const students = window.storage.getStudents();
    const participantList = (act.registeredStudents || []).map(sId => {
      const s = students.find(st => st.id === sId);
      return s ? `<li><strong>${s.name}</strong> (${s.kelas}) - NISN: ${s.nisn}</li>` : `<li>Peserta Siswa Terdaftar</li>`;
    }).join("");

    content.innerHTML = `
      <div style="background: linear-gradient(135deg, ${act.bannerColor || '#1e3a8a'}, #0f172a); color: #fff; padding: 20px; border-radius: var(--radius-md); margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="activity-type-pill ${isInternal ? 'pill-internal' : 'pill-external'}">
            ${isInternal ? '🏛️ Kegiatan Internal SMAN 1 Batu' : '🌍 Kegiatan Eksternal Luar Sekolah / Dinas'}
          </span>
          <span class="activity-point-pill">⭐ +${act.pointsReward || 30} Poin Literasi</span>
        </div>
        <h3 style="font-size: 1.35rem; color: #fff; margin-bottom: 4px;">${act.title}</h3>
        <p style="font-size: 0.85rem; color: #cbd5e1;">Kategori: <strong>${act.category}</strong></p>
      </div>

      <table style="width: 100%; font-size: 0.86rem; border-collapse: collapse; margin-bottom: 18px;">
        <tr><td style="padding: 5px 0; color: #64748b; width: 140px;">📅 Waktu Pelaksanaan</td><td><strong>${act.date} • ${act.time}</strong></td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">📍 Lokasi Kegiatan</td><td><strong>${act.location}</strong></td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">👩‍🏫 Penanggung Jawab</td><td><strong>${act.coordinator}</strong></td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">🎯 Sasaran Peserta</td><td>${act.targetAudience}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">👥 Kuota Pendaftar</td><td><strong>${registeredCount} dari ${act.quota} Siswa</strong></td></tr>
      </table>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.95rem; color: var(--primary-900); margin-bottom: 6px;">Deskripsi Kegiatan:</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); font-size: 0.88rem; line-height: 1.6; color: #334155;">
          ${act.description}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.95rem; color: var(--primary-900); margin-bottom: 6px;">Tujuan & Manfaat:</h4>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: var(--radius-sm); font-size: 0.86rem; color: #166534;">
          ${act.objectives || 'Meningkatkan wawasan literasi dan kecakapan akademik siswa SMAN 1 Batu.'}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.95rem; color: var(--primary-900); margin-bottom: 6px;">Daftar Siswa yang Telah Mendaftar (${registeredCount} Siswa):</h4>
        <div style="background: #ffffff; border: 1px solid var(--border-color); padding: 10px 14px; border-radius: var(--radius-sm); max-height: 120px; overflow-y: auto; font-size: 0.82rem;">
          ${participantList ? `<ol style="padding-left: 18px; line-height: 1.6;">${participantList}</ol>` : '<em style="color:#64748b;">Belum ada siswa yang mendaftar. Jadilah yang pertama!</em>'}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--border-color); padding-top: 14px;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal('modalActivityDetail')">Tutup</button>
        ${currentUser.role === 'siswa' && act.status !== 'completed' ? `
          <button class="btn btn-primary btn-sm" 
                  ${isRegistered || isFull ? 'disabled' : ''} 
                  onclick="window.app.closeModal('modalActivityDetail'); ActivitiesModule.registerStudent('${act.id}')">
            ${isRegistered ? '✓ Anda Sudah Terdaftar' : (isFull ? 'Kuota Penuh' : 'Daftar Sekarang')}
          </button>
        ` : ""}
      </div>
    `;

    window.app.openModal("modalActivityDetail");
  },

  registerStudent(activityId) {
    const currentUser = window.storage.getCurrentUser();
    if (currentUser.role !== "siswa") {
      window.app.showToast("Pendaftaran peserta kegiatan dikhususkan untuk siswa.", "error");
      return;
    }

    try {
      const result = window.storage.registerStudentToActivity(activityId, currentUser.id);
      window.app.showToast(`Berhasil mendaftar pada "${result.act.title}"! (+${result.act.pointsReward} Poin Literasi)`);
      this.renderActivities();
      window.app.renderAll();
    } catch (err) {
      window.app.showToast(err.message, "error");
    }
  },

  openAddModal() {
    const form = document.getElementById("formAddActivity");
    if (!form) return;
    form.reset();
    document.getElementById("activityEditId").value = "";
    document.getElementById("modalActivityTitle").textContent = "Tambah Kegiatan Perpustakaan Baru";
    document.getElementById("actDate").value = new Date().toISOString().split("T")[0];
    window.app.openModal("modalAddActivity");
  },

  openEditModal(activityId) {
    const act = window.storage.getActivityById(activityId);
    if (!act) return;

    this.openAddModal();
    document.getElementById("modalActivityTitle").textContent = "Edit Kegiatan Perpustakaan";
    document.getElementById("activityEditId").value = act.id;
    document.getElementById("actTitle").value = act.title;
    document.getElementById("actType").value = act.type;
    document.getElementById("actCategory").value = act.category;
    document.getElementById("actStatus").value = act.status;
    document.getElementById("actDate").value = act.date;
    document.getElementById("actTime").value = act.time;
    document.getElementById("actLocation").value = act.location;
    document.getElementById("actCoordinator").value = act.coordinator;
    document.getElementById("actTarget").value = act.targetAudience;
    document.getElementById("actQuota").value = act.quota;
    document.getElementById("actPoints").value = act.pointsReward;
    document.getElementById("actDescription").value = act.description;
    document.getElementById("actObjectives").value = act.objectives || "";

    window.app.openModal("modalAddActivity");
  },

  handleAddActivitySubmit(e) {
    e.preventDefault();
    const editId = document.getElementById("activityEditId").value;
    const title = document.getElementById("actTitle").value.trim();
    const type = document.getElementById("actType").value;
    const category = document.getElementById("actCategory").value.trim();
    const status = document.getElementById("actStatus").value;
    const date = document.getElementById("actDate").value;
    const time = document.getElementById("actTime").value.trim();
    const location = document.getElementById("actLocation").value.trim();
    const coordinator = document.getElementById("actCoordinator").value.trim();
    const targetAudience = document.getElementById("actTarget").value.trim();
    const quota = Number(document.getElementById("actQuota").value) || 50;
    const pointsReward = Number(document.getElementById("actPoints").value) || 30;
    const description = document.getElementById("actDescription").value.trim();
    const objectives = document.getElementById("actObjectives").value.trim();

    if (!title || !location || !coordinator) {
      window.app.showToast("Judul, lokasi, dan koordinator kegiatan wajib diisi!", "error");
      return;
    }

    const payload = {
      title,
      type,
      category: category || (type === "internal" ? "Internal SMABA" : "Eksternal"),
      status,
      date,
      time: time || "09.00 WIB",
      location,
      coordinator,
      targetAudience: targetAudience || "Siswa 36 Kelas & Guru",
      quota,
      pointsReward,
      description,
      objectives,
      bannerColor: type === "internal" ? "#1e3a8a" : "#0284c7",
      icon: type === "internal" ? "🏛️" : "🌍"
    };

    if (editId) {
      window.storage.updateActivity(editId, payload);
      window.app.showToast("Data kegiatan perpustakaan berhasil diperbarui!");
    } else {
      window.storage.addActivity(payload);
      window.app.showToast(`Kegiatan ${type === 'internal' ? 'Internal' : 'Eksternal'} baru berhasil ditambahkan!`);
    }

    window.app.closeModal("modalAddActivity");
    this.renderActivities();
  },

  deleteActivity(id) {
    const act = window.storage.getActivityById(id);
    if (!act) return;
    if (confirm(`Apakah Anda yakin ingin menghapus agenda kegiatan "${act.title}"?`)) {
      window.storage.deleteActivity(id);
      window.app.showToast("Kegiatan perpustakaan berhasil dihapus.");
      this.renderActivities();
    }
  },

  exportActivitiesCsv() {
    const activities = window.storage.getActivities({
      type: this.currentTypeFilter,
      status: this.currentStatusFilter,
      search: this.searchQuery
    });

    if (activities.length === 0) {
      window.app.showToast("Tidak ada agenda kegiatan untuk diekspor.", "error");
      return;
    }

    let csv = "ID,Judul Kegiatan,Tipe (Internal/Eksternal),Kategori,Status,Tanggal,Waktu,Lokasi,Koordinator,Sasaran,Total Peserta,Poin\n";
    activities.forEach(a => {
      const clean = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
      csv += [
        a.id,
        clean(a.title),
        a.type.toUpperCase(),
        clean(a.category),
        a.status,
        a.date,
        clean(a.time),
        clean(a.location),
        clean(a.coordinator),
        clean(a.targetAudience),
        a.registeredStudents ? a.registeredStudents.length : 0,
        a.pointsReward || 30
      ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Agenda_Kegiatan_Perpustakaan_SMAN1Batu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast("Agenda kegiatan perpustakaan berhasil diunduh dalam format CSV!");
  }
};

window.ActivitiesModule = ActivitiesModule;
