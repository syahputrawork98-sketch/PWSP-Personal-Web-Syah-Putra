# F03T — Site Settings Multilingual CMS Expansion

Status: Active

## Feature Summary
Penyempurnaan pengelola pengaturan situs (*Site Settings*) pada Admin CMS agar mendukung pengelolaan multibahasa (English, Indonesia, dan Japanese) untuk modul **Hero** dan **Profile/About Me**. Hal ini bertujuan agar teks publik di halaman utama (*landing page*) dan halaman *About* dapat disajikan secara dinamis sesuai dengan preferensi bahasa yang dipilih pengunjung, melengkapi sistem multilingual yang sebelumnya telah diimplementasikan pada modul *Project* (F03) dan *Experience* (F03S).

---

## Background
1. **Multilingual Baseline (F03 & F03S)**: Halaman portfolio publik saat ini telah mendukung peralihan bahasa (EN/ID/JA) dengan lancar untuk konten proyek dan pengalaman kerja. Riwayat pekerjaan dan detail proyek disajikan secara dinamis dari database menggunakan tabel relasional multibahasa.
2. **Settings CMS Gap (F09)**: Meskipun panel Admin CMS (F09) telah mampu mengelola data teks pengaturan situs (Hero, Profile/About, dan Contact), data tersebut saat ini masih disimpan dalam struktur JSON datar tunggal (*flat legacy shape*) tanpa pemisahan bahasa.
3. **Kebutuhan Recruiter Readability**: Ketika perekrut asing (terutama dari Jepang atau perusahaan global) mengunjungi situs, mereka mengharapkan agar seluruh teks beranda—termasuk headline, sub-headline, ringkasan profil, dan data detail pribadi—dapat dibaca dengan bahasa lokal mereka.
4. **Kebijakan Penerjemahan**: Penggunaan auto-translate API pihak ketiga dihindari pada fase awal ini untuk meminimalkan risiko keamanan kredensial, biaya pemakaian kuota, privasi data pribadi, dan bias hasil terjemahan Jepang. Sebagai gantinya, penataan bahasa menggunakan manual tab input (EN/ID/JA) dengan opsi pembuatan draf teks salinan lokal.

---

## Current State Summary
* **Struktur SiteSetting**: Berkas pengaturan disimpan dalam database menggunakan tabel `SiteSetting` dengan struktur `key String` dan `value Json` (ORM Prisma). Struktur ini sangat fleksibel dan dapat diperluas tanpa memerlukan migrasi skema database relasional baru.
* **Hero Setting**: Saat ini disimpan secara datar:
  ```json
  {
    "name": "Syah Putra Nugraha",
    "roles": ["Full Stack Developer", "Software Engineer"],
    "title": "Full Stack Web Developer specializing in PHP...",
    "subtitle": "I build web applications with...",
    "primaryCtaLabel": "Lihat Project",
    "secondaryCtaLabel": "Download CV",
    "resumeUrl": "/cv/cv-syah-putra-nugraha-web-developer.pdf"
  }
  ```
* **Profile Setting**: Saat ini disimpan secara datar:
  ```json
  {
    "aboutTitle": "About Me",
    "summaryTitle": "Professional Summary",
    "summary": "<p>...</p>",
    "avatarUrl": "https://...",
    "resumeUrl": "/cv/cv-...",
    "birthPlace": "Cimahi, West Java",
    "birthDate": "May 29, 1998"
  }
  ```
* **Contact Setting**: Pengaturan masih global datar dan rentan terjadi kehilangan nilai bidang `title` atau `description` apabila form admin melakukan penyimpanan tanpa menyertakan field tersebut secara lengkap.
* **Public API**: Rute `/api/settings/*` saat ini belum membaca parameter query `?locale=` sehingga selalu mengirimkan data flat default ke frontend.
* **Admin API**: Endpoint panel admin hanya mereturn data mentah datar (flat) langsung dari database.

---

## Target Locale Policy
- **Supported Locales**: `EN` (English), `ID` (Bahasa Indonesia), `JA` (Japanese).
- **Default Locale**: `EN`.
- **Public API Fallback**: Menjalankan strategi resolusi bahasa bertingkat:
  `Requested Locale` ➡️ `EN (English Baseline)` ➡️ `Legacy Flat Field (Data Lama)`.
- **Admin API Behavior**: Mengembalikan seluruh data multibahasa secara utuh dalam satu objek JSON terstruktur agar form admin dapat menampilkan tab bahasa dengan lengkap.
- **Save Requirement**: Input bahasa `ID` dan `JA` bersifat opsional (boleh kosong), sedangkan bahasa `EN` wajib diisi sebagai jangkar cadangan (*baseline fallback*).

