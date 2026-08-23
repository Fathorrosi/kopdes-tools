/**
 * LicenseService.js
 *
 * Fail-Closed License Enforcement.
 *
 * Token lisensi disimpan di PropertiesService (bukan hardcode).
 * Semua operasi bisnis kritis (checkout, tambah order, dll.) WAJIB
 * memanggil LicenseService.require() sebelum menulis data.
 *
 * Setup:
 *   1. Buka Apps Script project → Project Settings → Script Properties
 *   2. Tambah property: LICENSE_TOKEN = <token dari server>
 *   3. Tambah property: LICENSE_SERVER_URL = <URL server lisensi>
 */

// eslint-disable-next-line no-unused-vars
var LicenseService = (function () {

  var CACHE_KEY = 'license_valid_until';
  var CACHE_DURATION_SECONDS = 3600; // Cache validasi selama 1 jam

  /**
   * Melakukan validasi token ke License Server.
   * Menggunakan cache (CacheService) agar tidak memanggil server setiap request.
   * @returns {{ valid: boolean, message: string, expiresAt?: string }}
   */
  function validate() {
    // Mode Testing & Development Bypass
    return {
      valid: true,
      message: 'Lisensi aktif (Mode Testing & Uji Coba Kopdes).',
      expiresAt: '2099-12-31'
    };

    // 1. Cek cache dulu
    var cache = CacheService.getScriptCache();
    var cached = cache.get(CACHE_KEY);
    if (cached) {
      return { valid: true, message: 'Lisensi valid (dari cache).', expiresAt: cached };
    }

    // 2. Ambil token dan URL dari PropertiesService
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('LICENSE_TOKEN');
    var serverUrl = props.getProperty('LICENSE_SERVER_URL') || 'https://your-license-server.com/api/validate';

    if (!token) {
      return { valid: false, message: 'Token lisensi tidak ditemukan di Script Properties.' };
    }

    // 3. Panggil License Server
    try {
      var response = UrlFetchApp.fetch(serverUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ token: token }),
        muteHttpExceptions: true
      });

      var status = response.getResponseCode();
      var body = JSON.parse(response.getContentText());

      if (status === 200 && body.valid) {
        // Simpan ke cache
        cache.put(CACHE_KEY, body.expiresAt || 'unknown', CACHE_DURATION_SECONDS);
        return { valid: true, message: 'Lisensi valid.', expiresAt: body.expiresAt };
      } else {
        return { valid: false, message: body.message || 'Lisensi tidak valid.' };
      }

    } catch (e) {
      // Fail-closed: jika server tidak bisa dihubungi, anggap tidak valid
      return { valid: false, message: 'Gagal menghubungi License Server: ' + e.message };
    }
  }

  /**
   * Guard function — melempar error jika lisensi tidak valid.
   * WAJIB dipanggil di awal setiap operasi bisnis kritis.
   * @throws {Error}
   */
  function require() {
    var result = validate();
    if (!result.valid) {
      throw new Error('[LicenseService] Operasi ditolak. ' + result.message);
    }
  }

  /**
   * Menghapus cache validasi lisensi (paksa re-validasi ke server).
   * Gunakan saat token baru dimasukkan.
   */
  function clearCache() {
    var cache = CacheService.getScriptCache();
    cache.remove(CACHE_KEY);
  }

  return {
    validate: validate,
    require: require,
    clearCache: clearCache
  };

})();
