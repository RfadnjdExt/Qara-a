# Panduan Alur Testing - Qara-a (Mutabaah Online)

Dokumen ini menjelaskan alur pengujian untuk fitur **Absensi** dan **Input Hafalan** oleh Pengajar (Guru).

## 1. Persiapan Running
Pastikan server berjalan menggunakan Bun:
```bash
bun run dev
```
Akses di: `http://localhost:3000`

---

## 2. Alur Login (Guru)
1. Buka halaman Login.
2. Klik tombol **"Demo Credentials for Testing"**.
3. Pilih akun **Ustaz Muhammad Ali (Teacher/Guru)**.
4. Klik **Login**.

---

## 3. Alur Input Absensi (Fitur Baru)
1. Setelah login, pilih salah satu kelas di Dashboard Guru (misal: **Tahfidz Akhwat**).
2. Klik navigasi **Sesi Pembelajaran** di bagian atas (menggunakan Tabs).
3. Cari salah satu sesi yang ingin diisi absennya.
4. Klik tombol biru **"Absensi"**.
5. Pilih status kehadiran untuk setiap siswa:
   - **Hadir** (Default)
   - **Izin**
   - **Sakit**
   - **Alpa**
   - *Tips: Gunakan tombol "Mark All Hadir" untuk kecepatan.*
6. Klik **Simpan Absensi**.
7. Verifikasi muncul toast notifikasi sukses.
8. Perhatikan statistik **Kehadiran Rata-rata** di sidebar kiri akan langsung terupdate 100% akurat.

---

## 4. Alur Input Nilai Hafalan (Student Evaluation)
1. Tetap di tab **Sesi Pembelajaran**.
2. Cari sesi yang baru saja diisi absennya (atau sesi lainnya).
3. Klik tombol hijau **"Nilai"**.
4. Di dialog yang muncul:
   - Pilih tingkat kelancaran: **Lancar**, **Sedang**, atau **Kurang**.
   - Isi input **Hafalan**: Tentukan Surah/Ayat yang baru dihafal atau dimurojaah.
   - Isi nilai **Tajwid** (0-100).
   - Isi nilai **Tartil** (0-100).
   - Tambahkan **Catatan** jika perlu.
5. Klik **Simpan Evaluasi**.
6. Verifikasi notifikasi "Siswa berhasil dievaluasi".
7. Perhatikan statistik **Progress Hafalan** siswa tersebut akan berubah.

---

## 5. Troubleshooting (Jika Port 3000 Macet)
Jika muncul error `Port 3000 is in use`, jalankan perintah berikut di terminal:
```powershell
# Temukan PID process di port 3000
netstat -ano | findstr :3000
# Matikan process (ganti PID dengan angka yang muncul)
taskkill /F /PID <PID_ANGKA>
# Jalankan kembali
bun run dev
```

---

## 6. Verifikasi Akhir
Buka tab **Statistik Kelas** atau **Data Murid** untuk memastikan semua data tersimpan secara permanen di database Supabase.
