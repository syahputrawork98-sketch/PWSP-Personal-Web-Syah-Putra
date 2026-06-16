# Backend Documentation

## Fungsi Folder
Folder ini berisi dokumentasi teknis khusus untuk backend, termasuk API, server logic, struktur server, dan koneksi frontend-backend.

## Status Backend Saat Ini
- **Backend Deployment**: Live on Railway
- **Backend Runtime**: Verified
- **Backend API Logic**: Completed
- **Backend as Production Data Source**: Active with fallback-supported frontend (jika backend tidak aktif/merespons, frontend akan menggunakan data statis lokal secara aman)
- **Admin/Auth API Exposure**: Available in production environment with security/env configuration required; access should remain restricted to admin (tidak terekspos secara publik untuk umum)

## Kapan Update Dokumen Ini
Dokumen di dalam folder ini harus diupdate ketika backend mulai aktif, API endpoint baru dibuat, atau saat mengatur variabel lingkungan.

## Hubungan dengan Feature Batch
Sangat berkaitan dengan **F07 Backend API System** dan **F08 Admin Login and Auth System**. Dokumentasi teknis backend ditulis di sini saat fitur tersebut dihidupkan.
- Lihat [Admin Auth Requirements](ADMIN_AUTH_REQUIREMENT.md) - Definisi spesifikasi dan batasan kebutuhan login (F08).
- Lihat [Auth Flow Design](AUTH_FLOW_DESIGN.md) - Desain alur autentikasi dan arsitektur otorisasi admin (F08).
- Lihat [Auth Security QA](AUTH_SECURITY_QA.md) - Laporan jaminan kualitas dan audit keamanan akses *backend/frontend* (F08).
- [Admin CMS Scope](ADMIN_CMS_SCOPE.md) - Perumusan ruang lingkup pembangunan modul CMS (F09).
- [Project Management CMS QA](PROJECT_MANAGEMENT_CMS_QA.md) - Laporan audit validasi *Project Management Module* (F09B.1).
- [Credential Management CMS QA](CREDENTIAL_MANAGEMENT_CMS_QA.md) - Laporan audit validasi *Credential Management Module* (F09C.1).
- [CV and Asset Link Management CMS QA](CV_ASSET_LINK_CMS_QA.md) - Laporan audit tautan aset dan konfigurasi CV (F09D.1).
- [Profile and Settings Management CMS QA](PROFILE_SETTINGS_CMS_QA.md) - Laporan audit validasi konfigurasi hero, profile, dan contact (F09E.1).
- Pengecekan Kesiapan *Credential Management* (F09G) telah diaudit. Checklist pengujian manual tersedia di laporan eksekusi, dengan alur CRUD Credential tersambung dan endpoint API tervalidasi strukturnya.

## Area Backend yang Dicatat
- server structure
- API routes
- environment variables example
- auth/session/token (jika nanti aktif)
- security notes

## Validasi Backend Minimal
- Pastikan database lokal PostgreSQL sudah hidup (lihat panduan di `docs/database/README.md`).
- `cd server`
- `npm install`
- `npm run dev`
- Buka `http://localhost:5000/api/health`
- Cek server start jika file backend disentuh.
- Cek API endpoint bila dibuat atau diubah.
- Pastikan tidak ada `secret` atau `.env` yang ter-commit.

## Catatan Penting
- Auth/Admin API telah disiapkan secara aman dalam lingkungan produksi dengan konfigurasi variabel lingkungan yang sesuai.
- **[F07-CP]** Audit checkpoint awal backend telah selesai.
- Local dev credentials (Hanya untuk Development Lokal): Saat menjalankan aplikasi lokal, admin dapat masuk dengan email `admin@example.com` dan password `qwerty123`. Catatan: password di database Prisma Studio di-*hash* untuk keamanan. Jangan gunakan kredensial ini di lingkungan production.

## Frontend Backend Connection Notes
- Frontend membaca API base URL dari `VITE_API_URL`.
- Default local API adalah `http://localhost:5000`.
- Server local default berjalan di `PORT=5000`.
- Client Vite local umumnya berjalan di `http://localhost:5173`.
- CORS server sudah disiapkan untuk local client.
- Jika backend mati, frontend tetap aman menggunakan fallback data untuk area yang sudah punya fallback.
- Backend as Production Data Source: Active with fallback-supported frontend.
- Auth/Admin: Available in production environment with security/env configuration required; access should remain restricted to admin.

