# Batch F02 — Profile and Experience Content System

## Feature Summary
Konten dasar profil, experience, education, dan skill.

## Status
Completed

## Story
Mencakup halaman profil, pengalaman, edukasi, skill, dan narasi personal branding. Mengkomunikasikan keahlian profesional user ke pengunjung.

## Current State
- Placeholder atau data awal telah tersedia.
- Narasi personal branding telah ada namun mungkin membutuhkan revisi.
- Konten diselaraskan dengan kebutuhan rekrutmen Full Stack Web Developer profesional berdasarkan evaluasi HRD/recruitment (Batch F02D).

## Sub-Batch Roadmap
| Sub-Batch | Name | Status | Purpose | Dependency |
|---|---|---|---|---|
| F02A | Profile Content Review | Completed | Meninjau deskripsi profil. | - |
| F02B | Experience Content Polish | Completed | Memperbarui pengalaman kerja. | - |
| F02C | Skill and Education Review | Completed | Memperbarui list skill dan edukasi. | - |
| F02D | HRD Recruitment Content Alignment | Completed | Menyelaraskan konten profil, hero, experience, dan framing skill untuk kebutuhan rekrutmen Full Stack Web Developer. | F02C |
| F02D.1 | Fix Seed Syntax Regression | Completed | Memperbaiki syntax error di seed.js pasca Batch F02D. | F02D |
| F02E | Experience Cleanup & Recruiter Polish | Completed | Merapikan segmentasi, wording, dan cross-navigation antara Experience dan Project Portfolio. | F02D.1 |

## HOLD / Blocked Notes
- Tidak ada blocker aktif.

## Next Step
- F04A — Credential Data Verification

## Validation Checklist
- Periksa konsistensi narasi di halaman profil/beranda.

## Notes
- Data bisa langsung diperbarui di source code atau lewat CMS jika kelak tersedia.
- [F02A] Profil narasi telah diperbarui untuk lebih menonjolkan identitas sebagai Web Developer / Full Stack Developer dengan 8+ tahun pengalaman lintas bidang.
- [F02B] Experience fallback telah dipoles untuk memperkuat narasi Web Developer, menambahkan techStack dan highlights, serta merepresentasikan pengalaman lama sebagai keunggulan digitalisasi lintas bidang.
- [F02C] Skill fallback diubah ke struktur array dengan penambahan skill teknis dan soft skill lengkap; education fallback dipoles narasi akademisnya.
- [F02D] Narasi profil, hero, dan detail pengalaman freelance diperkuat secara teknis (React/Node/Express/Postgres/MySQL) dengan framing profesional (Full-Stack Implementation, Operational System Thinking, Reliable Delivery) dan pemisahan yang jelas antara pengalaman web dev aktif dengan latar belakang operasional lintas bidang.
- [F02D.1] Memperbaiki syntax error/regression pada `server/prisma/seed.js` akibat baris pemanggilan `console.log` yang terputus saat integrasi sub-batch F02D.
- [F02E] Merapikan halaman pengalaman kerja (`Experience.jsx`) dengan menambahkan visual header terpusat yang menjelaskan perbedaan peran halaman Pengalaman (kerja/profesional) dengan halaman Portfolio (bukti teknis/studi kasus) serta menyematkan tautan langsung ke halaman Portfolio. Melakukan segmentasi warna indikator dan garis tepi card secara dinamis (`ExperienceCard.jsx`) berdasarkan jenis pengalaman (IT, formal, non-IT) untuk kenyamanan recruiter.
