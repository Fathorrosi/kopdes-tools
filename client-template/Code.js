/**
 * ============================================================
 * KOPDES GERAI ONLINE — CLIENT SHELL SCRIPT
 * ============================================================
 *
 * Petunjuk Penggunaan untuk Koperasi Desa:
 * 1. Tambahkan Library KopdesEngine di Apps Script:
 *    - Buka menu Libraries (+) di bilah kiri Apps Script
 *    - Masukkan Script ID: 1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y
 *    - Identifier: KopdesEngine (pilih versi terbaru)
 * 2. Masukkan LICENSE_KEY Anda di Project Settings -> Script Properties
 * 3. Deploy as Web App (Execute as: Me, Access: Anyone)
 */

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  return KopdesEngine.serve(e, {
    spreadsheetId: SPREADSHEET_ID
  });
}

function include(filename) {
  return KopdesEngine.include(filename);
}

// --- Setup & Seed Database di Spreadsheet Koperasi ---
function setupApp() {
  return KopdesEngine.setupApp({ spreadsheetId: SPREADSHEET_ID });
}

function seedData() {
  return KopdesEngine.seedData({ spreadsheetId: SPREADSHEET_ID });
}

// --- Bridge API untuk Frontend (google.script.run) ---
function getActiveProducts() { return KopdesEngine.getActiveProducts(); }
function getAllProducts(uid) { return KopdesEngine.getAllProducts(uid); }
function getProductCategories() { return KopdesEngine.getProductCategories(); }
function createProduct(data, uid) { return KopdesEngine.createProduct(data, uid); }
function updateProduct(id, data, uid) { return KopdesEngine.updateProduct(id, data, uid); }
function deleteProduct(id, uid) { return KopdesEngine.deleteProduct(id, uid); }
function uploadImage(base64, name, type) { return KopdesEngine.uploadImage(base64, name, type); }
function createOrder(orderData) { return KopdesEngine.createOrder(orderData); }
function getAllOrders(uid) { return KopdesEngine.getAllOrders(uid); }
function getOrderById(id) { return KopdesEngine.getOrderById(id); }
function getCustomerOrders(uid, phone) { return KopdesEngine.getCustomerOrders(uid, phone); }
function updateOrderStatus(id, status, extra, uid) { return KopdesEngine.updateOrderStatus(id, status, extra, uid); }
function updateOrderItems(id, items, total, notes, uid) { return KopdesEngine.updateOrderItems(id, items, total, notes, uid); }
function getCourierOrders(name) { return KopdesEngine.getCourierOrders(name); }
function getCourierBootstrapData(uid, name) { return KopdesEngine.getCourierBootstrapData(uid, name); }
function completeCourierDelivery(payload) { return KopdesEngine.completeCourierDelivery(payload); }
function getVillageProfile() { return KopdesEngine.getVillageProfile(); }
function updateVillageProfile(data, uid) { return KopdesEngine.updateVillageProfile(data, uid); }
function getAuthStatus(uid) { return KopdesEngine.getAuthStatus(uid); }
function loginUser(payload, pin) { return KopdesEngine.loginUser(payload, pin); }
function registerUser(data) { return KopdesEngine.registerUser(data); }
function getAllUsers(uid) { return KopdesEngine.getAllUsers(uid); }
function getCouriers() { return KopdesEngine.getCouriers(); }
function checkLicense() { return KopdesEngine.checkLicense(); }
