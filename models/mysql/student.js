const { mysqlConnection } = require('../../config/database');

class Student {
    static async create(studentData) {
        const { name, age, address, gender } = studentData;
        const query = 'INSERT INTO students (name, age, address, gender) VALUES (?, ?, ?, ?)';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [name, age, address, gender], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async findAll() {
        const query = `
            SELECT 
                s.*,
                GROUP_CONCAT(DISTINCT e.name ORDER BY e.name ASC SEPARATOR ', ') as elective_names,
                GROUP_CONCAT(DISTINCT e.id ORDER BY e.id ASC SEPARATOR ',') as elective_ids
            FROM students s 
            LEFT JOIN student_electives se ON s.id = se.student_id 
            LEFT JOIN electives e ON se.elective_id = e.id 
            GROUP BY s.id
        `;
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, results) => {
                if (err) reject(err);
                // Process the results to split elective_ids into an array
                results = results.map(student => ({
                    ...student,
                    elective_ids: student.elective_ids ? student.elective_ids.split(',') : [],
                    elective_names: student.elective_names || 'No electives'
                }));
                resolve(results);
            });
        });
    }

    static async findById(id) {
        const query = `
            SELECT 
                s.*,
                GROUP_CONCAT(DISTINCT e.name ORDER BY e.name ASC SEPARATOR ', ') as elective_names,
                GROUP_CONCAT(DISTINCT e.id ORDER BY e.id ASC SEPARATOR ',') as elective_ids
            FROM students s 
            LEFT JOIN student_electives se ON s.id = se.student_id 
            LEFT JOIN electives e ON se.elective_id = e.id 
            WHERE s.id = ?
            GROUP BY s.id
        `;
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [id], (err, results) => {
                if (err) reject(err);
                if (results.length > 0) {
                    results[0].elective_ids = results[0].elective_ids ? 
                        results[0].elective_ids.split(',') : [];
                }
                resolve(results[0]);
            });
        });
    }

    static async update(id, studentData) {
        const { name, age, address, gender } = studentData;
        const query = 'UPDATE students SET name = ?, age = ?, address = ?, gender = ? WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [name, age, address, gender, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async delete(id) {
        const query = 'DELETE FROM students WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async addElective(studentId, electiveId) {
        const query = 'INSERT INTO student_electives (student_id, elective_id) VALUES (?, ?)';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, [studentId, electiveId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async updateElectives(studentId, electiveIds) {
        // First, delete existing electives for this student
        const deleteQuery = 'DELETE FROM student_electives WHERE student_id = ?';
        
        // Then insert new electives
        const insertQuery = 'INSERT INTO student_electives (student_id, elective_id) VALUES ?';
        
        return new Promise((resolve, reject) => {
            mysqlConnection.beginTransaction(async (err) => {
                if (err) {
                    return reject(err);
                }
                
                try {
                    // Delete existing electives
                    await new Promise((res, rej) => {
                        mysqlConnection.query(deleteQuery, [studentId], (err) => {
                            if (err) rej(err);
                            res();
                        });
                    });
                    
                    // Insert new electives if any are provided
                    if (electiveIds && electiveIds.length > 0) {
                        const values = electiveIds.map(id => [studentId, id]);
                        await new Promise((res, rej) => {
                            mysqlConnection.query(insertQuery, [values], (err) => {
                                if (err) rej(err);
                                res();
                            });
                        });
                    }
                    
                    mysqlConnection.commit((err) => {
                        if (err) {
                            return mysqlConnection.rollback(() => reject(err));
                        }
                        resolve();
                    });
                } catch (error) {
                    return mysqlConnection.rollback(() => reject(error));
                }
            });
        });
    }
}

module.exports = Student; 