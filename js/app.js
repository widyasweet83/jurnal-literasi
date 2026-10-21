// ========================================================
// ORKESTRATOR UTAMA APLIKASI: SIPUS-LIT SMAN 1 BATU
// State Aplikasi, Tab Switching, Role Switcher, & Toast
// ========================================================

class App {
  constructor() {
    this.currentTab = "journals"; // journals, library, teacher, leaderboard, admin
  }

  init() {
    // Inisialisasi Layanan Firebase Database Realtime
    if (window.firebaseService) {
      window.firebaseService.init();
    }

    // Inisialisasi modul
    window.JournalModule.init();
    window.LibraryModule.init();
    window.TeacherModule.init();
    window.AdminModule.init();
    window.StudentsModule.init();
    if (window.ActivitiesModule) {
      window.ActivitiesModule.init();
    }
    if (window.GalleryModule) {
      window.GalleryModule.init();
    }

    this.bindGlobalEvents();
    this.renderAll();
  }

  bindGlobalEvents() {
    // Role Switcher buttons
    const roleBtns = document.querySelectorAll(".role-btn");
    roleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.dataset.userid;
        if (userId) {
          window.storage.setCurrentUser(userId);
          const user = window.storage.getCurrentUser();
          
          // Sesuaikan tab awal berdasarkan role baru
          if (user.role === "guru") {
            this.currentTab = "teacher";
          } else if (user.role === "admin") {
            this.currentTab = "admin";
          } else {
            this.currentTab = "journals";
          }

          this.showToast(`Beralih ke mode akun: ${user.name} (${user.role.toUpperCase()})`);
          this.renderAll();
        }
      });
    });

    // Tab Navigation buttons
    const navItems = document.querySelectorAll(".nav-item-btn");
    navItems.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Close modals on overlay click or esc key
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.active").forEach(m => {
          this.closeModal(m.id);
        });
      }
    });

    // Journal status filter
    const journalFilter = document.getElementById("selectJournalStatus");
    if (journalFilter) {
      journalFilter.addEventListener("change", () => {
        this.renderJournalsTab();
      });
    }

    // Journal search input
    const journalSearch = document.getElementById("searchJournalInput");
    if (journalSearch) {
      journalSearch.addEventListener("input", () => {
        this.renderJournalsTab();
      });
    }

    // Firebase Configuration Form
    const formFirebase = document.getElementById("formFirebaseConfig");
    if (formFirebase) {
      formFirebase.addEventListener("submit", (e) => {
        e.preventDefault();
        const rawCode = document.getElementById("fbRawConfigInput")?.value?.trim();
        let configToSave = null;

        if (rawCode) {
          configToSave = window.firebaseService.parseConfigString(rawCode);
          if (!configToSave) {
            this.showToast("Format teks konfigurasi tidak valid. Periksa kembali cuplikan kode Firebase Anda.", "error");
            return;
          }
        } else {
          const apiKey = document.getElementById("fbApiKey")?.value?.trim();
          const authDomain = document.getElementById("fbAuthDomain")?.value?.trim();
          const databaseURL = document.getElementById("fbDatabaseURL")?.value?.trim();
          const projectId = document.getElementById("fbProjectId")?.value?.trim();
          const storageBucket = document.getElementById("fbStorageBucket")?.value?.trim();
          const messagingSenderId = document.getElementById("fbMessagingSenderId")?.value?.trim();
          const appId = document.getElementById("fbAppId")?.value?.trim();

          if (!apiKey || (!databaseURL && !projectId)) {
            this.showToast("Mohon lengkapi minimal API Key dan Database URL / Project ID.", "error");
            return;
          }

          configToSave = { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId };
        }

        window.firebaseService.saveConfig(configToSave);
      });
    }

    // Firebase Sync Buttons
    const btnSyncCloud = document.getElementById("btnUploadToFirebase");
    if (btnSyncCloud) {
      btnSyncCloud.addEventListener("click", () => {
        if (confirm("Upload seluruh data perpustakaan lokal saat ini ke cloud Firebase? Data di cloud akan diperbarui.")) {
          window.firebaseService.uploadLocalData(window.storage.data, true);
        }
      });
    }

    const btnFetchCloud = document.getElementById("btnFetchFromFirebase");
    if (btnFetchCloud) {
      btnFetchCloud.addEventListener("click", () => {
        if (confirm("Tarik data dari cloud Firebase untuk menimpa data di browser ini?")) {
          window.firebaseService.fetchRemoteData();
        }
      });
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update active nav button
    document.querySelectorAll(".nav-item-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Toggle tab panels
    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.style.display = panel.id === `tab-${tabName}` ? "block" : "none";
    });

    // Render content for this tab
    if (tabName === "journals") {
      this.renderJournalsTab();
    } else if (tabName === "activities") {
      if (window.ActivitiesModule) window.ActivitiesModule.renderActivities();
    } else if (tabName === "gallery") {
      if (window.GalleryModule) window.GalleryModule.renderGallery();
    } else if (tabName === "library") {
      window.LibraryModule.renderCatalog();
    } else if (tabName === "teacher") {
      window.TeacherModule.renderVerificationList();
    } else if (tabName === "students") {
      window.StudentsModule.render();
    } else if (tabName === "leaderboard") {
      this.renderLeaderboard();
    } else if (tabName === "admin") {
      window.AdminModule.renderAdminDashboard();
    }
  }

  renderAll() {
    this.updateUserHeader();
    this.updateNavVisibility();
    this.renderHeroBanner();
    this.switchTab(this.currentTab);
  }

  updateUserHeader() {
    const user = window.storage.getCurrentUser();
    
    // Update role buttons active state
    document.querySelectorAll(".role-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.userid === user.id);
    });

    // Update user info badge in top right
    const avatarEl = document.getElementById("headerUserAvatar");
    const nameEl = document.getElementById("headerUserName");
    const roleTagEl = document.getElementById("headerUserRole");

    if (avatarEl) avatarEl.textContent = user.avatar || "👤";
    if (nameEl) nameEl.textContent = user.name;
    if (roleTagEl) {
      if (user.role === "siswa") {
        roleTagEl.textContent = `${user.kelas} • ${user.points} Poin`;
      } else if (user.role === "guru") {
        roleTagEl.textContent = "Guru Pembina GLS";
      } else if (user.id === "admin-2") {
        roleTagEl.textContent = "Kepala Perpustakaan SMABA";
      } else {
        roleTagEl.textContent = "Pustakawan Pelaksana SMABA";
      }
    }
  }

  updateNavVisibility() {
    const user = window.storage.getCurrentUser();
    const btnTeacher = document.querySelector('.nav-item-btn[data-tab="teacher"]');
    const btnAdmin = document.querySelector('.nav-item-btn[data-tab="admin"]');
    const teacherBadge = document.getElementById("teacherNavBadge");

    if (btnTeacher) {
      btnTeacher.style.display = (user.role === "guru" || user.role === "admin") ? "inline-flex" : "none";
    }
    if (btnAdmin) {
      btnAdmin.style.display = (user.role === "admin") ? "inline-flex" : "none";
    }

    if (teacherBadge) {
      const stats = window.storage.getTeacherStats();
      teacherBadge.textContent = stats.totalToVerify;
      teacherBadge.style.display = stats.totalToVerify > 0 ? "inline-block" : "none";
    }
  }

  renderHeroBanner() {
    const banner = document.getElementById("heroBannerContainer");
    if (!banner) return;

    const user = window.storage.getCurrentUser();

    if (user.role === "siswa") {
      const stats = window.storage.getStudentStats(user.id);
      banner.innerHTML = `
        <div class="hero-banner">
          <div class="hero-banner-inner">
            <div class="hero-text">
              <span class="hero-tag" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(52, 211, 153, 0.4); margin-bottom: 8px;">
                🏆 ${user.level} • SMAN 1 BATU
              </span>
              <h2>Halo, ${user.name}! 👋</h2>
              <p>
                Mari lanjutkan pembiasaan membaca hari ini. Kamu telah membaca <strong>${stats.totalPagesRead} halaman</strong> dari <strong>${stats.totalJournals} buku</strong> dan mengumpulkan <strong>${user.points} poin literasi</strong>.
              </p>
              <div class="hero-tags">
                <span class="hero-tag">🎯 Target Bulanan: ${stats.approvedJournals}/${user.targetMonthlyBooks || 3} Buku</span>
                <span class="hero-tag">⭐ Rata-rata Nilai: ${stats.avgScore || 0}/100</span>
                <span class="hero-tag">🏫 Kelas: ${user.kelas}</span>
                <span class="hero-tag">📚 Buku Dipinjam: ${stats.activeBorrowsCount} Buku</span>
              </div>
            </div>
            <div class="hero-actions">
              <button class="btn btn-success" onclick="JournalModule.openCreateModal()">
                ✍️ Tulis Jurnal Literasi
              </button>
              <button class="btn btn-secondary" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);" onclick="PrintModule.openPrintPreview('${user.id}')">
                🖨️ Cetak Lembar Portofolio
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (user.role === "guru") {
      const stats = window.storage.getTeacherStats();
      banner.innerHTML = `
        <div class="hero-banner" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%);">
          <div class="hero-banner-inner">
            <div class="hero-text">
              <span class="hero-tag" style="background: rgba(59, 130, 246, 0.2); border-color: rgba(147, 197, 253, 0.4); margin-bottom: 8px;">
                👩‍🏫 PORTAL GURU & WALI KELAS • SMAN 1 BATU
              </span>
              <h2>Selamat Datang, ${user.name}!</h2>
              <p>
                Terdapat <strong>${stats.totalToVerify} jurnal literasi siswa</strong> yang sedang menunggu pemeriksaan dan penilaian Anda. Terima kasih telah mendampingi budaya literasi siswa SMABA.
              </p>
              <div class="hero-tags">
                <span class="hero-tag">⏳ Menunggu Validasi: ${stats.totalToVerify} Jurnal</span>
                <span class="hero-tag">✓ Disetujui: ${stats.totalApproved} Jurnal</span>
                <span class="hero-tag">⚠️ Perlu Revisi: ${stats.totalRevision} Jurnal</span>
              </div>
            </div>
            <div class="hero-actions">
              <button class="btn btn-primary" onclick="TeacherModule.approveAllPending()">
                ✓ Setujui Semua Pending
              </button>
              <button class="btn btn-secondary" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);" onclick="TeacherModule.exportToCsv()">
                📊 Unduh Rekap Nilai CSV
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      const stats = window.storage.getLibraryStats();
      banner.innerHTML = `
        <div class="hero-banner" style="background: linear-gradient(135deg, #0f172a 0%, #312e81 60%, #1e1b4b 100%);">
          <div class="hero-banner-inner">
            <div class="hero-text">
              <span class="hero-tag" style="background: rgba(147, 51, 234, 0.2); border-color: rgba(192, 132, 252, 0.4); margin-bottom: 8px;">
                🏛️ SISTEM ADMINISTRASI PERPUSTAKAAN SMABA
              </span>
              <h2>Panel Pustakawan: ${user.name}</h2>
              <p>
                Kelola koleksi buku fisik, sirkulasi peminjaman siswa, pantau eksemplar buku, dan cadangkan data literasi sekolah.
              </p>
              <div class="hero-tags">
                <span class="hero-tag">📚 Total Koleksi: ${stats.totalBooks} Buku (${stats.totalTitles} Judul)</span>
                <span class="hero-tag">📖 Sedang Dipinjam: ${stats.borrowedBooks} Eksemplar</span>
                <span class="hero-tag">📝 Total Jurnal Siswa: ${stats.totalJournals}</span>
              </div>
            </div>
            <div class="hero-actions">
              <button class="btn btn-primary" onclick="AdminModule.openAddBookModal()">
                ➕ Tambah Koleksi Buku
              </button>
              <button class="btn btn-secondary" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);" onclick="AdminModule.exportBackup()">
                💾 Unduh Cadangan Data
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  renderJournalsTab() {
    const user = window.storage.getCurrentUser();
    const statusFilter = document.getElementById("selectJournalStatus")?.value || "all";
    const searchQuery = document.getElementById("searchJournalInput")?.value || "";

    const filterObj = {
      status: statusFilter,
      search: searchQuery
    };

    // Jika siswa, hanya tampilkan jurnal miliknya secara default di tab ini
    if (user.role === "siswa") {
      filterObj.studentId = user.id;
    }

    const journals = window.storage.getJournals(filterObj);
    window.JournalModule.renderJournalsGrid(journals, "journalsGrid");

    // Render statistik cepat untuk siswa jika ada container stats
    const statsContainer = document.getElementById("studentStatsRow");
    if (statsContainer && user.role === "siswa") {
      const stats = window.storage.getStudentStats(user.id);
      statsContainer.style.display = "grid";
      statsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon-box stat-icon-blue">📖</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalJournals}</div>
            <div class="stat-label">Total Buku Direview</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box stat-icon-green">✓</div>
          <div class="stat-info">
            <div class="stat-value">${stats.approvedJournals}</div>
            <div class="stat-label">Jurnal Disetujui Guru</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box stat-icon-gold">⭐</div>
          <div class="stat-info">
            <div class="stat-value">${stats.avgScore > 0 ? stats.avgScore : '-'}</div>
            <div class="stat-label">Rata-rata Nilai Literasi</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box stat-icon-purple">🏆</div>
          <div class="stat-info">
            <div class="stat-value">${user.points}</div>
            <div class="stat-label">Poin Literasi SMABA</div>
          </div>
        </div>
      `;
    } else if (statsContainer) {
      statsContainer.style.display = "none";
    }
  }

  renderLeaderboard() {
    const leaderboardData = window.storage.getLeaderboard();
    const podiumEl = document.getElementById("podiumContainer");
    const tableBody = document.getElementById("leaderboardTableBody");

    if (!podiumEl || !tableBody) return;

    // Podium 3 Teratas
    const top3 = leaderboardData.slice(0, 3);
    if (top3.length >= 3) {
      podiumEl.innerHTML = `
        <!-- Juara 2 -->
        <div class="podium-item">
          <div class="podium-avatar">
            ${top3[1].avatar || '👩‍🎓'}
            <div class="podium-badge-rank rank-2-badge">2</div>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">${top3[1].name.split(" ")[0]}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${top3[1].kelas}</div>
          <div class="podium-pillar pillar-2">
            <span>${top3[1].points}</span>
            <small style="font-size: 0.65rem;">POIN</small>
          </div>
        </div>

        <!-- Juara 1 -->
        <div class="podium-item">
          <div style="font-size: 1.5rem; margin-bottom: 2px;">👑</div>
          <div class="podium-avatar">
            ${top3[0].avatar || '👨‍🎓'}
            <div class="podium-badge-rank rank-1-badge">1</div>
          </div>
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-900);">${top3[0].name.split(" ")[0]}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${top3[0].kelas}</div>
          <div class="podium-pillar pillar-1">
            <span>${top3[0].points}</span>
            <small style="font-size: 0.65rem;">POIN</small>
          </div>
        </div>

        <!-- Juara 3 -->
        <div class="podium-item">
          <div class="podium-avatar">
            ${top3[2].avatar || '🧑‍🎓'}
            <div class="podium-badge-rank rank-3-badge">3</div>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">${top3[2].name.split(" ")[0]}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${top3[2].kelas}</div>
          <div class="podium-pillar pillar-3">
            <span>${top3[2].points}</span>
            <small style="font-size: 0.65rem;">POIN</small>
          </div>
        </div>
      `;
    }

    // Tabel Peringkat Lengkap
    tableBody.innerHTML = leaderboardData.map((s, idx) => `
      <tr>
        <td style="font-weight: 800; color: ${idx === 0 ? '#f59e0b' : (idx === 1 ? '#64748b' : (idx === 2 ? '#b45309' : '#0f172a'))};">
          #${idx + 1}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.3rem;">${s.avatar || '👤'}</div>
            <div>
              <div style="font-weight: 700; color: var(--primary-900);">${s.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">NISN: ${s.nisn}</div>
            </div>
          </div>
        </td>
        <td><strong>${s.kelas}</strong></td>
        <td>
          <span class="badge-status badge-approved" style="font-size: 0.75rem;">
            ${s.level}
          </span>
        </td>
        <td><strong>${s.stats.approvedJournals}</strong> Jurnal (${s.stats.totalPagesRead} Hal)</td>
        <td style="font-weight: 800; color: var(--primary-700); font-size: 1rem;">
          ${s.points} Pts
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="PrintModule.openPrintPreview('${s.id}')" title="Cetak Rapor Siswa">
            🖨️
          </button>
        </td>
      </tr>
    `).join("");
  }

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "toast-error" : ""}`;
    toast.innerHTML = `
      <span>${type === "error" ? "❌" : "✓"}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 20);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instance global
window.app = new App();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
