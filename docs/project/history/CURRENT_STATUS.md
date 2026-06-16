# Current Status

## Project Snapshot
- Nama project: PW Personal Web
- Status website publik: stabil
- Source of Truth: GitHub
- Workspace utama: Anti-Gravity IDE
- Commit/push: dilakukan oleh user
- Default model eksekutor: Gemini 3.5 Flash Low / Medium / High
- Alternative acceleration model: N/A (Gemini 3.5 Flash adalah model standar project)

## Active Feature Tracker

| Feature Batch | Feature Name | Area | Status | Reason / HOLD Notes | Next Step | Detail File |
|---|---|---|---|---|---|---|
| F00 | Project Workflow Reset | docs/project | Completed | Reset sistem history lama ke feature-based tracking | F01 bila reset selesai | [F00_PROJECT_WORKFLOW_RESET.md](features/F00_PROJECT_WORKFLOW_RESET.md) |
| F01 | Public Website Core System | frontend | Stable | Fondasi website publik sudah berjalan | Review hanya jika ada redesign besar | [F01_PUBLIC_WEBSITE_CORE_SYSTEM.md](features/F01_PUBLIC_WEBSITE_CORE_SYSTEM.md) |
| F02 | Profile and Experience Content System | frontend/content | Stable / Content Reviewed | Profile, experience, skill, dan education sudah direview secara komprehensif. | F04A — Credential Data Verification | [F02_PROFILE_EXPERIENCE_CONTENT_SYSTEM.md](features/F02_PROFILE_EXPERIENCE_CONTENT_SYSTEM.md) |
| F03 | Project Portfolio System | frontend/backend | Completed | Multilingual database foundation, public API locale support, admin translation sync, public case study UI, and admin case study editor completed. | Lanjutkan ke fitur selanjutnya / deploy | [F03_PROJECT_PORTFOLIO_SYSTEM.md](features/F03_PROJECT_PORTFOLIO_SYSTEM.md) |
| F04 | Credential and Certificate System | frontend/data | Completed | Data credential, preview, dan public metadata sudah direview. Dry-run sync verifikasi selesai dilakukan. | F04L — BNSP Target Sync ID Alignment | [F04_CREDENTIAL_CERTIFICATE_SYSTEM.md](features/F04_CREDENTIAL_CERTIFICATE_SYSTEM.md) |
| F05 | CV Download System | frontend/assets | Completed | UI/QA siap, public UI sudah mengarah ke file PDF final (ATS) statis. | Lanjutkan ke fitur selanjutnya / deploy | [F05_CV_DOWNLOAD_SYSTEM.md](features/F05_CV_DOWNLOAD_SYSTEM.md) |
| F06 | Asset Link and Preview System | frontend/data | Partial / Inventory Ready | Inventory sudah dibuat, tetapi URL final masih menunggu input user. | F06B — Public Access Verification after final URL input | [F06_ASSET_LINK_PREVIEW_SYSTEM.md](features/F06_ASSET_LINK_PREVIEW_SYSTEM.md) |
| F07 | Backend API System | server | Completed | Seluruh siklus F07 telah divalidasi (F07A-F07H). Docker, Prisma, Backend, dan koneksi Frontend terverifikasi secara runtime. | Lanjutkan ke fitur selanjutnya / deploy | [F07_BACKEND_API_SYSTEM.md](features/F07_BACKEND_API_SYSTEM.md) |
| F08 | Admin Login and Auth System | backend/auth | Completed | Rangkaian skeleton *backend/frontend* auth sudah diverifikasi penuh melalui Basic Security QA dan dinyatakan aman (*logic siap*). | (Selesai, lanjutkan ke F09) | [F08_ADMIN_LOGIN_AUTH_SYSTEM.md](features/F08_ADMIN_LOGIN_AUTH_SYSTEM.md) |
| F09 | Admin Content Management System | frontend/backend | Completed | Modul CMS telah diselesaikan audit fungsionalitas dan perlindungan autentikasinya untuk Project, Credential, Asset Link, dan Settings Module. | (Selesai, lanjutkan ke F10) | [F09_ADMIN_CONTENT_MANAGEMENT_SYSTEM.md](features/F09_ADMIN_CONTENT_MANAGEMENT_SYSTEM.md) |
| F10 | Deployment and Domain System | deployment | Completed / Production Live | Production deployment aktif di Vercel, Railway, dan Neon PostgreSQL. | Monitoring dan setup custom domain opsional | [F10_DEPLOYMENT_DOMAIN_SYSTEM.md](features/F10_DEPLOYMENT_DOMAIN_SYSTEM.md) |
| F11 | CV Builder and PDF Export System | frontend/admin | Completed | CV Builder admin telah mendukung manual curated mode, variant preset, contact override, component split, flow-based preview, dan browser print PDF. | Optional print/PDF QA atau backend config validation jika dibutuhkan | [F11_CV_BUILDER_PDF_EXPORT_SYSTEM.md](features/F11_CV_BUILDER_PDF_EXPORT_SYSTEM.md) |
| F12 | Learning Library System | frontend | Completed | Learning Library public page, admin CMS, backend API, and dynamic public integration completed. | Lanjutkan ke fitur berikutnya / deploy | [F12_LEARNING_LIBRARY_SYSTEM.md](features/F12_LEARNING_LIBRARY_SYSTEM.md) |
| F13 | Mobile Responsive UI Improvement | frontend | Completed | Penyesuaian layout CSS murni untuk public mobile screen (navbar, hero, projects). | Final QA mobile view | [F13_MOBILE_RESPONSIVE_UI_IMPROVEMENT.md](features/F13_MOBILE_RESPONSIVE_UI_IMPROVEMENT.md) |
| F14 | Repository Normalization and Documentation Sync | docs/status | Partial / Backend Audit Ready | Docs sync, repository inventory, frontend audit, and backend/API audit completed. | F14E — Database/Prisma Audit atau F14F — Cleanup Candidates Validation | [F14_REPOSITORY_NORMALIZATION_DOCUMENTATION_SYNC.md](features/F14_REPOSITORY_NORMALIZATION_DOCUMENTATION_SYNC.md) |
| F15 | HRD Portfolio Score Improvement | frontend/content | Completed | SEO static snapshot and recruiter readability baseline completed. | F15F — Security and GitHub Recruiter Audit | [F15_HRD_PORTFOLIO_SCORE_IMPROVEMENT.md](features/F15_HRD_PORTFOLIO_SCORE_IMPROVEMENT.md) |

## Deployment Status
- **Status Deployment**: Aktif / Live
- **Frontend (Vercel)**: Live pada URL [https://syahputran.vercel.app/](https://syahputran.vercel.app/) (Root: `client`)
- **Backend (Railway)**: Live pada URL `selfless-victory-production-350f.up.railway.app` (Root: `server`)
- **Database (Neon PostgreSQL)**: Managed PostgreSQL aktif pada branch `production` (ORM: Prisma)
- **API Endpoint Integration**: Menggunakan environment variable `VITE_API_URL` pada Vercel yang mengarah ke backend Railway.
- **Custom Domain**: Opsional / belum final.



## Safety Rules
- Jangan menyimpan credential, token, API key, password, atau .env di repository.
- Jangan mengubah client/server tanpa scope batch yang jelas.
- Jangan commit/push oleh eksekutor.
- Commit/push dilakukan oleh user setelah hasil dicek di Anti-Gravity IDE.

