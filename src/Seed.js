/**
 * Seed.js — Data Sample untuk Development & Demo
 *
 * Cara menjalankan:
 *   1. Buka GAS Editor
 *   2. Pilih fungsi `seedData` dari dropdown
 *   3. Klik ▶️ Run
 */

// eslint-disable-next-line no-unused-vars
function seedData(config) {
  if (config && config.spreadsheetId) {
    Database.setSpreadsheetId(config.spreadsheetId);
  }
  Logger.log('🌱 Memulai seed data produk, pengguna, dan pesanan...');
  _seedOrSyncProducts();
  _seedOrSyncUsers();
  _seedOrSyncOrders();
  Logger.log('✅ Seed data selesai! Cek sheet Products, Users, dan Orders di Spreadsheet kamu.');
}

// eslint-disable-next-line no-unused-vars
function syncProductImages() {
  Logger.log('🖼️ Memperbarui URL gambar produk yang kosong...');
  _seedOrSyncProducts();
}

// eslint-disable-next-line no-unused-vars
function seedUsers() {
  Logger.log('👥 Memulai seed akun Admin, Pengurus, dan Anggota...');
  _seedOrSyncUsers();
}

/**
 * Seed & Sinkronisasi Akun Pengurus & 10 Anggota Koperasi
 */
function _seedOrSyncUsers() {
  Auth.setup();

  var sampleUsers = [
    // 1. Super Admin
    {
      name: 'Ketua Koperasi (Super Admin)',
      email: 'admin@kopdes.id',
      phone: '081100000001',
      role: 'admin',
      pin: '1234',
      address: 'Kantor Pusat Koperasi Desa',
      isActive: true
    },
    // 2. Pengurus 1
    {
      name: 'Budi Santoso (Manajer Gerai)',
      email: 'budi.pengurus@kopdes.id',
      phone: '081100000002',
      role: 'pengurus',
      pin: '1234',
      address: 'Dusun Sukamaju RT 01/RW 02',
      isActive: true
    },
    // 3. Pengurus 2
    {
      name: 'Siti Aminah (Bendahara Gerai)',
      email: 'siti.pengurus@kopdes.id',
      phone: '081100000003',
      role: 'pengurus',
      pin: '1234',
      address: 'Dusun Karanganyar RT 03/RW 01',
      isActive: true
    },
    // 4. Kurir Gerai 1 & 2
    {
      name: 'Kurir Budi',
      email: 'kurir1@kopdes.id',
      phone: '081300000001',
      role: 'kurir',
      pin: '1234',
      address: 'Pos Kurir Gerai Kopdes',
      isActive: true
    },
    {
      name: 'Kurir Ahmad Fauzi',
      email: 'kurir2@kopdes.id',
      phone: '081300000002',
      role: 'kurir',
      pin: '1234',
      address: 'Pos Kurir Gerai Kopdes',
      isActive: true
    },
    // 5. Anggota 1 - 10
    {
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@kopdes.id',
      phone: '081200000001',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 01 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      name: 'Dewi Lestari',
      email: 'dewi.lestari@kopdes.id',
      phone: '081200000002',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 02 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      name: 'Bambang Prakoso',
      email: 'bambang.p@kopdes.id',
      phone: '081200000003',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karanganyar RT 03 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      name: 'Sri Wahyuni',
      email: 'sri.wahyuni@kopdes.id',
      phone: '081200000004',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 01 / RW 03, Desa Makmur',
      isActive: true
    },
    {
      name: 'Eko Prasetyo',
      email: 'eko.prasetyo@kopdes.id',
      phone: '081200000005',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 04 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      name: 'Nur Hidayah',
      email: 'nur.hidayah@kopdes.id',
      phone: '081200000006',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karangsari RT 02 / RW 03, Desa Makmur',
      isActive: true
    },
    {
      name: 'Hendra Gunawan',
      email: 'hendra.g@kopdes.id',
      phone: '081200000007',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 03 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      name: 'Rina Marlina',
      email: 'rina.marlina@kopdes.id',
      phone: '081200000008',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karanganyar RT 01 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      name: 'Agus Supriyadi',
      email: 'agus.s@kopdes.id',
      phone: '081200000009',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 05 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      name: 'Wulandari',
      email: 'wulandari@kopdes.id',
      phone: '081200000010',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karangsari RT 02 / RW 02, Desa Makmur',
      isActive: true
    }
  ];

  var existingUsers = Database.getAll('users');
  var existingPhoneMap = {};
  var existingEmailMap = {};

  existingUsers.forEach(function (u) {
    if (u.phone) existingPhoneMap[String(u.phone).trim()] = u;
    if (u.email) existingEmailMap[String(u.email).trim().toLowerCase()] = u;
  });

  var inserted = 0;
  var updated = 0;

  sampleUsers.forEach(function (su) {
    var keyPhone = su.phone ? String(su.phone).trim() : '';
    var keyEmail = su.email ? String(su.email).trim().toLowerCase() : '';
    var found = existingPhoneMap[keyPhone] || (keyEmail ? existingEmailMap[keyEmail] : null);

    if (found) {
      Database.update('users', found.id, {
        name: su.name,
        role: su.role,
        pin: su.pin,
        address: su.address,
        isActive: true
      });
      updated++;
      Logger.log('  🔄 User diperbarui: ' + su.name + ' (' + su.role + ')');
    } else {
      try {
        Database.insert('users', su);
        inserted++;
        Logger.log('  ✓ User ditambahkan: ' + su.name + ' (' + su.role + ')');
      } catch (e) {
        Logger.log('  ✗ Gagal tambah user "' + su.name + '": ' + e.message);
      }
    }
  });

  Logger.log('👥 Selesai: ' + inserted + ' user baru, ' + updated + ' user diperbarui.');
}

