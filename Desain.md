# UI/UX Layout Design Blueprint, Clean, Modern & Propfesional - MyPortfolio App

Dokumen ini berisi spesifikasi arsitektur komponen UI, struktur tata letak (Layouting Flexbox), dan daftar komponen React Native Paper yang wajib diimplementasikan untuk mendukung sistem manajemen data terpusat.

---

## 1. Halaman Login (LoginScreen.tsx)
Halaman pertama untuk validasi autentikasi username NIM : *23050951*.
berikan kriteria untuk sandi seolah olah fitur login yang profesional, seperti harus 8 karakter, alphabet, dan berikan keterangan merah jika tidak sesuai.

### Struktur Komponen & Layout UI:
- **Root Container:** `<ImageBackground source={require('./assets/images/bg-batik-biru.png')} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>`
- **Form Wrapper:** `<Card style={{ padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.93)', elevation: 5 }}>`
  - **Logo:** `<Avatar.Image size={100} source={require('./assets/images/MYP.png')} style={{ alignSelf: 'center', marginBottom: 20 }} />`
  - **Title:** `<Title style={{ textAlign: 'center', fontWeight: 'bold', color: '#0052cc', marginBottom: 20 }}>MyPortfolio</Title>`
  - **Inputs:**
    - `<TextInput mode="outlined" label="Username (NIM)" value={username} onChangeText={setUsername} style={{ marginBottom: 15 }} left={<TextInput.Icon icon="account" />} />`
    - `<TextInput mode="outlined" label="Password (NIM)" secureTextEntry value={password} onChangeText={setPassword} style={{ marginBottom: 20 }} left={<TextInput.Icon icon="lock" />} />`
  - **Button:** `<Button mode="contained" onPress={handleLogin} buttonColor="#0052cc">LOGIN</Button>`

---

## 2. Halaman Profil Utama (ProfileScreen.tsx)
Menampilkan data profil hasil input dari Settings. Memiliki Appbar khusus di bagian paling atas untuk menampung fitur *Dark Mode* dan *Hamburger Menu*.

### Struktur Komponen & Layout UI:
- **Header Appbar (Navigasi & Fitur Pojok):**
  - `<Appbar.Header style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#0052cc', justifyContent: 'space-between' }}>`
    - **Pojok Kiri (Dark Mode):** - `<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>`
        - `<IconButton icon={isDarkMode ? "weather-night" : "weather-sunny"} iconColor="white" />`
        - `<Switch value={isDarkMode} onValueChange={toggleDarkMode} color="white" />`
      - `</View>`
    - **Pojok Kanan (Hamburger Menu Dropdown):**
      - `<Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={<IconButton icon="menu" iconColor="white" onPress={() => setMenuVisible(true)} />}>`
        - `<Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Settings'); }} title="Settings (CRUD)" leadingIcon="cog" />`
        - `<Menu.Item onPress={handleLogout} title="Logout" leadingIcon="logout" textStyle={{ color: 'red' }} />`
      - `</Menu>`
- **Header dengan safe area header disemua halaman agar tidak bentrok dengan bar atas dihandphone**
- **Body Scroll Container:** `<ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }} contentContainerStyle={{ padding: 15 }}>`
  - **Card Profile (Read-Only):**
    - `<Card style={{ padding: 20, alignItems: 'center', marginBottom: 15 }}>`
      - `<Avatar.Image size={120} source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} style={{ marginBottom: 10 }} />`
      - `<Title style={{ fontWeight: 'bold' }}>{profileData.name}</Title>`
      - `<Paragraph style={{ color: 'grey' }}>{profileData.email}</Paragraph>`
      - `<Paragraph style={{ textAlign: 'center', marginTop: 5 }}>{profileData.address}</Paragraph>`
    - `</Card>`
  - **Card Skills (Read-Only):**
    - `<Card>`
      - `<Card.Title title="Keahlian / Skills" left={(props) => <List.Icon {...props} icon="star" color="#0052cc" />} />`
      - `<Card.Content style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>`
        - Looping item skill: `<Chip style={{ margin: 2 }}>{skill}</Chip>`
      - `</Card.Content>`
    - `</Card>`

---

## 3. Halaman Settings / Pusat CRUD (SettingsScreen.tsx)
Halaman khusus tempat memanipulasi seluruh data aplikasi yang tersinkronisasi penuh dengan `AsyncStorage`.

