LUCKY FISHING v1.0.0
Final Release | 17 Oktober 2026
========================================

Game memancing santai berbasis HTML, CSS, dan JavaScript.
Bisa dimainkan offline setelah seluruh file tersedia.
Tidak memerlukan akun, database, library, atau proses build.

1. ISI PAKET
------------
index.html  : Halaman dan struktur permainan.
style.css   : Tampilan, responsivitas, dan animasi.
script.js   : Logika permainan dan penyimpanan.
README.txt  : Panduan ini.

Simpan keempat file dalam folder yang sama.

2. CARA MENJALANKAN
------------------
Cara langsung:
- Buka index.html menggunakan browser.
- Pemain baru memilih Mulai Bermain atau New Game.
- Pilih Continue untuk melanjutkan save yang tersedia.

Alternatif menggunakan server lokal, jika Python sudah terpasang:
- Buka terminal di folder game.
- Jalankan: python -m http.server 8000
- Buka: http://localhost:8000
- Hentikan server dengan Ctrl+C.

Pakai alamat dan port yang sama untuk melanjutkan save lokal.
Save dari file langsung, localhost, port berbeda, dan domain
hosting merupakan penyimpanan browser yang berbeda.
Gunakan Export/Import Save untuk memindahkan progres.

3. CARA BERMAIN DAN KONTROL
--------------------------
- Pilih umpan melalui panel memancing atau Equipment.
- Tekan Mulai Casting untuk menggerakkan meter.
- Tekan tombol lempar ketika marker berada di zona yang diinginkan.
- Zona emas memberikan bonus Perfect Cast.
- Tunggu gigitan, lalu tekan tombol kait sebelum waktunya habis.
- Tahan tombol Reel untuk menarik. Lepaskan untuk menurunkan tension.
- Di komputer, Space juga dapat ditahan untuk Reel selama battle.
- Di HP, gunakan tombol sentuh.
- Tension terlalu tinggi dapat memutus tali.
- Setelah menang, pilih Jual, Simpan, atau Aquarium.

Selesaikan sesi memancing sebelum berganti lokasi atau menu.
Saat tab tersembunyi atau jendela kehilangan fokus, permainan
dipause. Kembali ke game untuk melanjutkan.

4. AUTO FISH
------------
- Tekan Auto Fish: OFF untuk mengaktifkan; tekan lagi untuk berhenti.
- Otomatis melakukan casting, mengait, dan mengatur tension.
- Menggunakan aturan, statistik alat, dan stok umpan biasa.
- Ikan disimpan ke Inventory; treasure dan sampah otomatis dijual.
- Potongan peta diproses otomatis.
- Hasil ditampilkan sebentar sebelum siklus berikutnya.
- Berhenti saat inventory penuh atau umpan pilihan habis.
- Jika inventory penuh ketika ada hasil, hasil tetap menunggu pilihan.
- Mendukung Tanpa Umpan.
- Pause mengikuti game; berhenti saat berganti panel atau membuka menu.
- Auto Fish tidak aktif otomatis setelah reload.
- Auto Fish bukan jaminan semua ikan berhasil ditangkap.

5. TANPA UMPAN DAN HARGA BAIT
---------------------------
Pilih Tanpa Umpan pada panel memancing jika ingin memancing gratis.
Bisa dipakai tanpa coins dan tanpa stok bait.

Peluang tiap lemparan Tanpa Umpan:
- 12% mendapat kesempatan mengait ikan.
- 60% mendapat sampah yang dapat dijual.
- 28% tidak mendapat gigitan.

Ikan masih harus dikait dan ditangkap melalui battle.
Sampah berupa Old Boot atau Driftwood dapat langsung dijual,
atau disimpan melalui pilihan Simpan dan dikelola di Treasure.
Tanpa Umpan tidak menghasilkan treasure premium atau potongan peta.

