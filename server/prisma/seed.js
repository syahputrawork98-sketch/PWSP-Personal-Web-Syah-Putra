const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Setup Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
    },
  });

  console.log(`✅ Admin user ${admin.email} is ready.`);

  // 2. Setup Default Site Settings (Hero, Profile, Contact)
  console.log('⚙️ Setting up Site Settings...');

  const settings = [
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

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✅ Site settings (Hero, Profile, Contact) seeded.');

  // 3. Setup Default Skills
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

  await prisma.skill.deleteMany({}); // Clear existing to prevent duplicates/old skills
  for (const skill of defaultSkills) {
    await prisma.skill.create({ data: skill });
  }
  console.log('✅ Default skills seeded.');

  // 4. Setup Experience
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

  await prisma.experience.deleteMany({});
  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('✅ Experiences seeded.');


  const projects = [
    {
      title: 'Personal Portfolio CMS — Syah Putra N',
      slug: 'personal-portfolio-cms',
      shortDescription: 'Aplikasi portfolio personal Full Stack dengan Dashboard CMS admin untuk manajemen data secara dinamis.',
      description: 'Aplikasi portfolio profesional yang dibangun secara end-to-end dengan panel CMS admin terproteksi JWT untuk pengelolaan konten secara dinamis.\n\n**Detail Proyek:**\n- **Role:** Full Stack Developer (Pemilik & Pengembang Utama)\n- **Tech Stack:** React, Vite, Node.js, Express, Prisma, PostgreSQL (Neon DB), JWT.\n- **Fitur Utama:** Render konten dinamis, dashboard admin terproteksi, preview sertifikat Google Drive, selektor variasi CV, dan pembatasan CORS.\n- **Kontribusi:** Mendesain arsitektur database relasional, membangun REST API Express, mengimplementasikan antarmuka responsif, serta mendeploy sistem secara penuh.\n- **Status:** Produksi / Aktif.',
      imageUrl: 'https://res.cloudinary.com/dlgr9xicg/image/upload/v1781349587/Personal_Web_Syah_Putra_N_makvsf.png',
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
      liveUrl: 'https://tc-tien-s-catering.vercel.app',
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
      order: 4,
      liveUrl: 'https://kbt-kosuka-bali-trip.vercel.app/'
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

  await prisma.project.deleteMany({});
  for (const project of projects) {
    await prisma.project.create({
      data: {
        ...project,
        translations: {
          create: {
            locale: 'EN',
            title: project.title,
            shortDescription: project.shortDescription,
            description: project.description || null,
            keyFeatures: [],
            responsibilities: [],
            outcomes: []
          }
        }
      }
    });
  }
  console.log('✅ Projects seeded.');


  // 6. Setup Credentials & Certifications (Migrated from draft)
  console.log('📜 Seeding Credentials & Certifications...');
  try {
    const credentialsData = require('../data/credentials.json');
    const { certificates, supportingDocuments, featuredCredentials } = credentialsData;

    await prisma.credential.deleteMany({});
    await prisma.featuredCredential.deleteMany({});

    // Seed Certificates
    for (const cert of certificates) {
      await prisma.credential.create({
        data: {
          id: cert.id,
          slug: cert.id, // Using ID as slug for consistency
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
          status: 'PUBLISHED', // Internal status for public visibility
          grade: cert.grade || cert.status, // Putting "Lulus/Completed" in grade
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
        }
      });
    }

    // Seed Supporting Documents
    for (const doc of supportingDocuments) {
      await prisma.credential.create({
        data: {
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
        }
      });
    }

    // Seed Featured Highlights
    if (featuredCredentials && featuredCredentials.length > 0) {
      for (const fc of featuredCredentials) {
        // Verify the credential exists before creating highlight
        const exists = await prisma.credential.findUnique({ where: { id: fc.id } });
        if (exists) {
          await prisma.featuredCredential.create({
            data: {
              credentialId: fc.id,
              priority: fc.priority || 1,
              reason: fc.reason
            }
          });
        }
      }
    }

    console.log(`✅ Successfully seeded ${certificates.length} certificates and ${supportingDocuments.length} documents.`);
  } catch (err) {
    console.error('⚠️ Warning: Failed to seed credentials from JSON:', err.message);
    // Fallback or skip
  }

  // 7. Setup Learning Library Items
  console.log('📚 Seeding Learning Library Items...');
  try {
    const defaultLearningItems = [
      {
        title: "PostgreSQL Knowledge Base",
        slug: "postgresql-knowledge-base",
        category: "Database & Data",
        status: "IN_PROGRESS",
        level: "Intermediate",
        topics: ["Database Schema", "SQL Queries", "Indexing", "Optimization"],
        repoUrl: "https://github.com/syahputrawork98-sketch/PostgreSQL-Knowledge-Base",
        description: "PostgreSQL Knowledge Base adalah perpustakaan belajar terstruktur yang dirancang sebagai panduan mendalam tentang PostgreSQL.",
        orderIndex: 1,
        isPublished: true,
        featured: false
      },
      {
        title: "JavaScript Knowledge Base",
        slug: "javascript-knowledge-base",
        category: "Programming Languages",
        status: "IN_PROGRESS",
        level: "Intermediate",
        topics: ["ES6+", "Event Loop", "Asynchronous JS", "DOM Manipulation"],
        repoUrl: "https://github.com/syahputrawork98-sketch/JavaScript-Knowledge-Base",
        description: "Pusat pembelajaran JavaScript end-to-end: dari implementasi dasar, pemahaman mekanisme runtime, sampai latihan terstruktur untuk stabil di kasus nyata.",
        orderIndex: 2,
        isPublished: true,
        featured: true
      },
      {
        title: "GitHub Knowledge Base",
        slug: "github-knowledge-base",
        category: "Tools & Workflow",
        status: "IN_PROGRESS",
        level: "Beginner to Intermediate",
        topics: ["GitHub Actions", "Branching Strategy", "PR Workflows", "Releases"],
        repoUrl: "https://github.com/syahputrawork98-sketch/GitHub-Knowledge-Base",
        description: "Referensi teknis untuk manajemen kode kolaboratif menggunakan Git dan GitHub, membahas branching strategy dan Pull Request workflow.",
        orderIndex: 3,
        isPublished: true,
        featured: false
      },
      {
        title: "TypeScript Knowledge Base",
        slug: "typescript-knowledge-base",
        category: "Programming Languages",
        status: "IN_PROGRESS",
        level: "Intermediate",
        topics: ["Statically Typed", "Interfaces", "Generics", "Type Guarding"],
        repoUrl: "https://github.com/syahputrawork98-sketch/TypeScript-Knowledge-Base",
        description: "Basis pengetahuan terstruktur tentang TypeScript yang membahas konsep dasar, sistem tipe, prinsip desain, dan ekosistemnya secara lengkap.",
        orderIndex: 4,
        isPublished: true,
        featured: false
      },
      {
        title: "Python Knowledge Base",
        slug: "python-knowledge-base",
        category: "Programming Languages",
        status: "LEARNING",
        level: "Beginner to Intermediate",
        topics: ["OOP Python", "Data Science Basics", "Decorators", "Scripting"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Python-Knowledge-Base",
        description: "Python Knowledge Universe adalah repositori pembelajaran yang dirancang sebagai peta pengetahuan Python yang terstruktur, mulai dari konsep dasar hingga bidang spesialisasi.",
        orderIndex: 5,
        isPublished: true,
        featured: false
      },
      {
        title: "Rust Knowledge Base",
        slug: "rust-knowledge-base",
        category: "Programming Languages",
        status: "LEARNING",
        level: "Intermediate",
        topics: ["Ownership & Borrowing", "Lifetimes", "Pattern Matching", "Cargo Tools"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Rust-Knowledge-Base",
        description: "Repositori yang bertindak sebagai perpustakaan pembelajaran untuk Core Language Rust (seperti Ownership, Borrowing, Lifetimes, dan Concurrency).",
        orderIndex: 6,
        isPublished: true,
        featured: false
      },
      {
        title: "Golang Knowledge Base",
        slug: "golang-knowledge-base",
        category: "Programming Languages",
        status: "LEARNING",
        level: "Beginner to Intermediate",
        topics: ["Goroutines", "Channels", "Go Modules", "REST API Design"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Golang-Knowledge-Base",
        description: "Kompilasi catatan belajar pemrograman bahasa Go (Golang) mencakup goroutine, channel, standard library, serta REST API design.",
        orderIndex: 7,
        isPublished: true,
        featured: false
      },
      {
        title: "Cursor SOP",
        slug: "cursor-sop",
        category: "Tools & Workflow",
        status: "IN_PROGRESS",
        level: "Intermediate to Advanced",
        topics: ["Cursor Rules", "AI Prompts", "Agentic Workflows", "System Instructions"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Cursor-SOP",
        description: "Panduan operasional standar (SOP) untuk bekerja secara produktif menggunakan AI Editor Cursor dengan teknik Agentic Governance.",
        orderIndex: 8,
        isPublished: true,
        featured: true
      },
      {
        title: "Learning Matrix Blueprint",
        slug: "learning-matrix-blueprint",
        category: "Tools & Workflow",
        status: "IN_PROGRESS",
        level: "Advanced",
        topics: ["Knowledge Mapping", "Blueprint Architectures", "Curriculum Design", "Self-Learning Path"],
        repoUrl: "https://github.com/syahputrawork98-sketch/learning-matrix-blueprint",
        description: "learning-matrix-blueprint adalah repository blueprint utama untuk seluruh ekosistem pembelajaran di workspace ini, dirancang sebagai arsitektur pengetahuan yang dinamis.",
        orderIndex: 9,
        isPublished: true,
        featured: true
      },
      {
        title: "Git & GitHub Knowledge Base",
        slug: "git-github-knowledge-base",
        category: "Tools & Workflow",
        status: "IN_PROGRESS",
        level: "Intermediate to Advanced",
        topics: ["Git Internals", "Merge vs Rebase", "Submodules", "Security Best Practices"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Git-GitHub-Knowledge-Base",
        description: "Repositori pusat pengetahuan Git & GitHub, dirancang sebagai referensi teknis tingkat tinggi (Senior Engineer) yang membedah kontrol versi dari filosofi sejarah hingga tingkat lanjut.",
        orderIndex: 10,
        isPublished: true,
        featured: false
      },
      {
        title: "Design Patterns Library",
        slug: "design-patterns-library",
        category: "Frontend",
        status: "LEARNING",
        level: "Intermediate",
        topics: ["Creational Patterns", "Structural Patterns", "Behavioral Patterns", "Solid Principles"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Design-Patterns-Library",
        description: "Kumpulan implementasi pola desain perangkat lunak (Design Patterns) dalam arsitektur modern TypeScript dan web development.",
        orderIndex: 11,
        isPublished: true,
        featured: false
      },
      {
        title: "AI Visual Communication",
        slug: "ai-visual-communication",
        category: "Frontend",
        status: "LEARNING",
        level: "Beginner to Intermediate",
        topics: ["Generative UI", "Visual Design Assets", "Prompts Engineering", "Figma AI Integration"],
        repoUrl: "https://github.com/syahputrawork98-sketch/AI-Visual-Communication",
        description: "Catatan pembelajaran dan penerapan teknologi kecerdasan buatan (AI) untuk komunikasi visual dan antarmuka web interaktif.",
        orderIndex: 12,
        isPublished: true,
        featured: false
      },
      {
        title: "Golang Frontend WASM Hub",
        slug: "golang-frontend-wasm-hub",
        category: "Frontend",
        status: "LEARNING",
        level: "Intermediate",
        topics: ["WebAssembly", "Go WASM Compilation", "DOM Interaction", "JS-Go Interop"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Golang-Frontend-WASM-Hub",
        description: "Hub eksplorasi implementasi WebAssembly (WASM) menggunakan bahasa pemrograman Go untuk meningkatkan performa interaksi frontend.",
        orderIndex: 13,
        isPublished: true,
        featured: false
      },
      {
        title: "Browser Runtime Knowledge Base",
        slug: "browser-runtime-knowledge-base",
        category: "Frontend",
        status: "IN_PROGRESS",
        level: "Intermediate to Advanced",
        topics: ["V8 Engine", "Event Loop", "Render Pipeline", "DOM & CSSOM Tree"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Browser-Runtime-Knowledge-Base",
        description: "Eksplorasi mendalam mekanisme browser runtime, render pipeline, reflow, repaint, V8 Engine, dan manajemen memori browser.",
        orderIndex: 14,
        isPublished: true,
        featured: true
      },
      {
        title: "Server Runtime Knowledge Base",
        slug: "server-runtime-knowledge-base",
        category: "Backend",
        status: "LEARNING",
        level: "Intermediate",
        topics: ["NodeJS Architecture", "libuv Event Loop", "Worker Threads", "Streams & Buffer"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Server-Runtime-Knowledge-Base",
        description: "Basis pengetahuan server runtime (Node.js, Deno, Bun) membahas arsitektur threading, libuv, asynchronous I/O, dan manajemen cluster.",
        orderIndex: 15,
        isPublished: true,
        featured: false
      },
      {
        title: "JavaScript & TS Frontend Hub",
        slug: "javascript-ts-frontend-hub",
        category: "Frontend",
        status: "IN_PROGRESS",
        level: "Intermediate",
        topics: ["Component Design", "State Management", "Hydration", "Micro Frontends"],
        repoUrl: "https://github.com/syahputrawork98-sketch/JavaScript-TS-Frontend-Hub",
        description: "Hub pusat eksperimen dan proyek-proyek mini berbasis JavaScript dan TypeScript untuk penguasaan arsitektur frontend tingkat lanjut.",
        orderIndex: 16,
        isPublished: true,
        featured: false
      },
      {
        title: "Python UI Automation Hub",
        slug: "python-ui-automation-hub",
        category: "Tools & Workflow",
        status: "LEARNING",
        level: "Intermediate",
        topics: ["Playwright", "Selenium Webdriver", "Web Scraping", "E2E Testing"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Python-UI-Automation-Hub",
        description: "Eksperimen otomasi antarmuka pengguna (UI Automation) menggunakan script Python dengan tools seperti Selenium, Playwright, dan PyAutoGUI.",
        orderIndex: 17,
        isPublished: true,
        featured: false
      },
      {
        title: "Rust WASM UI Lab",
        slug: "rust-wasm-ui-lab",
        category: "Frontend",
        status: "LEARNING",
        level: "Intermediate to Advanced",
        topics: ["wasm-bindgen", "Rust UI Rendering", "Memory Safety", "Performance Testing"],
        repoUrl: "https://github.com/syahputrawork98-sketch/Rust-WASM-UI-Lab",
        description: "Lab eksperimen compile Rust ke WebAssembly untuk membuat antarmuka UI dengan performa tinggi.",
        orderIndex: 18,
        isPublished: true,
        featured: false
      }
    ];

    await prisma.learningItem.deleteMany({});
    for (const item of defaultLearningItems) {
      await prisma.learningItem.create({ data: item });
    }
    console.log('✅ Default learning items seeded.');
  } catch (err) {
    console.error('⚠️ Warning: Failed to seed learning items:', err.message);
  }


  console.log('🏁 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
