const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("connection error", err);
})

app.get('/', (req, res) => {
    res.render('index');
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    electives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Elective' }],
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

app.post("/students/add", async (req, res) => {
    try {
        const { name, age, address, gender, electives } = req.body;
        const electivesArray = Array.isArray(electives) ? electives : [electives];
        const newStudent = new Student({name, age, address, gender, electives: electivesArray });
        await newStudent.save();
        res.redirect("/students");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/students", async (req, res) => {
    try {
        // res.setHeader('Content-Type', 'application/json');
        // res.status(200).json(students);
        const students = await Student.find().populate('electives');
        const electives = await Elective.find();
        res.render('students', { students, electives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('electives');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const { name, age, address, gender, electives } = req.body;
        const electivesArray = Array.isArray(electives) ? electives : [electives];
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            { name, age, address, gender, electives: electivesArray },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/students/delete/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const electiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    teacher: { type: String, required: true },
}, { timestamps: true });

const Elective = mongoose.model("Elective", electiveSchema);

app.post("/electives/add", async (req, res) => {
    try {
        const { name, credits, teacher } = req.body;
        const newStudent = new Elective({ name, credits, teacher });
        await newStudent.save();
        res.redirect("/electives");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/electives", async (req, res) => {
    try {
        const electives = await Elective.find();
        // res.setHeader('Content-Type', 'application/json');
        // res.status(200).json(students);
        res.render('electives', { electives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/electives/:id", async (req, res) => {
    try {
        const elective = await Elective.findById(req.params.id);
        if (!elective) return res.status(404).json({ message: "Elective not found" });
        res.status(200).json(elective);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/electives/:id", async (req, res) => {
    try {
        const updatedStudent = await Elective.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Elective not found" });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/electives/delete/:id", async (req, res) => {
    try {
        const deletedStudent = await Elective.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: "Elective not found" });
        res.status(200).json({ message: "Elective deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`****** Server is running on port ${process.env.PORT} ******* `)
});