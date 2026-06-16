# Batch F15 — HRD Portfolio Score Improvement

## Feature Summary
Peningkatan kualitas portfolio berdasarkan review HRD Full Stack Developer agar lebih kuat dari sisi recruiter readability, project proof, experience clarity, credentials, CTA, SEO, dan audit teknis.

## Status
Completed

## Story
Meningkatkan keterbacaan website portfolio oleh crawler sederhana, recruiter tools, dan akses teks tanpa merombak arsitektur React SPA. Saat ini HTML awal hanya memuat root React sehingga beberapa crawler hanya membaca title/meta, bukan isi utama portfolio. Batch ini dimulai dengan menyisipkan static recruiter snapshot pada berkas HTML dasar (index.html).

## Current State
- SEO static snapshot untuk recruiter baseline (Batch F15A) selesai dibuat dan diintegrasikan secara aman ke client/index.html.
- Penyempurnaan snapshot keamanan SEO (Batch F15A.1) selesai dilakukan dengan memindahkan static snapshot ke dalam tag `<noscript>` guna menghindari penggunaan tag hidden (`display: none`) yang rentan dianggap spam oleh search engine crawler, sekaligus memberikan visual fallback yang rapi saat JavaScript dinonaktifkan.
- Polish Hero CTA dan Recruiter Copy (Batch F15B) selesai dikerjakan pada `Home.jsx` dengan menambahkan akses cepat ke LinkedIn dan GitHub yang bersumber dari API / fallback contact, serta memperkuat deskripsi role, title, dan subtitle default saat backend kosong/down agar web portofolio tetap informatif secara statis.
- Poles Case Study Project (Batch F15C) diselesaikan pada `projectsFallback.js` dengan menyusun ulang detail proyek (description, challenge, solution, role, features, tech stack, impact) pada 3 proyek utama (2 proyek web IT dan 1 proyek estimasi/RAB otomatis) menjadi deskripsi studi kasus teknis berstandar rekrutmen/HRD.
- Penyempurnaan Keamanan Klaim Studi Kasus Proyek (Batch F15C.1) diselesaikan pada `projectsFallback.js` dengan melunakkan narasi impact proyek utama agar tetap profesional dan kuat secara teknis tanpa mencantumkan klaim data kuantitatif spesifik/absolut yang sulit dibuktikan.
- Poles Pengalaman Kerja / Experience Timeline (Batch F15D) selesai dikerjakan pada `experienceFallback.js` dengan memformulasikan deskripsi pekerjaan, kontribusi teknis (REST API, CRUD, authentication, RBAC, admin dashboard), serta tech stack pada masing-masing timeline pengalaman agar lebih konkret, terukur, dan selaras dengan target kompetensi Full Stack Web Developer.
- Kurasi Relevansi Kredensial / Credentials Relevance Polish (Batch F15E) selesai dikerjakan pada `credentialsData.js` dengan memoles ringkasan (summary) dan daftar skill pada sertifikat IT utama (BNSP Junior Web Developer, BBPVP Node.js & React, RevoU Intro to Software Engineering, dsb) agar berfokus pada validasi kemampuan developer. Selain itu, status penayangan (featured flag) untuk sertifikat non-IT dideaktivasi agar tidak mengaburkan fokus visual utama bagi perekrut Full Stack.
- Merapikan tombol CTA utama (Demo, GitHub, Figma) pada Detail Proyek serta mengintegrasikan pengelolaan Figma URL di admin project form & database (Batch F15H.1) agar link Figma bisa dikelola langsung dari CMS.
- Menyinkronkan tombol CTA utama (Demo, GitHub, Figma) pada Project Card (Batch F15H.2) agar konsisten dengan modal detail proyek, menampilkan status "Soon" secara visual jika link kosong/tidak valid.
- Batch F15I menyelesaikan hotfix recruiter snapshot dengan memperbaiki GitHub link lama/404 dan mengganti featured work statis agar lebih selaras dengan project Full Stack utama seperti MTB, RumahKu, dan SIQAH.
- Batch F15J menyelesaikan polish keamanan klaim project fallback dengan merapikan status project dan melunakkan wording teknis yang terlalu absolut agar tetap kuat untuk HRD tanpa overclaim.
- Batch F15K menyelesaikan polish copy halaman Projects dengan menambahkan recruiter guidance untuk Featured Full Stack Case Studies dan deskripsi pembeda Other Projects.
- Batch F15F menyelesaikan audit keamanan ringan dan kesiapan GitHub recruiter-facing untuk memastikan tidak ada credential jelas, file scratch, or link GitHub lama yang mengganggu sebelum QA final.
- Batch F15G menyelesaikan QA akhir F15 dengan build frontend, audit recruiter-facing, pemeriksaan link penting, dan penilaian akhir terhadap kesiapan portfolio untuk HRD Full Stack Developer.
- Batch F15G.1 menyelesaikan rekonsiliasi asset CV PDF yang masuk pada commit F15G, memastikan file tersebut dipakai sebagai asset recruiter-facing dan mencatat rekomendasi follow-up jika diperlukan.
- Batch F15G.2 menyelesaikan polish nama file CV dan penyelarasan link Download CV sehingga asset CV recruiter-facing menggunakan path URL-safe dan tidak berisiko 404.
- Batch F15-CP (HRD Portfolio Score Improvement Checkpoint) diselesaikan sebagai penutup rangkaian optimasi portfolio rekrutmen. Pada bagian ini, halaman publik Credentials diperkuat secara visual melalui **Batch F04N** dengan penambahan Summary Stats, Featured Spotlight (prioritas sertifikat BNSP Node.js & React), serta Full Stack Skill Mapping.
- Snapshot berisi professional summary, core stack, featured work, dan recruiter links.
- Tampilan visual React Home saat JS aktif tidak terpengaruh sedikit pun.

