# Batch F03 — Project Portfolio System

## Feature Summary
Sistem portfolio, kategori, card, modal, dan link tile.

## Status
Completed

## Story
Mencakup sistem portfolio, kategori proyek, project card, modal detail, dan link tile. Merupakan ruang pamernya karya user.

## Current State
- UI berjalan dengan baik.
- Modal memunculkan detail yang relevan.
- Link tile diperbarui dengan link aman.
- Curation data proyek dilakukan dengan berorientasi pada kebutuhan rekrutmen HRD Full Stack Developer (Batch F03D).
- Restrukturisasi database Project untuk fondasi multibahasa berhasil diterapkan (Batch F03H) dengan model translations relasional.

### F03-CP Checkpoint Summary
Setelah rangkaian sub-batch database relasional dan lokalisasi selesai (F03H–F03L), Project Portfolio System telah diperkuat dengan kemampuan studi kasus multibahasa:
- **Multilingual Database Foundation** (`F03H`): Skema Prisma terstruktur dengan model `ProjectTranslation` relasional untuk mendukung locale `EN`, `ID`, dan `JA` tanpa merusak kompatibilitas field legacy.
- **Public API Locale Support** (`F03I`): Endpoint publik (`/api/projects` & `/api/projects/:slug`) mendukung query parameter `?locale=` dengan fallback otomatis ke `EN` dan mengembalikan respons format flat/non-breaking.
- **Admin EN Translation Sync** (`F03J`): API admin menyinkronkan data legacy dan model translation `EN` secara otomatis di bawah layar ketika admin melakukan create atau update.
- **Public Case Study UI Foundation** (`F03K`): Modal detail proyek di frontend (`ProjectDetailModal.jsx`) siap menampilkan data case study (Context, Problem, Solution, Key Features, Responsibilities, Outcomes) secara kondisional dengan label bahasa Inggris sebagai baseline, tanpa merusak render detail proyek legacy.
- **Admin Case Study Content Editor** (`F03L`): Halaman edit admin dilengkapi section editor studi kasus Inggris (EN) dengan form textareas multiline untuk `keyFeatures`, `responsibilities`, dan `outcomes` (satu baris per item) yang secara dinamis dikonversi ke array di backend.

