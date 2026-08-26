/**
 * OrderController.js
 *
 * Controller untuk manajemen Pesanan di Gerai Online.
 * Operasi createOrder WAJIB memanggil LicenseService.require() sebelum menulis data.
 *
 * Skema tabel 'orders':
 *   id, customerName, customerPhone, customerAddress, items (JSON), total, status, notes, createdAt, updatedAt
 *
 * Status pesanan: pending → processing → completed | cancelled
 */

// eslint-disable-next-line no-unused-vars
var OrderController = (function () {

  var TABLE = 'orders';
  var COLUMNS = [
    'userId',
    'customerName',
    'customerPhone',
    'customerAddress',
    'items',
    'total',
    'status',
    'paymentMethod',
    'notes',
    'courierName',
    'deliveryProofUrl',
    'completedAt'
  ];

  var STATUS = {
    PENDING: 'pending',        // Menunggu Validasi Pengurus
    PROCESSING: 'processing',  // Pesanan Diproses & Disiapkan
    DELIVERING: 'delivering',  // Sedang Dikirim oleh Kurir
    COMPLETED: 'completed',    // Selesai & Dibayar
    CANCELLED: 'cancelled'     // Dibatalkan
  };

  /**
   * Inisialisasi tabel orders (panggil sekali saat setup).
   */
  function setup() {
    Database.ensureTable(TABLE, COLUMNS);
  }

  /**
   * Membuat pesanan baru.
   * ⚠️ FAIL-CLOSED: Memanggil LicenseService.require() sebelum menulis ke database.
   *
   * @param {{ userId?: string, customerName: string, customerPhone: string, customerAddress: string, items: Object[], paymentMethod?: string, notes?: string }} data
   * @returns {Object} Order yang berhasil dibuat.
   * @throws {Error} Jika lisensi tidak valid atau data tidak lengkap.
   */
  function createOrder(data) {
    // --- LICENSE ENFORCEMENT (WAJIB, jangan hapus) ---
    LicenseService.require();

    // Validasi input
    if (!data.customerName || !data.customerPhone || !data.customerAddress) {
      throw new Error('[OrderController] Data pelanggan tidak lengkap (nama, telepon, alamat wajib).');
    }
    if (!data.items || data.items.length === 0) {
      throw new Error('[OrderController] Pesanan tidak memiliki item.');
    }

    // Pre-validasi semua stok item terlebih dahulu
    data.items.forEach(function (item) {
      if (!item.productId || !item.qty || !item.price) {
        throw new Error('Format pesanan tidak valid.');
      }
      var p = ProductController.getById(item.productId);
      if (!p) {
        throw new Error('Produk tidak ditemukan.');
      }
      var available = Number(p.stock);
      var requested = Number(item.qty);
      if (available < requested) {
        throw new Error('Stok ' + p.name + ' tidak mencukupi (tersisa ' + available + ' item).');
      }

      var effectivePrice = Number(p.price);
      if ((String(p.isPromo).toLowerCase() === 'true' || p.isPromo === true) && Number(p.promoPrice) > 0) {
        effectivePrice = Number(p.promoPrice);
      }
      item.price = effectivePrice;
      if (p.unit) item.unit = p.unit;
    });

    // Hitung total & kurangi stok
    var total = 0;
    data.items.forEach(function (item) {
      total += Number(item.price) * Number(item.qty);
      ProductController.decrementStock(item.productId, item.qty);
    });

    // Simpan order
    var order = {
      userId: data.userId || '',
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      items: JSON.stringify(data.items), // Simpan sebagai JSON string di Sheet
      total: total,
      status: STATUS.PENDING,
      paymentMethod: data.paymentMethod || 'cash',
      notes: data.notes || '',
      courierName: '',
      deliveryProofUrl: '',
      completedAt: ''
    };

    return Database.insert(TABLE, order);
  }

  /**
   * Mengambil semua pesanan (untuk halaman admin).
   * @returns {Object[]}
   */
  function getAllOrders() {
    var orders = Database.getAll(TABLE);
    // Parse JSON items
    return orders.map(function (order) {
      try { order.items = JSON.parse(order.items); } catch (e) { order.items = []; }
      return order;
    });
  }

  /**
   * Mengambil riwayat pesanan untuk customer tertentu.
   * @param {string} [userId]
   * @param {string} [customerPhone]
   * @returns {Object[]}
   */
  function getCustomerOrders(userId, customerPhone) {
    var orders = getAllOrders();
    var cleanPhone = customerPhone ? String(customerPhone).replace(/\D/g, '') : '';

    return orders.filter(function (o) {
      if (userId && o.userId && o.userId === userId) return true;
      if (cleanPhone && o.customerPhone) {
        var oPhone = String(o.customerPhone).replace(/\D/g, '');
        if (oPhone === cleanPhone || (cleanPhone.length >= 8 && oPhone.indexOf(cleanPhone) !== -1)) return true;
      }
      return false;
    });
  }

  /**
   * Mengambil satu pesanan berdasarkan ID.
   * @param {string} id
   * @returns {Object|null}
   */
  function getOrderById(id) {
    var order = Database.getById(TABLE, id);
    if (!order) return null;
    try { order.items = JSON.parse(order.items); } catch (e) { order.items = []; }
    return order;
  }

  /**
   * Memperbarui status pesanan dan data pelengkap (kurir, bukti foto, penyesuaian).
   * @param {string} id
   * @param {string} newStatus - Salah satu dari: pending, processing, delivering, completed, cancelled
   * @param {Object} [extraData] - Data tambahan seperti { courierName, deliveryProofUrl, completedAt, items, total, notes }
   * @returns {Object}
   */
  function updateOrderStatus(id, newStatus, extraData) {
    var validStatuses = Object.values(STATUS);
    if (validStatuses.indexOf(newStatus) === -1) {
      throw new Error('[OrderController] Status tidak valid: ' + newStatus + '. Pilih dari: ' + validStatuses.join(', '));
    }

    var updates = { status: newStatus };
    if (extraData && typeof extraData === 'object') {
      if (extraData.courierName !== undefined) updates.courierName = extraData.courierName;
      if (extraData.deliveryProofUrl !== undefined) updates.deliveryProofUrl = extraData.deliveryProofUrl;
      if (extraData.completedAt !== undefined) updates.completedAt = extraData.completedAt;
      if (extraData.items !== undefined) updates.items = typeof extraData.items === 'string' ? extraData.items : JSON.stringify(extraData.items);
      if (extraData.total !== undefined) updates.total = Number(extraData.total);
      if (extraData.notes !== undefined) updates.notes = extraData.notes;
    }

    if (newStatus === STATUS.COMPLETED && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    }

    var updated = Database.update(TABLE, id, updates);
    if (!updated) throw new Error('[OrderController] Pesanan tidak ditemukan: ' + id);
    try { updated.items = JSON.parse(updated.items); } catch (e) {}
    return updated;
  }

  /**
   * Memperbarui daftar item pesanan (penyesuaian stok kosong / batal item).
   * @param {string} id
   * @param {Object[]|string} items
   * @param {number} total
   * @param {string} [adjustmentNote]
   * @returns {Object}
   */
  function updateOrderItems(id, items, total, adjustmentNote) {
    var order = Database.getById(TABLE, id);
    if (!order) throw new Error('[OrderController] Pesanan tidak ditemukan: ' + id);

    var updates = {
      items: typeof items === 'string' ? items : JSON.stringify(items),
      total: Number(total)
    };

    if (adjustmentNote) {
      var currentNote = order.notes || '';
      updates.notes = currentNote ? (currentNote + ' | ' + adjustmentNote) : adjustmentNote;
    }

    var updated = Database.update(TABLE, id, updates);
    if (!updated) throw new Error('[OrderController] Gagal menyimpan penyesuaian item.');
    try { updated.items = JSON.parse(updated.items); } catch (e) {}
    return updated;
  }

  return {
    setup: setup,
    createOrder: createOrder,
    getAllOrders: getAllOrders,
    getCustomerOrders: getCustomerOrders,
    getOrderById: getOrderById,
    updateOrderStatus: updateOrderStatus,
    updateOrderItems: updateOrderItems,
    STATUS: STATUS
  };

})();

