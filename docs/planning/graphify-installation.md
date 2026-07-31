# Graphify Installation Plan (Second Brain for AI Agents)

## Latar Belakang
Proyek ini membutuhkan pemetaan konteks (Knowledge Graph) agar agen AI seperti Antigravity dan OpenCode bisa langsung memahami arsitektur aplikasi (Clean Architecture, DDD, Svelte 5) tanpa perlu melakukan proses *scanning* direktori dari nol pada setiap awal sesi. Solusi yang disepakati adalah menggunakan **[Graphify](https://graphify.net/)**.

## Prasyarat (Prerequisites)
Karena Graphify ditulis dalam bahasa Python, sistem lokal (Mac) harus sudah ter-install Python 3 dan `pip`. Saat ini Python belum ter-install.

## Rencana Instalasi
Berikut adalah langkah-langkah yang akan dieksekusi ketika infrastruktur sudah siap:

### 1. Install Python 3
Gunakan Homebrew untuk meng-install Python 3 di macOS:
```bash
brew install python
```

### 2. Install Graphify
Setelah Python dan `pip` tersedia, install Graphify secara global:
```bash
pip3 install graphifyy
```

### 3. Generate Knowledge Graph
Jalankan Graphify di root direktori proyek (`hris-frontend`):
```bash
graphifyy .
```
Proses ini akan membaca kode, dokumentasi, dan aturan (`.agents/`), lalu menghasilkan *file* indeks/graf yang mewakili pemahaman mendalam tentang *codebase*.

### 4. Integrasi dengan AI
- **Antigravity:** Akan membaca *file* *output* dari Graphify di awal sesi untuk me- *load* memori tanpa *scanning*.
- **OpenCode / Cursor:** Akan disuapi konteks ini agar lebih presisi dan tidak melanggar aturan arsitektur yang sudah kita buat.

## Status
- [ ] Install Python 3
- [ ] Install Graphifyy
- [ ] Test generate graph pertama kali

*File ini disimpan sebagai _backlog_ dan akan dieksekusi ketika User sudah siap meng-install Python.*
