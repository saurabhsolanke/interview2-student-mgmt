const express = require('express');
const router = express.Router();
const Elective = require('../models/mysql/elective');

router.get('/', async (req, res) => {
    try {
        const electives = await Elective.findAll();
        res.render('electives', { electives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const elective = await Elective.findById(req.params.id);
        if (!elective) {
            return res.status(404).json({ error: 'Elective not found' });
        }
        res.json(elective);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, credits, teacher } = req.body;
        console.log("****************", req.body);
        await Elective.create({ name, credits, teacher });
        res.redirect("/electives");
    } catch (error) {
        console.error('Error creating elective:', error);
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, credits, teacher } = req.body;
        await Elective.update(req.params.id, { name, credits, teacher });
        res.json({ message: 'Elective updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Elective.delete(req.params.id);
        res.json({ message: 'Elective deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