---

## Recommended JSON Shape

### 1. Hero Settings Shape
```json
{
  "defaultLocale": "EN",
  "name": "Syah Putra Nugraha",
  "resumeUrl": "/cv/cv-syah-putra-nugraha-web-developer.pdf",
  "translations": {
    "EN": {
      "roles": ["Full Stack Web Developer", "Digital Operations Specialist"],
      "title": "Full Stack Web Developer specializing in PHP, Laravel, React, and MySQL.",
      "subtitle": "I build web applications with authentication, admin dashboards, CRUD systems, REST API, and database integration.",
      "primaryCtaLabel": "View Projects",
      "secondaryCtaLabel": "Download CV"
    },
    "ID": {
      "roles": ["Full Stack Web Developer", "Digital Operations Specialist"],
      "title": "Full Stack Web Developer spesialis PHP, Laravel, React, dan MySQL.",
      "subtitle": "Membangun aplikasi web dengan autentikasi, admin dashboard, sistem CRUD, REST API, dan integrasi database.",
      "primaryCtaLabel": "Lihat Proyek",
      "secondaryCtaLabel": "Unduh CV"
    },
    "JA": {
      "roles": ["フルスタックデベロッパー", "ソフトウェアエンジニア"],
      "title": "PHP、Laravel、React、MySQLを専門とするフルスタックWebデベロッパー。",
      "subtitle": "認証、管理ダッシュボード、CRUDシステム、REST API、データベース統合を備えたWebアプリケーションを構築します。",
      "primaryCtaLabel": "プロジェクトを見る",
      "secondaryCtaLabel": "CVダウンロード"
    }
  }
}
```
* **Global Fields** (Berlaku global di semua bahasa):
  - `name`
  - `resumeUrl`
* **Locale-Aware Fields** (Dapat diterjemahkan per bahasa):
  - `roles`
  - `title`
  - `subtitle`
  - `primaryCtaLabel`
  - `secondaryCtaLabel`

---

### 2. Profile/About Settings Shape
```json
{
  "defaultLocale": "EN",
  "avatarUrl": "https://images.unsplash.com/...",
  "resumeUrl": "/cv/cv-syah-putra-nugraha-web-developer.pdf",
  "translations": {
    "EN": {
      "aboutTitle": "About Me",
      "summaryTitle": "Professional Summary",
      "summary": "<p>More than just past experience, spending 8 years in the IT systems world...</p>",
      "birthPlace": "Cimahi, West Java",
      "birthDate": "May 29, 1998"
    },
    "ID": {
      "aboutTitle": "Tentang Saya",
      "summaryTitle": "Ringkasan Profesional",
      "summary": "<p>Bukan sekadar pengalaman masa lalu, 8 tahun berkecimpung di dunia IT sistem...</p>",
      "birthPlace": "Cimahi, Jawa Barat",
      "birthDate": "29 Mei 1998"
    },
    "JA": {
      "aboutTitle": "私について",
      "summaryTitle": "プロフェッショナルサマリー",
      "summary": "<p>単なる過去の経験にとどまらず、ITシステム分野で8年間過ごしたことで...</p>",
      "birthPlace": "インドネシア、西ジャワ州チマヒ",
      "birthDate": "1998年5月29日"
    }
  }
}
```
* **Global Fields**:
  - `avatarUrl`
  - `resumeUrl`
* **Locale-Aware Fields**:
  - `aboutTitle`
  - `summaryTitle`
  - `summary` (Format HTML Rich Text)
  - `birthPlace`
  - `birthDate` (Dukungan string lokal dipertahankan demi backward compatibility agar tidak memaksa parsing tanggal statis).

---

### 3. Contact/Website Settings Shape (Phase 2 Review)
Untuk menjaga lingkup kerja awal tetap terarah, modul **Contact** tidak dirancang langsung masuk ke model multibahasa penuh pada implementasi pertama. Fokus utama adalah melakukan pengamanan rute penyimpanan agar bidang `title` dan `description` tidak hilang terhapus oleh CMS.

