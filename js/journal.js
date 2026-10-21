// ========================================================
// JURNAL LITERASI SISWA: MODULE LOGIC
// Form Pengisian Mandiri (Tanpa Izin), Validasi Guru & Admin
// ========================================================

const JournalModule = {
  selectedRating: 5,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Form submit
    const form = document.getElementById("formJournal");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    // Rating star clicks
    const ratingContainer = document.getElementById("ratingPicker");
    if (ratingContainer) {
      ratingContainer.addEventListener("click", (e) => {
        const star = e.target.closest(".rating-star");
        if (star) {
          const val = Number(star.dataset.val);
          this.setRating(val);
        }
      });
    }

    // Auto-fill book details when selected from dropdown
    const selectBook = document.getElementById("journalBookSelect");
    if (selectBook) {
      selectBook.addEventListener("change", (e) => {
        const bookId = e.target.value;
        if (bookId && bookId !== "custom") {
          const book = window.storage.getBookById(bookId);
          if (book) {
            document.getElementById("journalBookTitle").value = book.title;
            document.getElementById("journalBookAuthor").value = book.author;
            document.getElementById("journalBookCategory").value = book.category;
            document.getElementById("journalTotalPages").value = book.pages;
          }
        } else {
          document.getElementById("journalBookTitle").value = "";
          document.getElementById("journalBookAuthor").value = "";
        }
      });
    }
  },

  setRating(val) {
    this.selectedRating = val;
    const stars = document.querySelectorAll("#ratingPicker .rating-star");
    stars.forEach(s => {
      const sVal = Number(s.dataset.val);
      if (sVal <= val) {
        s.classList.add("active");
        s.textContent = "★";
      } else {
        s.classList.remove("active");
        s.textContent = "☆";
      }
    });
  },

  openCreateModal(prefilledBook = null) {
    const modal = document.getElementById("modalJournal");
    const form = document.getElementById("formJournal");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("journalEditId").value = "";
    document.getElementById("modalJournalTitle").textContent = "Tulis Jurnal Literasi Siswa (Tanpa Izin Awal)";

    // Notice info
    const noticeEl = document.getElementById("journalDirectFillNotice");
    if (noticeEl) {
      noticeEl.innerHTML = `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 14px; display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 1.2rem;">💡</span>
          <span><strong>Bebas Mengisi Kapan Saja:</strong> Siswa dapat langsung mengisi jurnal bacaan tanpa memerlukan izin awal. Setelah dikirim, jurnal akan masuk antrean untuk <strong>disetujui oleh Guru atau Admin Perpustakaan</strong>.</span>
        </div>
      `;
    }

    // Populate student options from the 36 classes
    const selectStudent = document.getElementById("journalTargetStudentSelect");
    if (selectStudent) {
      const students = window.storage.getStudents();
      const currentUser = window.storage.getCurrentUser();
      let html = "";

      ["X", "XI", "XII"].forEach(grd => {
        const inGrade = students.filter(s => s.grade === grd || (s.kelas && s.kelas.startsWith(grd + "-")));
        if (inGrade.length > 0) {
          html += `<optgroup label="Tingkat ${grd} (Rombel Kelas ${grd}-1 s.d. ${grd}-12)">`;
          inGrade.forEach(s => {
            const isSelected = s.id === currentUser.id;
            html += `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${s.name} (${s.kelas}) - NISN: ${s.nisn}</option>`;
          });
          html += `</optgroup>`;
        }
      });

      selectStudent.innerHTML = html;
    }

    // Populate book options
    const selectBook = document.getElementById("journalBookSelect");
    if (selectBook) {
      const books = window.storage.getBooks();
      let html = `<option value="">-- Pilih dari Koleksi Perpustakaan SMABA --</option>`;
      books.forEach(b => {
        html += `<option value="${b.id}">${b.title} (${b.author})</option>`;
      });
      html += `<option value="custom">✏️ Masukkan Judul Buku Lain / Mandiri</option>`;
      selectBook.innerHTML = html;

      if (prefilledBook) {
        selectBook.value = prefilledBook.id;
        document.getElementById("journalBookTitle").value = prefilledBook.title;
        document.getElementById("journalBookAuthor").value = prefilledBook.author;
        document.getElementById("journalBookCategory").value = prefilledBook.category;
        document.getElementById("journalTotalPages").value = prefilledBook.pages;
      }
    }

    // Set today's date
    const dateInput = document.getElementById("journalDateRead");
    if (dateInput) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }

    this.setRating(5);
    window.app.openModal("modalJournal");
  },

  openEditModal(journalId) {
    const journal = window.storage.getJournalById(journalId);
    if (!journal) return;

    this.openCreateModal();
    document.getElementById("modalJournalTitle").textContent = "Edit Jurnal Literasi (Perlu Persetujuan Ulang)";
    document.getElementById("journalEditId").value = journal.id;
    document.getElementById("journalBookTitle").value = journal.bookTitle;
    document.getElementById("journalBookAuthor").value = journal.bookAuthor;
    document.getElementById("journalBookCategory").value = journal.bookCategory || "Fiksi";
    document.getElementById("journalDateRead").value = journal.dateRead || "";
    document.getElementById("journalPagesRead").value = journal.pagesRead || "";
    document.getElementById("journalTotalPages").value = journal.totalBookPages || "";
    document.getElementById("journalSummary").value = journal.summary || "";
    document.getElementById("journalMoral").value = journal.moralValue || "";
    document.getElementById("journalQuote").value = journal.favoriteQuote || "";

    const selectStudent = document.getElementById("journalTargetStudentSelect");
    if (selectStudent && journal.studentId) {
      selectStudent.value = journal.studentId;
    }

    if (journal.rating) {
      this.setRating(journal.rating);
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById("journalEditId").value;
    const bookTitle = document.getElementById("journalBookTitle").value.trim();
    const bookAuthor = document.getElementById("journalBookAuthor").value.trim();
    const bookCategory = document.getElementById("journalBookCategory").value;
    const dateRead = document.getElementById("journalDateRead").value;
    const pagesRead = Number(document.getElementById("journalPagesRead").value) || 0;
    const totalBookPages = Number(document.getElementById("journalTotalPages").value) || 0;
    const summary = document.getElementById("journalSummary").value.trim();
    const moralValue = document.getElementById("journalMoral").value.trim();
    const favoriteQuote = document.getElementById("journalQuote").value.trim();

    const targetStudentId = document.getElementById("journalTargetStudentSelect")?.value;
    const selectedStudent = targetStudentId ? window.storage.getStudentById(targetStudentId) : null;

    if (!bookTitle || !summary) {
      window.app.showToast("Judul buku dan ringkasan bacaan wajib diisi!", "error");
      return;
    }

    if (summary.length < 50) {
      window.app.showToast("Ringkasan terlalu pendek. Mohon berikan ulasan minimal 50 karakter agar dapat dinilai guru/admin.", "error");
      return;
    }

    const payload = {
      bookTitle,
      bookAuthor: bookAuthor || "Anonim",
      bookCategory,
      dateRead,
      pagesRead,
      totalBookPages,
      summary,
      moralValue,
      favoriteQuote,
      rating: this.selectedRating
    };

    if (selectedStudent) {
      payload.studentId = selectedStudent.id;
      payload.studentName = selectedStudent.name;
      payload.studentClass = selectedStudent.kelas;
      payload.studentNisn = selectedStudent.nisn;
    }

    if (editId) {
      window.storage.updateJournal(editId, payload);
      window.app.showToast("Jurnal berhasil diperbarui! Menunggu persetujuan ulang Guru/Admin.");
    } else {
      window.storage.addJournal(payload);
      window.app.showToast("Jurnal berhasil disubmit! Menunggu persetujuan Guru atau Admin Perpustakaan.");
    }

    window.app.closeModal("modalJournal");
    window.app.renderAll();
  },

  deleteJournal(id) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan jurnal literasi ini?")) {
      window.storage.deleteJournal(id);
      window.app.showToast("Jurnal literasi berhasil dihapus.");
      window.app.renderAll();
    }
  },

  openDetailModal(journalId) {
    const journal = window.storage.getJournalById(journalId);
    if (!journal) return;

    const modal = document.getElementById("modalJournalDetail");
    const body = document.getElementById("journalDetailContent");
    if (!modal || !body) return;

    let statusBadge = "";
    if (journal.status === "approved") {
      statusBadge = `<span class="badge-status badge-approved">✓ Disetujui Guru/Admin (${journal.teacherScore || 90}/100)</span>`;
    } else if (journal.status === "revision") {
      statusBadge = `<span class="badge-status badge-revision">⚠️ Perlu Revisi</span>`;
    } else {
      statusBadge = `<span class="badge-status badge-pending">⏳ Menunggu Persetujuan Guru/Admin</span>`;
    }

    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= (journal.rating || 5) ? "★" : "☆";
    }

    let feedbackSection = "";
    if (journal.teacherFeedback || journal.teacherScore != null) {
      const isRev = journal.status === "revision";
      feedbackSection = `
        <div class="teacher-feedback-card ${isRev ? 'revision' : ''}" style="margin-top: 18px;">
          <div class="teacher-feedback-head">
            <span>Catatan Persetujuan: ${journal.teacherName || "Guru / Admin SMABA"}</span>
            ${journal.teacherScore != null ? `<span class="teacher-score-badge">Skor: ${journal.teacherScore}</span>` : ""}
          </div>
          <div class="teacher-feedback-body">
            ${journal.teacherFeedback || "Sudah diperiksa dan disetujui."}
          </div>
          ${journal.verifiedAt ? `<div style="font-size: 0.72rem; color: #64748b; margin-top: 6px;">Divalidasi pada: ${journal.verifiedAt}</div>` : ""}
        </div>
      `;
    }

    body.innerHTML = `
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
        <div>
          <span class="book-category-pill">${journal.bookCategory || "Literasi"}</span>
          <h3 style="font-size: 1.35rem; color: var(--primary-900); margin-top: 4px;">${journal.bookTitle}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Penulis: <strong>${journal.bookAuthor}</strong></p>
        </div>
        <div>${statusBadge}</div>
      </div>

      <div class="journal-meta-row">
        <span>👤 Siswa: <strong>${journal.studentName}</strong> (<span class="badge-class-tag">${journal.studentClass}</span>)</span>
        <span>📅 Tanggal: ${journal.dateRead || "-"}</span>
        <span>📖 Dibaca: <strong>${journal.pagesRead}</strong> dari ${journal.totalBookPages || "-"} hal</span>
        <span style="color: #f59e0b; font-size: 1rem;">${stars}</span>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary-900); margin-bottom: 6px;">Ringkasan / Sinopsis Bacaan:</h4>
        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6; color: #334155; white-space: pre-line;">
          ${journal.summary}
        </div>
      </div>

      ${journal.moralValue ? `
        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary-900); margin-bottom: 6px;">Nilai Karakter / Hikmah yang Dipetik:</h4>
          <div class="journal-moral-box">
            ${journal.moralValue}
          </div>
        </div>
      ` : ""}

      ${journal.favoriteQuote ? `
        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary-900); margin-bottom: 6px;">Kutipan Favorit:</h4>
          <div class="journal-quote-box">
            "${journal.favoriteQuote}"
          </div>
        </div>
      ` : ""}

      ${feedbackSection}
    `;

    // Action buttons in detail modal
    const footer = document.getElementById("journalDetailFooter");
    const currentUser = window.storage.getCurrentUser();
    
    let footerHtml = `
      <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal('modalJournalDetail')">Tutup</button>
    `;

    // Guru atau Admin bisa memvalidasi/menyetujui jurnal
    if (currentUser.role === "guru" || currentUser.role === "admin") {
      footerHtml += `
        <button class="btn btn-primary btn-sm" onclick="window.app.closeModal('modalJournalDetail'); TeacherModule.openReviewModal('${journal.id}')">
          ✏️ Beri Nilai & Setujui
        </button>
      `;
    } else if (currentUser.role === "siswa" && currentUser.id === journal.studentId) {
      if (journal.status === "revision") {
        footerHtml += `
          <button class="btn btn-warning btn-sm" onclick="window.app.closeModal('modalJournalDetail'); JournalModule.openEditModal('${journal.id}')">
            Perbaiki Jurnal
          </button>
        `;
      }
    }

    footer.innerHTML = footerHtml;
    window.app.openModal("modalJournalDetail");
  },

  renderJournalsGrid(journals, containerId = "journalsGrid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!journals || journals.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.8rem; margin-bottom: 10px;">📖</div>
          <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 6px;">Belum Ada Jurnal Literasi</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 450px; margin: 0 auto 18px;">
            Ayo mulai biasakan membaca setiap hari. Siswa dapat langsung mengisi jurnal tanpa izin awal!
          </p>
          <button class="btn btn-primary btn-sm" onclick="JournalModule.openCreateModal()">
            ➕ Tulis Jurnal Sekarang
          </button>
        </div>
      `;
      return;
    }

    const currentUser = window.storage.getCurrentUser();

    container.innerHTML = journals.map(j => {
      let statusBadge = "";
      if (j.status === "approved") {
        statusBadge = `<span class="badge-status badge-approved">✓ Disetujui (${j.teacherScore || 90})</span>`;
      } else if (j.status === "revision") {
        statusBadge = `<span class="badge-status badge-revision">⚠️ Perlu Revisi</span>`;
      } else {
        statusBadge = `<span class="badge-status badge-pending">Menunggu Persetujuan Guru/Admin</span>`;
      }

      let stars = "";
      for (let i = 1; i <= 5; i++) {
        stars += i <= (j.rating || 5) ? "★" : "☆";
      }

      const isOwner = currentUser.role === "siswa" && currentUser.id === j.studentId;
      const canVerify = currentUser.role === "guru" || currentUser.role === "admin";

      return `
        <div class="journal-card">
          <div>
            <div class="journal-header">
              <div>
                <span class="book-category-pill">${j.bookCategory || "Literasi"}</span>
                <div class="journal-book-title">${j.bookTitle}</div>
                <div class="journal-author-tag">oleh ${j.bookAuthor}</div>
              </div>
              <div>${statusBadge}</div>
            </div>

            <div class="journal-meta-row">
              <span class="journal-meta-item">👤 <strong>${j.studentName}</strong></span>
              <span class="journal-meta-item">🏫 <strong class="badge-class-tag">${j.studentClass}</strong></span>
              <span class="journal-meta-item">📅 ${j.dateRead}</span>
              <span class="journal-meta-item" style="color:#f59e0b;">${stars}</span>
            </div>

            <div class="journal-summary-box">
              <p>${j.summary}</p>
            </div>

            ${j.moralValue ? `
              <div class="journal-moral-box">
                <strong>Hikmah:</strong> ${j.moralValue}
              </div>
            ` : ""}

            ${j.teacherFeedback ? `
              <div class="teacher-feedback-card ${j.status === 'revision' ? 'revision' : ''}">
                <div class="teacher-feedback-head">
                  <span>Catatan Persetujuan: ${j.teacherName || ""}</span>
                  ${j.teacherScore != null ? `<span class="teacher-score-badge">${j.teacherScore}/100</span>` : ""}
                </div>
                <div class="teacher-feedback-body">${j.teacherFeedback}</div>
              </div>
            ` : ""}
          </div>

          <div class="journal-footer-actions">
            <button class="btn btn-secondary btn-sm" onclick="JournalModule.openDetailModal('${j.id}')">
              Lihat Rinci
            </button>
            <div style="display: flex; gap: 6px;">
              ${isOwner && j.status === 'revision' ? `
                <button class="btn btn-warning btn-sm" onclick="JournalModule.openEditModal('${j.id}')">
                  Edit
                </button>
              ` : ""}
              ${isOwner || currentUser.role === 'admin' ? `
                <button class="btn btn-secondary btn-sm" style="color: var(--rose-600); padding: 6px 8px;" onclick="JournalModule.deleteJournal('${j.id}')" title="Hapus">
                  🗑️
                </button>
              ` : ""}
              ${canVerify ? `
                <button class="btn btn-primary btn-sm" onclick="TeacherModule.openReviewModal('${j.id}')">
                  ✏️ Setujui / Nilai
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
};

window.JournalModule = JournalModule;
