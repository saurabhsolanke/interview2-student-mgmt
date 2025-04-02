const Elective = require('../models/mysql/elective');

exports.getAllElective = async (req, res) => {
    try {
        const electives = await Elective.findAll();
        res.render('electives/index', { electives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createElective = async (req, res) => {
    try {
        const { name, credits, teacher } = req.body;
        console.log("+++++++++++++", req.body);
        const newElective = await Elective.create({ name, credits, teacher });
        res.redirect("/electives");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};