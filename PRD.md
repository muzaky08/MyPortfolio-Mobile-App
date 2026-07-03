# Product Requirement Document (PRD) (TypeScript Version) - MyPortfolio App

## 1. Ringkasan Proyek
MyPortfolio adalah aplikasi mobile profil pribadi (CV Digital) berbasis React Native dan Expo go SDK.54.0.8 Proyek ini ditujukan sebagai tugas akhir mata kuliah Pemrograman Mobile di Universitas Yatsi Madani (UYM).

## 2. Tujuan Aplikasi
- Memusatkan seluruh kontrol data (Input/CRUD) pada satu halaman pengaturan agar halaman utama tetap bersih dan rapi.
- Menyimpan data secara persisten dan offline menggunakan memori internal device via `AsyncStorage`.
- Menyediakan pengalaman pengguna yang modern dengan fitur Dark Mode lokal.

## 3. Spesifikasi Fitur & Alur Halaman

*Gunakan Splash Screen dengan menggunakan logo yang sudah ada MYP.png. dengan backgrund biru donker*

### F1: Autentikasi Login (LoginScreen.tsx)
- **Ketentuan:** Username dan Password divalidasi username menggunakan nomor **NIM** mahasiswa. password yang divalidasi seolah" fitur login profesional yang mempunyai ketentuan harus 8 karakter alphabet, hurup kapital dan kecil, dll

### F2: Halaman Utama (ProfileScreen.tsx - Read Only)
- **Deskripsi:** Menampilkan foto profil, Nama, Email (Link), Alamat, daftar Keahlian (Skills), Sosial media (Whatsapp, Instagram, Linkedin, Github) yang jika ditekan lama akan bisa menyalin yang berkaitan dengan link dan yang datanya bersumber dari input Halaman Settings.
- **Navigasi Pojok Kiri Atas:** Terdapat komponen Switch untuk mengaktifkan/menonaktifkan **Dark Mode** secara global (mengubah tema warna aplikasi menjadi gelap/terang).
- **Navigasi Pojok Kanan Atas:** Terdapat tombol **Hamburger Menu (Garis 3)** yang jika diklik akan menampilkan dropdown menu berisi pilihan:
  1. **Settings:** Mengarahkan user ke Halaman Settings (Pusat CRUD).
  2. **Logout:** Mengeluarkan user kembali ke Halaman Login.

### F3: Halaman Riwayat Pendidikan (EducationScreen.tsx - Read Only)
- **Deskripsi:** Menampilkan lini masa pendidikan secara berurutan: Sekolah Dasar (SD) -> Sekolah Menengah pertama (SMP) dan menengah atas (SMA) -> Kuliah di Universitas Yatsi Madani (sekarang).
- **Sifat Data:** Menampilkan hasil input/edit yang disubmit dari Halaman Settings.

### F4: Halaman Aktivitas Harian (ActivityScreen.tsx - Read Only)
- **Deskripsi:** Menampilkan daftar rutinitas per hari senin-minggu dalam bentuk Accordion/List.
- **Sifat Data:** Menampilkan hasil data yang dikelola dari Halaman Settings.

### F5: Halaman RecipeScreen (Recipe Screen- Read Only)
- **Deskripsi:** Integrasi hasil praktikum kelas berupa daftar resep kuliner yang dimuat dari dataset static array JSON lokal.
- **Interaktivitas:** Menampilkan gambar kuliner, nama resep, bahan-bahan, dan cara pembuatan menggunakan Modal bawaan React Native Paper saat item diklik.
- **Link dan fungsi DummyJson:** 
    const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://dummyjson.com/recipes");
      setRecipesList(response.data.recipes);
    } catch (error) {
      console.log("Error fetch all recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  **dan gunakan tags menu yang berkaitan diatas conten/dibawah header. dan jika diklik akan menampilkan detail menu > halaman [id.tsx] yang menampilkan gambar, nama menu, asal menu, timeminutes, ratting, bahan-bahan, petunjuk masak.**
### F6:Halaman id.tsx : Detail recipe
- **Deskripsi** : menampilkan detail recipe menu yang diklik pada halaman RecipeScreen.tsx. yang menampilkan gambar, nama menu, asal menu, timeminutes, ratting, bahan-bahan, petunjuk masak.

### F7: Halaman Pusat Pengaturan (Settings Screen - Pusat CRUD)
- **Deskripsi:** Halaman khusus tempat memanipulasi seluruh data aplikasi yang tersinkronisasi penuh dengan `AsyncStorage`.
- **Fitur CRUD di Dalam Settings:**
  - **CRUD Biodata:** Mengubah Nama, Email, Alamat, serta menambah/menghapus item keahlian (Skills), Link Sosial media.
  - **CRUD Pendidikan:** Mengubah nama sekolah/kampus dan tahun kelulusan untuk tingkat SD, Sekolah Menengah Pertama-Atas, dan Kuliah UYM.
  - **CRUD Aktivitas:** Menginput kegiatan baru atau menghapus kegiatan yang sudah ada dari daftar rutinitas.
- **Tombol Aksi:** Menyediakan tombol "SIMPAN SEMUA PERUBAHAN" untuk menyimpan seluruh modifikasi state ke memori internal secara permanen sebelum kembali ke halaman utama dan menampilkan pop up sederhana sebagai keterangan berhasil/gagal disimpan.


## 4. Kriteria Non-Fungsional & Batasan Proyek
- **Teknologi UI:** Memanfaatkan library komponen React Native Paper (Material Design).
- **Arsitektur Data:** Menggunakan `@react-native-async-storage/async-storage` untuk menjaga persistensi data agar tidak hilang saat aplikasi di-restart.
- **Estetika:** Skema warna dominan Biru Modern (`#0052cc`) dan Putih, dikombinasikan dengan aset motif batik putih samar pada background halaman Login dan Splash Screen.
-**KERAPIHAN** buat struktur folder dan file yang rapih dan mudah di baca, dimengerti, jelas.
-**Teknologi** React Native -Expo. Yang support via Expo go SDK.54.0.8!