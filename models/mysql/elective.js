const { mysqlConnection } = require('../../config/database');

class Elective {
    static async create(electiveData) {
        const { name, credits, teacher } = electiveData;
        const query = 'INSERT INTO electives (name, credits, teacher) VALUES (?, ?, ?)';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [name, credits, teacher], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async findAll() {
        const query = 'SELECT * FROM electives';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async findById(id) {
        const query = 'SELECT * FROM electives WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async update(id, electiveData) {
        const { name, credits, teacher } = electiveData;
        const query = 'UPDATE electives SET name = ?, credits = ?, teacher = ? WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [name, credits, teacher, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async delete(id) {
        const query = 'DELETE FROM electives WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async getStudents(electiveId) {
        const query = `
            SELECT s.* 
            FROM students s 
            JOIN student_electives se ON s.id = se.student_id 
            WHERE se.elective_id = ?
        `;
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [electiveId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = Elective; 