/**
 * ProductController.js
 *
 * Controller untuk manajemen Produk di Gerai Online.
 * Semua akses data melalui Database.js — tidak ada SpreadsheetApp di sini.
 *
 * Skema tabel 'products':
 *   id, name, description, price, stock, imageUrl, category, isActive, isPromo, promoPrice, soldCount, createdAt, updatedAt
 */

// eslint-disable-next-line no-unused-vars
var ProductController = (function () {

  var TABLE = 'products';
  var COLUMNS = [
    'name',
    'description',
    'price',
    'stock',
    'imageUrl',
    'category',
    'isActive',
    'isPromo',
    'promoPrice',
    'soldCount'
  ];

  var IMG_BASE = 'https://images.unsplash.com/photo-';
  var IMG_OPT = '?w=480&h=360&fit=crop&auto=format&q=80';

  var DEFAULT_IMAGES = {
    'beras merah organik': IMG_BASE + '1586201375761-83865001e31c' + IMG_OPT,
    'beras merah': IMG_BASE + '1586201375761-83865001e31c' + IMG_OPT,
    'beras putih premium': IMG_BASE + '1536304993881-ff6e9eefa2a6' + IMG_OPT,
    'beras putih': IMG_BASE + '1536304993881-ff6e9eefa2a6' + IMG_OPT,
    'beras': IMG_BASE + '1586201375761-83865001e31c' + IMG_OPT,
    'jagung manis segar': IMG_BASE + '1551754177-f8f87ba0e40c' + IMG_OPT,
    'jagung manis': IMG_BASE + '1551754177-f8f87ba0e40c' + IMG_OPT,
    'jagung': IMG_BASE + '1551754177-f8f87ba0e40c' + IMG_OPT,
    'bayam hijau segar': IMG_BASE + '1576045057995-568f588f82fb' + IMG_OPT,
    'bayam hijau': IMG_BASE + '1576045057995-568f588f82fb' + IMG_OPT,
    'bayam': IMG_BASE + '1576045057995-568f588f82fb' + IMG_OPT,
    'kangkung organik': IMG_BASE + '1622206151226-18ca2c9ab4a1' + IMG_OPT,
    'kangkung': IMG_BASE + '1622206151226-18ca2c9ab4a1' + IMG_OPT,
    'singkong segar': IMG_BASE + '1558618666-fcd25c85cd64' + IMG_OPT,
    'singkong': IMG_BASE + '1558618666-fcd25c85cd64' + IMG_OPT,
    'ubi jalar ungu': IMG_BASE + '1596097635121-14b63b7a0c19' + IMG_OPT,
    'ubi jalar': IMG_BASE + '1596097635121-14b63b7a0c19' + IMG_OPT,
    'ubi': IMG_BASE + '1596097635121-14b63b7a0c19' + IMG_OPT,
    'pisang kepok': IMG_BASE + '1603833665858-e61d17a86224' + IMG_OPT,
    'pisang': IMG_BASE + '1603833665858-e61d17a86224' + IMG_OPT,
    'pepaya muda': IMG_BASE + '1526318472351-75d1a5c45e7c' + IMG_OPT,
    'pepaya': IMG_BASE + '1526318472351-75d1a5c45e7c' + IMG_OPT,
    'telur ayam kampung': IMG_BASE + '1582722872445-44dc5f7e3c8f' + IMG_OPT,
    'telur ayam': IMG_BASE + '1582722872445-44dc5f7e3c8f' + IMG_OPT,
    'telur': IMG_BASE + '1582722872445-44dc5f7e3c8f' + IMG_OPT,
    'tempe segar daun pisang': IMG_BASE + '1621996659776-796c9e5defd6' + IMG_OPT,
    'tempe segar': IMG_BASE + '1621996659776-796c9e5defd6' + IMG_OPT,
    'tempe': IMG_BASE + '1621996659776-796c9e5defd6' + IMG_OPT,
    'tahu putih organik': IMG_BASE + '1546069901-ba9599a7e63c' + IMG_OPT,
    'tahu putih': IMG_BASE + '1546069901-ba9599a7e63c' + IMG_OPT,
    'tahu': IMG_BASE + '1546069901-ba9599a7e63c' + IMG_OPT,
    'gula aren asli': IMG_BASE + '1596568675222-c78f3aafc3b9' + IMG_OPT,
    'gula aren': IMG_BASE + '1596568675222-c78f3aafc3b9' + IMG_OPT,
    'gula': IMG_BASE + '1596568675222-c78f3aafc3b9' + IMG_OPT,
    'minyak kelapa murni (vco)': IMG_BASE + '1520209268518-aec60b8bb5bf' + IMG_OPT,
    'minyak kelapa murni': IMG_BASE + '1520209268518-aec60b8bb5bf' + IMG_OPT,
    'minyak kelapa': IMG_BASE + '1520209268518-aec60b8bb5bf' + IMG_OPT,
    'minyak': IMG_BASE + '1520209268518-aec60b8bb5bf' + IMG_OPT,
    'jahe merah segar': IMG_BASE + '1615485290382-441954304158' + IMG_OPT,
    'jahe merah': IMG_BASE + '1615485290382-441954304158' + IMG_OPT,
    'jahe': IMG_BASE + '1615485290382-441954304158' + IMG_OPT,
    'cabai merah keriting': IMG_BASE + '1588252303782-cb80119abd6d' + IMG_OPT,
    'cabai merah': IMG_BASE + '1588252303782-cb80119abd6d' + IMG_OPT,
    'cabai': IMG_BASE + '1588252303782-cb80119abd6d' + IMG_OPT,
    'bawang merah brebes': IMG_BASE + '1618512496248-a07fe83aa8cb' + IMG_OPT,
    'bawang merah': IMG_BASE + '1618512496248-a07fe83aa8cb' + IMG_OPT,
    'bawang': IMG_BASE + '1618512496248-a07fe83aa8cb' + IMG_OPT,
    'madu hutan murni': IMG_BASE + '1587049352846-4a222e784d38' + IMG_OPT,
    'madu hutan': IMG_BASE + '1587049352846-4a222e784d38' + IMG_OPT,
    'madu': IMG_BASE + '1587049352846-4a222e784d38' + IMG_OPT,
    'kopi robusta desa': IMG_BASE + '1559056199-641a0ac8b55e' + IMG_OPT,
    'kopi robusta': IMG_BASE + '1559056199-641a0ac8b55e' + IMG_OPT,
    'kopi': IMG_BASE + '1559056199-641a0ac8b55e' + IMG_OPT,
    'jeruk manis lokal': IMG_BASE + '1611080626919-7cf5a9dbab5b' + IMG_OPT,
    'jeruk manis': IMG_BASE + '1611080626919-7cf5a9dbab5b' + IMG_OPT,
    'jeruk': IMG_BASE + '1611080626919-7cf5a9dbab5b' + IMG_OPT
  };

  var CATEGORY_IMAGES = {
    'beras & serealia': IMG_BASE + '1586201375761-83865001e31c' + IMG_OPT,
    'sayuran': IMG_BASE + '1576045057995-568f588f82fb' + IMG_OPT,
    'umbi-umbian': IMG_BASE + '1558618666-fcd25c85cd64' + IMG_OPT,
    'buah': IMG_BASE + '1611080626919-7cf5a9dbab5b' + IMG_OPT,
    'protein': IMG_BASE + '1582722872445-44dc5f7e3c8f' + IMG_OPT,
    'bumbu & rempah': IMG_BASE + '1596568675222-c78f3aafc3b9' + IMG_OPT,
    'olahan desa': IMG_BASE + '1587049352846-4a222e784d38' + IMG_OPT
  };

  var DEFAULT_PROMOS = {
    'beras merah organik': { promoPrice: 15000, soldCount: 84 },
    'beras merah': { promoPrice: 15000, soldCount: 84 },
    'jagung manis segar': { promoPrice: 3500, soldCount: 120 },
    'jagung manis': { promoPrice: 3500, soldCount: 120 },
    'telur ayam kampung': { promoPrice: 24000, soldCount: 165 },
    'telur ayam': { promoPrice: 24000, soldCount: 165 },
    'kopi robusta desa': { promoPrice: 38000, soldCount: 105 },
    'kopi robusta': { promoPrice: 38000, soldCount: 105 },
    'madu hutan murni': { promoPrice: 55000, soldCount: 68 },
    'madu hutan': { promoPrice: 55000, soldCount: 68 },
    'minyak kelapa murni (vco)': { promoPrice: 29000, soldCount: 52 },
    'minyak kelapa murni': { promoPrice: 29000, soldCount: 52 },
    'bawang merah brebes': { promoPrice: 28000, soldCount: 140 },
    'bawang merah': { promoPrice: 28000, soldCount: 140 }
  };

  var DEFAULT_SOLD = {
    'beras putih premium': 210,
    'beras putih': 210,
    'cabai merah keriting': 135,
    'cabai merah': 135,
    'tempe segar daun pisang': 140,
    'tempe segar': 140,
    'tahu putih organik': 110,
    'tahu putih': 110,
    'bayam hijau segar': 95,
    'bayam': 95,
    'kangkung organik': 80,
    'kangkung': 80,
    'singkong segar': 65,
    'singkong': 65,
    'jeruk manis lokal': 88,
    'jeruk manis': 88,
    'gula aren asli': 75,
    'gula aren': 75
  };

  function _findDefaultImage(name, category) {
    var nameKey = (name || '').trim().toLowerCase();
    var catKey = (category || '').trim().toLowerCase();

    // 1. Direct match
    if (DEFAULT_IMAGES[nameKey]) return DEFAULT_IMAGES[nameKey];

    // 2. Partial search in keys
    var keys = Object.keys(DEFAULT_IMAGES);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (nameKey.indexOf(k) !== -1 || k.indexOf(nameKey) !== -1) {
        return DEFAULT_IMAGES[k];
      }
    }

    // 3. Category match
    if (CATEGORY_IMAGES[catKey]) return CATEGORY_IMAGES[catKey];

    // 4. Default fallback
    return IMG_BASE + '1542838132-92c53300491e' + IMG_OPT;
  }

  function _resolveImage(p) {
    if (!p) return p;

    var nameKey = (p.name || '').trim().toLowerCase();

    // Pastikan imageUrl tidak kosong atau invalid
    var hasValidUrl = p.imageUrl && (p.imageUrl.indexOf('http://') === 0 || p.imageUrl.indexOf('https://') === 0 || p.imageUrl.indexOf('data:image/') === 0);
    if (!hasValidUrl) {
      p.imageUrl = _findDefaultImage(p.name, p.category);
    }

    // Normalisasi harga asli
    p.price = Number(p.price) || 0;

    // Normalisasi promo fields dengan dukungan berbagai nama kolom Sheet (Indonesia & Inggris)
    var promoPriceVal = 0;
    if (p.promoPrice !== undefined && p.promoPrice !== '') {
      promoPriceVal = p.promoPrice;
    } else if (p['Harga Promo'] !== undefined && p['Harga Promo'] !== '') {
      promoPriceVal = p['Harga Promo'];
    } else if (p['hargaPromo'] !== undefined && p['hargaPromo'] !== '') {
      promoPriceVal = p['hargaPromo'];
    } else if (p['Harga_Promo'] !== undefined && p['Harga_Promo'] !== '') {
      promoPriceVal = p['Harga_Promo'];
    } else if (p['Promo Price'] !== undefined && p['Promo Price'] !== '') {
      promoPriceVal = p['Promo Price'];
    } else if (p['Diskon'] !== undefined && p['Diskon'] !== '') {
      promoPriceVal = p['Diskon'];
    }
    p.promoPrice = Number(promoPriceVal) || 0;

    var isPromoVal = false;
    if (p.isPromo !== undefined && p.isPromo !== '') {
      isPromoVal = String(p.isPromo).toLowerCase() === 'true' || p.isPromo === true;
    } else if (p['Promo'] !== undefined && p['Promo'] !== '') {
      isPromoVal = String(p['Promo']).toLowerCase() === 'true' || p['Promo'] === true;
    }

    // Fallback default promo jika belum terset di Sheet
    if (p.promoPrice <= 0 && DEFAULT_PROMOS[nameKey]) {
      p.promoPrice = DEFAULT_PROMOS[nameKey].promoPrice;
      p.isPromo = true;
      if (!p.soldCount) p.soldCount = DEFAULT_PROMOS[nameKey].soldCount;
    } else if (p.promoPrice > 0 && p.promoPrice < p.price) {
      p.isPromo = true;
    } else {
      p.isPromo = isPromoVal;
    }

    // Sold count
    var soldVal = Number(p.soldCount || p['Terjual'] || p.terjual) || 0;
    if (soldVal <= 0 && DEFAULT_SOLD[nameKey]) {
      soldVal = DEFAULT_SOLD[nameKey];
    }
    p.soldCount = soldVal;

    return p;
  }

  /**
   * Inisialisasi tabel produk (panggil sekali saat setup).
   */
  function setup() {
    Database.ensureTable(TABLE, COLUMNS);
  }

  /**
   * Mengambil semua produk yang aktif (untuk halaman storefront publik).
   * Diurutkan: 1. Promo terlebih dahulu, 2. Paling banyak dibeli (soldCount), 3. Nama.
   * @returns {Object[]}
   */
  function getAllActive() {
    try { setup(); } catch (e) { /* ignore */ }

    var list = Database.query(TABLE, function (row) {
      return String(row.isActive).toLowerCase() === 'true';
    });

    var resolved = list.map(_resolveImage);

    // Sorting: Promo first, then soldCount desc, then ID/name
    resolved.sort(function (a, b) {
      var aPromo = a.isPromo && a.promoPrice > 0 ? 1 : 0;
      var bPromo = b.isPromo && b.promoPrice > 0 ? 1 : 0;
      if (bPromo !== aPromo) return bPromo - aPromo;

      var aSold = Number(a.soldCount) || 0;
      var bSold = Number(b.soldCount) || 0;
      if (bSold !== aSold) return bSold - aSold;

      return (a.name || '').localeCompare(b.name || '');
    });

    return resolved;
  }

  /**
   * Mengambil semua produk (untuk halaman admin).
   * @returns {Object[]}
   */
  function getAll() {
    try { setup(); } catch (e) { /* ignore */ }
    var list = Database.getAll(TABLE);
    return list.map(_resolveImage);
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   * @param {string} id
   * @returns {Object|null}
   */
  function getById(id) {
    var item = Database.getById(TABLE, id);
    return item ? _resolveImage(item) : null;
  }

  /**
   * Membuat produk baru.
   * @param {{ name: string, description: string, price: number, stock: number, imageUrl: string, category: string, isActive: boolean, isPromo?: boolean, promoPrice?: number, soldCount?: number }} data
   * @returns {Object}
   */
  function create(data) {
    if (!data.name || !data.price) {
      throw new Error('[ProductController] Nama dan harga produk wajib diisi.');
    }
    data.isActive = data.isActive !== undefined ? data.isActive : true;
    data.isPromo = data.isPromo !== undefined ? data.isPromo : false;
    data.promoPrice = Number(data.promoPrice) || 0;
    data.soldCount = Number(data.soldCount) || 0;
    if (!data.imageUrl) {
      data.imageUrl = _findDefaultImage(data.name, data.category);
    }
    return Database.insert(TABLE, data);
  }

  /**
   * Memperbarui produk yang sudah ada.
   * @param {string} id
   * @param {Object} data - Field yang ingin diubah.
   * @returns {Object|null}
   */
  function update(id, data) {
    if (data.promoPrice !== undefined) {
      data.promoPrice = Number(data.promoPrice) || 0;
    }
    var updated = Database.update(TABLE, id, data);
    if (!updated) throw new Error('[ProductController] Produk tidak ditemukan: ' + id);
    return updated;
  }

  /**
   * Menghapus produk (hard delete).
   * @param {string} id
   * @returns {boolean}
   */
  function remove(id) {
    var success = Database.delete(TABLE, id);
    if (!success) throw new Error('[ProductController] Produk tidak ditemukan: ' + id);
    return true;
  }

  /**
   * Mengurangi stok produk setelah order berhasil.
   * @param {string} id
   * @param {number} qty
   * @returns {Object}
   */
  function decrementStock(id, qty) {
    var product = getById(id);
    if (!product) throw new Error('[ProductController] Produk tidak ditemukan: ' + id);

    var newStock = Number(product.stock) - Number(qty);
    if (newStock < 0) throw new Error('[ProductController] Stok tidak mencukupi untuk produk: ' + product.name);

    var newSoldCount = (Number(product.soldCount) || 0) + Number(qty);

    return Database.update(TABLE, id, {
      stock: newStock,
      soldCount: newSoldCount
    });
  }

  return {
    setup: setup,
    getAll: getAll,
    getAllActive: getAllActive,
    getById: getById,
    create: create,
    update: update,
    delete: remove,
    decrementStock: decrementStock
  };

})();
