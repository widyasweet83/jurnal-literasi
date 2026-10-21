// ========================================================
// MANAJEMEN PUSTAKAWAN & ADMIN: MODULE LOGIC
// Master Data Buku, Sirkulasi, dan Backup / Restore
// ========================================================

const AdminModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Form Buku submit
    const formBook = document.getElementById("formBookAdmin");
    if (formBook) {
      formBook.addEventListener("submit", (e) => this.handleBookSubmit(e));
    }

    // Backup download
    const btnBackup = document.getElementById("btnExportBackup");
    if (btnBackup) {
      btnBackup.addEventListener("click", () => this.exportBackup());
    }

    // Restore upload
    const inputRestore = document.getElementById("inputRestoreFile");
    if (inputRestore) {
      inputRestore.addEventListener("change", (e) => this.handleRestoreFile(e));
    }

    // Reset database
    const btnReset = document.getElementById("btnResetData");
    if (btnReset) {
      btnReset.addEventListener("click", () => this.resetData());
    }
  },

  renderAdminDashboard() {
    this.renderStats();
    this.renderBooksTable();
    this.renderCirculationTable();
    if (window.firebaseService) {
      window.firebaseService.updateStatusBadge();
    }
  },

  renderStats() {
    const stats = window.storage.getLibraryStats();
    const elTitles = document.getElementById("adminStatTitles");
    if (elTitles) elTitles.textContent = stats.totalTitles;

    const elTotal = document.getElementById("adminStatTotalBooks");
    if (elTotal) elTotal.textContent = stats.totalBooks;

    const elBorrowed = document.getElementById("adminStatBorrowed");
    if (elBorrowed) elBorrowed.textContent = stats.borrowedBooks;

    const elJournals = document.getElementById("adminStatJournals");
    if (elJournals) elJournals.textContent = stats.totalJournals;
  },

  renderBooksTable() {
    const container = document.getElementById("adminBooksTableBody");
    if (!container) return;

    const books = window.storage.getBooks();
    container.innerHTML = books.map((b, idx) => `
      <tr>
        <td style="font-weight: 700; color: #64748b;">${idx + 1}</td>
        <td>
          <div style="font-weight: 700; color: var(--primary-900);">${b.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${b.author} | ${b.publisher} (${b.year})</div>
        </td>
        <td><span class="book-category-pill">${b.category}</span></td>
        <td><code>${b.callNumber}</code></td>
        <td>📍 ${b.shelf}</td>
        <td>
          <strong>${b.stockAvailable}</strong> / ${b.stockTotal}
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="AdminModule.openEditBookModal('${b.id}')" title="Edit">✏️</button>
            <button class="btn btn-secondary btn-sm" style="color: var(--rose-600);" onclick="AdminModule.deleteBook('${b.id}')" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  renderCirculationTable() {
    const container = document.getElementById("adminCirculationTableBody");
    if (!container) return;

    const borrows = window.storage.getAllBorrows();
    if (borrows.length === 0) {
      container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:#64748b;">Belum ada riwayat peminjaman buku.</td></tr>`;
      return;
    }

    container.innerHTML = borrows.map(br => {
      const isReturned = br.status === "kembali";
      const statusBadge = isReturned 
        ? `<span class="badge-status badge-approved">Sudah Kembali</span>`
        : `<span class="badge-status badge-pending">Dipinjam</span>`;

      return `
        <tr>
          <td><strong>${br.studentName}</strong></td>
          <td>${br.bookTitle}</td>
          <td>${br.borrowDate}</td>
          <td><span style="color: ${!isReturned ? 'var(--gold-600)' : '#64748b'}; font-weight: 600;">${br.dueDate}</span></td>
          <td>${br.returnDate || "-"}</td>
          <td>${statusBadge}</td>
          <td>
            ${!isReturned ? `
              <button class="btn btn-success btn-sm" onclick="LibraryModule.returnBook('${br.id}')">
                Kembalikan
              </button>
            ` : "-"}
          </td>
        </tr>
      `;
    }).join("");
  },

  openAddBookModal() {
    const form = document.getElementById("formBookAdmin");
    if (!form) return;
    form.reset();
    document.getElementById("bookEditId").value = "";
    document.getElementById("modalBookAdminTitle").textContent = "Tambah Buku Baru Perpustakaan";
    window.app.openModal("modalBookAdmin");
  },

  openEditBookModal(bookId) {
    const book = window.storage.getBookById(bookId);
    if (!book) return;

    this.openAddBookModal();
    document.getElementById("modalBookAdminTitle").textContent = "Edit Buku Perpustakaan";
    document.getElementById("bookEditId").value = book.id;
    document.getElementById("adminBookTitle").value = book.title;
    document.getElementById("adminBookAuthor").value = book.author;
    document.getElementById("adminBookPublisher").value = book.publisher;
    document.getElementById("adminBookYear").value = book.year;
    document.getElementById("adminBookCategory").value = book.category;
    document.getElementById("adminBookCallNumber").value = book.callNumber;
    document.getElementById("adminBookShelf").value = book.shelf;
    document.getElementById("adminBookPages").value = book.pages;
    document.getElementById("adminBookStock").value = book.stockTotal;
    document.getElementById("adminBookIsbn").value = book.isbn;
    document.getElementById("adminBookSynopsis").value = book.synopsis;

    window.app.openModal("modalBookAdmin");
  },

  handleBookSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById("bookEditId").value;
    const title = document.getElementById("adminBookTitle").value.trim();
    const author = document.getElementById("adminBookAuthor").value.trim();
    const publisher = document.getElementById("adminBookPublisher").value.trim();
    const year = Number(document.getElementById("adminBookYear").value) || new Date().getFullYear();
    const category = document.getElementById("adminBookCategory").value;
    const callNumber = document.getElementById("adminBookCallNumber").value.trim();
    const shelf = document.getElementById("adminBookShelf").value.trim();
    const pages = Number(document.getElementById("adminBookPages").value) || 100;
    const stockTotal = Number(document.getElementById("adminBookStock").value) || 1;
    const isbn = document.getElementById("adminBookIsbn").value.trim();
    const synopsis = document.getElementById("adminBookSynopsis").value.trim();

    if (!title || !author) {
      window.app.showToast("Judul dan penulis buku wajib diisi!", "error");
      return;
    }

    const payload = {
      title,
      author,
      publisher,
      year,
      category,
      callNumber: callNumber || "800 SMABA",
      shelf: shelf || "Rak Utama",
      pages,
      stockTotal,
      isbn: isbn || "-",
      synopsis: synopsis || "Sinopsis buku perpustakaan SMAN 1 Batu."
    };

    if (editId) {
      window.storage.updateBook(editId, payload);
      window.app.showToast("Data buku berhasil diperbarui!");
    } else {
      payload.stockAvailable = stockTotal;
      window.storage.addBook(payload);
      window.app.showToast("Buku baru berhasil ditambahkan ke katalog!");
    }

    window.app.closeModal("modalBookAdmin");
    window.app.renderAll();
  },

  deleteBook(id) {
    const book = window.storage.getBookById(id);
    if (!book) return;
    if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}" dari katalog perpustakaan?`)) {
      window.storage.deleteBook(id);
      window.app.showToast("Buku berhasil dihapus dari sistem.");
      window.app.renderAll();
    }
  },

  exportBackup() {
    const jsonStr = window.storage.exportDataJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_SIPUS_LIT_SMAN1BATU_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast("Cadangan basis data berhasil diunduh!");
  },

  handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        window.storage.importDataJson(event.target.result);
        window.app.showToast("Pemulihan data cadangan berhasil!");
        window.app.renderAll();
      } catch (err) {
        window.app.showToast(err.message, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  },

  resetData() {
    if (confirm("PERINGATAN: Semua data yang Anda ubah akan dikembalikan ke data awal demo SMAN 1 Batu. Lanjutkan?")) {
      window.storage.resetData();
      window.app.showToast("Data berhasil direset ke pengaturan awal SMAN 1 Batu.");
      window.app.renderAll();
    }
  }
};

window.AdminModule = AdminModule;