Namun untuk rancangan jangka panjang, skema JSON berikut disepakati untuk Contact:
```json
{
  "defaultLocale": "EN",
  "email": "syah.putrawork98@gmail.com",
  "phone": "+628123456789",
  "whatsapp": "628123456789",
  "github": "https://github.com/syahputrawork98-sketch",
  "linkedin": "https://www.linkedin.com/in/syah-putra-nugraha-292424131/",
  "instagram": "https://instagram.com/",
  "website": "https://syahputran.vercel.app",
  "translations": {
    "EN": {
      "title": "Contact Me",
      "description": "Have an idea or a work opportunity? I am ready to discuss it with you.",
      "location": "Cimahi, West Java"
    },
    "ID": {
      "title": "Hubungi Saya",
      "description": "Punya ide atau peluang kerja? Saya siap mendiskusikannya dengan Anda.",
      "location": "Cimahi, Jawa Barat"
    },
    "JA": {
      "title": "お問い合わせ",
      "description": "アイデアや仕事の機会がありますか？お気軽にご相談ください。",
      "location": "インドネシア、西ジャワ州チマヒ"
    }
  }
}
```
* **Global Fields**:
  - `email`, `phone`, `whatsapp`, `github`, `linkedin`, `instagram`, `website`
* **Locale-Aware Fields**:
  - `title`, `description`, `location`

---

## Backend Specification
1. **Normalisasi Parameter Locale**:
   Membuat fungsi pembantu `normalizeLocale(locale)` di backend.
   - Input: `en`, `EN`, `id`, `ID`, `ja`, `JA`
   - Output canonical: `EN`, `ID`, `JA`
   - Default: `EN`
2. **Pengecekan Struktur Data**:
   Membuat helper `isStructuredLocalizedSetting(value)` untuk membedakan apakah JSON yang dibaca dari database merupakan skema multibahasa baru (memiliki properti `translations`) atau masih merupakan data lama (*legacy flat shape*).
3. **Public Fallback Helper**:
   Merancang fungsi resolusi untuk melayani permintaan data publik berdasarkan parameter `?locale=` dengan urutan:
   - Ambil data bahasa yang diminta (misal: `translations.JA`).
   - Jika field kosong/tidak ditemukan, ambil data bahasa default (`translations.EN`).
   - Jika struktur translasi belum ada, fallback langsung ke properti datar tingkat teratas (*legacy flat field*).
4. **Public API Response**:
   Hasil keluaran API publik tetap berformat datar (flat/non-nested) yang disesuaikan dengan locale aktif. Hal ini dilakukan agar kode frontend tidak perlu mendeteksi struktur bersarang (*nested object*).
   *Contoh:* `/api/settings/hero?locale=JA` mengembalikan:
   ```json
   {
     "name": "Syah Putra Nugraha",
     "roles": ["フルスタックデベロッパー", "ソフトウェアエンジニア"],
     "title": "PHP、Laravel、React、MySQLを専門とする...",
     "resumeUrl": "/cv/cv-syah-putra-nugraha-web-developer.pdf"
   }
   ```
5. **Admin Merge Strategy**:
   Rute admin PUT `/api/admin/settings/*` harus melakukan proses merge objek secara aman. Data global (seperti `avatarUrl` atau `name`) dan seluruh blok bahasa lain dalam properti `translations` tidak boleh terhapus saat admin hanya memperbarui satu bahasa tertentu.

---

## Admin UI Specification
### 1. Panel Hero Settings
- Tampilan form admin dibagi menjadi dua bagian visual:
  - **Seksi Global**: Name dan Resume URL (tanpa tab, berlaku untuk semua bahasa).
  - **Seksi Multilingual**: Tab switch `English (EN)`, `Indonesia (ID)`, dan `Japanese (JA)`.
- Bidang input di dalam tab bahasa:
  - Roles (Tag / Array Input)
  - Title (Textarea)
  - Subtitle (Textarea)
  - Primary CTA Label (Text Input)
  - Secondary CTA Label (Text Input)
- Tombol aksi utama: **Save All Locales** (menyimpan seluruh konfigurasi global & multibahasa sekaligus).

### 2. Panel Profile Settings
- **Seksi Global**: Avatar URL dan Resume URL.
- **Seksi Multilingual**: Tab switch `EN`, `ID`, dan `JA`.
- Bidang input di dalam tab bahasa:
  - About Title (Text Input)
  - Summary Title (Text Input)
  - Summary (Rich Text WYSIWYG Editor)
  - Birth Place (Text Input)
  - Birth Date (Text Input)

---

## Public Integration Specification
1. **API Client (`client/src/lib/api.js`)**:
   Memodifikasi fungsi API publik agar meneruskan parameter `locale` ke endpoint server:
   - `getPublicHero(locale)` ➡️ `/api/settings/hero?locale=${locale}`
   - `getPublicProfile(locale)` ➡️ `/api/settings/profile?locale=${locale}`
   - `getPublicContact(locale)` ➡️ `/api/settings/contact?locale=${locale}`
