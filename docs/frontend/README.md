# Frontend Documentation

## Fungsi Folder
Folder ini berisi dokumentasi teknis khusus untuk frontend, termasuk arsitektur React/Vite, komponen UI, dan interaksi client-side.

## Kapan Update Dokumen Ini
Dokumen di dalam folder ini harus diupdate setiap kali ada perubahan arsitektural atau teknis yang signifikan pada struktur frontend.

## Hubungan dengan Feature Batch
Dokumentasi teknis di sini berfungsi sebagai panduan teknis yang mendukung eksekusi Feature Batch. Jika sebuah Feature Batch mengubah sistem komponen atau routing, catat teknisnya di sini.

## Area Frontend yang Dicatat
- routing
- components
- pages
- fallback data
- styling
- build
- public QA

## Admin CRUD Audit Summary (Batch F09M)
Admin Panel CMS telah berstatus *fully-mapped* dan mematuhi pilar CRUD:
- **Projects**: Read, Create, Update, Delete tersedia. Save ke database sukses. Public sync sukses. Safe delete (`window.confirm`) dengan feedback peringatan yang menyebutkan nama judul berhasil. *Batch F03L menambahkan form editor konten studi kasus bahasa Inggris (EN) dengan input Role dan textarea multiline untuk Key Features, Responsibilities, serta Outcomes.*
- **Credentials/Certifications**: Read, Create, Update, Delete tersedia. UI edit sudah merangkum tautan eksternal Drive. Safe delete dan public sync berhasil terpasang.
- **Skills**: Read, Create, Update, Delete tersedia. UI list merangkum filter tabs (Keahlian, dsb.). Safe delete sukses mencatat nama *skill*.
- **Experience**: Read, Create, Update, Delete tersedia. Public sync berhasil. Safe delete sudah menampilkan posisi pekerjaan dan institusi/perusahaan secara jelas. *Batch F02E menyelaraskan tampilan halaman publik dengan menambahkan cross-linking ke portofolio proyek dan pewarnaan border kiri kartu secara dinamis berdasarkan jenis pengalaman.*
- **Education**: Read, Create, Update, Delete berjalan. Form di-reuse untuk edit. Safe delete sudah dilengkapi dengan nama gelar & sekolah.
- **Settings (Hero, Profile, Contact, Account)**: Read (GET param global) & Update bekerja baik, tak ada Delete. Form UI validasinya sudah tertangani dengan aman dan menyokong *public interface*.

**Safe Delete UX & Feedback Plan**:
1. Seluruh _delete action_ kini menggunakan komponen `ConfirmModal.jsx` berbasis React, meninggalkan fungsionalitas kaku dari bawaan browser (`window.confirm`).
2. Setiap konfirmasi menyertakan properti nama spesifik dari baris data yang hendak dihapus untuk menghindari salah klik.
3. Fitur pelaporan sukses (warna hijau) maupun gagal (warna merah) terintegrasi pada layar tabel tanpa mengganggu posisi _scroll_. 
4. Semua operasi _delete_ dikendalikan oleh *state* `isDeleting` guna menonaktifkan tombol selama _loading_ komunikasi ke server.

## CV Builder & Public Download (Batch F11)
- **Admin CMS UI (`/admin/cv-builder`)**: Satu-satunya tempat penyusunan konfigurasi CV, pemilihan seksi (*checkbox*), serta pengurutan data. Juga bertindak sebagai pratinjau (*preview*) kanvas A4 sebelum dicetak ke PDF oleh Admin. Tidak terekspos ke publik.
  - **F11E.1 & F11E.2 UX Updates**: Struktur input dibagi menjadi Manual CV Identity (nama, posisi, kontak) dan Database Sections. Seluruh bagian *Database Sections* (Skills, Projects, Experience, Education, Credentials) menggunakan *Unified Selector* berwujud *search & chip selector* untuk menghemat ruang, membuang *checklist* panjang. Experience dan Education diatur wajib (mandatory/default aktif).
  - **F11E.3 & F11E.4 Browser Print Workflow**: Ekspor PDF dilakukan mandiri oleh Browser melalui mekanisme `window.print()`. File `client/src/styles/cv-print.css` disuntikkan secara eksklusif untuk format cetak, membunuh semua elemen UI admin, menetapkan `page-break-inside: avoid` pada seluruh item untuk mencegah kepincangan halaman. Tambahan *helper text* mengingatkan admin agar menjaga proporsi halaman.
  - **F11F Static PDF Handoff**: Alur ini menegaskan bahwa tidak ada mekanisme upload PDF ke backend. File PDF yang tercetak otomatis dari browser harus diletakkan manual oleh User di dalam folder statis `/client/public/cv/` agar bisa diakses pengunjung web.
  - **F11G & F11G.1 ATS Typography & Contact Integration**: Layout *preview* dipadatkan (compact) untuk mensimulasikan ukuran standar dokumen ATS (font sekunder 9-10pt, Line Height 1.35). Selain itu, CV mengambil referensi link sosial (*Website, LinkedIn, GitHub*) secara dinamis langsung dari *Contact Settings* untuk menekan duplikasi entri data.
- **Public UI (CV Download - F05)**: Domain publik murni dan pasif. Publik **tidak** memiliki antarmuka pembuatan/konfigurasi CV apa pun. Pengunjung sekadar disuguhi satu tombol "Download CV" yang memicu pengunduhan berkas PDF final statis.

