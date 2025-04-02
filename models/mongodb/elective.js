const mongoose = require('mongoose');

const electiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    teacher: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Elective", electiveSchema); 