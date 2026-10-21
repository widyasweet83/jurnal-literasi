// ========================================================
// VALIDASI GURU & PEMBINA GLS SMABA: MODULE LOGIC
// Pemeriksaan Jurnal, Pemberian Nilai, Masukan, dan Rekap
// ========================================================

const TeacherModule = {
  currentClassFilter: "all",
  currentStatusFilter: "pending",
  searchQuery: "",

  init() {
    this.populateClassFilter();
    this.bindEvents();
  },

  populateClassFilter() {
    const classFilter = document.getElementById("teacherClassFilter");
    if (!classFilter) return;

    const classes = window.storage.getClasses();
    let html = `<option value="all">Semua 36 Rombel Kelas (X, XI, XII)</option>`;
    
    ["X", "XI", "XII"].forEach(grd => {
      html += `<optgroup label="Tingkat ${grd} (12 Rombel)">`;
      classes.filter(c => c.grade === grd).forEach(c => {
        html += `<option value="${c.id}">${c.name} (${c.id})</option>`;
      });
      html += `</optgroup>`;
    });

    classFilter.innerHTML = html;
  },

  bindEvents() {
    const classFilter = document.getElementById("teacherClassFilter");
    if (classFilter) {
      classFilter.addEventListener("change", (e) => {
        this.currentClassFilter = e.target.value;
        this.renderVerificationList();
      });
    }

    const statusFilter = document.getElementById("teacherStatusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderVerificationList();
      });
    }

    const searchInput = document.getElementById("teacherSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderVerificationList();
      });
    }

    // Quick feedback templates
    const templateContainer = document.getElementById("quickFeedbackChips");
    if (templateContainer) {
      templateContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".feedback-chip");
        if (chip) {
          const feedbackInput = document.getElementById("reviewFeedbackText");
          if (feedbackInput) {
            feedbackInput.value = chip.dataset.text;
          }
        }
      });
    }
  },

  renderStats() {
    const stats = window.storage.getTeacherStats();
    const countPending = document.getElementById("teacherPendingBadge");
    if (countPending) countPending.textContent = stats.totalToVerify;

    const statPendingEl = document.getElementById("teacherStatPending");
    if (statPendingEl) statPendingEl.textContent = stats.totalToVerify;

    const statApprovedEl = document.getElementById("teacherStatApproved");
    if (statApprovedEl) statApprovedEl.textContent = stats.totalApproved;

    const statRevisionEl = document.getElementById("teacherStatRevision");
    if (statRevisionEl) statRevisionEl.textContent = stats.totalRevision;

    const statStudentsEl = document.getElementById("teacherStatStudents");
    if (statStudentsEl) statStudentsEl.textContent = stats.totalStudentsActive;
  },

  renderVerificationList() {
    this.renderStats();
    const container = document.getElementById("teacherVerificationList");
    if (!container) return;

    const journals = window.storage.getJournals({
      class: this.currentClassFilter,
      status: this.currentStatusFilter,
      search: this.searchQuery
    });

    if (journals.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
          <h4 style="color: var(--primary-900); margin-bottom: 4px;">Tidak Ada Jurnal Pada Filter Ini</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Semua jurnal siswa untuk kategori ini telah selesai diproses.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = journals.map(j => {
      let statusBadge = "";
      if (j.status === "approved") {
        statusBadge = `<span class="badge-status badge-approved">✓ Disetujui (${j.teacherScore || 90})</span>`;
      } else if (j.status === "revision") {
        statusBadge = `<span class="badge-status badge-revision">⚠️ Perlu Revisi</span>`;
      } else {
        statusBadge = `<span class="badge-status badge-pending">Menunggu Validasi</span>`;
      }

      return `
        <div class="journal-card" style="margin-bottom: 16px;">
          <div>
            <div class="journal-header">
              <div>
                <span class="book-category-pill">${j.bookCategory || "Literasi"}</span>
                <div class="journal-book-title">${j.bookTitle}</div>
                <div class="journal-author-tag">Penulis: ${j.bookAuthor}</div>
              </div>
              <div>${statusBadge}</div>
            </div>

            <div class="journal-meta-row">
              <span class="journal-meta-item">👨‍🎓 Siswa: <strong>${j.studentName}</strong></span>
              <span class="journal-meta-item">🏫 Kelas: <strong>${j.studentClass}</strong></span>
              <span class="journal-meta-item">📅 Tanggal Baca: ${j.dateRead}</span>
              <span class="journal-meta-item">📖 ${j.pagesRead} hal</span>
            </div>

            <div class="journal-summary-box">
              <p style="-webkit-line-clamp: 3;">${j.summary}</p>
            </div>

            ${j.moralValue ? `
              <div class="journal-moral-box">
                <strong>Hikmah Karakter:</strong> ${j.moralValue}
              </div>
            ` : ""}

            ${j.teacherFeedback ? `
              <div class="teacher-feedback-card ${j.status === 'revision' ? 'revision' : ''}">
                <div class="teacher-feedback-head">
                  <span>Masukan Sebelumnya:</span>
                  ${j.teacherScore != null ? `<span class="teacher-score-badge">Skor: ${j.teacherScore}</span>` : ""}
                </div>
                <div class="teacher-feedback-body">${j.teacherFeedback}</div>
              </div>
            ` : ""}
          </div>

          <div class="journal-footer-actions">
            <button class="btn btn-secondary btn-sm" onclick="JournalModule.openDetailModal('${j.id}')">
              Lihat Detail Penuh
            </button>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" onclick="TeacherModule.openReviewModal('${j.id}')">
                ✏️ Periksa & Beri Nilai
              </button>
              ${j.status === 'pending' ? `
                <button class="btn btn-success btn-sm" onclick="TeacherModule.quickApprove('${j.id}')" title="Langsung Setujui">
                  ✓ Cepat (Skor 90)
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  openReviewModal(journalId) {
    const journal = window.storage.getJournalById(journalId);
    if (!journal) return;

    const modal = document.getElementById("modalReviewJournal");
    if (!modal) return;

    document.getElementById("reviewJournalId").value = journal.id;
    document.getElementById("reviewStudentName").textContent = `${journal.studentName} (${journal.studentClass})`;
    document.getElementById("reviewBookTitle").textContent = `${journal.bookTitle} - oleh ${journal.bookAuthor}`;
    document.getElementById("reviewSummarySnippet").textContent = journal.summary;
    document.getElementById("reviewMoralSnippet").textContent = journal.moralValue || "Tidak ada catatan hikmah";

    // Prefill existing score / feedback
    document.getElementById("reviewScore").value = journal.teacherScore || 90;
    document.getElementById("reviewFeedbackText").value = journal.teacherFeedback || "Ulasan sangat baik dan reflektif. Terus pertahankan budaya literasi!";
    document.getElementById("reviewStatus").value = journal.status === "revision" ? "revision" : "approved";

    window.app.openModal("modalReviewJournal");
  },

  submitReview(e) {
    e.preventDefault();
    const journalId = document.getElementById("reviewJournalId").value;
    const score = Number(document.getElementById("reviewScore").value);
    const feedback = document.getElementById("reviewFeedbackText").value.trim();
    const status = document.getElementById("reviewStatus").value;

    const currentUser = window.storage.getCurrentUser();
    const approverName = currentUser.name || (currentUser.role === 'admin' ? "Ibu Sulis Setiasih (Pustakawan)" : "Ibu Widya Ningsih, S.Kom, Gr (Guru)");
    const approverRole = currentUser.role || "guru";

    window.storage.verifyJournal(journalId, {
      score,
      feedback,
      status,
      approverName,
      approverRole
    });

    window.app.showToast(status === "approved" ? "Jurnal berhasil disetujui Guru/Admin dan nilai telah tercatat!" : "Status jurnal diubah menjadi perlu revisi.");
    window.app.closeModal("modalReviewJournal");
    window.app.renderAll();
  },

  quickApprove(journalId) {
    const currentUser = window.storage.getCurrentUser();
    const approverName = currentUser.name || (currentUser.role === 'admin' ? "Ibu Sulis Setiasih (Pustakawan)" : "Ibu Widya Ningsih, S.Kom, Gr (Guru)");

    window.storage.verifyJournal(journalId, {
      score: 90,
      feedback: "Jurnal literasi telah diperiksa dan disetujui dengan predikat sangat baik.",
      status: "approved",
      approverName,
      approverRole: currentUser.role
    });

    window.app.showToast("Jurnal berhasil disetujui (Skor: 90)!");
    window.app.renderAll();
  },

  approveAllPending() {
    const pendingJournals = window.storage.getJournals({ status: "pending" });
    if (pendingJournals.length === 0) {
      window.app.showToast("Tidak ada jurnal yang berstatus pending.", "error");
      return;
    }

    if (confirm(`Setujui sekaligus ${pendingJournals.length} jurnal literasi yang sedang menunggu validasi dengan skor standar 90?`)) {
      const currentUser = window.storage.getCurrentUser();
      const approverName = currentUser.name || (currentUser.role === 'admin' ? "Ibu Sulis Setiasih" : "Ibu Widya Ningsih, S.Kom, Gr");

      pendingJournals.forEach(j => {
        window.storage.verifyJournal(j.id, {
          score: 90,
          feedback: "Disetujui secara terpadu oleh Pembina Literasi SMABA / Admin Perpustakaan.",
          status: "approved",
          approverName,
          approverRole: currentUser.role
        });
      });

      window.app.showToast(`Berhasil menyetujui ${pendingJournals.length} jurnal literasi siswa!`);
      window.app.renderAll();
    }
  },

  exportToCsv() {
    const journals = window.storage.getJournals();
    if (journals.length === 0) {
      window.app.showToast("Tidak ada data jurnal untuk diekspor.", "error");
      return;
    }

    let csv = "ID,Nama Siswa,Kelas,NISN,Judul Buku,Penulis,Kategori,Tgl Baca,Halaman,Skor,Status,Catatan Guru\n";
    journals.forEach(j => {
      const clean = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
      csv += [
        j.id,
        clean(j.studentName),
        clean(j.studentClass),
        clean(j.studentNisn),
        clean(j.bookTitle),
        clean(j.bookAuthor),
        clean(j.bookCategory),
        j.dateRead,
        j.pagesRead,
        j.teacherScore || "",
        j.status,
        clean(j.teacherFeedback)
      ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rekap_Jurnal_Literasi_SMAN1_Batu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast("Data jurnal literasi berhasil diunduh dalam format CSV!");
  }
};

window.TeacherModule = TeacherModule;
