// ========================================================
// GENERATOR LEMBAR RESMI JURNAL LITERASI SMAN 1 BATU
// Cetak Rapor / Portofolio Literasi Resmi Sekolah
// ========================================================

const PrintModule = {
  openPrintPreview(targetStudentId = null) {
    const currentUser = window.storage.getCurrentUser();
    const studentId = targetStudentId || (currentUser.role === "siswa" ? currentUser.id : "siswa-1");
    const student = window.storage.getUsers().find(u => u.id === studentId);
    if (!student) return;

    const journals = window.storage.getJournals({ studentId: student.id });
    const stats = window.storage.getStudentStats(student.id);

    const printContainer = document.getElementById("printSheetContent");
    if (!printContainer) return;

    const todayDateStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

    const htmlContent = `
      <div class="school-kop">
        <img src="assets/logo-sman1batu.png?v=2" alt="Logo SMAN 1 Batu" style="width: 80px; height: 95px; object-fit: contain;">
        <div class="school-kop-text">
          <h3>PEMERINTAH PROVINSI JAWA TIMUR<br>DINAS PENDIDIKAN</h3>
          <h2>SMA NEGERI 1 BATU</h2>
          <p>Jl. Ngaglik No. 1, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65311</p>
          <p>Laman: sman1batu.sch.id | Pos-el: perpus@sman1batu.sch.id | NPSN: 20536827</p>
        </div>
      </div>

      <div class="print-report-title">LEMBAR PORTOFOLIO JURNAL LITERASI SISWA</div>
      <div class="print-report-subtitle">Program Gerakan Literasi Sekolah (GLS) Cendekia - Tahun Ajaran 2026/2027</div>

      <table class="print-student-info">
        <tr>
          <td style="width: 140px;"><strong>Nama Lengkap</strong></td>
          <td style="width: 10px;">:</td>
          <td><strong>${student.name}</strong></td>
          <td style="width: 140px;"><strong>Tingkat / Kelas</strong></td>
          <td style="width: 10px;">:</td>
          <td>${student.kelas}</td>
        </tr>
        <tr>
          <td><strong>NISN</strong></td>
          <td>:</td>
          <td>${student.nisn}</td>
          <td><strong>Guru Pembina / Wali</strong></td>
          <td>:</td>
          <td>${student.waliKelas || "Ibu Widya Ningsih, S.Kom, Gr"}</td>
        </tr>
        <tr>
          <td><strong>Total Jurnal</strong></td>
          <td>:</td>
          <td>${stats.totalJournals} Jurnal (${stats.approvedJournals} Disetujui)</td>
          <td><strong>Peringkat Literasi</strong></td>
          <td>:</td>
          <td><span style="font-weight: bold; color: #0f172a;">${student.level} (${student.points} Poin)</span></td>
        </tr>
      </table>

      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th style="width: 75px;">Tanggal</th>
            <th>Judul Buku & Penulis</th>
            <th style="width: 70px;">Hal. Dibaca</th>
            <th>Ulasan Bacaan & Nilai Karakter</th>
            <th style="width: 50px;">Nilai</th>
            <th style="width: 75px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${journals.length > 0 ? journals.map((j, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td style="text-align: center;">${j.dateRead || "-"}</td>
              <td>
                <strong>${j.bookTitle}</strong><br>
                <small style="color: #475569;">${j.bookAuthor} (${j.bookCategory})</small>
              </td>
              <td style="text-align: center;">${j.pagesRead} hal</td>
              <td style="font-size: 8.5pt;">
                <div>${j.summary.substring(0, 160)}...</div>
                ${j.moralValue ? `<div style="font-style: italic; color: #334155; margin-top: 3px;"><strong>Hikmah:</strong> ${j.moralValue}</div>` : ""}
              </td>
              <td style="text-align: center; font-weight: bold;">
                ${j.teacherScore != null ? j.teacherScore : "-"}
              </td>
              <td style="text-align: center; font-size: 8pt;">
                ${j.status === 'approved' ? '✓ Disetujui' : (j.status === 'revision' ? 'Perlu Revisi' : 'Menunggu')}
              </td>
            </tr>
          `).join("") : `
            <tr><td colspan="7" style="text-align:center; padding: 15px;">Belum ada catatan jurnal literasi yang diisi siswa.</td></tr>
          `}
        </tbody>
      </table>

      <div class="print-signature-row">
        <div class="print-signature-box">
          <p>Mengetahui,<br>Orang Tua / Wali Murid</p>
          <div style="height: 55px;"></div>
          <p>( .................................................... )</p>
        </div>

        <div class="print-signature-box">
          <p>Batu, ${todayDateStr}<br>Guru Pembina Literasi</p>
          <div style="height: 55px;"></div>
          <p><strong>Ibu Widya Ningsih, S.Kom, Gr</strong><br>NIP. 198506142010012015</p>
        </div>

        <div class="print-signature-box">
          <p>Kepala Perpustakaan SMABA</p>
          <div style="height: 55px;"></div>
          <p><strong>Ibu Rini Wahyuningsih, S.Pd</strong><br>NIP. 197805122005012008</p>
        </div>

        <div class="print-signature-box">
          <p>Kepala SMAN 1 Batu</p>
          <div style="height: 55px;"></div>
          <p><strong>Bapak Anto Dwi Cahyono, S.Pd, M.M</strong><br>NIP. 197205101998021004</p>
        </div>
      </div>
    `;

    printContainer.innerHTML = htmlContent;

    const actualPrint = document.getElementById("actualPrintWrapper");
    if (actualPrint) {
      actualPrint.innerHTML = htmlContent;
    }

    // Buka dialog konfirmasi cetak
    window.app.openModal("modalPrintPreview");
  },

  doPrint() {
    window.print();
  }
};

window.PrintModule = PrintModule;