## Sub-Batch Roadmap
| Sub-Batch | Name | Status | Purpose | Dependency |
|---|---|---|---|---|
| F03A | Portfolio Structure Review | Stable | Struktur UI portofolio. | - |
| F03B | Project Detail Modal Review | Stable | Review desain modal detail. | - |
| F03C | Project Data Polish | Completed | Memperbarui teks dan informasi project. | - |
| F03D | HRD Project Portfolio Curation | Completed | Melakukan kurasi data proyek portofolio berorientasi HRD Full Stack berdasarkan audit kesiapan repository publik. | F03C |
| F03E | Public README Normalization Starter | Partial | Normalisasi README untuk 3 repositori publik kandidat agar tidak duplicate/template dari personal web. | F03D |
| F03F | Public Project Content Cleanup | Completed | Merapikan data/keterangan proyek publik yang tampil di portofolio utama agar lebih rapi untuk HRD, menyesuaikan prioritas featured, dan menurunkan prioritas RumahKu Konstruksi. | F03E |
| F03G | Add Public Project Live and Image Links | Completed | Menambahkan link live dan image yang valid untuk proyek utama (Tien's Catering, Personal Portfolio CMS, Kosuka Bali Trip). | F03F |
| F03H | Project Database Restructure with Multilingual Foundation | Completed | Restrukturisasi skema database Project untuk fondasi konten multilingual & metadata (casing, locale EN/ID/JA) tanpa merusak UI/CMS lama. | F03G |
| F03I | Backend API Adaptation for Project Translation | Completed | Adaptasi REST API publik agar mendukung query parameter locale (?locale=) dengan fallback EN, mengembalikan payload flat dan backward-compatible. | F03H |
| F03J | Admin Project EN Translation Sync / Adaptation | Completed | Adaptasi Admin API agar otomatis membuat/upsert ProjectTranslation locale EN ketika admin melakukan create/update project. | F03I |
| F03K | Public Project Case Study UI Foundation | Completed | Menyiapkan komponen modal detail proyek di frontend agar siap merender data case study secara conditional menggunakan label English. | F03J |
| F03L | Admin Project Case Study Content Editor | Completed | Menambahkan kemampuan Admin Project Form untuk mengelola konten case study default English/EN. | F03K |
| F03-CP | Project Portfolio Checkpoint | Completed | Melakukan checkpoint dokumentasi setelah rangkaian F03H–F03L selesai. | F03L |
| F03M | Public EN/ID Language Switcher Foundation | Completed | Membuat foundation language switcher EN/ID di public site, dictionary lokalisasi, dan request API locale. | F03L |
| F03N | Public Static UI EN/ID Coverage Expansion | Completed | Perluas cakupan bilingual EN/ID ke halaman About, Credentials, Learn, Contact, dan komponen public terkait. | F03M |



## HOLD / Blocked Notes
- Asset finalization masuk ke lingkup F06. Sebagian project data belum komplit sepenuhnya.
- Repository Web-API-Learning-Hub tidak ditemukan di workspace lokal saat ini (diberi status Partial untuk repo tersebut).
- Sinkronisasi remote GitHub: Berkas README.md untuk RumahKuKontruksi-Dev dan TC-Tien-s-Catering baru diperbarui di workspace lokal, dan belum di-commit/push ke remote oleh user.

## Next Step
- F06A — External Asset URL Inventory.
- User sinkronisasi commit/push perubahan README.md lokal pada RumahKuKontruksi-Dev dan TC-Tien-s-Catering ke remote GitHub.
- Clone dan normalisasi README.md untuk Web-API-Learning-Hub setelah repo tersebut tersedia secara lokal.
- Lanjutkan ke sinkronisasi penuh database atau deploy.

## Validation Checklist
- Cek interaksi modal dan filter kategori.
- Pastikan endpoint /api/projects tetap valid dan database local ter-migrate dan ter-seed dengan sukses.
- Cek /api/projects?locale=ID dan /api/projects/:slug?locale=JA mengembalikan response flat yang valid dan aman.
- Cek pembuatan dan pembaruan project dari Admin/API berhasil mensinkronkan data translation EN secara otomatis.
- Pastikan modal detail project menampilkan field case study (Context, Problem, Solution, Key Features, Responsibilities, Outcomes) secara kondisional tanpa memunculkan area kosong/header jika data kosong.
- Cek pengeditan dan pembuatan project baru di admin form dapat mengisi dan menyimpan field case study EN (Role, Project Context, Problem, Solution, Key Features, Responsibilities, Outcomes).
- Pastikan switcher bahasa berfungsi di desktop dan mobile serta menyimpan preferensi di localStorage.

## Notes
- [F03C] Project fallback content (narasi, impact, challenge, solution) telah dipoles untuk menonjolkan identitas Web Developer sambil tetap menghargai nilai lintas disiplin. Aset dan link eksternal final tetap ditangani di F06.
- [F03D] Menyusun ulang prioritas proyek agar menampilkan 4 proyek utama (Personal Portfolio CMS, RumahKu Konstruksi, Tien's Catering, Web API Learning Hub) di prioritas teratas dengan format narasi terstruktur (role, tech stack, fitur, kontribusi, status). Menghindari publikasi link GitHub untuk repositori yang README-nya masih template/duplicate. Normalisasi README repositori tersebut akan ditangani pada batch terpisah. Proyek lainnya diturunkan prioritasnya (featured set ke false).
- [F03E] Normalisasi README.md lokal untuk `RumahKuKontruksi-Dev` dan `TC-Tien-s-Catering` berhasil dilakukan untuk menyajikan informasi yang jujur sebagai case study/candidate project. Namun, status sub-batch adalah **Partial** karena:
  1. Repositori `Web-API-Learning-Hub` tidak tersedia di local workspace.
  2. Perubahan README di `RumahKuKontruksi-Dev` dan `TC-Tien-s-Catering` baru tersimpan secara lokal dan membutuhkan commit/push manual oleh user ke remote GitHub.
  3. **Penting**: Tautan GitHub untuk ketiga repositori kandidat ini belum boleh diaktifkan pada data portofolio publik/seed utama sebelum berkas README di remote GitHub bersih dari template personal web utama.
- [F03F] Melakukan penyelarasan narasi proyek publik di `seed.js`. Proyek utama dirapikan wording-nya agar HRD-friendly (Portfolio CMS, Tien's Catering, Web API Learning Hub, Kosuka Bali Trip). RumahKu Konstruksi dinonaktifkan dari featured list (featured set ke false, order diturunkan ke 7) sesuai instruksi pengguna. Proyek tambahan lainnya tetap dipertahankan dengan prioritas rendah tanpa menghapus data. Normalisasi README repositori luar tidak dilanjutkan.
- [F03G] Menambahkan tautan publik yang valid untuk proyek portfolio utama: Live URL untuk Tien's Catering (https://tc-tien-s-catering.vercel.app), Image URL untuk Personal Portfolio CMS (https://res.cloudinary.com/dlgr9xicg/image/upload/v1781349587/Personal_Web_Syah_Putra_N_makvsf.png), dan Live URL untuk Kosuka Bali Trip (https://kbt-kosuka-bali-trip.vercel.app/). Tidak ada perubahan UI, schema, backend logic, atau database langsung.
- [F03H] Pengalihan scope dari sinkronisasi link Neon menjadi restrukturisasi basis data untuk mendukung multibahasa (EN/ID/JA) dan tipe proyek (ProjectType/ProjectWorkStatus). Integrasi data multilingual ditambahkan sebagai ProjectTranslation yang terhubung relasional dengan Project. Field original (title, shortDescription, description) dipertahaman demi backward compatibility agar tidak memecah UI frontend dan backend controller. Seed dan sync script telah diupdate untuk membuat minimal translation EN untuk setiap project.
- [F03I] Mengadaptasi REST API publik (/api/projects dan /api/projects/:slug) untuk mendukung parameter kueri ?locale= (EN/ID/JA). Mapper helper dibuat di src/utils/projectTranslationMapper.js untuk menangani normalisasi locale case-insensitive dan fallback bertingkat (Requested locale -> EN -> Legacy Project fields) secara aman. Response yang dikembalikan tetap dalam bentuk objek flat non-breaking untuk menjaga backward compatibility penuh dengan UI frontend dan library HTTP client lama. Raw translations array tidak diekspos demi keamanan, dan informasi pendukung berupa locale efektif serta availableLocales ditambahkan pada payload utama.
- [F03J] Mengadaptasi Admin Project API (create, update, getById) agar sinkronisasi `ProjectTranslation` locale `EN` otomatis dikelola backend tanpa memecah form admin lama (backward compatible payload). Project detail by ID sekarang mengembalikan object lengkap include `translations`. Pembuatan project baru otomatis membuat record translations EN, dan update project otomatis meng-upsert translations EN (menyinkronkan legacy fields dan optional `role` jika disertakan).
- [F03K] Menyiapkan fondasi UI case study di frontend dan backend. Di sisi server, mapper `projectTranslationMapper.js` diperbarui agar menyertakan semua parameter case study flat (`projectContext`, `problem`, `solution` terjemahan, `keyFeatures`, `responsibilities`, `outcomes`). Di sisi client, `ProjectDetailModal.jsx` dimodifikasi agar merender section case study secara kondisional (hanya tampil jika data tersedia dan tidak memakan ruang/membuat layout janggal jika datanya kosong) menggunakan penamaan label bahasa Inggris sebagai baseline. Skema rendering legacy (Fitur Utama, Tantangan & Solusi lama) tetap dipertahankan demi backward compatibility.
- [F03L] Mengintegrasikan form editor studi kasus Inggris (EN) ke Admin Project Form (`ProjectForm.jsx`) dengan menambahkan input `role`, textarea `projectContext`, `problem`, `solution`, serta multiline textareas untuk `keyFeatures`, `responsibilities`, dan `outcomes` (satu baris per item). Admin CRUD API (`adminProjects.controller.js`) diperbarui untuk memvalidasi parameter array ini dan menyimpannya langsung pada record `ProjectTranslation` locale `EN`. `AdminProjectEdit.jsx` memflaten data EN ke dalam form `initialData` agar edit ulang berjalan dengan benar.
- [F03-CP] Melakukan checkpoint dokumentasi setelah seluruh rangkaian implementasi multilingual case study selesai. Menyelaraskan status pada index utama history dan status aktif di berkas status global, serta memastikan integritas logic database dan visual page stabil.
- [F03M] Membuat fondasi lokalisasi multibahasa di public site. Mengimplementasikan `LanguageProvider` dan context hook untuk mengelola state bahasa aktif (default: `EN`), menyimpan preferensi di `localStorage` (`pw_locale`), serta menyediakan dictionary map lokal (`client/src/i18n.js`) untuk element statis web (Navbar, Home, Experience, Projects, detail modal). Halaman Projects disesuaikan untuk menyuntikkan parameter kueri `?locale=${locale}` secara otomatis dalam request data proyek ke backend API.
- [F03N] Memperluas cakupan bilingual EN/ID ke halaman publik yang belum tersentuh (About, Credentials, Learn, Contact) beserta komponen pendukung publik (CredentialCard, CredentialModal). Melakukan inlining komponen `ExperienceReframing` dan `CredentialsSection` agar dapat diterjemahkan secara bersih tanpa merusak batas modifikasi berkas.