2. **React Pages Integration**:
   - `Home.jsx` dan `About.jsx` harus mendengarkan state `locale` dari context bahasa `useLanguage()`.
   - Mengintegrasikan state `locale` ke dalam array dependensi `useEffect` atau parameter pembantu `useFetch` agar data pengaturan langsung di-fetch ulang dari backend saat pengunjung mengganti switcher bahasa di navbar.

---

## Backward Compatibility
> [!IMPORTANT]
> Sistem dilarang merusak instalasi produksi yang sudah berjalan.
- **No Database Migrations**: Skema tabel tetap `SiteSetting`. Tidak ada migrasi database relasional Prisma.
- **Data Fallback**: Jika database berisi data lama yang datar (flat), backend tetap dapat mem-parsing data tersebut dengan aman dan menyajikannya ke publik.
- **Admin Bootstrap**: Saat admin pertama kali membuka form dengan data lama, frontend admin secara cerdas akan menyalin field data datar lama ke dalam tab `English (EN)` sebagai baseline inisiasi secara otomatis sebelum disimpan kembali dalam bentuk skema multilingual baru.

---

## Auto-translate Policy
> [!WARNING]
> Fitur terjemahan otomatis via API eksternal (Google Translate/DeepL) **TIDAK diimplementasikan** pada fase F03T awal.
* **Risiko Utama**:
  1. Keamanan repositori: Kebutuhan penyimpanan API key/credential di env server yang harus diatur manual.
  2. Beban finansial: Biaya kuota API berbayar.
  3. Kualitas: Terjemahan bahasa Jepang teknis sering kali tidak akurat dan memerlukan sentuhan manual agar tetap profesional bagi recruiter.
  4. Risiko Overwrite: Penyimpanan otomatis berpotensi menimpa revisi terjemahan manual yang sudah dipoles secara teliti.
* **Solusi Alternatif Phase 1**:
  - Menyediakan tombol bantuan lokal sederhana di panel Admin UI: **"Copy English to Draft"**. Tombol ini menyalin isi input bahasa Inggris ke kolom input target (ID atau JA) di browser secara lokal sebagai draf dasar untuk kemudian diterjemahkan secara manual oleh user.

---

## Batch Roadmap

| Sub-Batch | Name | Status | Purpose | Dependency |
|---|---|---|---|---|
| F03T-SPEC | Site Settings Multilingual CMS Technical Specification | Completed | Mengunci spesifikasi teknis data shape, kebijakan fallback bahasa, alur API admin/publik, dan kebijakan translatabilitas. | - |
| F03T.1 | SiteSetting Locale Shape & Backend Fallback Helper | Completed | Implementasi fungsi helper normalisasi bahasa, pendeteksi skema, resolusi fallback publik, dan perbaikan API PUT admin. | F03T-SPEC |
| F03T.2 | Admin Hero Translation Tabs EN/ID/JA | Completed | Pembuatan antarmuka tab bahasa pada Admin Hero, input roles dinamis, dan penyelarasan payload simpan. | F03T.1 |
| F03T.3 | Admin Profile Translation Tabs EN/ID/JA | Completed | Pembuatan antarmuka tab bahasa pada Admin Profile, editor rich-text, dan penyelarasan payload simpan. | F03T.1 |
| F03T.4 | Public Hero/Profile Locale Integration | Pending | Integrasi dynamic locale fetch di Home.jsx & About.jsx berdasarkan state locale aktif. | F03T.2, F03T.3 |
| F03T.5 | Contact/Website Settings Locale Review | Pending | Tinjauan keamanan PUT Contact Admin agar bidang deskripsi tidak hilang, serta opsi multilingual ringan. | F03T.4 |
| F03T.6 | Manual Translation UX Polish | Pending | Pemasangan lencana indikator status kelengkapan bahasa (Missing translation badge) dan visual draft helper. | F03T.5 |
| F03T-AUTO-SPEC | Auto Translation Draft Helper Specification | Pending | Penyusunan spesifikasi integrasi aman modul auto-translate draft di server-side jika dibutuhkan di masa mendatang. | F03T.6 |

---

## Risks & Mitigation
1. **Risiko Data Lama Menjadi Kosong (Blank)**:
   *Mitigasi:* Backend dilarang mengasumsikan properti `translations` selalu ada. Helper fallback harus secara otomatis mengembalikan nilai properti teratas jika objek `translations` tidak terdefinisi.
