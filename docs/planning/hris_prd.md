# Product Requirements Document (PRD) - HRIS Enterprise

## 1. Executive Summary
**Product Name:** HRIS Enterprise
**Platform:** Web Application (SvelteKit)
**Vision:** Membangun platform *Human Resource Information System* (HRIS) modern yang komprehensif, intuitif, dan *scalable* untuk mendukung operasional SDM perusahaan berskala menengah hingga besar (Enterprise). Sistem ini bertujuan mengotomatisasi proses administratif HR, memberdayakan karyawan melalui *Self-Service*, dan memberikan *insight* strategis bagi manajemen.

## 2. Objectives & Success Metrics
- **Efisiensi Waktu HR:** Mengurangi waktu operasional HR untuk rekap absensi dan penggajian hingga 70%.
- **Employee Engagement:** Adopsi portal ESS (Employee Self-Service) mencapai 90% dalam 3 bulan pertama.
- **Akurasi Data:** Mengurangi tingkat kesalahan perhitungan *payroll* dan pajak hingga mendekati 0%.
- **Paperless:** Digitalisasi 100% untuk proses pengajuan cuti, lembur, klaim, dan *payslip*.

---

## 3. User Personas & Role-Based Access Control (RBAC)

Sistem akan menggunakan pendekatan arsitektur *multi-role* di mana UI dan hak akses (Read, Write, Edit, Delete, Approve) disesuaikan:

1. **Super Admin / System Admin**
   - *Scope:* Pengaturan *Tenant*, Konfigurasi Sistem Core, Manajemen *User* & *Roles*, Audit Trail.
2. **HR Admin / HR Manager**
   - *Scope:* Akses penuh ke seluruh data operasional (Core HR, Payroll, Kehadiran), mengatur master data, *generate* *payroll*, mengeluarkan SP (*Surat Peringatan*).
3. **Payroll Officer / Finance**
   - *Scope:* Akses spesifik ke modul Payroll, Kasbon, Reimbursement, Perhitungan PPh21 & BPJS. Tidak punya akses edit data struktur organisasi (hanya *read-only*).
4. **Line Manager / Supervisor (MSS)**
   - *Scope:* Akses ke data timnya sendiri. Melakukan *Approval/Rejection* untuk cuti, lembur, dan *reimburse* anggota tim. Melihat statistik kehadiran tim.
5. **Employee / Karyawan (ESS)**
   - *Scope:* Akses terbatas ke profil pribadi. Melakukan absen masuk/pulang, mengajukan cuti/lembur/klaim, dan mengunduh slip gaji sendiri.

---

## 4. Functional Requirements (Pilar Utama)

### 4.1. Core HR & Master Data (Pondasi Sistem)
Sistem penyimpanan *Single Source of Truth* untuk data perusahaan dan karyawan.
- **Organization Management:** Mendukung hierarki kompleks (Perusahaan/Holding -> Cabang -> Divisi -> Departemen -> Unit Kerja).
- **Job Architecture:**
  - *Job Title:* Master data nama jabatan (mis: "Software Engineer").
  - *Job Position:* Kursi aktual dalam *org-chart* dengan informasi atasan langsung (*Reports To*).
  - *Job Leveling:* Grade/Level untuk penentuan standar gaji dan fasilitas (mis: Staff, Spv, Manager).
- **Employee Database (Lifecycle):**
  - Data Pribadi, Kontak Darurat, Susunan Keluarga (untuk klaim asuransi/BPJS).
  - Riwayat Pendidikan, Riwayat Pekerjaan, dan Sertifikasi.
  - Tracking status kontrak (Probation, PKWT, PKWTT/Tetap, Resigned) dengan *alert* 30 hari sebelum kontrak habis.
- **Document Management:** Upload dan penyimpanan aman untuk dokumen KTP, NPWP, Buku Nikah, dan Dokumen Kontrak.

### 4.2. Time & Attendance (Manajemen Waktu)
- **Shift & Rostering Engine:**
  - Kemampuan membuat jam kerja fleksibel (Flexible Time) maupun baku (Fixed Time).
  - Dukungan pola *Shift Rotasi* untuk pekerja pabrik/lapangan.
  - Penentuan hari libur nasional (*Public Holidays*) dan cuti bersama.
- **Attendance System:**
  - *Web/Mobile Clock-in/out* dengan kapabilitas **Geolocation (GPS)** dan **Geofencing** (hanya bisa absen di radius kantor).
  - *Grace Period* (Toleransi keterlambatan, misal 15 menit).
  - Validasi ketidakhadiran (Mangkir) secara otomatis jika tidak ada absen dan tidak ada pengajuan cuti.

### 4.3. Leave & Overtime Management
- **Leave (Cuti):**
  - Pembuatan tipe cuti dinamis (Tahunan, Sakit, Melahirkan, Menikah, dll) beserta *rules* (memotong gaji atau tidak).
  - Logika *Accrual* (penambahan kuota cuti per bulan) dan *Carry-Forward* (sisa cuti tahun lalu dibawa ke tahun depan dengan batas maksimal).
  - Upload lampiran wajib (misal: Surat Dokter untuk cuti sakit > 2 hari).
- **Overtime (Lembur):**
  - Pengajuan lembur sebelum atau sesudah hari-H.
  - Multi-tier Approval (Harus di-approve SPV, lalu HR).
  - Kalkulasi *Multiplier* Jam Lembur sesuai regulasi Depnaker RI (atau *flat rate* sesuai kebijakan internal).