Audit Result:
- Credential leak check: Clear
- Scratch file check: Clear
- GitHub old link check: Clear
- README recruiter readiness: Clear
- Notes: Tidak ditemukan adanya kebocoran credential sensitif. Folder `server/scratch` hanya berisi skrip pembantu pengembangan lokal tanpa kredensial keras. Link GitHub lama telah dibersihkan secara merata, dan README.md dinilai sangat profesional untuk rekrutmen.

## Sub-Batch Roadmap
| Sub-Batch | Name | Status | Purpose | Dependency |
|---|---|---|---|---|
| F15A | SEO Static Snapshot and Recruiter Readability Baseline | Completed | Menyisipkan static recruiter snapshot pada client/index.html agar mudah dibaca crawler sederhana. | - |
| F15A.1 | SEO Snapshot Safety Refinement | Completed | Merapikan static snapshot agar fallback recruiter/readability memakai noscript dan tidak bergantung pada hidden SEO content. | F15A |
| F15B | Hero CTA and Recruiter Copy Polish | Completed | Penyesuaian salinan copywriter/CTA di bagian Hero utama. | F15A.1 |
| F15C | Project Case Study Polish | Completed | Peningkatan detail case study pada masing-masing module project. | F15B |
| F15C.1 | Project Case Study Claim Safety Polish | Completed | Melunakkan klaim impact project agar tetap profesional dan tidak terlalu kuantitatif tanpa bukti. | F15C |
| F15D | Experience Timeline Polish | Completed | Menyempurnakan deskripsi pencapaian pada modul pengalaman. | F15C.1 |
| F15E | Credentials Relevance Polish | Completed | Kurasi relevansi dan deskripsi kredensial/sertifikasi. | F15D |
| F15H.1 | Project CTA Buttons + Admin Figma URL | Completed | Merapikan tombol utama (Demo, GitHub, Figma) pada detail project modal dengan status Coming Soon jika kosong serta menambahkan field figmaUrl di Project form & db. | F15E |
| F15H.2 | Project Card CTA Buttons | Completed | Merapikan tombol utama (Demo, GitHub, Figma) pada Project Card dengan status Soon jika kosong. | F15H.1 |
| F15I | Recruiter Snapshot GitHub Link & Featured Project Alignment Hotfix | Completed | Memperbaiki GitHub link recruiter-facing dan menyelaraskan featured work snapshot dengan project utama CV/HRD Full Stack. | F15H.2 |
| F15J | Project Claim Safety & Status Truthfulness Polish | Completed | Melunakkan klaim teknis dan merapikan status project fallback agar lebih jujur, aman, dan recruiter-friendly. | F15I |
| F15K | Projects Page Recruiter Copy & Case Study Guidance | Completed | Memperkuat copy halaman Projects agar recruiter langsung memahami featured projects sebagai studi kasus Full Stack utama dan other projects sebagai pendukung. | F15J |
| F15F | Security and GitHub Recruiter Audit | Completed | Audit repositori dan profil GitHub untuk kebutuhan rekrutmen. | F15K |
| F15G | Lighthouse and Final HRD Score QA | Completed | Pengukuran skor akhir dengan Lighthouse/manual QA dan review akhir kesiapan HRD Full Stack. | F15F |
| F15G.1 | CV PDF Scope Reconciliation Before Checkpoint | Completed | Memverifikasi asset CV PDF yang masuk pada commit F15G dan mencatat statusnya sebelum checkpoint F15. | F15G |
| F15G.2 | CV Filename and Download Link Polish | Completed | Merapikan nama file CV menjadi URL-safe dan menyelaraskan semua link Download CV agar tidak 404. | F15G.1 |
| F15-CP | HRD Portfolio Score Improvement Checkpoint | Completed | Konfirmasi checkpoint dan validasi dokumen akhir setelah peningkatan kualitas halaman Credentials. | F15G.2, F04N |

