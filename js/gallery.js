// ========================================================
// GALERI FOTO & VIDEO: MODULE LOGIC
// Dokumentasi Kegiatan Internal & Eksternal SMAN 1 Batu
// Sinkronisasi & Tautan Google Drive: perpustakaan@sman1batu.sch.id
// ========================================================

const GalleryModule = {
  currentTypeFilter: "all",       // all, photo, video
  currentCategoryFilter: "all",   // all, or specific category
  searchQuery: "",
  stagedMediaDataUrl: "",         // DataURL from local file upload preview
  stagedMediaType: "photo",

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Type filter tabs (Semua Media, Foto, Video)
    const typeButtons = document.querySelectorAll(".gallery-type-btn");
    typeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        typeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentTypeFilter = btn.dataset.type;
        this.renderGallery();
      });
    });

    // Category filter select
    const catSelect = document.getElementById("selectGalleryCategory");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.currentCategoryFilter = e.target.value;
        this.renderGallery();
      });
    }

    // Search input
    const searchInput = document.getElementById("searchGalleryInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderGallery();
      });
    }

    // File input preview on local upload
    const fileInput = document.getElementById("mediaFileInput");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => this.handleLocalFileSelected(e));
    }

    // Media type select toggle in form
    const mediaTypeSelect = document.getElementById("uploadMediaType");
    if (mediaTypeSelect) {
      mediaTypeSelect.addEventListener("change", (e) => {
        const type = e.target.value;
        const durationGroup = document.getElementById("groupVideoDuration");
        if (durationGroup) {
          durationGroup.style.display = type === "video" ? "block" : "none";
        }
      });
    }

    // Form Upload Submit
    const formUpload = document.getElementById("formUploadMedia");
    if (formUpload) {
      formUpload.addEventListener("submit", (e) => this.handleUploadSubmit(e));
    }
  },

  renderGallery() {
    const container = document.getElementById("galleryGrid");
    if (!container) return;

    const mediaList = window.storage.getGalleryMedia({
      type: this.currentTypeFilter,
      category: this.currentCategoryFilter,
      search: this.searchQuery
    });

    const currentUser = window.storage.getCurrentUser();
    const canManage = currentUser.role === "guru" || currentUser.role === "admin";

    // Update Counter Badges
    const allItems = window.storage.getGalleryMedia();
    const countAll = allItems.length;
    const countPhoto = allItems.filter(m => m.type === "photo").length;
    const countVideo = allItems.filter(m => m.type === "video").length;

    const badgeAll = document.getElementById("galleryCountAll");
    const badgePhoto = document.getElementById("galleryCountPhoto");
    const badgeVideo = document.getElementById("galleryCountVideo");

    if (badgeAll) badgeAll.textContent = countAll;
    if (badgePhoto) badgePhoto.textContent = countPhoto;
    if (badgeVideo) badgeVideo.textContent = countVideo;

    if (mediaList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 10px;">📸</div>
          <h4 style="color: var(--primary-900); margin-bottom: 6px;">Belum Ada Dokumentasi yang Sesuai</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 480px; margin: 0 auto 16px;">
            Tidak ditemukan foto atau video untuk kriteria pencarian ini. Anda dapat mengunggah dokumentasi kegiatan baru yang terhubung ke Google Drive sekolah.
          </p>
          <button class="btn btn-primary btn-sm" onclick="GalleryModule.openUploadModal()">
            ➕ Unggah Foto / Video Sekarang
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = mediaList.map(item => {
      const isVideo = item.type === "video";
      const driveUrl = item.driveLink || "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id";
      const thumbnailSrc = item.thumbnail || (isVideo ? "assets/kegiatan_internal.jpg" : "assets/kegiatan_internal.jpg");
      
      const isOwner = currentUser.name === item.uploader;
      const showDelete = canManage || isOwner;

      return `
        <div class="gallery-card">
          <!-- Thumbnail Area -->
          <div class="gallery-thumb-wrap" onclick="GalleryModule.openViewer('${item.id}')">
            <img src="${thumbnailSrc}" alt="${item.title}" class="gallery-thumb-img" onerror="this.src='assets/kegiatan_internal.jpg'">
            
            <div class="gallery-type-pill ${isVideo ? 'pill-video' : 'pill-photo'}">
              ${isVideo ? '🎥 VIDEO' : '📸 FOTO'}
            </div>

            ${isVideo && item.duration ? `
              <div class="gallery-duration-pill">
                ⏱️ ${item.duration}
              </div>
            ` : ""}

            ${isVideo ? `
              <div class="gallery-play-btn">
                <span>▶</span>
              </div>
            ` : `
              <div class="gallery-zoom-icon">
                <span>🔍</span>
              </div>
            `}
          </div>

          <!-- Body Content -->
          <div class="gallery-card-body">
            <div class="gallery-cat-tag">${item.category}</div>
            <h4 class="gallery-card-title" onclick="GalleryModule.openViewer('${item.id}')" title="${item.title}">
              ${item.title}
            </h4>

            <p class="gallery-card-desc">
              ${item.description || "Dokumentasi kegiatan literasi dan perbukuan SMAN 1 Batu."}
            </p>

            <div class="gallery-meta-row">
              <div class="gallery-meta-uploader">
                <span style="font-size: 0.95rem;">👤</span>
                <span>${item.uploader}</span>
              </div>
              <div class="gallery-meta-date">
                📅 ${item.date}
              </div>
            </div>

            <!-- Google Drive Indicator Box -->
            <div class="gallery-drive-box">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.1rem;">☁️</span>
                <div style="line-height: 1.2;">
                  <span style="font-size: 0.72rem; color: #0284c7; font-weight: 700; text-transform: uppercase;">Google Drive Resmi</span><br>
                  <span style="font-size: 0.76rem; color: #475569;">perpustakaan@sman1batu.sch.id</span>
                </div>
              </div>
              <a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="btn-drive-link" title="Buka berkas di Google Drive">
                Buka Drive ↗
              </a>
            </div>
          </div>

          <!-- Card Footer Action Buttons -->
          <div class="gallery-card-footer">
            <button class="btn btn-secondary btn-sm" onclick="GalleryModule.openViewer('${item.id}')">
              ${isVideo ? '▶️ Putar Video' : '👁️ Lihat Foto Penuh'}
            </button>

            <div style="display: flex; gap: 6px;">
              <a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Tautan Google Drive">
                🔗 Drive
              </a>
              ${showDelete ? `
                <button class="btn btn-secondary btn-sm" style="color: var(--rose-600);" onclick="GalleryModule.deleteMedia('${item.id}')" title="Hapus Dokumentasi">
                  🗑️
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  openUploadModal() {
    const form = document.getElementById("formUploadMedia");
    if (!form) return;
    form.reset();

    const currentUser = window.storage.getCurrentUser();
    document.getElementById("uploadUploader").value = currentUser.name + (currentUser.role === 'siswa' ? ` (${currentUser.kelas})` : "");
    document.getElementById("uploadDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("uploadDriveLink").value = "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id";
    
    this.stagedMediaDataUrl = "";
    this.stagedMediaType = "photo";

    const previewContainer = document.getElementById("uploadPreviewContainer");
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="border: 2px dashed #cbd5e1; border-radius: var(--radius-md); padding: 24px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 6px;">📁</div>
          <div style="font-weight: 600; color: #334155; font-size: 0.88rem;">Pilih berkas foto atau video dari perangkat Anda</div>
          <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Format Foto (JPG, PNG, WebP) atau Video (MP4, WebM)</div>
        </div>
      `;
    }

    const durationGroup = document.getElementById("groupVideoDuration");
    if (durationGroup) {
      durationGroup.style.display = "none";
    }

    window.app.openModal("modalUploadMedia");
  },

  handleLocalFileSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const previewContainer = document.getElementById("uploadPreviewContainer");
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    const mediaTypeSelect = document.getElementById("uploadMediaType");
    const durationGroup = document.getElementById("groupVideoDuration");

    if (isVideo) {
      if (mediaTypeSelect) mediaTypeSelect.value = "video";
      if (durationGroup) durationGroup.style.display = "block";
      this.stagedMediaType = "video";
    } else {
      if (mediaTypeSelect) mediaTypeSelect.value = "photo";
      if (durationGroup) durationGroup.style.display = "none";
      this.stagedMediaType = "photo";
    }

    // Default filename to title if empty
    const titleInput = document.getElementById("uploadTitle");
    if (titleInput && !titleInput.value) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }

    // Read file for immediate local preview
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      this.stagedMediaDataUrl = loadEvt.target.result;

      if (previewContainer) {
        if (isVideo) {
          previewContainer.innerHTML = `
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; max-height: 200px; background: #000; text-align: center;">
              <video src="${this.stagedMediaDataUrl}" controls style="max-height: 200px; max-width: 100%; vertical-align: middle;"></video>
              <div style="background: rgba(15, 23, 42, 0.85); color: #fff; font-size: 0.75rem; padding: 4px 8px;">
                🎥 File Video Siap Diunggah (${(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          `;
        } else {
          previewContainer.innerHTML = `
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; max-height: 200px; text-align: center; background: #f8fafc; border: 1px solid var(--border-color);">
              <img src="${this.stagedMediaDataUrl}" alt="Preview" style="max-height: 200px; max-width: 100%; object-fit: contain;">
              <div style="background: rgba(15, 23, 42, 0.85); color: #fff; font-size: 0.75rem; padding: 4px 8px;">
                📸 File Foto Siap Diunggah (${(file.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          `;
        }
      }
    };

    reader.readAsDataURL(file);
  },

  pasteDefaultDriveLink() {
    const input = document.getElementById("uploadDriveLink");
    if (input) {
      input.value = "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id";
      window.app.showToast("Tautan direktori Google Drive perpustakaan@sman1batu.sch.id diterapkan!");
    }
  },

  handleUploadSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("uploadTitle").value.trim();
    const type = document.getElementById("uploadMediaType").value;
    const category = document.getElementById("uploadCategory").value;
    const date = document.getElementById("uploadDate").value;
    const uploader = document.getElementById("uploadUploader").value.trim();
    const driveLink = document.getElementById("uploadDriveLink").value.trim() || "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id";
    const duration = document.getElementById("uploadDuration") ? document.getElementById("uploadDuration").value.trim() : "";
    const description = document.getElementById("uploadDescription").value.trim();

    if (!title) {
      window.app.showToast("Judul dokumentasi wajib diisi!", "error");
      return;
    }

    const currentUser = window.storage.getCurrentUser();

    // Use staged file DataURL or fallback to realistic demo photography asset
    let mediaUrl = this.stagedMediaDataUrl;
    let thumbnail = this.stagedMediaDataUrl;

    if (!mediaUrl) {
      if (type === "video") {
        mediaUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        thumbnail = category.includes("Eksternal") ? "assets/kegiatan_eksternal.jpg" : "assets/kegiatan_internal.jpg";
      } else {
        mediaUrl = category.includes("Eksternal") ? "assets/kegiatan_eksternal.jpg" : "assets/kegiatan_internal.jpg";
        thumbnail = mediaUrl;
      }
    }

    const payload = {
      title,
      type,
      category,
      date: date || new Date().toISOString().split("T")[0],
      uploader: uploader || currentUser.name,
      uploaderRole: currentUser.role,
      thumbnail: thumbnail,
      mediaUrl: mediaUrl,
      driveLink: driveLink,
      driveAccount: "perpustakaan@sman1batu.sch.id",
      description: description,
      duration: type === "video" ? (duration || "03:15") : ""
    };

    window.storage.addMedia(payload);

    window.app.closeModal("modalUploadMedia");
    window.app.showToast(`Dokumentasi ${type === 'video' ? 'video' : 'foto'} berhasil disimpan dan ditautkan ke Google Drive perpustakaan@sman1batu.sch.id!`);
    this.renderGallery();
  },

  openViewer(mediaId) {
    const item = window.storage.getMediaById(mediaId);
    if (!item) return;

    const modal = document.getElementById("modalMediaViewer");
    const container = document.getElementById("mediaViewerContent");
    if (!modal || !container) return;

    const isVideo = item.type === "video";
    const driveUrl = item.driveLink || "https://drive.google.com/drive/u/0/search?q=owner:perpustakaan@sman1batu.sch.id";

    container.innerHTML = `
      <div style="background: #090d16; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center;">
        ${isVideo ? `
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000;">
            <video src="${item.mediaUrl}" controls autoplay style="position: absolute; top:0; left: 0; width: 100%; height: 100%; object-fit: contain;">
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          </div>
        ` : `
          <div style="max-height: 520px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #050811;">
            <img src="${item.mediaUrl}" alt="${item.title}" style="max-width: 100%; max-height: 520px; object-fit: contain;" onerror="this.src='assets/kegiatan_internal.jpg'">
          </div>
        `}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 14px; flex-wrap: wrap;">
        <div>
          <span class="gallery-cat-tag" style="margin-bottom: 4px; display: inline-block;">${item.category}</span>
          <h3 style="font-size: 1.3rem; color: var(--primary-900); font-weight: 700; line-height: 1.3;">
            ${item.title}
          </h3>
        </div>

        <span class="gallery-type-pill ${isVideo ? 'pill-video' : 'pill-photo'}" style="position: static; font-size: 0.8rem; padding: 6px 12px;">
          ${isVideo ? '🎥 VIDEO KEGIATAN' : '📸 FOTO DOKUMENTASI'} ${item.duration ? `(${item.duration})` : ''}
        </span>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 18px;">
        <p style="font-size: 0.9rem; color: #334155; line-height: 1.6; margin-bottom: 12px;">
          ${item.description || 'Tidak ada deskripsi rincian untuk dokumentasi ini.'}
        </p>

        <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 0.82rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          <div>👤 <strong>Pengunggah:</strong> ${item.uploader}</div>
          <div>📅 <strong>Tanggal Dokumentasi:</strong> ${item.date}</div>
          <div>🏛️ <strong>Lembaga:</strong> SMAN 1 Batu (SMABA)</div>
        </div>
      </div>

      <!-- Cloud Google Drive Banner in Viewer -->
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.8rem;">☁️</div>
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #1e40af;">Tersimpan di Google Drive Resmi Sekolah</div>
            <div style="font-size: 0.78rem; color: #3b82f6;">Akun: <strong>perpustakaan@sman1batu.sch.id</strong></div>
          </div>
        </div>

        <a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
          <span>📂 Buka File di Google Drive</span>
          <span>↗</span>
        </a>
      </div>
    `;

    window.app.openModal("modalMediaViewer");
  },

  deleteMedia(mediaId) {
    const item = window.storage.getMediaById(mediaId);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus dokumentasi "${item.title}"?`)) {
      window.storage.deleteMedia(mediaId);
      window.app.showToast("Dokumentasi foto/video berhasil dihapus.");
      this.renderGallery();
    }
  },

  exportGalleryCsv() {
    const mediaList = window.storage.getGalleryMedia({
      type: this.currentTypeFilter,
      category: this.currentCategoryFilter,
      search: this.searchQuery
    });

    if (mediaList.length === 0) {
      window.app.showToast("Tidak ada data dokumentasi untuk diekspor.", "error");
      return;
    }

    let csv = "ID,Tipe Media,Judul Dokumentasi,Kategori Kegiatan,Tanggal,Pengunggah,Tautan Google Drive,Akun Drive,Keterangan\n";
    mediaList.forEach(m => {
      const clean = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
      csv += [
        m.id,
        m.type.toUpperCase(),
        clean(m.title),
        clean(m.category),
        m.date,
        clean(m.uploader),
        clean(m.driveLink),
        clean(m.driveAccount || "perpustakaan@sman1batu.sch.id"),
        clean(m.description)
      ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Galeri_Dokumentasi_Perpustakaan_SMAN1Batu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.app.showToast("Daftar galeri dokumentasi & link Google Drive berhasil diunduh dalam format CSV!");
  }
};

window.GalleryModule = GalleryModule;
