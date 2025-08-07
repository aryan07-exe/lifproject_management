const express = require('express');
const router = express.Router();
const Manpower = require('../models/Manpower');

// Get all manpowers
router.get('/', async (req, res) => {
  try {
    const manpowers = await Manpower.find();
    res.json(manpowers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new manpower
router.post('/', async (req, res) => {
  try {
    const manpower = new Manpower(req.body);
    const savedManpower = await manpower.save();
    res.status(201).json(savedManpower);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit a manpower
router.put('/:id', async (req, res) => {
  try {
    const updatedManpower = await Manpower.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedManpower) return res.status(404).json({ message: 'Manpower not found' });
    res.json(updatedManpower);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove a manpower
router.delete('/:id', async (req, res) => {
  try {
    const deletedManpower = await Manpower.findByIdAndDelete(req.params.id);
    if (!deletedManpower) return res.status(404).json({ message: 'Manpower not found' });
    res.json({ message: 'Manpower deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