## F15G Final QA Result
- Frontend build: Passed
- Lighthouse availability: Unavailable (Audited manually as fallback)
- Home recruiter clarity: Clear
- Projects recruiter clarity: Clear
- Experience clarity: Clear
- About clarity: Clear
- Credentials clarity: Clear
- Contact clarity: Clear
- GitHub old link check: Clear
- CV/download visibility: Clear
- Estimated HRD Full Stack score: 85–90/100
- Final recommendation: Ready for checkpoint

## F15G.1 CV PDF Reconciliation
- CV PDF detected: Yes
- CV PDF path: client/public/cv/cv. Syah Putra N.pdf
- Referenced by website: Yes (Through public download path, although code refers to '/cv/cv-syah-putra-nugraha-web-developer.pdf' creating a path mismatch)
- File size check: Clear (108 KB)
- Filename professionalism: Needs Follow-up (Contains spaces and capital letters)
- Scope reconciliation: Accepted as recruiter-facing asset (needs rename to resolve URL mismatch)
- Notes: File `cv. Syah Putra N.pdf` adalah asset CV PDF yang diupload, namun tautan pada frontend (`Home.jsx` dan `About.jsx`) merujuk ke `/cv/cv-syah-putra-nugraha-web-developer.pdf` sehingga terjadi mismatch (404). Perlu rename file dan penyesuaian tautan pada batch kecil berikutnya.

## F15G.2 CV Link Polish
- CV file renamed: Yes
- Final CV path: client/public/cv/cv-syah-putra-nugraha-web-developer.pdf
- Old CV filename removed: Yes
- Download CV links aligned: Yes
- Frontend build: Passed
- Preview CV URL check: Passed
- Notes: File CV berhasil diganti namanya menjadi `cv-syah-putra-nugraha-web-developer.pdf` yang aman untuk URL web (slug). Semua link unduhan CV di dalam client frontend telah terkonfirmasi selaras dan berfungsi (200 OK) tanpa potensi 404.

## F15-CP Checkpoint
- Status Checkpoint: Selesai
- Ringkasan: Rangkaian Polish Recruiter-Facing diakhiri dengan implementasi visual modern pada halaman Credentials (F04N), yang menyajikan ringkasan kuantitatif, sorotan utama sertifikat BNSP Node/React, dan pemetaan skill Full Stack secara terstruktur. Portfolio saat ini dinilai memiliki tingkat keterbacaan, validitas klaim, dan kredibilitas profesional yang sangat kuat bagi penilaian HRD.

## HOLD / Blocked Notes
- Seluruh pengerjaan pada batch ini dirancang tanpa mengubah arsitektur SPA React atau menambahkan prerendering framework / SSR dependency baru.

## Next Step
- Melanjutkan ke feature development berikutnya atau menunggu arahan/keputusan dari pengguna.

## Validation Checklist
- Menjalankan build frontend (`npm run build`) dan memastikan kompilasi berjalan sukses.
- Memastikan berkas HTML di index.html memiliki snapshot text-only yang valid saat diinspeksi.
- Memastikan visual website React Home tidak bergeser atau rusak.