### Struktur Komponen & Layout UI:
- **Root Container:** `<ScrollView style={{ flex: 1, padding: 15, backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }}>`
- **SECTION 1: CRUD BIODATA & SKILLS**
  - `<List.Section title="Edit Biodata & Keahlian">`
    - `<TextInput mode="outlined" label="Nama Lengkap" value={editProfile.name} onChangeText={(txt) => setEditProfile({...editProfile, name: txt})} style={{ marginBottom: 10 }} />`
    - `<TextInput mode="outlined" label="Email" value={editProfile.email} onChangeText={(txt) => setEditProfile({...editProfile, email: txt})} style={{ marginBottom: 10 }} />`
    - `<TextInput mode="outlined" label="Alamat" value={editProfile.address} onChangeText={(txt) => setEditProfile({...editProfile, address: txt})} style={{ marginBottom: 10 }} multiline />`
    - **Manage Skills (Add/Delete):**
      - `<View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>`
        - `<TextInput mode="outlined" label="Tambah Skill Baru" value={newSkill} onChangeText={setNewSkill} style={{ flex: 1 }} />`
        - `<Button mode="contained" onPress={handleAddSkill} buttonColor="#0052cc">Add</Button>`
      - `</View>`
      - `<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>`
        - Looping chip skill yang bisa dihapus: `<Chip onClose={() => handleRemoveSkill(index)} style={{ margin: 2 }}>{skill}</Chip>`
      - `</View>`
- **SECTION 2: CRUD RIWAYAT PENDIDIKAN**
  - `<List.Section title="Edit Riwayat Pendidikan">`
    - Looping Form untuk SD, SMP/SMA, Kuliah UYM:
    - `<Card style={{ padding: 10, marginBottom: 10 }}>`
      - `<Subheading style={{ fontWeight: 'bold' }}>{edu.level}</Subheading>`
      - `<TextInput mode="outlined" label="Nama Sekolah/Kampus" value={edu.schoolName} onChangeText={(txt) => handleUpdateEdu(index, 'schoolName', txt)} style={{ marginBottom: 5 }} />`
      - `<TextInput mode="outlined" label="Tahun Pendidikan" value={edu.years} onChangeText={(txt) => handleUpdateEdu(index, 'years', txt)} />`
    - `</Card>`
- **SECTION 3: CRUD AKTIVITAS HARIAN**
  - `<List.Section title="Kelola Aktivitas Harian">`
    - `<View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>`
      - `<TextInput mode="outlined" label="Input Aktivitas Baru..." value={newActivity} onChangeText={setNewActivity} style={{ flex: 1 }} />`
      - `<IconButton icon="plus-box" size={35} iconColor="#0052cc" onPress={handleAddingActivity} />`
    - `</View>`
    - Looping item list aktivitas saat ini dengan tombol hapus:
      - `<List.Item title={act.task} right={props => <IconButton icon="delete" iconColor="red" onPress={() => handleRemovingActivity(act.id)} />} />`
- **PENGANCU AKSI GLOBAL:**
  - `<Button mode="contained" icon="content-save" onPress={handleSaveAllChanges} buttonColor="green" style={{ marginVertical: 30, paddingVertical: 5 }}>SIMPAN SEMUA PERUBAHAN</Button>`

---

## 4. Halaman Riwayat Pendidikan (EducationScreen.js)
Tab kedua setelah login. Menampilkan timeline data pendidikan secara berurutan dari sd -smp-sma-s1 (Read-Only) hasil dari input Settings.

### Struktur Komponen & Layout UI:
- **Root Container:** `<ScrollView style={{ flex: 1, padding: 15 }}>`
- **Timeline Loop:** Looping array data pendidikan dari state/AsyncStorage ke dalam komponen Card Paper:
  - `<Card style={{ marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#0052cc' }}>`
    - `<Card.Title title={edu.schoolName} subtitle={edu.years} left={(props) => <List.Icon {...props} icon="school" color="#0052cc" />} />`
    - `<Card.Content><Paragraph>{edu.level} - {edu.location}</Paragraph></Card.Content>`
  - `</Card>`

---

## 5. Halaman Aktivitas Harian (ActivityScreen.tsx)
Tab ketiga setelah login. Menampilkan daftar rutinitas kegiatan per hari senin-minggu(Read-Only) hasil dari input Settings.

### Struktur Komponen & Layout UI:
- **Root Container:** `<ScrollView style={{ flex: 1, padding: 15 }}>`
- `<List.Section>`
  - `<List.Accordion title="Jadwal Rutinitas Saya" left={props => <List.Icon {...props} icon="calendar-clock" color="#0052cc" />}>`
    - Looping item aktivitas secara clean: `<List.Item title={activity.task} left={props => <List.Icon {...props} icon="circle-small" />} />`
  - `</List.Accordion>`

---

## 6. Halaman Recipe (RecipeScreen.tsx)
Tab keempat setelah login. Menampilkan daftar resep masakan praktikum berbasis dataset dummyJSON (Read-Only).

### Struktur Komponen & Layout UI:
- **Root Container:** `<FlatList data={recipeData} contentContainerStyle={{ padding: 15 }} ... />`
- **Card Item:** `<Card style={{ marginBottom: 15 }} onPress={() => handleOpenDetail(item)}>`
  - `<Card.Cover source={{ uri: item.imageUrl }} />`
  - `<Card.Title title={item.title} subtitle={item.description} />`
- **Modal Detail:** Menggunakan `<Portal>` -> `<Modal>` untuk menampilkan bahan-bahan dan langkah pembuatan resep secara detail dan interaktif saat card diklik.