Harga per paket:
- Worm       : 10 coins / 5 umpan.
- Bread      : 20 coins / 5 umpan.
- Shrimp     : 40 coins / 5 umpan.
- Glow Worm  : 70 coins / 2 umpan.

Umpan berbayar memberi peluang ikan lebih baik dan memiliki
bonus spesies masing-masing.

6. FITUR UTAMA
--------------
- 24 spesies dengan ilustrasi SVG dan variasi shiny.
- 7 lokasi: Village Pond, Forest River, Crystal Lake,
  Tropical Beach, Open Ocean, Deep Sea, dan Moonlight Lagoon.
- Peta interaktif dan persyaratan pembukaan lokasi.
- Tempat memancing berbeda untuk setiap lokasi.
- Waktu dunia, cuaca, event, serta animasi lingkungan.
- Upgrade Rod, Reel, Hook, dan Aquarium.
- Fishdex dengan rarity, filter lokasi, dan rekor tangkapan.
- Inventory ikan maksimal 40.
- Aquarium berkapasitas 6 hingga 18 ikan sesuai level.
- Favorit di Aquarium melindungi ikan dari penjualan.
- Treasure Inventory maksimal 30 barang.
- Potongan peta, 4 boss, dan pencapaian.
- Sound Effects, Volume, Reduce Motion, dan Low Effects.
- Menu HP satu baris yang bisa digeser horizontal.
- Pemandangan memakai proporsi ilustrasi asli.
- Developer Mode sudah dihapus.

7. SAVE, BACKUP, DAN PEMINDAHAN PROGRES
--------------------------------------
Progres tersimpan otomatis di localStorage browser.
Format save tetap versi 8; save versi sebelumnya yang didukung
akan dinormalisasi ketika dimuat.

Membuat backup:
- Buka Settings > Export Save.
- Simpan file JSON hasil unduhan di tempat yang aman.

Memulihkan:
- Buka Settings > Import Save.
- Pilih file JSON hasil Export, lalu ikuti konfirmasi.
- Import mengganti progres yang sedang digunakan.

Backup diperlukan sebelum menghapus data browser, berpindah
perangkat, mengganti alamat hosting, atau memindahkan folder game.
Mode privat dan pembersihan data browser dapat menghilangkan save.
Progres tidak tersinkronisasi antarperangkat secara otomatis.

Jika save berubah di tab lain, game akan menampilkan konflik save.
Gunakan Reload Latest Save untuk memuat data terbaru.
Hindari memainkan save yang sama secara bersamaan di beberapa tab.

8. TIPS DAN PEMECAHAN MASALAH
-----------------------------
Tampilan belum berubah setelah pembaruan:
- Refresh halaman. Jika perlu, tutup tab lama lalu buka ulang.
- Jangan hapus data browser sebelum membuat backup.

Continue:
- Jika belum ada save, tombol masuk bertuliskan Mulai Bermain.
- Continue melanjutkan save lokal yang tersedia.
- New Game memulai ulang progres setelah konfirmasi bila ada save.

Auto Fish berhenti:
- Periksa stok umpan dan kapasitas Inventory.
- Pilih Tanpa Umpan jika stok habis.
- Jual atau pindahkan ikan sebelum mengaktifkan kembali.

Game pause:
- Kembali ke tab game dan pastikan menu utama sudah ditutup.

Animasi terasa berat:
- Aktifkan Low Effects atau Reduce Motion di Settings.

Audio tidak terdengar:
- Lakukan interaksi dengan game dan periksa Sound Effects/Volume.
- Periksa juga volume perangkat dan mute tab browser.

9. CATATAN RILIS
----------------
v1.0.0 menyatukan pembaruan visual map, karakter, ikan,
Fishdex, hasil tangkapan, tata letak HP, Auto Fish, Tanpa Umpan,
harga bait baru, dan perbaikan alur Continue.

Pengujian memakai browser desktop dengan simulasi viewport HP.
Hasil pada perangkat fisik dapat berbeda; simpan backup progres.

Selamat memancing!