/**
 * Seed & Sinkronisasi Produk Koperasi dengan URL Gambar Lengkap & Jelas
 */
function _seedOrSyncProducts() {
  ProductController.setup();

  var IMG = 'https://images.unsplash.com/photo-';
  var OPT = '?w=480&h=360&fit=crop&auto=format&q=80';

  var sampleProducts = [
    // 1. Beras Merah Organik
    {
      name: 'Beras Merah Organik',
      description: 'Beras merah organik dari ladang desa, bebas pestisida. Kaya serat dan vitamin B.',
      price: 18000,
      stock: 50,
      imageUrl: IMG + '1586201375761-83865001e31c' + OPT,
      category: 'Beras & Serealia',
      isPromo: true,
      promoPrice: 15000,
      soldCount: 84,
      isActive: true
    },
    // 2. Beras Putih Premium
    {
      name: 'Beras Putih Premium',
      description: 'Beras putih kualitas premium hasil panen musim ini. Pulen dan wangi.',
      price: 14000,
      stock: 100,
      imageUrl: IMG + '1536304993881-ff6e9eefa2a6' + OPT,
      category: 'Beras & Serealia',
      isPromo: false,
      promoPrice: 0,
      soldCount: 210,
      isActive: true
    },
    // 3. Jagung Manis Segar
    {
      name: 'Jagung Manis Segar',
      description: 'Jagung manis dipetik pagi hari, manis dan renyah. Cocok untuk direbus atau dibakar.',
      price: 5000,
      stock: 30,
      imageUrl: IMG + '1551754177-f8f87ba0e40c' + OPT,
      category: 'Sayuran',
      isPromo: true,
      promoPrice: 3500,
      soldCount: 120,
      isActive: true
    },
    // 4. Bayam Hijau Segar
    {
      name: 'Bayam Hijau Segar',
      description: 'Bayam segar dipetik langsung dari kebun desa. Kaya zat besi.',
      price: 3000,
      stock: 20,
      imageUrl: IMG + '1576045057995-568f588f82fb' + OPT,
      category: 'Sayuran',
      isPromo: false,
      promoPrice: 0,
      soldCount: 95,
      isActive: true
    },
    // 5. Kangkung Organik
    {
      name: 'Kangkung Organik',
      description: 'Kangkung organik tanpa pupuk kimia. Cocok untuk tumis.',
      price: 2500,
      stock: 25,
      imageUrl: IMG + '1622206151226-18ca2c9ab4a1' + OPT,
      category: 'Sayuran',
      isPromo: false,
      promoPrice: 0,
      soldCount: 80,
      isActive: true
    },
    // 6. Singkong Segar
    {
      name: 'Singkong Segar',
      description: 'Singkong pulen hasil panen petani desa, empuk dan manis.',
      price: 4000,
      stock: 40,
      imageUrl: IMG + '1558618666-fcd25c85cd64' + OPT,
      category: 'Umbi-umbian',
      isPromo: false,
      promoPrice: 0,
      soldCount: 65,
      isActive: true
    },
    // 7. Ubi Jalar Ungu
    {
      name: 'Ubi Jalar Ungu',
      description: 'Ubi jalar ungu kaya antioksidan, manis alami.',
      price: 6000,
      stock: 30,
      imageUrl: IMG + '1596097635121-14b63b7a0c19' + OPT,
      category: 'Umbi-umbian',
      isPromo: false,
      promoPrice: 0,
      soldCount: 45,
      isActive: true
    },
    // 8. Pisang Kepok
    {
      name: 'Pisang Kepok',
      description: 'Pisang kepok matang pohon, cocok untuk digoreng atau dikukus.',
      price: 15000,
      stock: 20,
      imageUrl: IMG + '1603833665858-e61d17a86224' + OPT,
      category: 'Buah',
      isPromo: false,
      promoPrice: 0,
      soldCount: 55,
      isActive: true
    },
    // 9. Pepaya Muda
    {
      name: 'Pepaya Muda',
      description: 'Pepaya muda segar, cocok untuk sayur lodeh atau lalapan.',
      price: 7000,
      stock: 15,
      imageUrl: IMG + '1526318472351-75d1a5c45e7c' + OPT,
      category: 'Buah',
      isPromo: false,
      promoPrice: 0,
      soldCount: 30,
      isActive: true
    },
    // 10. Telur Ayam Kampung
    {
      name: 'Telur Ayam Kampung',
      description: 'Telur ayam kampung asli ternak warga, segar dan bernutrisi tinggi. Isi 10 butir.',
      price: 28000,
      stock: 35,
      imageUrl: IMG + '1582722872445-44dc5f7e3c8f' + OPT,
      category: 'Protein',
      isPromo: true,
      promoPrice: 24000,
      soldCount: 165,
      isActive: true
    },
    // 11. Tempe Segar Daun Pisang
    {
      name: 'Tempe Segar Daun Pisang',
      description: 'Tempe kedelai lokal dibungkus daun pisang tradisional, lebih wangi dan gurih.',
      price: 4000,
      stock: 40,
      imageUrl: IMG + '1621996659776-796c9e5defd6' + OPT,
      category: 'Protein',
      isPromo: false,
      promoPrice: 0,
      soldCount: 140,
      isActive: true
    },
    // 12. Tahu Putih Organik
    {
      name: 'Tahu Putih Organik',
      description: 'Tahu lembut tanpa bahan pengawet, dibuat dari kedelai pilihan. Isi 10 potong.',
      price: 6000,
      stock: 30,
      imageUrl: IMG + '1546069901-ba9599a7e63c' + OPT,
      category: 'Protein',
      isPromo: false,
      promoPrice: 0,
      soldCount: 110,
      isActive: true
    },
    // 13. Gula Aren Asli
    {
      name: 'Gula Aren Asli',
      description: 'Gula aren murni cetak batok dari penderes lokal, manis legit beraroma khas.',
      price: 22000,
      stock: 25,
      imageUrl: IMG + '1596568675222-c78f3aafc3b9' + OPT,
      category: 'Olahan Desa',
      isPromo: false,
      promoPrice: 0,
      soldCount: 75,
      isActive: true
    },
    // 14. Minyak Kelapa Murni (VCO)
    {
      name: 'Minyak Kelapa Murni (VCO)',
      description: 'Virgin coconut oil hasil perasan kelapa desa segar, diproses dingin higienis.',
      price: 35000,
      stock: 20,
      imageUrl: IMG + '1520209268518-aec60b8bb5bf' + OPT,
      category: 'Olahan Desa',
      isPromo: true,
      promoPrice: 29000,
      soldCount: 52,
      isActive: true
    },
    // 15. Jahe Merah Segar
    {
      name: 'Jahe Merah Segar',
      description: 'Jahe merah rimpang tebal dan pedas mantap, bagus untuk penghangat tubuh.',
      price: 25000,
      stock: 18,
      imageUrl: IMG + '1615485290382-441954304158' + OPT,
      category: 'Bumbu & Rempah',
      isPromo: false,
      promoPrice: 0,
      soldCount: 48,
      isActive: true
    },
    // 16. Cabai Merah Keriting
    {
      name: 'Cabai Merah Keriting',
      description: 'Cabai merah segar petik subuh, pedas dan segar tahan lama.',
      price: 30000,
      stock: 25,
      imageUrl: IMG + '1588252303782-cb80119abd6d' + OPT,
      category: 'Bumbu & Rempah',
      isPromo: false,
      promoPrice: 0,
      soldCount: 135,
      isActive: true
    },
    // 17. Bawang Merah Brebes
    {
      name: 'Bawang Merah Brebes',
      description: 'Bawang merah wangi kualitas super dari petani lokal.',
      price: 32000,
      stock: 30,
      imageUrl: IMG + '1618512496248-a07fe83aa8cb' + OPT,
      category: 'Bumbu & Rempah',
      isPromo: true,
      promoPrice: 28000,
      soldCount: 140,
      isActive: true
    },
    // 18. Madu Hutan Murni
    {
      name: 'Madu Hutan Murni',
      description: 'Madu hutan alami tanpa campuran pemanis buatan, kaya khasiat.',
      price: 65000,
      stock: 15,
      imageUrl: IMG + '1587049352846-4a222e784d38' + OPT,
      category: 'Olahan Desa',
      isPromo: true,
      promoPrice: 55000,
      soldCount: 68,
      isActive: true
    },
    // 19. Kopi Robusta Desa
    {
      name: 'Kopi Robusta Desa',
      description: 'Biji kopi robusta petik merah sangrai tradisional khas lereng desa.',
      price: 45000,
      stock: 20,
      imageUrl: IMG + '1559056199-641a0ac8b55e' + OPT,
      category: 'Olahan Desa',
      isPromo: true,
      promoPrice: 38000,
      soldCount: 105,
      isActive: true
    },
    // 20. Jeruk Manis Lokal
    {
      name: 'Jeruk Manis Lokal',
      description: 'Jeruk manis matang pohon, segar dan kaya vitamin C.',
      price: 16000,
      stock: 40,
      imageUrl: IMG + '1611080626919-7cf5a9dbab5b' + OPT,
      category: 'Buah',
      isPromo: false,
      promoPrice: 0,
      soldCount: 88,
      isActive: true
    }
  ];

  var existingProducts = Database.getAll('products');
  var existingMap = {};
  existingProducts.forEach(function (ep) {
    if (ep.name) {
      existingMap[ep.name.trim().toLowerCase()] = ep;
    }
  });

  var inserted = 0;
  var updated = 0;

  sampleProducts.forEach(function (sp) {
    var key = sp.name.trim().toLowerCase();
    var found = existingMap[key];

    // Jika nama tidak persis, coba cari kecocokan parsial
    if (!found) {
      for (var existingKey in existingMap) {
        if (existingKey.indexOf(key) !== -1 || key.indexOf(existingKey) !== -1) {
          found = existingMap[existingKey];
          break;
        }
      }
    }

    if (found) {
      Database.update('products', found.id, {
        name: sp.name,
        imageUrl: sp.imageUrl,
        category: sp.category || found.category,
        description: sp.description || found.description,
        isPromo: sp.isPromo,
        promoPrice: sp.promoPrice,
        soldCount: sp.soldCount || found.soldCount || 0,
        price: sp.price || found.price,
        stock: found.stock !== undefined && found.stock !== '' ? found.stock : sp.stock,
        isActive: true
      });
      updated++;
      Logger.log('  🔄 Produk diperbarui (gambar & promo): ' + sp.name);
    } else {
      try {
        Database.insert('products', sp);
        inserted++;
        Logger.log('  ✓ Produk baru ditambahkan: ' + sp.name);
      } catch (e) {
        Logger.log('  ✗ Gagal tambah produk "' + sp.name + '": ' + e.message);
      }
    }
  });

  // Periksa sisa produk yang belum memiliki gambar dan lengkapi
  var allCurrentProducts = Database.getAll('products');
  allCurrentProducts.forEach(function (p) {
    if (!p.imageUrl || p.imageUrl === '' || p.imageUrl === 'undefined' || p.imageUrl.indexOf('http') !== 0) {
      var resolved = ProductController.getById(p.id);
      if (resolved && resolved.imageUrl) {
        Database.update('products', p.id, { imageUrl: resolved.imageUrl });
        Logger.log('  🖼️ Gambar dilengkapi untuk produk: ' + p.name);
      }
    }
  });

  Logger.log('📦 Selesai: ' + inserted + ' produk baru, ' + updated + ' produk diperbarui.');
}