## Production Deployment Strategy
1. **Hosting:** Direkomendasikan menggunakan PaaS seperti Render (Free Tier tapi dengan sleep mode) atau Railway (Murah tanpa sleep) karena Express.js bersifat stateful dan tidak cocok dideploy murni sebagai serverless function di Vercel. VPS juga bisa dipakai namun butuh manajemen server mandiri.
2. **Environment Variables:** Wajib mengkonfigurasi `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `CLIENT_URL` di server production.
3. **CORS:** Variabel `CLIENT_URL` wajib berisi domain spesifik frontend production (misal `https://syahputrawork.com`) agar endpoint terlindungi dengan aman.
4. **Auth Warning:** Password default admin dari seed wajib segera diganti setelah server production aktif.

## API Scope Map

| Area | Endpoint Pattern | Status | Source File | Catatan |
|---|---|---|---|---|
| Public | `GET /api/health` | Boleh Audit F07 | `server/src/app.js` | Endpoint sederhana untuk health check. |
| Public | `GET /api/projects` | Boleh Audit F07 | `server/src/routes/public/projects.routes.js` | Daftar semua proyek portfolio. Mendukung kueri parameter `?locale=EN/ID/JA` dengan fallback otomatis ke `EN` dan mengembalikan respons flat (non-breaking) berisi data terjemahan, `locale`, dan `availableLocales`. |
| Public | `GET /api/projects/:slug` | Boleh Audit F07 | `server/src/routes/public/projects.routes.js` | Detail proyek spesifik. Mendukung kueri parameter `?locale=EN/ID/JA` dengan fallback otomatis ke `EN` dan mengembalikan respons flat berisi data terjemahan, `locale`, dan `availableLocales`. |
| Public | `GET /api/settings/contact` | Boleh Audit F07 | `server/src/routes/settings.routes.js` | Info kontak publik. |
| Public | `GET /api/settings/hero` | Boleh Audit F07 | `server/src/routes/settings.routes.js` | Info hero section. |
| Public | `GET /api/settings/profile` | Boleh Audit F07 | `server/src/routes/settings.routes.js` | Info profil utama. |
| Public | `GET /api/education` | Boleh Audit F07 | `server/src/routes/education.routes.js` | Data edukasi. |
| Public | `GET /api/skills` | Boleh Audit F07 | `server/src/routes/skills.routes.js` | Data keahlian. |
| Public | `GET /api/experiences` | Boleh Audit F07 | `server/src/routes/experience.routes.js` | Pengalaman kerja. |
| Public | `GET /api/certifications` | Boleh Audit F07 | `server/src/routes/certification.routes.js` | Data sertifikasi/credentials. |
| Auth | `/api/auth/*` | Completed (Restricted to Admin) | `server/src/routes/auth.routes.js` | Endpoint autentikasi admin. |
| Admin | `/api/admin/cv-builder/*` | Completed (Restricted to Admin) | `server/src/routes/admin/cv-builder.routes.js` | Endpoint tata letak & JSON Config CV Builder. |
| Admin | `/api/admin/*` | Completed (Restricted to Admin) | `server/src/routes/admin/*.routes.js` | Endpoint proteksi admin (CMS). Khusus untuk API Project, getById mengembalikan relasi `translations`. Create/update mendukung objek `translations` berisi data EN/ID/JA. EN wajib. Untuk ID/JA opsional; jika dikirim dalam keadaan kosong total, record terjemahan tersebut akan dihapus untuk menjaga mekanisme fallback ke EN. |
| Public | `GET /api/cv/active` | F11 Config Contract | `server/src/routes/cv.routes.js` | Menyajikan URL berkas statis PDF CV final. |

## Experience API Locale Mapping Extensions (F03S.2 Applied)

### Admin Experience Controller Updates
- **`GET /api/admin/experiences` & `GET /api/admin/experiences/:id`**: Diperbarui (Applied) agar menyertakan relasi `translations` array.
- **`POST /api/admin/experiences`** & **`PUT /api/admin/experiences/:id`**: Diperbarui (Applied) agar menyertakan relasi `translations` pada respons objek pasca pembuatan/pembaruan (upsert logic akan ditangani penuh pada Batch F03S.3).

### Public Experience API Updates
- **`GET /api/experiences`**: Mendukung query parameter `?locale=EN/ID/JA` (Applied).
  - Mengambil data dari tabel `ExperienceTranslation` relasional berdasarkan parameter locale.
  - **Fallback**: Jika terjemahan untuk locale yang diminta tidak ada, sistem akan fallback mencari data terjemahan `EN`. Jika `EN` pun kosong/tidak ada, sistem menggunakan data kolom legacy di tabel `Experience` utama.
  - Respons dikembalikan dalam format objek flat backward-compatible dengan client-side lama, tetapi diperkaya dengan kolom `locale` (locale efektif yang digunakan) dan `availableLocales`.

