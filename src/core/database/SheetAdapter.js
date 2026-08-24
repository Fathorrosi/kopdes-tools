/**
 * SheetAdapter.js
 *
 * SATU-SATUNYA file yang diizinkan memanggil SpreadsheetApp secara langsung.
 * Bertanggung jawab atas semua interaksi low-level dengan Google Sheets.
 *
 * DILARANG memanggil file ini langsung dari controllers atau views.
 * Semua akses data harus melalui Database.js.
 */

// eslint-disable-next-line no-unused-vars
var SheetAdapter = (function () {

  var _customSpreadsheetId = null;

  /**
   * Mengatur ID Spreadsheet tujuan secara dinamis (untuk mode Managed Library).
   * @param {string} id
   */
  function setSpreadsheetId(id) {
    if (id && typeof id === 'string') {
      _customSpreadsheetId = id.trim();
    }
  }

  /**
   * Mengambil ID Spreadsheet aktif saat ini.
   * @returns {string}
   */
  function getSpreadsheetId() {
    try {
      var ss = _getSpreadsheet();
      return ss ? ss.getId() : (_customSpreadsheetId || '');
    } catch(e) {
      return _customSpreadsheetId || '';
    }
  }

  /**
   * Mendapatkan instance Spreadsheet (Active atau by ID).
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  function _getSpreadsheet() {
    if (_customSpreadsheetId) {
      return SpreadsheetApp.openById(_customSpreadsheetId);
    }
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
    var propsId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (propsId) return SpreadsheetApp.openById(propsId);
    throw new Error('[SheetAdapter] Tidak ada Spreadsheet aktif atau SPREADSHEET_ID yang dikonfigurasi.');
  }

  /**
   * Mendapatkan sheet berdasarkan nama.
   * @param {string} sheetName - Nama sheet/tab di Spreadsheet.
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   * @throws {Error} Jika sheet tidak ditemukan.
   */
  function _getSheet(sheetName) {
    var ss = _getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('[SheetAdapter] Sheet tidak ditemukan: "' + sheetName + '"');
    }
    return sheet;
  }

  /**
   * Mengambil semua data dari sebuah sheet dan mengkonversinya ke array of objects.
   * Baris pertama dianggap sebagai header (nama kolom / key object).
   * @param {string} sheetName
   * @returns {Object[]}
   */
  function getAll(sheetName) {
    var sheet = _getSheet(sheetName);
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return []; // Hanya ada header atau kosong

    var headers = data[0];
    var rows = data.slice(1);

    return rows.map(function (row, index) {
      var obj = {};
      headers.forEach(function (header, colIndex) {
        obj[header] = row[colIndex];
      });
      obj.__rowIndex = index + 2; // Simpan nomor baris asli (1-indexed, +1 untuk header)
      return obj;
    });
  }

  /**
   * Mendapatkan header (baris pertama) dari sebuah sheet.
   * @param {string} sheetName
   * @returns {string[]}
   */
  function getHeaders(sheetName) {
    var sheet = _getSheet(sheetName);
    var firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
    return firstRow[0];
  }

  /**
   * Menambahkan satu baris baru ke bagian bawah sheet.
   * @param {string} sheetName
   * @param {Object} rowData - Object dengan key sesuai header sheet.
   * @returns {number} Nomor baris yang baru ditambahkan.
   */
  function insert(sheetName, rowData) {
    var sheet = _getSheet(sheetName);
    var headers = getHeaders(sheetName);
    var newRow = headers.map(function (header) {
      return rowData[header] !== undefined ? rowData[header] : '';
    });
    sheet.appendRow(newRow);
    return sheet.getLastRow();
  }

  /**
   * Memperbarui satu baris berdasarkan nomor baris asli (__rowIndex).
   * @param {string} sheetName
   * @param {number} rowIndex - Nomor baris di sheet (1-indexed).
   * @param {Object} rowData - Data baru (key sesuai header).
   */
  function update(sheetName, rowIndex, rowData) {
    var sheet = _getSheet(sheetName);
    var headers = getHeaders(sheetName);
    var updatedRow = headers.map(function (header) {
      return rowData[header] !== undefined ? rowData[header] : '';
    });
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
  }

  /**
   * Menghapus satu baris berdasarkan nomor baris asli (__rowIndex).
   * @param {string} sheetName
   * @param {number} rowIndex - Nomor baris di sheet (1-indexed).
   */
  function deleteRow(sheetName, rowIndex) {
    var sheet = _getSheet(sheetName);
    sheet.deleteRow(rowIndex);
  }

  /**
   * Memastikan sebuah sheet ada. Jika belum ada, buat baru dengan header yang ditentukan.
   * @param {string} sheetName
   * @param {string[]} headers - Array nama kolom untuk baris pertama.
   */
  function ensureSheet(sheetName, headers) {
    var ss = _getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    } else {
      var existingHeaders = getHeaders(sheetName);
      var missingHeaders = headers.filter(function (h) {
        return existingHeaders.indexOf(h) === -1;
      });
      if (missingHeaders.length > 0) {
        var startCol = existingHeaders.length + 1;
        sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
      }
    }
    return sheet;
  }

  // Public API
  return {
    setSpreadsheetId: setSpreadsheetId,
    getSpreadsheetId: getSpreadsheetId,
    getAll: getAll,
    getHeaders: getHeaders,
    insert: insert,
    update: update,
    deleteRow: deleteRow,
    ensureSheet: ensureSheet
  };

})();
