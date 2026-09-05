import { FFAccount, StoreConfig } from '../types';

export const initialConfig: StoreConfig = {
  storeName: 'PIONZ STORE',
  tagline: 'Tempat Jual Beli Akun',
  logoUrl: 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg',
  wa1: '085181814366',
  wa2: '087714814910',
  waChannel: 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z',
  instagram: 'pionzstore',
  announcement: '🛡️ PIONZ STORE: PROSES KILAT TRANSAKSI AMAN | BERGARANSI RESMI ANTI HACKBACK | ADMIN FAST RESPON VIA WA: 085181814366 & 087714814910 | DATA AMAN 100% FULL AKSES',
};

export const initialAccounts: FFAccount[] = [
  {
    id: 'acc-1',
    code: 'PZ-01',
    title: 'SULTAN OLD S2 HIP HOP + 9 EVO GUN LV 7 MAX',
    price: 1850000,
    originalPrice: 2200000,
    category: 'sultan',
    level: 78,
    rank: 'Grandmaster ⭐ 18',
    evoGuns: [
      'AK47 Blue Flame Draco (Lv 7 MAX)',
      'MP40 Predatory Cobra (Lv 7 MAX)',
      'M1014 Green Flame Draco (Lv 7 MAX)',
      'SCAR Megalodon Alpha (Lv 7 MAX)',
      'XM8 Destiny Guardian (Lv 7 MAX)',
      'SG2 Terompet Emerald Power (Lv 7 MAX)',
      'UMP Booyah Day (Lv 7 MAX)',
      'Famas Demonic Grin (Lv 6)',
      'Thompson Cindered Colossus (Lv 5)'
    ],
    vaultCount: 520,
    keyItems: [
      'Set Season 2 Hip Hop Full',
      'Bundle Baju BNL Old',
      'Set Sakura Season 1 Bagian Atas',
      'Bundle Letda Hyper Old',
      'Emote Bunga, Ketawa & Duduk Singgasana',
      'SG2 Rapper Underworld & Incu 3',
      'Baju Alok Pertama + Tas Sayap Hitam'
    ],
    loginType: 'Google',
    bindStatus: 'Data Polos / Monsep',
    status: 'ready',
    featured: true,
    hotDeal: true,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Akun rawatan pribadi dari Season 2. Koleksi sangat langka, vault tebal 520+, 7 Evo Gun Max Lv 7 dengan emote eksklusif. Data polos monsep Google fresh unbind semua sosmed. Dijamin 100% aman bergaransi uang kembali jika ada kendala.',
    createdAt: '2026-09-01',
  },
  {
    id: 'acc-2',
    code: 'PZ-02',
    title: 'AKUN OLD S1 SAKURA ERA + SG2 OPM & RAPPER',
    price: 1350000,
    originalPrice: 1600000,
    category: 'old_era',
    level: 74,
    rank: 'Master ⭐ 32',
    evoGuns: [
      'AK47 Dragon (Lv 7 MAX)',
      'MP40 Cobra (Lv 7 MAX)',
      'M1014 Draco (Lv 5)',
      'SG2 Gurun (Lv 4)'
    ],
    vaultCount: 440,
    keyItems: [
      'Topeng Sakura Season 1 Lengkap',
      'Bundle Bandit Old Incu',
      'SG2 M1887 One Punch Man (OPM)',
      'SG2 Rapper Underworld',
      'Emote Push Up & I Heart You',
      'Baju Heroic Season 3 & 4'
    ],
    loginType: 'Facebook',
    bindStatus: 'Data Polos / Monsep',
    status: 'ready',
    featured: true,
    hotDeal: false,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Akun idaman pemain FF Old! Topeng Sakura Season 1 asli, ada SG OPM incaran semua player. Akun FB bersih siap kaitkan nomor HP dan email pembeli langsung. Garansi anti hackback seumur hidup.',
    createdAt: '2026-09-02',
  },
  {
    id: 'acc-3',
    code: 'PZ-03',
    title: 'SPESIALIS EVO GUN: 6 EVO MAX + EMOTE LOBBY',
    price: 875000,
    originalPrice: 1050000,
    category: 'evo_gun',
    level: 69,
    rank: 'Master ⭐ 12',
    evoGuns: [
      'MP40 Predatory Cobra (Lv 7 MAX)',
      'M1014 Green Flame Draco (Lv 7 MAX)',
      'AK47 Blue Flame (Lv 7 MAX)',
      'SCAR Megalodon (Lv 7 MAX)',
      'UMP Booyah Day (Lv 7 MAX)',
      'Woodpecker Majestic (Lv 7 MAX)',
      'AN94 Evil Howler (Lv 4)'
    ],
    vaultCount: 380,
    keyItems: [
      'Full Efek & Emote Tembak Lobby',
      'Bundle Cobraborasi',
      'Set Zombie Samurai Old',
      'Skin Katana Api & Es',
      'Emote Goyang Jagung & Ketawa'
    ],
    loginType: 'Google',
    bindStatus: 'All Unbind (Aman)',
    status: 'ready',
    featured: true,
    hotDeal: true,
    images: [
      'https://images.unsplash.com/photo-1612287233214-2c676c12513f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Cocok buat yang cari akun tukang pamer dan perang tournament! 6 Evo Gun sudah level 7 Max lengkap dengan kill feed custom dan emote eksklusif. Akun terawat siap pakai tempur rank CS / BR.',
    createdAt: '2026-09-03',
  },
  {
    id: 'acc-4',
    code: 'PZ-04',
    title: 'BUDGET PELAJAR: LEVEL 63 + MP40 COBRA LV 4 + VAULT RAPI',
    price: 185000,
    originalPrice: 230000,
    category: 'pelajar',
    level: 63,
    rank: 'Heroic ⭐ 3',
    evoGuns: [
      'MP40 Predatory Cobra (Lv 4)',
      'AK47 Blue Flame Draco (Lv 3)'
    ],
    vaultCount: 220,
    keyItems: [
      'Set Baju Letda',
      'SG2 Ungu M1887 Rapper',
      'Bundle Cobra Cowok',
      'Emote Provoke & Bunga',
      'Karakter Alok, Chrono, Homer Max'
    ],
    loginType: 'Google',
    bindStatus: 'Data Polos / Monsep',
    status: 'ready',
    featured: false,
    hotDeal: true,
    images: [
      'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Harga terjangkau ramah kantong pelajar! MP40 Cobra udah level 4 keluar efek peluru & reload. Vault rapi 220+, data polos langsung kirim email dan password setelah bayar.',
    createdAt: '2026-09-03',
  },
  {
    id: 'acc-5',
    code: 'PZ-05',
    title: 'AKUN MEDIUM SEIMBANG: SG2 OPM + AK DRAGON LV 5 + SET CRISTIANO',
    price: 340000,
    originalPrice: 400000,
    category: 'medium',
    level: 66,
    rank: 'Master ⭐ 8',
    evoGuns: [
      'AK47 Blue Flame (Lv 5)',
      'M1014 Draco (Lv 4)',
      'MP40 Cobra (Lv 3)'
    ],
    vaultCount: 290,
    keyItems: [
      'SG2 M1887 One Punch Man (OPM)',
      'Set Kolaborasi CR7 Chrono',
      'Bundle Arctic Blue Old',
      'Emote Ketawa & Hati',
      'Parasut & Surfboard Legend'
    ],
    loginType: 'Facebook',
    bindStatus: 'Data Polos / Monsep',
    status: 'ready',
    featured: false,
    hotDeal: false,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Spek mantap di kelas menengah. Ada SG OPM langka yang sakit banget buat by one CS, akun aman terverifikasi.',
    createdAt: '2026-09-02',
  },
  {
    id: 'acc-6',
    code: 'PZ-06',
    title: 'RAMAH KANTONG: LEVEL 59 + ELITE PASS LENGKAP + KATANA API',
    price: 130000,
    originalPrice: 175000,
    category: 'pelajar',
    level: 59,
    rank: 'Diamond IV',
    evoGuns: [
      'UMP Booyah Day (Lv 3)'
    ],
    vaultCount: 165,
    keyItems: [
      'Katana Api & Katana Cyber',
      'Bundle Kelinci Old',
      'Emote Duduk Kopi & Tepuk Tangan',
      'Gloowall Naga Merah'
    ],
    loginType: 'VK',
    bindStatus: 'All Unbind (Aman)',
    status: 'ready',
    featured: false,
    hotDeal: false,
    images: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Pilihan hemat untuk main bareng squad. Vault bersih, emot komplit, login VK langsung kasih akses.',
    createdAt: '2026-09-01',
  },
  {
    id: 'acc-7',
    code: 'PZ-07',
    title: 'TERJUAL: SULTAN OLD S2 BANDIT + 8 EVO GUN MAX',
    price: 1700000,
    originalPrice: 2000000,
    category: 'sultan',
    level: 76,
    rank: 'Grandmaster',
    evoGuns: [
      'AK47 Dragon (Lv 7)',
      'MP40 Cobra (Lv 7)',
      'SG2 Emerald (Lv 7)',
      'SCAR Megalodon (Lv 7)'
    ],
    vaultCount: 490,
    keyItems: [
      'Bundle Bandit Old Incu',
      'Hip Hop Pants S2',
      'Emote Bunga & Singgasana'
    ],
    loginType: 'Google',
    bindStatus: 'Data Polos / Monsep',
    status: 'sold',
    featured: false,
    hotDeal: false,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Terjual via Admin resmi PIONZ STORE (085181814366). Terima kasih atas kepercayaannya!',
    createdAt: '2026-08-30',
  }
];
