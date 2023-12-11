const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nama_database'
});

// Mendapatkan daftar santri
app.get('/santri', (req, res) => {
  db.query('SELECT * FROM santri', (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Gagal mendapatkan data santri.' });
    } else {
      res.send(results);
    }
  });
});

// Input absensi
app.post('/absen', (req, res) => {
  const { id_santri, tanggal, waktu_absen, keterangan } = req.body;

  if (!id_santri || !tanggal || !waktu_absen || !keterangan) {
    return res.status(400).send({ error: 'Semua kolom harus diisi.' });
  }

  db.query(
    'INSERT INTO absensi_santri (id_santri, tanggal, waktu_absen, keterangan) VALUES (?, ?, ?, ?)',
    [id_santri, tanggal, waktu_absen, keterangan],
    (err, result) => {
      if (err) {
        console.error('Error saat menyimpan data absensi:', err);
        res.status(500).send({ error: 'Gagal menyimpan data absensi.' });
      } else {
        console.log('Data absensi berhasil disimpan:', result);
        res.send({ message: 'Data absensi berhasil disimpan.' });
      }
    }
  );
});

// Login guru
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username dan password harus diisi.' });
  }

  db.query(
    'SELECT * FROM guru_login WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Error saat melakukan login guru:', err);
        res.status(500).send({ error: 'Gagal melakukan login guru.' });
      } else {
        if (results.length > 0) {
          res.send({ message: 'Login guru berhasil.' });
        } else {
          res.status(401).send({ error: 'Username atau password salah.' });
        }
      }
    }
  );
});

// Fetch all data from absensi_santri
app.get('/absensi', (req, res) => {
  db.query('SELECT * FROM absensi_santri', (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Gagal mendapatkan data absensi santri.' });
    } else {
      res.send(results);
    }
  });
});



// Tambah santri
app.post('/tambah-santri', (req, res) => {
  const { nama, kelas } = req.body;

  if (!nama || !kelas) {
    return res.status(400).send({ error: 'Nama dan kelas santri harus diisi.' });
  }

  db.query(
    'INSERT INTO santri (nama, kelas) VALUES (?, ?)',
    [nama, kelas],
    (err, result) => {
      if (err) {
        console.error('Error saat menambah data santri:', err);
        res.status(500).send({ error: 'Gagal menambah data santri.' });
      } else {
        console.log('Data santri berhasil ditambahkan:', result);
        res.send({ message: 'Data santri berhasil ditambahkan.' });
      }
    }
  );
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
