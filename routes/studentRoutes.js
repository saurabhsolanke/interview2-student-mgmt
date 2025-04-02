const express = require('express');
const router = express.Router();
const Student = require('../models/mysql/student');
const Elective = require('../models/mysql/elective');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.findAll();
        const electives = await Elective.findAll();
        res.render('students', { students, electives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add student
router.post('/add', async (req, res) => {
    try {
        const { name, age, address, gender, electives } = req.body;
        // Create student first
        const newStudent = await Student.create({ name, age, address, gender });
        
        // If electives are provided, add them
        if (electives) {
            const electiveIds = Array.isArray(electives) ? electives : [electives];
            for (const electiveId of electiveIds) {
                await Student.addElective(newStudent.insertId, electiveId);
            }
        }
        
        res.redirect("/students");
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student
router.put('/:id', async (req, res) => {
    try {
        const { name, age, address, gender, electives } = req.body;
        await Student.update(req.params.id, { name, age, address, gender });
        
        if (electives) {
            await Student.updateElectives(req.params.id, electives);
        }
        
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete student
router.delete('/delete/:id', async (req, res) => {
    try {
        await Student.delete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
