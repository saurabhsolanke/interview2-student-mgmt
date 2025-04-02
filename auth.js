// const express = require('express');
// const bcrypt = require('bcrypt');
// const mysql = require('mysql2');
// const router = express.Router();
// const app = express();
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'blahblahblah';;

// // Create MySQL connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
// });

// router.post('/register', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
//         db.query(query, [name, email, hashedPassword], (err, result) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return res.status(500).json({ error: 'Error registering user' });
//             }
//             res.status(201).json({ message: 'User registered successfully' });
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Error registering user' });
//     }
// });

// router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     const query = 'SELECT * FROM users WHERE email = ?';
//     db.query(query, [email], async (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ error: 'Database error' });
//         }

//         if (results.length > 0) {
//             const user = results[0];
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (isMatch) {
//                 const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//                 return res.status(200).json({ success: true, token});
//             } else {
//                 return res.status(401).json({ error: 'Invalid credentials' });
//             }
//         } else {
//             res.status(404).send('User not found');
//         }
//     })
// })

// module.exports = router;