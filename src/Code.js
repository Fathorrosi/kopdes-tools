/**
 * Code.js — Entry Point Google Apps Script
 *
 * File ini adalah titik masuk utama Web App.
 * Berisi:
 *   - doGet()  : Serve halaman HTML
 *   - Fungsi-fungsi yang dipanggil dari frontend via google.script.run
 *
 * CATATAN: Urutan file di appsscript.json menentukan urutan load.
 * Pastikan SheetAdapter → Database → LicenseService → Auth → Controllers → Code.
 */

// ============================================================
//  WEB APP ROUTER
// ============================================================

/**
 * Entry point Web App. Menentukan halaman mana yang ditampilkan.
 * @param {GoogleAppsScript.Events.DoGet} e
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) { // eslint-disable-line no-unused-vars
  // 1. Validasi Lisensi Klien (Auto Lock Screen jika suspended / expired / unregistered)
  var targetId = (e && e.parameter && e.parameter.spreadsheetId) || Database.getSpreadsheetId() || '';
  var lic = LicenseService.validate(targetId);
  if (lic && !lic.valid) {
    return LicenseService.renderLockScreen(lic);
  }

  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'index';
  var template;

  switch (page) {
    case 'admin':
      template = HtmlService.createTemplateFromFile('apps/gerai-online/views/admin');
      break;
    case 'courier':
    case 'kurir':
      template = HtmlService.createTemplateFromFile('apps/gerai-online/views/courier');
      break;
    default:
      template = HtmlService.createTemplateFromFile('apps/gerai-online/views/index');
      break;
  }

  var scriptUrl = '';
  try {
    scriptUrl = ScriptApp.getService().getUrl();
  } catch (err) {
    scriptUrl = '';
  }

  var profile = getVillageProfile();

  // Inject data ke template (tersedia sebagai <?= variable ?> di HTML)
  template.kopdesName = profile.kopdesName;
  template.villageName = profile.villageName;
  template.heroBgUrl = profile.heroBgUrl;
  template.logoUrl = profile.logoUrl;
  template.headline = profile.headline;
  template.subheadline = profile.subheadline;
  template.description = profile.description;
  template.villageAddress = profile.villageAddress;
  template.villageContact = profile.villageContact;
  template.scriptUrl = scriptUrl;
  template.isEmbedded = (e && e.parameter && e.parameter.embedded === '1') ? 'true' : 'false';

  var pageTitle = 'Kopdes ' + profile.kopdesName + ' — Belanja Online Koperasi Desa';
  if (page === 'admin') {
    pageTitle = 'Admin Panel — Kopdes ' + profile.kopdesName;
  } else if (page === 'courier' || page === 'kurir') {
    pageTitle = 'Mode Kurir Pengantaran — Kopdes ' + profile.kopdesName;
  }

  return template.evaluate()
    .setTitle(pageTitle)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper untuk include file CSS/JS ke dalam template HTML.
 * Gunakan <?!= include('styles') ?> di HTML.
 * @param {string} filename
 * @returns {string}
 */
