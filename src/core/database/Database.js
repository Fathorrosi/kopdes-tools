/**
 * Database.js
 *
 * Lapisan abstraksi database utama. SEMUA kode bisnis dan UI HARUS
 * menggunakan file ini untuk mengakses data — tidak boleh langsung ke SheetAdapter.
 *
 * Menyediakan interface seperti ORM sederhana:
 *   Database.getAll(tableName)
 *   Database.getById(tableName, id)
 *   Database.insert(tableName, rowData)
 *   Database.update(tableName, id, rowData)
 *   Database.delete(tableName, id)
 *   Database.query(tableName, filterFn)
 *
 * Kolom "id" dianggap sebagai primary key default di setiap tabel (sheet).
 */

// eslint-disable-next-line no-unused-vars
var Database = (function () {

  var ID_COLUMN = 'id';

  /**
   * Mengambil semua record dari sebuah tabel.
   * @param {string} tableName - Nama sheet yang dijadikan tabel.
   * @returns {Object[]}
   */
  function getAll(tableName) {
    return SheetAdapter.getAll(tableName);
  }

  /**
   * Mengambil satu record berdasarkan ID.
   * @param {string} tableName
   * @param {string|number} id - Nilai kolom 'id' yang dicari.
   * @returns {Object|null}
   */
  function getById(tableName, id) {
    var rows = SheetAdapter.getAll(tableName);
    var found = rows.filter(function (row) {
      return String(row[ID_COLUMN]) === String(id);
    });
    return found.length > 0 ? found[0] : null;
  }

  /**
   * Menyisipkan record baru ke dalam tabel.
   * Jika rowData tidak memiliki 'id', akan digenerate otomatis (UUID sederhana).
   * @param {string} tableName
   * @param {Object} rowData
   * @returns {Object} Record yang baru disimpan (termasuk id).
   */
  function insert(tableName, rowData) {
    if (!rowData[ID_COLUMN]) {
      rowData[ID_COLUMN] = _generateId();
    }
    if (!rowData.createdAt) {
      rowData.createdAt = new Date().toISOString();
    }
    rowData.updatedAt = new Date().toISOString();
    SheetAdapter.insert(tableName, rowData);
    return rowData;
  }

  /**
   * Memperbarui record yang sudah ada berdasarkan ID.
   * @param {string} tableName
   * @param {string|number} id
   * @param {Object} rowData - Field yang ingin diupdate (partial update didukung).
   * @returns {Object|null} Record yang sudah diupdate, atau null jika tidak ditemukan.
   */
  function update(tableName, id, rowData) {
    var existing = getById(tableName, id);
    if (!existing) return null;

    var merged = Object.assign({}, existing, rowData, {
      id: existing[ID_COLUMN],       // Jaga id tidak berubah
      updatedAt: new Date().toISOString()
    });

    SheetAdapter.update(tableName, existing.__rowIndex, merged);
    return merged;
  }

  /**
   * Menghapus record berdasarkan ID.
   * @param {string} tableName
   * @param {string|number} id
   * @returns {boolean} True jika berhasil, false jika tidak ditemukan.
   */
  function remove(tableName, id) {
    var existing = getById(tableName, id);
    if (!existing) return false;
    SheetAdapter.deleteRow(tableName, existing.__rowIndex);
    return true;
  }

  /**
   * Mencari records berdasarkan fungsi filter kustom.
   * @param {string} tableName
   * @param {function(Object): boolean} filterFn - Fungsi yang menerima row dan mengembalikan boolean.
   * @returns {Object[]}
   */
  function query(tableName, filterFn) {
    var rows = SheetAdapter.getAll(tableName);
    return rows.filter(filterFn);
  }

  /**
   * Memastikan tabel (sheet) ada dengan kolom yang diperlukan.
   * Berguna saat setup awal atau migrasi.
   * @param {string} tableName
   * @param {string[]} columns - Nama kolom. Kolom 'id', 'createdAt', 'updatedAt' ditambah otomatis.
   */
  function ensureTable(tableName, columns) {
    var defaultCols = [ID_COLUMN, 'createdAt', 'updatedAt'];
    var allCols = defaultCols.concat(
      columns.filter(function (c) { return defaultCols.indexOf(c) === -1; })
    );
    SheetAdapter.ensureSheet(tableName, allCols);
  }

  // --- Private Helpers ---

  /**
   * Generate ID unik sederhana berdasarkan timestamp + random string.
   * @returns {string}
   */
  function _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Mengatur ID Spreadsheet tujuan secara dinamis (Managed Library Mode).
   * @param {string} id
   */
  function setSpreadsheetId(id) {
    SheetAdapter.setSpreadsheetId(id);
  }

  /**
   * Mengambil ID Spreadsheet aktif.
   * @returns {string}
   */
  function getSpreadsheetId() {
    return SheetAdapter.getSpreadsheetId();
  }

  // Public API
  return {
    setSpreadsheetId: setSpreadsheetId,
    getSpreadsheetId: getSpreadsheetId,
    getAll: getAll,
    getById: getById,
    insert: insert,
    update: update,
    delete: remove,
    query: query,
    ensureTable: ensureTable
  };

})();
