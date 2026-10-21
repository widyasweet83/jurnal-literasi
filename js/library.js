// ========================================================
// PERPUSTAKAAN & KATALOG BUKU SMABA: MODULE LOGIC
// Pencarian OPAC, Peminjaman, Pengembalian, dan Detail Buku
// ========================================================

const LibraryModule = {
  currentCategory: "all",
  searchQuery: "",

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const searchInput = document.getElementById("searchBookInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderCatalog();
      });
    }

    const categorySelect = document.getElementById("selectBookCategory");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.currentCategory = e.target.value;
        this.renderCatalog();
      });
    }
  },

  renderCatalog() {
    const container = document.getElementById("booksGrid");
    if (!container) return;

    const books = window.storage.getBooks(this.searchQuery, this.currentCategory);
    const currentUser = window.storage.getCurrentUser();

    if (books.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
          <h4 style="color: var(--primary-900); margin-bottom: 4px;">Buku Tidak Ditemukan</h4>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Coba gunakan kata kunci pencarian atau kategori lain.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = books.map(book => {
      const isAvailable = book.stockAvailable > 0;
      return `
        <div class="book-card">
          <div>
            <div class="book-cover-mock" style="background: linear-gradient(135deg, ${book.color || '#1e3a8a'}, #0f172a);">
              <div class="book-cover-icon">${book.coverIcon || '📚'}</div>
              <div class="book-cover-title">${book.title}</div>
            </div>

            <span class="book-category-pill">${book.category}</span>
            <h4 class="book-title">${book.title}</h4>
            <div class="book-author">Oleh <strong>${book.author}</strong></div>

            <div class="book-specs-row">
              <span>📍 ${book.shelf}</span>
              <span class="stock-tag ${isAvailable ? 'stock-available' : 'stock-empty'}">
                ${isAvailable ? `Tersedia: ${book.stockAvailable}` : 'Sedang Dipinjam'}
              </span>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="LibraryModule.openBookDetail('${book.id}')">
              Detail
            </button>
            ${currentUser.role === 'siswa' ? `
              <button class="btn btn-primary btn-sm" style="flex: 1;" ${!isAvailable ? 'disabled' : ''} onclick="LibraryModule.borrowBook('${book.id}')">
                Pinjam
              </button>
            ` : ""}
            ${currentUser.role === 'admin' ? `
              <button class="btn btn-secondary btn-sm" onclick="AdminModule.openEditBookModal('${book.id}')" title="Edit Buku">
                ✏️
              </button>
            ` : ""}
          </div>
        </div>
      `;
    }).join("");
  },

  openBookDetail(bookId) {
    const book = window.storage.getBookById(bookId);
    if (!book) return;

    const modal = document.getElementById("modalBookDetail");
    const content = document.getElementById("bookDetailContent");
    if (!modal || !content) return;

    const currentUser = window.storage.getCurrentUser();
    const isAvailable = book.stockAvailable > 0;

    content.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px;">
        <div class="book-cover-mock" style="width: 140px; height: 190px; flex-shrink: 0; background: linear-gradient(135deg, ${book.color || '#1e3a8a'}, #0f172a);">
          <div class="book-cover-icon">${book.coverIcon || '📚'}</div>
          <div class="book-cover-title" style="font-size: 0.8rem;">${book.title}</div>
        </div>

        <div style="flex: 1;">
          <span class="book-category-pill">${book.category}</span>
          <h3 style="font-size: 1.4rem; color: var(--primary-900); margin-top: 4px; line-height: 1.25;">${book.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Penulis: <strong>${book.author}</strong></p>

          <table style="width: 100%; font-size: 0.82rem; border-collapse: collapse;">
            <tr><td style="padding: 3px 0; color: #64748b; width: 110px;">Penerbit</td><td><strong>${book.publisher} (${book.year})</strong></td></tr>
            <tr><td style="padding: 3px 0; color: #64748b;">Nomor Panggil</td><td><code style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${book.callNumber}</code></td></tr>
            <tr><td style="padding: 3px 0; color: #64748b;">Lokasi Rak</td><td>📍 ${book.shelf}</td></tr>
            <tr><td style="padding: 3px 0; color: #64748b;">Jumlah Halaman</td><td>📖 ${book.pages} halaman</td></tr>
            <tr><td style="padding: 3px 0; color: #64748b;">ISBN</td><td>${book.isbn}</td></tr>
            <tr><td style="padding: 3px 0; color: #64748b;">Status Fisik</td><td>
              <span class="stock-tag ${isAvailable ? 'stock-available' : 'stock-empty'}">
                ${isAvailable ? `Tersedia (${book.stockAvailable} dari ${book.stockTotal} buku)` : 'Semua eksemplar sedang dipinjam'}
              </span>
            </td></tr>
          </table>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--primary-900); margin-bottom: 8px;">Sinopsis & Gambaran Buku:</h4>
        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); font-size: 0.88rem; line-height: 1.6; color: #334155;">
          ${book.synopsis}
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 14px;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal('modalBookDetail')">Tutup</button>
        ${currentUser.role === 'siswa' ? `
          <button class="btn btn-success btn-sm" onclick="window.app.closeModal('modalBookDetail'); JournalModule.openCreateModal(window.storage.getBookById('${book.id}'))">
            ✍️ Buat Jurnal untuk Buku Ini
          </button>
          <button class="btn btn-primary btn-sm" ${!isAvailable ? 'disabled' : ''} onclick="LibraryModule.borrowBook('${book.id}')">
            📖 Pinjam Buku Fisik
          </button>
        ` : ""}
      </div>
    `;

    window.app.openModal("modalBookDetail");
  },

  borrowBook(bookId) {
    const currentUser = window.storage.getCurrentUser();
    if (currentUser.role !== "siswa") {
      window.app.showToast("Hanya akun siswa yang dapat meminjam buku fisik.", "error");
      return;
    }

    try {
      const borrow = window.storage.borrowBook(currentUser.id, bookId);
      window.app.showToast(`Buku berhasil dipinjam! Batas waktu pengembalian: ${borrow.dueDate}`);
      window.app.closeModal("modalBookDetail");
      window.app.renderAll();
    } catch (err) {
      window.app.showToast(err.message, "error");
    }
  },

  returnBook(borrowId) {
    try {
      window.storage.returnBook(borrowId);
      window.app.showToast("Buku berhasil dikembalikan ke perpustakaan. Terima kasih!");
      window.app.renderAll();
    } catch (err) {
      window.app.showToast(err.message, "error");
    }
  }
};

window.LibraryModule = LibraryModule;
