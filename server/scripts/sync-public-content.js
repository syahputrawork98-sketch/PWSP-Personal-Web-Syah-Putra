/**
 * Safe Full Public Content Sync Script
 * 
 * Synchronizes public data (Settings, Skills, Experiences, Projects, Credentials, FeaturedCredentials)
 * from the repository files to the database (Neon production or local development)
 * without triggering a full seed (which deletes live data like custom users/projects).
 * 
 * Usage:
 * - Dry Run (Default):
 *   node scripts/sync-public-content.js
 * 
 * - Apply changes:
 *   APPLY_PUBLIC_CONTENT_SYNC=true node scripts/sync-public-content.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define data inline from seed.js for safety and portability

const siteSettings = [
  {
    key: 'hero',
    value: {
      name: 'Syah Putra Nugraha',
      roles: ['Full Stack Web Developer', 'Digital Operations Specialist'],
      title: 'Full Stack Web Developer yang membangun aplikasi web, dashboard, REST API, dan sistem digital berbasis kebutuhan operasional.',
      subtitle: 'Fokus mengembangkan sistem web terintegrasi menggunakan React, Node.js, Express, dan PostgreSQL/MySQL. Memiliki latar belakang kuat di bidang IT support dan operasional proyek yang menjadi nilai tambah dalam merancang aplikasi bisnis yang andal dan solutif.',
      primaryCtaLabel: 'Lihat Proyek',
      secondaryCtaLabel: 'Download CV',
      resumeUrl: '/cv/cv-syah-putra-nugraha-web-developer.pdf'
    }
  },
  {
    key: 'profile',
    value: {
      aboutTitle: 'About Me',
      summaryTitle: 'Professional Summary',
      summary: 'Saya adalah seorang Full Stack Web Developer yang berdedikasi dalam membangun aplikasi web yang handal, efisien, dan selaras dengan kebutuhan operasional pengguna.<br/><br/>Dengan keahlian di bidang frontend dan backend menggunakan React.js, Node.js, Express.js, PHP, MySQL, PostgreSQL, dan MongoDB, saya terbiasa mengembangkan sistem secara end-to-end mulai dari perancangan arsitektur database, pembuatan REST API, mekanisme otentikasi JWT, hingga antarmuka pengguna yang responsif.<br/><br/>Memiliki latar belakang pengalaman kerja di bidang IT support, administrasi proyek, general affair, dan digitalisasi proses bisnis operasional. Kombinasi kemampuan teknis dan pemahaman mendalam tentang alur kerja lapangan ini menjadi nilai tambah bagi saya untuk menjembatani kebutuhan bisnis ke dalam solusi perangkat lunak yang praktis.<br/><br/>Saat ini saya aktif mengembangkan aplikasi web serta terbuka untuk peluang kerja sebagai Junior / Entry-Level Full Stack Web Developer, di mana saya dapat berkontribusi dalam tim untuk membangun sistem digital yang andal.',
      professionalSummary: 'Full Stack Web Developer yang berfokus membangun aplikasi web dinamis, REST API, dashboard admin, dan integrasi database. Memiliki bekal pemahaman teknis modern serta pengalaman lintas bidang di IT support dan koordinasi administrasi proyek operasional.<br/><br/>Menguasai React.js, Node.js, Express.js, PHP, MySQL, PostgreSQL, MongoDB, Git, GitHub, Vercel, Netlify, dan cPanel.',
      valuePropositionTitle: 'Value Proposition',
      valuePropositionIntro: 'Saya membantu bisnis mengubah proses manual menjadi sistem digital yang lebih rapi, cepat, dan mudah dipantau.',
      valuePropositions: [
        {
          title: 'Web Development',
          description: 'Membangun aplikasi web full-stack, dashboard, REST API, sistem login, database, dan website responsif.'
        },
        {
          title: 'Operational Understanding',
          description: 'Memahami kebutuhan lapangan, administrasi proyek, logistik, laporan harian, RAB/RAP, invoice, dokumentasi, dan koordinasi tim.'
        },
        {
          title: 'Digitalization',
          description: 'Mengubah laporan manual, spreadsheet, arsip, dan alur kerja operasional menjadi sistem digital yang lebih terstruktur.'
        },
        {
          title: 'Cross-Functional Coordination',
          description: 'Terbiasa bekerja dengan tim IT, operasional, manajemen, vendor, mandor, kontraktor, HR, dan klien.'
        }
      ],
      avatarUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781203798/Pas_foto_1_ggq9nf.png',
      resumeUrl: '/cv/cv-syah-putra-nugraha-web-developer.pdf',
      birthPlace: 'Cimahi',
      birthDate: '29 Mei 1998'
    }
  },
  {
    key: 'contact',
    value: {
      email: 'syah.putrawork98@gmail.com',
      location: 'Cimahi, Jawa Barat',
      github: 'https://github.com/syahputrawork98-sketch',
      linkedin: 'https://www.linkedin.com/in/syah-putra-nugraha-292424131/',
      instagram: 'https://instagram.com/hallofsyah',
      description: 'Saya terbuka untuk peluang kerja, freelance project, kolaborasi, atau diskusi pengembangan website dan sistem digital. Bila Anda membutuhkan website, dashboard, aplikasi monitoring, atau sistem internal yang lebih rapi dan efisien, saya siap membantu membangun solusinya.',
      title: 'Mari Bekerja Sama'
    }
  }
];

const defaultSkills = [
  // Frontend
  { name: 'HTML5', type: 'TECHNICAL', category: 'Frontend', order: 1, visible: true },
  { name: 'CSS3', type: 'TECHNICAL', category: 'Frontend', order: 2, visible: true },
  { name: 'JavaScript', type: 'TECHNICAL', category: 'Frontend', order: 3, visible: true },
  { name: 'React.js', type: 'TECHNICAL', category: 'Frontend', order: 4, visible: true },
  { name: 'Bootstrap', type: 'TECHNICAL', category: 'Frontend', order: 5, visible: true },
  { name: 'Responsive Design', type: 'TECHNICAL', category: 'Frontend', order: 6, visible: true },

  // Backend
  { name: 'Node.js', type: 'TECHNICAL', category: 'Backend', order: 7, visible: true },
  { name: 'Express.js', type: 'TECHNICAL', category: 'Backend', order: 8, visible: true },
  { name: 'PHP Native', type: 'TECHNICAL', category: 'Backend', order: 9, visible: true },
  { name: 'REST API', type: 'TECHNICAL', category: 'Backend', order: 10, visible: true },
  { name: 'JWT Authentication', type: 'TECHNICAL', category: 'Backend', order: 11, visible: true },

  // Database
  { name: 'MySQL', type: 'TECHNICAL', category: 'Database', order: 12, visible: true },
  { name: 'MongoDB', type: 'TECHNICAL', category: 'Database', order: 13, visible: true },
  { name: 'PostgreSQL', type: 'TECHNICAL', category: 'Database', order: 14, visible: true },

  // Tools & Deployment
  { name: 'Git', type: 'TOOL', category: 'Tools', order: 15, visible: true },
  { name: 'GitHub', type: 'TOOL', category: 'Tools', order: 16, visible: true },
  { name: 'Postman', type: 'TOOL', category: 'Tools', order: 17, visible: true },
  { name: 'Vercel', type: 'TOOL', category: 'Tools', order: 18, visible: true },
  { name: 'Netlify', type: 'TOOL', category: 'Tools', order: 19, visible: true },
  { name: 'cPanel', type: 'TOOL', category: 'Tools', order: 20, visible: true },

  // Automation & Productivity
  { name: 'Google Sheets', type: 'TOOL', category: 'Automation', order: 21, visible: true },
  { name: 'Google Apps Script', type: 'TOOL', category: 'Automation', order: 22, visible: true },
  { name: 'Excel VBA', type: 'TOOL', category: 'Automation', order: 23, visible: true },
  { name: 'Microsoft Office', type: 'TOOL', category: 'Automation', order: 24, visible: true },

  // Design & Others
  { name: 'Figma Basic', type: 'TOOL', category: 'Others', order: 25, visible: true },
  { name: 'Canva', type: 'TOOL', category: 'Others', order: 26, visible: true },
  { name: 'Photoshop Basic', type: 'TOOL', category: 'Others', order: 27, visible: true },
  { name: 'Basic SEO', type: 'TECHNICAL', category: 'Others', order: 28, visible: true },
  { name: 'Basic Networking', type: 'TECHNICAL', category: 'Others', order: 29, visible: true },
  { name: 'CCTV System', type: 'TECHNICAL', category: 'Others', order: 30, visible: true },
  { name: 'AutoCAD/Revit Understanding', type: 'TECHNICAL', category: 'Others', order: 31, visible: true },
];

const experiences = [
  {
    role: 'Freelance Full Stack Web Developer',
    company: 'Self-employed / Mandiri',
    startDate: new Date('2025-07-01'),
    isCurrent: true,
    type: 'Freelance',
    description: 'Bekerja secara mandiri sebagai end-to-end developer untuk menganalisis kebutuhan, mendesain skema database, membangun REST API, mengimplementasikan antarmuka responsif, hingga mendeploy aplikasi web ke platform cloud. Berfokus pada pembuatan aplikasi fungsional seperti dashboard admin, sistem POS, platform e-commerce, dan portal monitoring operasional.',
    highlights: [
      'Mengembangkan portal pelacakan progres konstruksi & manajemen logistik material menggunakan React, Node.js, Express, dan MongoDB.',
      'Membangun dashboard POS kasir dengan fitur manajemen stok barang, alert batas minimum produk, dan pencetakan struk transaksi berbasis React, Node.js, dan PostgreSQL.',
      'Membuat platform e-commerce pemesanan hewan kurban dan paket aqiqah digital terintegrasi REST API menggunakan React, Express, dan MySQL.',
      'Mengembangkan website pariwisata e-commerce interaktif dengan fitur pemesanan tur kustom dan integrasi kontak WhatsApp menggunakan TypeScript, React, Vite, dan Tailwind CSS.',
      'Mengembangkan showcase catering kuliner dengan kalkulator porsi makanan dinamis dan form reservasi online menggunakan Svelte dan SvelteKit.'
    ],
    order: 1,
    status: 'PUBLISHED'
  },
  {
    role: 'Freelance Quantity Surveyor & Cost Estimator',
    company: 'Self-employed / Mandiri',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-06-30'),
    isCurrent: false,
    type: 'Freelance',
    description: 'Melakukan analisis kuantitas material konstruksi, estimasi biaya proyek (RAB/RAP), dan penyusunan dokumen penawaran harga.',
    highlights: [
      'Menghitung volume kebutuhan material proyek konstruksi berdasarkan gambar teknis (AutoCAD/Revit).',
      'Menyusun rencana anggaran biaya (RAB) serta rencana anggaran pelaksanaan (RAP) proyek.',
      'Menganalisis efisiensi biaya material untuk kebutuhan negosiasi harga dengan vendor.'
    ],
    order: 2,
    status: 'PUBLISHED'
  },
  {
    role: 'Field General Staff – Project Digitalization',
    company: 'PT Sedayu Jaya Konstruksi',
    startDate: new Date('2022-08-01'),
    endDate: new Date('2024-12-31'),
    isCurrent: false,
    type: 'Formal',
    description: 'Mendukung kelancaran operasional proyek melalui administrasi digital dan koordinasi teknis di lapangan. Bertanggung jawab atas pengelolaan dokumen proyek (RAB/RAP, invoice, surat jalan) serta memastikan pencatatan logistik material tercatat dengan akurat.',
    highlights: [
      'Mengotomatisasi pelaporan harian proyek menggunakan spreadsheet dinamis untuk mempercepat koordinasi tim lapangan.',
      'Mengelola pencatatan keluar-masuk material proyek guna mengontrol efisiensi anggaran operasional.',
      'Menjembatani komunikasi teknis antara mandor, vendor, dan kontraktor utama untuk penyelesaian kendala di lapangan.'
    ],
    order: 3,
    status: 'PUBLISHED'
  },
  {
    role: 'Personal Assistant & General Staff – Digital Documentation',
    company: 'PT Erusatria Grup',
    startDate: new Date('2020-03-01'),
    endDate: new Date('2022-07-31'),
    isCurrent: false,
    type: 'Formal',
    description: 'Menangani kebutuhan administrasi umum, koordinasi logistik material, penjadwalan, serta digitalisasi arsip dokumen perusahaan untuk meningkatkan aksesibilitas informasi.',
    highlights: [
      'Membangun sistem pengarsipan digital mandiri untuk merapikan dokumentasi logistik dan pengajuan anggaran.',
      'Mengelola data stok inventaris gudang secara berkala untuk meminimalkan selisih stok fisik.',
      'Membantu efisiensi waktu pencarian dokumen operasional melalui penataan arsip berbasis digital.'
    ],
    order: 4,
    status: 'PUBLISHED'
  },
  {
    role: 'General Affair & System Support',
    company: 'Wisata Ngaprak Bandung',
    startDate: new Date('2018-10-01'),
    endDate: new Date('2019-12-31'),
    isCurrent: false,
    type: 'Formal',
    description: 'Mengelola kebutuhan operasional umum kantor, inventaris aset, administrasi, serta memberikan dukungan teknis IT ringan untuk operasional harian.',
    highlights: [
      'Memelihara website company profile sederhana sebagai sarana promosi digital layanan destinasi wisata.',
      'Melakukan pemeliharaan rutin perangkat IT internal (komputer, printer, dan jaringan lokal).',
      'Mengatur pengarsipan dokumen kerja sama dengan pihak eksternal dan vendor pariwisata.'
    ],
    order: 5,
    status: 'PUBLISHED'
  },
  {
    role: 'IT Support & System Administrator',
    company: 'PT OTICS Indonesia',
    startDate: new Date('2016-11-01'),
    endDate: new Date('2017-12-31'),
    isCurrent: false,
    type: 'Formal',
    description: 'Mengelola infrastruktur IT pabrik (jaringan LAN, server lokal, CCTV) dan mendukung kebutuhan perangkat keras/lunak karyawan untuk memastikan kelancaran aktivitas operasional manufaktur.',
    highlights: [
      'Melakukan troubleshooting jaringan, sistem operasi, server database lokal, dan perangkat CCTV.',
      'Membantu administrasi basis data karyawan serta pemeliharaan aplikasi rekrutmen internal berbasis PHP dan MySQL.',
      'Memberikan respon cepat terhadap kendala teknis pengguna (user support) untuk menjaga produktivitas kerja harian.'
    ],
    order: 6,
    status: 'PUBLISHED'
  }
];

const projects = [
  {
    title: 'Personal Portfolio CMS — Syah Putra N',
    slug: 'personal-portfolio-cms',
    shortDescription: 'Aplikasi portfolio personal Full Stack dengan Dashboard CMS admin untuk manajemen data secara dinamis.',
    description: 'Aplikasi portfolio profesional yang dibangun secara end-to-end dengan panel CMS admin terproteksi JWT untuk pengelolaan konten secara dinamis.\n\n**Detail Proyek:**\n- **Role:** Full Stack Developer (Pemilik & Pengembang Utama)\n- **Tech Stack:** React, Vite, Node.js, Express, Prisma, PostgreSQL (Neon DB), JWT.\n- **Fitur Utama:** Render konten dinamis, dashboard admin terproteksi, preview sertifikat Google Drive, selektor variasi CV, dan pembatasan CORS.\n- **Kontribusi:** Mendesain arsitektur database relasional, membangun REST API Express, mengimplementasikan antarmuka responsif, serta mendeploy sistem secara penuh.\n- **Status:** Produksi / Aktif.',
    techStack: ['React.js', 'Vite', 'Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'JWT'],
    status: 'PUBLISHED',
    featured: true,
    order: 1,
    liveUrl: 'https://syahputran.vercel.app/',
    githubUrl: 'https://github.com/syahputrawork98-sketch/PWSP-Personal-Web-Syah-Putra'
  },
  {
    title: "Tien's Catering — Catering Business Web Platform",
    slug: 'tc-tiens-catering',
    shortDescription: 'Website profil bisnis katering kuliner lokal dengan katalog menu dan form kalkulator porsi serta reservasi online.',
    description: 'Website promosi dan showcase portofolio katering kuliner untuk menampilkan menu hidangan serta menyederhanakan pemesanan acara.\n\n**Detail Proyek:**\n- **Role:** Frontend Developer (Studi Kasus / Proyek Mandiri)\n- **Tech Stack:** Svelte, SvelteKit, TailwindCSS, JavaScript, SQLite.\n- **Fitur Utama:** Slider katalog menu interaktif, kalkulator porsi makanan dinamis, formulir reservasi acara, dan simulator akun/persona (switcher).\n- **Kontribusi:** Mendesain interaktivitas kalkulator porsi, mengimplementasikan antarmuka responsif menggunakan SvelteKit, serta menata rute API lokal untuk data mock.\n- **Status:** Studi Kasus / Prototipe.',
    imageUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781203315/Tien_s_Catering_bwawyt.png',
    techStack: ['Svelte', 'SvelteKit', 'TailwindCSS', 'JavaScript'],
    status: 'PUBLISHED',
    featured: true,
    order: 2,
    githubUrl: 'https://github.com/syahputrawork98-sketch/TC-Tien-s-Catering'
  },
  {
    title: 'Web API Learning Hub — REST API Practice Repository',
    slug: 'web-api-learning-hub',
    shortDescription: 'Repositori pembelajaran backend untuk latihan perancangan REST API, operasi CRUD, otentikasi JWT, dan validasi request.',
    description: 'Kumpulan proyek latihan backend untuk memperdalam pemahaman tentang alur kerja server-side, routing Express, dan optimasi query database.\n\n**Detail Proyek:**\n- **Role:** Backend Developer (Proyek Belajar)\n- **Tech Stack:** Node.js, Express.js, MySQL, JWT, Postman.\n- **Fitur Utama:** API registrasi dan login aman, middleware otentikasi JWT, validasi input request, dan standardisasi respon JSON.\n- **Kontribusi:** Membangun middleware otentikasi kustom, merancang struktur routing, serta mendokumentasikan API menggunakan Postman collections.\n- **Status:** Proyek Pembelajaran / Aktif.',
    techStack: ['Node.js', 'Express.js', 'MySQL', 'JWT', 'Postman'],
    status: 'PUBLISHED',
    featured: true,
    order: 3
  },
  {
    title: 'Kosuka Bali Trip Website',
    slug: 'kbt-kosuka-bali-trip',
    shortDescription: 'Website e-commerce pariwisata Bali dengan fitur pemesanan tur kustom dan integrasi kontak WhatsApp cepat.',
    description: 'Platform showcase pariwisata interaktif yang membantu wisatawan merencanakan perjalanan kustom di Bali secara digital.\n\n**Detail Proyek:**\n- **Role:** Frontend Developer (Studi Kasus / Proyek Mandiri)\n- **Tech Stack:** TypeScript, React.js, Vite, TailwindCSS.\n- **Fitur Utama:** Katalog destinasi wisata, pembuat rencana perjalanan kustom, galeri interaktif, dan tombol hubung cepat WhatsApp.\n- **Kontribusi:** Mengembangkan sistem pemilihan destinasi kustom, menata visualisasi grid responsif, dan memastikan optimalisasi build client.\n- **Status:** Studi Kasus / Prototipe.',
    imageUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781232955/kbt-kosuka-bali-trip.vercel.app__wn3zig.png',
    techStack: ['TypeScript', 'React.js', 'Vite', 'TailwindCSS'],
    status: 'PUBLISHED',
    featured: true,
    order: 4
  },
  {
    title: 'Siap Aqiqah Digital Platform',
    slug: 'sa-siap-aqiqah',
    shortDescription: 'Aplikasi pemesanan hewan kurban dan paket aqiqah digital.',
    description: 'Platform e-commerce lokal untuk pemesanan hewan qurban & paket aqiqah instan, dilengkapi dengan tracking proses penyembelihan secara syariah, pencetakan sertifikat aqiqah, dan dokumentasi video.\n\n**Fitur utama:**\n- Pemilihan hewan aqiqah\n- Invoice generator\n- Tracking dokumentasi video aqiqah\n- Custom sertifikat PDF download',
    imageUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781232706/Siqah_siap_Akikah_vpmhad.png',
    techStack: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MySQL'],
    status: 'PUBLISHED',
    featured: false,
    order: 5
  },
  {
    title: 'Manajemen Toko Bangunan (MTB) Dashboard',
    slug: 'mtb-manajemen-toko-bangunan',
    shortDescription: 'Aplikasi point of sale (POS) & inventori toko bangunan terintegrasi.',
    description: 'Dashboard admin internal untuk manajemen toko bahan bangunan skala menengah. Mengelola master data produk, status stok, transaksi kasir POS, dan pelaporan keuangan bulanan.\n\n**Fitur utama:**\n- POS kasir penjualan barang\n- Stock alert batas minimum material\n- Laporan laba rugi otomatis\n- Print struk transaksi belanja',
    techStack: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'PostgreSQL'],
    status: 'PUBLISHED',
    featured: false,
    order: 6
  },
  {
    title: 'RumahKu Konstruksi — Construction Service Web Platform',
    slug: 'rkk-rumahku-konstruksi',
    shortDescription: 'Aplikasi web case study untuk pelacakan real-time progress pembangunan fisik konstruksi dan manajemen inventori material.',
    description: 'Aplikasi monitoring proyek pembangunan rumah tinggal yang dirancang untuk merapikan alur pelaporan lapangan dari mandor ke pemilik proyek.\n\n**Detail Proyek:**\n- **Role:** Full Stack Developer (Case Study / Candidate Project)\n- **Tech Stack:** JavaScript, React.js, Node.js, Express.js, MongoDB.\n- **Fitur Utama:** Real-time progress timeline tracking, daily construction worklog checklist, daily photo documentation upload, inventory control (cement/bricks logistic stock).\n- **Kontribusi Pribadi:** Merancang logika State Management frontend, membangun skema database NoSQL (MongoDB), dan membuat API monitoring harian.\n- **Status:** Case Study / Prototype Candidate.',
    imageUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781232956/RKK-RumahKu-Kontruksi_twimqd.png',
    techStack: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB'],
    status: 'PUBLISHED',
    featured: false,
    order: 7
  },
  {
    title: 'Construction Project Monitoring Application',
    slug: 'construction-project-monitoring',
    slug: 'construction-project-monitoring',
    shortDescription: 'Aplikasi web untuk membantu monitoring progres pembangunan rumah, dokumentasi proyek, dan laporan harian.',
    description: 'Aplikasi web untuk membantu monitoring progres pembangunan rumah, dokumentasi proyek, dan laporan harian. Sistem ini dirancang agar proses pelaporan dari lapangan lebih cepat, terstruktur, dan mudah dipantau oleh tim manajemen.\n\n**Fitur utama:**\n- Dashboard progres\n- Laporan harian digital\n- Upload dokumentasi foto\n- Monitoring pekerjaan\n- Manajemen logistik',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    status: 'DRAFT',
    featured: false,
    order: 8
  },
  {
    title: 'Event Organizer Showcase Website',
    slug: 'event-organizer-showcase',
    shortDescription: 'Website promosi untuk layanan event organizer dan catering.',
    description: 'Website promosi untuk layanan event organizer dan catering. Website ini menampilkan katalog layanan, portofolio acara, serta jalur inquiry/pemesanan agar calon klien lebih mudah memahami layanan yang ditawarkan.\n\n**Fitur utama:**\n- Portfolio gallery\n- Katalog layanan\n- Inquiry service\n- Responsive mobile design',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MySQL'],
    status: 'DRAFT',
    featured: false,
    order: 9
  },
  {
    title: 'Company Profile Website',
    slug: 'company-profile-website',
    shortDescription: 'Website company profile untuk menampilkan profil usaha, layanan, galeri destinasi, dan informasi kontak.',
    description: 'Website company profile untuk menampilkan profil usaha, layanan, galeri destinasi, dan informasi kontak. Website ini membantu perusahaan memiliki pusat informasi digital yang lebih mudah diakses calon pelanggan.\n\n**Fitur utama:**\n- Informasi destinasi\n- Galeri foto\n- Google Maps integration\n- Kontak cepat',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    status: 'PUBLISHED',
    featured: false,
    order: 10
  },
  {
    title: 'Iwan Noval Portfolio Website',
    slug: 'personal-web-iwan-noval',
    shortDescription: 'Website profil profesional dan landing page untuk portfolio personal.',
    description: 'Desain portofolio modern yang menampilkan perjalanan karir, pencapaian proyek, list keahlian, dan formulir kontak interaktif.\n\n**Fitur utama:**\n- Dark/light mode theme toggle\n- Timeline karir & edukasi\n- Kontak formulir direct email\n- SEO-optimized metadata',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    status: 'DRAFT',
    featured: false,
    order: 11
  }
];

async function main() {
  const applySync = process.env.APPLY_PUBLIC_CONTENT_SYNC === 'true';
  const databaseUrl = process.env.DATABASE_URL || '';

  // Mask database URL for safety when logging
  let maskedUrl = 'Not defined';
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      parsed.password = '******';
      maskedUrl = parsed.toString();
    } catch (e) {
      maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':******@');
    }
  }

  console.log('========================================================');
  console.log('⚠️  SAFE FULL PUBLIC CONTENT SYNC SYSTEM  ⚠️');
  console.log('========================================================');
  console.log(`Target Database URL : ${maskedUrl}`);
  console.log(`Sync Mode           : ${applySync ? 'APPLY (Write to Database)' : 'DRY RUN (Read-Only)'}`);
  console.log('--------------------------------------------------------');
  
  if (!applySync) {
    console.log('👉 Running in DRY RUN mode by default.');
    console.log('👉 To apply the changes to your database, run with:');
    console.log('   APPLY_PUBLIC_CONTENT_SYNC=true node scripts/sync-public-content.js\n');
  } else {
    console.log('🚨 WARNING: Database write is enabled. Changes will be saved.\n');
  }

  // 1. Read credentials.json
  const credentialsPath = path.join(__dirname, '../data/credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found at: ${credentialsPath}`);
  }

  const fileData = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const certificates = fileData.certificates || [];
  const supportingDocuments = fileData.supportingDocuments || [];
  const featuredCredentials = fileData.featuredCredentials || [];

  console.log(`📄 Data planned for sync:`);
  console.log(`- Site Settings       : ${siteSettings.length} keys`);
  console.log(`- Technical Skills    : ${defaultSkills.length} skills`);
  console.log(`- Experiences         : ${experiences.length} roles`);
  console.log(`- Projects            : ${projects.length} items`);
  console.log(`- Certificates        : ${certificates.length} items`);
  console.log(`- Supporting Documents: ${supportingDocuments.length} items`);
  console.log(`- Featured Highlights : ${featuredCredentials.length} items`);
  console.log('--------------------------------------------------------');

  if (applySync) {
    console.log('💾 Connecting to Database...');
    const prisma = new PrismaClient();
    try {
      // A. Site Settings
      console.log('⚙️ Syncing Site Settings...');
      for (const s of siteSettings) {
        await prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value }
        });
      }
      console.log('✅ Site Settings synced.');

      // B. Skills
      console.log('🛠️ Syncing Skills...');
      for (const skill of defaultSkills) {
        await prisma.skill.upsert({
          where: {
            name_type: {
              name: skill.name,
              type: skill.type
            }
          },
          update: {
            category: skill.category,
            order: skill.order,
            visible: skill.visible
          },
          create: skill
        });
      }
      console.log('✅ Skills synced.');

      // C. Experiences
      console.log('💼 Syncing Experiences...');
      for (const exp of experiences) {
        const existing = await prisma.experience.findFirst({
          where: {
            role: exp.role,
            company: exp.company
          }
        });
        if (existing) {
          await prisma.experience.update({
            where: { id: existing.id },
            data: exp
          });
        } else {
          await prisma.experience.create({
            data: exp
          });
        }
      }
      console.log('✅ Experiences synced.');

      // D. Projects
      console.log('🚀 Syncing Projects...');
      for (const project of projects) {
        const createdOrUpdatedProject = await prisma.project.upsert({
          where: { slug: project.slug },
          update: project,
          create: project
        });

        // Also sync the EN translation
        await prisma.projectTranslation.upsert({
          where: {
            projectId_locale: {
              projectId: createdOrUpdatedProject.id,
              locale: 'EN'
            }
          },
          update: {
            title: project.title,
            shortDescription: project.shortDescription,
            description: project.description || null
          },
          create: {
            projectId: createdOrUpdatedProject.id,
            locale: 'EN',
            title: project.title,
            shortDescription: project.shortDescription,
            description: project.description || null,
            keyFeatures: [],
            responsibilities: [],
            outcomes: []
          }
        });
      }
      console.log('✅ Projects synced.');

      // E. Credentials (Certificates & Supporting Documents)
      console.log('📜 Syncing Credentials (Certificates)...');
      for (const cert of certificates) {
        const prismaData = {
          id: cert.id,
          slug: cert.id,
          type: 'CERTIFICATE',
          sourceType: 'DRAFT_FILE',
          title: cert.title,
          officialTitle: cert.officialTitle,
          category: cert.category,
          subCategory: cert.subCategory,
          issuer: cert.issuer,
          issuerType: cert.issuerType,
          certificateNumber: cert.certificateNumber,
          participantName: cert.participantName || 'Syah Putra Nugraha',
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
          originalIssueDate: cert.issueDate,
          startDate: cert.startDate ? new Date(cert.startDate) : null,
          originalStartDate: cert.startDate,
          endDate: cert.endDate ? new Date(cert.endDate) : null,
          originalEndDate: cert.endDate,
          duration: cert.duration,
          status: 'PUBLISHED',
          grade: cert.grade || cert.status,
          level: cert.level,
          skills: cert.skills || [],
          relatedTech: cert.relatedTechnologies || [],
          relatedDomains: cert.relatedDomains || [],
          competencies: cert.competencies || [],
          summary: cert.summary || '',
          portfolioRelevance: cert.portfolioRelevance || '',
          recruiterValue: cert.recruiterValue,
          displayPriority: cert.displayPriority || 3,
          featured: cert.featured || false,
          showOnHomepage: cert.showOnHomepage || false,
          showOnCertificatePage: cert.showOnCertificatePage !== undefined ? cert.showOnCertificatePage : true,
          driveUrl: cert.driveUrl,
          fileName: cert.fileName,
          language: cert.language,
          notes: cert.notes,
          verificationStatus: cert.verificationStatus === 'verified' ? 'VERIFIED' : 'NEEDS_MANUAL_VERIFICATION'
        };

        await prisma.credential.upsert({
          where: { id: cert.id },
          update: prismaData,
          create: prismaData
        });
      }

      console.log('📜 Syncing Credentials (Supporting Documents)...');
      for (const doc of supportingDocuments) {
        const prismaData = {
          id: doc.id,
          slug: doc.id,
          type: 'SUPPORTING_DOCUMENT',
          sourceType: 'DRAFT_FILE',
          title: doc.title,
          category: doc.category,
          subCategory: doc.documentType,
          issuer: doc.institutionOrContext,
          participantName: doc.authorName || 'Syah Putra Nugraha',
          issueDate: doc.date ? new Date(doc.date) : null,
          originalIssueDate: doc.date,
          summary: doc.summary || '',
          keyTopics: doc.keyTopics || [],
          skills: doc.skillsDemonstrated || [],
          portfolioRelevance: doc.portfolioRelevance || '',
          recruiterValue: doc.recruiterValue,
          displayPriority: doc.displayPriority || 3,
          featured: doc.featured || false,
          showOnHomepage: doc.showOnHomepage || false,
          showOnCertificatePage: doc.showOnCertificatePage !== undefined ? doc.showOnCertificatePage : true,
          driveUrl: doc.driveUrl,
          fileName: doc.fileName,
          language: doc.language,
          notes: doc.notes,
          status: 'PUBLISHED',
          verificationStatus: doc.verificationStatus === 'verified' ? 'VERIFIED' : 'NEEDS_MANUAL_VERIFICATION'
        };

        await prisma.credential.upsert({
          where: { id: doc.id },
          update: prismaData,
          create: prismaData
        });
      }
      console.log('✅ Credentials synced.');

      // F. Featured Highlights
      console.log('⭐ Syncing Featured Highlights...');
      for (const fc of featuredCredentials) {
        // Verify the credential exists before creating/updating highlight
        const exists = await prisma.credential.findUnique({ where: { id: fc.id } });
        if (exists) {
          await prisma.featuredCredential.upsert({
            where: { credentialId: fc.id },
            update: {
              priority: fc.priority || 1,
              reason: fc.reason
            },
            create: {
              credentialId: fc.id,
              priority: fc.priority || 1,
              reason: fc.reason
            }
          });
        }
      }
      console.log('✅ Featured Highlights synced.');
      
      console.log('\n========================================================');
      console.log('🎉 SUCCESS: All public content synced successfully!');
      console.log('========================================================');
    } catch (error) {
      console.error('❌ Failed to sync public content to database:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  } else {
    console.log('ℹ️ DRY RUN complete. No database writes were performed.');
  }
}

main().catch(err => {
  console.error('❌ Sync script terminated with error:', err.message);
  process.exit(1);
});