2. **Kehilangan Data Bahasa Lain Saat Update (Overwrite)**:
   *Mitigasi:* Proses simpan Admin CMS harus mengambil data lama terlebih dahulu dari database, memotong isi bahasa target yang diedit, dan menggabungkannya (*merge*) kembali sebelum melakukan query `update` ke database Prisma.
3. **Kerusakan Teks Contact**:
   *Mitigasi:* Rute PUT settings admin harus diaudit secara ketat untuk memastikan field yang dikirimkan dari frontend tidak menimpa data yang tidak ada di form.

---

## Validation Checklist
- [ ] Rute GET publik `/api/settings/hero?locale=EN` mereturn data bahasa Inggris datar yang valid.
- [ ] Rute GET publik `/api/settings/hero?locale=ID` mereturn data bahasa Indonesia datar yang valid.
- [ ] Rute GET publik `/api/settings/hero?locale=JA` mereturn data bahasa Jepang datar yang valid.
- [ ] Fallback bekerja dengan baik: jika input JA kosong, `/api/settings/hero?locale=JA` mengembalikan teks bahasa Inggris.
- [ ] Form Admin Hero dapat beralih tab bahasa tanpa kehilangan isi input tab bahasa lain sebelum menekan simpan.
- [ ] Menyimpan tab bahasa di Admin Profile berhasil menyimpan data ke database Prisma dan data tetap ada setelah halaman di-refresh.
- [ ] Halaman publik beranda (Home) berganti headline secara dinamis saat pengunjung mengklik tombol pengubah bahasa di navbar.
- [ ] Halaman publik About berganti riwayat teks deskripsi secara dinamis sesuai bahasa navbar.
- [ ] Tombol simpan Contact di Admin Panel tidak menghapus teks deskripsi atau judul modul.
- [ ] Kompilasi build frontend (`npm run build`) berjalan sukses.
- [ ] Repositori bersih dari API key terjemahan eksternal.

---

## F03T.1 Progress & Implementation Notes
- **F03T.1 Completed**: Menambahkan fungsi helper normalisasi bahasa, deteksi skema terjemahan, resolusi fallback field-level publik, serta merge update admin ke dalam `settings.controller.js`.
- **Public API Resolution**: `/api/settings/hero` dan `/api/settings/profile` kini mendukung query parameter `?locale=`. Payload respons publik disajikan dalam bentuk flat (tidak bersarang) demi kemudahan integrasi di sisi client.
- **Merge & Compatibility**: Payload update dari panel admin di-merge secara aman dengan struktur data yang ada untuk mencegah kehilangan terjemahan bahasa lain. Data flat lama tetap terbaca dengan normal tanpa merusak fungsionalitas aplikasi yang sudah berjalan.

---

## F03T.2 Progress & Implementation Notes
- **F03T.2 Completed**: Mengubah panel Admin Hero Settings dari format isian satu bahasa (flat) menjadi format multilingual tabbed UI untuk bahasa Inggris (EN), Indonesia (ID), dan Jepang (JA).
- **Separation of Concerns**: Memisahkan input data identitas global (`name` dan `resumeUrl`) yang berlaku di semua bahasa dari data copy text spesifik bahasa (`roles`, `title`, `subtitle`, `primaryCtaLabel`, `secondaryCtaLabel`).
- **Data Shape & Normalization**: Menggunakan helper `normalizeHeroForm` untuk meratakan data masukan flat lama (legacy) ke dalam tab bahasa Inggris secara otomatis saat data dimuat, serta menyusun payload `translations` terstruktur dengan memecah roles dari string dipisahkan koma menjadi array saat disimpan via "Save All Locales".

---

## F03T.3 Progress & Implementation Notes
- **F03T.3 Completed**: Mengubah panel Admin Profile Settings dari format isian satu bahasa (flat) menjadi format multilingual tabbed UI untuk bahasa Inggris (EN), Indonesia (ID), dan Jepang (JA).
- **Separation of Concerns**: Memisahkan input data global (`avatarUrl` dan `resumeUrl`) yang berlaku di semua bahasa dari data copy text spesifik bahasa (`aboutTitle`, `summaryTitle`, `summary`, `birthPlace`, `birthDate`).
- **Data Shape & Normalization**: Menggunakan helper `normalizeProfileForm` untuk meratakan data masukan flat lama (legacy) ke dalam tab bahasa Inggris secara otomatis saat data dimuat, serta menyusun payload `translations` terstruktur saat disimpan via "Save All Locales". Mendukung pelestarian properti tambahan pada translation jika ada (seperti `professionalSummary`, dll.).

---

## Next Step
- Melanjutkan ke **Batch F03T-CP1 — Admin Site Settings Translation Tabs Checkpoint**.