/**
 * Seed & Sinkronisasi Pesanan Sample untuk Uji Coba Alur Lengkap (Toko -> Admin -> Kurir)
 */
function _seedOrSyncOrders() {
  OrderController.setup();

  var existingOrders = [];
  try {
    existingOrders = Database.getAll('orders');
  } catch(e) {
    existingOrders = [];
  }

  if (existingOrders && existingOrders.length > 0) {
    Logger.log('📋 Pesanan sudah ada di sheet (' + existingOrders.length + ' pesanan). Melewati seed pesanan.');
    return;
  }

  var nowIso = new Date().toISOString();

  var sampleOrders = [
    // 1. Pesanan Sedang Diantar oleh Kurir Budi
    {
      userId: 'usr-anggota-2',
      customerName: 'Dewi Lestari',
      customerPhone: '081200000002',
      customerAddress: 'Dusun Sukamaju RT 02 / RW 01, Desa Makmur',
      items: JSON.stringify([
        { name: 'Beras Rojo Lele Super 5kg', price: 68000, qty: 1 },
        { name: 'Minyak Goreng Bimoli 2L', price: 34000, qty: 1 }
      ]),
      total: 102000,
      status: 'delivering',
      paymentMethod: 'COD',
      courierName: 'Kurir Budi',
      notes: 'Rumah cat hijau pagar hitam dekat masjid'
    },
    // 2. Pesanan Siap Disiapkan di Gerai
    {
      userId: 'usr-anggota-1',
      customerName: 'Ahmad Fauzi',
      customerPhone: '081200000001',
      customerAddress: 'Dusun Mekarsari RT 01 / RW 02, Desa Makmur',
      items: JSON.stringify([
        { name: 'Gula Pasir Gulaku 1kg', price: 16500, qty: 2 },
        { name: 'Telur Ayam Ras Segar 1kg', price: 28000, qty: 1 }
      ]),
      total: 61000,
      status: 'processing',
      paymentMethod: 'COD',
      courierName: 'Kurir Budi',
      notes: 'Tolong telur dipilihkan yang bagus'
    },
    // 3. Pesanan Selesai Hari Ini
    {
      userId: 'usr-anggota-3',
      customerName: 'Bambang Prakoso',
      customerPhone: '081200000003',
      customerAddress: 'Dusun Karanganyar RT 03 / RW 02, Desa Makmur',
      items: JSON.stringify([
        { name: 'Kopi Bubuk Asli Desa 250gr', price: 18000, qty: 2 },
        { name: 'Tepung Terigu Segitiga Biru 1kg', price: 12500, qty: 1 }
      ]),
      total: 48500,
      status: 'completed',
      paymentMethod: 'COD',
      courierName: 'Kurir Budi',
      completedAt: nowIso,
      notes: 'Selesai diantar dan uang tunai diterima'
    },
    // 4. Pesanan Baru Masuk
    {
      userId: 'usr-anggota-4',
      customerName: 'Sri Wahyuni',
      customerPhone: '081200000004',
      customerAddress: 'Dusun Mekarsari RT 01 / RW 03, Desa Makmur',
      items: JSON.stringify([
        { name: 'Indomie Goreng Spesial', price: 3000, qty: 5 },
        { name: 'Teh Celup SariWangi 25s', price: 6500, qty: 1 }
      ]),
      total: 21500,
      status: 'pending',
      paymentMethod: 'COD',
      notes: 'Mohon segera dikirim ya'
    }
  ];

  sampleOrders.forEach(function(o) {
    try {
      Database.insert('orders', o);
      Logger.log('  ✓ Pesanan sample dibuat untuk: ' + o.customerName + ' (' + o.status + ')');
    } catch(e) {
      Logger.log('  ✗ Gagal buat pesanan sample: ' + e.message);
    }
  });

  Logger.log('📋 Selesai membuat ' + sampleOrders.length + ' pesanan sample.');
}
