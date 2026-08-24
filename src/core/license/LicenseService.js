/**
 * LicenseService.js
 *
 * Master License Enforcement System untuk Kopdes Tools (Micro-SaaS).
 *
 * Fitur:
 *   1. Master License Spreadsheet (di Google Drive Vendor/Developer).
 *   2. Auto-Verification berdasarkan Spreadsheet ID Klien.
 *   3. Kontrol Status: ACTIVE (Aktif), SUSPENDED (Ditangguhkan/Nonaktif), EXPIRED (Kedaluwarsa).
 *   4. Cache validasi 30 menit (Zero Latency untuk transaksi harian).
 *   5. Lock Screen otomatis jika lisensi tidak valid.
 */

// eslint-disable-next-line no-unused-vars
var LicenseService = (function () {

  var CACHE_KEY_PREFIX = 'kopdes_lic_';
  var CACHE_DURATION_SECONDS = 300; // Cache 5 menit
  var PROP_MASTER_SHEET_ID = 'MASTER_LICENSE_SHEET_ID';
  var DEFAULT_MASTER_LICENSE_SHEET_ID = '10EiC_jCjDb451JkkSctbtJsflcRsD4MwfzYXvQNx0a0';

  /**
   * Membuat file Google Spreadsheet Master Lisensi baru di Google Drive Vendor.
   * Panggil fungsi ini sekali dari GAS Editor (createMasterLicenseSheet).
   * @returns {{ spreadsheetId: string, url: string }}
   */
  function createMasterLicenseSheet() {
    var fileName = 'Master Lisensi Kopdes Tools';
    var ss = SpreadsheetApp.create(fileName);
    var sheet = ss.getActiveSheet();
    sheet.setName('licenses');

    var headers = [
      'spreadsheetId',
      'clientName',
      'status',
      'expiresAt',
      'contactPhone',
      'registeredAt',
      'notes'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);

    // Format Header: Background Hijau Tua, Teks Putih Tebal
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#166534');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');

    var nowStr = new Date().toISOString().slice(0, 10);
    var futureStr = '2027-12-31';

    // Seed Data Klien Awal (Master Demo & Klien)
    var initialRows = [
      [
        '1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y',
        'Kopdes Samatan (Master Demo)',
        'ACTIVE',
        futureStr,
        '081100000001',
        nowStr,
        'Akun Master Demo Default'
      ]
    ];

    // Jika ada spreadsheet ID aktif saat ini, tambahkan juga
    try {
      var currentId = Database.getSpreadsheetId();
      if (currentId && currentId !== '1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y') {
        initialRows.push([
          currentId,
          'Kopdes Klien Baru',
          'ACTIVE',
          futureStr,
          '081234567890',
          nowStr,
          'Klien Pertama'
        ]);
      }
    } catch(e) {}

    sheet.getRange(2, 1, initialRows.length, headers.length).setValues(initialRows);

    // Atur lebar kolom agar mudah dibaca
    sheet.setColumnWidth(1, 320); // spreadsheetId
    sheet.setColumnWidth(2, 220); // clientName
    sheet.setColumnWidth(3, 120); // status
    sheet.setColumnWidth(4, 130); // expiresAt
    sheet.setColumnWidth(5, 150); // contactPhone
    sheet.setColumnWidth(6, 130); // registeredAt
    sheet.setColumnWidth(7, 250); // notes

    var newId = ss.getId();
    var newUrl = ss.getUrl();

    // Simpan ID ke Script Properties Master
    PropertiesService.getScriptProperties().setProperty(PROP_MASTER_SHEET_ID, newId);

    Logger.log('====================================================');
    Logger.log('✅ MASTER SPREADSHEET LISENSI BERHASIL DIBUAT!');
    Logger.log('📄 Nama File: ' + fileName);
    Logger.log('🆔 Spreadsheet ID: ' + newId);
    Logger.log('🔗 Link Google Sheet: ' + newUrl);
    Logger.log('====================================================');

    return {
      spreadsheetId: newId,
      url: newUrl
    };
  }

  /**
   * Mengambil ID Master Spreadsheet Lisensi dari Script Properties atau Default ID.
   * @returns {string}
   */
  function getMasterLicenseSheetId() {
    var id = PropertiesService.getScriptProperties().getProperty(PROP_MASTER_SHEET_ID);
    return (id && id.trim() !== '') ? id.trim() : DEFAULT_MASTER_LICENSE_SHEET_ID;
  }

  /**
   * Mengatur ID Master Spreadsheet Lisensi secara manual jika sudah ada.
   * @param {string} sheetId
   */
  function setMasterLicenseSheetId(sheetId) {
    if (sheetId && typeof sheetId === 'string') {
      PropertiesService.getScriptProperties().setProperty(PROP_MASTER_SHEET_ID, sheetId.trim());
      clearCache();
    }
  }

  /**
   * Melakukan validasi status lisensi untuk sebuah Spreadsheet Klien.
   * @param {string} [customSpreadsheetId]
   * @returns {{ valid: boolean, status: string, clientName?: string, expiresAt?: string, message: string }}
   */
  function validate(customSpreadsheetId) {
    var masterSheetId = getMasterLicenseSheetId();

    // Jika Master Sheet belum dibuat, bypass aktif (mode dev)
    if (!masterSheetId) {
      return {
        valid: true,
        status: 'ACTIVE',
        clientName: 'Mode Development / Testing',
        expiresAt: '2099-12-31',
        message: 'Lisensi aktif (Mode Development).'
      };
    }

    var targetId = '';
    try {
      if (customSpreadsheetId && typeof customSpreadsheetId === 'string' && customSpreadsheetId.trim() !== '') {
        targetId = customSpreadsheetId.trim();
      } else if (Database.getSpreadsheetId()) {
        targetId = Database.getSpreadsheetId();
      } else {
        var activeSs = SpreadsheetApp.getActiveSpreadsheet();
        if (activeSs) targetId = activeSs.getId();
      }
    } catch(e) {
      targetId = customSpreadsheetId || '';
    }

    if (!targetId) {
      return {
        valid: true,
        status: 'ACTIVE',
        clientName: 'Mode Standalone',
        message: 'Lisensi standalone aktif.'
      };
    }

    // 1. Cek Cache
    var cacheKey = CACHE_KEY_PREFIX + targetId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    var cache = CacheService.getScriptCache();
    var cached = cache.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch(e) {}
    }

    // 2. Baca Data dari Master Spreadsheet Lisensi
    try {
      var masterSs = SpreadsheetApp.openById(masterSheetId);
      var sheet = masterSs.getSheetByName('licenses') || masterSs.getSheets()[0];
      var data = sheet.getDataRange().getValues();

      if (data.length < 2) {
        var emptyRes = {
          valid: false,
          status: 'EMPTY',
          message: 'Tabel master lisensi belum memiliki data terdaftar.'
        };
        return emptyRes;
      }

      var headers = data[0];
      var idIdx = headers.indexOf('spreadsheetId');
      var nameIdx = headers.indexOf('clientName');
      var statusIdx = headers.indexOf('status');
      var expIdx = headers.indexOf('expiresAt');

      if (idIdx === -1) idIdx = 0;
      if (nameIdx === -1) nameIdx = 1;
      if (statusIdx === -1) statusIdx = 2;
      if (expIdx === -1) expIdx = 3;

      var foundRow = null;
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (String(row[idIdx]).trim() === targetId) {
          foundRow = row;
          break;
        }
      }

      // Klien Tidak Ditemukan dalam Master Sheet (Belum Terdaftar)
      if (!foundRow) {
        var unregRes = {
          valid: false,
          status: 'UNREGISTERED',
          clientName: 'Koperasi Desa',
          message: 'Aplikasi Google Spreadsheet ini belum terdaftar dalam lisensi resmi Kopdes Tools. Silakan hubungi penyedia layanan.'
        };
        cache.put(cacheKey, JSON.stringify(unregRes), 20);
        return unregRes;
      }

      var clientName = String(foundRow[nameIdx] || 'Koperasi Desa').trim();
      var rawStatus = String(foundRow[statusIdx] || 'ACTIVE').toUpperCase().trim();
      var rawExp = foundRow[expIdx];

      // Klien Dinonaktifkan Manual oleh Vendor (Hanya status ACTIVE yang diizinkan)
      if (rawStatus !== 'ACTIVE') {
        var statusType = (rawStatus === 'EXPIRED') ? 'EXPIRED' : 'SUSPENDED';
        var suspendedRes = {
          valid: false,
          status: statusType,
          clientName: clientName,
          message: 'Layanan Kopdes Tools untuk ' + clientName + ' sedang ditangguhkan/dinonaktifkan oleh administrator. Silakan hubungi penyedia layanan untuk informasi lebih lanjut.'
        };
        cache.put(cacheKey, JSON.stringify(suspendedRes), 20);
        return suspendedRes;
      }

      // Cek Tanggal Jatuh Tempo (Expiry Check)
      if (rawExp) {
        var expDate = (rawExp instanceof Date) ? rawExp : new Date(rawExp);
        if (!isNaN(expDate.getTime())) {
          var now = new Date();
          // Reset jam ke 23:59:59 pada hari jatuh tempo
          expDate.setHours(23, 59, 59, 999);

          if (now > expDate) {
            var expStr = expDate.toISOString().slice(0, 10);
            var expiredRes = {
              valid: false,
              status: 'EXPIRED',
              clientName: clientName,
              expiresAt: expStr,
              message: 'Masa lisensi Kopdes Tools untuk ' + clientName + ' telah berakhir pada ' + expStr + '. Silakan lakukan perpanjangan langganan untuk mengaktifkan kembali.'
            };
            cache.put(cacheKey, JSON.stringify(expiredRes), 20);
            return expiredRes;
          }
        }
      }

      // Lisensi Valid & Aktif
      var expFormatted = (rawExp instanceof Date && !isNaN(rawExp.getTime())) ? rawExp.toISOString().slice(0, 10) : (String(rawExp || 'UNLIMITED'));
      var activeRes = {
        valid: true,
        status: 'ACTIVE',
        clientName: clientName,
        expiresAt: expFormatted,
        message: 'Lisensi resmi Kopdes Tools aktif.'
      };

      cache.put(cacheKey, JSON.stringify(activeRes), CACHE_DURATION_SECONDS);
      return activeRes;

    } catch (err) {
      Logger.log('[LicenseService.validate] Error: ' + err.message);
      // Fail closed jika terjadi error pembacaan
      return {
        valid: false,
        status: 'ERROR',
        message: 'Gagal memverifikasi status lisensi ke server: ' + err.message
      };
    }
  }

  /**
   * Guard function — melempar error jika lisensi tidak valid (untuk memblokir API transaksi).
   * @param {string} [customSpreadsheetId]
   * @throws {Error}
   */
  function require(customSpreadsheetId) {
    var res = validate(customSpreadsheetId);
    if (!res.valid) {
      throw new Error('[LicenseService] ' + res.message);
    }
  }

  /**
   * Menghapus cache validasi lisensi di seluruh sistem.
   */
  function clearCache() {
    try {
      var cache = CacheService.getScriptCache();
      cache.removeAll([CACHE_KEY_PREFIX]);
    } catch(e) {}
  }

  /**
   * Menghasilkan HTML Lock Screen jika aplikasi klien dinonaktifkan / expired.
   * @param {Object} lic - Hasil dari LicenseService.validate()
   * @returns {GoogleAppsScript.HTML.HtmlOutput}
   */
  function renderLockScreen(lic) {
    var clientName = (lic && lic.clientName) ? lic.clientName : 'Koperasi Desa';
    var status = (lic && lic.status) ? lic.status : 'SUSPENDED';
    var message = (lic && lic.message) ? lic.message : 'Layanan sedang dinonaktifkan.';
    
    var title = 'Layanan Dinonaktifkan';
    var badgeColor = '#DC2626';
    var badgeText = 'LAYANAN DITANGGUHKAN';
    var iconClass = 'fa-lock';

    if (status === 'EXPIRED') {
      title = 'Masa Langganan Berakhir';
      badgeColor = '#D97706';
      badgeText = 'LISENSI KEDALUWARSA';
      iconClass = 'fa-calendar-times';
    } else if (status === 'UNREGISTERED') {
      title = 'Lisensi Belum Terdaftar';
      badgeColor = '#64748B';
      badgeText = 'BELUM TERDAFTAR';
      iconClass = 'fa-shield-alt';
    }

    var html = '<!DOCTYPE html>' +
      '<html lang="id">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<title>' + title + ' — ' + clientName + '</title>' +
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />' +
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />' +
      '<style>' +
      '  * { box-sizing: border-box; margin: 0; padding: 0; }' +
      '  body { background: #0F172A; color: #F8FAFC; font-family: "Inter", sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }' +
      '  .lock-card { background: #1E293B; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px 28px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }' +
      '  .icon-box { width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(220,38,38,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: ' + badgeColor + '; }' +
      '  .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; background: ' + badgeColor + '; color: #fff; margin-bottom: 16px; }' +
      '  h1 { font-size: 22px; font-weight: 800; margin-bottom: 8px; color: #fff; }' +
      '  .client-tag { font-size: 14px; color: #94A3B8; margin-bottom: 18px; font-weight: 600; }' +
      '  p { font-size: 13.5px; color: #CBD5E1; line-height: 1.6; margin-bottom: 28px; background: rgba(0,0,0,0.2); padding: 14px; border-radius: 12px; border-left: 3px solid ' + badgeColor + '; text-align: left; }' +
      '  .btn-contact { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 20px; background: #16A34A; color: #fff; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 14.5px; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(22,163,74,0.4); }' +
      '  .btn-contact:hover { background: #15803D; transform: translateY(-2px); }' +
      '  .footer { margin-top: 24px; font-size: 11px; color: #64748B; }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div class="lock-card">' +
      '  <div class="icon-box"><i class="fas ' + iconClass + '"></i></div>' +
      '  <div class="badge">' + badgeText + '</div>' +
      '  <h1>' + title + '</h1>' +
      '  <div class="client-tag"><i class="fas fa-building"></i> ' + clientName + '</div>' +
      '  <p>' + message + '</p>' +
      '  <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Kopdes%20Tools,%20saya%20ingin%20mengaktifkan%20kembali%20layanan%20untuk%20' + encodeURIComponent(clientName) + '" target="_blank" class="btn-contact">' +
      '    <i class="fab fa-whatsapp" style="font-size:18px;"></i> Hubungi Penyedia Layanan' +
      '  </a>' +
      '  <div class="footer">Kopdes Tools Micro-SaaS Ecosystem &bull; Security & License Guard</div>' +
      '</div>' +
      '</body>' +
      '</html>';

    return HtmlService.createHtmlOutput(html)
      .setTitle(title + ' — ' + clientName)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return {
    createMasterLicenseSheet: createMasterLicenseSheet,
    getMasterLicenseSheetId: getMasterLicenseSheetId,
    setMasterLicenseSheetId: setMasterLicenseSheetId,
    validate: validate,
    require: require,
    clearCache: clearCache,
    renderLockScreen: renderLockScreen
  };

})();
