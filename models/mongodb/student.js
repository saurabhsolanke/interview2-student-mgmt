const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    electives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Elective' }],
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema); 