### 4.4. Payroll & Compensation (Penggajian)
- **Formula Engine:** Kapabilitas HR untuk membuat komponen gaji yang dinamis (Gaji Pokok, Tunjangan Kehadiran, Tunjangan Makan, Potongan Telat).
- **Tax & Compliance (Pajak & BPJS):**
  - Terintegrasi dengan perhitungan PPh 21 (metode TER terbaru / Net / Gross / Gross Up).
  - Perhitungan persentase BPJS Kesehatan dan BPJS Ketenagakerjaan (JHT, JKK, JKM, JP) porsi perusahaan & karyawan.
- **Prorate System:** Kalkulasi gaji prorata otomatis untuk karyawan *new hire* atau *resign* di tengah bulan.
- **Reimbursement & Loan:**
  - Pengajuan klaim biaya (Transport, Medis) dengan OCR/Upload Bon, terintegrasi ke *Payroll*.
  - *Employee Loan* (Kasbon) dengan sistem pemotongan gaji otomatis per bulan (cicilan).
- **Payslip Generation:** Slip gaji digital ber-password (PDF) atau via Portal langsung.

### 4.5. Employee & Manager Self-Service (ESS & MSS)
- **Dashboard Karyawan:** Ringkasan sisa cuti, jadwal hari ini, *announcement* perusahaan.
- **Dashboard Atasan:** *To-Do list approval*, grafik kehadiran tim (siapa yang WFO, WFH, Cuti, atau Sakit hari ini).

---

## 5. Non-Functional Requirements (NFR)

### 5.1. Teknologi & Arsitektur
- **Frontend Framework:** SvelteKit (SSR/CSR optimasi).
- **Styling:** Tailwind CSS v4 dengan pendekatan *Domain-Driven Design* (DDD) dan arsitektur *Clean Architecture*.
- **State Management & Data Fetching:** Svelte 5 Runes dipadukan dengan TanStack Query v6 untuk optimasi *caching* & *mutation*.

### 5.2. Security (Keamanan)
- **Authentication:** JWT (JSON Web Token) di sisi *HttpOnly Cookies* untuk mencegah eksploitasi XSS.
- **Authorization:** *Role-based middleware* (di level API dan Frontend router) untuk memastikan *user* tidak bisa meretas URL (*Direct Object Reference*).
- **Data Protection:** Enkripsi *database* untuk data sensitif (Gaji, NPWP, KTP).
- **Audit Trails:** Seluruh aksi (Create, Update, Delete) di modul Core HR & Payroll harus tercatat otomatis (Siapa yang mengubah, kapan, data sebelum, data sesudah).

### 5.3. Performance & Usability
- Responsibilitas UI di bawah **200ms** untuk perpindahan tab/menu (dibantu *TanStack Query caching*).
- Desain *Mobile-First* untuk halaman ESS (Absen, Cuti) karena mayoritas karyawan akan membukanya lewat *smartphone*.
- Dukungan *Dark Mode* & *Light Mode* untuk kenyamanan mata pengguna.

---

## 6. Arsitektur Navigasi / Menu (Sidebar)

Sebagai panduan *slicing UI*, Sidebar akan terbagi menjadi **Group** berikut sesuai hak akses:

1. **Dashboard** (Semua Role)
   - Ringkasan statistik pribadi / perusahaan.
2. **Layanan Karyawan / My Workspace** (Semua Role)
   - Absensi Harian (Clock In/Out)
   - Pengajuan (Cuti, Lembur, Reimburse)
   - Slip Gaji (My Payslip)
3. **Approvals / Persetujuan** (Hanya Manager & HR)
   - *Pending Requests* (Cuti, Lembur, Kasbon Tim)
4. **Master Data** (Hanya HR Admin & Super Admin)
   - Data Perusahaan & Cabang
   - Organisasi (Departemen, Divisi)
   - Jabatan & Posisi
5. **People / HR Ops** (Hanya HR Admin)
   - Direktori Karyawan
   - Manajemen Kontrak
   - Manajemen Aset / Fasilitas
6. **Time & Attendance** (Hanya HR Admin)
   - Shift & Jadwal
   - Laporan Rekap Kehadiran
   - Penyesuaian Saldo Cuti
7. **Finance & Payroll** (Hanya HR Admin & Finance)
   - Run Payroll (Generate Gaji Bulanan)
   - Laporan Pajak & BPJS
   - Manajemen Komponen Gaji
8. **Settings** (Hanya Super Admin)
   - Manajemen User & Hak Akses
   - Konfigurasi Sistem (Hari Libur, Kebijakan Perusahaan)

---

## 7. Product Roadmap (Phasing)

**Phase 1: Minimum Viable Product (MVP) - *Fokus Saat Ini***
- Implementasi arsitektur dasar SvelteKit & UI Library (Tailwind).
- Master Data (Cabang, Departemen, Jabatan, Posisi).
- Core HR Database (Data Karyawan dasar).
- Konfigurasi Menu Sidebar & Routing dinamis berbasis *Role*.

**Phase 2: Time & ESS Module**
- Portal ESS untuk absensi mandiri, pengajuan cuti, dan lembur.
- Portal MSS untuk Approval dari atasan.
- Rekap absensi otomatis untuk HR.

**Phase 3: Payroll & Finance**
- *Payroll engine*, integrasi PPh21 & BPJS.
- Slip Gaji otomatis, modul Reimburse & Pinjaman.

**Phase 4: Advanced Talent Management (Post-MVP)**
- *Applicant Tracking System* (ATS) untuk rekrutmen.
- *Performance Management* (KPI/OKR Appraisals).
- *Mobile Apps* (React Native / Flutter) khusus *Employee Portal*.