## Validasi Frontend Minimal
- `npm run dev` bila perlu mengecek hasil di browser.
- `npm run build` bila menyentuh build atau client logic.
- Cek browser console bila ada perubahan UI.
- Cek responsive bila ada perubahan layout.

## Catatan Penting
- Jangan mencampur frontend dengan backend/auth/deployment dalam batch yang sama tanpa alasan jelas.

## Public Language Switcher System (Batch F03M & F03N)
- **LanguageContext (`client/src/context/LanguageContext.jsx`)**: Menyediakan state global untuk pilihan bahasa aktif (`locale`) serta fungsi `changeLanguage(newLocale)` dan `t(path)`. Locale disimpan di `localStorage` dengan key `pw_locale` dan default ke `'EN'`.
- **Dictionary `client/src/i18n.js`**: Menyimpan pemetaan data statis lokal untuk label navigasi, teks loading, tombol CTA, serta judul/konten statis di halaman Home, Experience, Projects, detail modal proyek, About, Credentials, Learn, dan Contact.
- **Navbar Switcher**: Menyediakan dropdown pemilih bahasa `<select>` dengan class `.lang-select` di pojok kanan navbar desktop dan mobile untuk memudahkan pergantian bahasa secara instan.
- **Projects Integration**: Halaman Projects disesuaikan agar menyuntikkan query parameter `?locale=${locale}` secara dinamis ke REST API backend sehingga deskripsi dan detail kasus proyek yang disajikan oleh database sudah tersaji dalam bahasa pilihan pengguna secara otomatis.
- **Bilingual Coverage Expansion (Batch F03N)**: Memperluas lokalisasi bahasa Inggris (EN) dan bahasa Indonesia (ID) ke semua halaman publik yang tersisa (About, Credentials, Learn, Contact). Komponen pembantu kartu kredensial (`CredentialCard`) dan modal kredensial (`CredentialModal`) juga disesuaikan secara dinamis. Untuk mematuhi batasan berkas, struktur statis komponen `ExperienceReframing` dan `CredentialsSection` di-inline-kan ke dalam `About.jsx` untuk diterjemahkan menggunakan helper `t()`.

## Admin Project Translation Editor (Batch F03O)
- **ProjectForm Tab Interface**: `ProjectForm.jsx` dilengkapi dengan tab switcher (English 🇬🇧, Indonesia 🇮🇩, Japanese 🇯🇵) untuk mengelola input terjemahan project. Metadata global yang bersifat shared (seperti slug, projectType, projectStatus, imageUrl, techStack, github/live/figma link, order, status) ditampilkan di bagian atas form, sedangkan konten translatable (title, short description, description, case study fields, role, features/responsibilities list) dikelompokkan di bawah tab.
- **Form State Mapping**: Saat memuat data proyek (`initialData`), form memetakan array `translations` (atau fallback ke legacy flat fields untuk `EN`) ke state lokal bahasa masing-masing. Saat disimpan, payload diformat menjadi objek `translations` terstruktur yang dikirim ke backend API.

## Public Japanese (JA) Language Switcher Exposure (Batch F03P)
- **Supported Locale Extension**: `LanguageContext.jsx` diperluas untuk menerima locale `JA` (Japanese) pada inisialisasi state dari `localStorage` (`pw_locale`) dan fungsi `changeLanguage`.
- **Dynamic Translation Fallback**: Fungsi helper translator `t(path)` di `LanguageContext.jsx` dirancang dengan fallback bertingkat. Jika path pencarian dictionary untuk locale aktif (`JA` atau `ID`) mengembalikan nilai tidak terdefinisi (missing key), sistem otomatis melakukan pencarian ulang (fallback) ke kamus bahasa Inggris (`EN`), guna mencegah tampilan UI kosong (*blank*) atau menampilkan path string mentah.
- **Visual Switcher Exposure**: Dropdown pemilih bahasa `<select className="lang-select">` pada `Navbar.jsx` untuk mode desktop maupun mobile kini menyertakan opsi `JA`.
- **API Fetch Synchronization**: Saat pengguna memilih bahasa Jepang, request data proyek publik secara otomatis menyematkan parameter kueri `?locale=JA` ke backend API. Jika data proyek tidak memiliki versi terjemahan Jepang di database, backend secara otomatis melakukan fallback data terjemahan ke versi `EN` sesuai kontrak API.

## Admin Project Translation Validation & UX Polish (Batch F03Q)
- **Client-Side Validation**: `ProjectForm.jsx` memvalidasi kelengkapan bidang wajib bahasa Inggris (EN `title` dan `shortDescription`) sebelum pengiriman data (`onSubmit`).
- **Active Tab Redirect**: Jika kolom wajib EN tidak lengkap, form membatalkan submit, memicu pesan error visual, dan otomatis memindahkan tab aktif kembali ke `EN` agar memudahkan admin melengkapinya.
- **Visual Indicators & Guide**: Tombol tab navigasi diperjelas dengan keterangan `Required` pada `English` dan `Optional` pada `Indonesia` & `Japanese`. Ditambahkan pula baris petunjuk (helper text) di bawah switcher untuk memberikan kepastian alur pengisian translasi.

