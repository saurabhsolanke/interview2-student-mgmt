const Student = require('../models/mysql/student');

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('electives');
        res.render('students/index', { students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, age, address, gender, electives } = req.body;
        const electivesArray = Array.isArray(electives) ? electives : [electives];
        const newStudent = new Student({ name, age, address, gender, electives: electivesArray });
        await newStudent.save();
        res.redirect("/students");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};