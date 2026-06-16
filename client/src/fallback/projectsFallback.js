/**
 * Data Proyek Fallback
 * Batch 16 Fix - Clean Project Asset Links
 * Menghapus semua link demonstratif/placeholder dan hanya menyisakan field kosong 
 * atau URL yang benar-benar asli.
 */

export const projectsFallback = [
  // ==========================================
  // IT & WEB
  // ==========================================
  {
    id: "building-materials-management-system",
    title: "Building Materials Management System / MTB",
    subtitle: "POS & Inventory Operations",
    category: "IT & Web",
    status: "Completed / Portfolio Project",
    techStack: ["PHP", "Laravel", "MySQL", "Bootstrap", "AdminLTE", "REST API"],
    description: "POS and inventory management system concept for building material operations, covering product data, stock movement, sales transactions, minimum stock alerts, and receipt printing.",
    role: "Full Stack Web Developer",
    impact: "Didesain untuk membantu pencatatan stok barang secara terstruktur, mempermudah alur transaksi di kasir, serta memberikan peringatan dini saat stok bahan bangunan mencapai batas minimum.",
    challenge: "Mengelola beragam data SKU barang bangunan dengan variasi satuan yang berbeda dan mencatat mutasi stok masuk-keluar secara runut selama transaksi berlangsung.",
    solution: "Mengoptimalkan skema relasi database MySQL untuk penataan inventori, mengimplementasikan fitur auto-suggest pencarian produk, serta merancang sistem pencetakan struk kasir.",
    features: ["POS Cashier Interface", "Structured Stock Movement Tracking", "Minimum Stock Alert Notification", "Dynamic Receipt & Invoice Printing", "Sales Reports Dashboard Interface"],
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    links: {
      github: "https://github.com/syahputrawork98-sketch",
      demo: "",
      figma: ""
    },
    featured: true,
    orderIndex: 1
  },
  {
    id: "construction-monitoring-system",
    title: "RumahKu Construction Portal",
    subtitle: "Construction Progress & Logistics Tracking",
    category: "IT & Web",
    status: "Prototype / Portfolio Project",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Framer Motion", "REST API"],
    description: "Construction project portal prototype for progress tracking, material logistics, project documentation, and operational monitoring.",
    role: "Full Stack Web Developer",
    impact: "Didesain untuk membantu sistem rekapitulasi progres proyek konstruksi di lapangan, menyelaraskan alur pencatatan logistik material, serta mempermudah pemantauan oleh tim manajemen.",
    challenge: "Sinkronisasi pembaruan progres multi-proyek yang diunggah secara asinkronus oleh tim lapangan pada kondisi konektivitas seluler yang tidak stabil, serta menyajikannya dalam visualisasi metrik di dasbor utama.",
    solution: "Mengimplementasikan optimasi payload REST API, caching data sederhana di client, serta pemrosesan antrean di server Node.js. State management frontend dikelola menggunakan React hooks untuk pembaruan UI secara dinamis.",
    features: ["Dynamic Progress Dashboard", "Material & Inventory Tracking", "Digital Daily Log Reports", "Mobile-Optimized Photo Upload", "Multi-role Access Control (RBAC)"],
    imageUrl: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
    links: {
      github: "https://github.com/syahputrawork98-sketch",
      demo: "",
      figma: ""
    },
    featured: true,
    orderIndex: 2
  },
  {
    id: "siap-aqiqah",
    title: "Siap Aqiqah / SIQAH",
    subtitle: "E-Commerce & Order Workflow Platform",
    category: "IT & Web",
    status: "Completed / Portfolio Project",
    techStack: ["PHP", "Laravel", "MySQL", "Tailwind CSS", "Alpine.js", "Midtrans"],
    description: "E-commerce and order management platform prototype for aqiqah/qurban services, including product catalog, order flow, process tracking, and admin management.",
    role: "Full Stack Web Developer",
    impact: "Mempermudah calon pelanggan menjelajahi paket layanan aqiqah secara online, menyelaraskan alur pelacakan proses penyiapan hewan, serta merancang alur notifikasi transaksi untuk admin.",
    challenge: "Menyusun pelacakan alur kerja pesanan dari pembayaran, penyiapan hewan, pengemasan, hingga pengiriman secara runut agar mudah dipantau pembeli.",
    solution: "Membangun sistem tracking pesanan berbasis status alur kerja di database, merancang alur pemberitahuan berbasis WhatsApp, serta membangun dasbor manajemen pesanan admin.",
    features: ["Interactive Package Catalog", "Order Tracking & Progress System", "WhatsApp-based Notification Flow", "Payment Flow Preparation", "Admin Order Management Dashboard"],
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    links: {
      github: "https://github.com/syahputrawork98-sketch",
      demo: ""
    },
    featured: true,
    orderIndex: 3
  },
  {
    id: "event-organizer-showcase",
    title: "Website Portfolio Event Organizer",
    subtitle: "High-End Service Showcase",
    category: "IT & Web",
    status: "Completed / Portfolio Project",
    techStack: ["React.js", "Vite", "Vanilla CSS", "EmailJS", "Framer Motion"],
    description: "Platform portfolio interaktif dan sistem pemesanan (inquiry) jasa event organizer. Dibangun untuk menyajikan galeri visual dinamis serta memfasilitasi konversi prospek bisnis.",
    role: "Frontend Web Developer",
    impact: "Mendukung kenyamanan pengalaman pengguna melalui penyesuaian performa halaman, pemuatan aset gambar yang lebih efisien, dan alur inquiry untuk calon klien.",
    challenge: "Menampilkan puluhan aset dokumentasi foto event beresolusi tinggi tanpa mengorbankan kecepatan pemuatan awal halaman (Lighthouse Performance score) dan kelancaran animasi scroll/galeri.",
    solution: "Menerapkan lazy loading gambar progresif, kompresi aset gambar otomatis, pembagian bundel JavaScript (code-splitting) via Vite, serta optimasi CSS Grid responsif untuk tampilan galeri lintas perangkat.",
    features: ["Optimized Image Gallery", "Dynamic Event Categories Filter", "Email Inquiry Form Integration", "Interactive Event Timeline Showcase", "Responsive UI Layout"],
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    links: {
      github: "https://github.com/syahputrawork98-sketch",
      demo: ""
    },
    featured: false,
    orderIndex: 4
  },

  // ==========================================
  // MANUFAKTUR & TEKNIK
  // ==========================================
  {
    id: "mechanical-fixture-design",
    title: "Desain Fixture Produksi Komponen Mesin",
    subtitle: "Manufacturing Process Optimization",
    category: "Manufaktur & Teknik",
    status: "Completed",
    techStack: ["AutoCAD", "SolidWorks", "Mechanical Engineering"],
    description: "Perancangan solusi mekanik khusus untuk mengoptimalkan proses pemesinan komponen industri, menunjukkan kemampuan analisis teknis presisi tinggi.",
    role: "Mechanical Designer",
    impact: "Meningkatkan efisiensi setup produksi serta mengurangi tingkat kesalahan posisi pada manufaktur massal.",
    challenge: "Kebutuhan akan pencekaman (clamping) yang kuat namun tetap presisi tanpa merusak permukaan benda kerja yang sensitif.",
    solution: "Merancang fixture dengan sistem toggle clamp yang disesuaikan dengan geometri spesifik benda kerja.",
    features: ["Precision Alignment Pins", "Quick-Release Clamping System", "Material Sourcing List", "Detailed Shop Drawings"],
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
    links: {
      drive: "",
      model: ""
    },
    featured: false,
    orderIndex: 5
  },
  {
    id: "mold-design-injection",
    title: "Desain Mold Plastic Injection",
    subtitle: "Industrial Tooling Design",
    category: "Manufaktur & Teknik",
    status: "Completed",
    techStack: ["SolidWorks", "MoldFlow", "CAD"],
    description: "Perancangan sistem cetakan (mold) untuk produk plastik industri dengan fokus pada efisiensi pendinginan dan optimasi siklus produksi.",
    role: "CAD Engineer",
    impact: "Menghasilkan desain cetakan yang andal dengan efisiensi waktu siklus yang lebih baik dari target standar.",
    challenge: "Menghindari terjadinya cacat produksi seperti 'sink marks' pada bagian dinding produk yang tidak merata.",
    solution: "Optimasi sistem pendinginan (cooling system) dan penentuan gate location yang strategis melalui simulasi desain.",
    features: ["Core & Cavity Separation", "Ejection System Design", "Cooling Channel Layout", "BOM for Hardware"],
    imageUrl: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=800",
    links: {
      drive: ""
    },
    featured: false,
    orderIndex: 6
  },

  // ==========================================
  // MODEL MESIN 3D
  // ==========================================
  {
    id: "engine-component-3d",
    title: "Pemodelan 3D Komponen V6 Engine",
    subtitle: "Detailed Mechanical Modeling",
    category: "Model Mesin 3D",
    status: "Prototype",
    techStack: ["SolidWorks", "KeyShot", "Blender"],
    description: "Pemodelan 3D mendalam untuk komponen mesin V6, termasuk piston, crankshaft, dan connecting rod untuk tujuan edukasi dan simulasi teknis.",
    role: "3D Modeler",
    impact: "Mendukung digitalisasi materi pelatihan mekanik melalui visualisasi teknis yang akurat dan interaktif.",
    challenge: "Memodelkan geometri kompleks komponen presisi agar selaras dengan standar dimensi industri perakitan.",
    solution: "Penggunaan teknik surface modeling mutakhir untuk menangani profil kurva yang rumit dan memastikan assembly yang sempurna.",
    features: ["Exploded View Animation", "High-Resolution Render", "Accurate Dimension Scaling", "Multiple Format Export (STEP, OBJ)"],
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    links: {
      model: "",
      preview: ""
    },
    featured: false,
    orderIndex: 7
  },
  {
    id: "robotic-arm-assembly",
    title: "Assembly 3D Lengan Robot Industri",
    subtitle: "Automation Asset Library",
    category: "Model Mesin 3D",
    status: "Prototype",
    techStack: ["SolidWorks", "Fusion 360"],
    description: "Pemodelan dan perakitan (assembly) 6-axis robotic arm yang dirancang untuk keperluan simulasi layout dan otomasi pabrik.",
    role: "3D Modeler",
    impact: "Menyediakan referensi tata letak digital yang andal untuk kebutuhan perencanaan dan simulasi otomasi industri.",
    challenge: "Memastikan seluruh persendian (joints) robot memiliki rentang gerak yang realistis tanpa benturan komponen.",
    solution: "Implementasi analisis 'Motion Study' dan penerapan batas 'Mates Constraint' yang presisi dalam perakitan CAD.",
    features: ["6-Axis Movement Simulation", "Integrated Wiring Routing", "Standard Motor Components", "Weight & Balance Analysis"],
    imageUrl: "https://images.unsplash.com/photo-1531325082793-ca7c9ad6583a?auto=format&fit=crop&q=80&w=800",
    links: {
      model: ""
    },
    featured: false,
    orderIndex: 8
  },

  // ==========================================
  // MODEL BANGUNAN & RAB
  // ==========================================
  {
    id: "residential-building-estimate",
    title: "Sistem Estimasi RAB Hunian Residensial",
    subtitle: "Cost Estimation & Planning",
    category: "Model Bangunan & RAB",
    status: "Completed",
    techStack: ["AutoCAD", "SketchUp", "Excel (VBA)"],
    description: "Sistem perencanaan anggaran biaya (RAB) hunian residensial terintegrasi. Memadukan perhitungan kuantitas material dari pemodelan CAD dengan modul kalkulasi biaya otomatis berbasis makro pemrograman.",
    role: "Quantity Surveyor & Estimator (Developer Helper)",
    impact: "Membantu mempercepat proses penyusunan RAB dan mengurangi risiko kesalahan perhitungan manual melalui automasi kalkulasi volume, AHS, dan rekap biaya.",
    challenge: "Menghubungkan visualisasi desain 3D dengan kalkulasi ribuan baris item pekerjaan tanah, struktur, dan arsitektur tanpa terjadi selisih perhitungan volume.",
    solution: "Membangun sistem automasi berbasis Excel VBA untuk kalkulasi otomatis AHS (Analisis Harga Satuan) yang terhubung langsung dengan data volume yang diekstraksi dari AutoCAD/SketchUp.",
    features: ["Automated Quantity Take-off", "Interactive Visual 3D Models", "Dynamic Unit Price Analysis (AHS)", "Auto-generated S-Curve Schedules"],
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    links: {
      rab: "",
      drive: ""
    },
    featured: false,
    orderIndex: 9
  },
  {
    id: "warehouse-structure-rab",
    title: "Estimasi Biaya Struktur Gudang Baja",
    subtitle: "Industrial Costing",
    category: "Model Bangunan & RAB",
    status: "Completed",
    techStack: ["Excel", "SAP2000", "AutoCAD"],
    description: "Perhitungan estimasi kelayakan biaya konstruksi untuk bangunan fasilitas gudang rangka baja bentang lebar.",
    role: "Cost Estimator",
    impact: "Menyediakan estimasi pembiayaan yang andal dan dinamis untuk mendukung dokumen penawaran tender.",
    challenge: "Menghadapi risiko fluktuasi harga baja profil yang tinggi selama siklus perencanaan proyek yang panjang.",
    solution: "Merancang sistem RAB dinamis berbasis Excel dengan variabel referensi silang yang memperbarui total biaya otomatis.",
    features: ["Steel Weight Calculation", "Foundation Cost Analysis", "Labor Productivity Rate", "Material Waste Estimation"],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    links: {
      rab: ""
    },
    featured: false,
    orderIndex: 10
  }
];