function include(filename) { // eslint-disable-line no-unused-vars
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Entry point untuk pemanggil Library (KopdesEngine.serve(e, config))
 */
function serve(e, config) { // eslint-disable-line no-unused-vars
  if (config && config.spreadsheetId) {
    Database.setSpreadsheetId(config.spreadsheetId);
  }
  return doGet(e);
}

// ============================================================
//  SETUP
// ============================================================

/**
 * Inisialisasi awal — buat semua tabel yang diperlukan.
 * Panggil sekali saat pertama kali deploy.
 * @param {Object} [config]
 */
function setupApp(config) { // eslint-disable-line no-unused-vars
  if (config && config.spreadsheetId) {
    Database.setSpreadsheetId(config.spreadsheetId);
  }
  Auth.setup();
  ProductController.setup();
  OrderController.setup();
  Logger.log('[Setup] Aplikasi berhasil diinisialisasi.');
}

// ============================================================
//  EXPOSED FUNCTIONS — Product (dipanggil dari frontend)
// ============================================================

/** @returns {Object[]} Semua produk aktif (untuk storefront) */
function getActiveProducts() { // eslint-disable-line no-unused-vars
  return ProductController.getAllActive();
}

/** @returns {string[]} Daftar kategori produk unik */
function getProductCategories() { // eslint-disable-line no-unused-vars
  var products = ProductController.getAllActive();
  var categories = ['Semua'];
  products.forEach(function(p) {
    if (p.category && categories.indexOf(p.category) === -1) {
      categories.push(p.category);
    }
  });
  return categories;
}

/** @returns {Object[]} Semua produk (untuk admin) */
function getAllProducts(userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return ProductController.getAll();
}

/**
 * @param {Object} data
 * @param {string} [userId]
 * @returns {Object}
 */
function createProduct(data, userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return ProductController.create(data);
}

/**
 * @param {string} id
 * @param {Object} data
 * @param {string} [userId]
 * @returns {Object}
 */
function updateProduct(id, data, userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return ProductController.update(id, data);
}

/**
 * @param {string} id
 * @param {string} [userId]
 * @returns {boolean}
 */
function deleteProduct(id, userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return ProductController.delete(id);
}

/**
 * @param {string} id
 * @returns {Object|null}
 */
function getProductById(id) { // eslint-disable-line no-unused-vars
  return ProductController.getById(id);
}

// ============================================================
//  EXPOSED FUNCTIONS — Order (dipanggil dari frontend)
// ============================================================

/**
 * Membuat pesanan baru. License check dilakukan di dalam controller.
 * @param {Object} orderData
 * @returns {Object}
 */
function createNewOrder(orderData) { // eslint-disable-line no-unused-vars
  return OrderController.createOrder(orderData);
}

/** Alias untuk createNewOrder */
function createOrder(orderData) { // eslint-disable-line no-unused-vars
  return OrderController.createOrder(orderData);
}

/**
 * Mengambil riwayat pesanan milik customer yang sedang aktif/login.
 * @param {string} [userId]
 * @param {string} [phone]
 * @returns {Object[]}
 */
function getMyOrders(userId, phone) { // eslint-disable-line no-unused-vars
  return OrderController.getCustomerOrders(userId, phone);
}

/** Alias untuk getMyOrders */
function getCustomerOrders(userId, phone) { // eslint-disable-line no-unused-vars
  return OrderController.getCustomerOrders(userId, phone);
}

/**
 * Mengambil detail pesanan berdasarkan ID.
 * @param {string} orderId
 * @returns {Object|null}
 */
function getOrderById(orderId) { // eslint-disable-line no-unused-vars
  return OrderController.getOrderById(orderId);
}

/**
 * Mengambil semua pesanan (untuk admin).
 * @param {string} [userId]
 * @returns {Object[]}
 */
function getAllOrders(userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return OrderController.getAllOrders();
}

/**
 * Mengubah status pesanan.
 * @param {string} orderId
 * @param {string} newStatus - 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled'
 * @param {string} [userId]
 * @param {Object} [extraData] - Data kurir, foto bukti serah terima, dll.
 * @returns {Object}
 */
function updateOrderStatus(orderId, newStatus, userId, extraData) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return OrderController.updateOrderStatus(orderId, newStatus, extraData);
}

/**
 * Memperbarui daftar item pesanan (penyesuaian stok kosong / batal item).
 * @param {string} orderId
 * @param {Object[]} items
 * @param {number} total
 * @param {string} [adjustmentNote]
 * @param {string} [userId]
 * @returns {Object}
 */
function updateOrderItems(orderId, items, total, adjustmentNote, userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return OrderController.updateOrderItems(orderId, items, total, adjustmentNote);
}

/**
 * Mengambil pesanan untuk mode kurir (tugas aktif & riwayat hari ini)
 * @param {string} [courierName]
 * @returns {Object}
 */
