// ========================================================
// FIREBASE REALTIME DATABASE SERVICE: SIPUS-LIT SMABA
// Sinkronisasi Multi-User Online & Pengelola Basis Data Realtime
// ========================================================

const FIREBASE_STORAGE_CONFIG_KEY = "SMABA_FIREBASE_CONFIG";
const FIREBASE_DB_ROOT = "smaba_literasi";

// Konfigurasi Default Placeholder
// Anda dapat memasukkan kunci Firebase langsung di sini, atau
// lebih praktis: tempel langsung melalui tombol "Database: Mode Lokal" di header aplikasi!
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

class FirebaseService {
  constructor() {
    this.config = this.loadConfig();
    this.app = null;
    this.db = null;
    this.status = "unconfigured"; // "unconfigured" | "connecting" | "connected" | "offline" | "error"
    this.statusMessage = "Mode Lokal (Offline)";
    this.isSyncingRemote = false;
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(FIREBASE_STORAGE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Gagal membaca konfigurasi Firebase dari localStorage:", e);
    }
    return Object.assign({}, DEFAULT_FIREBASE_CONFIG);
  }

  isConfigured() {
    return !!(
      this.config &&
      this.config.apiKey &&
      this.config.apiKey.trim() !== "" &&
      (this.config.databaseURL || this.config.projectId)
    );
  }

  isReady() {
    return this.status === "connected" && this.db !== null;
  }

  init() {
    this.updateStatusBadge();

    if (!window.firebase) {
      console.warn("Firebase SDK belum terdeteksi. Berjalan dalam mode LocalStorage.");
      this.setStatus("error", "SDK Firebase tidak dapat dimuat.");
      return;
    }

    if (!this.isConfigured()) {
      this.setStatus("unconfigured", "Mode Lokal (Offline)");
      return;
    }

    this.connect();
  }

