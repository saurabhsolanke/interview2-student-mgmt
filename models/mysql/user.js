const { mysqlConnection } = require('../../config/database');

class User {
    static async create(userData) {
        const { name, email, password } = userData;
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        console.log('Checking email:', email);
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [name, email, password], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [email], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = User; 