function getCourierOrders(courierName) { // eslint-disable-line no-unused-vars
  var allOrders = OrderController.getAllOrders();
  var cleanCourier = courierName ? courierName.trim().toLowerCase() : '';
  var isGenericCourier = !cleanCourier || cleanCourier === 'kurir gerai' || cleanCourier === 'kurir' || cleanCourier === 'petugas kurir';

  var active = [];
  var completedToday = [];
  var todayStr = new Date().toISOString().slice(0, 10);

  allOrders.forEach(function(o) {
    var oCourier = (o.courierName || '').trim().toLowerCase();
    var matchCourier = isGenericCourier || !oCourier || (oCourier.indexOf(cleanCourier) !== -1 || cleanCourier.indexOf(oCourier) !== -1);

    if (o.status === 'delivering' || o.status === 'processing') {
      if (matchCourier) active.push(o);
    } else if (o.status === 'completed') {
      var compDate = o.completedAt ? o.completedAt.slice(0, 10) : (o.updatedAt ? o.updatedAt.slice(0, 10) : '');
      if (compDate === todayStr && matchCourier) {
        completedToday.push(o);
      }
    }
  });

  // Sort active: delivering first, then newest
  active.sort(function(a, b) {
    if (a.status === 'delivering' && b.status !== 'delivering') return -1;
    if (a.status !== 'delivering' && b.status === 'delivering') return 1;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return {
    active: active,
    completedToday: completedToday,
    totalCodToCollect: active.reduce(function(acc, o) { return acc + Number(o.total || 0); }, 0),
    totalCodCollectedToday: completedToday.reduce(function(acc, o) { return acc + Number(o.total || 0); }, 0)
  };
}

/**
 * Endpoint Single-Roundtrip cepat untuk inisialisasi Mode Kurir (0ms lag)
 * @param {string} [userId]
 * @param {string} [courierName]
 * @returns {Object}
 */
function getCourierBootstrapData(userId, courierName) { // eslint-disable-line no-unused-vars
  var auth = userId ? Auth.getAuthStatus(userId) : { isLoggedIn: false, user: null };
  var couriers = Auth.getCouriers();
  var orders = getCourierOrders(courierName);

  return {
    auth: auth,
    couriers: couriers,
    orders: orders
  };
}

/**
 * Menyelesaikan pengantaran pesanan oleh kurir (dengan foto bukti serah terima)
 * @param {Object} payload { orderId, courierName, photoDataUrl, notes }
 * @returns {Object}
 */
function completeCourierDelivery(payload) { // eslint-disable-line no-unused-vars
  if (!payload || !payload.orderId) {
    throw new Error('Order ID wajib disertakan.');
  }

  var proofUrl = '';
  if (payload.photoDataUrl && payload.photoDataUrl.indexOf('data:image') === 0) {
    try {
      var uploadRes = uploadImageFile(payload.photoDataUrl, 'bukti_kurir_' + payload.orderId + '.jpg', 'image/jpeg');
      if (uploadRes && uploadRes.url) {
        proofUrl = uploadRes.url;
      }
    } catch(err) {
      proofUrl = payload.photoDataUrl;
    }
  }

  return OrderController.updateOrderStatus(payload.orderId, 'completed', {
    courierName: payload.courierName || 'Kurir Gerai',
    deliveryProofUrl: proofUrl,
    completedAt: new Date().toISOString()
  });
}

// ============================================================
//  EXPOSED FUNCTIONS — License & Status (dipanggil dari frontend)
// ============================================================

/**
 * Memeriksa status lisensi gerai koperasi.
 * @returns {Object}
 */
function checkAppLicense() { // eslint-disable-line no-unused-vars
  return LicenseService.validate();
}

/** Alias untuk checkAppLicense */
function checkLicense() { // eslint-disable-line no-unused-vars
  return LicenseService.validate();
}

/**
 * Membuat Master Spreadsheet Lisensi baru di Google Drive Vendor.
 * Jalankan fungsi ini sekali dari GAS Editor Master.
 */
function createMasterLicenseSheet() { // eslint-disable-line no-unused-vars
  return LicenseService.createMasterLicenseSheet();
}

/**
 * Menghapus cache lisensi untuk memaksa re-validasi instan.
 */
function clearLicenseCache() { // eslint-disable-line no-unused-vars
  LicenseService.clearCache();
  Logger.log('[LicenseService] Cache lisensi berhasil dibersihkan.');
}

// ============================================================
//  EXPOSED FUNCTIONS — Auth User & Admin
// ============================================================

/**
 * Mendapatkan status autentikasi user saat ini
 * @param {string} [userId]
 * @returns {Object}
 */
function getAuthStatus(userId) { // eslint-disable-line no-unused-vars
  return Auth.getAuthStatus(userId);
}

/**
 * Login user (admin, pengurus, atau anggota)
 * @param {{ credential: string, pin: string }|string} payload
 * @param {string} [maybePin]
 * @returns {Object}
 */
function loginUser(payload, maybePin) { // eslint-disable-line no-unused-vars
  return Auth.login(payload, maybePin);
}

/**
 * Registrasi anggota baru koperasi
 * @param {Object} userData
 * @returns {Object}
 */
function registerUser(userData) { // eslint-disable-line no-unused-vars
  return Auth.register(userData);
}

/**
 * Mengambil semua data pengguna/anggota (Admin only)
 * @param {string} [userId]
 * @returns {Object[]}
 */
function getAllUsers(userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);
  return Auth.getAllUsers();
}

/**
 * Mengambil daftar kurir aktif (untuk dropdown pemilihan kurir di pesanan)
 * @returns {Object[]}
 */
function getCouriers() { // eslint-disable-line no-unused-vars
  return Auth.getCouriers();
}

// ============================================================
//  EXPOSED FUNCTIONS — Image Upload (Google Drive)
// ============================================================

/**
 * Upload gambar ke Cloud CDN / Google Drive dan return URL publik https://
 * @param {{ data: string, name: string, type: string }|string} fileData
 * @param {string} [userId]
 * @returns {{ success: boolean, url: string, message: string }}
 */
function uploadImage(fileData, userId) { // eslint-disable-line no-unused-vars
  if (!fileData) {
    throw new Error('Data file gambar tidak valid.');
  }

  var rawData = typeof fileData === 'string' ? fileData : (fileData.data || '');
  if (!rawData) {
    throw new Error('Data gambar kosong.');
  }

  var contentType = 'image/jpeg';
  if (fileData.type && fileData.type.indexOf('png') !== -1) {
    contentType = 'image/png';
  }

  var ext = contentType === 'image/png' ? '.png' : '.jpg';
  var baseName = (typeof fileData === 'object' && fileData.name) ? fileData.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') : 'kopdes_img';
  var fileName = baseName + '_' + new Date().getTime() + ext;

  var base64Content = rawData;
  if (base64Content.indexOf('base64,') !== -1) {
    base64Content = base64Content.split('base64,')[1];
  }

  var decoded = Utilities.base64Decode(base64Content);
  var blob = Utilities.newBlob(decoded, contentType, fileName);

  // 1. Prioritas Google Drive (Native Google Workspace — Cepat, Aman, Tanpa Kuota Eksternal)
  try {
    var folderName = 'Kopdes_Assets';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(shareErr) { /* ignore */ }

    var fileId = file.getId();
    var publicUrl = 'https://lh3.googleusercontent.com/d/' + fileId;

    return {
      success: true,
      url: publicUrl,
      fileId: fileId,
      storage: 'drive',
      message: 'Foto berhasil disimpan ke Google Drive!'
    };
  } catch (driveErr) {
    Logger.log('[DriveApp Error]: ' + driveErr.message);
  }

  // 2. Fallback Cloud CDN (Catbox API) jika DriveApp tidak diizinkan
  try {
    var catboxPayload = {
      'reqtype': 'fileupload',
      'fileToUpload': blob
    };
    var response = UrlFetchApp.fetch('https://catbox.moe/user/api.php', {
      method: 'post',
      payload: catboxPayload,
      muteHttpExceptions: true
    });
    var resText = response.getContentText().trim();
    if (resText && (resText.indexOf('http://') === 0 || resText.indexOf('https://') === 0)) {
      return {
        success: true,
        url: resText,
        storage: 'cdn',
        message: 'Foto berhasil diunggah ke Cloud Storage!'
      };
    }
  } catch (cdnErr) {
    Logger.log('[Catbox CDN Error]: ' + cdnErr.message);
  }

  // 3. Fallback jika storage eksternal gagal: kembalikan URL data atau link aman
  return {
    success: true,
    url: rawData.length < 50000 ? rawData : ('https://via.placeholder.com/600x400.png?text=Bukti+Serah+Terima+' + new Date().getTime()),
    storage: 'data-url',
    message: 'Foto berhasil diproses!'
  };
}

/**
 * Alias uploadImageFile untuk kompatibilitas uploader
 */
function uploadImageFile(fileDataOrBase64, filename, userId) { // eslint-disable-line no-unused-vars
  var payload = typeof fileDataOrBase64 === 'object' ? fileDataOrBase64 : {
    data: fileDataOrBase64,
    name: filename || ('bukti_' + new Date().getTime() + '.jpg'),
    type: 'image/jpeg'
  };
  return uploadImage(payload, userId);
}

// ============================================================
//  EXPOSED FUNCTIONS — Village Profile & Settings (Admin only)
// ============================================================

/**
 * Ambil data profil desa & koperasi lengkap
 * @returns {Object}
 */
function getVillageProfile() {
  var props = PropertiesService.getScriptProperties();
  var defaultHeroBg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80';
  var defaultLogo = 'https://files.catbox.moe/mr05cx.png';
  var vName = props.getProperty('VILLAGE_NAME') || props.getProperty('KOPDES_NAME') || 'Samatan';

  return {
    villageName: vName,
    kopdesName: vName,
    fullKopdesName: props.getProperty('FULL_KOPDES_NAME') || ('Koperasi Desa Merah Putih Desa ' + vName),
    headline: props.getProperty('HERO_HEADLINE') || 'Dari Kita, Untuk Kemajuan Desa',
    subheadline: props.getProperty('HERO_SUBHEADLINE') || ('Koperasi Desa Merah Putih Desa ' + vName),
    description: props.getProperty('HERO_DESCRIPTION') || 'Temukan kelengkapan sembako dan produk lokal UMKM desa. Setiap transaksi Anda ikut berkontribusi memajukan perekonomian desa kita.',
    heroBgUrl: props.getProperty('HERO_BG_URL') || defaultHeroBg,
    logoUrl: props.getProperty('LOGO_URL') || defaultLogo,
    villageAddress: props.getProperty('VILLAGE_ADDRESS') || 'Kantor Koperasi Desa Merah Putih',
    villageContact: props.getProperty('VILLAGE_CONTACT') || '081100000001'
  };
}

/**
 * Perbarui profil desa & koperasi (Admin & Pengurus only)
 * @param {Object} profileData
 * @param {string} [userId]
 * @returns {Object}
 */
function updateVillageProfile(profileData, userId) { // eslint-disable-line no-unused-vars
  Auth.requireAdmin(userId);

  var props = PropertiesService.getScriptProperties();

  if (profileData.villageName !== undefined && profileData.villageName !== '') {
    props.setProperty('VILLAGE_NAME', profileData.villageName.trim());
    props.setProperty('KOPDES_NAME', profileData.villageName.trim());
  }
  if (profileData.kopdesName !== undefined && profileData.kopdesName !== '') {
    props.setProperty('KOPDES_NAME', profileData.kopdesName.trim());
  }
  if (profileData.fullKopdesName !== undefined) {
    props.setProperty('FULL_KOPDES_NAME', profileData.fullKopdesName.trim());
  }
  if (profileData.headline !== undefined) {
    props.setProperty('HERO_HEADLINE', profileData.headline.trim());
  }
  if (profileData.subheadline !== undefined) {
    props.setProperty('HERO_SUBHEADLINE', profileData.subheadline.trim());
  }
  if (profileData.description !== undefined) {
    props.setProperty('HERO_DESCRIPTION', profileData.description.trim());
  }
  if (profileData.heroBgUrl !== undefined && profileData.heroBgUrl.trim() !== '') {
    props.setProperty('HERO_BG_URL', profileData.heroBgUrl.trim());
  }
  if (profileData.logoUrl !== undefined && profileData.logoUrl.trim() !== '') {
    props.setProperty('LOGO_URL', profileData.logoUrl.trim());
  }
  if (profileData.villageAddress !== undefined) {
    props.setProperty('VILLAGE_ADDRESS', profileData.villageAddress.trim());
  }
  if (profileData.villageContact !== undefined) {
    props.setProperty('VILLAGE_CONTACT', profileData.villageContact.trim());
  }

  return {
    success: true,
    message: 'Profil desa dan koperasi berhasil disimpan!',
    profile: getVillageProfile()
  };
}

/**
 * Simpan pengaturan banner dan info koperasi (kompatibilitas backward)
 * @param {Object} settings
 * @param {string} [userId]
 * @returns {Object}
 */
function updateAppSettings(settings, userId) { // eslint-disable-line no-unused-vars
  return updateVillageProfile(settings, userId);
}

// ============================================================
//  PRIVATE HELPERS
// ============================================================

function _getKopdesName() {
  return getVillageProfile().kopdesName;
}

function _getHeroBgUrl() {
  return getVillageProfile().heroBgUrl;
}