  connect() {
    this.setStatus("connecting", "Menghubungkan ke Firebase...");

    try {
      // Inisialisasi Firebase App jika belum ada
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.app();
      }

      this.db = firebase.database();

      // Monitor koneksi internet & status socket Firebase
      const connectedRef = this.db.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          this.setStatus("connected", "Online (Firebase Terhubung)");
        } else {
          if (this.status === "connected") {
            this.setStatus("offline", "Koneksi Terputus (Mode Offline)");
          }
        }
      });

      // Pasang listener real-time untuk sinkronisasi data dua arah
      this.setupRealtimeSync();

    } catch (err) {
      console.error("Gagal menghubungkan ke Firebase:", err);
      this.setStatus("error", "Error: " + err.message);
    }
  }

  setupRealtimeSync() {
    if (!this.db) return;
    const rootRef = this.db.ref(FIREBASE_DB_ROOT);

    // Listener realtime otomatis setiap ada perubahan di database cloud
    rootRef.on("value", (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === "object") {
        if (window.storage && typeof window.storage.onRemoteDataReceived === "function") {
          window.storage.onRemoteDataReceived(val);
        }
      } else {
        // Jika basis data di Firebase masih kosong (proyek baru), upload otomatis data lokal saat ini
        console.log("Database Firebase masih kosong. Mengunggah data lokal awal...");
        if (window.storage && window.storage.data) {
          this.uploadLocalData(window.storage.data, false);
        }
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      this.setStatus("error", "Izin ditolak. Periksa Rules Realtime Database.");
    });
  }

  saveData(data) {
    if (!this.isReady() || this.isSyncingRemote) {
      return Promise.resolve(false);
    }
    return this.db.ref(FIREBASE_DB_ROOT).set(data).catch((err) => {
      console.error("Gagal sinkronisasi data ke Firebase:", err);
      if (window.app) {
        window.app.showToast("Gagal menyimpan ke Firebase: " + err.message, "error");
      }
    });
  }

  uploadLocalData(data = window.storage.data, notify = true) {
    if (!this.db) {
      if (notify && window.app) {
        window.app.showToast("Firebase belum terhubung. Konfigurasikan terlebih dahulu.", "error");
      }
      return Promise.reject(new Error("Firebase belum aktif"));
    }

    this.setStatus("connecting", "Mengunggah data ke Firebase...");
    return this.db.ref(FIREBASE_DB_ROOT).set(data).then(() => {
      this.setStatus("connected", "Online (Firebase Terhubung)");
      if (notify && window.app) {
        window.app.showToast("Seluruh data lokal berhasil disinkronkan ke Firebase Cloud!");
      }
    }).catch((err) => {
      this.setStatus("error", "Gagal upload: " + err.message);
      if (notify && window.app) {
        window.app.showToast("Gagal upload ke Firebase: " + err.message, "error");
      }
    });
  }

  fetchRemoteData() {
    if (!this.db) {
      if (window.app) window.app.showToast("Firebase belum terhubung.", "error");
      return Promise.reject(new Error("Firebase belum aktif"));
    }

    return this.db.ref(FIREBASE_DB_ROOT).once("value").then((snap) => {
      const val = snap.val();
      if (val && window.storage) {
        window.storage.onRemoteDataReceived(val);
        if (window.app) window.app.showToast("Data terbaru berhasil ditarik dari Firebase!");
      } else {
        if (window.app) window.app.showToast("Data di Firebase masih kosong.", "error");
      }
    }).catch(err => {
      if (window.app) window.app.showToast("Gagal menarik data: " + err.message, "error");
    });
  }

  saveConfig(newConfig) {
    this.config = Object.assign({}, newConfig);
    localStorage.setItem(FIREBASE_STORAGE_CONFIG_KEY, JSON.stringify(this.config));
    if (window.app) {
      window.app.showToast("Konfigurasi Firebase disimpan! Memuat ulang sistem...");
    }
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  clearConfig() {
    if (confirm("Apakah Anda yakin ingin memutuskan sambungan Firebase dan kembali ke Mode Lokal?")) {
      localStorage.removeItem(FIREBASE_STORAGE_CONFIG_KEY);
      this.config = Object.assign({}, DEFAULT_FIREBASE_CONFIG);
      if (window.app) {
        window.app.showToast("Koneksi Firebase diputuskan. Beralih ke Mode Lokal...");
      }
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  }

  setStatus(status, message) {
    this.status = status;
    this.statusMessage = message;
    this.updateStatusBadge();
  }

  updateStatusBadge() {
    const badge = document.getElementById("firebaseStatusBadge");
    const dot = document.getElementById("firebaseStatusDot");
    const text = document.getElementById("firebaseStatusText");
    if (!badge || !dot || !text) return;

    dot.className = "db-status-dot " + this.status;
    text.textContent = this.statusMessage;

    badge.classList.remove("badge-connected", "badge-error", "badge-offline", "badge-connecting");
    if (this.status === "connected") {
      badge.classList.add("badge-connected");
      badge.title = "Database Online Aktif: Data tersinkronisasi otomatis secara realtime.";
    } else if (this.status === "connecting") {
      badge.classList.add("badge-connecting");
      badge.title = "Sedang menghubungi server Firebase...";
    } else if (this.status === "error") {
      badge.classList.add("badge-error");
      badge.title = "Koneksi Firebase bermasalah. Klik untuk memeriksa pengaturan.";
    } else {
      badge.title = "Database berjalan di Mode Lokal browser. Klik untuk menghubungkan ke Firebase Online.";
    }

    // Perbarui juga status di tab admin jika ada
    const adminStatusEl = document.getElementById("adminFirebaseStatusDisplay");
    if (adminStatusEl) {
      adminStatusEl.innerHTML = `
        <span class="db-status-dot ${this.status}"></span>
        <strong>${this.statusMessage}</strong>
      `;
    }
  }

  openSettingsModal() {
    if (!window.app) return;
    
    // Isi field form dengan config saat ini
    const form = document.getElementById("formFirebaseConfig");
    if (form) {
      document.getElementById("fbApiKey").value = this.config.apiKey || "";
      document.getElementById("fbAuthDomain").value = this.config.authDomain || "";
      document.getElementById("fbDatabaseURL").value = this.config.databaseURL || "";
      document.getElementById("fbProjectId").value = this.config.projectId || "";
      document.getElementById("fbStorageBucket").value = this.config.storageBucket || "";
      document.getElementById("fbMessagingSenderId").value = this.config.messagingSenderId || "";
      document.getElementById("fbAppId").value = this.config.appId || "";
    }

    // Tampilkan status terkini di dalam modal
    const infoStatus = document.getElementById("modalFirebaseCurrentStatus");
    if (infoStatus) {
      const isOnline = this.status === "connected";
      infoStatus.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: ${isOnline ? '#f0fdf4' : '#f8fafc'}; border: 1px solid ${isOnline ? '#bbf7d0' : '#e2e8f0'}; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="db-status-dot ${this.status}"></span>
            <div>
              <div style="font-weight: 700; color: ${isOnline ? '#166534' : '#334155'}; font-size: 0.95rem;">
                Status: ${this.statusMessage}
              </div>
              <div style="font-size: 0.78rem; color: #64748b;">
                ${this.isConfigured() ? `Project ID: <code>${this.config.projectId || 'Terkonfigurasi'}</code>` : 'Belum ada kunci Firebase yang dimasukkan.'}
              </div>
            </div>
          </div>
          <div>
            ${this.isConfigured() ? `
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.firebaseService.clearConfig()" style="color: #e11d48; border-color: #fecdd3;">
                Putuskan Sambungan
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }

    window.app.openModal("modalFirebaseSettings");
  }

  parseConfigString(str) {
    if (!str || typeof str !== "string") return null;
    const cleaned = str.trim();

    // Coba parse JSON murni
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.apiKey) return parsed;
    } catch (e) {}

    // Coba ekstrak properti dengan regex
    const keys = ["apiKey", "authDomain", "databaseURL", "projectId", "storageBucket", "messagingSenderId", "appId"];
    const result = {};
    let foundCount = 0;

    keys.forEach((key) => {
      const regex = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, "i");
      const match = cleaned.match(regex);
      if (match && match[1]) {
        result[key] = match[1].trim();
        foundCount++;
      }
    });

    if (foundCount >= 2 && result.apiKey) {
      return result;
    }
    return null;
  }
}

// Instance global
window.firebaseService = new FirebaseService();
