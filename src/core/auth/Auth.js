/**
 * Auth.js
 *
 * Sistem Autentikasi & Otorisasi Koperasi Desa (Role-Based Access Control).
 * Mendukung autentikasi via Google Session dan akun Pengguna/Anggota (Sheet-based + PIN).
 *
 * Roles:
 *   - 'admin'    : Super Administrator / Ketua Koperasi (Akses penuh Toko, Admin, dan Pengaturan Sistem)
 *   - 'pengurus' : Pengurus / Pengelola Gerai (Kelola Produk, Pesanan, Profil Desa)
 *   - 'anggota'  : Anggota Koperasi Desa (Belanja, Riwayat Pesanan, Profil Anggota)
 *   - 'guest'    : Pengunjung umum tanpa login
 */

// eslint-disable-next-line no-unused-vars
var Auth = (function () {

  var TABLE = 'users';
  var COLUMNS = ['name', 'email', 'phone', 'role', 'pin', 'address', 'isActive'];

  // Daftar akun default / demo koperasi
  var DEMO_USERS = [
    {
      id: 'usr-admin-1',
      name: 'Ketua Koperasi (Super Admin)',
      email: 'admin@kopdes.id',
      phone: '081100000001',
      username: 'admin',
      role: 'admin',
      pin: '1234',
      address: 'Kantor Pusat Koperasi Desa',
      isActive: true
    },
    {
      id: 'usr-pengurus-1',
      name: 'Budi Santoso (Manajer Gerai)',
      email: 'budi.pengurus@kopdes.id',
      phone: '081100000002',
      username: 'pengurus',
      role: 'pengurus',
      pin: '1234',
      address: 'Dusun Sukamaju RT 01/RW 02',
      isActive: true
    },
    {
      id: 'usr-pengurus-2',
      name: 'Siti Aminah (Bendahara Gerai)',
      email: 'siti.pengurus@kopdes.id',
      phone: '081100000003',
      username: 'siti.pengurus',
      role: 'pengurus',
      pin: '1234',
      address: 'Dusun Karanganyar RT 03/RW 01',
      isActive: true
    },
    {
      id: 'usr-kurir-1',
      name: 'Kurir Budi',
      email: 'kurir1@kopdes.id',
      phone: '081300000001',
      username: 'kurir',
      role: 'kurir',
      pin: '1234',
      address: 'Pos Kurir Gerai Kopdes',
      isActive: true
    },
    {
      id: 'usr-kurir-2',
      name: 'Kurir Ahmad Fauzi',
      email: 'kurir2@kopdes.id',
      phone: '081300000002',
      username: 'kurir2',
      role: 'kurir',
      pin: '1234',
      address: 'Pos Kurir Gerai Kopdes',
      isActive: true
    },
    {
      id: 'usr-anggota-1',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@kopdes.id',
      phone: '081200000001',
      username: 'ahmad.fauzi',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 01 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-2',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@kopdes.id',
      phone: '081200000002',
      username: 'dewi.lestari',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 02 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-3',
      name: 'Bambang Prakoso',
      email: 'bambang.p@kopdes.id',
      phone: '081200000003',
      username: 'bambang.p',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karanganyar RT 03 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-4',
      name: 'Sri Wahyuni',
      email: 'sri.wahyuni@kopdes.id',
      phone: '081200000004',
      username: 'sri.wahyuni',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 01 / RW 03, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-5',
      name: 'Eko Prasetyo',
      email: 'eko.prasetyo@kopdes.id',
      phone: '081200000005',
      username: 'eko.prasetyo',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 04 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-6',
      name: 'Nur Hidayah',
      email: 'nur.hidayah@kopdes.id',
      phone: '081200000006',
      username: 'nur.hidayah',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karangsari RT 02 / RW 03, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-7',
      name: 'Hendra Gunawan',
      email: 'hendra.g@kopdes.id',
      phone: '081200000007',
      username: 'hendra.g',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Mekarsari RT 03 / RW 01, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-8',
      name: 'Rina Marlina',
      email: 'rina.marlina@kopdes.id',
      phone: '081200000008',
      username: 'rina.marlina',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karanganyar RT 01 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-9',
      name: 'Agus Supriyadi',
      email: 'agus.s@kopdes.id',
      phone: '081200000009',
      username: 'agus.s',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Sukamaju RT 05 / RW 02, Desa Makmur',
      isActive: true
    },
    {
      id: 'usr-anggota-10',
      name: 'Wulandari',
      email: 'wulandari@kopdes.id',
      phone: '081200000010',
      username: 'wulandari',
      role: 'anggota',
      pin: '1234',
      address: 'Dusun Karangsari RT 02 / RW 02, Desa Makmur',
      isActive: true
    }
  ];

  /**
   * Inisialisasi tabel users jika belum ada dan seed akun jika kosong.
   */
  function setup() {
    try {
      Database.ensureTable(TABLE, COLUMNS);
      var all = Database.getAll(TABLE);
      if (!all || all.length === 0) {
        DEMO_USERS.forEach(function(u) {
          try {
            Database.insert(TABLE, u);
          } catch(e) { /* ignore */ }
        });
      }
    } catch(err) {
      Logger.log('[Auth.setup] ' + err.message);
    }
  }

  /**
   * Helper normalisasi nomor HP (menghilangkan spasi, strip, +62 -> 08, 8xxx -> 08xxx)
   */
  function _normalizePhone(p) {
    if (!p) return '';
    var s = String(p).replace(/\D/g, '');
    if (s.indexOf('62') === 0 && s.length > 9) s = '0' + s.substr(2);
    else if (s.indexOf('8') === 0 && s.length >= 9) s = '0' + s;
    return s;
  }

  /**
   * Mengambil informasi user aktif dari Google Session.
   * @returns {{ email: string, name: string, role: string, isAdmin: boolean, isStaff: boolean }}
   */
  function getSessionUser() {
    try {
      var user = Session.getActiveUser();
      var email = user.getEmail();
      if (!email || email === '') {
        return {
          email: '',
          name: 'Tamu',
          role: 'guest',
          isAdmin: false,
          isStaff: false
        };
      }

      var isAdminUser = _checkIfAdminEmail(email);
      var role = isAdminUser ? 'admin' : 'anggota';
      return {
        email: email,
        name: email.split('@')[0],
        role: role,
        isAdmin: isAdminUser,
        isStaff: isAdminUser
      };
    } catch (e) {
      return {
        email: '',
        name: 'Tamu',
        role: 'guest',
        isAdmin: false,
        isStaff: false
      };
    }
  }

  /**
   * Login fleksibel mendukung Object `{ credential, pin }` maupun 2 argumen `(credential, pin)`.
   * @param {Object|string} dataOrCred
   * @param {string} [maybePin]
   * @returns {{ success: boolean, message: string, user: Object }}
   */
  function login(dataOrCred, maybePin) {
    setup();

    var cred = '';
    var pin = '';

    if (typeof dataOrCred === 'object' && dataOrCred !== null) {
      cred = String(dataOrCred.credential || dataOrCred.email || dataOrCred.phone || dataOrCred.username || '').trim();
      pin = String(dataOrCred.pin || '').trim();
    } else {
      cred = String(dataOrCred || '').trim();
      pin = String(maybePin || '').trim();
    }

    if (!cred || !pin) {
      throw new Error('Email / Nomor HP / Username dan PIN wajib diisi.');
    }

    var credLower = cred.toLowerCase();
    var credPhone = _normalizePhone(cred);

    // 1. Cek kecocokan di database Google Sheets
    var allDbUsers = [];
    try {
      allDbUsers = Database.getAll(TABLE);
    } catch(e) {
      allDbUsers = [];
    }

    var foundUser = null;

    for (var i = 0; i < allDbUsers.length; i++) {
      var u = allDbUsers[i];
      var uEmail = (u.email || '').trim().toLowerCase();
      var uPhone = _normalizePhone(u.phone);
      var uName = (u.name || '').trim().toLowerCase();

      var matchEmail = uEmail !== '' && uEmail === credLower;
      var matchPhone = uPhone !== '' && uPhone === credPhone;
      var matchName = uName !== '' && (uName === credLower || uName.indexOf(credLower) === 0);
      var matchAdminAlias = (credLower === 'admin' && u.role === 'admin') || (credLower === 'pengurus' && u.role === 'pengurus') || (credLower === 'kurir' && u.role === 'kurir');

      if (matchEmail || matchPhone || matchName || matchAdminAlias) {
        foundUser = u;
        break;
      }
    }

    // 2. Jika tidak ditemukan di sheet, cek fallback daftar DEMO_USERS
    if (!foundUser) {
      for (var j = 0; j < DEMO_USERS.length; j++) {
        var du = DEMO_USERS[j];
        var duEmail = du.email.toLowerCase();
        var duPhone = _normalizePhone(du.phone);
        var duUser = (du.username || '').toLowerCase();

        if (duEmail === credLower || duPhone === credPhone || duUser === credLower || (credLower === 'admin' && du.role === 'admin') || (credLower === 'pengurus' && du.role === 'pengurus') || (credLower === 'kurir' && du.role === 'kurir')) {
          foundUser = du;
          break;
        }
      }
    }

    if (!foundUser) {
      throw new Error('Akun dengan kredensial "' + cred + '" tidak ditemukan. Silakan gunakan akun demo atau daftar baru.');
    }

    // Validasi PIN
    var userPin = String(foundUser.pin || '1234').trim();
    if (userPin !== pin) {
      throw new Error('PIN keamanan salah! Silakan coba lagi (PIN akun demo: 1234).');
    }

    if (foundUser.isActive !== undefined && String(foundUser.isActive).toLowerCase() === 'false') {
      throw new Error('Akun Anda sedang dinonaktifkan oleh administrator.');
    }

    var role = foundUser.role || 'anggota';
    var isStaff = role === 'admin' || role === 'pengurus';
    var isCourier = role === 'kurir';

    var roleLabels = {
      admin: 'Super Admin',
      pengurus: 'Pengurus Koperasi',
      kurir: 'Kurir Pengantar',
      anggota: 'Anggota Koperasi'
    };

    var redirectPage = 'index';
    if (role === 'kurir') redirectPage = 'courier';
    else if (role === 'admin' || role === 'pengurus') redirectPage = 'admin';

    return {
      success: true,
      message: 'Login berhasil sebagai ' + (roleLabels[role] || 'Anggota') + '!',
      redirect: redirectPage,
      user: {
        id: String(foundUser.id),
        name: foundUser.name,
        email: foundUser.email || '',
        phone: foundUser.phone || '',
        role: role,
        isAdmin: role === 'admin',
        isStaff: isStaff,
        isCourier: isCourier,
        address: foundUser.address || ''
      }
    };
  }

  /**
   * Mendaftarkan akun Anggota Koperasi baru.
   * @param {{ name: string, phone: string, email?: string, address?: string, pin: string }} data
   * @returns {{ success: boolean, message: string, user: Object }}
   */
  function register(data) {
    setup();

    if (!data.name || !data.phone || !data.pin) {
      throw new Error('Nama, Nomor HP, dan PIN wajib diisi.');
    }

    var phone = _normalizePhone(data.phone);
    var email = data.email ? String(data.email).trim().toLowerCase() : '';

    // Cek apakah nomor HP / Email sudah terdaftar
    var exists = Database.query(TABLE, function (row) {
      var rPhone = _normalizePhone(row.phone);
      var rEmail = (row.email || '').trim().toLowerCase();
      return (phone !== '' && rPhone === phone) || (email !== '' && rEmail === email);
    });

    if (exists && exists.length > 0) {
      throw new Error('Nomor HP atau Email sudah terdaftar sebagai anggota. Silakan langsung Masuk.');
    }

    var newUser = {
      name: String(data.name).trim(),
      phone: phone,
      email: email,
      role: 'anggota',
      pin: String(data.pin).trim(),
      address: data.address ? String(data.address).trim() : '',
      isActive: true
    };

    var created = Database.insert(TABLE, newUser);

    return {
      success: true,
      message: 'Pendaftaran Anggota berhasil! Selamat datang, ' + created.name,
      user: {
        id: String(created.id),
        name: created.name,
        email: created.email,
        phone: created.phone,
        role: 'anggota',
        isAdmin: false,
        isStaff: false,
        address: created.address || ''
      }
    };
  }

  /**
   * Cek status auth berdasarkan userId atau fallback Google Session.
   * @param {string} [userId]
   * @returns {Object}
   */
  function getAuthStatus(userId) {
    setup();

    if (userId) {
      // 1. Cek di Database
      var user = Database.getById(TABLE, userId);
      if (user) {
        var role = user.role || 'anggota';
        return {
          isLoggedIn: true,
          user: {
            id: String(user.id),
            name: user.name,
            email: user.email || '',
            phone: user.phone || '',
            role: role,
            isAdmin: role === 'admin',
            isStaff: role === 'admin' || role === 'pengurus',
            address: user.address || ''
          }
        };
      }

      // 2. Cek di DEMO_USERS
      for (var i = 0; i < DEMO_USERS.length; i++) {
        if (DEMO_USERS[i].id === userId) {
          var du = DEMO_USERS[i];
          return {
            isLoggedIn: true,
            user: {
              id: du.id,
              name: du.name,
              email: du.email,
              phone: du.phone,
              role: du.role,
              isAdmin: du.role === 'admin',
              isStaff: du.role === 'admin' || du.role === 'pengurus',
              address: du.address
            }
          };
        }
      }
    }

    // Jika userId kosong atau tidak ditemukan, kembalikan status Guest (Tamu / Belum Login)
    return {
      isLoggedIn: false,
      user: null
    };
  }

  /**
   * Helper internal untuk cek email admin/pengurus.
   * @param {string} email
   * @returns {boolean}
   */
  function _checkIfAdminEmail(email) {
    if (!email) return false;
    var target = email.toLowerCase().trim();

    try {
      var owner = Session.getEffectiveUser().getEmail().toLowerCase().trim();
      if (owner && owner === target) return true;
    } catch (e) { /* ignore */ }

    var adminEmails = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '';
    if (adminEmails) {
      var adminList = adminEmails.split(',').map(function (e) { return e.trim().toLowerCase(); });
      if (adminList.indexOf(target) !== -1) return true;
    }

    try {
      var matched = Database.query(TABLE, function (row) {
        var isMatch = (row.email || '').toLowerCase().trim() === target;
        var r = String(row.role).toLowerCase();
        return isMatch && (r === 'admin' || r === 'pengurus');
      });
      if (matched && matched.length > 0) return true;
    } catch (e) { /* ignore */ }

    return false;
  }

  /**
   * Guard function — melempar error jika user bukan admin atau pengurus.
   * @param {string} [userId]
   * @throws {Error}
   */
  function requireAdmin(userId) {
    if (userId) {
      var u = Database.getById(TABLE, userId);
      if (u) {
        var r = String(u.role).toLowerCase();
        if (r === 'admin' || r === 'pengurus') return;
      }
      for (var i = 0; i < DEMO_USERS.length; i++) {
        if (DEMO_USERS[i].id === userId && (DEMO_USERS[i].role === 'admin' || DEMO_USERS[i].role === 'pengurus')) {
          return;
        }
      }
    }

    var gUser = getSessionUser();
    if (gUser.isStaff) return;

    throw new Error('[Auth] Akses ditolak: Halaman dan tindakan ini hanya untuk Admin atau Pengurus Koperasi.');
  }

  /**
   * Mengambil semua akun pengguna
   * @returns {Object[]}
   */
  function getAllUsers() {
    setup();
    return Database.getAll(TABLE);
  }

  /**
   * Mengambil daftar kurir aktif koperasi untuk dropdown penugasan (Deduplikasi unik)
   * @returns {Object[]}
   */
  function getCouriers() {
    setup();
    var allDbUsers = Database.getAll(TABLE);
    var couriers = allDbUsers.filter(function(u) {
      return u.role === 'kurir' && (u.isActive === undefined || String(u.isActive).toLowerCase() !== 'false');
    });

    if (!couriers || couriers.length === 0) {
      couriers = DEMO_USERS.filter(function(u) { return u.role === 'kurir'; });
    }

    var seen = {};
    var uniqueCouriers = [];
    couriers.forEach(function(u) {
      var key = (_normalizePhone(u.phone) || u.name || '').trim().toLowerCase();
      if (!seen[key]) {
        seen[key] = true;
        uniqueCouriers.push({
          id: String(u.id || ''),
          name: u.name,
          phone: u.phone || '',
          email: u.email || ''
        });
      }
    });

    return uniqueCouriers;
  }

  return {
    setup: setup,
    getSessionUser: getSessionUser,
    login: login,
    register: register,
    getAuthStatus: getAuthStatus,
    requireAdmin: requireAdmin,
    getAllUsers: getAllUsers,
    getCouriers: getCouriers
  };

})();
